/**
 * Experience — Network topology map (desktop) / vertical stack (mobile).
 *
 * This is the most complex visual component in the portfolio. On desktop
 * (>=768px), it renders a 5-column CSS Grid topology map with SVG
 * connection lines between job nodes. On mobile, it falls back to a
 * simple vertical card stack.
 *
 * Desktop topology layout (5 cols x 3 rows):
 *   Row 0: [empty] [empty] [Bama Tek*] [empty] [empty]
 *   Row 1: [Ahlsell] [empty] [hub dot] [empty] [SAS]
 *   Row 2: [empty] [empty] [Neo Monitors] [empty] [empty]
 *
 * * = current job, gets pulsing accent border glow
 *
 * Implementation details:
 * - CSS Grid positions cards via inline gridRow/gridColumn styles
 * - An absolutely-positioned SVG overlay draws connection lines
 * - Card centers are measured after render (useLayoutEffect + fonts.ready)
 * - motion.path animates lines with pathLength on scroll into view
 * - Hub node: small pulsing accent dot at grid center
 * - Mobile: simple cards with left accent border on current job
 *
 * Connection flow: Neo Monitors → Ahlsell → Bama Tek
 *                  Neo Monitors → SAS → Bama Tek
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { EXPERIENCE, CARD_GLOW_HOVER } from '../constants';
import type { ExperienceNode } from '../constants';

// ═══════════════════════════════════════════════════════════════════
// Desktop Topology Map
// ═══════════════════════════════════════════════════════════════════

/**
 * Maps an experience node's gridPosition to CSS Grid placement.
 * The topology uses a 5-column grid, so we map col 0-4 to
 * grid-column 1-5 (CSS Grid is 1-indexed).
 * Rows map similarly: row 0-2 → grid-row 1-3.
 */
function getGridStyle(node: ExperienceNode): React.CSSProperties {
  return {
    gridRow: node.gridPosition.row + 1,
    gridColumn: node.gridPosition.col + 1,
  };
}

/**
 * Desktop topology card — positioned in the CSS Grid.
 * The current job (Bama Tek) gets a pulsing border glow animation.
 * All cards get the accent glow hover effect.
 */
