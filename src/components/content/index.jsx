/* The course's visual vocabulary. Each component emits exactly the markup that
   panels.html emitted; only the class names were translated, and the stylesheet was
   translated with them, so the rendered result is unchanged. */

import { useEffect, useMemo, useRef, useState } from 'react';
import { MANIFEST, commonsPage, sourcesFor } from '../../assets/sources.js';

/* ── Zoom: a figure at its real size ──────────────────
   The figures are drawn on 980px canvases and their labels are 11 or 12px. On a 360px
   phone that shrinks below 5px: the figure fits on screen but stops being readable. So
   the page shows the overview, fitted to the width, and this button opens the same
   figure at its natural size for the detail.

   A native <dialog> gives Esc, the top layer, a focus trap and focus returned to the
   button on close. The content only mounts while it is open: it does not duplicate a
   session's fourteen figures in the DOM. */
function Zoom({ label, children }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);

  return (
    <>
      <button type="button" className="zoom" onClick={() => setOpen(true)}>
        Ampliar
      </button>
      {/* onClose covers the exits that skip the button: Esc, and the browser closing it. */}
      <dialog className="zoomed" ref={dialog} aria-label={label} onClose={() => setOpen(false)}>
        {open && (
          <>
            <div className="zoom-bar">
              <p>{label}</p>
              <button type="button" onClick={() => setOpen(false)}>Cerrar</button>
            </div>
            <div className="zoom-body">{children}</div>
          </>
        )}
      </dialog>
    </>
  );
}

/* The canvas width and the description come out of the SVG that figures.js returns, so
   none of the fifteen figures has to declare anything new. */
