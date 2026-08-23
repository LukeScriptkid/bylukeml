/**
 * Hero — Blueprint title block.
 *
 * Styled like the info block on a technical drawing/blueprint.
 * A compact panel centered in the viewport with:
 * - Profile photo left, info right (asymmetric on desktop)
 * - Dashed border + corner marks matching the blueprint theme
 * - Bottom metadata bar: REV A | location | SHEET 1 OF 1
 * - Scroll-fade-out parallax on the whole block
 * - Bouncing scroll indicator chevron below
 *
 * The title block sits on the grid paper background, making
 * the hero feel like you're reading an architect's document.
 */

import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import CharReveal from './motion/CharReveal';

export default function Hero() {
  // Scroll-linked parallax: hero fades out and shifts down
  // as the user scrolls, creating a "leaving the page" feel
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, 80]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* Content wrapper — opacity and Y position linked to scroll */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative z-10 w-full max-w-3xl"
      >
        {/* ── Title Block Panel ─────────────────────────────────
            The main hero content panel. Styled like a blueprint
            info block with dashed border and corner marks.
            Semi-transparent background lets the grid show at edges. */}
        <div className="corner-marks border border-dashed border-accent/20 rounded-lg p-8 md:p-10 bg-bg-surface/80 backdrop-blur-sm">

          {/* ── Asymmetric Layout ───────────────────────────────
              Photo left, text right on desktop.
              Stacks centered on mobile. */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

            {/* ── Profile Photo ──────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-28 h-28 md:w-32 md:h-32 rounded-lg overflow-hidden shrink-0 border border-dashed border-accent/20"
            >
              <img
                src={`${import.meta.env.BASE_URL}images/pic2.png`}
                alt="Lukas Liberg"
                width={128}
                height={128}
                fetchPriority="high"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* ── Info Block ──────────────────────────────────── */}
            <div className="text-center md:text-left flex-1">

              {/* Name — uppercase monospace for blueprint feel */}
              <CharReveal
                parts={[{ text: 'LUKAS LIBERG' }]}
                className="text-4xl sm:text-5xl md:text-6xl font-mono font-bold tracking-tight mb-4 text-text-primary"
                delay={0.3}
              />

              {/* Role and career path */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mb-5"
              >
                <p className="text-base sm:text-lg text-text-secondary">
                  IT Operations Apprentice @ <span className="text-text-primary font-medium">Bama Tek</span>
                </p>
              </motion.div>

              {/* Location + status */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="text-text-muted text-sm mb-6"
              >
                Oslo, Norway
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="flex gap-6 justify-center md:justify-start items-center flex-wrap"
              >
                <a
                  href="#experience"
                  className="inline-block px-6 py-2.5 bg-accent text-bg-void text-sm font-semibold rounded-md hover:bg-accent-bright transition-colors"
                >
                  View Experience
                </a>
                <a
                  href="#contact"
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  Get in Touch &rarr;
                </a>
              </motion.div>
            </div>
          </div>

          {/* ── Bottom Metadata Bar ──────────────────────────────
              Blueprint-style info line at the bottom of the title
              block. Like the revision/scale/sheet info on a real
              technical drawing. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="border-t border-dashed border-accent/15 mt-8 pt-3 flex justify-between font-mono text-[10px] text-text-ghost uppercase tracking-wider"
          >
            <span>Rev A</span>
            <span>Oslo, NO</span>
            <span>Sheet 1 of 1</span>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Scroll Indicator ──────────────────────────────────── */}
      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 1.8 },
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute bottom-8 text-text-muted hover:text-accent transition-colors"
      >
        <ChevronDown size={20} />
      </motion.a>
    </section>
  );
}
