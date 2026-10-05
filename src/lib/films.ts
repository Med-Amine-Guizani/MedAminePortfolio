// Product films. Picks the best codec this device decodes smoothly, then warms the files one at a
// time, in page order, from the visitor's first scroll, so each film is ready before they reach it.
// Warming fetches into a Blob because iOS Safari ignores `preload`.

const BASE = import.meta.env.BASE_URL;

/** Read from the encoded files' av1C / avcC boxes (see public/videos/README.md). */
const TYPES = {
  av1: 'video/mp4; codecs="av01.0.08M.08"',
  h264: 'video/mp4; codecs="avc1.640020"',
} as const;
type Codec = keyof typeof TYPES;

type Connection = { saveData?: boolean; effectiveType?: string };

/** Save-Data or a 2G-class connection: no warm-up, films load only when they come near. */
export function lowData() {
  const c = (navigator as Navigator & { connection?: Connection }).connection;
  return !!c && (!!c.saveData || /(^|-)2g$/.test(c.effectiveType ?? ''));
}

let codec: Promise<Codec> | null = null;

/** AV1 only where it decodes smoothly at 720p60; everything else gets H.264. */
function pickCodec(): Promise<Codec> {
  codec ??= (async () => {
    try {
      const info = await navigator.mediaCapabilities.decodingInfo({
        type: 'file',
        video: { contentType: TYPES.av1, width: 1280, height: 720, bitrate: 1_500_000, framerate: 60 },
      });
      return info.supported && info.smooth ? 'av1' : 'h264';
    } catch {
      return document.createElement('video').canPlayType(TYPES.av1) ? 'av1' : 'h264';
    }
  })();
  return codec;
}

export async function filmUrl(slug: string) {
  return `${BASE}videos/${slug}.${await pickCodec()}.mp4`;
}

export const posterUrl = (slug: string) => `${BASE}videos/${slug}.webp`;

/**
 * A file failed to decode even though the browser claimed support: use H.264 from now on, for
 * every film. Warmed AV1 copies are useless now, so they're dropped and warmed again as H.264.
 */
export function fallBackToH264(slug: string) {
  codec = Promise.resolve('h264');
  for (const f of films.values()) {
    if (f.codec !== 'av1' || f.state !== 'ready') continue;
    URL.revokeObjectURL(f.blobUrl!);
    f.blobUrl = undefined;
    f.state = 'pending';
  }
  pump();
  return `${BASE}videos/${slug}.h264.mp4`;
}

type Warm = { state: 'pending' | 'loading' | 'ready' | 'off'; ctrl?: AbortController; blobUrl?: string; codec?: Codec };

const films = new Map<string, Warm>();
const order: string[] = []; // registration order = page order (chapters mount top to bottom)
let started = false;
let busy = false;

async function pump() {
  if (!started || busy) return;
  const slug = order.find((s) => films.get(s)!.state === 'pending');
  if (!slug) return;
  const f = films.get(slug)!;
  busy = true;
  f.state = 'loading';
  f.ctrl = new AbortController();
  try {
    const kind = await pickCodec();
    const res = await fetch(`${BASE}videos/${slug}.${kind}.mp4`, { signal: f.ctrl.signal });
    if (!res.ok) throw new Error(String(res.status));
    const blob = await res.blob();
    if (f.state === 'loading') {
      f.blobUrl = URL.createObjectURL(blob);
      f.codec = kind;
      f.state = 'ready';
    }
  } catch {
    if (f.state === 'loading') f.state = 'off';
  }
  busy = false;
  pump();
}

function start() {
  if (started || lowData()) return;
  started = true;
  pump();
}

export function registerFilm(slug: string) {
  if (films.has(slug)) return;
  films.set(slug, { state: 'pending' });
  order.push(slug);
  pump();
}

/** A film is about to be needed: warm it next. */
export function prioritize(slug: string) {
  const i = order.indexOf(slug);
  if (i > 0 && films.get(slug)?.state === 'pending') order.unshift(...order.splice(i, 1));
}

/**
 * The video element needs its source now. Returns the warmed Blob URL if it's ready; otherwise
 * stops warming this film (the element streams it instead) and returns null.
 */
export function claimFilm(slug: string): string | null {
  const f = films.get(slug);
  if (!f) return null;
  if (f.state === 'ready') return f.blobUrl!;
  if (f.state === 'loading') f.ctrl?.abort();
  f.state = 'off';
  return null;
}

export function releaseFilm(slug: string) {
  const f = films.get(slug);
  if (!f) return;
  if (f.state === 'loading') f.ctrl?.abort();
  f.state = 'off';
  if (f.blobUrl) URL.revokeObjectURL(f.blobUrl);
  films.delete(slug);
  order.splice(order.indexOf(slug), 1);
}

// One film plays at a time. Of the films that want to play, the one furthest down the page wins:
// it's the one the visitor just scrolled to (a card sliding over the previous one, say). When it
// stops wanting to, the next one takes over.
const wanting = new Map<string, HTMLElement>();
const listeners = new Set<() => void>();

export function setWanting(slug: string, el: HTMLElement | null) {
  if (el) wanting.set(slug, el);
  else wanting.delete(slug);
  listeners.forEach((l) => l());
}

export function activeFilm() {
  let best: [string, HTMLElement] | null = null;
  for (const entry of wanting)
    if (!best || best[1].compareDocumentPosition(entry[1]) & Node.DOCUMENT_POSITION_FOLLOWING) best = entry;
  return best?.[0] ?? null;
}

export function onActiveFilm(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

// Warm-up starts on the first scroll, or 4 s after load if the visitor hasn't scrolled yet.
if (typeof window !== 'undefined') {
  if (window.scrollY > 0) start();
  else window.addEventListener('scroll', start, { once: true, passive: true });
  const arm = () => window.setTimeout(start, 4000);
  if (document.readyState === 'complete') arm();
  else window.addEventListener('load', arm, { once: true });
}
