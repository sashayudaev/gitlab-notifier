import { ProgressLocation, CancellationToken, window, Progress, CancellationTokenSource } from 'vscode';
import { COMMANDS } from './constants';

type ProgressCallback<R> = (progress: Progress<{ message?: string; increment?: number }>, token: CancellationToken) => Thenable<R>;

const withProgress = async <R>(callback: ProgressCallback<R>) => window.withProgress({ location: ProgressLocation.Notification}, callback);
export const delay = (ms: number, token?: CancellationToken) => new Promise<void>((resolve, reject) => {
  const timeout = setTimeout(resolve, ms);
  token?.onCancellationRequested(() => {
    clearTimeout(timeout);
    resolve();
  });
});

export const abortController = new AbortController();

export default (interval: number, factor: number, cancelToken: CancellationToken, retryToken: CancellationToken): Promise<boolean> => {
  return withProgress((progress) => new Promise(async resolve => {
    cancelToken.onCancellationRequested(() => {
      abortController.abort();
      resolve(false);
      return;
    });

    progress.report({ message: `
        Reconnecting to GitLab in ${interval * factor/1000}s. 
        [Retry now](command:${COMMANDS.RETRY}) or
        [Cancel](command:${COMMANDS.CANCEL})`});
      
    await delay(interval * factor, retryToken);
    console.log('continue');
    
    resolve(true);
  }));
};