import { C, SERIF, svg, txt, arrow, wrap } from '../../../svg/kit.js';

/* ═══════════ B1 · one day's data trail ═══════════ */
export function dayTrail() {
  const P = [
    ['06:40','Suena la alarma','hora exacta en que te despiertas'],
    ['07:15','Abres el mapa','tu ruta, tu velocidad, el trancón'],
    ['07:52','Pasas el torniquete','estación, hora, saldo'],
    ['08:05','Pagas un café','monto, local, medio de pago'],
    ['10:30','Suena una canción','qué escuchas, qué te saltas'],
    ['21:40','Compras en línea','qué miraste antes de comprar']
  ];
  const W=980,H=280,L=76,gap=(W-L*2)/(P.length-1);
  let b = '';
  b += `<line x1="${L-30}" y1="96" x2="${W-L+30}" y2="96" stroke="${C.line}"/>`;
  P.forEach(([h,q,d],i)=>{
    const x = L + gap*i;
    b += `<circle cx="${x}" cy="96" r="6" fill="${C.ground2}" stroke="${C.ask}" stroke-width="2"/>`;
    b += txt(x, 72, h, {fs:12.5, fill:C.ask, ta:'middle', ls:1});
    const ql = wrap(q, 15);
    ql.forEach((ln,k)=> b += txt(x, 130+k*19, ln, {fs:14, ff:SERIF, fill:C.ink, ta:'middle'}));
    const y0 = 130 + ql.length*19 + 12;
    wrap(d, 18).forEach((ln,k)=> b += txt(x, y0+k*16, ln, {fs:11.5, fill:C.ink3, ta:'middle'}));
  });
  b += txt(L-30, H-16, 'CADA PARADA DEJA UN REGISTRO. NINGUNO SE CREÓ PARA SER UN DATO.',
    {fs:11, fill:C.ink3, ls:1.6});
  return svg(W,H,'Línea de tiempo de un día con seis momentos y el dato que cada uno deja',b);
}

/* ═══════════ B1 · the ladder ═══════════ */
export function ladder() {
  const S = [
    ['DATO','38,5 °C','Un número. Solo.'],
    ['INFORMACIÓN','Tienes fiebre','El número, con contexto.'],
    ['CONOCIMIENTO','Fiebre en 40 casas','Muchos datos, un patrón.'],
    ['DECISIÓN','Cerramos el colegio','Alguien hace algo distinto.']
  ];
  const W=980,H=330,bw=200,bh=86,gapx=44,base=270,step=52;
  let b = arrow('ar-s1-ladder');
  S.forEach(([k,t,d],i)=>{
    const x = 30 + i*(bw+gapx);
    const y = base - i*step - bh;
    const acc = i===3 ? C.reveal : C.ask;
    b += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="${C.ground2}"
      stroke="${i===3?C.reveal:C.line}" stroke-width="${i===3?1.5:1}"/>`;
    b += `<rect x="${x}" y="${y}" width="3" height="${bh}" fill="${acc}"/>`;
    b += txt(x+16,y+24,k,{fs:11,fill:acc,ls:1.6});
    b += txt(x+16,y+50,t,{fs:t.length>16?15:19,ff:SERIF,fill:C.ink});
    b += txt(x+16,y+72,d,{fs:11.5,fill:C.ink3});
    if(i<3){
      b += `<line x1="${x+bw+8}" y1="${y+bh/2}" x2="${x+bw+gapx-8}" y2="${y+bh/2-step}"
        stroke="${C.ink2}" stroke-width="1.2" marker-end="url(#ar-s1-ladder)"/>`;
    }
  });
  b += `<line x1="30" y1="${base+16}" x2="${W-30}" y2="${base+16}" stroke="${C.line}"/>`;
  b += txt(30,H-16,'CADA PELDAÑO AÑADE ALGO QUE EL ANTERIOR NO TENÍA: CONTEXTO, PATRÓN, ACCIÓN.',{fs:11,fill:C.ink3,ls:1.6});
  return svg(W,H,'Escalera de cuatro peldaños: dato, información, conocimiento y decisión, con el ejemplo de una fiebre',b);
}

/* ═══════════ B1 · the intersection ═══════════ */
export function intersection() {
  const W=560,H=500,r=140;
  const c = [[280,170],[200,300],[360,300]];
  const lab = [['NEGOCIO',280,84,'middle'],['ESTADÍSTICA',96,388,'start'],['TECNOLOGÍA',464,388,'end']];
  let b = '';
  c.forEach(([cx,cy])=>{
    b += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.ask}" fill-opacity=".07"
      stroke="${C.ask}" stroke-opacity=".55" stroke-width="1.2"/>`;
  });
  lab.forEach(([t,x,y,ta])=> b += txt(x,y,t,{fs:12.5,fill:C.ask,ta:ta,ls:1.8}));
  b += `<circle cx="280" cy="256" r="4" fill="${C.reveal}"/>`;
  b += txt(280,238,'CIENCIA',{fs:12,fill:C.reveal,ta:'middle',ls:1.6});
  b += txt(280,290,'DE DATOS',{fs:12,fill:C.reveal,ta:'middle',ls:1.6});
  b += txt(280,H-18,'La intersección, no la suma.',{fs:14,ff:SERIF,fill:C.ink3,ta:'middle'});
  return svg(W,H,'Tres círculos que se cruzan: negocio, estadística y tecnología; en el centro, la ciencia de datos',b);
}
