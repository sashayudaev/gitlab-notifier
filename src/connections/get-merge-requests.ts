import fetch from "node-fetch";
import { FetchOptions } from "../types/fetch";
import { MergeRequest, MergeRequestOptions } from "../types/merge-request-channel";

export default async (username: string, options: FetchOptions, mrOptions?: MergeRequestOptions) => {
  const queryParams = mrOptions?.reviewer 
    ? `reviewer_username=${username}` 
    : `author_username=${username}`;
  
  const response = await fetch(
    `${options.url}/api/v4/merge_requests?state=opened&view=simple&scope=all&${queryParams}`, {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: { "PRIVATE-TOKEN": options.token },
    signal: options.signal
  });
  const requests:MergeRequest[] = await response.json();
  return requests.map(mr => {
    mr.project = {
      id: mr['project_id']
    };
    return mr;
  });
};