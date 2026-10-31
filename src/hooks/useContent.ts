import { useEffect, useState } from "react";

/** Loads content from the public directory and caches the result. */
export function useContent<T>(url: string | null): {
  data: T | null;
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!!url);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!url) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(url)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        return (await res.json()) as T;
      })
      .then((json) => {
        if (cancelled) return;
        setData(json);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}
