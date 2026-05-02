import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import { loadProjects } from '../content/projects.js';
import ProjectCard from './ProjectCard.jsx';

const preciseEase = [0.16, 1, 0.3, 1];
const sectionViewport = { once: false, amount: 0.2 };

export default function FeaturedWork() {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [projects, setProjects] = useState([]);

  const step = () => {
    const track = trackRef.current;
    const card = track?.querySelector('[data-project]');
    return card ? card.getBoundingClientRect().width + 20 : 400;
  };

  const update = () => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    setAtStart(track.scrollLeft <= 2);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 2);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return undefined;
    }

    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    return () => {
      track.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function fetchProjects() {
      try {
        const nextProjects = await loadProjects();
        if (!ignore) {
          setProjects(nextProjects);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchProjects();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    update();
  }, [projects.length]);

  return (
    <section id="work" className="py-24 border-b border-[rgba(240,238,225,0.08)]">
      <div className="flex items-start justify-between mb-12 gap-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: preciseEase }}
          viewport={sectionViewport}
        >
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-fg-dim">
            S 01 - Featured products
          </div>
          <h2 className="font-serif font-normal text-[clamp(40px,5vw,64px)] leading-none tracking-[-0.015em] m-0 mt-3.5">
            Selected <em className="italic text-[#d9e5d6]">projects.</em>
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: preciseEase, delay: 0.08 }}
          viewport={sectionViewport}
          className="flex gap-2.5"
        >
          <ScrollBtn
            disabled={atStart || projects.length === 0}
            onClick={() =>
              trackRef.current?.scrollBy({ left: -step(), behavior: 'smooth' })
            }
          >
            &lt;-
          </ScrollBtn>
          <ScrollBtn
            disabled={atEnd || projects.length === 0}
            onClick={() =>
              trackRef.current?.scrollBy({ left: step(), behavior: 'smooth' })
            }
          >
            -&gt;
          </ScrollBtn>
        </motion.div>
      </div>

      <div className="relative overflow-hidden">
        <div
          ref={trackRef}
          className="projects-track flex gap-5 overflow-x-auto overflow-y-hidden pb-2 scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="flex-shrink-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.07,
                  ease: preciseEase,
                }}
                viewport={{ once: true, amount: 0.25 }}
              >
                <ProjectCard {...project} />
              </motion.div>
            ))
          ) : (
            <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-fg-dim py-10">
              Loading projects...
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ScrollBtn({ children, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-11 h-11 rounded-full border border-[rgba(240,238,225,0.16)] bg-bg-raised text-fg flex items-center justify-center text-base transition-colors hover:bg-accent hover:text-accent-ink hover:border-accent disabled:opacity-35 disabled:hover:bg-bg-raised disabled:hover:text-fg disabled:hover:border-[rgba(240,238,225,0.16)]"
    >
      {children}
    </button>
  );
}
