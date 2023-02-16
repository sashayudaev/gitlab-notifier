import * as vscode from 'vscode';
import { Notification } from './types';
import fetchMessages from "./fetch-messages";

const { executeCommand } = vscode.commands;
const { showInformationMessage, showErrorMessage } = vscode.window;

let notifications: Record<number, Notification> = [];

export default async () => {
	const messages = await fetchMessages();
	for (const message of messages) {
		if(!notifications[message.id]) {
			notifications[message.id] = message;
		}

		let text: string | undefined;
		let notify = showInformationMessage;
		switch (message.action_name) {
			case 'assigned':
				text = 'На вас назначили ревью: ' + message.body;
				break;
			case 'directly_addressed':
				text = message.author.name + ': ' + message.body;
				break;
			case 'approval_required':
				text = 'Назначено ревью: ' + message.body;
				break;
			case 'build_failed':
				text = 'Сборка не прошла: ' + message.body;
				notify = showErrorMessage;
				break;
			default:
				text = undefined;
				break;
		}

		if(!text) {
			return;
		}

		const selection = await notify(text, 'Go to GitLab');
		if(selection) {
			executeCommand('vscode.open', vscode.Uri.parse(message.target_url));
		}

		console.log({notification: message});
	}
};