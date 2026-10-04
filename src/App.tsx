import { useCallback, useEffect, useState, type ReactNode } from 'react';
import Cursor from './components/Cursor';
import Finale from './components/Finale';
import Hero from './components/Hero';
import Journey from './components/Journey';
import Lab from './components/Lab';
import Origin from './components/Origin';
import Preloader from './components/Preloader';
import Production from './components/Production';
import Retrieval from './components/Retrieval';
import Spine from './components/Spine';
import Stack from './components/Stack';
import { TraceRule } from './components/ui';
import { initScroll, ScrollTrigger } from './lib/motion';

// Everything below the hero, in page order. Each entry mounts in its own idle
// slice so no single task blocks the main thread; mounting top-to-bottom keeps
// every ScrollTrigger pin created in document order.
const CHAPTERS: ReactNode[] = [
  <TraceRule key="t1" from="signal" to="origin" payload='{"status":"ok","context":"physics"}' />,
  <Origin key="origin" />,
  <TraceRule key="t2" from="origin" to="journey" payload='{"degree":"software engineering","year":2026}' />,
  <Journey key="journey" />,
  <TraceRule key="t3" from="journey" to="retrieval" payload='{"pattern":"retrieve → ground → act"}' />,
  <Retrieval key="retrieval" />,
  <TraceRule key="t4" from="retrieval" to="production" payload='{"env":"production","scope":"worldwide"}' />,
  <Production key="production" />,
  <TraceRule key="t5" from="production" to="lab" payload='{"mode":"after hours"}' />,
  <Lab key="lab" />,
  <TraceRule key="t6" from="lab" to="toolbelt" payload='{"physics":true}' />,
  <Stack key="stack" />,
  <Finale key="finale" />,
];

// Safari lacks requestIdleCallback; fall back to a short timeout there.
const hasIdle = typeof window.requestIdleCallback === 'function';
const idle = (fn: () => void) => (hasIdle ? window.requestIdleCallback(fn, { timeout: 300 }) : window.setTimeout(fn, 16));
const cancelIdle = (id: number) => (hasIdle ? window.cancelIdleCallback(id) : window.clearTimeout(id));

export default function App() {
  const [booted, setBooted] = useState(false);
  const [mounted, setMounted] = useState(0);
  const onBooted = useCallback(() => setBooted(true), []);
  const ready = mounted >= CHAPTERS.length;

  useEffect(() => {
    initScroll();
  }, []);

  useEffect(() => {
    if (ready) {
      // Fonts swap in after first paint; re-measure once everything (and they) are in.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      return;
    }
    const id = idle(() => setMounted((m) => m + 1));
    return () => cancelIdle(id);
  }, [mounted, ready]);

  return (
    <>
      <a className="skip-link" href="#origin">
        Skip to content
      </a>
      <Preloader onDone={onBooted} />
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <main>
        <Hero booted={booted} />
        {CHAPTERS.slice(0, mounted)}
      </main>
      {/* Mounted last so its triggers measure after every pin exists. */}
      {ready && <Spine />}
    </>
  );
}
