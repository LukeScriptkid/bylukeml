import { useState, useEffect, useCallback } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useScrollSpy } from '../hooks/useScrollSpy';

/**
 * Fixed top navigation bar with scroll-spy highlighting.
 *
 * Starts fully transparent and gains a blurred background once the
 * user scrolls past 50px. The active section link gets an animated
 * underline indicator that slides between links via Framer Motion's
 * layoutId system (LayoutGroup).
 *
 * Mobile menu is controlled via React state (not DOM classList) so
 * React stays in sync and accessibility tools can detect the
 * expanded/collapsed state.
 *
 * Accessibility features:
 * - aria-expanded and aria-controls link the hamburger to the menu
 * - aria-current="page" marks the active section link
 * - Escape key closes the mobile menu
 * - Body scroll is locked when the mobile menu is open
 */

// Navigation links — each maps to a section ID on the page.
// Order here determines the order in both desktop and mobile nav.
const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

// Extract just the IDs (without #) for the scroll spy hook
const SECTION_IDS = NAV_LINKS.map((l) => l.href.replace('#', ''));

/**
 * Reads the initial theme preference on first render.
 * Checks localStorage first, then falls back to the user's OS
 * prefers-color-scheme setting. Returns true if dark mode.
 */
function getInitialDark(): boolean {
  const stored = localStorage.getItem('theme');
  if (stored === 'dark') return true;
  if (stored === 'light') return false;
  // No saved preference — respect the OS setting
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export default function Navbar() {
  // Whether the user has scrolled past 50px (toggles the backdrop)
  const [scrolled, setScrolled] = useState(false);
  // Whether the mobile hamburger menu is open
  const [mobileOpen, setMobileOpen] = useState(false);
  // Dark mode toggle state — initialized from localStorage or OS pref
  const [dark, setDark] = useState(getInitialDark);
  // Which section ID is currently in view (drives the active link highlight)
  const activeId = useScrollSpy(SECTION_IDS);

  // Stable callback ref for closing the mobile menu — used by Escape
  // handler and link click handlers without causing re-subscriptions
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Sync the .dark class on <html> and persist the choice to localStorage
  // whenever the toggle changes
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  // Listen for scroll to toggle the navbar backdrop appearance
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu when Escape is pressed
  useEffect(() => {
    if (!mobileOpen) return; // Don't register listener if menu is closed
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobile();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen, closeMobile]);

  // Auto-close the mobile menu if the viewport crosses the md breakpoint
  // (768px). Prevents the scroll-lock bug where the menu is visually hidden
  // by CSS (md:hidden) but the mobileOpen state stays true, trapping scroll.
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) closeMobile();
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [closeMobile]);

  // Lock body scroll when mobile menu is open to prevent
  // scrolling the page behind the menu overlay
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    // Cleanup: always restore scroll on unmount
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Scroll to top when clicking the logo — prevents the default
  // hash navigation and uses smooth scroll instead
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.nav
      // Navbar slides down from above on initial load
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ${
        // After scrolling 50px, the navbar gains a semi-transparent background
        // with a backdrop blur and a visible bottom border
        scrolled
          ? 'bg-bg-darkest/90 backdrop-blur-md border-border'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo — clicking scrolls smoothly to the top of the page */}
        <a
          href="#hero"
          onClick={scrollToTop}
          className="text-lg font-bold tracking-tight text-text-primary hover:text-accent-hover transition-colors"
        >
          LL<span className="text-accent">.</span>
        </a>

        {/*
          Desktop nav links — wrapped in LayoutGroup so the active
          indicator (layoutId="navbar-indicator") can animate smoothly
          between whichever link is currently active.
        */}
        <LayoutGroup>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const id = link.href.replace('#', '');
              const isActive = activeId === id;

              return (
                <a
                  key={id}
                  href={link.href}
                  // "page" is the correct aria-current value for navigation links
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative text-sm font-medium transition-colors py-1 ${
                    isActive
                      ? 'text-text-primary'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {link.label}
                  {/* Active underline indicator — slides between links via shared layoutId */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-accent"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>
        </LayoutGroup>

        {/* Right-side controls — grouped in a flex container so the
            dark mode toggle and hamburger stay together on mobile */}
        <div className="flex items-center gap-3">
          {/* Dark mode toggle — shows Sun icon in dark mode, Moon in light */}
          <button
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setDark((prev) => !prev)}
            className="text-text-muted hover:text-text-primary transition-colors p-1.5"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Mobile hamburger — hidden on desktop (md:hidden).
              Swaps between a hamburger icon and an X when open. */}
          <button
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="md:hidden text-text-muted hover:text-text-primary transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (
                // X icon — two crossing diagonal lines
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                // Hamburger icon — three horizontal lines
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown — only renders when mobileOpen is true.
          Clicking any link closes the menu via the closeMobile callback. */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-bg-darkest/95 backdrop-blur-md border-b border-border px-6 pb-4"
        >
          {NAV_LINKS.map((link) => {
            const id = link.href.replace('#', '');
            const isActive = activeId === id;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`block py-2 text-sm transition-colors ${
                  // Active link shows in accent color, others in muted
                  isActive
                    ? 'text-accent'
                    : 'text-text-muted hover:text-text-primary'
                }`}
                onClick={closeMobile} // Close menu after navigation
              >
                {link.label}
              </a>
            );
          })}
        </div>
      )}
    </motion.nav>
  );
}
