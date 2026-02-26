import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import TextReveal from './motion/TextReveal';
import SocialLinks from './SocialLinks';
import { EMAIL } from '../constants';

/**
 * Contact section — magazine split layout.
 *
 * Desktop: heading + subtitle on the left, email CTA + social
 * icons on the right. Collapses to a centered stack on mobile.
 */

export default function Contact() {
  return (
    <section id="contact" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* 50/50 grid — heading left, actions right */}
        <div className="grid md:grid-cols-2 gap-12 md:items-center">
          {/* Left column — heading with word-by-word reveal + subtitle */}
          <div>
            <TextReveal text="Let's connect" className="text-4xl sm:text-5xl font-bold mb-4" />
            {/* Subtitle fades in after the heading finishes revealing */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-text-secondary text-lg leading-relaxed"
            >
              Got a project in mind, a question, or just want to chat?
            </motion.p>
          </div>

          {/* Right column — CTA button + social icon row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="md:text-right" // Right-aligns content on desktop
          >
            {/* Primary CTA — mailto link styled as a button */}
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-white font-medium rounded-xl hover:bg-accent-hover transition-colors mb-6"
            >
              <Mail size={18} />
              Say Hello
            </a>

            {/* Social icons — reusable component with spring-bounce hover.
                md:justify-end right-aligns the icons to match the CTA above. */}
            <SocialLinks iconSize={20} className="flex md:justify-end gap-6" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
