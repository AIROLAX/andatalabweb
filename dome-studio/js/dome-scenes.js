/**
 * ANDATA DOME STUDIO — scene bootstrap
 * Loads the two isolated WebGL modules. If a module declines (no WebGL,
 * reduced motion, missing DOM), the page's existing fallbacks stay in place.
 */
import { initDomeHero } from './dome-hero.js';
import { initSpatialField } from './spatial-field.js';

var heroOk = false;
try { heroOk = !!initDomeHero(); } catch (err) { heroOk = false; }
if (!heroOk && typeof window.__initDomeOrbFallback === 'function') {
  window.__initDomeOrbFallback();
}

try { initSpatialField(); } catch (err) { /* section keeps its CSS fallback */ }
