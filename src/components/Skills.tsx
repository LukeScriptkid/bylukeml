/**
 * Skills — Category-grouped cluster grid with colored skill pills.
 *
 * Skills are organized into 4 categories, each rendered as a card
 * with a colored header label and flex-wrapped skill pills inside.
 *
 * Categories and their colors:
 *   - Networking: baby blue (accent color)
 *   - Cloud & Identity: indigo (#818cf8)
 *   - Systems: emerald (#34d399)
 *   - Tools: amber (#fbbf24)
 *
 * Pill sizing is driven by the skill's "weight" property:
 *   weight 1 = small (text-xs, px-2.5)
 *   weight 2 = medium (text-sm, px-3)
 *   weight 3 = large (text-sm font-medium, px-3.5)
 *
 * Grid layout:
 *   Desktop: 2 columns
 *   Mobile: 1 column (stacked)
 *
 * Uses SKILLS data from constants.ts.
 */

import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { SKILLS } from '../constants';
import type { SkillNode } from '../constants';

// ── Category Display Config ──────────────────────────────────────
// Each category gets a display label, a text color for the header
// and pill borders/text, and a border color for the pills.
// Colors are chosen to be visually distinct while feeling cohesive.

interface CategoryConfig {
  label: string;      // Display name for the category header
  textColor: string;  // Tailwind text color class for header + pill text
  borderColor: string; // Tailwind border color class for pill borders
  hoverBg: string;    // Tailwind bg class for pill hover state (15% opacity)
}

const CATEGORY_CONFIG: Record<SkillNode['category'], CategoryConfig> = {
  networking: {
    label: 'Networking',
    textColor: 'text-accent',
    borderColor: 'border-accent/30',
    hoverBg: 'hover:bg-accent/15',
  },
  cloud: {
    label: 'Cloud & Identity',
    textColor: 'text-indigo-400',
    borderColor: 'border-indigo-400/30',
    hoverBg: 'hover:bg-indigo-400/15',
  },
  systems: {
    label: 'Systems',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-400/30',
    hoverBg: 'hover:bg-emerald-400/15',
  },
  tools: {
    label: 'Tools',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-400/30',
    hoverBg: 'hover:bg-amber-400/15',
  },
};

// Category render order — controls which card appears where in the grid
const CATEGORY_ORDER: SkillNode['category'][] = [
  'networking',
  'cloud',
  'systems',
  'tools',
];

/**
 * Maps a skill's weight (1-3) to Tailwind classes that control
 * pill size. Higher weight = larger pill = more visual emphasis.
 */
function getPillClasses(weight: SkillNode['weight']): string {
  switch (weight) {
    case 3:
      // Largest — prominent skills like TCP/IP, Azure, Active Directory
      return 'text-sm font-medium px-3.5 py-1.5';
    case 2:
      // Medium — most skills fall here
      return 'text-sm px-3 py-1';
    case 1:
      // Smallest — supplementary skills like Git, Wireshark
      return 'text-xs px-2.5 py-1';
  }
}

/**
 * Single category cluster card — colored header + flex-wrap pills.
 */
function CategoryCard({
  category,
  skills,
  index,
}: {
  category: SkillNode['category'];
  skills: SkillNode[];
  index: number;
}) {
  const config = CATEGORY_CONFIG[category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="p-5 sm:p-6 rounded-lg corner-marks bg-bg-surface/90 backdrop-blur-sm border border-dashed border-accent/15"
    >
      {/* Category header label — colored text in monospace */}
      <h3
        className={`font-mono text-sm font-semibold uppercase tracking-wider mb-4 ${config.textColor}`}
      >
        {config.label}
      </h3>

      {/* Skill pills — flex-wrap, sized by weight */}
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill.name}
            className={`rounded-lg border transition-all cursor-default ${
              config.borderColor
            } ${config.textColor} ${config.hoverBg} ${getPillClasses(
              skill.weight
            )} hover:scale-105`}
          >
            {skill.name}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ── Main Component ───────────────────────────────────────────────

export default function Skills() {
  // Group skills by category for rendering into separate cards
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    skills: SKILLS.filter((s) => s.category === category),
  }));

  return (
    <section id="skills" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section heading — blueprint reference style */}
        <SectionHeading number="03" title="Skills" />

        {/* 2-column grid on desktop, 1-column on mobile */}
        <div className="grid md:grid-cols-2 gap-4">
          {grouped.map(({ category, skills }, i) => (
            <CategoryCard
              key={category}
              category={category}
              skills={skills}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
