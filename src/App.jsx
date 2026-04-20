import { useEffect, useRef } from 'react';
import gsap from 'gsap';

import TopBar from './components/TopBar.jsx';
import Hero from './components/Hero.jsx';
import FeaturedWork from './components/FeaturedWork.jsx';
import Catalogue from './components/Catalogue.jsx';
import Reviews from './components/Reviews.jsx';
import ContactCTA from './components/ContactCTA.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const canUseCursor = dot && window.matchMedia('(pointer: fine)').matches;
    const interactiveElements = canUseCursor
      ? document.querySelectorAll('a, button, input, textarea, select, [role="button"]')
      : [];

    if (!canUseCursor) {
      return undefined;
    }

    // Dot follows instantly — zero lag, maximum precision
    const setDotX = gsap.quickSetter(dot, 'x', 'px');
    const setDotY = gsap.quickSetter(dot, 'y', 'px');

    // Ring trails behind with a short ease
    const moveRingX = gsap.quickTo(ring, 'x', { duration: 0.18, ease: 'power3.out' });
    const moveRingY = gsap.quickTo(ring, 'y', { duration: 0.18, ease: 'power3.out' });

    let isVisible = false;

    const handleMouseMove = (e) => {
      setDotX(e.clientX);
      setDotY(e.clientY);
      moveRingX(e.clientX);
      moveRingY(e.clientY);
      if (!isVisible) {
        isVisible = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    };

    const handleInteractiveEnter = () => {
      gsap.to(dot, { scale: 0, duration: 0.2, ease: 'power2.out' });
      gsap.to(ring, {
        scale: 1.8,
        borderColor: 'rgba(255, 147, 84, 0.8)',
        backgroundColor: 'rgba(255, 147, 84, 0.1)',
        duration: 0.25,
        ease: 'power2.out',
      });
    };

    const handleInteractiveLeave = () => {
      gsap.to(dot, { scale: 1, duration: 0.2, ease: 'power2.out' });
      gsap.to(ring, {
        scale: 1,
        borderColor: 'rgba(86, 214, 230, 0.5)',
        backgroundColor: 'rgba(86, 214, 230, 0.05)',
        duration: 0.25,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleInteractiveEnter);
      el.addEventListener('mouseleave', handleInteractiveLeave);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleInteractiveEnter);
        el.removeEventListener('mouseleave', handleInteractiveLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div className="max-w-[1240px] mx-auto px-14 pt-10 pb-20 max-[900px]:px-6 max-[900px]:pb-14">
        <TopBar />
        <Hero />
        <FeaturedWork />
        <Catalogue />
        <Reviews />
        <ContactCTA />
        <Footer />
      </div>
    </>
  );
}
