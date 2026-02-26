import { motion } from 'framer-motion';
import TextReveal from './motion/TextReveal';
import { CARD_LIFT_HOVER } from '../constants';

/**
 * Experience section — vertical timeline layout.
 *
 * Each job is a card with a timeline dot to its left. The dots
 * fade from bright cyan (current role) to plain border color
 * (oldest role), giving a visual sense of recency.
 *
 * Cards use background elevation (bg-bg-card) instead of borders,
 * and lift slightly on hover via the shared CARD_LIFT_HOVER config.
 */

// Work experience entries — newest first (reverse chronological)
const EXPERIENCE = [
  {
    title: 'IT Operations Apprentice',
    company: 'Bama Tek',
    period: 'Nov 2025 – Present',
    current: true,
    description:
      'Service desk and IT operations. Working with Azure, Active Directory, and Python automation. Pursuing IT Operations certificate (Nov 2027).',
  },
  {
    title: 'Warehouse Operative',
    company: 'Ahlsell',
    period: 'Apr 2025 – Aug 2025',
    current: false,
    description:
      'Warehouse logistics and operations. Earned truck license (T1-5).',
  },
  {
    title: 'Flight Worker',
    company: 'Scandinavian Airlines (SAS)',
    period: 'May 2022 – Mar 2026 (part-time from 2024)',
    current: false,
    description:
      'Four years in aviation operations. Full-time for the first two years, then part-time. High-pressure, safety-critical environment with strict procedures and teamwork.',
  },
  {
    title: 'Hardware Technician',
    company: 'Neo Monitors',
    period: 'Sep 2020 – Dec 2021',
    current: false,
    description:
      'Assembled lasergas measurement units. Soldering, quality testing, and physical component work.',
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-28 px-6">
      {/* Narrower max-w-5xl here — timeline content doesn't need full width */}
      <div className="max-w-5xl mx-auto">
        {/* Section heading — each word fades in with a stagger */}
        <TextReveal text="Experience" className="text-3xl sm:text-4xl font-bold mb-14" />

        {/* Timeline container — relative so the vertical line and dots can position absolutely */}
        <div className="relative">
          {/* Vertical line — runs down the left side, fades from accent to transparent */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/15 via-border/30 to-transparent" />

          <div className="space-y-5">
            {EXPERIENCE.map((job, i) => (
              <motion.div
                key={`${job.company}-${job.period}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }} // Stagger each card
                className="relative pl-10" // Left padding makes room for the dot
              >
                {/*
                  Timeline dot — positioned absolutely on the vertical line.
                  Border color fades based on index:
                    [0] = 0.8 opacity (brightest — current job)
                    [1] = 0.45
                    [2] = 0.2
                    [3] = 0 (falls back to plain border color)
                  The current job also gets a subtle glow via boxShadow.
                */}
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[15px] h-[15px] rounded-full border-2 bg-bg-darkest"
                  style={{
                    borderColor: (() => {
                      const opacities = [0.8, 0.45, 0.2, 0];
                      const opacity = opacities[i] ?? 0;
                      // If opacity is 0, use the plain border color instead of transparent accent
                      return opacity === 0
                        ? 'var(--color-border)'
                        : `rgba(var(--accent-rgb), ${opacity})`;
                    })(),
                    // Only the current job (index 0) gets a glow
                    boxShadow: i === 0
                      ? '0 0 6px rgba(var(--accent-rgb), 0.15)'
                      : 'none',
                  }}
                />

                {/* Job card — lifts on hover, transitions background on hover */}
                <motion.div
                  whileHover={CARD_LIFT_HOVER}
                  className="p-6 rounded-2xl bg-bg-card hover:bg-bg-hover transition-colors"
                >
                  {/* Title row — job title + "Current" badge if applicable */}
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-text-primary">
                      {job.title}
                    </h3>
                    {/* "Current" pill — only renders for the active job */}
                    {job.current && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                        Current
                      </span>
                    )}
                  </div>
                  {/* Company name in accent color for emphasis */}
                  <p className="text-sm text-accent-hover mb-1">{job.company}</p>
                  {/* Date range in muted text */}
                  <p className="text-xs text-text-muted mb-3">{job.period}</p>
                  {/* Job description */}
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {job.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
