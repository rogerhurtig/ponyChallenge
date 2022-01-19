export const delay = (milliseconds: number): Promise<void> => new Promise<void>((resolve) => {
  setTimeout(resolve, milliseconds);
});