import fetch from 'node-fetch';
import { Notification } from './types';

export default async (): Promise<Notification[]> => {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const headers = { "PRIVATE-TOKEN": 'F36LsLTYdzj2Gd4VGzjk' };

	const response = await fetch(`https://gitlab.services.mts.ru/api/v4/todos`, {headers});
	return await response.json();
};