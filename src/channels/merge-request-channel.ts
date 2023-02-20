import { ChannelOptions, Message, MessageType } from "../types/channel";
import { Channel } from "./channel";
import { FetchOptions } from '../fetch';
import { Note, Project } from "../types/merge-request-channel";
import getMergeRequests from "../connections/get-merge-requests";
import getNotes from "../connections/get-notes";
import getProject from "../connections/get-project";
import { MESSAGE_TYPE } from "../constants";

export default class MergeRequestChannel extends Channel {
  username: string;
  private projects: Record<number, Project> = {};

  constructor(username: string, channelOptions?: ChannelOptions, fetchOptions?: FetchOptions) {
    super(channelOptions, fetchOptions);
    this.username = username;
  }

  protected async fetch(): Promise<Message[] | undefined> {
    const assignedMr = await getMergeRequests(this.username, this.fetchOptions);
    const reviewedMr = await getMergeRequests(this.username, this.fetchOptions, { reviewer: true });
    console.log({assignedMr});
    console.log({reviewedMr});
    
    
    const notes: Note[] = [];
    for (const mr of assignedMr.concat(reviewedMr)) {
      mr.project = await this.getProject(mr.project.id);
      
      const data = await getNotes(mr.project.id, mr.iid, this.fetchOptions);
      
      data.forEach(note => {
        if(!note.resolved && note.author.username !== this.username) {
          note.targetUrl = `${mr.project.url}/-/merge_requests/${mr.iid}#note_${note.id}`;
          notes.push(note);
        }
      });
    }
    
    return notes.map(note => ({
      id: note.id,
      text: note.body,
      targetUrl: note.targetUrl,
      sender: note.author.username,
      type: this.getMessageType(note)
    }));
  }

  private getProject(id: number): Promise<Project> {
    if(this.projects[id]) {
      return Promise.resolve(this.projects[id]);
    } else {
      return getProject(id, this.fetchOptions);
    }
  }

  private getMessageType(note: Note): MessageType {
    if(note.body.startsWith('assigned')) {
      return MESSAGE_TYPE.ASSIGNED;
    }
    if(note.body.startsWith('approved')) {
      return MESSAGE_TYPE.APPROVED;
    }
    if(note.body.startsWith('requested review')) {
      return MESSAGE_TYPE.APPROVAL_REQUIRED;
    }
    if(note.body.startsWith('```suggestion')) {
      return MESSAGE_TYPE.SUGGESTED;
    }
    if(note.body.startsWith('added') && note.body.includes('commit')) {
      return MESSAGE_TYPE.COMMITED;
    }
    return MESSAGE_TYPE.COMMENTED;
  }
}