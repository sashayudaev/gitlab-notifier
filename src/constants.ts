/* eslint-disable @typescript-eslint/naming-convention */
import { FetchOptions } from "./fetch";
import { ChannelOptions, MessageType } from "./types/channel";

export const defaultChannelOptions: ChannelOptions = {
  fetchInterval: 5000
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
  RETRY: 'retryCommand',
  CANCEL: 'cancelCommand'
};

export const MESSAGE_TYPE: Record<string, MessageType> = {
  ASSIGNED: 'assigned',
  APPROVED: 'approved',
  COMMENTED: 'commented',
  ADDRESSED: 'directly_addressed',
  BUILD_FAILED: 'build_failed',
  MENTIONED: 'mentioned',
  APPROVAL_REQUIRED: 'approval_required',
};