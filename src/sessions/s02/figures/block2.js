import { C, SERIF, svg, txt, arrow } from '../../../svg/kit.js';
import { box } from './shared.js';

/* ═══════════ B2 · population and sample ═══════════ */
export function population() {
  const W=980, H=460, cols=10, n=cols*8;
  /* Fixed, reproducible split: 3 out of every 10 "own a phone and a car". */
  const has = i => (i*7) % 10 < 3;
  /* Twelve at random, spread across the grid: four land in the well-off group,
     i.e. 33 % — one step away from the population's 30 %. */
  const random = [1,6,14,23,27,32,40,49,55,61,66,78];
  const biased = [];
  for(let i=0;i<n && biased.length<12;i++) if(has(i)) biased.push(i);

  const P = [
    [20,'LA POBLACIÓN','todos los votantes de 1936',null,C.line],
    [340,'UNA MUESTRA AL AZAR','cae de todos los grupos',random,C.ask],
    [660,'LA MUESTRA DEL DIGEST','solo los de la lista',biased,C.reveal]
  ];

  let b = '';
  P.forEach(([x,k,d,sel,col])=>{
    b += txt(x,40,k,{fs:12,fill:col===C.line?C.ink3:col,ls:1.6});
    b += txt(x,58,d,{fs:11.5,fill:C.ink3});
    b += box(x,74,300,262,null,{stroke:col,sw:col===C.reveal?1.6:1});

    const marked = sel ? new Set(sel) : null;
    for(let i=0;i<n;i++){
      const cxp = x+30+(i%cols)*27, cyp = 106+Math.floor(i/cols)*30;
      const rich = has(i);
      const inside = marked ? marked.has(i) : true;
      const base = rich ? C.ask : C.ink3;
      b += `<circle cx="${cxp}" cy="${cyp}" r="${inside?6:4}" fill="${base}"
        opacity="${inside?.95:.16}"/>`;
      if(inside && marked)
        b += `<circle cx="${cxp}" cy="${cyp}" r="10" fill="none" stroke="${col}" stroke-width="1.3"/>`;
    }
    const pct = sel
      ? Math.round(sel.filter(has).length / sel.length * 100)
      : 30;
    b += txt(x+150,362,pct+' %',{fs:26,ff:SERIF,fill:col===C.line?C.ink:col,ta:'middle'});
    b += txt(x+150,384,'tiene teléfono y automóvil',{fs:11.5,fill:C.ink3,ta:'middle'});
  });

  b += `<circle cx="26" cy="${H-46}" r="6" fill="${C.ask}"/>`;
  b += txt(42,H-42,'tiene teléfono y automóvil en 1936',{fs:12,fill:C.ink2});
  b += `<circle cx="356" cy="${H-46}" r="6" fill="${C.ink3}"/>`;
  b += txt(372,H-42,'no lo tiene: es la mayoría del país',{fs:12,fill:C.ink2});
  b += txt(20,H-14,'EL DIGEST NO SE EQUIVOCÓ POR PREGUNTAR POCO. SE EQUIVOCÓ POR PREGUNTARLE SIEMPRE A LOS MISMOS.',
    {fs:11,fill:C.reveal,ls:1.5});
  return svg(W,H,'Tres nubes de puntos: la población con un 30 % de personas acomodadas, una muestra al azar que conserva esa proporción, y la muestra del Literary Digest formada solo por ese 30 %',b);
}

