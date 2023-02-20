import * as vscode from "vscode";
import { ChannelOptions, OnReceiveDelegate } from "./types/channel";
import { Channel } from './channels/channel';
import { CancellationTokenSource, Disposable, window } from "vscode";
import { COMMANDS, defaultChannelOptions } from "./constants";
import showProgressMessage from "./show-progress-message";

const { registerCommand } = vscode.commands;
export class ChannelCollection {
  private channels: Channel[] = [];
  private commands: Disposable[] = [];
  private intervals: NodeJS.Timer[] = [];
  private retryToken: CancellationTokenSource;
  private cancelToken: CancellationTokenSource;
  private options: ChannelOptions | undefined;

  constructor(commands: Disposable[], channels: Channel[], options?: ChannelOptions) {
    this.channels = channels;
    this.options = options || defaultChannelOptions;
    this.retryToken = new CancellationTokenSource();
    this.cancelToken = new CancellationTokenSource();

    commands.push(registerCommand(COMMANDS.CANCEL, () => {
      this.cancelToken.cancel();
      this.cancelToken = new CancellationTokenSource();
    }));

    commands.push(registerCommand(COMMANDS.RETRY, () => {
      this.retryToken.cancel();
      this.retryToken = new CancellationTokenSource();
    }));
  }

  listen(onReceive: OnReceiveDelegate) {
    this.intervals = this.channels.map(channel => {
      return channel.listen(onReceive, async (error, callback) => {
        this.stop();

        const ok = await this.retry(this.options.retryCount, callback);
        if(ok) {
          this.listen(onReceive);
        } else {
          window.showErrorMessage(
            'Could not connect to remote server: ' + error.message);
        }
      });
    });
  }

  stop() {
    this.intervals.forEach(clearInterval);
    this.commands.forEach(command => command.dispose());
  }

  private async retry(retryCount: number, callback: () => Promise<void>): Promise<boolean> {
    if(retryCount === 0) {
      return false;
    }

    const proceed = await showProgressMessage(
      this.options?.retryInterval, 
      this.options.retryCount - (retryCount - 1), 
      this.cancelToken.token, 
      this.retryToken.token);
    
    if(!proceed) {
      return false;
    }

    try {
      await callback();      
      return true;
    } catch (error) {
      console.error(error);
      return await this.retry(--retryCount, callback);
    }
  }
}
