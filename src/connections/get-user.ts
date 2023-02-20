import fetch from "node-fetch";
import { FetchOptions } from "../types/fetch";

export default async (options: FetchOptions) => {
  const response = await fetch(`${options.url}/api/v4/user}`, {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: { "PRIVATE-TOKEN": options.token },
    signal: options.signal
  });

  return await response.json();
}