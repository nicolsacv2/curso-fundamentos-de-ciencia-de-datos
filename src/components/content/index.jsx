/* The course's visual vocabulary. Each component emits exactly the markup that
   panels.html emitted; only the class names were translated, and the stylesheet was
   translated with them, so the rendered result is unchanged. */

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
  return (
    <figure className="diagram" style={width ? { maxWidth: width } : undefined}>
      <div className="frame" dangerouslySetInnerHTML={{ __html: fig() }} />
      {children && <figcaption>{children}</figcaption>}
    </figure>
  );
}

/* ── Plate: an image mounted on paper ── */
export function Plate({ variant, src, alt, width, height, children }) {
  return (
    <figure className={variant ? `plate ${variant}` : 'plate'}>
      <div className="mount">
        <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
      </div>
      {children && <figcaption>{children}</figcaption>}
    </figure>
  );
}

/* Credit line under an image. */
export function Source({ children }) {
  return <span className="source">{children}</span>;
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

  return (
    <figure className={focus ? 'dtable focus' : 'dtable'}>
      <div className="frame">
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
      </div>
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
