import { useRef, useEffect } from 'react';
import { pad2 } from '../data/syllabus.js';

/* The session's sticky bar: back-to-index button plus block tabs.
   Keeps the original ARIA tablist pattern, including keyboard handling
   (←, →, Home, End) and the roving tabIndex. */
export default function Rail({ meta, active, onSelect, onIndex }) {
  const refs = useRef([]);
  const focusAfter = useRef(null);

  /* Keyboard navigation should carry focus to the selected tab; mouse navigation
     should not. Record the intent, apply it after the render. */
  useEffect(() => {
    if (focusAfter.current !== null) {
      refs.current[focusAfter.current]?.focus();
      focusAfter.current = null;
    }
  }, [active]);

  function onKeyDown(e, j) {
    const c = meta.blocks.length;
    let target = null;
    if (e.key === 'ArrowRight') target = (j + 1) % c;
    if (e.key === 'ArrowLeft') target = (j - 1 + c) % c;
    if (e.key === 'Home') target = 0;
    if (e.key === 'End') target = c - 1;
    if (target === null) return;
    e.preventDefault();
    focusAfter.current = target;
    onSelect(target);
  }

  const pfx = 's' + meta.n;

  return (
    <div className="rail-holder">
      <div className="wrap">
        <div className="rail-top">
          <button className="back" type="button" onClick={onIndex}>
            <span className="arrow" aria-hidden="true">←</span>
            <span className="long">Índice del curso</span>
            <span className="short">Índice</span>
          </button>
          <span className="rail-session">
            Sesión {pad2(meta.n)} · <b>{meta.title}</b>
          </span>
        </div>

        <div className="rail" role="tablist" aria-label="Bloques de la sesión">
          {meta.blocks.map((b, k) => (
            <button
              key={b.id}
              ref={el => { refs.current[k] = el; }}
              role="tab"
              id={`${pfx}-tab-${k}`}
              aria-controls={`${pfx}-pan-${k}`}
              aria-selected={k === active}
              tabIndex={k === active ? 0 : -1}
              onClick={() => onSelect(k)}
              onKeyDown={e => onKeyDown(e, k)}
            >
              <span>{b.lab} · {b.clock}</span>
              <span className="rname">{b.rname}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
