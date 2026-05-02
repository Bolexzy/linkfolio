import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { DEFAULT_REVIEWS, loadReviews } from '../content/clients.js';

const ease = [0.16, 1, 0.3, 1];

export default function Reviews() {
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function fetchReviews() {
      try {
        const nextReviews = await loadReviews();
        if (!ignore) setReviews(nextReviews.length ? nextReviews : DEFAULT_REVIEWS);
      } catch (error) {
        console.error(error);
        if (!ignore) setReviews(DEFAULT_REVIEWS);
      }
    }

    fetchReviews();
    return () => { ignore = true; };
  }, []);

  return (
    <section className="py-24 border-b border-[rgba(240,238,225,0.08)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        viewport={{ once: false, amount: 0.4 }}
        className="mb-12"
      >
        <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-fg-dim">
          S 03 Kind words
        </div>
        <h2 className="font-serif font-normal text-[clamp(40px,5vw,64px)] leading-none tracking-[-0.015em] m-0 mt-3.5">
          What clients <em className="italic text-[#d9e5d6]">say.</em>
        </h2>
      </motion.div>

      <div className="grid grid-cols-3 gap-5 max-[900px]:grid-cols-1">
        {(reviews ?? []).map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: index * 0.1 }}
            viewport={{ once: false, amount: 0.3 }}
            className="flex flex-col gap-5 rounded-xl border border-[rgba(240,238,225,0.08)] p-6 bg-[rgba(240,238,225,0.02)] hover:border-[rgba(240,238,225,0.14)] transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div
                className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center font-mono text-[11px] font-medium tracking-wider"
                style={{
                  background: `${review.avatarColor}22`,
                  border: `1px solid ${review.avatarColor}55`,
                  color: review.avatarColor,
                }}
              >
                {review.initials}
              </div>
              <div>
                <div className="text-sm font-medium text-fg leading-none mb-1">{review.name}</div>
                <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-fg-dim">
                  {review.role}
                </div>
              </div>
            </div>

            <p className="font-serif italic text-[15px] leading-[1.6] text-fg-muted m-0 flex-1">
              &ldquo;{review.quote}&rdquo;
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
