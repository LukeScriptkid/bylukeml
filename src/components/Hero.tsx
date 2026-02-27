import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import CharReveal from './motion/CharReveal';

/**
 * Full-viewport hero section — the first thing visitors see.
 *
 * Key features:
 * - CharReveal animates the name letter by letter on load
 * - Ambient glows parallax-shift as you scroll for depth
 * - Content fades out on scroll for a "leaving the hero" feel
 * - Typewriter cycles through role titles below the name
 */

// Roles that cycle in the typewriter effect, one after another
const ROLES = ['ML Enthusiast', 'Cloud Explorer', 'IT Operations'];

export default function Hero() {
  // Typewriter state: which role we're on, what's currently displayed,
  // and whether we're typing forward or deleting backward
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if the user prefers reduced motion at the OS level.
  // When true, we skip the typewriter animation and show a static role,
  // and swap the pulsing cursor for a solid one.
  const [prefersReduced, setPrefersReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Listen for changes to the reduced-motion preference (e.g. user
  // toggles it in system settings while the page is open)
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // useScroll gives us a live scrollY MotionValue that updates on
  // the GPU without triggering React re-renders
  const { scrollY } = useScroll();

  // Hero content gradually fades out and shifts down as user scrolls.
  // By 500px of scroll, the hero is fully invisible.
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, 80]);

  // Two ambient glows drift in opposite directions as you scroll,
  // creating a parallax depth effect. Each glow moves on both axes.
  const glow1Y = useTransform(scrollY, [0, 600], [0, -80]);
  const glow1X = useTransform(scrollY, [0, 600], [0, -40]);
  const glow2Y = useTransform(scrollY, [0, 600], [0, 60]);
  const glow2X = useTransform(scrollY, [0, 600], [0, 30]);

  // Typewriter effect — runs as a state machine with three branches:
  //   1. Finished typing the full word → pause 2s, then start deleting
  //   2. Finished deleting → advance to the next role in the array
  //   3. Still mid-type or mid-delete → add/remove one character
  // Skipped entirely when user prefers reduced motion.
  useEffect(() => {
    // Don't run timers when reduced motion is active
    if (prefersReduced) return;

    const currentRole = ROLES[roleIndex];

    // Full word is typed — wait 2s before we start erasing
    if (!isDeleting && text === currentRole) {
      const pause = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(pause);
    }

    // Type or delete one character at a time.
    // Deleting is faster (40ms) than typing (80ms) for a natural feel.
    // When deletion empties the text, advance to the next role inline
    // to keep all setState calls inside the async callback (lint-safe).
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setText(currentRole.slice(0, text.length + 1));
        } else {
          const nextLen = text.length - 1;
          setText(currentRole.slice(0, nextLen));
          // Just cleared the last character — advance to next role
          if (nextLen === 0) {
            setIsDeleting(false);
            setRoleIndex((prev) => (prev + 1) % ROLES.length);
          }
        }
      },
      isDeleting ? 40 : 80
    );
    return () => clearTimeout(timeout);
  }, [text, isDeleting, roleIndex, prefersReduced]);

  // Derive displayed text: when reduced motion is on, show the full
  // role statically instead of the typewriter's partial text state.
  // This avoids calling setState inside an effect (React anti-pattern).
  const displayText = prefersReduced ? ROLES[roleIndex] : text;

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Ambient background glows — two blurred circles that drift apart on scroll */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-left glow — drifts up-left as you scroll */}
        <motion.div
          style={{ y: glow1Y, x: glow1X, willChange: 'transform' }}
          className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-accent/[0.03] rounded-full blur-3xl"
        />
        {/* Bottom-right glow — drifts down-right as you scroll */}
        <motion.div
          style={{ y: glow2Y, x: glow2X, willChange: 'transform' }}
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/[0.03] rounded-full blur-3xl"
        />
      </div>

      {/* Content wrapper — opacity and Y position linked to scroll */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative z-10 text-center max-w-5xl"
      >
        {/* Profile photo — fades in and scales up on mount */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-28 h-28 mx-auto mb-10 rounded-2xl overflow-hidden"
        >
          <img
            src={`${import.meta.env.BASE_URL}images/pic2.png`}
            alt="Lukas Liberg"
            width={112}
            height={112}
            fetchPriority="high" // LCP image — load before everything else
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Name — each character animates in with a stagger.
            "Liberg" gets the accent color via className on the second part. */}
        <CharReveal
          parts={[
            { text: 'Lukas ' },
            { text: 'Liberg', className: 'text-accent' },
          ]}
          className="font-display font-bold tracking-tight mb-6"
          delay={0.3} // Wait for photo to finish animating first
        />

        {/* Typewriter — shows the current role being typed/deleted.
            Fixed h-9 prevents layout shift as text length changes.
            Brackets and pipe cursor styled for a terminal/code look. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xl sm:text-2xl text-text-secondary mb-6 h-9"
        >
          <span className="text-text-muted">[</span>
          <span className="text-accent-hover font-medium">{displayText}</span>
          {/* Cursor blinks via CSS pulse, but stays solid if user prefers reduced motion */}
          <span className={`${prefersReduced ? '' : 'animate-pulse'} text-accent`}>|</span>
          <span className="text-text-muted">]</span>
        </motion.div>

        {/* Tagline — simple one-liner under the typewriter */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-text-muted mb-14 text-lg max-w-lg mx-auto leading-relaxed"
        >
          Apprentice today, engineer tomorrow. Building in public.
        </motion.p>

        {/* CTA buttons — primary solid button + secondary text link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex gap-8 justify-center items-center flex-wrap"
        >
          {/* Primary CTA — solid accent background, links to projects */}
          <a
            href="#projects"
            className="inline-block px-8 py-3 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-hover transition-colors"
          >
            View Projects
          </a>
          {/* Secondary CTA — text-only with arrow, links to contact */}
          <a
            href="#contact"
            className="text-sm text-text-muted hover:text-text-secondary transition-colors"
          >
            Get in Touch &rarr;
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator — bounces up and down in an infinite loop.
          Appears after all other content has animated in (1.5s delay). */}
      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 1.5 },
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute bottom-8 text-text-muted hover:text-accent transition-colors"
      >
        <ChevronDown size={20} />
      </motion.a>
    </section>
  );
}
