import { MessageStore } from "./message-store";
import { ChannelOptions } from "./types/channel";
import { FetchOptions } from "./fetch";
import MergeRequestChannel from './channels/merge-request-channel';
import { WorkspaceConfiguration, CancellationTokenSource, commands, workspace } from 'vscode';
import retryCallback from "./retry-callback";
import { COMMANDS, defaultChannelOptions, defaultFetchOptions } from "./constants";
import { ChannelCollection } from "./channel-collection";

let channels: ChannelCollection;
export async function activate() {
	const cancellationToken = new CancellationTokenSource();
	const configuration: WorkspaceConfiguration = workspace.getConfiguration('gitlabNotifier');
	
	commands.registerCommand(COMMANDS.CANCEL, () => {
		cancellationToken?.cancel();
	});

	const channelOptions: ChannelOptions = {
		fetchInterval: configuration.get<number>('interval') || defaultChannelOptions.fetchInterval,
	};
	const fetchOptions: FetchOptions =  {
		url: configuration.get<string>('url') || defaultFetchOptions.url,
		token: configuration.get<string>('privateToken') || defaultFetchOptions.token,
		retryCount: 1, 
		retryDelay: 5000, 
		retryCallback: retryCallback(cancellationToken)
	};

	const username = configuration.get<string>('username');
	if(!username) {
		throw new Error('You should configure username in settings first');
	}
	
	channels = new ChannelCollection([
		new MergeRequestChannel(username, channelOptions, fetchOptions)
	]);
	
	const store = new MessageStore(username);
	channels.listen(message => store.onReceive(message));
}

export function deactivate() {
	channels.stop();
}
