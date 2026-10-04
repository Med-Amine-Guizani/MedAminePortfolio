import { useEffect, useRef, useState } from 'react';
import { gsap, reduced, stopScroll } from '../lib/motion';

const LINES = [
  '> boot agent://amine-guizani',
  '> loading context ......... profile.json',
  '> resolving graph ......... 8 nodes, 7 edges',
  '> binding tools ........... search · navigate · contact',
  '> checking access ......... role=visitor',
  '> ready',
];

const KEY = 'ag-booted';

function seen() {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [show] = useState(() => !reduced && !seen());
  const root = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    if (!show) {
      onDone();
      return;
    }
    stopScroll(true);
    const finish = () => {
      if (done.current) return;
      done.current = true;
      try {
        sessionStorage.setItem(KEY, '1');
      } catch {
        /* storage unavailable */
      }
      const el = root.current!;
      gsap
        .timeline({
          onComplete: () => {
            el.style.display = 'none';
            stopScroll(false);
          },
        })
        .to(el.querySelector('.boot-log'), { opacity: 0, y: -20, duration: 0.35, ease: 'power2.in' })
        .to(el.querySelector('.boot-top'), { yPercent: -100, duration: 1, ease: 'expo.inOut' }, 0.2)
        .to(el.querySelector('.boot-bottom'), { yPercent: 100, duration: 1, ease: 'expo.inOut' }, 0.2)
        .to(el.querySelector('.boot-seam'), { scaleX: 1, opacity: 0, duration: 0.9, ease: 'expo.out' }, 0.15)
        .add(() => onDone(), 0.55);
    };

    const counter = { v: 0 };
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(counter, {
      v: 100,
      duration: 2.1,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (pct.current) pct.current.textContent = String(Math.round(counter.v)).padStart(3, '0');
        setLines(Math.min(LINES.length, Math.floor((counter.v / 100) * LINES.length) + 1));
      },
    });

    const skip = () => {
      tl.kill();
      setLines(LINES.length);
      finish();
    };
    window.addEventListener('keydown', skip, { once: true });
    return () => {
      tl.kill();
      window.removeEventListener('keydown', skip);
    };
  }, [show, onDone]);

  if (!show) return null;
  return (
    <div className="boot" ref={root} role="status" aria-live="polite" aria-label="Loading">
      <div className="boot-top" />
      <div className="boot-bottom" />
      <div className="boot-seam" />
      <div className="boot-log">
        <pre>
          {LINES.slice(0, lines).map((l, i) => (
            <span key={i} className={i === LINES.length - 1 ? 'boot-ready' : ''}>
              {l}
              {'\n'}
            </span>
          ))}
        </pre>
        <div className="boot-meta">
          <span ref={pct} className="boot-pct">
            000
          </span>
          <button
            className="boot-skip"
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))}
          >
            skip ↵
          </button>
        </div>
      </div>
    </div>
  );
}
