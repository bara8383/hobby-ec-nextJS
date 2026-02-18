export function logChat(message: string, context: Record<string, string | undefined>) {
  console.info(`[chat] ${message}`, context);
}