const naturalWidth = m => Number((/viewBox="0 0 ([\d.]+)/.exec(m) || [])[1]) || 980;
const svgLabel = m => (/aria-label="([^"]*)"/.exec(m) || [])[1] || 'Figura';

/* ── Panel: one <section> per block ──────────────────────────
   The original kept all five panels in the DOM and hid four with `hidden`.
   Here only the active one mounts, so there is no hidden attribute to manage. */
export function Panel({ id, tabId, children }) {
  return (
    <section className="panel" role="tabpanel" id={id} aria-labelledby={tabId} tabIndex={0}>
      {children}
    </section>
  );
}

/* ── Task: what the group has to do ── */
export function Task({ label, big, children }) {
  return (
    <div className="task">
      {label && <p className="label">{label}</p>}
      {big && <p className="big">{big}</p>}
      {children}
    </div>
  );
}

/* Options (A, B, C…) or numbered steps (01, 02…) inside a task. */
export function Options({ steps, children }) {
  return <ol className={steps ? 'steps' : undefined}>{children}</ol>;
}

/* ── The idea that sticks ── */
export function Idea({ children }) {
  return <p className="idea">{children}</p>;
}

/* ── Generated figure: SVG built by the functions in figures.js ──
   Injected as markup because these are procedural drawings built from hundreds of
   lines of coordinate arithmetic; rewriting them as JSX would change the code
   without changing a single pixel. The markup is static and authored in this repo:
   no user input ever reaches it. */
export function Diagram({ fig, width, children }) {
  /* fig() walks hundreds of coordinates. It used to run on every render; now it runs
     once, and the same markup serves both the page view and the zoomed one. */
  const markup = useMemo(() => fig(), [fig]);
  const natural = useMemo(() => naturalWidth(markup), [markup]);
  const label = useMemo(() => svgLabel(markup), [markup]);

  return (
    <figure className="diagram" style={width ? { maxWidth: width } : undefined}>
      <div className="frame" dangerouslySetInnerHTML={{ __html: markup }} />
      <Zoom label={label}>
        {/* At its natural width the text is back to a real 12px; if the screen affords
            more, the figure grows with it instead of leaving empty margins. */}
        <div style={{ width: `max(100%, ${natural}px)` }}
             dangerouslySetInnerHTML={{ __html: markup }} />
      </Zoom>
      {children && <figcaption>{children}</figcaption>}
    </figure>
  );
}

/* ── Plate: an image mounted on paper ──
   The plate is not in the repository: it is requested from Wikimedia Commons, its
   source, and if that request falls over -- a renamed file, a classroom with no access
   -- onError asks the bucket for it instead. See src/assets/sources.js. */
export function Plate({ variant, asset, alt, children }) {
  const meta = MANIFEST[asset];
  const [origin, setOrigin] = useState('commons');
  const src = sourcesFor(asset, variant, origin);

  return (
    <figure className={variant ? `plate ${variant}` : 'plate'}>
      <div className="mount">
        <img
          /* Remounts the <img> when the origin changes: without this the browser keeps
             the broken srcSet and never asks for anything again. */
          key={origin}
          src={src.src}
          srcSet={src.srcSet}
          sizes={src.sizes}
          alt={alt}
          /* From the original: these only reserve the ratio, the CSS sets the width. */
          width={meta.w}
          height={meta.h}
          loading="lazy"
          decoding="async"
          /* The guard breaks the loop: if the bucket fails too, there is nowhere left. */
          onError={() => origin === 'commons' && setOrigin('bucket')}
        />
      </div>
      {children && <figcaption>{children}</figcaption>}
    </figure>
  );
}

/* Credit line under an image. */
export function Source({ children }) {
  return <span className="source">{children}</span>;
}

/* The «Wikimedia Commons» at the end of a credit line, pointing at that plate's file
   page — where the author, the licence and the file's history actually live. Every CC
   licence here asks for a link back to the work, and this is it.

   The URL is derived from the manifest rather than typed into the credit, so it cannot
   drift from the file the <Plate> above is actually loading. The words stay written at
   the call site on purpose: they are course content, and check_content.py counts them.

   It opens in a new tab because these pages are read during a projected class, and
   navigating the slides away to Wikimedia mid-session is not recoverable in one step. */
export function CommonsLink({ asset, children }) {
  return (
    <a href={commonsPage(asset)} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

/* ── Card grid ── */
export function Cards({ cols, children }) {
  return <div className={cols ? `cards ${cols}` : 'cards'}>{children}</div>;
}

export function Card({ red, k, t, children }) {
  return (
    <div className={red ? 'card red' : 'card'}>
      {k && <span className="k">{k}</span>}
      {t && <span className="t">{t}</span>}
      {children && <span className="d">{children}</span>}
    </div>
  );
}

/* ── DataTable: the class's own spreadsheet, printed ──
   Session 3 audits a real 23 × 10 table, and every one of its activities depends
   on being able to point at a single cell: the group answers in the chat with a
   coordinate. So rows carry their number and columns carry a letter, the way a
   spreadsheet does.

   Cells are printed exactly as they arrived. A trailing space gets a visible ␣
   and an empty cell gets its own tint, because in this session the whitespace
   and the holes are the subject, not noise to tidy away before publishing.

   `pick` and `only` narrow the table to some columns or some rows without
   renumbering: a panel can zoom into one column and the coordinates still match
   the full table the group has been looking at all morning. */
export function DataTable({ cols, rows, pick, only, mark, wrap, focus, caption }) {
  const keep = pick ? cols.filter(c => pick.includes(c[0])) : cols;
  const at = keep.map(c => cols.findIndex(o => o[0] === c[0]));
  const nums = only || rows.map((_, i) => i + 1);
  const marked = new Set(mark || []);
  const wraps = new Set(wrap || []);

  /* The same table is drawn twice -- on the page and zoomed -- and a coordinate has to
     land on the same cell in both, so it is built once. */
  const table = (
    <table>
      <thead>
        <tr>
          <th className="n" scope="col"><span className="l">#</span></th>
          {keep.map(([letter, , label]) => (
            <th key={letter} scope="col">
              <span className="l">{letter}</span>
              <span className="h">{label}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {nums.map(n => (
          <tr key={n}>
            <th className="n" scope="row">{n}</th>
            {keep.map(([letter], j) => {
              const v = rows[n - 1][at[j]];
              const cls = [
                v === '' ? 'empty' : '',
                marked.has(letter + n) ? 'mk' : '',
                wraps.has(letter) ? 'w' : ''
              ].filter(Boolean).join(' ');
              return (
                <td key={letter} className={cls || undefined}>
                  {v}
                  {/ $/.test(v) && <i className="ws" title="espacio al final">␣</i>}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );

  /* This table's scroll is not removed: the header and the number column are sticky
     precisely because every activity is answered with a coordinate, and a coordinate is
     useless once you have lost sight of its letter. What «Ampliar» adds is seeing all
     ten columns at once, which on a phone they never do. */
  return (
    <figure className={focus ? 'dtable focus' : 'dtable'}>
      <div className="frame">{table}</div>
      <Zoom label={typeof caption === 'string' ? caption : 'Tabla del salón'}>
        {table}
      </Zoom>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/* ── Two columns from 900px up ── */
export function Pair({ children, style }) {
  return <div className="pair" style={style}>{children}</div>;
}

/* ── Prose: a text block with a reading measure ── */
export function Prose({ children, style }) {
  return <div className="prose" style={style}>{children}</div>;
}

/* ── Dashed list ── */
export function List({ children }) {
  return <ul className="list">{children}</ul>;
}

/* ── What it is not: struck-through tags ── */
export function Nots({ items, style }) {
  return (
    <div className="nots" style={style}>
      {items.map(t => <span key={t}>{t}</span>)}
    </div>
  );
}

/* ── Story: one case, ruled off from the previous one ── */
export function Story({ children }) {
  return <div className="story">{children}</div>;
}

export function StoryHead({ num, place, children }) {
  return (
    <div className="story-head">
      {num && <span className="num">{num}</span>}
      {children}
      {place && <span className="place">{place}</span>}
    </div>
  );
}

/* ── Timeline ── */
export function Milestones({ items }) {
  return (
    <div className="milestones">
      {items.map(([y, t, d]) => (
        <div className="milestone" key={y + t}>
          <div className="y">{y}</div>
          <div className="t">{t}</div>
          <div className="d">{d}</div>
        </div>
      ))}
    </div>
  );
}
