import fetch from 'node-fetch';
import { Todo } from './types/todo-channel';

interface Response {
  ok: boolean;
  data: Todo[];
}
export default async (): Promise<Response> => {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const headers = { "PRIVATE-TOKEN": 'F36LsLTYdzj2Gd4VGzjk' };

	try {
    const response = await fetch(`https://gitlab.services.mts.ru/api/v4/todos`, {headers});
    const data = await response.json();
    return { ok: response.ok, data };
  } catch (error){
    console.error('Error connection to host: ' + error);
    return { ok: false, data: [] };
  }
};