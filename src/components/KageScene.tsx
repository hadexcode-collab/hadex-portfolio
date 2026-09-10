import { useEffect, useRef } from "react";
import { KageLandingPage } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

export function Scene() {
  const frameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = frameContainerRef.current;
    if (!container) return;

    const iframe = container.querySelector("iframe");
    if (!iframe) return;

    const handleIframeWheel = (e: WheelEvent) => {
      try {
        const win = iframe.contentWindow;
        // If scrolled to top of Kage and scrolling upwards, scroll parent window back to hero slide
        if (win && win.scrollY <= 0 && e.deltaY < -15) {
          window.scrollBy({ top: e.deltaY * 2.5, behavior: "smooth" });
        }
      } catch {
        // Cross-origin fallback if applicable
      }
    };

    const attachWheelListener = () => {
      try {
        iframe.contentWindow?.addEventListener("wheel", handleIframeWheel, { passive: true });
      } catch {
        // ignore
      }
    };

    iframe.addEventListener("load", attachWheelListener);
    attachWheelListener();

    return () => {
      iframe.removeEventListener("load", attachWheelListener);
      try {
        iframe.contentWindow?.removeEventListener("wheel", handleIframeWheel);
      } catch {
        // ignore
      }
    };
  }, []);

  return (
    <div ref={frameContainerRef} className="shader-frame">
      <KageLandingPage
        headingFont="onest"
        bodyFont="onest"
        headingWeight="400"
        bodyWeight="300"
        primaryColor="#e0231c"
        headingSize={46}
        bodySize={17}
        headingLetterSpacing={-0.012}
      />
    </div>
  );
}
