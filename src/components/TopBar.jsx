import { useEffect, useState } from 'react';

import { DEFAULT_PROFILE, loadProfile } from '../content/profile.js';

export default function TopBar() {
  const [resumeUrl, setResumeUrl] = useState(DEFAULT_PROFILE.resume);

  useEffect(() => {
    let ignore = false;

    async function fetchProfile() {
      try {
        const profile = await loadProfile();

        if (!ignore) {
          setResumeUrl(profile.resume);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchProfile();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <header className="flex flex-wrap items-center pb-14 text-[13px] text-fg-muted gap-x-6 gap-y-4">
      {/* Logo — always row 1, left */}
      <div className="order-1 flex-none inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.08em] uppercase text-fg">
        <span className="relative w-[22px] h-[22px] rounded-full bg-[#d9e5d6] after:content-[''] after:absolute after:inset-[6px] after:rounded-full after:bg-bg" />
        <span>BE — tifexgtek / 026</span>
      </div>

      {/* Status + Resume — row 1 right on mobile (ml-auto), row 1 end on desktop */}
      <div className="order-2 ml-auto flex items-center gap-4 min-[900px]:order-3 min-[900px]:ml-0">
        <div className="hidden min-[900px]:inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.05em] uppercase text-fg-muted">
          <span className="status-dot" />
          Booking
        </div>
        <a
          href={resumeUrl || '#'}
          target={resumeUrl ? '_blank' : undefined}
          rel={resumeUrl ? 'noreferrer noopener' : undefined}
          className="inline-flex items-center gap-2 py-2 px-4 rounded-full text-[13px] font-semibold tracking-[0.01em] text-[#1a0e06] hover:-translate-y-0.5 transition-transform"
          style={{
            background: 'linear-gradient(135deg, oklch(0.78 0.18 50), oklch(0.72 0.2 30))',
            boxShadow: '0 6px 18px -8px oklch(0.72 0.2 30 / 0.6)',
          }}
        >
          Resume ↗
        </a>
      </div>

      {/* Nav — row 2 on mobile (full width), row 1 center on desktop */}
      <nav className="order-3 w-full border-t border-[rgba(240,238,225,0.06)] pt-4 flex gap-6 font-mono text-xs tracking-[0.04em] min-[900px]:order-2 min-[900px]:w-auto min-[900px]:border-none min-[900px]:pt-0 min-[900px]:mx-auto min-[900px]:gap-7">
        <a href="#work" className="text-fg-muted hover:text-accent transition-colors">Work</a>
        <a href="#catalogue" className="text-fg-muted hover:text-accent transition-colors">Catalogue</a>
        <a href="#contact" className="text-fg-muted hover:text-accent transition-colors">Contact</a>
      </nav>
    </header>
  );
}