/* ═══════════ B2 · the 1936 upset ═══════════ */
export function digest() {
  const W=980, H=400, L=300, BW=600;
  const px = p => BW*p/100;
  const B = [
    [110,'LO QUE PREDIJO','EL LITERARY DIGEST',
      [['Landon',57.1,C.ink2],['Roosevelt',42.9,C.ink3]], false],
    [242,'LO QUE PASÓ','EN LAS URNAS',
      [['Landon',36.5,C.ink3],['Roosevelt',60.8,C.reveal],['otros',2.7,C.line]], true]
  ];
  let b = txt(20,44,'ELECCIÓN PRESIDENCIAL DE ESTADOS UNIDOS · 1936',{fs:11.5,fill:C.ink3,ls:1.8});
  b += txt(20,70,'10 millones de cuestionarios enviados · 2,3 millones de respuestas',
    {fs:14,ff:SERIF,fill:C.ink2});

  B.forEach(([y,t1,t2,segs,real])=>{
    b += txt(20,y+26,t1,{fs:13,fill:real?C.reveal:C.ink3,ls:1.4});
    b += txt(20,y+44,t2,{fs:12,fill:C.ink3,ls:1.4});
    let x = L;
    segs.forEach(([name,p,col])=>{
      const w = px(p);
      b += `<rect x="${x}" y="${y}" width="${w-2}" height="62" fill="${col}"
        fill-opacity="${col===C.reveal?.9:.3}" stroke="${col}"/>`;
      if(p>8){
        b += txt(x+14,y+30,name,{fs:13,ff:SERIF,fill:col===C.reveal?'#fff':C.ink});
        b += txt(x+14,y+50,p.toFixed(1).replace('.',',')+' %',
          {fs:14,fill:col===C.reveal?'#fff':C.ink2,fw:600});
      }
      x += w;
    });
  });

  // the upset: where Landon stood and where he ended up
  const xa = L+px(57.1), xb = L+px(36.5);
  b += `<line x1="${xa}" y1="172" x2="${xa}" y2="${242}" stroke="${C.reveal}"
    stroke-width="1" stroke-dasharray="3 3" opacity=".7"/>`;
  b += arrow('ar-s2-digest', C.reveal);
  b += `<line x1="${xa-6}" y1="212" x2="${xb+6}" y2="212" stroke="${C.reveal}"
    stroke-width="1.4" marker-end="url(#ar-s2-digest)"/>`;
  b += txt(xa+12,216,'21 puntos de error',{fs:13,fill:C.reveal,fw:600});

  b += txt(20,H-40,'ROOSEVELT GANÓ 46 DE LOS 48 ESTADOS.',{fs:14,ff:SERIF,fill:C.ink});
  b += txt(20,H-14,'LA MAYOR DERROTA ELECTORAL DEL SIGLO, ANUNCIADA AL REVÉS.',
    {fs:11,fill:C.ink3,ls:1.5});
  return svg(W,H,'Dos barras al cien por ciento comparan la predicción del Literary Digest, que daba a Landon el 57 por ciento, con el resultado real, en el que Roosevelt obtuvo el 61 por ciento',b);
}

/* ═══════════ B2 · the number and its metadata ═══════════ */
export function metadata() {
  const W=980, H=360;
  let b = arrow('ar-s2-meta');

  b += box(20,50,380,240,null,{stroke:C.line});
  b += txt(210,170,'42',{fs:96,ff:SERIF,fill:C.ink,ta:'middle'});
  b += txt(210,222,'¿42 QUÉ? ¿MEDIDO POR QUIÉN? ¿CUÁNDO?',{fs:11.5,fill:C.reveal,ta:'middle',ls:1.2});
  b += txt(210,252,'Así, no sirve para nada.',{fs:15,ff:SERIF,fill:C.ink2,ta:'middle'});

  b += `<line x1="410" y1="170" x2="562" y2="170" stroke="${C.ask}" stroke-width="1.4"
    marker-end="url(#ar-s2-meta)"/>`;
  b += txt(486,158,'+ METADATOS',{fs:11.5,fill:C.ask,ta:'middle',ls:1.6});

  b += box(580,50,380,240,C.ask);
  b += txt(604,102,'42',{fs:44,ff:SERIF,fill:C.ink});
  b += txt(664,102,'minutos',{fs:17,ff:SERIF,fill:C.ask});
  b += `<line x1="604" y1="118" x2="936" y2="118" stroke="${C.lineSoft}"/>`;
  const M = [
    ['QUÉ MIDE','el trayecto de casa a la universidad'],
    ['QUIÉN','el GPS del celular, con ±30 s de error'],
    ['CUÁNDO','martes 18 de agosto, salida 7:15'],
    ['DE QUIÉN','una sola persona, no un promedio']
  ];
  M.forEach(([k,v],i)=>{
    const y = 148+i*36;
    b += txt(604,y,k,{fs:10.5,fill:C.ink3,ls:1.4});
    b += txt(604,y+18,v,{fs:13,fill:C.ink2});
  });

  b += txt(20,H-14,'EL NÚMERO NO CAMBIÓ. LO QUE CAMBIÓ ES QUE AHORA SE PUEDE USAR SIN MENTIR.',
    {fs:11,fill:C.ask,ls:1.6});
  return svg(W,H,'A la izquierda el número 42 solo, sin significado; a la derecha el mismo 42 acompañado de su unidad, quién lo midió, cuándo y de quién',b);
}
