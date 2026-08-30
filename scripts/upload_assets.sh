#!/bin/sh
# Upload to the bucket the copies mirror_assets.py left behind.
#
# The bucket is the safety net: the page requests its plates from Wikimedia Commons,
# which is their source, and only falls back here if that request fails. See
# src/assets/sources.js, whose BUCKET constant must point at the same place.
#
#     python3 scripts/mirror_assets.py && sh scripts/upload_assets.sh
#
# Objects go up with a year-long immutable cache. That is safe because a filename is
# <key>-<width>.<ext> and its bytes come from one fixed Commons file: if a plate is ever
# replaced by a different image it gets a different key, and therefore a different name.
# Overwriting an existing name in place would be the one thing this cache cannot survive.
set -eu

BUCKET="${BUCKET:-nicolasacevedocruz}"
PREFIX="${PREFIX:-cursos/fundamentos-de-ciencia-de-datos/assets}"
PROJECT="${PROJECT:-nicolasacevedocruz}"

HERE=$(cd "$(dirname "$0")" && pwd)
SOURCE="$(dirname "$HERE")/.assets-cache"

[ -d "$SOURCE" ] || { echo "No $SOURCE. Run first: python3 scripts/mirror_assets.py"; exit 1; }

echo "Uploading $(ls "$SOURCE" | wc -l | tr -d ' ') files to gs://$BUCKET/$PREFIX/"

gcloud storage cp "$SOURCE"/* "gs://$BUCKET/$PREFIX/" \
  --project="$PROJECT" \
  --cache-control="public, max-age=31536000, immutable"

echo
echo "Done. The page needs these readable by anyone, so check with:"
echo "  curl -sI https://storage.googleapis.com/$BUCKET/$PREFIX/fdr-500.jpg | head -1"
echo "If that is not 200, grant public read once:"
echo "  gcloud storage buckets add-iam-policy-binding gs://$BUCKET \\"
echo "    --member=allUsers --role=roles/storage.objectViewer"
