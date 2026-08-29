# ANDATA LAB — SEO implementation report

Static HTML site (`index.html` + folder pages, `data.js` / `app.js`, no framework). Language is client-side EN/ES on the same URL (`localStorage.andata_lang`). No previous `robots.txt` or `sitemap.xml`. `/projection-mapping/` did not exist; `/videomapping/` was an orphan with a wrong-domain canonical and a keyword list.

**Not deployed.** Local checks used `npm run dev` (`serve .`) at `http://localhost:3000`.

---

## Pages modified

| Page | Role |
|------|------|
| `/` | Homepage |
| `/projection-mapping/` | **New** commercial service hub |
| `/ajijic-mapping/` | Primary projection-mapping case study (canonical URL unchanged) |
| `/museo-descubre/` | Interactive museum exhibits |
| `/biointerface/` | Interactive art / sensor systems |
| `/dome-studio/` | Fulldome / 360° |
| `/hospitality/` | Permanent hotel experiences |
| `/salamastache/` | 360° interpretation proposal (iframe shell) |
| `/videomapping/` | Consolidated to `/projection-mapping/` (`noindex` + canonical + refresh) |
| `/shader-wallpapers/` | Unique title/canonical only (demo, not a commercial cluster) |
| `/index-immersive.html` | `noindex` (archived homepage duplicate) |
| `robots.txt`, `sitemap.xml`, `404.html` | New |

---

## Primary keyword per page

| URL | Primary intent | SEO title | Meta description |
|-----|----------------|-----------|------------------|
| `/` | Immersive experiences / experiential technology studio | ANDATA LAB \| Immersive Experiences & Projection Mapping | ANDATA LAB is an experiential technology studio in Mexico. Immersive experiences, projection mapping, interactive installations and real-time audiovisual systems — worldwide. |
| `/projection-mapping/` | Projection mapping studio / services | Projection Mapping Studio \| ANDATA LAB | ANDATA LAB designs and produces projection mapping for architecture, brands and culture — from facade study and 3D content to TouchDesigner playback and on-site calibration. |
| `/ajijic-mapping/` | Architectural projection mapping Mexico / Chapala case study | Projection Mapping in Mexico \| Whispers of the Lake | Architectural projection mapping for a 33 × 8 m historic facade in Chapala, Mexico—3D content, TouchDesigner playback, spatial audio and on-site calibration. |
| `/museo-descubre/` | Interactive museum exhibits | Interactive Museum Exhibits \| Museo Descubre · ANDATA LAB | Interactive museum exhibit design by ANDATA LAB for Museo Descubre in Aguascalientes — sensor-driven walls, themed zones and the OHM installation. |
| `/biointerface/` | Interactive art installation / TouchDesigner | Interactive Art Installation \| Biointerface · ANDATA LAB | Biointerface — a TouchDesigner interactive art installation by ANDATA LAB: capacitive plant sensors, Kinect and real-time generative visuals on a multi-screen canvas. |
| `/dome-studio/` | Fulldome content / 360° content | Dome Studio \| Contenido fulldome y 360° \| ANDATA LAB | ANDATA LAB produce contenido fulldome, contenido 360°, experiencias interactivas de cúpula, visuales generativos y audio espacial para domos y espacios inmersivos. |
| `/hospitality/` | Permanent immersive hotel experiences | ANDATA Hospitality \| Permanent Immersive Hotel Experiences | Permanent immersive hotel experiences by ANDATA LAB — interactive guest amenities and responsive environments for resorts, shaped by place, time and presence. |
| `/salamastache/` | 360° immersive interpretation (Tula) | Tollan Inmersivo \| 360° Immersive Interpretation Room · ANDATA LAB | Tollan Inmersivo — El Viaje del Héroe Tolteca. A 360° immersive interpretation proposal by ANDATA LAB for Sala Guadalupe Mastache, Tula, Hidalgo. |

H1s: one per page. Homepage H1 kept as **“Immersive Experiences, Engineered.”** Ajijic H1 is **“Whispers of the Lake — Architectural Projection Mapping.”** Canonical for Ajijic remains `https://www.andatalab.com/ajijic-mapping/`.

---

## New internal links (descriptive anchors)

- Homepage → **Architectural Projection Mapping** (`/projection-mapping/`)
- Homepage → **Interactive Museum Exhibits** (`/museo-descubre/`)
- Homepage → **Permanent Immersive Hospitality Experiences** (`/hospitality/`)
- Homepage work card **Whispers of the Lake** → `/ajijic-mapping/`
- `/projection-mapping/` → Ajijic case study, Biointerface, Museo Descubre, Dome Studio, Hospitality
- `/ajijic-mapping/` → Projection mapping services, fulldome/360°, hospitality; FAQ links to Biointerface and Museo Descubre
- `/museo-descubre/` → Biointerface, projection mapping, hospitality
- `/biointerface/` → Museo Descubre, projection mapping, hospitality
- `/dome-studio/` → Projection mapping services, hospitality, existing Ajijic/Museo proof cards
- `/hospitality/` proof **Whispers of the Lake** now points to `/ajijic-mapping/` (was an external AIROLAX URL); related line to projection mapping, museum exhibits, fulldome

No “click here.” CTA on Ajijic / service hub: **Discuss a Projection Mapping Project** → `/#contact`.

---

## Structured data added

Sitewide `@id`: `https://www.andatalab.com/#organization`

