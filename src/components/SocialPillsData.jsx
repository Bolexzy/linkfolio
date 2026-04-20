import { useEffect, useState } from 'react';

import SocialPills from './SocialPills.jsx';
import { loadSocialPills } from '../data/socialPills.js';

export default function SocialPillsData() {
  const [pills, setPills] = useState([]);

  useEffect(() => {
    let ignore = false;

    async function fetchPills() {
      try {
        const nextPills = await loadSocialPills();

        if (!ignore) {
          setPills(nextPills);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchPills();

    return () => {
      ignore = true;
    };
  }, []);

  if (pills.length === 0) {
    return null;
  }

  return <SocialPills pills={pills} />;
}
