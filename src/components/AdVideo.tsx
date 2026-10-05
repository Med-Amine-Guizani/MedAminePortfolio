import { useEffect, useRef, useState } from 'react';
import type { Film } from '../data/profile';
import {
  activeFilm,
  claimFilm,
  fallBackToH264,
  filmUrl,
  lowData,
  onActiveFilm,
  posterUrl,
  prioritize,
  registerFilm,
  releaseFilm,
  setWanting,
} from '../lib/films';
import { reduced } from '../lib/motion';

const SOUND = 'film:sound'; // one film plays with sound at a time

/**
 * A product film that plays muted while at least half of it is on screen, and pauses otherwise.
 * `blocked` pauses it too (a stacked card covered by the next one), and only one film plays at a
 * time (see films.ts). With reduced motion, or when the browser refuses autoplay, it waits for a tap.
 */
export default function AdVideo({ film, blocked = false }: { film: Film; blocked?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageShown, setPageShown] = useState(() => !document.hidden);
  const [needsTap, setNeedsTap] = useState(reduced);
  const [userPaused, setUserPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [flash, setFlash] = useState<{ kind: 'play' | 'pause'; n: number } | null>(null);
  const [active, setActive] = useState(false);
  const slug = film.slug;

  // Gives the element its source once: the warmed Blob if it's ready, else the network file.
  const ensureSrc = async () => {
    const v = video.current!;
    if (v.getAttribute('src')) return;
    v.src = claimFilm(slug) ?? (await filmUrl(slug));
  };

  useEffect(() => {
    registerFilm(slug);
    const v = video.current!;
    v.muted = v.defaultMuted = true; // React doesn't reflect `muted`; autoplay needs it
    const el = wrap.current!;
    // About 2 screens away: show the poster, warm this film next (or load it now on low data).
    const nearIo = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setNear(true);
        prioritize(slug);
        if (lowData()) {
          v.preload = 'metadata';
          ensureSrc();
        }
        nearIo.disconnect();
      },
      { rootMargin: '200% 0px' },
    );
    const visIo = new IntersectionObserver(([e]) => setVisible(e.intersectionRatio >= 0.49), { threshold: [0, 0.5, 1] });
    nearIo.observe(el);
    visIo.observe(el);
    const onVis = () => setPageShown(!document.hidden);
    const onSound = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== slug) v.muted = true;
    };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener(SOUND, onSound);
    const offActive = onActiveFilm(() => setActive(activeFilm() === slug));
    return () => {
      offActive();
      setWanting(slug, null);
      nearIo.disconnect();
      visIo.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener(SOUND, onSound);
      releaseFilm(slug);
    };
    // ensureSrc only reads refs and `slug`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const want = visible && !blocked && pageShown && !userPaused && !needsTap;
  const play = want && active;

  useEffect(() => {
    setWanting(slug, want ? wrap.current : null);
  }, [want, slug]);

  useEffect(() => {
    const v = video.current!;
    if (!play) {
      v.pause();
      return;
    }
    let live = true;
    ensureSrc().then(() => {
      if (!live) return; // scrolled away while the source was being picked
      v.play().catch((err: DOMException) => {
        // AbortError just means we paused again before playback began
        if (live && err.name === 'NotAllowedError') setNeedsTap(true);
      });
    });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play]);

  const show = (kind: 'play' | 'pause') => setFlash((f) => ({ kind, n: (f?.n ?? 0) + 1 }));

  const togglePlay = async () => {
    const v = video.current!;
    if (v.paused) {
      setUserPaused(false);
      setNeedsTap(false);
      show('play');
      await ensureSrc();
      v.play().catch(() => setNeedsTap(true));
    } else {
      setUserPaused(true);
      show('pause');
      v.pause();
    }
  };

  const toggleSound = () => {
    const v = video.current!;
    v.muted = !v.muted;
    if (!v.muted) {
      window.dispatchEvent(new CustomEvent(SOUND, { detail: slug }));
      if (v.paused) togglePlay();
    }
  };

  // A decode failure (an AV1 file the browser can't really play): swap in H.264 and carry on.
  const onError = () => {
    const v = video.current!;
    const url = fallBackToH264(slug);
    if (v.getAttribute('src') === url) return; // H.264 failed too: the poster stays up
    v.src = url;
    if (play) v.play().catch(() => setNeedsTap(true));
  };

  const label = `${film.title} (${film.duration})`;

  return (
    <div className="film" ref={wrap}>
      <video
        ref={video}
        muted
        playsInline
        loop
        preload="none"
        poster={near ? posterUrl(slug) : undefined}
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
        onError={onError}
      />
      <button type="button" className="film-hit" onClick={togglePlay} aria-label={`${playing ? 'Pause' : 'Play'}: ${label}`} />
      {!playing && (needsTap || userPaused) ? (
        <span className="film-play" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
        </span>
      ) : null}
      {flash ? (
        <span key={flash.n} className="film-flash" aria-hidden="true">
          <svg viewBox="0 0 24 24">{flash.kind === 'play' ? <path d="M8 5.5v13l11-6.5z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}</svg>
        </span>
      ) : null}
      <button type="button" className="film-sound" onClick={toggleSound} aria-pressed={!muted} aria-label={muted ? 'Turn sound on' : 'Turn sound off'}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
          {muted ? (
            <path className="film-sound-x" d="M15.5 9.5l5 5m0-5l-5 5" />
          ) : (
            <path className="film-sound-waves" d="M15.5 9a4 4 0 0 1 0 6M17.8 6.6a7.4 7.4 0 0 1 0 10.8" />
          )}
        </svg>
      </button>
    </div>
  );
}
