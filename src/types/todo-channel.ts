/* eslint-disable @typescript-eslint/naming-convention */

export type TodoType = 
	  'directly_addressed' 
	| 'assigned' 
	| 'build_failed'
	| 'mentioned'
	| 'approval_required';

export interface Author {
	id: number;
	username: string;
	name: string;
}
export interface Todo {
	id: number;
	body: string;
	author: Author;
	target_url: string;
	action_name: TodoType;
	created_at: string;
}