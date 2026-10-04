import { useEffect, useRef, useState } from 'react';
import { chapters } from '../data/profile';
import { ScrollTrigger, scrollToId } from '../lib/motion';

/**
 * The page's graph edge: a fixed vertical line that fills as the visitor
 * scrolls, with one node per chapter. It doubles as the progress indicator.
 */
export default function Spine() {
  const fill = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [positions, setPositions] = useState<number[]>(() => chapters.map((_, i) => i / (chapters.length - 1)));

  useEffect(() => {
    // CSS decides the axis (vertical rail on desktop, top bar on mobile).
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => fill.current?.style.setProperty('--p', self.progress.toFixed(4)),
    });
    const triggers = chapters.map((c, i) =>
      ScrollTrigger.create({
        trigger: `#${c.id}`,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => self.isActive && setActive(i),
      }),
    );
    const measure = () => {
      const max = ScrollTrigger.maxScroll(window) || 1;
      setPositions(triggers.map((t) => Math.min(1, Math.max(0, (t.start + window.innerHeight * 0.55) / max))));
    };
    ScrollTrigger.addEventListener('refresh', measure);
    measure();
    return () => {
      st.kill();
      triggers.forEach((t) => t.kill());
      ScrollTrigger.removeEventListener('refresh', measure);
    };
  }, []);

  const n = String(active + 1).padStart(2, '0');
  const total = String(chapters.length).padStart(2, '0');

  return (
    <nav className="spine" aria-label="Chapters">
      <div className="spine-track">
        <div className="spine-fill" ref={fill} />
        {chapters.map((c, i) => (
          <button
            key={c.id}
            className={`spine-node ${i <= active ? 'is-past' : ''} ${i === active ? 'is-active' : ''}`}
            style={{ top: `${positions[i] * 100}%` }}
            onClick={() => scrollToId(c.id)}
            aria-label={`Go to ${c.label}`}
            aria-current={i === active ? 'step' : undefined}
            data-cursor={c.label.toLowerCase()}
          >
            <span className="spine-tip">{c.label}</span>
          </button>
        ))}
      </div>
      <div className="spine-hud" aria-hidden="true">
        <span className="spine-hud-n">
          node {n}/{total}
        </span>
        <span className="spine-hud-label">{chapters[active].label}</span>
      </div>
    </nav>
  );
}
