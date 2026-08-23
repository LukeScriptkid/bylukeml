/**
 * constants.ts — Single source of truth for all portfolio data.
 *
 * This file contains every piece of content displayed on the site:
 * contact info, experience history, certifications, skills, projects,
 * navigation config, and shared animation presets.
 *
 * Keeping all data here means the components stay pure — they just
 * render whatever they're given, making the site easy to update
 * without touching component logic.
 */

import { Mail, Linkedin, Github } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════
// Contact Data
// ═══════════════════════════════════════════════════════════════════

/** Luke's primary contact email — used in mailto links and CTA buttons */
export const EMAIL = 'lukas02liberg@gmail.com';

/** Shape of a social link entry used by the SocialLinks component */
export interface SocialLink {
  icon: LucideIcon; // Lucide icon component to render
  label: string;    // Accessible label and React key
  href: string;     // Full URL or mailto: link
}

/** Social profiles — rendered as icon links in Contact section and footer */
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

// ═══════════════════════════════════════════════════════════════════
// Experience Data
// ═══════════════════════════════════════════════════════════════════
// Each experience node has a grid position for the desktop topology
// map layout. connectsTo defines which nodes this one links to via
// SVG connection lines.

/** Shape of a single experience entry for the topology map */
export interface ExperienceNode {
  id: string;                                    // Unique identifier for SVG connections
  title: string;                                 // Job title
  company: string;                               // Company name
  period: string;                                // Date range string
  current: boolean;                              // Is this the active/current job?
  description: string;                           // One-line job summary
  skills: string[];                              // Key skills used in this role
  gridPosition: { row: number; col: number };    // Position in the desktop topology grid
  connectsTo: string[];                          // IDs of nodes this one connects to
}

/** Work experience entries — positioned for a network topology visual */
export const EXPERIENCE: ExperienceNode[] = [
  {
    id: 'bama-tek',
    title: 'IT Operations Apprentice',
    company: 'Bama Tek',
    period: 'Nov 2025 - Present',
    current: true,
    description: 'Service desk, Active Directory, Azure administration, Microsoft 365, troubleshooting, and hardware support.',
    skills: ['Active Directory', 'Azure', 'Microsoft 365', 'Troubleshooting'],
    gridPosition: { row: 0, col: 2 },
    connectsTo: [],
  },
  {
    id: 'ahlsell',
    title: 'Warehouse Operative',
    company: 'Ahlsell',
    period: 'Apr - Aug 2025',
    current: false,
    description: 'Warehouse logistics and operations.',
    skills: ['Logistics', 'Operations'],
    gridPosition: { row: 1, col: 1 },
    connectsTo: ['bama-tek'],
  },
  {
    id: 'sas',
    title: 'Flight Worker',
    company: 'SAS',
    period: 'May 2022 - Mar 2026',
    current: false,
    description: 'Four years in aviation operations. High-pressure, safety-critical environment. Part-time from 2024.',
    skills: ['Aviation Ops', 'Safety Systems', 'Teamwork'],
    gridPosition: { row: 1, col: 3 },
    connectsTo: ['bama-tek'],
  },
  {
    id: 'neo-monitors',
    title: 'Hardware Technician',
    company: 'Neo Monitors',
    period: 'Sep 2020 - Dec 2021',
    current: false,
    description: 'Assembled lasergas measurement units. Soldering, quality testing, calibration.',
    skills: ['Soldering', 'Hardware', 'QA Testing'],
    gridPosition: { row: 2, col: 2 },
    connectsTo: ['ahlsell', 'sas'],
  },
];

// ═══════════════════════════════════════════════════════════════════
// Certifications
// ═══════════════════════════════════════════════════════════════════
// Displayed as a horizontal pipeline on desktop, vertical stack on mobile.
// Order determines left-to-right (or top-to-bottom) rendering.

/** Shape of a certification entry for the CertPath pipeline */
export interface Certification {
  id: string;                                // Unique identifier
  name: string;                              // Short cert name (e.g. "CCNA")
  fullName: string;                          // Full official name
  vendor: 'Cisco' | 'Microsoft';            // Cert vendor for potential filtering/styling
  status: 'studying' | 'earned' | 'planned'; // Current progress state
  targetDate?: string;                       // When Luke aims to earn it
  order: number;                             // Display position in the pipeline
}

/** Certification pipeline — ordered from nearest to ultimate goal */
export const CERTIFICATIONS: Certification[] = [
  { id: 'az900', name: 'AZ-900', fullName: 'Azure Fundamentals', vendor: 'Microsoft', status: 'studying', targetDate: '2027', order: 0 },
  { id: 'ccna', name: 'CCNA', fullName: 'Cisco Certified Network Associate', vendor: 'Cisco', status: 'studying', targetDate: '2027', order: 1 },
  { id: 'ccnp', name: 'CCNP', fullName: 'Cisco Certified Network Professional', vendor: 'Cisco', status: 'planned', order: 2 },
  { id: 'ccie', name: 'CCIE', fullName: 'Cisco Certified Internetwork Expert', vendor: 'Cisco', status: 'planned', order: 3 },
];

// ═══════════════════════════════════════════════════════════════════
// Skills
// ═══════════════════════════════════════════════════════════════════
// Grouped by category for the cluster grid layout. Weight controls
// pill sizing (1=small, 2=medium, 3=large) — heavier skills get
// more visual prominence.

