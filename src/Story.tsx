import { useEffect, useState, type ReactNode } from 'react';
import Avocarbon from './components/Avocarbon';
import { Contact, FloatingCta, Projects, Toolbox } from './components/Ending';
import Internships from './components/Internships';
import { Bac, Prepa } from './components/Origins';
import Path from './components/Path';
import School from './components/School';
import { initScroll, ScrollTrigger } from './lib/motion';

// Everything after the hero, in page order. Each chapter mounts in its own idle
// slice so no single task blocks the main thread, and top-to-bottom mounting keeps
// every ScrollTrigger (including the AVOCarbon pin) created in document order.
const CHAPTERS: ReactNode[] = [
  <Bac key="bac" />,
  <Prepa key="prepa" />,
  <School key="school" />,
  <Internships key="internships" />,
  <Avocarbon key="avocarbon" />,
  <Projects key="projects" />,
  <Toolbox key="toolbox" />,
  <Contact key="contact" />,
];

const hasIdle = typeof window.requestIdleCallback === 'function';
const idle = (fn: () => void) => (hasIdle ? window.requestIdleCallback(fn, { timeout: 250 }) : window.setTimeout(fn, 16));
const cancelIdle = (id: number) => (hasIdle ? window.cancelIdleCallback(id) : window.clearTimeout(id));

export default function Story() {
  const [mounted, setMounted] = useState(0);
  const ready = mounted >= CHAPTERS.length;

  useEffect(() => {
    initScroll();
  }, []);

  useEffect(() => {
    if (ready) {
      // Fonts swap in after first paint; re-measure every trigger once everything is in.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      return;
    }
    const id = idle(() => setMounted((m) => m + 1));
    return () => cancelIdle(id);
  }, [mounted, ready]);

  return (
    <>
      {CHAPTERS.slice(0, mounted)}
      {ready && (
        <>
          <Path />
          <FloatingCta />
        </>
      )}
    </>
  );
}
