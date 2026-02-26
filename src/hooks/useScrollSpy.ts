import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook that tracks which page section is currently visible.
 *
 * Used by the Navbar to highlight the active navigation link as the
 * user scrolls through the page. Works by checking each section's
 * position relative to the viewport on every scroll event.
 *
 * @param sectionIds - Array of HTML element IDs to monitor (e.g. ["about", "projects"])
 * @param offset - Pixel threshold from the top of the viewport (default 300).
 *                 A section is considered "active" once its top edge scrolls
 *                 above this line.
 * @returns The ID string of the currently visible section
 */
export function useScrollSpy(sectionIds: string[], offset = 300): string {
  const [activeId, setActiveId] = useState('');

  // Store sectionIds in a ref so the scroll listener doesn't need to
  // re-register every time the caller passes a new array reference.
  // This makes the hook safe to call with inline arrays.
  const idsRef = useRef(sectionIds);
  idsRef.current = sectionIds;

  useEffect(() => {
    const handleScroll = () => {
      // Walk through each section top-to-bottom. The last one whose
      // top edge has scrolled past the offset wins (i.e. it's the
      // section the user is currently reading).
      let current = '';
      for (const id of idsRef.current) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the section's top is above the offset line, it's in view
          if (rect.top <= offset) {
            current = id;
          }
        }
      }
      setActiveId(current);
    };

    // passive: true tells the browser we won't call preventDefault(),
    // allowing it to optimize scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run once on mount to set initial active section
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset]);

  return activeId;
}
