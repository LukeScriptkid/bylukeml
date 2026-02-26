import { Mail, Linkedin, Github } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ── Contact Data ────────────────────────────────────────────────
// Single source of truth for contact info.
// Used by the Contact section (CTA + social row) and the footer.

export const EMAIL = 'lukas02liberg@gmail.com';

/** Shape of a social link entry used by SocialLinks component */
export interface SocialLink {
  icon: LucideIcon;  // Lucide icon component to render
  label: string;     // Used for aria-label and as the React key
  href: string;      // Full URL or mailto: link
}

// Social profiles — rendered as icon links in Contact and footer
export const SOCIALS: SocialLink[] = [
  {
    icon: Mail,
    label: 'Email',
    href: `mailto:${EMAIL}`,
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/lukas-liberg-959a5a367/',
  },
  {
    icon: Github,
    label: 'GitHub',
    href: 'https://github.com/LukeScriptkid',
  },
];

// ── Shared Animation Config ─────────────────────────────────────
// Reused across Experience, Roadmap, and Projects cards so every
// card hover feels identical. Spring type gives a natural feel,
// y: -3 is subtle enough to not distract but enough to notice.

/** Card hover animation — gentle spring lift on mouse enter */
export const CARD_LIFT_HOVER = {
  y: -3, // Lift 3px upward
  transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
};
