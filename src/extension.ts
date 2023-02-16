import pollMessages from "./poll-messages";

let interval: NodeJS.Timer;


export async function activate() {
	interval = setInterval(pollMessages, 5000);
	return await pollMessages();
}

export function deactivate() {
	clearInterval(interval);
}
