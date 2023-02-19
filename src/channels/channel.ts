import * as vscode from 'vscode';
import { defaultChannelOptions, defaultFetchOptions } from "../constants";
import { FetchOptions } from "../fetch";
import { ChannelOptions, Message, OnReceiveDelegate } from "../types/channel";

export abstract class Channel {
  fetchOptions: FetchOptions;
  channelOptions: ChannelOptions;
  
  constructor(channelOptions?: ChannelOptions, fetchOptions?: FetchOptions) {
    this.fetchOptions = fetchOptions || defaultFetchOptions;
    this.channelOptions = channelOptions ?? defaultChannelOptions;
  }

  protected abstract fetch(): Promise<Message[] | undefined>;

  configure(): Promise<void> {
    return Promise.resolve();
  }
  
  poll(onReceive: OnReceiveDelegate): NodeJS.Timer {
    return setInterval(async () => {
      try {
        const messages = await this.fetch();        
        messages?.forEach(onReceive);
      } catch (error: any) {
        if(error.type !== 'AbortError') {
          console.error(error);
          await vscode.window.showErrorMessage('Could not connect to remote server');
          throw new Error(error);
        }
      }
    }, this.channelOptions.fetchInterval);
  }
}