import { OnReceiveDelegate } from "./types/channel";
import { Channel } from './channels/channel';
import { CancellationTokenSource, window } from "vscode";
import retryCallback from "./retry-callback";

export class ChannelCollection {
  private channels: Channel[] = [];
  private intervals: NodeJS.Timer[] = [];
  private showProgressMessage: (interval: number, retriesLeft: number) => Promise<void>;

  constructor(channels: Channel[]) {
    this.channels = channels;
    this.showProgressMessage = retryCallback(new CancellationTokenSource());
  }

  listen(onReceive: OnReceiveDelegate) {
    this.intervals = this.channels.map(channel => {
      return channel.listen(onReceive, async (error, callback) => {
        this.stop();

        const ok = await this.retry(3, callback);
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
  }

  private async retry(retryCount: number, callback: () => Promise<void>): Promise<boolean> {
    if(retryCount === 0) {
      return false;
    }

    await this.showProgressMessage(5000, 3 - (retryCount - 1));
    
    try {
      await callback();      
      return true;
    } catch (error) {
      console.error(error);
      return await this.retry(--retryCount, callback);
    }
  }
}