/** Shape of a skill entry for the cluster grid */
export interface SkillNode {
  name: string;                                           // Display name
  category: 'networking' | 'cloud' | 'systems' | 'tools'; // Which cluster group
  level: 'working' | 'learning';                          // Current proficiency
  weight: 1 | 2 | 3;                                     // Visual size (1=small, 3=large)
}

/** All skills — grouped by category, weighted by importance */
export const SKILLS: SkillNode[] = [
  // ── Networking ─────────────────────────────────────────
  { name: 'TCP/IP', category: 'networking', level: 'learning', weight: 3 },
  { name: 'Subnetting', category: 'networking', level: 'learning', weight: 2 },
  { name: 'VLANs', category: 'networking', level: 'learning', weight: 2 },
  { name: 'Routing', category: 'networking', level: 'learning', weight: 2 },
  { name: 'Switching', category: 'networking', level: 'learning', weight: 2 },
  { name: 'DNS/DHCP', category: 'networking', level: 'working', weight: 2 },
  { name: 'Firewalls', category: 'networking', level: 'learning', weight: 1 },
  { name: 'Cisco IOS', category: 'networking', level: 'learning', weight: 2 },
  // ── Cloud & Identity ───────────────────────────────────
  { name: 'Azure', category: 'cloud', level: 'working', weight: 3 },
  { name: 'Active Directory', category: 'cloud', level: 'working', weight: 3 },
  { name: 'Microsoft 365', category: 'cloud', level: 'working', weight: 2 },
  // ── Systems ────────────────────────────────────────────
  { name: 'Windows Server', category: 'systems', level: 'working', weight: 2 },
  { name: 'Linux', category: 'systems', level: 'learning', weight: 2 },
  { name: 'PowerShell', category: 'systems', level: 'working', weight: 2 },
  { name: 'Python', category: 'systems', level: 'working', weight: 2 },
  { name: 'Docker', category: 'systems', level: 'learning', weight: 2 },
  // ── Tools ──────────────────────────────────────────────
  { name: 'Wireshark', category: 'tools', level: 'learning', weight: 1 },
  { name: 'Packet Tracer', category: 'tools', level: 'working', weight: 2 },
  { name: 'Git', category: 'tools', level: 'working', weight: 1 },
  { name: 'Service Desk', category: 'tools', level: 'working', weight: 2 },
];

// ═══════════════════════════════════════════════════════════════════
// Projects
// ═══════════════════════════════════════════════════════════════════
// Displayed as "infrastructure service" cards with status indicators.

/** Shape of a project entry */
export interface Project {
  id: string;                                    // Unique identifier
  name: string;                                  // Project display name
  description: string;                           // One-line summary
  status: 'live' | 'in-progress' | 'planned';   // Current state
  tech: string[];                                // Tech stack tags
  link?: string;                                 // Optional live URL
  github?: string;                               // Optional GitHub repo URL
}

/** Lab/infrastructure projects — mix of active and planned */
export const PROJECTS: Project[] = [
  {
    id: 'minecraft-docker',
    name: 'Minecraft Server',
    description: 'Dockerized Minecraft server. A forever world for friends, self-hosted on a dedicated server.',
    status: 'planned',
    tech: ['Docker', 'Linux', 'Networking'],
  },
  {
    id: 'cisco-lab',
    name: 'Cisco 2960 Home Lab',
    description: 'Hands-on network lab with a Cisco 2960 switch. VLAN configuration, trunking, and switch management.',
    status: 'planned',
    tech: ['Cisco IOS', 'VLANs', 'Switching'],
  },
  {
    id: 'smart-home',
    name: 'Smart Home Server',
    description: 'Self-hosted smart home platform running on a home server. Home automation and monitoring.',
    status: 'planned',
    tech: ['Docker', 'Linux', 'IoT', 'Networking'],
  },
  {
    id: 'self-hosting',
    name: 'Self-Hosted Web Infrastructure',
    description: 'Personal sites hosted in isolated Docker containers on a dedicated server with reverse proxy.',
    status: 'planned',
    tech: ['Docker', 'Nginx', 'Linux', 'DNS'],
  },
];

// ═══════════════════════════════════════════════════════════════════
// Navigation & Section IDs
// ═══════════════════════════════════════════════════════════════════
// SECTION_IDS drives both the scroll-spy hook and the nav link
// generation. Adding/removing a section here automatically updates
// the navbar.

/** All scrollable section IDs — order determines nav link order */
export const SECTION_IDS = ['about', 'experience', 'certifications', 'skills', 'projects', 'contact'] as const;

/** Navigation links derived from section IDs — auto-capitalized labels */
export const NAV_LINKS = SECTION_IDS.map(id => ({
  label: id.charAt(0).toUpperCase() + id.slice(1),
  href: `#${id}`,
}));

// ═══════════════════════════════════════════════════════════════════
// Shared Animation Config
// ═══════════════════════════════════════════════════════════════════
// Used across all card components for consistent hover behavior.
// Border glow instead of lift — matches the network/infrastructure
// visual language better than the old "card lift" approach.

/** Card hover animation — accent border glow on mouse enter.
 *  Uses var(--accent-rgb) so the glow color adapts to dark/light mode.
 *  Note: Framer Motion applies this as inline style, CSS variables
 *  resolve at paint time so they'll match the active theme. */
export const CARD_GLOW_HOVER = {
  y: -4,
  boxShadow: '0 0 0 1px rgba(var(--accent-rgb), 0.3), 0 8px 25px rgba(var(--accent-rgb), 0.1)',
  transition: { type: 'spring' as const, stiffness: 300, damping: 25 },
};
