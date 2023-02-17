import * as vscode from 'vscode';
import { Notification } from './types';
import fetch from './fetch';

const { executeCommand } = vscode.commands;
const { showInformationMessage, showErrorMessage } = vscode.window;

let notifications: Record<number, Notification> = [];

type ProgressCallback<R> = (progress: vscode.Progress<{ message?: string; increment?: number }>, token: vscode.CancellationToken) => Thenable<R>;

const withProgress = async <R>(callback: ProgressCallback<R>) => vscode.window.withProgress({location: vscode.ProgressLocation.Notification}, callback);
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async () => {
	const headers = { "PRIVATE-TOKEN": 'F36LsLTYdzj2Gd4VGzjk' };
  const response = await fetch(`https://gitlab.services.mts.ru/api/v4/todos`, {headers, retryCount: 3, retryDelay: 3000, retryCallback: async (interval) => {
		await withProgress(async (progress) => {
			progress.report({ message: `Could not connect to remote server. Retrying in ${interval/1000}s`});
			return await delay(interval);
		});
	}});
	const json = await response.json();
  
  for (const message of json.data) {
		if(notifications[message.id]) {
      return;
    }

    notifications[message.id] = message;

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
      case 'mentioned':
        text = 'Вас упомянули: ' + message.body;
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

		const openInBrowser = await notify(text, 'Go to GitLab');
		if(openInBrowser) {
			executeCommand('vscode.open', vscode.Uri.parse(message.target_url));
		}
	}
};