import fetch, { FetchOptions } from "../fetch";
import { MergeRequest } from "../types/merge-request-channel";

export default async (username: string, options: FetchOptions) => {
  const requests = await fetch<MergeRequest[]>(`${options.url}/api/v4/merge_requests?author_username=${username}&state=opened`, {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: { "PRIVATE-TOKEN": options.token }
  }, options);

  return requests.map(mr => {
    mr.project = {
      id: mr['project_id']
    };
    return mr;
  })
}