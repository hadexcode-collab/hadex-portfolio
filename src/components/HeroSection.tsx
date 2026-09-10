import { useEffect, useState } from 'react';

const getAssetUrl = (path: string): string => {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
};

interface HeroSectionProps {
  onEnterKage?: () => void;
  isTransitioning?: boolean;
}

export function HeroSection({ onEnterKage, isTransitioning = false }: HeroSectionProps = {}) {
  const [stagger, setStagger] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  // Staggered subtle cinematic entrance sequence
  useEffect(() => {
    const delays = [80, 200, 340, 480, 620, 760];
    const timeouts = delays.map((delay, index) =>
      setTimeout(() => {
        setStagger((prev) => {
          const next = [...prev];
          next[index] = true;
          return next;
        });
      }, delay)
    );

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <section
      id="hero-slide-01"
      aria-label="Hero Introduction"
      className="relative z-10 w-full min-h-screen flex flex-col justify-center px-6 sm:px-10 lg:px-16 pointer-events-none select-none"
    >
      {/* Left Column: Hero Editorial Typography & Composition */}
      <div className="w-full md:w-[54%] lg:w-[50%] xl:w-[47%] pointer-events-auto flex flex-col justify-center pt-24 sm:pt-28 md:pt-0 pb-16 md:pb-0">
        {/* 1. Small Identity Label */}
        <div
          id="hero-identity-label"
          className={`flex items-center gap-2.5 mb-6 sm:mb-8 transition-all duration-700 ease-out ${
            stagger[0]
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-3'
          }`}
        >
          <span
            id="hero-brand-eyebrow"
            className="text-[11px] sm:text-[12px] font-mono tracking-[0.22em] uppercase text-white/50 font-medium"
          >
            HADEX®
          </span>
          <span className="text-white/25 text-xs" aria-hidden="true">
            /
          </span>
          <span
            id="hero-secondary-descriptor"
            className="text-[11px] sm:text-[12px] font-mono tracking-[0.16em] uppercase text-white/70"
          >
            ENGINEER · BUILDER · OBSERVER
          </span>
        </div>

        {/* 2. Primary Hero Headline */}
        <h1
          id="hero-main-headline"
          className={`mb-6 sm:mb-7 transition-all duration-800 ease-out ${
            stagger[1]
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <span
            className="block text-[34px] sm:text-[48px] lg:text-[58px] xl:text-[66px] leading-[0.96] font-medium tracking-[-0.035em] text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            I LIKE PROBLEMS
          </span>
          <span
            className="block text-[34px] sm:text-[48px] lg:text-[58px] xl:text-[66px] leading-[0.96] font-medium tracking-[-0.035em] text-neutral-300 mt-1 sm:mt-1.5"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            THAT DON'T HAVE
          </span>
          <span
            className="block text-[34px] sm:text-[48px] lg:text-[58px] xl:text-[66px] leading-[0.96] font-semibold tracking-[-0.035em] text-white mt-1 sm:mt-1.5 drop-shadow-[0_0_35px_rgba(255,255,255,0.18)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            AN ANSWER YET.
          </span>
        </h1>

        {/* 3. Poetic Line Underneath */}
        <div
          id="hero-poetic-subline"
          className={`mb-6 sm:mb-7 transition-all duration-800 ease-out ${
            stagger[2]
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-[17px] sm:text-[20px] lg:text-[22px] leading-[1.38] text-white/85 font-light italic tracking-tight max-w-[480px]">
            Because the obvious way
            <br />
            is rarely the only way.
          </p>
        </div>

        {/* 4. Short Personal Statement */}
        <p
          id="hero-personal-statement"
          className={`text-[14.5px] sm:text-[16px] lg:text-[17px] leading-[1.65] text-white/70 font-normal max-w-[460px] lg:max-w-[490px] mb-8 sm:mb-11 transition-all duration-800 ease-out ${
            stagger[3]
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          I like finding the strange little path between an idea and something that actually works.
        </p>

        {/* 5. Action CTAs */}
        <div
          id="hero-cta-group"
          className={`flex flex-wrap items-center gap-3 sm:gap-4 mb-10 sm:mb-14 transition-all duration-800 ease-out ${
            stagger[4]
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Primary CTA */}
          <a
            id="hero-primary-cta"
            href="#work"
            onClick={(e) => {
              if (onEnterKage) {
                e.preventDefault();
                onEnterKage();
              }
            }}
            className="inline-flex items-center justify-center bg-white text-black font-medium text-[11.5px] sm:text-[12.5px] tracking-[0.14em] uppercase px-7 py-3.5 rounded-full hover:bg-neutral-200 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.15)]"
          >
            EXPLORE WHAT I'VE BUILT
          </a>

          {/* Secondary CTA */}
          <a
            id="hero-secondary-cta"
            href="#about"
            className="inline-flex items-center justify-center text-white/90 hover:text-white border border-white/20 hover:border-white/50 font-medium text-[11.5px] sm:text-[12.5px] tracking-[0.14em] uppercase px-6 py-3.5 rounded-full hover:bg-white/5 active:scale-[0.98] transition-all duration-200 cursor-pointer backdrop-blur-sm"
          >
            ABOUT ME
          </a>

          {/* Small Additional CTA */}
          <a
            id="hero-resume-cta"
            href={getAssetUrl('Avinash-TT-Resume.pdf')}
            download="Avinash-TT-Resume.pdf"
            className="inline-flex items-center gap-1 text-white/60 hover:text-white text-[11.5px] sm:text-[12.5px] font-mono tracking-[0.14em] uppercase px-3 py-3.5 transition-colors duration-200 group"
          >
            <span>RESUME</span>
            <span
              className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            >
              ↗
            </span>
          </a>

          {/* Transition Doorway Button: 道へ / MICHI E ("Toward the path") */}
          <button
            id="michi-e-transition-btn"
            type="button"
            onClick={onEnterKage}
            disabled={isTransitioning}
            className={`group inline-flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full border transition-all duration-300 active:scale-[0.97] cursor-pointer backdrop-blur-sm pointer-events-auto ${
              isTransitioning
                ? 'border-[#e0231c] bg-[#e0231c]/20 text-white shadow-[0_0_20px_rgba(224,35,28,0.4)] scale-[0.98]'
                : 'border-white/20 hover:border-[#e0231c]/70 bg-white/5 hover:bg-white/10 text-white/90 hover:text-white'
            }`}
            aria-label="Toward the path: 道へ (MICHI E)"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                isTransitioning
                  ? 'bg-[#e0231c] scale-150 shadow-[0_0_10px_#e0231c] animate-pulse'
                  : 'bg-[#e0231c] group-hover:scale-125 shadow-[0_0_8px_#e0231c]'
              }`}
              aria-hidden="true"
            />
            <span className="text-[13px] font-medium tracking-[0.16em] text-white">
              道へ
            </span>
            <span className="text-[9.5px] font-mono tracking-[0.2em] text-white/40 group-hover:text-white/75 uppercase transition-colors">
              MICHI E
            </span>
            <span
              className={`text-xs transition-all duration-300 ${
                isTransitioning
                  ? 'text-[#e0231c] translate-y-1'
                  : 'text-white/40 group-hover:text-[#e0231c] group-hover:translate-y-0.5'
              }`}
              aria-hidden="true"
            >
              ↓
            </span>
          </button>
        </div>

        {/* 6. Footer Metadata with Live Status & Optional Microtext */}
        <div
          id="hero-footer-status"
          className={`flex flex-wrap items-center gap-x-3 gap-y-1 transition-all duration-800 ease-out ${
            stagger[5]
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-3'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] sm:text-[12px] font-mono tracking-wider text-white/50">
              Based in India
            </span>
          </div>

          <span className="text-white/20 text-xs hidden sm:inline" aria-hidden="true">
            ·
          </span>

          <span
            id="hero-microtext-figuring"
            className="text-[11px] sm:text-[12px] font-mono tracking-wider text-white/40 italic"
          >
            still figuring things out.
          </span>
        </div>
      </div>
    </section>
  );
}

