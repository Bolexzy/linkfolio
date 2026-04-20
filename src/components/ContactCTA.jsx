import { useState } from 'react';

export default function ContactCTA() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section id="contact" className="pt-24 pb-10">
      <div className="grid grid-cols-[1.2fr_1fr] gap-14 items-center max-[900px]:grid-cols-1">
        <div>
          <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-fg-dim mb-5">§ 04 — Let's talk</div>
          <h3 className="font-serif font-normal text-[clamp(40px,5.5vw,72px)] leading-none tracking-[-0.02em] m-0 mb-5">
            Have an idea worth <em className="italic text-[#005b94]">shipping?</em>
          </h3>
          <p className="text-fg-muted text-sm max-w-[420px] m-0">
            Available from May 2026. Replies within 24h, GMT+1. Pick a slot or drop your email —
            I'll send a short monthly note with new work.
          </p>
        </div>

        <div className="flex flex-col gap-3.5">
          <CTARow label="Book" main="calendly.com/boluwatife" href="https://calendly.com/goodtekh/30min" btnLabel="Schedule →" />
          <CTARow label="Email" main="hello@boluwatife.dev" href="mailto:boluwatifemanuel@gmail.com" btnLabel="Copy ↗" btnOutline />

          <form
            onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}
            className="flex items-center gap-3 py-3.5 px-4 rounded-xl bg-[#001F33] border border-[rgba(240,238,225,0.08)] hover:border-[rgba(240,238,225,0.16)] transition-colors"
          >
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-fg-dim min-w-[88px]">Subscribe</span>
            <input
              type="email"
              required
              placeholder="you@domain.com"
              className="flex-1 bg-transparent border-none text-fg text-sm outline-none min-w-0 placeholder:text-fg-dim"
            />
            <button
              type="submit"
              className="py-2 px-3.5 rounded-full bg-fg text-[#001F33] text-xs font-medium border-none cursor-pointer hover:-translate-y-0.5 transition-transform"
            >
              {subscribed ? 'Subscribed ✓' : 'Join list'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function CTARow({ label, main, href, btnLabel, btnOutline }) {
  return (
    <div className="flex items-center gap-3 py-3.5 px-4 rounded-xl bg-[#005b94]-raised border border-[rgba(240,238,225,0.08)] hover:border-[rgba(240,238,225,0.16)] transition-colors">
      <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-fg-dim flex-none min-w-[52px]">{label}</span>
      <a href={href} target="_blank" rel="noopener" className="flex-1 min-w-0 text-fg text-sm no-underline truncate">
        <strong className="font-medium">{main}</strong>
      </a>
      <a
        href={href}
        target="_blank"
        rel="noopener"
        className={`flex-none py-2 px-3.5 rounded-full text-xs font-medium no-underline whitespace-nowrap inline-flex items-center gap-1.5 hover:-translate-y-0.5 transition-transform ${
          btnOutline
            ? 'text-fg border border-[rgba(240,238,225,0.16)] bg-transparent'
            : 'bg-[#005b94] text-[#005b94]-ink'
        }`}
      >
        {btnLabel}
      </a>
    </div>
  );
}
