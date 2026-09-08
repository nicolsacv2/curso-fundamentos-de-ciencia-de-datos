import { useCallback, useRef, useState } from 'react';
import { Diagram } from '../../../components/content/index.jsx';
import cloud3d, { INITIAL } from '../figures/cloud3d.js';

/* The one component in this session that holds state: the angle the cloud is seen
   from. Everything it draws comes from cloud3d(), a pure function that takes that
   angle — principle 3 stays intact, the .jsx composes and the figure draws.

   It wraps <Diagram> instead of replacing it. Passing a fig whose identity changes
   with the angle invalidates the useMemo inside Diagram, so the markup is rebuilt on
   every turn, and «Ampliar», Esc and the focus returned to the button keep working
   without touching the file the other four sessions depend on.

   The angle lives in useState and dies with the block: changing tab unmounts the
   panel, so the cloud is back at its resting angle on return (RF-78) and nothing is
   stored anywhere (principle 5). */

const SPEED = 0.008;
/* Stops short of the poles. Past ninety degrees the scene turns upside down and the
   axis labels read mirrored, which looks like a bug and is never what anyone wanted. */
const LIMIT = 1.25;

export default function Cloud3D({ plane, vectors, projections, children }) {
  const [angle, setAngle] = useState(INITIAL);
  const from = useRef(null);

  const fig = useCallback(
    () => cloud3d({ ...angle, plane, vectors, projections }),
    [angle, plane, vectors, projections]
  );

  const down = e => {
    from.current = { x: e.clientX, y: e.clientY, ...angle };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const move = e => {
    const start = from.current;
    if (!start) return;
    setAngle({
      yaw: start.yaw + (e.clientX - start.x) * SPEED,
      pitch: Math.max(-LIMIT, Math.min(LIMIT, start.pitch - (e.clientY - start.y) * SPEED)),
    });
  };

  const up = e => {
    from.current = null;
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      className="rotor"
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    >
      <Diagram fig={fig}>{children}</Diagram>
    </div>
  );
}
