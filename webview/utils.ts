/* ------------------------------------------------------------------ */
/*  Debounce utility                                                   */
/* ------------------------------------------------------------------ */

export function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return ((...args: unknown[]) => {
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, ms);
  }) as unknown as T;
}
