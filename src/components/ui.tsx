import { Fragment, useEffect, useId, useRef, type ElementType, type ReactNode, type RefObject } from 'react';
import type { Lesson, Logo } from '../data/profile';
import { gsap, reduced } from '../lib/motion';

/** Splits text into masked words. `start` continues the stagger index across siblings. */
export function Words({ text, start = 0 }: { text: string; start?: number }) {
  const words = text.split(' ').filter(Boolean);
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="w" style={{ '--i': start + i } as React.CSSProperties}>
            <span>{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </>
  );
}

/** A headline whose words rise into place; the emphasised part is set in serif italic. */
export function Title({
  plain,
  em,
  as: Tag = 'h2',
  className = '',
  id,
}: {
  plain: string;
  em?: string;
  as?: ElementType;
  className?: string;
  id?: string;
}) {
  const n = plain.split(' ').filter(Boolean).length;
  return (
    <Tag className={`title ${className}`} data-words="" id={id}>
      <Words text={plain} />
      {em ? (
        <>
          {' '}
          <em>
            <Words text={em} start={n} />
          </em>
        </>
      ) : null}
    </Tag>
  );
}

/** Adds `.in` to reveal targets inside `ref` the first time they scroll into view. */
export function useReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>('.rv, [data-words], .lessons, .seal');
    if (reduced) {
      targets.forEach((t) => t.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [ref]);
}

/** "What I took from it": the key phrase gets a blue highlighter sweep once the list is in view. */
export function Lessons({ items, className = '' }: { items: Lesson[]; className?: string }) {
  return (
    <ul className={`lessons ${className}`}>
      {items.map((l, i) => (
        <li key={i} style={{ '--i': i } as React.CSSProperties}>
          <mark className="hl">{l.key}</mark>
          {l.rest ? ` ${l.rest}` : ''}
        </li>
      ))}
    </ul>
  );
}

export function LogoBadge({ logo, name, size = 'md' }: { logo: Logo | null; name: string; size?: 'sm' | 'md' | 'lg' }) {
  if (!logo)
    return (
      <span className={`logo-badge logo-${size} logo-name`} role="img" aria-label={name}>
        {name}
      </span>
    );
  // A symbol without a wordmark: the badge spells the name beside it.
  if (logo.mark)
    return (
      <span className={`logo-badge logo-${size} logo-mark`}>
        <img src={logo.src} alt="" width={logo.width} height={logo.height} loading="lazy" decoding="async" />
        <span className="logo-mark-name">{name}</span>
      </span>
    );
  return (
    <span className={`logo-badge logo-${size} ${logo.dark ? 'is-dark' : ''}`}>
      <img src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} loading="lazy" decoding="async" />
    </span>
  );
}

/**
 * A stop where the path leaves the left rail, passes through the centre of
 * `children` (which must carry `data-path="center"`), and returns to the rail.
 * The vertical gaps give the swoops room so the line never crosses text.
 */
export function Station({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`station ${className}`}>
      <span data-path="rail" className="path-anchor" aria-hidden="true" />
      <div className="station-body">{children}</div>
      <span data-path="rail" className="path-anchor" aria-hidden="true" />
    </div>
  );
}

/**
 * A milestone on the path: the logo arrives (scales up into the centre), holds,
 * then eases back as the chapter takes over. Scrubbed with scroll.
 */
export function Milestone({
  logo,
  name,
  when,
  label,
}: {
  logo: Logo | null;
  name: string;
  when: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const badge = el.querySelector('.logo-badge');
    const ring = el.querySelector('.milestone-ring');
    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom 15%', scrub: 0.6 } })
        .fromTo(badge, { scale: 0.45, autoAlpha: 0, rotate: -8 }, { scale: 1, autoAlpha: 1, rotate: 0, ease: 'back.out(1.6)', duration: 1 })
        .fromTo(ring, { scale: 0.6, autoAlpha: 0 }, { scale: 1.35, autoAlpha: 0.9, duration: 0.6 }, 0.55)
        .to(ring, { scale: 1.8, autoAlpha: 0, duration: 0.6 })
        .to(badge, { scale: 0.86, y: -16, duration: 0.8 }, '>-0.1');
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <Station>
      <div className="milestone" ref={ref}>
        <span className="milestone-ring" aria-hidden="true" />
        <span className="milestone-badge" data-path="center" data-path-hole="">
          <LogoBadge logo={logo} name={name} size="lg" />
        </span>
        <p className="milestone-meta rv" data-path-hole="">
          <span className="milestone-when">{when}</span>
          <span>{label}</span>
        </p>
      </div>
    </Station>
  );
}

/** A circular stamp with text running around it. It turns slowly and stamps in once. */
export function Seal({ text, children, className = '' }: { text: string; children: ReactNode; className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <div className={`seal ${className}`} data-path="center" data-path-hole="round">
      <svg className="seal-ring" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <path id={`seal-${id}`} d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
        </defs>
        <text>
          <textPath href={`#seal-${id}`}>{text}</textPath>
        </text>
      </svg>
      <span className="seal-core">{children}</span>
      <span className="seal-burst" aria-hidden="true" />
    </div>
  );
}

/** Counts to `to` (from `from`) with an expo ease the first time it's seen, then pops. */
export function Counter({ to, from = 0, duration = 1800 }: { to: number; from?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current!;
    if (reduced) return;
    el.textContent = String(from);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - t0) / duration);
          const k = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          el.textContent = String(Math.round(from + (to - from) * k));
          if (t < 1) requestAnimationFrame(step);
          else el.parentElement?.classList.add('popped');
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, from, duration]);
  return <span ref={ref}>{to}</span>;
}

export function Status({ kind, children }: { kind: 'live' | 'dev'; children: ReactNode }) {
  return (
    <span className={`status status-${kind}`}>
      <span className="status-dot" aria-hidden="true" />
      {children}
    </span>
  );
}
