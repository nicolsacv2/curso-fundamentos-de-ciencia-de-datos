/* Where each plate comes from.

   The images are no longer versioned: they are requested from Wikimedia Commons, which
   is their source, and a GCS bucket keeps a copy in case Commons fails. Commons itself
   discourages hotlinking, because anyone can rename, vandalise or delete a file; in a
   projected classroom that failure is intolerable, so <Plate> asks the origin first and
   falls back to the bucket if the load breaks.

   Special:FilePath is the stable endpoint: it follows renames and, given ?width=,
   resizes on the server. That is where the srcset comes from, without processing a
   single image here. */

import MANIFEST from './manifest.json';

const COMMONS = 'https://commons.wikimedia.org/wiki/Special:FilePath';

/* One place to change if the bucket moves. Objects are uploaded with a long immutable
   cache, so a plate that ever changes has to arrive under a new filename rather than
   overwrite an old one — the manifest key and the width already give it one. */
export const BUCKET =
  import.meta.env.VITE_ASSET_BUCKET ||
  'https://storage.googleapis.com/nicolasacevedocruz/cursos/fundamentos-de-ciencia-de-datos/assets';

/* Special:FilePath does not serve arbitrary widths: it snaps every request up to one of
   a fixed set of thumbnails — 250, 330, 500, 960, 1280, 1920 — and returns the original
   above that. Asking for 620, 840 and 920 gets you the same 960px file three times, so a
   srcset built on the CSS widths would be declaring sizes that are simply false.

   These are therefore the real widths, picked as the first bucket at or above what each
   .plate variant needs (its max-width in panel.css) at 1x and at 2x. */
const LADDER = {
  portrait: [500, 960],    // 420 CSS px
  medium: [960, 1280],     // 620 CSS px — nothing exists between 500 and 960
  default: [960, 1920]     // 920 CSS px
};

/* `sizes` tells the browser how wide the image will be BEFORE it has the CSS, so it
   mirrors the layout's breakpoints: .pair goes to two columns at 900px, and .plate hits
   its max-width well before the column runs out of room. */
const SIZES = {
  portrait: '(min-width: 900px) 420px, 100vw',
  medium: '(min-width: 720px) 620px, 100vw',
  default: '(min-width: 1000px) 920px, 100vw'
};

/* Asking for 1840px of a 326px original buys no detail: it returns the same file under
   another name. The ladder is clamped to the real width and de-duplicated. */
function widthsFor(asset, variant) {
  const ladder = LADDER[variant] || LADDER.default;
  const capped = ladder.map(w => Math.min(w, asset.w));
  return [...new Set(capped)].sort((a, b) => a - b);
}

function commonsUrl(asset, width) {
  const file = `${COMMONS}/${encodeURIComponent(asset.commons)}`;
  /* An SVG with ?width= comes back rasterised to PNG. Without the parameter the vector
     arrives, which scales to any size and weighs less than its own large PNGs. */
  return width ? `${file}?width=${width}` : file;
}

function bucketUrl(key, asset, width) {
  return width
    ? `${BUCKET}/${key}-${width}.${asset.ext}`
    : `${BUCKET}/${key}.${asset.ext}`;
}

/* The Commons description page for a plate: author, licence, provenance and the full
   history of the file. It is where the credit line under each image should point, and
   what a CC licence asks you to link back to. */
export function commonsPage(key) {
  const asset = MANIFEST[key];
  if (!asset) throw new Error(`Unknown plate: ${key}`);
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(asset.commons)}`;
}

/* Returns what an <img> needs: { src, srcSet, sizes }.
   `origin` is either 'commons' or 'bucket'. */
export function sourcesFor(key, variant, origin) {
  const asset = MANIFEST[key];
  if (!asset) throw new Error(`Unknown plate: ${key}`);

  const url = origin === 'bucket'
    ? w => bucketUrl(key, asset, w)
    : w => commonsUrl(asset, w);

  /* A vector needs no srcset: one file serves every width. */
  if (asset.vector) return { src: url(null), srcSet: undefined, sizes: undefined };

  const widths = widthsFor(asset, variant);
  return {
    /* The src is the smallest width: it is what a browser without srcset support uses,
       and the lightest thing to download if it ignores sizes too. */
    src: url(widths[0]),
    srcSet: widths.map(w => `${url(w)} ${w}w`).join(', '),
    sizes: SIZES[variant] || SIZES.default
  };
}

/* The mirror script needs the same ladder the browser will ask for, so the bucket holds
   neither one file too many nor one too few. */
export { MANIFEST, widthsFor };
