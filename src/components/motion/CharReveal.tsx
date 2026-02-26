import { motion } from 'framer-motion';

/**
 * Character-by-character staggered reveal for the hero heading.
 *
 * Accepts multiple text segments (parts) so different portions can
 * have different styles — e.g. the last name in accent color.
 *
 * Uses "animate" instead of "whileInView" because the hero is
 * always visible on page load (no need to wait for scroll).
 *
 * Each character is wrapped in an inline-block motion.span so
 * translateY works (block-level transform on inline elements
 * doesn't work in CSS).
 */

// Animation for each individual character: starts invisible + shifted down,
// then fades in and slides to its final position
const charVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    // "as const" tells TypeScript this is the literal 'easeOut', not just string
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

// A single segment of text with optional styling
interface TextPart {
  text: string;       // The characters to render
  className?: string; // Optional Tailwind classes (e.g. 'text-accent')
}

interface CharRevealProps {
  parts: TextPart[];   // Array of text segments to animate
  className?: string;  // Classes for the outer h1 wrapper
  delay?: number;      // Seconds to wait before starting the animation
}

export default function CharReveal({
  parts,
  className,
  delay = 0,
}: CharRevealProps) {
  // Flatten all parts into a single array of characters,
  // each carrying its parent part's className for styling
  const chars = parts.flatMap((part) =>
    part.text.split('').map((char) => ({
      char,
      className: part.className || '',
    }))
  );

  return (
    <motion.h1
      // Parent variant orchestrates the stagger timing
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.03, // 30ms between each character
            delayChildren: delay,  // Wait before the first character starts
          },
        },
      }}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {chars.map((c, i) => (
        <motion.span
          key={`${c.char}-${i}`}
          variants={charVariants} // Each child inherits the hidden/visible animation
          className={`inline-block ${c.className}`}
          // Spaces collapse in inline-block elements, so we give them
          // explicit width and render a non-breaking space character
          style={c.char === ' ' ? { width: '0.3em' } : undefined}
        >
          {c.char === ' ' ? '\u00A0' : c.char}
        </motion.span>
      ))}
    </motion.h1>
  );
}