function TopologyCard({
  node,
  index,
  onRef,
}: {
  node: ExperienceNode;
  index: number;
  onRef: (id: string, el: HTMLDivElement | null) => void;
}) {
  return (
    <motion.div
      ref={(el) => onRef(node.id, el)}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={CARD_GLOW_HOVER}
      style={getGridStyle(node)}
      className={`p-5 rounded-lg corner-marks bg-bg-surface/90 backdrop-blur-sm border border-dashed transition-colors ${
        // Current job gets a pulsing accent glow via CSS animation
        node.current
          ? 'animate-border-glow border-accent/30'
          : 'border-accent/15 hover:border-accent/25'
      }`}
    >
      {/* Job title */}
      <h3 className="text-sm font-semibold text-text-primary mb-1">
        {node.title}
      </h3>
      {/* Company name in accent color */}
      <p className="text-xs text-accent mb-1 font-medium">{node.company}</p>
      {/* Date range */}
      <p className="text-xs text-text-muted mb-2">{node.period}</p>
      {/* Job description */}
      <p className="text-xs text-text-secondary leading-relaxed">
        {node.description}
      </p>
      {/* Skill pills */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {node.skills.map((skill) => (
          <span
            key={skill}
            className="text-[10px] px-2 py-0.5 rounded-md bg-bg-elevated text-text-muted"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/**
 * SVG connection lines between topology nodes.
 * Draws dashed lines from each node's center to the centers of
 * the nodes it connects to (defined in connectsTo array).
 *
 * Lines animate in with pathLength when scrolled into view.
 */
function ConnectionLines({
  positions,
}: {
  positions: Map<string, { x: number; y: number }>;
}) {
  // Build an array of line segments from the EXPERIENCE data
  const lines: { from: { x: number; y: number }; to: { x: number; y: number } }[] = [];

  for (const node of EXPERIENCE) {
    const fromPos = positions.get(node.id);
    if (!fromPos) continue;

    for (const targetId of node.connectsTo) {
      const toPos = positions.get(targetId);
      if (!toPos) continue;
      lines.push({ from: fromPos, to: toPos });
    }
  }

  if (lines.length === 0) return null;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      {lines.map((line, i) => (
        <motion.path
          key={`line-${i}`}
          d={`M ${line.from.x} ${line.from.y} L ${line.to.x} ${line.to.y}`}
          stroke="var(--color-accent)"
          strokeWidth={1}
          strokeDasharray="6 4"
          fill="none"
          opacity={0.25}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: i * 0.2, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Mobile Card Stack
// ═══════════════════════════════════════════════════════════════════

/**
 * Simple vertical card for mobile — no grid, no SVG lines.
 * Current job gets a left accent border for emphasis.
 */
function MobileCard({ node, index }: { node: ExperienceNode; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`p-5 rounded-lg corner-marks bg-bg-surface/90 backdrop-blur-sm border border-dashed transition-colors ${
        // Current job gets a left accent border strip
        node.current
          ? 'border-l-2 border-l-accent border-accent/15'
          : 'border-accent/15'
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <h3 className="text-base font-semibold text-text-primary">
          {node.title}
        </h3>
        {/* "Current" badge on active job */}
        {node.current && (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/10 text-accent">
            Current
          </span>
        )}
      </div>
      <p className="text-sm text-accent mb-1 font-medium">{node.company}</p>
      <p className="text-xs text-text-muted mb-2">{node.period}</p>
      <p className="text-sm text-text-secondary leading-relaxed">
        {node.description}
      </p>
      {/* Skill pills */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {node.skills.map((skill) => (
          <span
            key={skill}
            className="text-xs px-2 py-0.5 rounded-md bg-bg-elevated text-text-muted"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════

export default function Experience() {
  // Gate between topology (desktop) and card stack (mobile)
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // Store measured card center positions for SVG line drawing
  const [positions, setPositions] = useState<Map<string, { x: number; y: number }>>(new Map());
  // Ref to the grid container — used to calculate relative positions
  const gridRef = useRef<HTMLDivElement>(null);
  // Refs to each card element — stored in a Map keyed by node ID
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Callback for TopologyCard to register its DOM element
  const handleCardRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) {
      cardRefs.current.set(id, el);
    } else {
      cardRefs.current.delete(id);
    }
  }, []);

  // Measure card centers after render + fonts loaded.
  // We need fonts to be loaded because text affects card dimensions,
  // which affects center calculations for the SVG lines.
  useEffect(() => {
    if (!isDesktop) return;

    const measure = () => {
      const grid = gridRef.current;
      if (!grid) return;

      const gridRect = grid.getBoundingClientRect();
      const newPositions = new Map<string, { x: number; y: number }>();

      cardRefs.current.forEach((el, id) => {
        const rect = el.getBoundingClientRect();
        // Calculate center position relative to the grid container
        newPositions.set(id, {
          x: rect.left - gridRect.left + rect.width / 2,
          y: rect.top - gridRect.top + rect.height / 2,
        });
      });

      setPositions(newPositions);
    };

    // Wait for fonts to load before measuring — font loading can change
    // card dimensions and throw off our center calculations
    document.fonts.ready.then(() => {
      // Small delay to ensure the browser has laid out everything
      requestAnimationFrame(measure);
    });

    // Re-measure on window resize (debounced via RAF)
    let rafId: number;
    const onResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measure);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafId);
    };
  }, [isDesktop]);

  return (
    <section id="experience" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section heading — blueprint reference style */}
        <SectionHeading number="01" title="Experience" />

        {isDesktop ? (
          /* ── Desktop: Topology Map ─────────────────────────── */
          /* 5-column grid with SVG overlay for connection lines.
             The grid is relative-positioned so the SVG can be
             absolutely positioned on top. */
          <div ref={gridRef} className="relative">
            {/* SVG connection lines layer — sits on top of the grid */}
            <ConnectionLines positions={positions} />

            {/* CSS Grid — 5 columns, auto rows with gap */}
            <div className="grid grid-cols-5 gap-4 auto-rows-auto">
              {EXPERIENCE.map((node, i) => (
                <TopologyCard
                  key={node.id}
                  node={node}
                  index={i}
                  onRef={handleCardRef}
                />
              ))}

              {/* ── Hub Dot ─────────────────────────────────────
                  Small pulsing accent dot at the center of the grid
                  (row 2, col 3). Represents the "hub" connecting all
                  career paths. Purely decorative — no semantic meaning. */}
              <div
                className="flex items-center justify-center"
                style={{ gridRow: 2, gridColumn: 3 }}
                aria-hidden="true"
              >
                <div className="w-3 h-3 rounded-full bg-accent/40 animate-pulse-dot" />
              </div>
            </div>
          </div>
        ) : (
          /* ── Mobile: Vertical Card Stack ────────────────────── */
          /* Simple stacked cards — no grid, no SVG lines.
             Ordered newest-first (current job at top). */
          <div className="space-y-4">
            {EXPERIENCE.map((node, i) => (
              <MobileCard key={node.id} node={node} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
