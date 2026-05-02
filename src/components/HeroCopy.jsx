import { motion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1];

export default function HeroCopy({ title, tagline }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] uppercase text-fg-dim mb-7 before:content-[''] before:w-7 before:h-px before:bg-fg-dim"
      >
        Portfolio · Lagos → Remote
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease, delay: 0.1 }}
        className="hero-name text-[#d0cda6] font-serif font-normal text-[clamp(64px,9vw,128px)] leading-[0.92] tracking-[-0.02em] m-0 mb-8"
      >
        Boluwa<span className="text-[#005b94] font-bold">tife</span>
        <br />
        Emmanuel<em className="italic text-accent font-normal">.</em>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease, delay: 0.2 }}
        className="flex items-baseline gap-3.5 mb-7 text-[18px] text-fg-muted flex-wrap"
      >
        <span className="text-fg font-medium text-[#eff1f3]">{title}</span>
        <span className="inline-block w-1 h-1 rounded-full bg-fg-dim -translate-y-1" />
        <span className="font-fraunces italic text-[22px] leading-[1.35] m-0 mb-2 max-w-[480px] tagline-carved">
          {tagline}
        </span>
      </motion.div>
    </>
  );
}
