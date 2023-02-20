import { AbortSignal } from "abort-controller";
import fetch from "node-fetch";
import { FetchOptions } from "../types/fetch";
import { Note } from "../types/merge-request-channel";

export default async (projectId: number, mrId: number, options: FetchOptions): Promise<Note[]> => {
  const response = await fetch(`${options.url}/api/v4/projects/${projectId}/merge_requests/${mrId}/notes`, {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: { "PRIVATE-TOKEN": options.token },
    signal: options.signal as AbortSignal
  });
  return await response.json();
};