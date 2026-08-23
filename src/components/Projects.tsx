/**
 * Projects — Infrastructure-themed project cards.
 *
 * Each project is styled like a running service/container status panel,
 * matching the network architect visual language. Cards show:
 * - Status indicator dot (green=live, yellow=in-progress, gray=planned)
 * - Project name
 * - Description
 * - Tech stack pills
 * - Optional GitHub/live links
 *
 * Grid layout:
 *   Desktop: 2 columns
 *   Mobile: 1 column (stacked)
 *
 * Uses PROJECTS data from constants.ts.
 */

import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { PROJECTS, CARD_GLOW_HOVER } from '../constants';
import type { Project } from '../constants';

// ── Status Indicator Config ──────────────────────────────────────
// Maps project status to a colored dot and label.
// Colors match semantic meanings: green=active, yellow=wip, gray=planned.

interface StatusConfig {
  dotClass: string;  // Tailwind bg class for the status dot
  label: string;     // Human-readable status text
}

const STATUS_MAP: Record<Project['status'], StatusConfig> = {
  live: {
    dotClass: 'bg-success',
    label: 'Live',
  },
  'in-progress': {
    dotClass: 'bg-warning',
    label: 'In Progress',
  },
  planned: {
    dotClass: 'bg-text-ghost',
    label: 'Planned',
  },
};

/**
 * Single project card styled as an infrastructure service panel.
 * Status dot + name in the header, description in the body,
 * tech pills at the bottom.
 */
function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const status = STATUS_MAP[project.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={CARD_GLOW_HOVER}
      className="p-5 sm:p-6 rounded-lg corner-marks bg-bg-surface/90 backdrop-blur-sm border border-dashed border-accent/15 hover:border-accent/25 transition-colors"
    >
      {/* ── Header Row ─────────────────────────────────────────
          Status dot + name on the left, link icons on the right */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Status indicator dot — colored by project status */}
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${status.dotClass}`}
            title={status.label}
          />
          <h3 className="text-base font-semibold text-text-primary">
            {project.name}
          </h3>
        </div>

        {/* External link icons — GitHub and/or live site */}
        <div className="flex gap-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.name} on GitHub`}
              className="text-text-muted hover:text-text-primary transition-colors"
            >
              <Github size={16} />
            </a>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.name} live site`}
              className="text-text-muted hover:text-text-primary transition-colors"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>

      {/* ── Description ────────────────────────────────────────── */}
      <p className="text-sm text-text-secondary leading-relaxed mb-4">
        {project.description}
      </p>

      {/* ── Tech Stack Pills ───────────────────────────────────── */}
      {/* Small muted pills for each technology used */}
      <div className="flex flex-wrap gap-1.5">
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="text-xs px-2 py-0.5 rounded-md bg-bg-elevated text-text-muted border border-border"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ── Main Component ───────────────────────────────────────────────

export default function Projects() {
  return (
    <section id="projects" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section heading — blueprint reference style */}
        <SectionHeading number="04" title="Projects" />

        {/* Asymmetric grid — first project spans full width on desktop,
            remaining cards fill a 2-col grid below. Breaks the uniform
            template feel and gives the featured project more presence. */}
        <div className="grid md:grid-cols-2 gap-4">
          {PROJECTS.map((project, i) => (
            <div key={project.id} className={i === 0 ? 'md:col-span-2' : ''}>
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