| Page | JSON-LD |
|------|---------|
| Homepage | Organization, WebSite, WebPage |
| `/projection-mapping/` | Organization, WebSite, WebPage, Service, BreadcrumbList |
| `/ajijic-mapping/` | Organization, WebPage, CreativeWork (Whispers of the Lake, 2025, Chapala), BreadcrumbList |
| `/museo-descubre/` | Organization, WebPage, CreativeWork (2024, Aguascalientes), BreadcrumbList |
| `/biointerface/` | Organization, WebPage, CreativeWork (2024, Mexico City), BreadcrumbList |
| `/dome-studio/` | Existing graph updated (fulldome/360° service copy; keywords meta removed) |
| `/hospitality/` | Organization `@id` + Service (permanent immersive hotel experiences) + BreadcrumbList |

No FAQ schema, ratings, reviews, awards, prices, or invented `VideoObject` fields (`uploadDate` / duration unknown). `sameAs` omitted — the only extra site in the footer is AIROLAX, which is a related brand, not a verified social profile.

---

## Technical SEO fixes

- Added `robots.txt` (allows all; disallows `/index-immersive.html`; sitemap pointer)
- Added `sitemap.xml` with all canonical commercial URLs (excludes `/videomapping/`, `/shader-wallpapers/`, `index-immersive.html`)
- Added `404.html`; unknown paths return HTTP 404
- Self-referencing canonicals + unique titles/descriptions + Open Graph/Twitter on commercial pages
- `/videomapping/` canonical → `/projection-mapping/`, `noindex,follow`, meta refresh, keyword list removed
- `index-immersive.html` `noindex` so it does not compete with `/`
- Removed `meta name="keywords"` from Dome Studio
- Wrong-domain canonical `andatalab.art` removed with the videomapping rewrite

**Hreflang:** not implemented. EN/ES switching is client-side on one URL. Adding `hreflang` to the same URL would be invalid. Crawlers see the English HTML source. A crawlable `/es/…` (or `?lang=`) structure needs a routing decision and Search Console hreflang review — see remaining recommendations.

---

## Performance changes

- Ajijic and projection-mapping: preload the true LCP poster only
- Hero videos: `preload="metadata"`; below-the-fold videos remain `lazy-vid` / `preload="none"`
- Poster + `width`/`height` on key share and hero assets (Ajijic 1280×720, mapping poster 1280×720, homepage MOTION 1348×720)
- `decoding="async"` on case-study stills
- `prefers-reduced-motion` reveal rules unchanged
- Animations, language toggle, contact form, and project media left in place
- Essential copy (H1, hero, FAQ answers in the HTML) is in the document without requiring a click for crawlers (`<details>` still used for the visible FAQ UI)

---

## Build / test results

| Check | Result |
|-------|--------|
| `package.json` lint / typecheck / test / production build | **None defined** (static site; only `"dev": "serve ."`) |
| `node --check` `data.js`, `app.js`, `hospitality.js` | Pass |
| JSON-LD `JSON.parse` on all commercial pages | Pass |
| One H1, unique title, description, canonical | Pass (verified in HTML + browser) |
| Local HTTP | `/`, `/projection-mapping/`, `/ajijic-mapping/`, `/museo-descubre/`, `/biointerface/`, `/dome-studio/`, `/hospitality/`, `/salamastache/`, `/sitemap.xml`, `/robots.txt` → **200**; unknown URL → **404** |
| Browser (desktop) | Homepage H1/sub/capability line; Ajijic hero/FAQ/CTA; service hub; language toggle EN/ES; hospitality proof + related links |
| Browser (mobile 390×844) | Ajijic: one H1, same body copy, FAQ and CTA present (nav CTA hidden at existing `860px` breakpoint) |
| Language toggle / forms / existing motion | Intact on checked pages |

---

## Remaining recommendations (Search Console or human approval)

1. **Localized URLs** — Publish crawlable `/es/` (or equivalent) copies, then add `hreflang="en"`, `hreflang="es"`, `hreflang="x-default"`. Do not treat JS language swap as bilingual SEO.
2. **Search Console** — Submit `https://www.andatalab.com/sitemap.xml`; inspect `/projection-mapping/` and `/ajijic-mapping/`; request indexing after deploy.
3. **Hosting 301** — Prefer a server 301 from `/videomapping/` → `/projection-mapping/` in addition to the current HTML canonical/refresh.
4. **OG images** — Crop Biointerface (`AI INSTA.jpg`, 1592×2072) to ~1200×630 for social. Museo OG uses `AUDIOVISUAL TECH.webp`; a dedicated 1200×630 would be cleaner.
5. **VideoObject** — Add only if you can confirm `uploadDate` (and duration if you want rich results) for `ajijic-mapping/media/hero.mp4`.
6. **`sameAs`** — Add Instagram / LinkedIn / etc. only after those profiles exist in the site footer.
7. **Tollan / salamastache** — The live experience is iframed from `salaguadalupemastache.space`; crawlers get little on-page copy. A static summary on `andatalab.com` would help if that project should rank.
8. **www vs apex** — Canonicals use `www.andatalab.com`. Confirm hosting redirects `andatalab.com` → `www` (or the reverse) with a single hop.
9. **Core Web Vitals** — Measure in Search Console / CrUX after deploy; LCP posters were preloaded only where they are the hero.
10. **Do not index `shader-wallpapers/` in the sitemap** unless you want that demo to compete; it is currently omitted on purpose.
