/**
 * useMediaQuery — Responsive breakpoint detection hook.
 *
 * Wraps the browser's window.matchMedia API in a React-friendly
 * hook that re-renders the component when the media query result
 * changes (e.g. when the window crosses a breakpoint).
 *
 * Usage:
 *   const isDesktop = useMediaQuery('(min-width: 768px)');
 *
 * The initial value is computed synchronously from matchMedia
 * so there's no flash of incorrect layout on first render.
 *
 * @param query - CSS media query string (e.g. "(min-width: 768px)")
 * @returns boolean — true if the query currently matches
 */

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  // Initialize with the current match state — avoids a flash of
  // wrong layout on first render (SSR would need a different approach,
  // but this is a client-only Vite app so window is always available)
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    // Create a MediaQueryList for the given query string
    const mql = window.matchMedia(query);

    // Update state whenever the match result changes
    // (e.g. user resizes window past a breakpoint)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);

    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
