export type Note = {
  id: number;
  body: string;
  author: {
    username: string;
  };
  targetUrl: string;
  resolved: boolean;
};

export type Project =  {
  id: number;
  url?: string;
  [key: string]: any;
};

export type MergeRequest = {
  id: number;
  iid: number;
  title: string;
  project: Project;
  [key: string]: any;
};