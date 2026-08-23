/**
 * CertPath — Horizontal certification pipeline (desktop) / vertical stack (mobile).
 *
 * Replaces the old Roadmap.tsx with a focused certification pipeline
 * that shows Luke's path from CCNA to CCIE.
 *
 * Desktop layout:
 *   [CCNA] -----> [AZ-900] -----> [CCNP] -----> [CCIE ★]
 *   studying      studying         planned        goal
 *
 * Each cert is a card with:
 * - Name in JetBrains Mono (large)
 * - Full certification name
 * - Vendor name
 * - Status badge (studying/planned)
 * - Target date if applicable
 *
 * Visual treatments:
 * - Cards connected by dashed lines (horizontal on desktop, vertical on mobile)
 * - "studying" certs get accent glow border
 * - CCIE gets special golden/amber treatment as the ultimate goal
 * - Staggered fade-in animation from left to right
 *
 * Uses CERTIFICATIONS data from constants.ts.
 */

import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { CERTIFICATIONS } from '../constants';
import type { Certification } from '../constants';

// ── Status badge colors and labels ───────────────────────────────
// Maps each certification status to its visual treatment.
const STATUS_CONFIG: Record<
  Certification['status'],
  { label: string; bgClass: string; textClass: string }
> = {
  studying: {
    label: 'Studying',
    bgClass: 'bg-accent/10',
    textClass: 'text-accent',
  },
  earned: {
    label: 'Earned',
    bgClass: 'bg-success/10',
    textClass: 'text-success',
  },
  planned: {
    label: 'Planned',
    bgClass: 'bg-bg-elevated',
    textClass: 'text-text-muted',
  },
};

/**
 * Single certification card in the pipeline.
 * CCIE gets special golden treatment (warning color) as the ultimate goal.
 * Studying certs get accent glow border.
 */
function CertCard({
  cert,
  index,
}: {
  cert: Certification;
  index: number;
}) {
  const config = STATUS_CONFIG[cert.status];
  // CCIE is the ultimate goal — give it special golden/amber styling
  const isGoal = cert.id === 'ccie';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className={`relative p-5 sm:p-6 rounded-lg corner-marks bg-bg-surface/90 backdrop-blur-sm border border-dashed flex-1 min-w-0 ${
        // Studying certs get accent glow, goal cert gets amber/gold glow
        isGoal
          ? 'border-warning/30 shadow-[0_0_20px_rgba(251,191,36,0.08)]'
          : cert.status === 'studying'
            ? 'animate-border-glow border-accent/30'
            : 'border-accent/15'
      }`}
    >
      {/* Cert name — large monospace for prominence */}
      <h3
        className={`font-mono text-xl sm:text-2xl font-bold mb-1 ${
          isGoal ? 'text-warning' : 'text-text-primary'
        }`}
      >
        {cert.name}
        {/* Star icon for the ultimate goal */}
        {isGoal && <span className="ml-2 text-warning text-lg">&#9733;</span>}
      </h3>

      {/* Full certification name */}
      <p className="text-xs sm:text-sm text-text-secondary mb-2">
        {cert.fullName}
      </p>

      {/* Vendor tag */}
      <p className="text-xs text-text-muted mb-3">{cert.vendor}</p>

      {/* Status badge + target date */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${config.bgClass} ${config.textClass}`}
        >
          {config.label}
        </span>
        {cert.targetDate && (
          <span className="text-[10px] text-text-muted">
            Target: {cert.targetDate}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Dashed connector line between certification cards.
 * Horizontal on desktop, vertical on mobile.
 * The arrow indicates progression direction.
 */
function Connector({ isDesktop }: { isDesktop: boolean }) {
  if (isDesktop) {
    // Horizontal dashed line with arrowhead
    return (
      <div className="flex items-center shrink-0 mx-1" aria-hidden="true">
        <div className="w-8 border-t border-dashed border-accent/30" />
        {/* Small arrow triangle pointing right */}
        <div className="w-0 h-0 border-t-[4px] border-b-[4px] border-l-[6px] border-t-transparent border-b-transparent border-l-accent/30" />
      </div>
    );
  }

  // Vertical dashed line with arrowhead (mobile)
  return (
    <div className="flex flex-col items-center shrink-0 my-1" aria-hidden="true">
      <div className="h-6 border-l border-dashed border-accent/30" />
      {/* Small arrow triangle pointing down */}
      <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-accent/30" />
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────

export default function CertPath() {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // Sort certifications by their order field to ensure correct pipeline sequence
  const sorted = [...CERTIFICATIONS].sort((a, b) => a.order - b.order);

  return (
    <section id="certifications" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section heading — blueprint reference style */}
        <SectionHeading number="02" title="Certifications" />

        {/* ── Pipeline ─────────────────────────────────────────
            Desktop: horizontal flex with connectors between cards.
            Mobile: vertical flex with connectors between cards.
            Connectors are purely decorative (aria-hidden). */}
        <div
          className={`flex ${
            isDesktop ? 'flex-row items-stretch' : 'flex-col'
          }`}
        >
          {sorted.map((cert, i) => (
            <div
              key={cert.id}
              className={`flex ${
                isDesktop ? 'flex-row items-stretch' : 'flex-col'
              }`}
            >
              {/* Connector line between cards (skip before first card) */}
              {i > 0 && <Connector isDesktop={isDesktop} />}
              <CertCard cert={cert} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
