import { OnReceiveDelegate } from "./types/channel";
import { Channel } from './channels/channel';
import { window } from "vscode";

export class ChannelCollection {
  private channels: Channel[] = [];
  private intervals: NodeJS.Timer[] = [];

  constructor(channels: Channel[]) {
    this.channels = channels;
  }

  listen(onReceive: OnReceiveDelegate) {
    this.intervals = this.channels.map(channel => {
      return channel.listen(onReceive, error => {
        this.stop();
        window.showErrorMessage('Could not connect to remote server: ' + error.message);
      });
    });
  }

  stop() {
    this.intervals.forEach(clearInterval);
  }
}
