/**
 * App — Root application component.
 *
 * Assembles all portfolio sections into a single-page scroll layout
 * with the network architect theme.
 *
 * Section order:
 *   Hero → About → Experience → CertPath → Skills → Projects → Contact → Footer
 *
 * MotionConfig wraps everything so Framer Motion respects the user's
 * OS-level "prefers-reduced-motion" setting. When enabled, all
 * motion components skip their animations automatically.
 *
 * Blueprint grid background is rendered via CSS on body (index.css)
 * — no separate background component needed.
 */

import { MotionConfig } from 'framer-motion';
// CustomCursor removed — Luke didn't want it
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import CertPath from './components/CertPath';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';

// Extracted at module level so we don't create a new Date on every render
const YEAR = new Date().getFullYear();

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      {/*
        Skip-to-content link for keyboard/screen-reader users.
        Hidden off-screen by default (-translate-y-20), slides into
        view when focused via Tab. z-[60] puts it above the grain
        overlay (z-40) and navbar (z-50).
      */}
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-[60] px-4 py-2 bg-accent text-bg-void rounded-lg text-sm font-medium -translate-y-20 focus:translate-y-0 transition-transform"
      >
        Skip to content
      </a>

      {/* Blueprint grid background is rendered via CSS on body (index.css) */}

      <Navbar />

      {/* id="main-content" is the target for the skip-to-content link */}
      <main id="main-content">
        {/* Sections render in scroll order — this determines page flow */}
        <Hero />
        <About />
        <Experience />
        <CertPath />
        <Skills />
        <Projects />
        <Contact />
      </main>

      {/* ── Footer ─────────────────────────────────────────────────
          Minimal footer with copyright, tech credit, and social icons.
          Kept simple — the contact section handles the CTA. */}
      {/* ── Footer — Blueprint sheet info ─────────────────────
          Styled like the bottom edge of a technical drawing with
          metadata fields. Matches the Hero title block metadata. */}
      <footer className="py-6 px-6 border-t border-dashed border-accent/15">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 font-mono text-[10px] text-text-ghost uppercase tracking-wider">
            <span>&copy; {YEAR} Lukas Liberg</span>
            <span className="hidden sm:inline text-accent/20">|</span>
            <span className="hidden sm:inline">React + TypeScript</span>
            <span className="hidden sm:inline text-accent/20">|</span>
            <span className="hidden sm:inline">Scale: NTS</span>
          </div>
        </div>
      </footer>
    </MotionConfig>
  );
}
