# Product films

Web versions of Amine's product films, played by `src/components/AdVideo.tsx` (source choice and warm-up in `src/lib/films.ts`). The masters live outside the repo; never commit a master or a frame folder.

| Slug | Master | Length |
| --- | --- | --- |
| `derogation` | `Downloads\derogation-ad-16x9.mp4` (Amine's own cut, 1080p60) | 58 s |

## Files per film

- `<slug>.av1.mp4`: 1280×720, AV1 (libaom, `-crf <n> -b:v 0 -cpu-used 4 -row-mt 1 -tiles 2x1`), AAC 128 kbps, faststart. `codecs="av01.0.08M.08"`.
- `<slug>.h264.mp4`: 1280×720, H.264 High (`-preset slow -crf <n> -maxrate 6M -bufsize 12M`), AAC 128 kbps, faststart. `codecs="avc1.640020"`.
- `<slug>.webp`: poster, 1280×720.

Why 720p: a 16:9 film on a phone is about 340–400 CSS px wide, about 1,000–1,200 device px at 3× DPR.

## How the CRF was chosen

`portfolio-videos\web\ladder.py` (outside the repo) searches CRF on a 16 s sample cut from across the film. It then encodes the full film and re-checks it:

- **Quality gate:** VMAF against the master scaled to 720p must average ≥ 93.
- **Size budget per 60 s:** AV1 ≤ 8 MB, H.264 ≤ 14 MB.
- **Frame rate:** 60 fps is kept when it fits the budget; otherwise 30 fps.

`codecs.py` reads the codec strings from the files' `av1C` / `avcC` boxes.

| Film | Codec | CRF | fps | Size | VMAF mean (min) |
| --- | --- | --- | --- | --- | --- |
| derogation | AV1 | 43 | 60 | 4.7 MB | 95.3 (84.6) |
| derogation | H.264 | 23 | 60 | 11.5 MB | 93.8 (85.8) |
