import { useEffect, useState } from 'react';

import { loadCatalogue } from '../content/catalogue.js';
import SkillOrbit from './SkillOrbit.jsx';

export default function Catalogue() {
  const [services, setServices] = useState([]);
  const [orbitIcons, setOrbitIcons] = useState([]);

  useEffect(() => {
    let ignore = false;

    async function fetchCatalogue() {
      try {
        const nextCatalogue = await loadCatalogue();

        if (!ignore) {
          setServices(nextCatalogue.services);
          setOrbitIcons(nextCatalogue.orbitIcons);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchCatalogue();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section id="catalogue" className="py-24 border-b border-[rgba(240,238,225,0.08)]">
      <div className="flex items-start justify-between mb-12 gap-10 flex-wrap">
        <div className="flex items-end gap-7 flex-wrap" style={{ rowGap: '32px' }}>
          <div className="flex-shrink-0">
            <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-fg-dim">
              S 02 - Catalogue
            </div>
            <h2 className="font-serif font-normal text-[clamp(40px,5vw,64px)] leading-none tracking-[-0.015em] m-0 mt-3.5">
              What I <em className="italic text-[#d9e5d6]">offer.</em>
            </h2>
          </div>
          {orbitIcons.length > 0 ? <SkillOrbit icons={orbitIcons} /> : null}
        </div>
        <p className="max-w-[340px] text-fg-muted text-sm leading-[1.6]">
          Contract, embedded, or retainer. Typical project runs four to sixteen weeks.
        </p>
      </div>

      <div className="border-t border-[rgba(240,238,225,0.08)]">
        {services.length > 0 ? (
          services.map((service) => (
            <div
              key={service.id}
              className="grid grid-cols-[80px_1.5fr_1fr_180px] items-center gap-8 py-7 border-b border-[rgba(240,238,225,0.08)] relative transition-all hover:px-4 max-[900px]:grid-cols-[40px_1fr]"
            >
              <div className="font-mono text-[11px] tracking-[0.15em] text-fg-dim">
                {service.num}
              </div>
              <div className="font-serif text-[36px] leading-none tracking-[-0.01em]">
                {service.main}{' '}
                {service.accent ? (
                  <em className="italic text-[#005b94]">{service.accent}</em>
                ) : null}
              </div>
              <div className="text-[13px] text-fg-muted leading-[1.55] max-[900px]:col-start-2">
                {service.description}
              </div>
              <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-fg-dim text-right max-[900px]:col-start-2 max-[900px]:text-left">
                {service.stacks.join(' / ')}
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 font-mono text-[11px] tracking-[0.14em] uppercase text-fg-dim">
            Loading catalogue...
          </div>
        )}
      </div>
    </section>
  );
}
