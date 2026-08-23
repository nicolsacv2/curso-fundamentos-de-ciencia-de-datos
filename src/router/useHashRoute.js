import { useEffect, useState, useCallback } from 'react';

/* Hash routes, identical to the ones curso.html used:
     #indice           course index
     #s2/bloque-1      session 2, block "bloque-1"
     #s2               session 2, first block
     #bloque-3         legacy prefix-less form → session 1

   The scheme is kept because it preserves every link already handed out and needs
   no rewrite rules on the server. The slugs stay in Spanish: they are public URLs,
   not code. */

export function readHash(hash) {
  const h = (hash || '').replace('#', '');
  if (!h || h === 'indice') return { session: null, slug: '' };

  const m = h.match(/^s(\d+)(?:\/(.+))?$/);
  if (m) return { session: Number(m[1]), slug: m[2] || '' };
  return { session: 1, slug: h };
}

export function writeHash(session, slug) {
  const target = session == null ? '#indice' : `#s${session}/${slug}`;
  if (location.hash !== target) {
    history.replaceState(null, '', target);
  }
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => readHash(location.hash));

  useEffect(() => {
    const onChange = () => setRoute(readHash(location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  /* Navigating from within the app: update state and URL, then scroll to top.
     replaceState (not pushState) mirrors the original behaviour. */
  const navigate = useCallback((session, slug) => {
    setRoute({ session, slug: slug || '' });
    writeHash(session, slug || '');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return [route, navigate];
}
