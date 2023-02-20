import { ProgressLocation, CancellationToken, window, Progress, CancellationTokenSource } from 'vscode';
import { COMMANDS } from './constants';

type ProgressCallback<R> = (progress: Progress<{ message?: string; increment?: number }>, token: CancellationToken) => Thenable<R>;

const withProgress = async <R>(callback: ProgressCallback<R>) => window.withProgress({ location: ProgressLocation.Notification}, callback);
export const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const abortController = new AbortController();

export default (cancellationTokenSource: CancellationTokenSource) => (interval: number, factor: number): Promise<void> => {
  return withProgress(async (progress) => await new Promise(resolve => {
    cancellationTokenSource.token.onCancellationRequested(() => {
      abortController.abort();
      resolve();
    });

    progress.report({ message: `
      Reconnecting to GitLab in ${interval * factor/1000}s. 
      [Retry now](command:${COMMANDS.RETRY}) or
      [Cancel](command:${COMMANDS.CANCEL})`});
      
    resolve(delay(interval * factor));
  }));
};