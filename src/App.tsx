import { lazy, Suspense } from 'react';
import Hero from './components/Hero';

// The hero ships in the entry bundle and animates with CSS alone; the rest of the
// story (GSAP, the path, every chapter) loads as a separate chunk right after.
const Story = lazy(() => import('./Story'));

export default function App() {
  return (
    <>
      <a className="skip-link" href="#origins">
        Skip to the story
      </a>
      <main>
        <Hero />
        <Suspense fallback={null}>
          <Story />
        </Suspense>
      </main>
    </>
  );
}
