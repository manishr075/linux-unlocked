/** Clamp a number between min and max. */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Linear interpolation. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Map a value from one range to another. */
export function mapRange(
  n: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return lerp(outMin, outMax, (n - inMin) / (inMax - inMin));
}

/** Debounce a function by `delay` ms. */
export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Simple unique id generator (not crypto-secure). */
export function uid(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
