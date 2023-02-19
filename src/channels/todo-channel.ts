import { Channel } from "./channel";
import fetch from "../fetch";
import { Todo } from "../types/todo-channel";
import { Message } from "../types/channel";

export default class TodoChannel extends Channel {
 async fetch(): Promise<Message[] | undefined> {
    const todos = await fetch<Todo[]>(`${this.fetchOptions.url}/api/v4/todos`, {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: { "PRIVATE-TOKEN": this.fetchOptions.token }
    }, this.fetchOptions);

    return todos.map((todo: Todo) => ({
      id: todo.id,
      text: todo.body,
      type: todo.action_name,
      sender: todo.author.name,
      targetUrl: todo.target_url
    }));
  }

}