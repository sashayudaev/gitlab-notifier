export type MessageType = 
    'directly_addressed' 
  | 'assigned' 
  | 'build_failed'
  | 'mentioned'
  | 'approved'
  | 'approval_required'
  | 'commented';

export type Message = {
  id: number;
  type: MessageType;
  text: string;
  sender: string;
  targetUrl?: string;
};

export type OnReceiveDelegate = (message: Message) => void;

export interface ChannelOptions {
  fetchInterval: number;
}