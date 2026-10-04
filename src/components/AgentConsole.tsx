import { useCallback, useEffect, useRef, useState } from 'react';
import { retrieve, SUGGESTIONS, type Doc } from '../lib/agent';
import { gsap, reduced, scrollToId } from '../lib/motion';

type Step =
  | { kind: 'user'; text: string }
  | { kind: 'plan'; text: string }
  | { kind: 'tool'; name: string; args: string; result: string; ms: number }
  | { kind: 'answer'; text: string; done: boolean }
  | { kind: 'error'; text: string };

const TRACE = ['plan', 'retrieve', 'tool', 'answer', 'navigate'] as const;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));

function highlight(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('agent-highlight');
  void el.offsetWidth;
  el.classList.add('agent-highlight');
  window.setTimeout(() => el.classList.remove('agent-highlight'), 3200);
}

export default function AgentConsole({ open, setOpen }: { open: boolean; setOpen: (o: boolean) => void }) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [trace, setTrace] = useState(-1);
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState('');
  const panel = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  // Ctrl/⌘ K toggles, Escape closes.
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(!open);
      } else if (e.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [open, setOpen]);

  useEffect(() => {
    const el = panel.current!;
    if (open) {
      opener.current = document.activeElement as HTMLElement;
      el.hidden = false;
      if (!reduced)
        gsap.fromTo(el, { xPercent: 8, opacity: 0, filter: 'blur(10px)' }, { xPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out' });
      window.setTimeout(() => input.current?.focus(), 50);
    } else if (!el.hidden) {
      const hide = () => {
        el.hidden = true;
        opener.current?.focus?.();
      };
      if (reduced) hide();
      else gsap.to(el, { xPercent: 8, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: hide });
    }
  }, [open]);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
  }, [steps]);

  const push = (s: Step) => setSteps((prev) => [...prev, s]);

  const run = useCallback(
    async (question: string) => {
      const text = question.trim();
      if (!text || busy) return;
      setBusy(true);
      setQ('');
      push({ kind: 'user', text });

      setTrace(0);
      const t0 = performance.now();
      const hits = retrieve(text);
      const tRetrieve = performance.now() - t0;
      const top: Doc | undefined = hits[0]?.score >= 1.5 ? hits[0].doc : undefined;
      await sleep(350);
      push({
        kind: 'plan',
        text: top
          ? `Intent looks like "${top.intent}". I'll search the profile, fetch the record, then take you there.`
          : "I'll search the profile for anything relevant.",
      });
      await sleep(500);

      setTrace(1);
      push({
        kind: 'tool',
        name: 'search_profile',
        args: JSON.stringify({ query: text }),
        result: hits.length
          ? `${hits.length} hit${hits.length > 1 ? 's' : ''} · top: ${hits
              .slice(0, 3)
              .map((h) => `${h.doc.id} (${h.score.toFixed(1)})`)
              .join(', ')}`
          : '0 hits',
        ms: tRetrieve,
      });
      await sleep(550);

      if (!top) {
        setTrace(3);
        push({
          kind: 'error',
          text: "I only know what's verified on this page, and I didn't find that. Try one of the suggestions, or ask Amine directly at amineguizani33@gmail.com.",
        });
        setTrace(-1);
        setBusy(false);
        return;
      }

      setTrace(2);
      if (top.gated) {
        push({ kind: 'tool', name: 'check_access', args: '{"role":"visitor"}', result: 'granted · public facts only', ms: 0.1 });
        await sleep(450);
      }
      const t1 = performance.now();
      const res = JSON.stringify(top.tool.result);
      push({ kind: 'tool', name: top.tool.name, args: JSON.stringify(top.tool.arg), result: res, ms: performance.now() - t1 });
      await sleep(500);

      setTrace(3);
      push({ kind: 'answer', text: '', done: false });
      const words = top.answer.split(' ');
      for (let i = 1; i <= words.length; i++) {
        const partial = words.slice(0, i).join(' ');
        setSteps((prev) => {
          const next = prev.slice();
          next[next.length - 1] = { kind: 'answer', text: partial, done: i === words.length };
          return next;
        });
        await sleep(22);
      }

      setTrace(4);
      push({ kind: 'tool', name: 'navigate', args: JSON.stringify({ to: top.target }), result: 'scrolled · highlighted', ms: 0 });
      scrollToId(top.target);
      window.setTimeout(() => highlight(top.target), reduced ? 0 : 1400);
      await sleep(900);
      setTrace(-1);
      setBusy(false);
    },
    [busy],
  );

  return (
    <>
      <button className="agent-fab" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="agent-panel" data-cursor="ask">
        <span className="agent-fab-dot" />
        Ask my agent
        <kbd>Ctrl K</kbd>
      </button>

      <div
        className="agent"
        id="agent-panel"
        ref={panel}
        role="dialog"
        aria-modal="false"
        aria-label="Ask Amine's agent"
        hidden
        data-lenis-prevent
      >
        <header className="agent-head">
          <div>
            <p className="agent-title">agent://amine</p>
            <p className="mono dim agent-sub">runs locally on this page · grounded on verified facts</p>
          </div>
          <button className="agent-close" onClick={() => setOpen(false)} aria-label="Close agent">
            ✕
          </button>
        </header>

        <ol className="agent-trace" aria-label="Agent trace">
          {TRACE.map((t, i) => (
            <li key={t} className={`${trace === i ? 'is-on' : ''} ${trace > i ? 'is-done' : ''}`}>
              <span className="agent-trace-dot" />
              <span className="mono">{t}</span>
            </li>
          ))}
        </ol>

        <div className="agent-log" ref={log} aria-live="polite">
          {steps.length === 0 && (
            <div className="agent-empty">
              <p>
                Ask me anything about Amine's work. I'll plan, call tools, answer, and take you to the proof on this page.
              </p>
            </div>
          )}
          {steps.map((s, i) => {
            if (s.kind === 'user') return <p key={i} className="msg msg-user">{s.text}</p>;
            if (s.kind === 'plan') return <p key={i} className="msg msg-plan mono">↳ {s.text}</p>;
            if (s.kind === 'error') return <p key={i} className="msg msg-answer">{s.text}</p>;
            if (s.kind === 'answer')
              return (
                <p key={i} className="msg msg-answer">
                  {s.text}
                  {!s.done && <span className="caret" />}
                </p>
              );
            return (
              <div key={i} className="msg msg-tool mono">
                <div>
                  <span className="ember">{s.name}</span>({s.args})
                </div>
                <div className="dim">
                  → {s.result} <span className="msg-ms">{s.ms < 0.01 ? '<0.01' : s.ms.toFixed(2)}ms</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="agent-suggest">
          {SUGGESTIONS.map((s) => (
            <button key={s} className="chip" onClick={() => run(s)} disabled={busy}>
              {s}
            </button>
          ))}
        </div>

        <form
          className="agent-input"
          onSubmit={(e) => {
            e.preventDefault();
            run(q);
          }}
        >
          <span className="mono ember" aria-hidden="true">
            &gt;
          </span>
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ask about production, RAG, agents, results…"
            aria-label="Your question"
            disabled={busy}
          />
          <button type="submit" className="btn btn-ember btn-sm" disabled={busy || !q.trim()}>
            Run
          </button>
        </form>
      </div>
    </>
  );
}
