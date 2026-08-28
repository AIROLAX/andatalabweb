(function () {
  'use strict';
  var LANG_KEY = 'andata_lang';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mqNarrow = window.matchMedia('(max-width: 768px)');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  var I18N = {
    en: {
      nav_work: 'Work', nav_dome: 'Dome Studio', nav_hosp: 'Hospitality', nav_process: 'Process',
      nav_cta: 'Design a pilot', cta_start: 'Start a project',
      nav_home: 'Home', nav_contact: 'Contact',
      h_t1: 'The resort', h_t2: 'becomes alive.',
      h_sub: 'Permanent data-art environments shaped by place, time and guest presence.',
      h_cta1: 'Explore experiences', h_cta2: 'Design a pilot',
      h_id: 'Portrait of Place — flagship concept',
      h_map: 'Tide → rhythm · Wind → movement · Moon → density · Presence → response',
      d_eye: 'Data art', d_t: 'Data, made physical.',
      d_p: 'Tide becomes rhythm. Wind becomes movement. Moon becomes density. Presence becomes response.',
      d_note: 'A visual explanation of the system — not a live property feed.',
      d_tide: 'Tide', d_wind: 'Wind', d_moon: 'Moon', d_presence: 'Presence',
      d_src_sum: 'Potential sources include verified environmental datasets and on-site sensing, selected per property.',
      d_src: 'Proposed, not currently wired by ANDATA: CONABIO Geoportal, EncicloVida, SIMAR, Mexico’s Servicio Meteorológico Nacional, Caribbean sargassum monitoring, and on-site sensors — confirmed per property.',
      st1_t: 'Caribbean Data Portal', st1: 'Walk through the living rhythms of the destination.',
      st1_a: 'Environmental data', st1_b: 'Presence', st1_c: 'Architecture',
      st2_t: 'Family Discovery', st2: 'Every step reveals a new part of the Caribbean.',
      st2_a: 'Play', st2_b: 'Ecology', st2_c: 'Learning',
      st3_t: 'Night Pool / Event Canvas', st3: 'One permanent system. Infinite programmed moments.',
      st3_a: 'Water', st3_b: 'Music', st3_c: 'Events',
      ph_label: 'Concept visualization',
      m_eye: 'The system', m_t: 'More ways the resort can respond.',
      t1_t: 'Living Water', t1: 'Movement becomes light in the water.', t1m: 'The guest completes the field by entering it.',
      t2_t: 'Nocturnal Garden', t2: 'Species gather along the path.', t2m: 'Moon and hour change density and glow.',
      t3_t: 'Wellness Atmospheres', t3: 'The room moves at the pace of the body.', t3m: 'Sunset, tide or breath can shift the field.',
      t4_t: 'Immersive Dining', t4: 'The table becomes the interface.', t4m: 'Light follows a menu, an origin, a night.',
      t5_t: 'Brand & Product', t5: 'A night layer. The system stays.', t5m: 'By morning, the amenity returns to the destination.',
      e_eye: 'Engine', e_t: 'One system. Many states.',
      e_p: 'From a quiet morning ritual to a signature night event.',
      e_core: 'ANDATA real-time engine',
      e_light: 'Light', e_sound: 'Sound', e_screen: 'Screen', e_space: 'Space',
      e_day: 'Day', e_fam: 'Family', e_well: 'Wellness', e_night: 'Night',
      pr_eye: 'Proof', pr_t: 'Permanent where it matters. Proven across real systems.',
      pr_p: 'Our hospitality concepts combine permanent museum installations, real-time sensing and architectural media already delivered by ANDATA.',
      pr1_a: 'Delivered interactive installation', pr1_b: 'AI-driven mirror', pr1_loc: 'Chapala / Ajijic',
      pr1: 'An AI-driven mirror ritual for Día de Muertos — portraits, presence and live response.',
      pr2_a: 'Delivered architectural mapping', pr2_b: 'Site-specific media', pr2_loc: 'Jalisco',
      pr2: 'Projection calibrated to historic architecture for a nocturnal lake narrative.',
      pr3_a: 'Delivered interactive system', pr3_b: 'Real-time sensing', pr3_loc: 'Mexico City',
      pr3: 'Presence, not identity — the architecture Portrait of Place would use.',
      o_eye: 'Operations', o_t: 'Designed to live in the hotel.',
      o_p: 'Scheduled. Serviceable. Privacy-first. Ready to evolve.',
      o1_t: 'Local processing', o1: 'Runs when the network does not.',
      o2_t: 'Discreet sensing', o2: 'No facial recognition. No identity stored by default.',
      o3_t: 'Scheduled operation', o3: 'Hotel hours. Automatic recovery.',
      o4_t: 'Automatic recovery', o4: 'Restarts after power or network interruption.',
      o5_t: 'Seasonal content', o5: 'Remote updates. One artistic system.',
      o6_t: 'Remote support', o6: 'Calibration, monitoring, staff documentation.',
      meth: 'Method & operation',
      meth_p: 'Depth cameras read silhouette and movement, not identity. An on-site edge computer drives TouchDesigner, GLSL and sensor logic. Outputs: architectural LED, projection, spatial audio, responsive light, private QR. Data sources are proposed per property — never implied as live ANDATA integrations.',
      cta_eye: 'Pilot', cta_t: 'Start with one space.',
      cta_p: 'One property. One guest moment. One unforgettable pilot.',
      cta_flow: 'Discover → Prototype → Deploy',
      cta_1: 'Design a pilot', cta_2: 'Write by email',
      label_email: 'Email', label_based: 'Based', label_reply: 'Reply',
      reply: '24–48 hours',
      based: 'Mexico · working worldwide', rights: 'All rights reserved.',
      doc_title: 'ANDATA Hospitality | Permanent immersive guest amenities | ANDATA LAB'
    },
    es: {
      nav_work: 'Proyectos', nav_dome: 'Dome Studio', nav_hosp: 'Hospitality', nav_process: 'Proceso',
      nav_cta: 'Diseñar un piloto', cta_start: 'Inicia un proyecto',
      nav_home: 'Inicio', nav_contact: 'Contacto',
      h_t1: 'El resort', h_t2: 'cobra vida.',
      h_sub: 'Entornos permanentes de data art moldeados por el lugar, el tiempo y la presencia del huésped.',
      h_cta1: 'Explorar experiencias', h_cta2: 'Diseñar un piloto',
      h_id: 'Portrait of Place — concepto insignia',
      h_map: 'Marea → ritmo · Viento → movimiento · Luna → densidad · Presencia → respuesta',
      d_eye: 'Data art', d_t: 'Datos, hechos espacio.',
      d_p: 'La marea se convierte en ritmo. El viento en movimiento. La luna en densidad. La presencia en respuesta.',
      d_note: 'Una explicación visual del sistema — no una señal en vivo de un hotel.',
      d_tide: 'Marea', d_wind: 'Viento', d_moon: 'Luna', d_presence: 'Presencia',
      d_src_sum: 'Las fuentes posibles incluyen conjuntos ambientales verificados y sensores en sitio, elegidos por propiedad.',
      d_src: 'Propuestas, no conectadas hoy por ANDATA: Geoportal CONABIO, EncicloVida, SIMAR, Servicio Meteorológico Nacional, monitoreo de sargazo en el Caribe y sensores en sitio — se confirman por propiedad.',
      st1_t: 'Caribbean Data Portal', st1: 'Camina los ritmos vivos del destino.',
      st1_a: 'Datos ambientales', st1_b: 'Presencia', st1_c: 'Arquitectura',
      st2_t: 'Family Discovery', st2: 'Cada paso revela una parte nueva del Caribe.',
      st2_a: 'Juego', st2_b: 'Ecología', st2_c: 'Aprendizaje',
      st3_t: 'Night Pool / Event Canvas', st3: 'Un sistema permanente. Infinitos momentos programados.',
      st3_a: 'Agua', st3_b: 'Música', st3_c: 'Eventos',
      ph_label: 'Visualización conceptual',
      m_eye: 'El sistema', m_t: 'Otras formas en que el resort puede responder.',
      t1_t: 'Living Water', t1: 'El movimiento se vuelve luz en el agua.', t1m: 'El huésped completa el campo al entrar.',
      t2_t: 'Jardín nocturno', t2: 'Las especies se reúnen en el sendero.', t2m: 'La luna y la hora cambian densidad y brillo.',
      t3_t: 'Wellness Atmospheres', t3: 'La sala se mueve al ritmo del cuerpo.', t3m: 'El atardecer, la marea o la respiración pueden cambiar el campo.',
      t4_t: 'Immersive Dining', t4: 'La mesa se vuelve la interfaz.', t4m: 'La luz sigue un menú, un origen, una noche.',
      t5_t: 'Marca y producto', t5: 'Una capa de una noche. El sistema se queda.', t5m: 'Por la mañana, la amenidad vuelve al destino.',
      e_eye: 'Motor', e_t: 'Un sistema. Muchos estados.',
      e_p: 'De un rito quieto por la mañana a un evento de firma por la noche.',
      e_core: 'Motor en tiempo real ANDATA',
      e_light: 'Luz', e_sound: 'Sonido', e_screen: 'Pantalla', e_space: 'Espacio',
      e_day: 'Día', e_fam: 'Familia', e_well: 'Wellness', e_night: 'Noche',
      pr_eye: 'Prueba', pr_t: 'Permanente donde importa. Probado en sistemas reales.',
      pr_p: 'Nuestros conceptos de hospitality combinan instalaciones museográficas permanentes, sensado en tiempo real y media arquitectónica que ANDATA ya entregó.',
      pr1_a: 'Instalación interactiva entregada', pr1_b: 'Espejo con IA', pr1_loc: 'Chapala / Ajijic',
      pr1: 'Un rito de espejo con IA para Día de Muertos — retratos, presencia y respuesta en vivo.',
      pr2_a: 'Videomapping arquitectónico entregado', pr2_b: 'Media específica al sitio', pr2_loc: 'Jalisco',
      pr2: 'Proyección calibrada sobre arquitectura histórica para una narrativa nocturna del lago.',
      pr3_a: 'Sistema interactivo entregado', pr3_b: 'Sensado en tiempo real', pr3_loc: 'Ciudad de México',
      pr3: 'Presencia, no identidad — la arquitectura que usaría Portrait of Place.',
      o_eye: 'Operación', o_t: 'Diseñado para vivir en el hotel.',
      o_p: 'Programado. Servible. Privacidad primero. Listo para evolucionar.',
      o1_t: 'Procesamiento local', o1: 'Corre cuando la red no está.',
      o2_t: 'Sensado discreto', o2: 'Sin reconocimiento facial. Sin identidad por defecto.',
      o3_t: 'Horario hotelero', o3: 'Encendido programado. Recuperación automática.',
      o4_t: 'Recuperación automática', o4: 'Reinicia tras un corte de energía o red.',
      o5_t: 'Contenido de temporada', o5: 'Actualizaciones remotas. Un sistema artístico.',
      o6_t: 'Soporte remoto', o6: 'Calibración, monitoreo, documentación para staff.',
      meth: 'Método y operación',
      meth_p: 'Cámaras de profundidad leen silueta y movimiento, no identidad. Una computadora en el borde corre TouchDesigner, GLSL y lógica de sensores. Salidas: LED arquitectónico, proyección, audio espacial, luz receptiva, QR privado. Las fuentes de datos se proponen por propiedad — nunca se presentan como integraciones ANDATA en vivo.',
      cta_eye: 'Piloto', cta_t: 'Empieza con un espacio.',
      cta_p: 'Una propiedad. Un momento del huésped. Un piloto inolvidable.',
      cta_flow: 'Descubrir → Prototipar → Instalar',
      cta_1: 'Diseñar un piloto', cta_2: 'Escribir por correo',
      label_email: 'Correo', label_based: 'Ubicación', label_reply: 'Respuesta',
      reply: '24–48 horas',
      based: 'México · trabajamos en todo el mundo', rights: 'Todos los derechos reservados.',
      doc_title: 'ANDATA Hospitality | Amenidades inmersivas permanentes | ANDATA LAB'
    }
  };

  function pickLang() {
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved === 'en' || saved === 'es') return saved;
    } catch (e) {}
    return 'en';
  }
  var lang = pickLang();

  function applyLang() {
    var dict = I18N[lang] || I18N.en;
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(function (node) {
      var k = node.getAttribute('data-i18n');
      if (dict[k] != null) node.innerHTML = dict[k];
    });
    if (dict.doc_title) document.title = dict.doc_title;
    var btn = $('#lang-toggle');
    if (btn) {
      btn.textContent = (lang === 'en') ? 'ES' : 'EN';
      btn.setAttribute('aria-label', lang === 'en' ? 'Cambiar a español' : 'Switch to English');
    }
  }
  var langBtn = $('#lang-toggle');
  if (langBtn) langBtn.addEventListener('click', function () {
    lang = (lang === 'en') ? 'es' : 'en';
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    applyLang();
  });

  (function chrome() {
    var progress = $('#scroll-progress');
    var queued = false;
    function frame() {
      queued = false;
      var y = window.scrollY || 0;
      document.body.classList.toggle('is-scrolled', y > 48);
      if (progress) {
        var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        progress.style.transform = 'scaleX(' + Math.min(1, y / max) + ')';
      }
      var heroImg = $('.hero-media img');
      if (heroImg && !reduced && y < window.innerHeight) {
        heroImg.style.transform = 'translate3d(0,' + (y * 0.035) + 'px,0)';
      }
    }
    function onScroll() { if (!queued) { queued = true; requestAnimationFrame(frame); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    frame();
  })();

  (function ambient() {
    var nodes = $$('[data-ambient]');
    if (!nodes.length || reduced) return;
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var c = en.target.getAttribute('data-ambient');
        if (c) document.body.style.setProperty('--ambient', c);
      });
    }, { threshold: 0.45 });
    nodes.forEach(function (n) { io.observe(n); });
  })();

  (function heroField() {
    var canvas = $('#hero-field');
    var hero = $('#inicio');
    if (!canvas || !hero || reduced) return;
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(1.5, window.devicePixelRatio || 1);
    var pts = [];
    var mx = 0.62, my = 0.42, running = true, visible = true;
    var n = mqNarrow.matches ? 28 : 46;
    function resize() {
      var r = canvas.getBoundingClientRect();
      var w = Math.max(1, r.width), h = Math.max(1, r.height);
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function seed() {
      pts = [];
      for (var i = 0; i < n; i++) {
        pts.push({ x: Math.random(), y: Math.random(), vx: 0, vy: 0, r: 0.5 + Math.random() * 1.2 });
      }
    }
    function tick() {
      if (!running || !visible) return;
      var w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < pts.length; i++) {
        var a = pts[i];
        a.vx += (mx - a.x) * 0.0012; a.vy += (my - a.y) * 0.0012;
        a.vx *= 0.96; a.vy *= 0.96;
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0) a.x = 1; if (a.x > 1) a.x = 0;
        if (a.y < 0) a.y = 1; if (a.y > 1) a.y = 0;
        ctx.fillStyle = 'rgba(246,243,238,' + (0.08 + a.r * 0.08) + ')';
        ctx.beginPath(); ctx.arc(a.x * w, a.y * h, a.r, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(tick);
    }
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / Math.max(1, r.width);
      my = (e.clientY - r.top) / Math.max(1, r.height);
    }, { passive: true });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        visible = entries[0] && entries[0].isIntersecting;
        if (visible && running) tick();
      }, { threshold: 0.05 });
      io.observe(hero);
    }
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
      if (running && visible) tick();
    });
    resize(); seed(); tick();
  })();

  (function dataArt() {
    var canvas = $('#data-field');
    var btns = $$('.inputs button');
    var mode = 0;
    var mx = 0.5, my = 0.5;
    var lockedUntil = 0;
    function setMode(m, fromScroll) {
      if (fromScroll && performance.now() < lockedUntil) return;
      mode = Math.max(0, Math.min(3, m));
      btns.forEach(function (b, i) { b.setAttribute('aria-pressed', i === mode ? 'true' : 'false'); });
    }
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () {
        lockedUntil = performance.now() + 1800;
        setMode(i, false);
      });
    });
    var dataSec = $('#data');
    if (dataSec) {
      window.addEventListener('scroll', function () {
        var r = dataSec.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        var p = Math.min(1, Math.max(0, (window.innerHeight * 0.55 - r.top) / Math.max(1, r.height)));
        setMode(Math.min(3, Math.floor(p * 4)), true);
      }, { passive: true });
    }
    if (!canvas || reduced) return;
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(1.5, window.devicePixelRatio || 1);
    var pts = [];
    var n = mqNarrow.matches ? 90 : 160;
    var running = true, visible = true;
    function resize() {
      var r = canvas.getBoundingClientRect();
      var w = Math.max(1, r.width), h = Math.max(1, r.height);
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function seed() {
      pts = [];
      for (var i = 0; i < n; i++) {
        pts.push({ x: Math.random(), y: Math.random(), vx: 0, vy: 0, r: 0.7 + Math.random() * 1.5 });
      }
    }
    function tick() {
      if (!running || !visible) return;
      var w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      var t = performance.now() * 0.001;
      var col = mode === 0 ? [60, 180, 255] : mode === 1 ? [124, 182, 138] : mode === 2 ? [212, 180, 131] : [224, 138, 106];
      for (var i = 0; i < pts.length; i++) {
        var a = pts[i];
        if (mode === 0) { a.vy += Math.sin(t * 1.6 + i) * 0.00055; a.vx *= 0.96; }
        if (mode === 1) { a.vx += 0.0009; a.vy += Math.sin(i) * 0.0002; }
        if (mode === 2) { a.vx *= 0.92; a.vy *= 0.92; a.vx += Math.sin(t * 0.6 + i) * 0.00012; }
        if (mode === 3) {
          a.vx += (mx - a.x) * 0.012; a.vy += (my - a.y) * 0.012;
          var dx = a.x - mx, dy = a.y - my, d2 = dx * dx + dy * dy;
          if (d2 < 0.02) { a.vx -= dx * 0.08; a.vy -= dy * 0.08; }
        }
        a.vx *= 0.97; a.vy *= 0.97;
        a.x += a.vx; a.y += a.vy;
        if (a.x < -0.04) a.x = 1.04; if (a.x > 1.04) a.x = -0.04;
        if (a.y < -0.04) a.y = 1.04; if (a.y > 1.04) a.y = -0.04;
        var rad = a.r * (mode === 2 ? 0.85 : mode === 0 ? 1.7 : 1.25);
        ctx.fillStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (0.38 + a.r * 0.18) + ')';
        ctx.beginPath(); ctx.arc(a.x * w, a.y * h, rad, 0, Math.PI * 2); ctx.fill();
        if (i % 4 === 0) {
          var b = pts[(i + 7) % pts.length];
          ctx.strokeStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',0.08)';
          ctx.beginPath(); ctx.moveTo(a.x * w, a.y * h); ctx.lineTo(b.x * w, b.y * h); ctx.stroke();
        }
      }
      requestAnimationFrame(tick);
    }
    canvas.addEventListener('pointermove', function (e) {
      var r = canvas.getBoundingClientRect();
      mx = (e.clientX - r.left) / Math.max(1, r.width);
      my = (e.clientY - r.top) / Math.max(1, r.height);
    }, { passive: true });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        visible = entries[0] && entries[0].isIntersecting;
        if (visible && running) tick();
      }, { rootMargin: '80px 0px', threshold: 0.05 });
      io.observe(canvas);
    }
    document.addEventListener('visibilitychange', function () { running = !document.hidden; if (running && visible) tick(); });
    window.addEventListener('resize', resize, { passive: true });
    resize(); seed(); tick();
  })();

  (function systemStates() {
    var root = $('.flow');
    if (!root) return;
    var colors = { day: '#3CDCFF', family: '#7CB68A', wellness: '#D4B483', night: '#E08A6A' };
    var btns = $$('.states button');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var st = b.getAttribute('data-state');
        btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        root.style.setProperty('--flow', colors[st] || colors.day);
        $$('.flow .chip').forEach(function (c) { c.classList.add('is-live'); });
      });
    });
    if (btns[0]) btns[0].click();
  })();

  applyLang();

  /* Proof videos — play when visible */
  (function proofVideos() {
    var vids = $$('.proof .lazy-vid');
    if (!vids.length) return;
    function play(v) {
      var s = v.getAttribute('data-src');
      if (s && v.getAttribute('src') !== s) {
        v.setAttribute('src', s);
        v.load();
      }
      if (v.readyState >= 2) {
        v.classList.add('is-loaded');
        v.play().catch(function () {});
        return;
      }
      v.addEventListener('loadeddata', function once() {
        v.removeEventListener('loadeddata', once);
        v.classList.add('is-loaded');
        v.play().catch(function () {});
      }, { once: true });
    }
    if (!('IntersectionObserver' in window)) {
      vids.forEach(play);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) play(en.target);
        else en.target.pause();
      });
    }, { rootMargin: '120px 0px', threshold: 0.15 });
    vids.forEach(function (v) { io.observe(v); });
  })();
})();
