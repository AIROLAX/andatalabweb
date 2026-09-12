/* ============================================================
   ANDATA LAB — GA4 + atribución de leads
   Único archivo del sitio donde vive el Measurement ID.
   Cargado con <script src="/analytics.js" defer> en cada página.
   Sin dependencias. No toca el DOM visible ni el diseño.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- CONFIGURACIÓN ----------
     Measurement ID de GA4 de ANDATA LAB. Único lugar del sitio donde vive.
     Si se vacía o se pone un valor inválido, el script no carga nada de Google:
     la captura de atribución sigue funcionando y el tracking queda inerte. */
  var GA_ID = 'G-JHQJ72FHPZ';

  var GA_READY = /^G-[A-Z0-9]{6,}$/.test(GA_ID);

  /* ============================================================
     1. ATRIBUCIÓN — landing page, referrer y UTMs
     Se captura en la PRIMERA página de la sesión y se conserva
     en sessionStorage, para que sobreviva la navegación interna
     hasta que la persona llegue al formulario de la home.
     ============================================================ */

  var STORE_KEY = 'andata_attrib';
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  function readStore() {
    try {
      var raw = sessionStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function writeStore(obj) {
    try { sessionStorage.setItem(STORE_KEY, JSON.stringify(obj)); } catch (e) {}
  }

  function buildAttrib() {
    var params = {};
    try {
      var qs = new URLSearchParams(location.search);
      UTM_KEYS.forEach(function (k) { params[k] = qs.get(k) || ''; });
    } catch (e) {
      UTM_KEYS.forEach(function (k) { params[k] = ''; });
    }

    var ref = document.referrer || '';
    var internal = false;
    try {
      internal = !!ref && new URL(ref).hostname === location.hostname;
    } catch (e) {}

    params.landing_page = location.pathname + (location.search || '');
    params.referrer = internal ? '(internal)' : (ref || '(direct)');
    return params;
  }

  var attrib = readStore();
  if (!attrib) {
    attrib = buildAttrib();
    writeStore(attrib);
  }

  /* ============================================================
     2. GA4 (gtag.js)
     ============================================================ */

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  if (!window.gtag) window.gtag = gtag;

  if (GA_READY) {
    var loader = document.createElement('script');
    loader.async = true;
    loader.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    (document.head || document.documentElement).appendChild(loader);

    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  /* Envía un evento con el contexto de atribución adjunto.
     Nunca incluye nombre, correo, organización ni mensaje del formulario. */
  function track(name, params) {
    var p = params || {};
    p.landing_page = attrib.landing_page;
    p.attrib_referrer = attrib.referrer;
    p.page_path = location.pathname;
    p.utm_source = attrib.utm_source || '(none)';
    p.utm_medium = attrib.utm_medium || '(none)';
    p.utm_campaign = attrib.utm_campaign || '(none)';
    if (GA_READY) gtag('event', name, p);
    if (window.ANDATA_DEBUG) console.log('[andata:event]', name, p);
  }
  window.andataTrack = track;

  /* ============================================================
     3. EVENTOS
     ============================================================ */

  var CASE_PATHS = [
    '/ajijic-mapping/',
    '/museo-descubre/',
    '/biointerface/',
    '/particle-system/',
    '/salamastache/'
  ];

  function closestAnchor(el) {
    while (el && el !== document) {
      if (el.tagName === 'A' || el.tagName === 'BUTTON') return el;
      el = el.parentNode;
    }
    return null;
  }

  function isCaseStudyHref(href) {
    if (!href) return false;
    var path;
    try { path = new URL(href, location.href).pathname; } catch (e) { return false; }
    if (path.charAt(path.length - 1) !== '/') path += '/';
    for (var i = 0; i < CASE_PATHS.length; i++) {
      if (path.indexOf(CASE_PATHS[i]) !== -1) return true;
    }
    return false;
  }

  /* --- clic en email, CTA "Start a project", y casos de estudio --- */
  document.addEventListener('click', function (ev) {
    var el = closestAnchor(ev.target);
    if (!el) return;

    var href = el.getAttribute('href') || '';
    var i18n = el.getAttribute('data-i18n') || '';

    if (href.indexOf('mailto:') === 0) {
      track('email_click', {
        link_url: href,
        email_address: href.replace('mailto:', '').split('?')[0]
      });
      return;
    }

    if (i18n === 'cta_start' || el.classList.contains('nav-cta') || el.classList.contains('nav-drawer-cta')) {
      track('cta_start_project', {
        link_text: (el.textContent || '').trim().slice(0, 60),
        link_url: href || '(in-page)'
      });
      return;
    }

    if (isCaseStudyHref(href)) {
      track('case_study_click', {
        link_url: href,
        link_text: (el.textContent || '').trim().slice(0, 60)
      });
    }
  }, true);

  /* --- reproducción de video iniciada por la persona ---
     Los heroes llevan autoplay/loop y arrancan solos: se excluyen,
     porque contarlos convertiría el evento en un pageview disfrazado. */
  document.addEventListener('play', function (ev) {
    var v = ev.target;
    if (!v || v.tagName !== 'VIDEO') return;
    if (v.hasAttribute('autoplay')) return;
    if (v.dataset.andataTracked === '1') return;
    v.dataset.andataTracked = '1';

    var src = v.currentSrc || v.getAttribute('src') || '';
    try { src = new URL(src, location.href).pathname; } catch (e) {}

    track('showreel_play', {
      video_src: src,
      video_id: v.id || '(unnamed)'
    });
  }, true);

  /* ============================================================
     4. FORMULARIO — solo rellena los campos ocultos.
     El evento lead_form_submit NO se dispara aquí: lo emite app.js
     únicamente cuando Web3Forms confirma el envío. Ver app.js.
     ============================================================ */

  function fillHiddenFields() {
    var form = document.getElementById('brief-form');
    if (!form) return;
    var map = {
      landing_page: attrib.landing_page,
      referrer: attrib.referrer,
      utm_source: attrib.utm_source,
      utm_medium: attrib.utm_medium,
      utm_campaign: attrib.utm_campaign
    };
    Object.keys(map).forEach(function (name) {
      var input = form.querySelector('input[name="' + name + '"]');
      if (input) input.value = map[name] || '';
    });
  }

  /* app.js la llama justo antes de construir el FormData. */
  window.andataFillForm = fillHiddenFields;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fillHiddenFields);
  } else {
    fillHiddenFields();
  }

})();
