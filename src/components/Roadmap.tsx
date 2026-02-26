import { motion } from 'framer-motion';
import { Target, CheckCircle2, Circle, Clock } from 'lucide-react';
import TextReveal from './motion/TextReveal';
import { CARD_LIFT_HOVER } from '../constants';

/**
 * Roadmap section — the CENTERPIECE of the portfolio.
 *
 * This is Luke's differentiator: a clear, intentional career plan
 * that most juniors don't have. Gets a bigger centered heading,
 * a subtle accent glow behind the section, and prominent phase
 * cards with a vertical connecting line on desktop.
 *
 * Phase dots glow cyan on card hover using Tailwind's group-hover
 * (pure CSS, no JS needed for the hover effect).
 */

// Allowed status values — drives which icon and color each phase gets
type PhaseStatus = 'completed' | 'in-progress' | 'upcoming';

// Shape of a single roadmap phase
interface Phase {
  number: number;        // 1-6, displayed in the sidebar dots
  title: string;         // Phase heading
  period: string;        // Target date range
  status: PhaseStatus;   // Controls icon, color, and badge text
  description: string;   // One-liner explaining the phase
  milestones: string[];  // 4 key deliverables per phase
}

// The 6 career phases — update the status field as you progress
const PHASES: Phase[] = [
  {
    number: 1,
    title: 'Python & Docker Foundation',
    period: 'Mar – Jun 2026',
    status: 'in-progress',
    description: 'Building core skills in Python automation and containerization with Docker.',
    milestones: ['Python automation projects', 'Docker & containerization', 'Linux fundamentals', 'First GitHub portfolio pieces'],
  },
  {
    number: 2,
    title: 'ML Fundamentals',
    period: 'Jul – Oct 2026',
    status: 'upcoming',
    description: 'Training first ML models, learning scikit-learn and PyTorch, deploying to Azure.',
    milestones: ['fast.ai course', 'scikit-learn & PyTorch', 'First model deployed to Azure', 'AZ-900 Certification'],
  },
  {
    number: 3,
    title: 'First ML Project',
    period: 'Nov 2026 – Feb 2027',
    status: 'upcoming',
    description: 'End-to-end ML project: data pipeline, model training, API, Docker, and cloud deployment.',
    milestones: ['Complete ML pipeline', 'REST API serving predictions', 'Deployed on Azure', 'Documented on GitHub'],
  },
  {
    number: 4,
    title: 'MLOps Tools & AZ-104',
    period: 'Mar – Jun 2027',
    status: 'upcoming',
    description: 'Learning CI/CD pipelines, MLflow, Kubernetes, Terraform, and earning Azure Administrator cert.',
    milestones: ['GitHub Actions CI/CD', 'MLflow experiment tracking', 'Kubernetes basics', 'AZ-104 Certification'],
  },
  {
    number: 5,
    title: 'Portfolio Project & CKA',
    period: 'Jul – Sep 2027',
    status: 'upcoming',
    description: 'Building a full MLOps pipeline project and earning the Kubernetes Administrator certification.',
    milestones: ['Full MLOps pipeline', 'Infrastructure as Code', 'CKA Certification', 'Architecture documentation'],
  },
  {
    number: 6,
    title: 'Launch',
    period: 'Oct – Nov 2027',
    status: 'upcoming',
    description: 'Apprenticeship complete. Entering the job market as an MLOps / ML Engineer.',
    milestones: ['IT Operations certificate', 'Job applications', 'Technical interview prep', 'Career launch'],
  },
];

