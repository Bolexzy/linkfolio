import { motion } from 'framer-motion';

import { DEFAULT_SOCIAL_PILL_ACCENT } from '../data/socialPills.js';

const ease = [0.16, 1, 0.3, 1];

export default function SocialPills({ pills = [] }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {pills.map((pill, index) => {
        const isEnabled = Boolean(pill.href);
        // Float starts after this pill's entry animation finishes, offset per pill for async movement
        const entryEnd = 0.35 + index * 0.07 + 0.42;
        const floatDelay = entryEnd + index * 0.38;
        const floatDuration = 5.4 + (index % 4) * 0.55;

        return (
          <motion.a
            key={pill.label}
            href={isEnabled ? pill.href : undefined}
            target={isEnabled ? '_blank' : undefined}
            rel={isEnabled ? 'noreferrer noopener' : undefined}
            aria-disabled={!isEnabled}
            className={`pill ${!isEnabled ? 'opacity-60 pointer-events-none' : ''}`}
            style={{
              '--pill-color': pill.accent || DEFAULT_SOCIAL_PILL_ACCENT,
              animation: `float ${floatDuration}s ease-in-out ${floatDelay}s infinite`,
            }}
            initial={{ opacity: 0, y: 10, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.42, ease, delay: 0.35 + index * 0.07 }}
            onMouseEnter={(e) => { e.currentTarget.style.animationPlayState = 'paused'; }}
            onMouseLeave={(e) => { e.currentTarget.style.animationPlayState = 'running'; }}
          >
            <span className="dot" />
            {pill.label}
            {pill.meta ? <span className="meta">{pill.meta}</span> : null}
          </motion.a>
        );
      })}
    </div>
  );
}
