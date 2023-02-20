import { MessageStore } from "./message-store";
import { ChannelOptions } from "./types/channel";
import MergeRequestChannel from './channels/merge-request-channel';
import { WorkspaceConfiguration, workspace, ExtensionContext } from 'vscode';
import { defaultChannelOptions, defaultFetchOptions } from "./constants";
import { ChannelCollection } from "./channel-collection";
import { FetchOptions } from "./types/fetch";
import { abortController } from "./show-progress-message";
let channels: ChannelCollection;
export async function activate(context: ExtensionContext) {
	const configuration: WorkspaceConfiguration = workspace.getConfiguration('gitlabNotifier');

	const channelOptions: ChannelOptions = {
		retryCount: 3,
		retryInterval: 5000,
		fetchInterval: configuration.get<number>('interval') || defaultChannelOptions.fetchInterval,
	};
	const fetchOptions: FetchOptions =  {
		url: configuration.get<string>('url') || defaultFetchOptions.url,
		token: configuration.get<string>('privateToken') || defaultFetchOptions.token,
		signal: abortController.signal
	};

	const username = configuration.get<string>('username');
	if(!username) {
		throw new Error('You should configure username in settings first');
	}
	
	channels = new ChannelCollection(context.subscriptions, [
		new MergeRequestChannel(username, channelOptions, fetchOptions)
	], channelOptions);
	
	const store = new MessageStore(username);
	channels.listen(message => store.onReceive(message));
}

export function deactivate() {
	channels.stop();
}