// Maps each status to its icon, color classes, and badge label.
// Uses the "success" theme color for completed phases so it stays
// consistent with the rest of the design system.
const STATUS_CONFIG = {
  'completed': { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', label: 'Completed' },
  'in-progress': { icon: Clock, color: 'text-accent-hover', bg: 'bg-accent/10', label: 'In Progress' },
  'upcoming': { icon: Circle, color: 'text-text-muted', bg: 'bg-bg-hover', label: 'Upcoming' },
};

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-28 px-6 relative">
      {/* Subtle gradient glow behind the section — makes it feel visually distinct */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.02] via-transparent to-transparent pointer-events-none" />

      {/* relative so content sits above the gradient glow */}
      <div className="relative max-w-6xl mx-auto">
        {/* Centered heading — intentionally larger (5xl) than other sections to signal importance */}
        <TextReveal text="Roadmap" className="text-4xl sm:text-5xl font-bold text-center mb-6" />

        {/* Subtitle — fades in after the heading reveals */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-text-muted text-base mb-16 max-w-xl mx-auto text-center"
        >
          My plan from IT Operations apprentice to MLOps Engineer.
          Updated as I progress.
        </motion.p>

        {/* Goal badge — target role callout centered above the timeline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 mb-14 p-5 rounded-2xl bg-bg-card max-w-xl mx-auto"
        >
          <Target size={18} className="text-accent shrink-0" />
          <div>
            <p className="text-sm font-medium text-text-primary">Target: MLOps / ML Engineer</p>
            <p className="text-xs text-text-muted">Apprenticeship ends, career begins</p>
          </div>
        </motion.div>

        {/* Phase cards with vertical connecting line */}
        <div className="relative">
          {/* Vertical line — connects phase dots, desktop only.
              left-[23px] aligns it to the center of the 48px (w-12) dots. */}
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-accent/20 via-border/30 to-transparent hidden md:block" />

          <div className="space-y-5">
            {PHASES.map((phase, i) => {
              // Look up the icon, colors, and label for this phase's status
              const config = STATUS_CONFIG[phase.status];
              const StatusIcon = config.icon;

              return (
                <motion.div
                  key={phase.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }} // Slight stagger per card
                  className="group relative md:pl-16" // "group" enables group-hover on the dot
                >
                  {/*
                    Phase number dot — desktop only (hidden md:flex).
                    Completed phases get the success color.
                    Upcoming/in-progress phases glow cyan on card hover via group-hover.
                    The shadow uses --accent-rgb for theme-aware glow color.
                  */}
                  <div
                    className={`hidden md:flex absolute left-0 top-5 w-12 h-12 rounded-full items-center justify-center text-sm font-bold border-2 transition-all duration-700 ease-in-out ${
                      phase.status === 'completed'
                        ? 'bg-success/10 border-success text-success'
                        : 'bg-bg-darkest border-border text-text-muted group-hover:bg-accent/10 group-hover:border-accent group-hover:text-accent-hover group-hover:shadow-[0_0_16px_rgba(var(--accent-rgb),0.35)]'
                    }`}
                  >
                    {phase.number}
                  </div>

                  {/* Phase card — lifts on hover via shared spring config */}
                  <motion.div
                    whileHover={CARD_LIFT_HOVER}
                    className="p-6 rounded-2xl bg-bg-card hover:bg-bg-hover transition-colors"
                  >
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      {/*
                        Inline phase number for mobile — shows inside the card
                        since the sidebar dots are hidden on small screens.
                      */}
                      <span className="md:hidden text-xs font-bold text-text-muted bg-bg-hover rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                        {phase.number}
                      </span>
                      <h3 className="text-lg font-semibold text-text-primary">
                        {phase.title}
                      </h3>
                      {/* Status badge — colored pill showing Completed/In Progress/Upcoming */}
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                        {config.label}
                      </span>
                    </div>

                    <p className="text-sm text-text-secondary mb-4">{phase.description}</p>

                    {/* Milestones grid — 2 columns on sm+, each with a status icon */}
                    <div className="grid sm:grid-cols-2 gap-2">
                      {phase.milestones.map((milestone) => (
                        <div key={milestone} className="flex items-center gap-2">
                          <StatusIcon size={12} className={config.color} />
                          <span className="text-xs text-text-muted">{milestone}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
