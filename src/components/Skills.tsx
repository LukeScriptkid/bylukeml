import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import TextReveal from './motion/TextReveal';

/**
 * Skills section — magazine split layout.
 *
 * Desktop: skills on the left (60%), certifications on the right (40%).
 * Skills are displayed as pill chips in two groups: "Working With"
 * (current tools) and "Learning" (roadmap skills).
 *
 * Cert cards change appearance based on the "earned" flag — earned
 * certs get a green tint, planned ones get the default card style.
 */

// Skills currently being used at work or in projects
const CURRENT_SKILLS = [
  'Azure', 'Active Directory', 'Python', 'Windows Server',
  'Service Desk', 'PowerShell', 'React', 'TypeScript',
  'Git', 'Tailwind CSS',
];

// Skills being learned as part of the career roadmap
const LEARNING_SKILLS = [
  'Docker', 'Linux', 'Machine Learning', 'scikit-learn',
  'PyTorch', 'Kubernetes', 'Terraform', 'MLflow',
  'CI/CD', 'FastAPI',
];

// Certification targets — flip "earned" to true and the card turns green
const CERTS = [
  { name: 'AZ-900', full: 'Azure Fundamentals', target: 'Oct 2026', earned: false },
  { name: 'AZ-104', full: 'Azure Administrator', target: 'Jun 2027', earned: false },
  { name: 'CKA', full: 'Certified Kubernetes Administrator', target: 'Sep 2027', earned: false },
];

export default function Skills() {
  return (
    <section id="skills" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Magazine split — 3fr/2fr gives skills 60% and certs 40% */}
        <div className="grid md:grid-cols-[3fr_2fr] gap-12 md:gap-16">
          {/* Left column — heading + skill chip groups */}
          <div>
            <TextReveal text="Skills" className="text-3xl sm:text-4xl font-bold mb-14" />

            <div className="space-y-10">
              {/* Current skills — primary-colored pill chips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
                  Working With
                </h3>
                <div className="flex flex-wrap gap-2">
                  {CURRENT_SKILLS.map((skill) => (
                    <span
                      key={skill}
                      className="text-sm px-3 py-1.5 rounded-lg bg-bg-card text-text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Learning skills — muted text to visually distinguish from current */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
                  Learning
                </h3>
                <div className="flex flex-wrap gap-2">
                  {LEARNING_SKILLS.map((skill) => (
                    <span
                      key={skill}
                      className="text-sm px-3 py-1.5 rounded-lg bg-bg-card text-text-muted"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right column — certification cards */}
          <div>
            {/*
              mt-[4.75rem] on desktop aligns the "Certifications" label
              with the first skill group, since the left column has the
              TextReveal heading + mb-14 taking up that space.
            */}
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 md:mt-[4.75rem]">
              Certifications
            </h3>
            <div className="space-y-3">
              {CERTS.map((cert, i) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, x: 20 }} // Slides in from the right
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-5 rounded-2xl transition-colors ${
                    // Earned certs get a subtle green tint, planned ones use default card bg
                    cert.earned
                      ? 'bg-success/5'
                      : 'bg-bg-card hover:bg-bg-hover'
                  }`}
                >
                  {/* Top row — cert name + icon on left, status badge on right */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {/* Award icon turns green when earned */}
                      <Award
                        size={16}
                        className={cert.earned ? 'text-success' : 'text-text-muted'}
                      />
                      <span className="text-sm font-semibold text-text-primary">
                        {cert.name}
                      </span>
                    </div>
                    {/* Status pill — "Earned" in green or "Planned" in muted */}
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        cert.earned
                          ? 'bg-success/10 text-success'
                          : 'bg-bg-hover text-text-muted'
                      }`}
                    >
                      {cert.earned ? 'Earned' : 'Planned'}
                    </span>
                  </div>
                  {/* Full certification name */}
                  <p className="text-xs text-text-secondary">{cert.full}</p>
                  {/* Target date or "Completed" if earned */}
                  <p className="text-xs text-text-muted mt-1">
                    {cert.earned ? 'Completed' : `Target: ${cert.target}`}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
