import { window } from 'vscode';
import { defaultChannelOptions, defaultFetchOptions } from "../constants";
import { FetchOptions } from "../fetch";
import { ChannelOptions, Message, OnErrorDelegate, OnReceiveDelegate } from "../types/channel";

export abstract class Channel {
  fetchOptions: FetchOptions;
  channelOptions: ChannelOptions;
  
  constructor(channelOptions?: ChannelOptions, fetchOptions?: FetchOptions) {
    this.fetchOptions = fetchOptions ?? defaultFetchOptions;
    this.channelOptions = channelOptions ?? defaultChannelOptions;
  }

  protected abstract fetch(): Promise<Message[] | undefined>;
  
  listen(onReceive: OnReceiveDelegate, onError: OnErrorDelegate): NodeJS.Timer {
    const receiveMessages = async () => {
      const messages = await this.fetch();        
      messages?.forEach(onReceive);
    };

    return setInterval(() => {
      try {
        return receiveMessages();
      } catch (error: any) {
        if(error.type !== 'AbortError') {
          onError(error, receiveMessages);
        }
      }
    }, this.channelOptions.fetchInterval);
  }
}

