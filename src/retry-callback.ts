import { ProgressLocation, CancellationToken, window, Progress, CancellationTokenSource } from 'vscode';
import { COMMANDS } from './constants';

type ProgressCallback<R> = (progress: Progress<{ message?: string; increment?: number }>, token: CancellationToken) => Thenable<R>;

const withProgress = async <R>(callback: ProgressCallback<R>) => window.withProgress({ location: ProgressLocation.Notification}, callback);
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const abortController = new AbortController();

export default (cancellationTokenSource: CancellationTokenSource) => async (interval: number, retriesLeft: number) => {
  await withProgress(async (progress) => new Promise(async resolve => {
    cancellationTokenSource.token.onCancellationRequested(() => {
      abortController.abort();
      resolve(null);
    });

    progress.report({ message: `
      Could not connect to GitLab. 
      Retrying in ${interval * retriesLeft/1000}s. 
      [Retry now](command:${COMMANDS.RETRY}) or
      [Cancel](command:${COMMANDS.CANCEL})`});

    await delay(interval * retriesLeft);
  }));
};