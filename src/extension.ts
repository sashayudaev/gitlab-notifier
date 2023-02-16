// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import fetch from 'node-fetch';
import { Notification } from './types';
const { showInformationMessage, showErrorMessage } = vscode.window;

let notifications: Record<number, Notification> = [];
let interval: NodeJS.Timer;

const fetchTodos = async (initial?: boolean) => {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const headers = { "PRIVATE-TOKEN": 'F36LsLTYdzj2Gd4VGzjk' };

	const response = await fetch(`https://gitlab.services.mts.ru/api/v4/todos`, {headers});
	const newNotifications: Notification[] = await response.json();

	for (const notification of newNotifications) {
		if(!notifications[notification.id]) {
			notifications[notification.id] = notification;
		}

		let message;
		switch (notification.action_name) {
			case 'assigned':
				break;
			case 'directly_addressed':
				message = notification.author.name + ': ' + notification.body;
			case 'approval_required':
				message = 'Назначено ревью: ' + notification.body;
			case 'build_failed':
				message = 'Сборка не прошла: ' + notification.body;
			default:
				break;
		}

		if(!message) {
			return;
		}

		const notify = notification.action_name === 'build_failed' ? showErrorMessage : showInformationMessage;
		const selection = await notify(message, 'Go to GitLab');
		if(selection) {
			vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(notification.target_url));
		}

		console.log({notification: notification});
	}
};

export async function activate() {
	interval = setInterval(fetchTodos, 5000);
	return await fetchTodos(true);
}

export function deactivate() {
	clearInterval(interval);
}
