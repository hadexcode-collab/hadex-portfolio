import { useEffect, useRef, useState } from 'react';

const getAssetUrl = (path: string): string => {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
};

const HERO_VIDEO_SRC = getAssetUrl('AVINASH.mp4');
const HERO_POSTER_JPG = getAssetUrl('avinash-poster.jpg');

interface BackgroundVideoProps {
  active?: boolean;
}

export function BackgroundVideo({ active = true }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const innerWrapperRef = useRef<HTMLDivElement | null>(null);

  // Target and interpolated coordinates
  const targetXRef = useRef<number>(0.5);
  const targetYRef = useRef<number>(0.5);
  const eyeXRef = useRef<number>(0.5);
  const headXRef = useRef<number>(0.5);
  const headYRef = useRef<number>(0.5);

  const lastMoveTimeRef = useRef<number>(Date.now());
  const rafIdRef = useRef<number | null>(null);
  const isSeekingRef = useRef<boolean>(false);
  const seekStartTimeRef = useRef<number>(0);
  const totalMovementRef = useRef<number>(0);
  const prevMousePosRef = useRef<{ x: number; y: number } | null>(null);

  const [hasInteracted, setHasInteracted] = useState(false);

  // Ensure autoplay and muted playback on mount
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.play().catch(() => {
        // Handled gracefully if browser restricts initial autoplay
      });
    }
  }, []);

  // Compute video timestamp based on horizontal gaze position
  const getGazeTimestamp = (normX: number, duration: number): number => {
    if (!duration || duration <= 0) return 0.8;
    const clampedX = Math.max(0, Math.min(1, normX));

    // Mapping:
    // Left of screen (clampedX < 0.5): looks towards left (1.0s -> 2.1s)
    // Center (clampedX ≈ 0.5): looks forward (0.8s)
    // Right of screen (clampedX > 0.5): looks towards right (0.8s -> 3.2s)
    let targetTime = 0.8;
    if (clampedX < 0.5) {
      const ratio = (0.5 - clampedX) / 0.5;
      targetTime = 0.8 + ratio * 1.3; // up to 2.1s
    } else {
      const ratio = (clampedX - 0.5) / 0.5;
      targetTime = 0.8 + ratio * 2.4; // up to 3.2s
    }
    return Math.max(0.05, Math.min(duration - 0.05, targetTime));
  };

  // Main animation loop: decoupled eye and head tracking with spring settling
  useEffect(() => {
    const tick = () => {
      const now = performance.now();
      const idleElapsed = Date.now() - lastMoveTimeRef.current;

      // Idle breathing simulation if no user interaction for > 1.8 seconds
      let targetX = targetXRef.current;
      let targetY = targetYRef.current;

      if (idleElapsed > 1800) {
        const idleBreathingX = Math.sin(now * 0.001) * 0.02;
        const idleBreathingY = Math.cos(now * 0.0015) * 0.025;
        targetX += idleBreathingX;
        targetY += idleBreathingY;
      }

      // Eyes follow first (faster lerp: 0.12)
      eyeXRef.current += (targetX - eyeXRef.current) * 0.12;

      // Head follows slightly afterward with gentle damping (lerp: 0.045)
      headXRef.current += (targetX - headXRef.current) * 0.045;
      headYRef.current += (targetY - headYRef.current) * 0.04;

      // 1. Update Video Seek for eye tracking
      const video = videoRef.current;
      if (video && video.duration) {
        if (!isSeekingRef.current) {
          const desiredTime = getGazeTimestamp(eyeXRef.current, video.duration);
          if (Math.abs(video.currentTime - desiredTime) > 0.03) {
            isSeekingRef.current = true;
            seekStartTimeRef.current = now;
            video.currentTime = desiredTime;
          }
        } else if (now - seekStartTimeRef.current > 100) {
          // Safety fallback in case onSeeked was dropped
          isSeekingRef.current = false;
        }
      }

      // 2. Subtle 2.5D optical head rotation & micro-parallax
      const wrapper = innerWrapperRef.current;
      if (wrapper) {
        const centeredX = (headXRef.current - 0.5) * 2; // -1 to 1
        const centeredY = (headYRef.current - 0.5) * 2; // -1 to 1

        const rotateY = centeredX * 5.5; // max ±5.5 degrees
        const rotateX = -centeredY * 3.8; // max ±3.8 degrees
        const translateX = centeredX * 12; // max ±12px
        const translateY = centeredY * 8; // max ±8px

        wrapper.style.transform = `perspective(1200px) rotateY(${rotateY.toFixed(
          2
        )}deg) rotateX(${rotateX.toFixed(2)}deg) translate3d(${translateX.toFixed(
          1
        )}px, ${translateY.toFixed(1)}px, 0px)`;
      }

      if (active) {
        rafIdRef.current = requestAnimationFrame(tick);
      }
    };

    if (active) {
      rafIdRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [active]);

  const handleSeeked = () => {
    isSeekingRef.current = false;
  };

  // Pointer tracking (mouse and touch)
  useEffect(() => {
    if (!active) {
      // Gracefully settle gaze to center when inactive
      targetXRef.current = 0.5;
      targetYRef.current = 0.5;
      return;
    }

    const handlePointerMove = (clientX: number, clientY: number) => {
      // Wake up video decoder if browser paused it on startup
      const video = videoRef.current;
      if (video && video.paused) {
        video.play().catch(() => {});
      }

      const normX = clientX / window.innerWidth;
      const normY = clientY / window.innerHeight;

      targetXRef.current = normX;
      targetYRef.current = normY;
      lastMoveTimeRef.current = Date.now();

      // Accumulate movement to gracefully dismiss the interaction hint
      if (prevMousePosRef.current) {
        const dx = clientX - prevMousePosRef.current.x;
        const dy = clientY - prevMousePosRef.current.y;
        totalMovementRef.current += Math.hypot(dx, dy);
        if (totalMovementRef.current > 40) {
          setHasInteracted(true);
        }
      }
      prevMousePosRef.current = { x: clientX, y: clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onMouseLeave = () => {
      // Return gently to center when cursor exits window
      targetXRef.current = 0.5;
      targetYRef.current = 0.5;
      lastMoveTimeRef.current = Date.now();
      prevMousePosRef.current = null;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [active]);

  return (
    <>
      {/* Cinematic Right-Side Portrait Container (approx 48-50% width on desktop) */}
      <div
        ref={containerRef}
        id="hero-portrait-container"
        className="absolute top-0 right-0 z-[1] h-full w-full md:w-[50vw] lg:w-[48vw] xl:w-[46vw] pointer-events-none overflow-hidden flex items-center justify-center opacity-100 scale-100 select-none"
      >
        {/* Inner 2.5D optical tilt wrapper with will-change for GPU acceleration */}
        <div
          ref={innerWrapperRef}
          id="hero-portrait-tilt-wrapper"
          className="relative w-full h-full will-change-transform transform-gpu"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Interactive Cursor-Tracking Video with Native Poster for Instant 0ms Paint */}
          <video
            ref={videoRef}
            id="hero-cinematic-portrait-video"
            src={HERO_VIDEO_SRC}
            poster={HERO_POSTER_JPG}
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            onSeeked={handleSeeked}
            onLoadedData={() => {
              const video = videoRef.current;
              if (video) {
                video.play().catch(() => {});
              }
            }}
            className="w-full h-full object-cover object-center pointer-events-none select-none"
          />

          {/* Seamless aesthetic edge blends into the pure black background */}
          <div className="absolute inset-y-0 left-0 w-36 lg:w-48 bg-gradient-to-r from-black via-black/50 to-transparent pointer-events-none hidden md:block" />
          <div className="absolute inset-x-0 bottom-0 h-32 lg:h-40 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
        </div>

        {/* Poetic interaction hint */}
        <div
          id="hero-cursor-interaction-hint"
          aria-live="polite"
          className="absolute bottom-8 sm:bottom-12 left-6 sm:left-10 lg:left-12 z-10 pointer-events-none select-none transition-all duration-700 ease-out"
        >
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/50 border border-white/10 backdrop-blur-md shadow-2xl">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full transition-colors duration-500 ${
                  hasInteracted ? 'bg-emerald-400 opacity-60' : 'bg-white opacity-40'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 transition-colors duration-500 ${
                  hasInteracted ? 'bg-emerald-400' : 'bg-white/80'
                }`}
              />
            </span>

            <div className="overflow-hidden">
              {!hasInteracted ? (
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 leading-tight">
                  <span className="text-[11px] sm:text-[12px] uppercase font-mono tracking-[0.16em] text-white/85 font-medium">
                    Move your cursor.
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.1em] text-white/45">
                    Let's see what he notices.
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 leading-tight animate-fade-in">
                  <span className="text-[11px] sm:text-[12px] font-mono tracking-[0.18em] text-white/90 uppercase font-medium">
                    He noticed.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


