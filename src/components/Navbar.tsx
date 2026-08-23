/**
 * Navbar — Fixed top navigation bar with scroll-spy highlighting.
 *
 * Features:
 * - Starts transparent, gains blurred backdrop after 50px scroll
 * - Active section gets animated underline via LayoutGroup
 * - Dark mode toggle (Sun/Moon) switches .light class on <html>
 * - Dark mode is the DEFAULT — light mode is opt-in
 * - Mobile hamburger menu with body scroll lock
 * - Logo styled as a terminal hostname: "lukas@net:~$"
 *
 * Accessibility:
 * - aria-expanded and aria-controls link hamburger to mobile menu
 * - aria-current="page" marks the active section link
 * - Escape key closes the mobile menu
 * - Body scroll is locked when mobile menu is open
 * - Auto-closes mobile menu when viewport crosses md breakpoint
 *   (prevents scroll-lock bug where menu is hidden by CSS but
 *   state is still true)
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { NAV_LINKS, SECTION_IDS } from '../constants';

/**
 * Reads the initial theme preference on first render.
 * Checks localStorage for a saved choice. If none exists,
 * defaults to dark mode (returns false). Only returns true
 * if the user previously explicitly toggled to light mode.
 */
function getInitialLight(): boolean {
  const stored = localStorage.getItem('theme');
  if (stored === 'light') return true;
  if (stored === 'dark') return false;
  // No saved preference — always default to dark
  return false;
}

export default function Navbar() {
  // Whether the user has scrolled past 50px (toggles backdrop)
  const [scrolled, setScrolled] = useState(false);
  // Whether the mobile hamburger menu is open
  const [mobileOpen, setMobileOpen] = useState(false);
  // Light mode toggle — dark is default, this tracks the exception
  const [isLight, setIsLight] = useState(getInitialLight);
  // Which section ID is currently in view (drives active link highlight)
  // Cast to mutable string[] since useScrollSpy expects that
  const activeId = useScrollSpy([...SECTION_IDS]);

  // Stable callback for closing mobile menu — used by Escape handler
  // and link click handlers without causing re-subscriptions
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Sync the .light class on <html> and persist choice to localStorage.
  // Dark is the default (no class needed), light mode adds .light class.
  useEffect(() => {
    const root = document.documentElement;
    if (isLight) {
      root.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      root.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLight]);

  // Listen for scroll to toggle the navbar backdrop appearance
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu when Escape is pressed
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobile();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen, closeMobile]);

  // Auto-close mobile menu if viewport crosses the md breakpoint (768px).
  // Prevents the scroll-lock bug where the menu is visually hidden by
  // CSS (md:hidden) but mobileOpen state stays true, trapping scroll.
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
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Scroll to top when clicking the logo
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
      className={`fixed top-0 left-0 right-0 z-50 border-b border-dashed transition-colors duration-300 ${
        scrolled
          ? 'bg-bg-void/90 backdrop-blur-md border-accent/15'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo — clean monospace initials with accent dot.
            Simple and recognizable without being over-themed. */}
        <a
          href="#hero"
          onClick={scrollToTop}
          className="font-mono text-base font-bold tracking-tight text-text-primary hover:text-accent transition-colors"
        >
          lksrun<span className="text-accent">.</span>net
        </a>

        {/* Desktop nav links — LayoutGroup enables the animated
            underline indicator to slide between active links */}
        <LayoutGroup>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const id = link.href.replace('#', '');
              const isActive = activeId === id;

              return (
                <a
                  key={id}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative text-sm font-medium transition-colors py-1 ${
                    isActive
                      ? 'text-text-primary'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {link.label}
                  {/* Active underline — slides between links via shared layoutId */}
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

        {/* Right-side controls — theme toggle + hamburger */}
        <div className="flex items-center gap-3">
          {/* Theme toggle — shows Moon in dark mode (click for light),
              Sun in light mode (click for dark) */}
          <button
            aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
            onClick={() => setIsLight((prev) => !prev)}
            className="text-text-muted hover:text-text-primary transition-colors p-1.5"
          >
            {isLight ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Mobile hamburger — hidden on desktop (md:hidden).
              Swaps between hamburger and X icon when open. */}
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
          Clicking any link closes the menu via closeMobile callback. */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-bg-void/95 backdrop-blur-md border-b border-dashed border-accent/15 px-6 pb-4"
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
                  isActive
                    ? 'text-accent'
                    : 'text-text-muted hover:text-text-primary'
                }`}
                onClick={closeMobile}
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
