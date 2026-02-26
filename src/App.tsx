import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Roadmap from './components/Roadmap';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import SocialLinks from './components/SocialLinks';

// Extracted at module level so we don't create a new Date on every render
const YEAR = new Date().getFullYear();

/**
 * Root application component.
 * Assembles all portfolio sections into a single-page scroll layout.
 *
 * MotionConfig wraps everything so Framer Motion respects the user's
 * OS-level "prefers-reduced-motion" setting. When enabled, all
 * motion components skip their animations automatically.
 */
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
        className="fixed top-4 left-4 z-[60] px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium -translate-y-20 focus:translate-y-0 transition-transform"
      >
        Skip to content
      </a>

      <Navbar />

      {/* id="main-content" is the target for the skip-to-content link */}
      <main id="main-content">
        {/* Sections render in scroll order — this determines page flow */}
        <Hero />
        <About />
        <Experience />
        <Roadmap />
        <Projects />
        <Skills />
        <Contact />
      </main>

      {/* Minimal footer — copyright + small social icons */}
      <footer className="py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            © {YEAR} Lukas Liberg
          </p>
          {/* Smaller icons (14px) than in the Contact section (20px) */}
          <SocialLinks iconSize={14} className="flex items-center gap-4" />
        </div>
      </footer>
    </MotionConfig>
  );
}
