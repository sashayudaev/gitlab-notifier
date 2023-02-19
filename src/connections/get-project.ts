import fetch from "node-fetch";
import { FetchOptions } from "../fetch";
import { Project } from "../types/merge-request-channel";

export default async (id: number, options: FetchOptions) => {
  const response = await fetch(`${options.url}/api/v4/projects/${id}`,{
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: { "PRIVATE-TOKEN": options.token }
  });

  const project = await response.json();
  return {
    id: project.id,
    url: project.web_url
  };
};