import fetch, { FetchOptions } from "../fetch";
import { User } from "../types/global";

export default (options: FetchOptions) => 
  fetch<User>(`${options.url}/api/v4/user}`, {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: { "PRIVATE-TOKEN": options.token }
  }, options);