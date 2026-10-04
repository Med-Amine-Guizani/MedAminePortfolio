import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { person, projects, toolbox } from '../data/profile';
import { goTo } from '../lib/nav';
import { Title, useReveal } from './ui';

export function Projects() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section className="chapter projects" id="projects" ref={ref} aria-labelledby="projects-title">
      <div className="wrap">
        <span data-path="rail" className="path-anchor" aria-hidden="true" />
        <p className="kicker rv">Also built</p>
        <Title id="projects-title" plain="On my own time," em="for the joy of it." className="title-m" />
      </div>
      <div className="wrap swipe">
        <ul className="project-row" aria-label="Side projects">
          {projects.map((p, i) => (
            <li key={p.name} className="project rv" style={{ '--i': i } as React.CSSProperties}>
              <div className={`project-art art-${i}`} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <p className="project-kind">{p.kind}</p>
              <h3>{p.name}</h3>
              <p className="project-text">{p.text}</p>
              <p className="project-stack">{p.stack.join(' · ')}</p>
              {p.links.length > 0 && (
                <p className="project-links">
                  {p.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="link">
                      {l.label} <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Toolbox() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section className="chapter toolbox" id="toolbox" ref={ref} aria-labelledby="toolbox-title">
      <div className="marquee" aria-hidden="true" data-path-hole="">
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k}>
              Listen <em>·</em> Learn <em>·</em> Build <em>·</em> Ship <em>·</em> Watch <em>·</em> Improve <em>·</em>{' '}
            </span>
          ))}
        </div>
      </div>
      <div className="wrap">
        <span data-path="rail" className="path-anchor" aria-hidden="true" />
        <p className="kicker rv">Toolbox</p>
        <Title id="toolbox-title" plain="What I build" em="with." className="title-m" />
        <dl className="tools">
          {Object.entries(toolbox).map(([group, items], gi) => (
            <div className="tool-group rv" key={group} style={{ '--i': gi } as React.CSSProperties}>
              <dt>{group}</dt>
              <dd>
                <ul>
                  {items.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
        <span data-path="rail" className="path-anchor" aria-hidden="true" />
      </div>
    </section>
  );
}

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  useReveal(ref);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${person.email}`;
    }
  };
  return (
    <section className="chapter contact" id="contact" ref={ref} aria-labelledby="contact-title">
      <div className="contact-glow" aria-hidden="true" />
      <div className="wrap center">
        <span data-path="rail" className="path-anchor" aria-hidden="true" />
        <span className="path-end" data-path="end" aria-hidden="true" />
        <p className="kicker rv">Next chapter</p>
        <Title id="contact-title" plain="Let's build" em="what's next." className="title-xl" />
        <p className="contact-lede rv">
          I'm always happy to talk about AI, products, or a role where I can ship real things for real people.
        </p>
        <a className="contact-mail rv" href={`mailto:${person.email}`}>
          {person.email}
        </a>
        <div className="contact-actions rv">
          <button className="btn btn-primary" onClick={copy} aria-live="polite">
            {copied ? 'Copied ✓' : 'Copy email'}
          </button>
          <a className="btn btn-ghost" href={person.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
          <a className="btn btn-ghost" href={person.github} target="_blank" rel="noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a className="btn btn-ghost" href={person.phoneHref}>
            {person.phone}
          </a>
        </div>
        <p className="languages rv">
          {person.languages.map(([l, lvl]) => (
            <span key={l}>
              {l} <span className="muted">({lvl})</span>
            </span>
          ))}
        </p>
      </div>
      <footer className="footer wrap">
        <span>© 2026 {person.fullName}</span>
        <span>{person.location}</span>
      </footer>
    </section>
  );
}

/** A thumb-reachable "Let's talk" pill: appears after the hero, steps aside at the contact section. */
export function FloatingCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const hero = document.getElementById('top');
    const contact = document.getElementById('contact');
    let pastHero = false;
    let atContact = false;
    const update = () => setShow(pastHero && !atContact);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) pastHero = !e.isIntersecting;
        if (e.target === contact) atContact = e.isIntersecting;
      }
      update();
    });
    if (hero) io.observe(hero);
    if (contact) io.observe(contact);
    return () => io.disconnect();
  }, []);
  // On <body> so it floats above the path canvas.
  return createPortal(
    <button className={`cta-float ${show ? 'is-on' : ''}`} onClick={() => goTo('contact')} tabIndex={show ? 0 : -1} aria-hidden={!show}>
      <span className="cta-dot" aria-hidden="true" />
      Let's talk
    </button>,
    document.body,
  );
}
