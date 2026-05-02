import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import HeroCopy from './HeroCopy.jsx';
import SocialPillsData from './SocialPillsData.jsx';
import Portrait from './Portrait.jsx';
import Stats from './Stats.jsx';
import { DEFAULT_PROFILE, loadProfile } from '../content/profile.js';

const preciseEase = [0.16, 1, 0.3, 1];

export default function Hero() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function fetchProfile() {
      try {
        const nextProfile = await loadProfile();
        if (!ignore) setProfile(nextProfile);
      } catch (error) {
        console.error(error);
        if (!ignore) setProfile(DEFAULT_PROFILE);
      }
    }

    fetchProfile();
    return () => { ignore = true; };
  }, []);

  return (
    <section className="grid grid-cols-[1.15fr_1fr] gap-14 items-center pb-24 border-b border-[rgba(240,238,225,0.08)] max-[900px]:grid-cols-1 max-[900px]:gap-10 max-[900px]:pb-14">
      <div>
        {profile ? (
          <HeroCopy title={profile.title} tagline={profile.tagline} />
        ) : (
          <HeroSkeleton />
        )}

        <SocialPillsData />
      </div>

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.85, ease: preciseEase, delay: 0.18 }}
        className="flex flex-col items-start gap-7"
      >
        <div className="grid grid-cols-[auto_1fr] gap-7 items-center">
          <Portrait src={profile?.portrait} />
          <Stats stats={profile?.stats} />
        </div>
        <p className="max-w-[460px] mt-2 text-fg-muted text-[15px] leading-[1.65] m-0 mb-10">
          {profile?.bio}
        </p>
      </motion.div>
    </section>
  );
}

function HeroSkeleton() {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="skeleton h-3 w-40 rounded-full mb-3" />
      <div className="skeleton h-[clamp(56px,8vw,112px)] w-[80%] rounded-lg" />
      <div className="skeleton h-[clamp(44px,6vw,84px)] w-[60%] rounded-lg" />
      <div className="flex items-center gap-3 mt-2">
        <div className="skeleton h-4 w-28 rounded-full" />
        <div className="skeleton h-4 w-48 rounded-full" />
      </div>
    </div>
  );
}
