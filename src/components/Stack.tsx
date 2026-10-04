import { useEffect, useRef } from 'react';
import { stack } from '../data/profile';
import { ScrollTrigger, reduced, coarse } from '../lib/motion';
import { Kicker, Split, useSplitReveal } from './ui';

/**
 * The toolbelt: every skill is a real DOM chip, dropped into a Matter.js world
 * when the section arrives. Drag and throw them. Physics loads lazily.
 */
export default function Stack() {
  const root = useRef<HTMLElement>(null);
  const box = useRef<HTMLDivElement>(null);
  useSplitReveal(root);

  useEffect(() => {
    if (reduced) return;
    let cleanup = () => {};
    const st = ScrollTrigger.create({
      trigger: box.current,
      start: 'top 75%',
      once: true,
      onEnter: async () => {
        const M = await import('matter-js');
        const el = box.current!;
        const chips = Array.from(el.querySelectorAll<HTMLElement>('.chip-phys'));
        const W = el.clientWidth;
        const H = el.clientHeight;
        const engine = M.Engine.create({ gravity: { x: 0, y: 1, scale: 0.0011 } });
        const wall = { isStatic: true, render: { visible: false } };
        const T = 200;
        M.Composite.add(engine.world, [
          M.Bodies.rectangle(W / 2, H + T / 2, W * 3, T, wall),
          M.Bodies.rectangle(-T / 2, H / 2, T, H * 4, wall),
          M.Bodies.rectangle(W + T / 2, H / 2, T, H * 4, wall),
        ]);
        const bodies = chips.map((c, i) => {
          const w = c.offsetWidth,
            h = c.offsetHeight;
          const b = M.Bodies.rectangle(
            40 + Math.random() * (W - 80),
            -60 - i * 38 - Math.random() * 60,
            w,
            h,
            { chamfer: { radius: h / 2 }, restitution: 0.45, friction: 0.08, frictionAir: 0.012, angle: (Math.random() - 0.5) * 0.8 },
          );
          return { b, c, w, h };
        });
        M.Composite.add(engine.world, bodies.map((x) => x.b));
        el.classList.add('is-live');

        if (!coarse) {
          const mouse = M.Mouse.create(el);
          // let the page keep scrolling over the playground
          const m = mouse as unknown as { mousewheel: EventListener; element: HTMLElement };
          m.element.removeEventListener('wheel', m.mousewheel);
          m.element.removeEventListener('mousewheel', m.mousewheel);
          m.element.removeEventListener('DOMMouseScroll', m.mousewheel);
          const mc = M.MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.18, damping: 0.1 } });
          M.Composite.add(engine.world, mc);
        }

        let raf = 0;
        let visible = true;
        let last = performance.now();
        const io = new IntersectionObserver(([e]) => {
          visible = e.isIntersecting;
          last = performance.now();
        });
        io.observe(el);
        const loop = (now: number) => {
          raf = requestAnimationFrame(loop);
          if (!visible) return;
          M.Engine.update(engine, Math.min(1000 / 30, now - last));
          last = now;
          for (const { b, c, w, h } of bodies) {
            c.style.transform = `translate(${b.position.x - w / 2}px, ${b.position.y - h / 2}px) rotate(${b.angle}rad)`;
          }
        };
        raf = requestAnimationFrame(loop);
        cleanup = () => {
          cancelAnimationFrame(raf);
          io.disconnect();
          M.Engine.clear(engine);
        };
      },
    });
    return () => {
      st.kill();
      cleanup();
    };
  }, []);

  return (
    <section className="chapter stack" id="stack" ref={root} aria-labelledby="stack-title">
      <div className="stack-head">
        <Kicker index="07">The toolbelt</Kicker>
        <h2 className="display-xl" id="stack-title">
          <span data-split-reveal="">
            <Split text="Tools I trust." />
          </span>
          <br />
          <span data-split-reveal="">
            <Split text="Go ahead, throw them." className="ember" />
          </span>
        </h2>
      </div>
      <div className={`stack-box ${reduced ? 'is-static' : ''}`} ref={box} data-cursor={coarse ? undefined : 'drag'}>
        {Object.entries(stack).flatMap(([group, items]) =>
          items.map((s) => (
            <span key={group + s} className={`chip-phys g-${group.toLowerCase()}`} aria-hidden="true">
              {s}
            </span>
          )),
        )}
        <div className="stack-legend mono" aria-hidden="true">
          {Object.keys(stack).map((g) => (
            <span key={g} className={`g-${g.toLowerCase()}`}>
              <i /> {g}
            </span>
          ))}
        </div>
      </div>
      <dl className="sr-only">
        {Object.entries(stack).map(([g, items]) => (
          <div key={g}>
            <dt>{g}</dt>
            <dd>{items.join(', ')}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
