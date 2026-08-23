import { useEffect } from 'react';
import Cover from './components/Cover.jsx';
import Session from './components/Session.jsx';
import { useHashRoute, writeHash } from './router/useHashRoute.js';
import { findMeta } from './sessions/registry.js';

export default function App() {
  const [route, navigate] = useHashRoute();

  const meta = route.session == null ? null : findMeta(route.session);
  /* A hash pointing at a session that does not exist, or at an unknown block, falls
     back to the index or to the first block — same as the original. */
  const active = meta
    ? Math.max(0, meta.blocks.findIndex(b => b.id === route.slug))
    : 0;

  /* Normalise the URL when the hash came in incomplete (#s2) or invalid: once
     resolved, write the real destination back. */
  useEffect(() => {
    if (meta) writeHash(meta.n, meta.blocks[active].id);
    else if (route.session != null) writeHash(null);
  }, [meta, active, route.session]);

  if (!meta) {
    return <Cover onOpen={n => navigate(n, findMeta(n).blocks[0].id)} />;
  }

  return (
    <Session
      meta={meta}
      active={active}
      onSelect={j => navigate(meta.n, meta.blocks[j].id)}
      onIndex={() => navigate(null)}
    />
  );
}
