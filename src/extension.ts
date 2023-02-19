import { MessageStore } from "./message-store";
import { Channel } from "./channels/channel";
import { ChannelOptions } from "./types/channel";
import { FetchOptions } from "./fetch";
import MergeRequestChannel from './channels/merge-request-channel';
import { WorkspaceConfiguration, CancellationTokenSource, commands, workspace } from 'vscode';
import retryCallback from "./retry-callback";
import { COMMANDS, defaultChannelOptions, defaultFetchOptions } from "./constants";


let intervals: NodeJS.Timer[];

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
	
	const store = new MessageStore(username);
	const channels: Channel[] = [
		new MergeRequestChannel(username, channelOptions, fetchOptions)
	];

	for (const channel of channels) {
		await channel.configure();
	}

	intervals = channels.map(channel => channel.poll(message => store.onReceive(message)));
}

export function deactivate() {
	intervals?.forEach(clearInterval);
}
