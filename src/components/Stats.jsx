import { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';

import { DEFAULT_PROFILE } from '../content/profile.js';

function parseStat(str) {
  const match = str.match(/^(\d+)(.*)$/);
  return match ? { value: parseInt(match[1], 10), suffix: match[2] } : { value: 0, suffix: '' };
}

function CountUp({ raw }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState('0');
  const isInView = useInView(ref, { once: true, amount: 0.8 });
  const { value, suffix } = parseStat(raw);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v).toString()),
    });
    return controls.stop;
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function Stats({ stats = DEFAULT_PROFILE.stats }) {
  return (
    <div className="flex flex-col gap-3.5">
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-baseline gap-2.5 py-1 min-w-[120px]">
          <span className="text-[15px] font-medium leading-none text-fg-muted">
            <CountUp raw={stat.num} />
          </span>
          <span className="text-xs text-fg-dim">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
