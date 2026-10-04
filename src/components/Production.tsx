import { useEffect, useRef } from 'react';
import { avocarbon } from '../data/profile';
import { gsap, reduced, ease } from '../lib/motion';
import Globe from './Globe';
import { AgentGraph, DerogationFlow, RbacMemo } from './ProductionVisuals';
import { Badge, Kicker, Split, useSplitReveal } from './ui';

const LINE = 'August 2026. First job. Real users.';

export default function Production() {
  const root = useRef<HTMLElement>(null);
  const arcs = useRef(reduced ? 1 : 0);
  useSplitReveal(root);

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      // The goosebumps beat: silence, a typed line, a world lighting up.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.climax', pin: true, start: 'top top', end: '+=320%', scrub: 1.2 },
      });
      tl.from('.climax-line .ch', { opacity: 0, duration: 0.05, stagger: 0.06, ease: 'none' })
        .to('.climax-caret', { opacity: 0, duration: 0.2 })
        .to('.climax-line', { yPercent: -60, scale: 0.6, opacity: 0.35, duration: 1, ease: 'power2.inOut' }, '+=0.4')
        .fromTo('.globe-wrap', { scale: 0.55, opacity: 0, filter: 'blur(20px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.4, ease: 'power3.out' }, '<0.2')
        .to(arcs, { current: 1, duration: 2.6, ease: 'power1.inOut' })
        .from('.climax-head .ch', { yPercent: 110, duration: 0.8, stagger: 0.012, ease: 'power3.out' }, '<0.9')
        .from('.climax-sub', { opacity: 0, y: 20, duration: 0.6 }, '>-0.2')
        .to({}, { duration: 0.8 })
        // dolly: push into the globe as the panels take over
        .to('.globe-wrap', { scale: 1.7, opacity: 0, duration: 1.2, ease: 'power2.in' })
        .to('.climax-text', { y: -80, opacity: 0, duration: 1, ease: 'power2.in' }, '<');

      gsap.utils.toArray<HTMLElement>('.project').forEach((p) => {
        gsap.from(p, {
          y: 140,
          rotateX: -14,
          scale: 0.92,
          opacity: 0,
          transformPerspective: 1400,
          transformOrigin: '50% 0%',
          duration: 1.4,
          ease: ease.outExpo,
          scrollTrigger: { trigger: p, start: 'top 90%' },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const { derogation, agent } = avocarbon;

  return (
    <section className="production" id="production" ref={root} aria-labelledby="climax-title">
      <div className="climax">
        <div className="climax-text">
          <Kicker index="05">AVOCarbon Group · {avocarbon.role}</Kicker>
          <p className="climax-line mono">
            <Split text={LINE} />
            <span className="climax-caret" aria-hidden="true" />
          </p>
        </div>
        <div className="globe-wrap">
          <Globe progress={arcs} />
        </div>
        <div className="climax-text climax-text-bottom">
          <h2 className="climax-head display-l" id="climax-title">
            <Split text="Software in production," />{' '}
            <Split text="supporting people across AVOCarbon's plants worldwide." className="ember" />
          </h2>
          <p className="climax-sub mono dim">
            From Tunis to factory floors on several continents. Arcs are illustrative, not a map of plant locations.
          </p>
        </div>
      </div>

      <div className="projects">
        <article className="project" id="project-derogation">
          <header className="project-head">
            <Badge kind="production" />
            <span className="mono dim">AVOCarbon · since {avocarbon.since}</span>
          </header>
          <div className="project-body">
            <div className="project-copy">
              <h3 className="display-m">{derogation.name}</h3>
              <p className="muted">{derogation.summary}</p>
              <ul className="facts mono">
                <li>
                  <b>4</b> roles
                </li>
                <li>
                  <b>2</b>-level approval workflow
                </li>
                <li>configurable notifications</li>
                <li>per-plant responsibility matrices</li>
              </ul>
              <ul className="tags">
                {derogation.stack.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <DerogationFlow />
          </div>
        </article>

        <article className="project project-agent" id="project-agent">
          <header className="project-head">
            <Badge kind="development" />
            <span className="mono dim">AVOCarbon · LangGraph</span>
          </header>
          <div className="project-copy project-copy-wide">
            <h3 className="display-m">{agent.name}</h3>
            <p className="muted">{agent.summary}</p>
            <ul className="tags">
              {agent.stack.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <AgentGraph />
          <div className="agent-rbac">
            <div>
              <h4 className="display-s">
                <span data-split-reveal="">
                  <Split text="Same data." />
                </span>{' '}
                <span data-split-reveal="">
                  <Split text="A different, authorized view for each role." className="ember" />
                </span>
              </h4>
              <p className="muted">
                Switch the reader. The intelligence layer stays the same, while access control decides what each role
                is allowed to see. Confidential information stays where it belongs.
              </p>
            </div>
            <RbacMemo />
          </div>
        </article>
      </div>
    </section>
  );
}
