/**
 * Contact — Minimal contact section.
 *
 * Just a heading, a short line, and the social icons. That's it.
 */

import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import SocialLinks from './SocialLinks';

export default function Contact() {
  return (
    <section id="contact" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading number="05" title="Contact" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <p className="text-text-secondary text-sm">
            You can find me here:
          </p>

          <SocialLinks iconSize={22} className="flex items-center gap-6" />
        </motion.div>
      </div>
    </section>
  );
}
