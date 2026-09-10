/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { BackgroundVideo } from './components/BackgroundVideo';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { Scene } from './components/KageScene';

export default function App() {
  const [isHeroActive, setIsHeroActive] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Track scroll position to ensure hero mouse tracking disengages when in Kage
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroThreshold = window.innerHeight * 0.35;

      if (scrollY > heroThreshold) {
        // In Kage section: disengage landing page mouse tracking
        setIsHeroActive(false);
      } else if (!isTransitioning) {
        // In hero view: re-engage landing page interactions
        setIsHeroActive(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isTransitioning]);

  // Intentional transition triggered by 道へ / MICHI E button
  const handleEnterKage = useCallback(() => {
    if (isTransitioning) return;

    // 1. Button responds subtly
    setIsTransitioning(true);

    // 2. Landing-page mouse interaction gracefully disengages immediately
    setIsHeroActive(false);

    // 3. Initiate smooth cinematic scroll transition
    const target = document.getElementById('work');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }

    // 4. Conclude transition once scroll arrives at Kage slide
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1100);
  }, [isTransitioning]);

  return (
    <main
      id="hadex-portfolio-app"
      className="relative w-full min-h-screen bg-black text-white overflow-x-hidden selection:bg-white selection:text-black"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* Slide 01: Existing Landing Slide (Encapsulated so nothing leaks into Slide 02) */}
      <div
        id="slide-01-hero"
        className="relative w-full h-screen min-h-screen overflow-hidden"
      >
        {/* Navigation (Slide 01 minimal header) */}
        <Navbar onEnterKage={handleEnterKage} />

        {/* Interactive Cursor-Tracking Portrait (Right side) */}
        <BackgroundVideo active={isHeroActive} />

        {/* Hero Section (Slide 01 Editorial Copy & CTAs, Left side) */}
        <HeroSection
          onEnterKage={handleEnterKage}
          isTransitioning={isTransitioning}
        />
      </div>

      {/* Slide 02: Kage Temple Experience (Next full-screen slide) */}
      <section
        id="work"
        aria-label="Kage Temple Experience"
        className="relative z-20 w-full min-h-screen bg-[#05070a]"
      >
        <Scene />
      </section>
    </main>
  );
}
