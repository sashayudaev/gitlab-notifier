// import { AbortSignal } from "abort-controller";

export interface FetchOptions {
  url: string;
  token: string;
  signal?: AbortSignal
}