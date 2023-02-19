import { Message } from "./types/channel";
import * as vscode from "vscode";

const { executeCommand } = vscode.commands;
const { showInformationMessage, showErrorMessage } = vscode.window;

export class MessageStore {
  private username: string;
  private messages: Record<string, Message> = {};

  constructor(username: string) {
    this.username = username;
  }

  async onReceive(message: Message): Promise<void> {		
    if(this.messages[message.id]) {
      return;
    }

    this.messages[message.id] = message;

		let text: string | undefined;
		let notify = showInformationMessage;
		switch (message.type) {
			case 'assigned':
				text = 'На вас назначили ревью: ' + message.text;
				break;
      case 'commented':
				text = message.sender + ': ' + message.text;
        break;
			case 'directly_addressed':
				text = message.sender + ': ' + message.text.replace(`@${this.username}`, '');
				break;
			case 'approval_required':
				text = 'Назначено ревью: ' + message.text;
				break;
      case 'approved':
        text = 'Апрув от ' + message.sender;
        break;
      case 'mentioned':
        text = 'Вас упомянули: ' + message.text;
        break;
			case 'build_failed':
				text = 'Сборка не прошла: ' + message.text;
				notify = showErrorMessage;
				break;
			default:
				text = undefined;
				break;
		}

		if(!text) {
			return;
		}

    const actions = message.targetUrl ? ['Go to GitLab'] : [];
		console.log(message.targetUrl);
		
		const openInBrowser = await notify(text, ...actions);
		if(openInBrowser && message.targetUrl) {
			executeCommand('vscode.open', vscode.Uri.parse(message.targetUrl));
		}
  }
}