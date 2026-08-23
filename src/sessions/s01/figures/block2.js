import { C, SERIF, svg, txt, arrow } from '../../../svg/kit.js';

/* ═══════════ B2 · the project lifecycle ═══════════ */
export function lifecycle() {
  const W=830,H=570,cx=415,cy=278,R=196;
  const E = ['Pregunta','Obtención','Limpieza','Exploración','Modelado','Comunicación','Decisión'];
  let b = arrow('ar-s1-cycle') + arrow('ar-s1-loop', C.reveal);
  const pts = E.map((_,i)=>{
    const a = -Math.PI/2 + i*(2*Math.PI/E.length);
    return [cx + R*Math.cos(a), cy + R*Math.sin(a), a];
  });
  // arcs between stages
  pts.forEach((p,i)=>{
    const q = pts[(i+1)%pts.length];
    const a1 = p[2] + .30, a2 = q[2] - .30;
    const x1 = cx + R*Math.cos(a1), y1 = cy + R*Math.sin(a1);
    const x2 = cx + R*Math.cos(a2), y2 = cy + R*Math.sin(a2);
    const closes = (i === pts.length-1);
    b += `<path d="M${x1.toFixed(1)},${y1.toFixed(1)} A${R},${R} 0 0 1 ${x2.toFixed(1)},${y2.toFixed(1)}"
      fill="none" stroke="${closes?C.reveal:C.ink2}" stroke-width="1.4"
      stroke-dasharray="${closes?'5 4':'none'}"
      marker-end="url(#${closes?'ar-s1-loop':'ar-s1-cycle'})" opacity="${closes?.95:.85}"/>`;
  });
  pts.forEach(([x,y,a],i)=>{
    const acc = i===0 ? C.ask : (i===6 ? C.reveal : C.ink2);
    b += `<circle cx="${x}" cy="${y}" r="34" fill="${C.ground2}" stroke="${acc}"
      stroke-width="${i===0||i===6?1.8:1}"/>`;
    b += txt(x, y+4, String(i+1).padStart(2,'0'), {fs:12, fill:acc, ta:'middle', ls:1});
    /* The label is anchored outward: on the right it starts where the circle ends, on
       the left it ends before it. That way none overlaps its node or leaves the canvas. */
    const cos = Math.cos(a);
    const ta = cos > .25 ? 'start' : (cos < -.25 ? 'end' : 'middle');
    const lx = cx + (R+62)*cos, ly = cy + (R+62)*Math.sin(a);
    b += txt(lx, ly+5, E[i], {fs:16, ff:SERIF, fill:C.ink, ta:ta});
  });
  b += txt(cx,cy-8,'Y VUELTA',{fs:12,fill:C.ink3,ta:'middle',ls:1.8});
  b += txt(cx,cy+14,'A EMPEZAR',{fs:12,fill:C.ink3,ta:'middle',ls:1.8});
  return svg(W,H,'Las siete etapas de un proyecto de datos dispuestas en círculo, con una flecha punteada que vuelve de la decisión a la pregunta',b);
}

/* ═══════════ B2 · where the time goes ═══════════ */
export function timeSplit() {
  const T = [
    ['Entender la pregunta',10,C.ask],
    ['Obtener los datos',25,C.ink2],
    ['Limpiar y preparar',45,C.reveal],
    ['Explorar',10,C.ink2],
    ['Modelar',5,C.ink3],
    ['Comunicar',5,C.ink3]
  ];
  const W=980,H=232,L=30,BW=W-60,y=74,h=54;
  let b='', x=L;
  T.forEach(([n,p,col],i)=>{
    const w = BW*p/100;
    b += `<rect x="${x}" y="${y}" width="${w-2}" height="${h}" fill="${col}" fill-opacity="${col===C.reveal?.85:.28}" stroke="${col}" stroke-width="1"/>`;
    if(p>=10) b += txt(x+w/2-1, y+h/2+5, p+' %', {fs:14,fill:col===C.reveal?'#fff':C.ink,ta:'middle',fw:600});
    const ty = i%2===0 ? y-16 : y+h+24;
    b += txt(x+w/2-1, ty, n, {fs:12.5,ff:SERIF,fill:C.ink2,ta:'middle'});
    if(p<10) b += txt(x+w/2-1, i%2===0 ? y-32 : y+h+40, p+' %', {fs:11.5,fill:C.ink3,ta:'middle'});
    x += w;
  });
  b += `<line x1="${L}" y1="${y+h+58}" x2="${L+BW*0.8}" y2="${y+h+58}" stroke="${C.reveal}" stroke-width="1.5"/>`;
  b += txt(L, y+h+80, 'OBTENER + LIMPIAR + ENTENDER ≈ 80 % DEL TIEMPO, Y NO SALE EN LAS NOTICIAS', {fs:11.5,fill:C.reveal,ls:1.4});
  return svg(W,H,'Barra apilada del reparto del tiempo en un proyecto de datos: limpiar y preparar ocupa la mayor parte',b);
}
