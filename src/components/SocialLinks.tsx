import { motion } from 'framer-motion';
import { SOCIALS } from '../constants';

/**
 * Reusable social icon row.
 *
 * Renders the shared SOCIALS data (from constants.ts) as animated
 * links with spring-bounce hover effects. Used in two places:
 *   - Contact section (20px icons, right-aligned on desktop)
 *   - Footer (14px icons, centered/right)
 *
 * The parent controls layout via className (flex direction, gap, etc.)
 * and icon size via iconSize prop.
 */

interface SocialLinksProps {
  /** Size of each Lucide icon in pixels (default 18) */
  iconSize?: number;
  /** Tailwind classes for the wrapper div — controls layout and spacing */
  className?: string;
}

export default function SocialLinks({ iconSize = 18, className }: SocialLinksProps) {
  return (
    <div className={className}>
      {SOCIALS.map(({ icon: Icon, label, href }) => {
        // mailto links shouldn't open in a new tab, but external URLs should
        const isExternal = !href.startsWith('mailto:');
        return (
          <motion.a
            key={label}
            href={href}
            // Only add target/rel for external links (LinkedIn, GitHub)
            {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
            className="text-text-muted hover:text-accent transition-colors"
            aria-label={label}
            // Spring-bounce: scales up and lifts slightly on hover
            whileHover={{ scale: 1.2, y: -2 }}
            whileTap={{ scale: 0.9 }} // Press-down feedback
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Icon size={iconSize} />
          </motion.a>
        );
      })}
    </div>
  );
}
