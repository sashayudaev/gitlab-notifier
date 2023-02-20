/* eslint-disable @typescript-eslint/naming-convention */
import { ChannelOptions, MessageType } from "./types/channel";
import { FetchOptions } from "./types/fetch";

export const defaultChannelOptions: ChannelOptions = {
  retryCount: 3,
  retryInterval: 5000,
  fetchInterval: 300000
};

export const defaultFetchOptions: FetchOptions = {
  url: 'https://gitlab.com',
  token: '',
};

export const SETTINGS = {
  URL: "url",
  PRIVATE_TOKEN: "privateToken",
};

export const COMMANDS = {
  WAIT: 'gitlabNotifier.waitCommand',
  RETRY: 'gitlabNotifier.retryCommand',
  CANCEL: 'gitlabNotifier.cancelCommand'
};

export const MESSAGE_TYPE: Record<string, MessageType> = {
  ASSIGNED: 'assigned',
  APPROVED: 'approved',
  COMMENTED: 'commented',
  SUGGESTED: 'suggested',
  ADDRESSED: 'directly_addressed',
  BUILD_FAILED: 'build_failed',
  MENTIONED: 'mentioned',
  COMMITED: 'committed',
  APPROVAL_REQUIRED: 'approval_required',
};