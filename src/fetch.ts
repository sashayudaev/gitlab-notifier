import fetch, { RequestInfo, RequestInit, Response } from "node-fetch";
import * as vscode from "vscode";

interface FetchOptions extends RequestInit {
  retryCount?: number;
  retryDelay?: number;
  retryCallback?: (delay: number) => Promise<void>;
}
// export default async (url: RequestInfo, { retryCount = 0, retryDelay = 0, ...requestInit }: FetchOptions): Promise<Response> => {
//   const fetchCore = async (retryCount: number): Promise<Response | undefined> => {
//     try {
//       return await fetch(url, requestInit);
//     } catch (error) {
//       if(retryCount > 0) {
//         await vscode.window.withProgress({location: vscode.ProgressLocation.Notification}, async (progress) => {
//           progress.report({ message: `Retrying in ${retryDelay/1000}s` });
//           return await delay(retryDelay);
//         });
//         return await fetchCore(retryCount--);
//       }
//     }
//   };
  
//   return await new Promise(() => fetchCore(retryCount));
// };

export default (url: RequestInfo, { retryCount = 0, retryDelay = 0, retryCallback, ...requestInit }: FetchOptions): Promise<Response> => {
  return new Promise((resolve, reject) => {

    const fetchCore = (retryCount: number) => {
      fetch(url, requestInit)
        .then(response => resolve(response))
        .catch(async error => {
          if(retryCount > 0) {
            await retryCallback?.(retryDelay);
            fetchCore(--retryCount);
          } else {
            reject('Could not connect to remote server');
          }
        });
    };

    fetchCore(retryCount);
  });
};