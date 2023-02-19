import fetch, { RequestInfo, RequestInit, Response } from "node-fetch";
import * as vscode from "vscode";

export interface FetchOptions {
  url: string;
  token: string;
  retryCount?: number;
  retryDelay?: number;
  retryCallback?: (delay: number, retriesLeft: number) => Promise<void>;
}

export default <T>(url: RequestInfo, requestInit: RequestInit, { retryCount = 0, retryDelay = 0, retryCallback }: FetchOptions): Promise<T> => {
  return new Promise((resolve, reject) => {

    const fetchCore = async (retry: number) => {
      try {
        const response = await fetch(url, requestInit);
        return resolve(await response.json());
      } catch (error: any) {
        if(retry > 0) {
          await retryCallback?.(retryDelay, retryCount - (retry - 1));
          await fetchCore(--retry);
        } else {
          reject(error); 
        }
      }
    };

    fetchCore(retryCount);
  });
};