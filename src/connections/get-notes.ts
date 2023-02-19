import fetch, { FetchOptions } from "../fetch";
import { Note } from "../types/merge-request-channel";

export default (projectId: number, mrId: number, options: FetchOptions) => 
  fetch<Note[]>(`${options.url}/api/v4/projects/${projectId}/merge_requests/${mrId}/notes`, {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: { "PRIVATE-TOKEN": options.token }
  }, options);