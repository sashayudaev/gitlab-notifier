export type MessageType = 
    'directly_addressed' 
  | 'assigned' 
  | 'build_failed'
  | 'mentioned'
  | 'committed'
  | 'approved'
  | 'approval_required'
  | 'commented'
  | 'suggested';

export type Message = {
  id: number;
  type: MessageType;
  text: string;
  sender: string;
  targetUrl?: string;
};

export type OnReceiveDelegate = (message: Message) => void;
export type OnErrorDelegate = (error: any, callback: () => Promise<void>) => void;
export interface ChannelOptions {
  retryCount: number;
  retryInterval: number;
  fetchInterval: number;
}