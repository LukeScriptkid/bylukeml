/**
 * About - Interactive CLI terminal.
 *
 * A fully interactive terminal emulator where visitors can type
 * commands and get responses. Replaces a static About section
 * with something visitors can actually play with.
 *
 * Supported commands:
 * - help          List all available commands
 * - --introduce   Full introduction (neofetch-style + bio)
 * - about         Short bio
 * - skills        List skills by category
 * - experience    Work history
 * - contact       Email and social links
 * - certs         Certification path
 * - clear         Clear the terminal
 *
 * Features:
 * - Real text input with blinking cursor
 * - Command history (up/down arrows)
 * - Auto-scrolls to bottom on new output
 * - Terminal title bar with traffic light dots
 * - Starts with a welcome message + hint to type help
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { EXPERIENCE, SKILLS, CERTIFICATIONS, EMAIL, SOCIALS } from '../constants';

// The prompt shown before each command
const PROMPT_USER = 'lukas@portfolio';
const PROMPT_PATH = '~';

// Age computed once at module level (same pattern as YEAR in App.tsx)
const AGE = new Date().getFullYear() - 2002;

// ── Prompt Component ─────────────────────────────────────────────
// Defined at module scope so React doesn't recreate the component
// type on every render (which would cause unnecessary DOM unmounts).
function Prompt() {
  return (
    <>
      <span className="text-accent">{PROMPT_USER}</span>
      <span className="text-text-muted">:</span>
      <span className="text-accent-dim">{PROMPT_PATH}</span>
      <span className="text-text-muted">$ </span>
    </>
  );
}

// ── Command output generators ────────────────────────────────────
// Each function returns an array of JSX elements to render as
// terminal output lines.

function bioOutput(): React.ReactNode[] {
  return [
    <p key="bio-1" className="text-text-secondary leading-relaxed mb-2">
      I'm Lukas ({AGE}), an IT Operations apprentice from Oslo, Norway. Computers have been a part of my life for as long as I can remember, giving me a strong interest in both hardware and software. I took a few detours along the way, but they only made it clearer that this is where I belong.
    </p>,
    <p key="bio-2" className="text-text-secondary leading-relaxed">
      I joined Bama Tek as their first ever IT apprentice, where I handle service desk and IT operations. At home I'm homelabbing for my CCNA and working towards becoming a Network Architect in the long run. Beyond networking, I'm interested in AI and how it can be applied to automate infrastructure.
    </p>,
  ];
}

function skillsOutput(): React.ReactNode[] {
  // Group skills by category
  const grouped: Record<string, string[]> = {};
  for (const skill of SKILLS) {
    const cat = skill.category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(skill.name);
  }

  const categoryLabels: Record<string, string> = {
    networking: 'Networking',
    cloud: 'Cloud & Identity',
    systems: 'Systems',
    tools: 'Tools',
  };

  return Object.entries(grouped).map(([cat, skills]) => (
    <div key={cat} className="mb-3">
      <div className="text-accent mb-1">{categoryLabels[cat] || cat}</div>
      <div className="text-text-secondary pl-2">
        {skills.join(', ')}
      </div>
    </div>
  ));
}

function experienceOutput(): React.ReactNode[] {
  return EXPERIENCE.map((job) => (
    <div key={job.id} className="mb-3">
      <div>
        <span className="text-text-primary">{job.title}</span>
        <span className="text-text-muted"> @ </span>
        <span className="text-accent">{job.company}</span>
      </div>
      <div className="text-text-muted text-xs">{job.period}</div>
      <div className="text-text-secondary text-sm mt-1">{job.description}</div>
    </div>
  ));
}

function certsOutput(): React.ReactNode[] {
  const sorted = [...CERTIFICATIONS].sort((a, b) => a.order - b.order);
  return sorted.map((cert) => (
    <div key={cert.id} className="mb-2">
      <span className={cert.status === 'studying' ? 'text-accent' : 'text-text-muted'}>
        {cert.status === 'studying' ? '[*]' : '[ ]'}
      </span>
      <span className="text-text-primary ml-2">{cert.name}</span>
      <span className="text-text-muted"> - {cert.fullName}</span>
      {cert.targetDate && (
        <span className="text-text-muted"> (target: {cert.targetDate})</span>
      )}
    </div>
  ));
}

function contactOutput(): React.ReactNode[] {
  return [
    <div key="email" className="mb-1">
      <span className="text-accent">Email</span>
      <span className="text-text-muted">: </span>
      <span className="text-text-secondary">{EMAIL}</span>
    </div>,
    ...SOCIALS.filter(s => s.label !== 'Email').map((social) => (
      <div key={social.label} className="mb-1">
        <span className="text-accent">{social.label}</span>
        <span className="text-text-muted">: </span>
        <a
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-secondary hover:text-accent transition-colors underline"
        >
          {social.href}
        </a>
      </div>
    )),
  ];
}

function helpOutput(): React.ReactNode[] {
  const commands = [
    { cmd: '--introduce', desc: 'Full introduction with system info and bio' },
    { cmd: 'about', desc: 'Short bio' },
    { cmd: 'skills', desc: 'Skills grouped by category' },
    { cmd: 'experience', desc: 'Work history' },
    { cmd: 'certs', desc: 'Certification path' },
    { cmd: 'contact', desc: 'Email and social links' },
    { cmd: 'clear', desc: 'Clear the terminal' },
    { cmd: 'help', desc: 'Show this message' },
  ];

  return [
    <div key="help-header" className="text-text-primary mb-2">Available commands:</div>,
    ...commands.map(({ cmd, desc }) => (
      <div key={cmd} className="mb-1">
        <span className="text-accent w-20 inline-block">{cmd}</span>
        <span className="text-text-muted"> - </span>
        <span className="text-text-secondary">{desc}</span>
      </div>
    )),
  ];
}

// Maps command strings to their output functions
function runCommand(input: string): { output: React.ReactNode[]; clear?: boolean } {
  const cmd = input.trim().toLowerCase();

  switch (cmd) {
    case 'help':
      return { output: helpOutput() };
    case '--introduce':
    case 'about':
      return { output: bioOutput() };
    case 'skills':
      return { output: skillsOutput() };
    case 'experience':
      return { output: experienceOutput() };
    case 'certs':
      return { output: certsOutput() };
    case 'contact':
      return { output: contactOutput() };
    case 'clear':
      return { output: [], clear: true };
    case '':
      return { output: [] };
    default:
      return {
        output: [
          <span key="err" className="text-red-400">
            command not found: {input}. Type <span className="text-accent">help</span> for available commands.
          </span>,
        ],
      };
  }
}

// A single history entry - the command that was typed and its output
interface HistoryEntry {
  id: number;
  command: string;
  output: React.ReactNode[];
}

export default function About() {
  // Terminal history - array of past commands and their outputs
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  // Current input value
  const [input, setInput] = useState('');
  // Command history for up/down arrow navigation
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  // Current position in command history (-1 = not browsing)
  const [historyIndex, setHistoryIndex] = useState(-1);
  // Auto-incrementing ID for history entries
  const idRef = useRef(0);
  // Ref to the terminal content area for auto-scrolling
  const terminalRef = useRef<HTMLDivElement>(null);
  // Ref to the hidden input element
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom whenever history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Handle command submission
  const handleSubmit = useCallback(() => {
    const result = runCommand(input);

    if (result.clear) {
      // Clear command resets history
      setHistory([]);
    } else {
      // Add command + output to history
      setHistory((prev) => [
        ...prev,
        {
          id: idRef.current++,
          command: input,
          output: result.output,
        },
      ]);
    }

    // Add non-empty commands to command history for arrow key navigation
    if (input.trim()) {
      setCmdHistory((prev) => [...prev, input.trim()]);
    }

    setInput('');
    setHistoryIndex(-1);
  }, [input]);

  // Handle keyboard events - enter to submit, up/down for history
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === 'ArrowUp') {
        // Navigate backwards through command history
        e.preventDefault();
        if (cmdHistory.length === 0) return;
        const newIndex = historyIndex === -1
          ? cmdHistory.length - 1
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(cmdHistory[newIndex]);
      } else if (e.key === 'ArrowDown') {
        // Navigate forwards through command history
        e.preventDefault();
        if (historyIndex === -1) return;
        const newIndex = historyIndex + 1;
        if (newIndex >= cmdHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(cmdHistory[newIndex]);
        }
      }
    },
    [handleSubmit, cmdHistory, historyIndex]
  );

  // Focus the input when clicking anywhere in the terminal
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <section id="about" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Blueprint reference label above the terminal */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-mono text-[10px] text-text-ghost uppercase tracking-wider mb-3"
        >
          Detail A — Terminal Access
        </motion.div>

        {/* Terminal window — two-layer wrapper so corner-marks
            pseudo-elements aren't clipped by overflow-hidden */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="corner-marks rounded-lg border border-dashed border-accent/20"
        >
          {/* Inner wrapper clips terminal content to rounded border */}
          <div className="rounded-lg overflow-hidden">
          {/* Title bar - minimal, like a real Linux terminal */}
          <div className="flex items-center px-4 py-2 bg-[#1a1a1a] border-b border-dashed border-accent/15">
            <span className="font-mono text-xs text-[#888]">{PROMPT_USER}:{PROMPT_PATH}</span>
          </div>

          {/* Terminal content - true black background */}
          <div
            ref={terminalRef}
            onClick={focusInput}
            className="p-5 sm:p-6 font-mono text-[15px] min-h-[400px] max-h-[600px] overflow-y-auto cursor-text bg-[#0a0a0a]"
          >
            {/* Welcome message - shown before any commands */}
            {history.length === 0 && (
              <div className="mb-4">
                <p className="text-text-secondary mb-1">Welcome to Lukas Liberg's portfolio terminal.</p>
                <p className="text-text-muted">
                  Type <span className="text-accent">help</span> to see available commands, or try <span className="text-accent">--introduce</span>
                </p>
              </div>
            )}

            {/* Command history - past commands and their outputs */}
            {history.map((entry) => (
              <div key={entry.id} className="mb-3">
                {/* The command that was typed */}
                <div className="flex">
                  <Prompt />
                  <span className="text-text-primary">{entry.command}</span>
                </div>
                {/* Command output */}
                {entry.output.length > 0 && (
                  <div className="mt-1.5 pl-0">
                    {entry.output}
                  </div>
                )}
              </div>
            ))}

            {/* Current input line */}
            <div className="flex items-center">
              <Prompt />
              <div className="relative flex-1">
                {/* Hidden input that captures keystrokes */}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="absolute inset-0 w-full bg-transparent text-text-primary outline-none caret-transparent"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  aria-label="Terminal input"
                />
                {/* Visible text + cursor (styled separately for the block cursor look) */}
                <span className="text-text-primary">{input}</span>
                <span className="animate-blink text-accent">_</span>
              </div>
            </div>
          </div>
          </div>{/* close inner overflow-hidden wrapper */}
        </motion.div>
      </div>
    </section>
  );
}
