// Tiny navigation helper the hero can use before the motion bundle has loaded.
// Once smooth scrolling is ready, motion.ts registers a handler that takes over.

let handler: ((id: string) => void) | null = null;

export function setNavHandler(fn: (id: string) => void) {
  handler = fn;
}

export function goTo(id: string) {
  if (handler) return handler(id);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
}
