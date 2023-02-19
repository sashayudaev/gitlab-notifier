import fetch, { FetchOptions } from "../fetch";
import { Project } from "../types/merge-request-channel";

export default async (id: number, options: FetchOptions) => {
  const project = await fetch<Project>(`${options.url}/api/v4/projects/${id}`,{
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: { "PRIVATE-TOKEN": options.token }
  }, options);

  return {
    id: project.id,
    url: project.web_url
  };
};