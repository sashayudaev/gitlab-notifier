import { MessageStore } from "./message-store";
import { ChannelOptions } from "./types/channel";
import NoteChannel from './channels/note-channel';
import { WorkspaceConfiguration, workspace, ExtensionContext, window, commands } from 'vscode';
import { COMMANDS, defaultChannelOptions, defaultFetchOptions } from "./constants";
import { ChannelCollection } from "./channel-collection";
import { FetchOptions } from "./types/fetch";
import { abortController } from "./show-progress-message";

let channels: ChannelCollection;
export async function activate(context: ExtensionContext) {
	const configuration: WorkspaceConfiguration = workspace.getConfiguration('gitlabNotifier');

	const getOrDefault = <T>(property: string, defaultOptions: Record<string, any>) => {
		return configuration.get<T>(property) || defaultOptions[property];

	};

	const channelOptions: ChannelOptions = {
		retryCount: getOrDefault<number>('retryCount', defaultChannelOptions),
		retryInterval: getOrDefault<number>('retryInterval', defaultChannelOptions),
		fetchInterval: getOrDefault<number>('fetchInterval', defaultChannelOptions),
	};

	const fetchOptions: FetchOptions =  {
		url: getOrDefault<string>('url', defaultFetchOptions),
		token: getOrDefault<string>('privateToken', defaultFetchOptions),
		signal: abortController.signal
	};

	if(!fetchOptions.token) {
		if(await window.showErrorMessage('Access token missing in settings. Reload window after you add one')) {
			commands.executeCommand( 'workbench.action.openSettings', 'gitlabNotifier.token' );
		}
		return;
	}

	const username = configuration.get<string>('username');
	if(!username) {
		if(await window.showErrorMessage('Username missing in settings. Reload window after you add one', 'Go to settings')) {
			commands.executeCommand( 'workbench.action.openSettings', 'gitlabNotifier.username' );
		}
		return;
	}
	
	channels = new ChannelCollection(context.subscriptions, [
		new NoteChannel(username, channelOptions, fetchOptions)
	], channelOptions);
	
	const store = new MessageStore(username);
	channels.listen(message => store.onReceive(message));
}

export function deactivate() {
	channels.stop();
}