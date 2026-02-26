import { motion } from 'framer-motion';

/**
 * Word-by-word staggered text reveal for section headings.
 *
 * Each word fades up individually with a cascading delay, creating
 * a smooth entrance effect when the heading scrolls into view.
 *
 * Uses Framer Motion variants with staggerChildren so the parent
 * h-tag orchestrates the timing and each word animates independently.
 *
 * The "as" prop lets you choose the semantic heading level (h1/h2/h3)
 * while keeping the same animation behavior.
 */

// Animation for each individual word: starts invisible + shifted down
const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

// Maps heading tag names to their Framer Motion equivalents
// so we can use motion.h1, motion.h2, etc. dynamically
const motionTags = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
};

interface TextRevealProps {
  text: string;               // The heading text to animate
  as?: 'h1' | 'h2' | 'h3';  // Which HTML heading tag to render (default h2)
  className?: string;         // Tailwind classes for sizing, weight, etc.
  delay?: number;             // Seconds to wait before starting the animation
}

export default function TextReveal({
  text,
  as = 'h2',
  className,
  delay = 0,
}: TextRevealProps) {
  // Pick the right motion component based on the "as" prop
  const MotionTag = motionTags[as];
  // Split text into individual words for per-word animation
  const words = text.split(' ');

  return (
    <MotionTag
      // Parent variant controls the stagger timing across all words
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08, // 80ms between each word
            delayChildren: delay,
          },
        },
      }}
      initial="hidden"
      whileInView="visible" // Triggers when the heading scrolls into view
      viewport={{ once: true, margin: '-80px' }} // Triggers 80px before it's fully visible
      className={className}
      style={{ overflow: 'hidden' }} // Prevents the y-translate from showing above the heading
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={wordVariants}
          className="inline-block"
          style={{ marginRight: '0.25em' }} // Word spacing since inline-block strips whitespace
        >
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
}
