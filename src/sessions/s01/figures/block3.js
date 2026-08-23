import { C, svg, txt } from '../../../svg/kit.js';

/* ═══════════ B3 · schematic recreation of Snow's map ═══════════ */
export function snowMap() {
  const W=980,H=520;
  let b='';
  // street grid
  const vs=[120,300,470,640,810], hs=[110,210,310,410];
  vs.forEach(x=> b += `<line x1="${x}" y1="60" x2="${x}" y2="450" stroke="${C.lineSoft}" stroke-width="10"/>`);
  hs.forEach(y=> b += `<line x1="70" y1="${y}" x2="900" y2="${y}" stroke="${C.lineSoft}" stroke-width="10"/>`);
  b += `<line x1="70" y1="310" x2="900" y2="310" stroke="${C.line}" stroke-width="12"/>`;
  b += txt(80,304,'BROAD STREET',{fs:11.5,fill:C.ink3,ls:1.6});

  // death clusters: [x, y, n, direction]
  const G = [
    [430,300,7,-1],[452,320,6,1],[408,320,5,1],[478,300,6,-1],[500,320,4,1],
    [386,300,5,-1],[470,258,4,-1],[420,258,3,-1],[500,258,3,-1],
    [452,362,4,1],[406,362,3,1],[498,362,3,1],
    [352,300,3,-1],[534,300,3,-1],[340,210,2,-1],[560,210,2,-1],
    [330,362,2,1],[566,362,2,1],[300,258,2,-1],[600,258,2,-1],
    [250,300,1,-1],[660,300,1,-1],[220,210,1,-1],[700,410,1,1],
    [180,362,1,1],[740,258,1,-1],[150,258,1,-1],[790,320,1,1]
  ];
  G.forEach(([x,y,n,dir])=>{
    for(let i=0;i<n;i++){
      const by = dir<0 ? y - 10 - i*7 : y + 4 + i*7;
      b += `<rect x="${x}" y="${by}" width="13" height="5" fill="${C.ink}" opacity=".9"/>`;
    }
  });

  // water pumps
  const pumps = [[452,310,1],[200,110,0],[760,410,0],[300,410,0],[660,110,0]];
  pumps.forEach(([x,y,focus])=>{
    const col = focus ? C.reveal : C.ask;
    b += `<circle cx="${x}" cy="${y}" r="${focus?11:7}" fill="${C.ground2}" stroke="${col}" stroke-width="${focus?2.4:1.4}"/>`;
    b += `<circle cx="${x}" cy="${y}" r="${focus?4:2.5}" fill="${col}"/>`;
    if(focus){
      b += `<circle cx="${x}" cy="${y}" r="86" fill="none" stroke="${C.reveal}" stroke-width="1" stroke-dasharray="4 5" opacity=".55"/>`;
      // label on top, with a leader line, so it clears both the bars and the street
      b += `<line x1="${x}" y1="${y-88}" x2="${x}" y2="${y-152}" stroke="${C.reveal}" stroke-width="1" opacity=".6"/>`;
      b += `<rect x="${x-104}" y="${y-176}" width="208" height="22" fill="${C.ground2}"/>`;
      b += txt(x, y-160, 'LA BOMBA DE BROAD STREET', {fs:12,fill:C.reveal,ta:'middle',ls:1.6});
    }
  });

  // legend
  b += `<rect x="70" y="464" width="13" height="5" fill="${C.ink}"/>`;
  b += txt(94,473,'una muerte',{fs:12,fill:C.ink2});
  b += `<circle cx="230" cy="468" r="7" fill="${C.ground2}" stroke="${C.ask}" stroke-width="1.4"/>`;
  b += `<circle cx="230" cy="468" r="2.5" fill="${C.ask}"/>`;
  b += txt(246,473,'otras bombas de agua del barrio',{fs:12,fill:C.ink2});
  b += txt(900,473,'RECREACIÓN ESQUEMÁTICA',{fs:11,fill:C.ink3,ta:'end',ls:1.4});
  return svg(W,H,'Recreación esquemática del mapa de Snow: las barras que representan muertes se concentran alrededor de una sola bomba de agua, mientras las otras bombas del barrio quedan despejadas',b);
}

/* ═══════════ B3 · Google Flu Trends ═══════════ */
export function fluTrends() {
  const W=980,H=400,L=64,R=180,T=40,B=64;
  const real = [0.9,1.4,2.6,4.3,3.4,2.0,1.2,0.8,1.1,1.9,3.6,6.1,4.4,2.4,1.3,0.9];
  const gft  = [1.0,1.7,3.2,5.4,4.2,2.3,1.3,0.8,1.4,3.0,6.4,11.0,7.6,3.4,1.5,1.0];
  const n = real.length, maxY = 12;
  const px = i => L + i*(W-R-L)/(n-1);
  const py = v => (H-B) - (v/maxY)*((H-B)-T);
  const line = a => a.map((v,i)=>`${i?'L':'M'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ');
  let b='';
  [0,3,6,9,12].forEach(v=>{
    b += `<line x1="${L}" y1="${py(v)}" x2="${W-R}" y2="${py(v)}" stroke="${C.lineSoft}"/>`;
    b += txt(L-10, py(v)+4, v+' %', {fs:11,fill:C.ink3,ta:'end'});
  });
  // the gap
  const gap = `M${px(11)},${py(real[11])} L${px(11)},${py(gft[11])}`;
  b += `<path d="${gap}" stroke="${C.reveal}" stroke-width="1.5" stroke-dasharray="3 3"/>`;
  b += `<path d="${line(gft)}" fill="none" stroke="${C.reveal}" stroke-width="2.4" stroke-linejoin="round"/>`;
  b += `<path d="${line(real)}" fill="none" stroke="${C.ink}" stroke-width="2.4" stroke-linejoin="round"/>`;
  b += `<circle cx="${px(11)}" cy="${py(gft[11])}" r="4" fill="${C.reveal}"/>`;
  b += `<circle cx="${px(11)}" cy="${py(real[11])}" r="4" fill="${C.ink}"/>`;
  b += txt(px(11)+14, py(gft[11])+4, 'Google Flu Trends predijo', {fs:13,fill:C.reveal});
  b += txt(px(11)+14, py(gft[11])+22, 'casi el doble', {fs:13,fill:C.reveal,fw:600});
  b += txt(px(11)+14, py(real[11])+4, 'consultas reales (CDC)', {fs:13,fill:C.ink2});
  b += `<line x1="${L}" y1="${H-B}" x2="${W-R}" y2="${H-B}" stroke="${C.line}" stroke-width="1.5"/>`;
  b += `<line x1="${L}" y1="${T}" x2="${L}" y2="${H-B}" stroke="${C.line}" stroke-width="1.5"/>`;
  [[0,'2010'],[4,'2011'],[8,'2012'],[12,'2013']].forEach(([i,l])=>
    b += txt(px(i), H-B+22, l, {fs:11.5,fill:C.ink3,ta:'middle'}));
  b += txt(L, T-14, '% DE CONSULTAS MÉDICAS POR SÍNTOMAS DE GRIPE', {fs:11,fill:C.ink3,ls:1.4});
  return svg(W,H,'Dos curvas de temporadas de gripe: la predicción de Google Flu Trends se separa cada vez más de las consultas reales, hasta casi duplicarlas en 2013',b);
}
