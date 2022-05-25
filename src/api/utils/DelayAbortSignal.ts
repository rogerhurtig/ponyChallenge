export const delayAbortSignal = (seconds: number): AbortSignal => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), seconds * 1000);

  return controller.signal;
};