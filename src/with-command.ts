import { commands } from "vscode";

export default async (id: string, handler: any, callback: () => Promise<void>) => {
  const command = commands.registerCommand(id, handler);
  await callback();
  command.dispose();
};