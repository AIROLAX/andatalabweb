# WAVEY media replacement

Drop original masters on top of these filenames. The page HTML does not need to change.

Keep the same aspect ratio. Prefer H.264 MP4 (`yuv420p`, `+faststart`) for video and JPG + WebP for stills.

| Asset actual | Tipo | Resolución actual | Resolución original recomendada | Nombre esperado |
| ------------ | ---- | ----------------: | ------------------------------: | --------------- |
| `media/hero.mp4` | Video vertical | 576 × 1024 | 1080 × 1920 | `media/hero.mp4` |
| `media/film-walk.mp4` | Video vertical | 576 × 1024 | 1080 × 1920 | `media/film-walk.mp4` |
| `media/film-led.mp4` | Video horizontal | 1024 × 576 | 1920 × 1080 | `media/film-led.mp4` |
| `media/film-system.mp4` | Video horizontal | 1024 × 576 | 1920 × 1080 | `media/film-system.mp4` |
| `img/hero-poster.jpg` / `.webp` | Poster | 576 × 1024 | 1080 × 1920 | `img/hero-poster.jpg` + `img/hero-poster.webp` |
| `img/film-walk.jpg` / `.webp` | Poster | 576 × 1024 | 1080 × 1920 | `img/film-walk.jpg` + `img/film-walk.webp` |
| `img/film-led.jpg` / `.webp` | Poster | 1024 × 576 | 1920 × 1080 | `img/film-led.jpg` + `img/film-led.webp` |
| `img/film-system.jpg` / `.webp` | Poster | 1024 × 576 | 1920 × 1080 | `img/film-system.jpg` + `img/film-system.webp` |
| `img/runway-show.jpg` | Foto | 604 × 412 | ≥ 1600 px de ancho | `img/runway-show.jpg` + `img/runway-show.webp` |
| `img/runway-setup.jpg` / `.webp` | Foto | 880 × 864 | ≥ 1600 px de ancho | `img/runway-setup.jpg` + `img/runway-setup.webp` |
| `img/look-green.jpg` / `.webp` | Foto | 1080 × 1350 | ≥ 1600 px de ancho | `img/look-green.jpg` + `img/look-green.webp` |
| `img/audience.jpg` / `.webp` | Foto | 1200 × 1600 | ≥ 1600 px de ancho | `img/audience.jpg` + `img/audience.webp` |
| `img/td-desk.jpg` / `.webp` | Foto | 1200 × 1600 | ≥ 1600 px de ancho | `img/td-desk.jpg` + `img/td-desk.webp` |
| `img/runway-plan.jpg` / `.webp` | Plano | 594 × 520 | vectorial o ≥ 1600 px | `img/runway-plan.jpg` + `img/runway-plan.webp` |
| `img/og.jpg` | Open Graph | 1080 × 1350 | ≥ 1200 px de ancho | `img/og.jpg` |

Priority for originals: `hero.mp4`, `film-walk.mp4`, `film-led.mp4`, `runway-show.jpg`.

After replacing a video, regenerate its poster from a strong frame so JPG/WebP stay in sync:

```
ffmpeg -ss 3 -i media/hero.mp4 -frames:v 1 -q:v 2 img/hero-poster.jpg
ffmpeg -ss 3 -i media/hero.mp4 -frames:v 1 -c:v libwebp -quality 88 img/hero-poster.webp
```
