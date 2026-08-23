import { lazy, Suspense, useMemo } from 'react';
import Rail from './Rail.jsx';
import { pad2 } from '../data/syllabus.js';
import { BLOCKS } from '../sessions/registry.js';

/* An open session. The rail and masthead render immediately; the active block
   arrives in its own chunk and is the only one mounted in the DOM.
   The original kept all five panels mounted and hid four with `hidden`. */
export default function Session({ meta, active, onSelect, onIndex }) {
  const slug = meta.blocks[active].id;

  /* React.lazy per block, memoised on session+block: returning to a tab already
     visited does not refetch the chunk (the browser's module cache holds it) but
     does remount it, so its figure is redrawn clean. */
  const Block = useMemo(
    () => lazy(BLOCKS[meta.n][slug]),
    [meta.n, slug]
  );

  return (
    <>
      <div className="wrap">
        <header className="masthead">
          <p className="eyebrow">
            Fundamentos de ciencia de datos · Sesión {pad2(meta.n)} de 08
          </p>
          <h1>{meta.title}</h1>
          <p className="subtitle">{meta.goal}</p>
        </header>
      </div>

      <Rail meta={meta} active={active} onSelect={onSelect} onIndex={onIndex} />

      <div className="wrap">
        <Suspense fallback={<div className="loading">Cargando bloque…</div>}>
          <Block id={`s${meta.n}-pan-${active}`} tabId={`s${meta.n}-tab-${active}`} />
        </Suspense>

        <footer className="foot">
          <p>
            Fundamentos de ciencia de datos · Sesión {pad2(meta.n)} · Universidad
            Nacional de Colombia
          </p>
          <p>Imágenes históricas de Wikimedia Commons, en dominio público o con licencia Creative
            Commons; el crédito completo va al pie de cada una. Los diagramas y gráficos son
            propios de este curso.</p>
        </footer>
      </div>
    </>
  );
}
