import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import HeroCopy from './HeroCopy.jsx';
import SocialPillsData from './SocialPillsData.jsx';
import Portrait from './Portrait.jsx';
import Stats from './Stats.jsx';
import { DEFAULT_PROFILE, loadProfile } from '../content/profile.js';

const preciseEase = [0.16, 1, 0.3, 1];

export default function Hero() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  useEffect(() => {
    let ignore = false;

    async function fetchProfile() {
      try {
        const nextProfile = await loadProfile();

        if (!ignore) {
          setProfile(nextProfile);
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
    <section className="grid grid-cols-[1.15fr_1fr] gap-14 items-center pb-24 border-b border-[rgba(240,238,225,0.08)] max-[900px]:grid-cols-1 max-[900px]:gap-10 max-[900px]:pb-14">
      <div>
        <HeroCopy
          title={profile.title}
          tagline={profile.tagline}
        />

        <SocialPillsData />
      </div>

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.85, ease: preciseEase, delay: 0.18 }}
        className="flex flex-col items-start gap-7"
      >
        <div className="grid grid-cols-[auto_1fr] gap-7 items-center">
          <Portrait src={profile.portrait} />
          <Stats stats={profile.stats} />
        </div>
        <p className="max-w-[460px] mt-2 text-fg-muted text-[15px] leading-[1.65] m-0 mb-10">
          {profile.bio}
        </p>
      </motion.div>
    </section>
  );
}
