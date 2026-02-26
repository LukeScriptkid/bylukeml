import { motion } from 'framer-motion';
import { ExternalLink, Github, Clock } from 'lucide-react';
import TextReveal from './motion/TextReveal';
import { CARD_LIFT_HOVER } from '../constants';

/**
 * Projects section — magazine split layout.
 *
 * Desktop: heading + intro text on the left (40%, sticky), project
 * cards on the right (60%). Scrolling the right column keeps the
 * left heading visible via position:sticky.
 *
 * Projects are split into two groups:
 *   - "featured" (live or in-progress) — large cards with full detail
 *   - "upcoming" (planned) — compact cards in a 2-column grid
 */

// Shape of a single project entry
interface Project {
  title: string;
  description: string;
  tech: string[];                              // Tech stack tags
  status: 'live' | 'in-progress' | 'planned'; // Determines card style and badge
  github?: string;                             // Optional GitHub repo URL
  live?: string;                               // Optional live site URL
  phase?: string;                              // Which roadmap phase it maps to
}

// Project entries — update as you build them
const PROJECTS: Project[] = [
  {
    title: 'bylukeml',
    description: 'This portfolio site, designed and built from scratch. Dark/light mode, responsive layout, scroll animations, and a custom warm color system.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    status: 'live',
    github: 'https://github.com/LukeScriptkid/bylukeml',
  },
  {
    title: 'Agentation',
    description: 'A React application exploring AI agent concepts and interactions. Built to learn React fundamentals and modern frontend development.',
    tech: ['React', 'JavaScript', 'Vite'],
    status: 'in-progress',
    github: 'https://github.com/LukeScriptkid',
    phase: 'Phase 1',
  },
  {
    title: 'Python Automation Tools',
    description: 'Collection of Python scripts for IT operations. Automating repetitive tasks, log parsing, and system reporting.',
    tech: ['Python', 'Pandas', 'Azure API'],
    status: 'planned',
    phase: 'Phase 1',
  },
  {
    title: 'ML Model Pipeline',
    description: 'End-to-end ML project: data preparation, model training, REST API, Docker container, deployed to Azure.',
    tech: ['Python', 'scikit-learn', 'Flask', 'Docker', 'Azure'],
    status: 'planned',
    phase: 'Phase 3',
  },
  {
    title: 'MLOps Pipeline',
    description: 'Full MLOps pipeline with CI/CD, experiment tracking, Kubernetes deployment, and infrastructure as code.',
    tech: ['MLflow', 'Kubernetes', 'Terraform', 'GitHub Actions'],
    status: 'planned',
    phase: 'Phase 5',
  },
];

// Human-readable labels for each status shown in badge pills
const STATUS_LABELS = {
  'live': 'Live',
  'in-progress': 'In Progress',
  'planned': 'Coming Soon',
};

export default function Projects() {
  // Split projects into two groups for different card treatments
  const featured = PROJECTS.filter((p) => p.status !== 'planned');
  const upcoming = PROJECTS.filter((p) => p.status === 'planned');

  return (
    <section id="projects" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Magazine split — 2fr/3fr grid gives heading 40%, cards 60% */}
        <div className="grid md:grid-cols-[2fr_3fr] gap-12 md:gap-16">
          {/* Left column — heading + intro text, sticks while scrolling */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="md:sticky md:top-24" // Stays visible while right column scrolls
            >
              <TextReveal text="Projects" className="text-3xl sm:text-4xl font-bold mb-4" />
              <p className="text-text-secondary leading-relaxed">
                Building in public. Real projects, real learning. Each one maps to a phase in the roadmap.
              </p>
            </motion.div>
          </div>

          {/* Right column — project cards */}
          <div>
            {/* Featured projects (live / in-progress) — full-width cards */}
            <div className="space-y-4 mb-4">
              {featured.map((project, i) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={CARD_LIFT_HOVER}
                  className="p-8 rounded-2xl bg-bg-card hover:bg-bg-hover transition-colors"
                >
                  {/* Header row — title + status badge on left, link icons on right */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="text-xl font-semibold text-text-primary">
                          {project.title}
                        </h3>
                        {/* Status pill — accent-colored badge */}
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                          {STATUS_LABELS[project.status]}
                        </span>
                      </div>
                      {/* Roadmap phase label — only shows if project has a phase */}
                      {project.phase && (
                        <p className="text-xs text-text-muted">{project.phase}</p>
                      )}
                    </div>
                    {/* External link icons — GitHub and/or live site */}
                    <div className="flex gap-3">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} on GitHub`}
                          className="text-text-muted hover:text-text-primary transition-colors"
                        >
                          <Github size={18} />
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} live site`}
                          className="text-text-muted hover:text-text-primary transition-colors"
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Project description */}
                  <p className="text-text-secondary mb-5 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech stack tags — small muted pills */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-medium px-2.5 py-1 rounded-lg bg-bg-hover text-text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Planned projects — smaller cards in a 2-column grid */}
            <div className="grid sm:grid-cols-2 gap-3">
              {upcoming.map((project, i) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-5 rounded-2xl bg-bg-card"
                >
                  {/* Compact header — title + clock icon indicating "coming soon" */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-text-primary">
                      {project.title}
                    </h3>
                    <Clock size={14} className="text-text-muted/50" />
                  </div>
                  <p className="text-xs text-text-secondary mb-3 leading-relaxed">
                    {project.description}
                  </p>
                  {/* Tech stack — even smaller pills for compact cards */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-bg-hover text-text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
