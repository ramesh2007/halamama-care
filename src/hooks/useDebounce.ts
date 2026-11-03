// ─── useDebounce Hook ───────────────────────────────────────────────────────
// Debounces a value by a specified delay (default 300ms).
// Used in ThreadSearchBar for search-as-you-type filtering.

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
