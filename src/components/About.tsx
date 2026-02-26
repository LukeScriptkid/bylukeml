import { motion } from 'framer-motion';
import { MapPin, Cpu, Cloud, Wrench } from 'lucide-react';
import TextReveal from './motion/TextReveal';

/**
 * About section — bento-style grid layout.
 *
 * Desktop: photo takes the left 40%, bio card takes the right 60%.
 * Mobile: stacks vertically, photo on top with max-height cap.
 * No borders anywhere — card elevation (bg-bg-card) defines the tiles.
 */

// Quick fact chips displayed at the bottom of the bio card
const FACTS = [
  { icon: Cpu, label: 'ML & AI' },
  { icon: Cloud, label: 'Cloud Ops' },
  { icon: Wrench, label: 'Hardware' },
];

export default function About() {
  return (
    <section id="about" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section heading — each word fades in one after another */}
        <TextReveal text="About me" className="text-3xl sm:text-4xl font-bold mb-12" />

        {/*
          Grid layout: 2fr/3fr gives the photo ~40% and bio ~60%.
          gap-3 keeps tiles close together for a bento-board feel.
        */}
        <div className="grid md:grid-cols-[2fr_3fr] gap-3">
          {/* Photo tile — slides up and fades in on scroll */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl overflow-hidden bg-bg-card max-h-[400px] md:max-h-none"
            // max-h-[400px] on mobile prevents the photo from dominating the screen
          >
            <img
              src={`${import.meta.env.BASE_URL}images/pic1.jpg`}
              alt="Lukas Liberg"
              loading="lazy" // Below the fold, no need to block render
              width={400}
              height={600}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Bio card — vertically centered against the photo with self-center */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 rounded-2xl bg-bg-card flex flex-col self-center"
          >
            {/* First paragraph — intro and background */}
            <p className="text-text-secondary leading-relaxed mb-4">
              I'm <span className="text-text-primary font-medium">Lukas</span> (23), an IT Operations
              apprentice from Oslo, Norway. Computers have been a part of my life for as long
              as I can remember. I took a few detours, but they only made it clearer that
              this is where I belong.
            </p>
            {/* Second paragraph — current role and goals */}
            <p className="text-text-secondary leading-relaxed">
              I had the opportunity to join{' '}
              <span className="text-text-primary">Bama Tek</span> as their first ever IT
              apprentice. I handle the service desk while learning IT operations, and on my
              own time I'm growing my skills in{' '}
              <span className="text-accent-hover">machine learning</span> and{' '}
              <span className="text-accent-hover">cloud engineering</span>.
            </p>

            {/*
              Quick facts row — pinned to the bottom of the card via mt-auto.
              Pipe separators between each fact for visual grouping.
            */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted mt-auto pt-4">
              {/* Location always shows first, outside the loop */}
              <span className="flex items-center gap-1.5">
                <MapPin size={13} className="text-accent" />
                Oslo, Norway 🇳🇴
              </span>
              {/* Remaining facts — each prefixed with a pipe separator */}
              {FACTS.map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5">
                  <span className="text-border">|</span>
                  <Icon size={13} className="text-accent" />
                  {label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
