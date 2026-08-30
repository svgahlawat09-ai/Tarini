import { useEffect, useRef, useState } from "react";

// Wraps any content and gently fades + slides it up the first time it
// scrolls into view. Used on headings/sections across the site for a
// light, professional entrance — not a flashy per-letter animation.
//
// Usage:  <Reveal><h2>Some heading</h2></Reveal>
//         <Reveal delay={100}><p>...</p></Reveal>

export default function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If the user hasn't scrolled to it yet, observe it.
    // Once it's visible once, we stop watching (no re-triggering on scroll up/down).
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
