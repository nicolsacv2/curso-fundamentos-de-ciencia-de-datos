import { SYLLABUS, pad2 } from '../data/syllabus.js';
import { METAS } from '../sessions/registry.js';

/* The course index. It renders on its own and downloads no session: only the
   metadata (title, goal, blocks) of the built ones is known here. The content
   arrives when a session is opened. */
export default function Cover({ onOpen }) {
  return (
    <div className="wrap cover">
      <header className="masthead">
        <p className="eyebrow">Universidad Nacional de Colombia</p>
        <h1>Fundamentos de ciencia de datos</h1>
        <p className="subtitle">Ocho sesiones para aprender a mirar un número y saber qué preguntarle.
          Elige una sesión para entrar.</p>
        <p className="stats">
          <span><b>8</b> sesiones de <b>3</b> horas</span>
          <span><b>24</b> horas sincrónicas</span>
          <span>100 % virtual</span>
        </p>
      </header>

      <div className="index">
        {SYLLABUS.map(([n, title, goal]) => {
          const m = METAS.find(s => s.n === n);
          const t = m ? m.title : title;
          const o = m ? m.goal : goal;

          const body = (
            <div className="body">
              <span className="t">{t}</span>
              <p className="o">{o}</p>
              {m
                ? <div className="chips">
                    {m.blocks.map(b => <span key={b.id}>{b.lab} · {b.clock}</span>)}
                  </div>
                : <span className="status">En preparación</span>}
            </div>
          );

          return m ? (
            <button className="row" type="button" key={n} onClick={() => onOpen(n)}>
              <span className="n">{pad2(n)}</span>
              {body}
              <span className="go">→</span>
            </button>
          ) : (
            <div className="row pending" key={n}>
              <span className="n">{pad2(n)}</span>
              {body}
            </div>
          );
        })}
      </div>
    </div>
  );
}
