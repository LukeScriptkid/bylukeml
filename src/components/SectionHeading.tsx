/**
 * SectionHeading — Blueprint-style section header.
 *
 * Renders a numbered reference marker, uppercase title, and a
 * horizontal rule that fades to transparent. Looks like a section
 * callout on a technical drawing or schematic:
 *
 *   [01]  EXPERIENCE  ─────────────────────────
 *
 * The number sits in a small dashed-border box (matching the
 * blueprint card style), the title is monospace uppercase with
 * wide letter-spacing, and the rule extends to fill remaining width.
 */

import { motion } from 'framer-motion';

interface SectionHeadingProps {
  /** Two-digit reference number (e.g. "01", "02") */
  number: string;
  /** Section title — rendered uppercase automatically */
  title: string;
}

export default function SectionHeading({ number, title }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="flex items-center gap-4 mb-14"
    >
      {/* Reference number in dashed-border box */}
      <span className="font-mono text-[11px] text-accent/50 border border-dashed border-accent/20 px-2 py-0.5 leading-none shrink-0">
        {number}
      </span>

      {/* Section title — uppercase monospace with wide tracking */}
      <h2 className="font-mono text-2xl sm:text-3xl font-bold uppercase tracking-wider text-text-primary shrink-0">
        {title}
      </h2>

      {/* Horizontal rule — fades from accent to transparent */}
      <div className="flex-1 h-px bg-gradient-to-r from-accent/20 to-transparent" />
    </motion.div>
  );
}
