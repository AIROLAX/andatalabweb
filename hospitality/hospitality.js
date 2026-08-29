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
      h_cta1: 'Explore experiences',
      d_eye: 'Data art', d_t: 'Data, made physical.',
      d_p: 'Tide becomes rhythm. Wind becomes movement. Moon becomes density. Presence becomes response.',
      d_note: 'A visual explanation of the system — not a live property feed.',
      d_tide: 'Tide', d_wind: 'Wind', d_moon: 'Moon', d_presence: 'Presence',
      d_tabs_label: 'Data inputs',
      d_sim: 'Concept data', d_concept_mode: 'Concept mode',
      d_src_sum: 'Potential sources include verified environmental datasets and on-site sensing, selected per property.',
      d_src: 'Proposed, not currently wired by ANDATA: CONABIO Geoportal, EncicloVida, SIMAR, Mexico’s Servicio Meteorológico Nacional, Caribbean sargassum monitoring, and on-site sensors — confirmed per property.',
      st1_t: 'Caribbean Data Portal', st1: 'Walk through the living rhythms of the destination.',
      st1_a: 'Environmental data', st1_b: 'Presence', st1_c: 'Architecture',
      st2_t: 'Family Discovery', st2: 'Every step reveals a new part of the Caribbean.',
      st2_a: 'Play', st2_b: 'Ecology', st2_c: 'Learning',
      st3_t: 'Night Pool / Event Canvas', st3: 'One permanent system. Infinite programmed moments.',
      st3_a: 'Water', st3_b: 'Music', st3_c: 'Events',
      st4_a: 'Water', st4_b: 'Presence', st4_c: 'Light',
      st5_a: 'Garden', st5_b: 'Moon', st5_c: 'Species',
      st6_a: 'Wellness', st6_b: 'Body', st6_c: 'Atmosphere',
      st7_a: 'Dining', st7_b: 'Table', st7_c: 'Light',
      st8_a: 'Brand', st8_b: 'Night', st8_c: 'Destination',
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
      rel_p: 'Related: <a href="../projection-mapping/">Architectural Projection Mapping</a> · <a href="../museo-descubre/">Interactive Museum Exhibits</a> · <a href="../dome-studio/">Fulldome and 360° content</a>',
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
      nav_map: 'Projection Mapping',
      doc_title: 'ANDATA Hospitality | Permanent Immersive Hotel Experiences'
    },
    es: {
      nav_work: 'Proyectos', nav_dome: 'Dome Studio', nav_hosp: 'Hospitality', nav_process: 'Proceso',
      nav_cta: 'Diseñar un piloto', cta_start: 'Inicia un proyecto',
      nav_home: 'Inicio', nav_contact: 'Contacto',
      h_t1: 'El resort', h_t2: 'cobra vida.',
      h_sub: 'Entornos permanentes de data art moldeados por el lugar, el tiempo y la presencia del huésped.',
      h_cta1: 'Explorar experiencias',
      d_eye: 'Data art', d_t: 'Datos, hechos espacio.',
      d_p: 'La marea se convierte en ritmo. El viento en movimiento. La Luna en densidad. La presencia en respuesta.',
      d_note: 'Una explicación visual del sistema — no una señal en vivo de un hotel.',
      d_tide: 'Marea', d_wind: 'Viento', d_moon: 'Luna', d_presence: 'Presencia',
      d_tabs_label: 'Entradas de datos',
      d_sim: 'Simulación', d_concept_mode: 'Modo concepto',
      d_src_sum: 'Las fuentes posibles incluyen conjuntos ambientales verificados y sensores en sitio, elegidos por propiedad.',
      d_src: 'Propuestas, no conectadas hoy por ANDATA: Geoportal CONABIO, EncicloVida, SIMAR, Servicio Meteorológico Nacional, monitoreo de sargazo en el Caribe y sensores en sitio — se confirman por propiedad.',
      st1_t: 'Caribbean Data Portal', st1: 'Camina los ritmos vivos del destino.',
      st1_a: 'Datos ambientales', st1_b: 'Presencia', st1_c: 'Arquitectura',
      st2_t: 'Family Discovery', st2: 'Cada paso revela una parte nueva del Caribe.',
      st2_a: 'Juego', st2_b: 'Ecología', st2_c: 'Aprendizaje',
      st3_t: 'Night Pool / Event Canvas', st3: 'Un sistema permanente. Infinitos momentos programados.',
      st3_a: 'Agua', st3_b: 'Música', st3_c: 'Eventos',
      st4_a: 'Agua', st4_b: 'Presencia', st4_c: 'Luz',
      st5_a: 'Jardín', st5_b: 'Luna', st5_c: 'Especies',
      st6_a: 'Wellness', st6_b: 'Cuerpo', st6_c: 'Atmósfera',
      st7_a: 'Dining', st7_b: 'Mesa', st7_c: 'Luz',
      st8_a: 'Marca', st8_b: 'Noche', st8_c: 'Destino',
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
      rel_p: 'Relacionado: <a href="../projection-mapping/">Videomapping arquitectónico</a> · <a href="../museo-descubre/">Exhibiciones interactivas de museo</a> · <a href="../dome-studio/">Contenido fulldome y 360°</a>',
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
      nav_map: 'Projection Mapping',
      doc_title: 'ANDATA Hospitality | Experiencias inmersivas permanentes para hoteles'
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
    $$('[data-i18n-aria]').forEach(function (node) {
      var k = node.getAttribute('data-i18n-aria');
      if (dict[k] != null) node.setAttribute('aria-label', dict[k]);
    });
    if (dict.doc_title) document.title = dict.doc_title;
    if (typeof window.__dataArtRefresh === 'function') window.__dataArtRefresh();
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
      var heroMedia = $('.hero-media');
      if (heroMedia && !reduced && y < window.innerHeight) {
        heroMedia.style.transform = 'translate3d(0,' + (y * 0.035) + 'px,0)';
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

  (function heroVideo() {
    var v = $('#hero-video');
    var hero = $('#inicio');
    if (!v || !hero) return;
    if (reduced) {
      v.pause();
      return;
    }
    function show() { v.classList.add('is-on'); }
    function play() {
      var p = v.play();
      if (p && p.then) p.then(show).catch(function () {});
      else show();
    }
    v.addEventListener('playing', show);
    if (v.readyState >= 2) play();
    else v.addEventListener('canplay', play, { once: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) play();
        else v.pause();
      }, { threshold: 0.04 }).observe(hero);
    }
  })();

  (function heroField() {
    var canvas = $('#hero-field');
    var hero = $('#inicio');
    if (!canvas || !hero || reduced) return;
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(1.5, window.devicePixelRatio || 1);
    var pts = [];
    var mx = 0.62, my = 0.42;
    var hist = [];
    var HIST = mqNarrow.matches ? 18 : 32;
    var running = true, visible = true;
    var n = mqNarrow.matches ? 56 : 128;
    function resize() {
      var r = canvas.getBoundingClientRect();
      var w = Math.max(1, r.width), h = Math.max(1, r.height);
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function seed() {
      pts = [];
      hist = [];
      for (var h = 0; h < HIST; h++) hist.push({ x: mx, y: my });
      for (var i = 0; i < n; i++) {
        var along = i / n;
        pts.push({
          x: Math.random(), y: Math.random(),
          vx: 0, vy: 0,
          r: 0.45 + Math.random() * 2.6,
          lag: 0.018 + (1 - along) * 0.07 + Math.random() * 0.02,
          ox: (Math.random() - 0.5) * (0.08 + along * 0.38),
          oy: (Math.random() - 0.5) * (0.06 + along * 0.3),
          ph: Math.random() * Math.PI * 2,
          spin: 0.45 + Math.random() * 1.8,
          slot: Math.min(HIST - 1, Math.floor(along * HIST * 0.92))
        });
      }
    }
    function tick() {
      if (!running || !visible) return;
      var w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      var t = performance.now() * 0.001;
      hist[0].x = mx; hist[0].y = my;
      for (var s = 1; s < hist.length; s++) {
        hist[s].x += (hist[s - 1].x - hist[s].x) * 0.14;
        hist[s].y += (hist[s - 1].y - hist[s].y) * 0.14;
      }
      for (var i = 0; i < pts.length; i++) {
        var a = pts[i];
        var node = hist[a.slot];
        var gx = node.x + Math.cos(t * a.spin + a.ph) * a.ox;
        var gy = node.y + Math.sin(t * a.spin * 0.82 + a.ph) * a.oy;
        a.vx += (gx - a.x) * a.lag;
        a.vy += (gy - a.y) * a.lag;
        a.vx *= 0.78;
        a.vy *= 0.78;
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < -0.1) a.x = 1.1; if (a.x > 1.1) a.x = -0.1;
        if (a.y < -0.1) a.y = 1.1; if (a.y > 1.1) a.y = -0.1;
        var head = 1 - a.slot / HIST;
        ctx.fillStyle = 'rgba(246,243,238,' + (0.1 + a.r * 0.1 + head * 0.28).toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(a.x * w, a.y * h, a.r * (0.9 + head * 0.85), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.lineWidth = 0.85;
      for (i = 0; i < pts.length; i += 2) {
        var p = pts[i];
        var q = pts[(i + 7) % pts.length];
        var ddx = p.x - q.x, ddy = p.y - q.y;
        if (ddx * ddx + ddy * ddy > 0.018) continue;
        ctx.strokeStyle = 'rgba(60,220,255,0.18)';
        ctx.beginPath();
        ctx.moveTo(p.x * w, p.y * h);
        ctx.lineTo(q.x * w, q.y * h);
        ctx.stroke();
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
    var section = $('#data');
    var stage = $('#data-panel');
    var canvas = $('#data-field');
    var vid = $('#data-vid');
    var imgA = $('#data-img-a');
    var imgB = $('#data-img-b');
    var metricsEl = $('#data-metrics');
    var mapHud = $('#data-mapping');
    var mapInline = $('#data-map-inline');
    var titleEl = $('#data-state-title');
    var descEl = $('#data-state-desc');
    var simEl = $('#data-sim');
    var tablist = $('.inputs');
    var tabs = $$('.inputs [role="tab"]');
    if (!section || !stage || !tabs.length) return;

    var DATA_STATES = [
      {
        id: 'tide',
        tabLabel: { en: 'Tide', es: 'Marea' },
        eyebrow: { en: 'Tide', es: 'Marea' },
        title: { en: 'Tide becomes rhythm.', es: 'La marea se convierte en ritmo.' },
        description: {
          en: 'The visual field expands and contracts with the slow cycles of the water.',
          es: 'El campo visual se expande y contrae siguiendo los ciclos lentos del agua.'
        },
        mappingLabel: { en: 'TIDE → PULSE', es: 'MAREA → PULSO' },
        mediaSrc: '',
        posterSrc: 'img/living-water.jpg',
        mediaAlt: {
          en: 'Concept visualization — oceanic field: tide becomes a slow visual pulse',
          es: 'Visualización conceptual — campo oceánico: la marea se convierte en un pulso visual lento'
        },
        accentColor: '#3CDCFF',
        relevantData: [
          { k: { en: 'Tide cycle', es: 'Ciclo de marea' }, v: { en: 'Rising', es: 'Creciente' } },
          { k: { en: 'Level', es: 'Nivel' }, v: { en: '+0.6 m', es: '+0.6 m' } },
          { k: { en: 'Visual rhythm', es: 'Ritmo visual' }, v: { en: 'Slow', es: 'Lento' } }
        ]
      },
      {
        id: 'wind',
        tabLabel: { en: 'Wind', es: 'Viento' },
        eyebrow: { en: 'Wind', es: 'Viento' },
        title: { en: 'Wind becomes direction.', es: 'El viento se convierte en dirección.' },
        description: {
          en: 'Particles change speed, drift and orientation with the force of the air.',
          es: 'Las partículas cambian velocidad, deriva y orientación según la fuerza del aire.'
        },
        mappingLabel: { en: 'WIND → DRIFT', es: 'VIENTO → DERIVA' },
        mediaSrc: '',
        posterSrc: 'img/wellness-atmospheres.jpg',
        mediaAlt: {
          en: 'Concept visualization — directional particle trails: wind becomes drift',
          es: 'Visualización conceptual — estelas direccionales: el viento se convierte en deriva'
        },
        accentColor: '#A8C8D8',
        relevantData: [
          { k: { en: 'Direction', es: 'Dirección' }, v: { en: 'ENE', es: 'ENE' } },
          { k: { en: 'Intensity', es: 'Intensidad' }, v: { en: '18 kn', es: '18 kn' } },
          { k: { en: 'Visual speed', es: 'Velocidad visual' }, v: { en: 'Drift', es: 'Deriva' } }
        ]
      },
      {
        id: 'moon',
        tabLabel: { en: 'Moon', es: 'Luna' },
        eyebrow: { en: 'Moon', es: 'Luna' },
        title: { en: 'The Moon becomes density.', es: 'La Luna se convierte en densidad.' },
        description: {
          en: 'The lunar phase shifts brightness, particle accumulation and the atmosphere of the space.',
          es: 'La fase lunar modifica el brillo, la acumulación de partículas y la atmósfera del espacio.'
        },
        mappingLabel: { en: 'MOON → DENSITY', es: 'LUNA → DENSIDAD' },
        mediaSrc: '',
        posterSrc: 'img/ecological-corridor.jpg',
        mediaAlt: {
          en: 'Concept visualization — night garden with lunar glow: the Moon becomes density',
          es: 'Visualización conceptual — jardín nocturno con brillo lunar: la Luna se convierte en densidad'
        },
        accentColor: '#C8B8E6',
        relevantData: [
          { k: { en: 'Phase', es: 'Fase' }, v: { en: 'Gibbous', es: 'Gibosa' } },
          { k: { en: 'Illumination', es: 'Iluminación' }, v: { en: '72%', es: '72%' } },
          { k: { en: 'Visual density', es: 'Densidad visual' }, v: { en: 'High', es: 'Alta' } }
        ]
      },
      {
        id: 'presence',
        tabLabel: { en: 'Presence', es: 'Presencia' },
        eyebrow: { en: 'Presence', es: 'Presencia' },
        title: { en: 'Presence becomes response.', es: 'La presencia se convierte en respuesta.' },
        description: {
          en: 'The guest’s silhouette opens, attracts and displaces the visual field in real time.',
          es: 'La silueta del huésped abre, atrae y desplaza el campo visual en tiempo real.'
        },
        mappingLabel: { en: 'PRESENCE → RESPONSE', es: 'PRESENCIA → RESPUESTA' },
        mediaSrc: 'img/data-art.mp4',
        posterSrc: 'img/data-art-poster.jpg',
        mediaAlt: {
          en: 'Concept visualization — a guest silhouette opens the particle field on a lobby wall',
          es: 'Visualización conceptual — la silueta de un huésped abre el campo de partículas en un muro del lobby'
        },
        accentColor: '#E8D4B0',
        relevantData: [
          { k: { en: 'Tracking active', es: 'Tracking activo' }, v: { en: 'On', es: 'Activo' } },
          { k: { en: 'Presence detected', es: 'Presencia detectada' }, v: { en: '1', es: '1' } },
          { k: { en: 'Visual response', es: 'Respuesta visual' }, v: { en: 'Open', es: 'Abierta' } }
        ]
      }
    ];

    var byId = {};
    DATA_STATES.forEach(function (s) { byId[s.id] = s; });
    var activeId = 'tide';
    var front = 0;
    var imgs = [imgA, imgB];
    var preloaded = {};
    var mx = 0.50, my = 0.56;
    var modeIdx = 0;
    var ticking = false;

    function loc(pack) {
      if (!pack) return '';
      if (typeof pack === 'string') return pack;
      return pack[lang] || pack.en || '';
    }

    function preloadPoster(src) {
      if (!src || preloaded[src]) return;
      preloaded[src] = true;
      var im = new Image();
      im.src = src;
    }

    function neighborId(id) {
      var i = DATA_STATES.findIndex(function (s) { return s.id === id; });
      if (i < 0) return 'wind';
      return DATA_STATES[Math.min(DATA_STATES.length - 1, i + 1)].id;
    }

    function stopVideo() {
      if (!vid) return;
      vid.pause();
      vid.classList.remove('is-on');
      if (vid.getAttribute('src')) {
        vid.removeAttribute('src');
        vid.load();
      }
    }

    function playVideo(src, poster) {
      if (!vid || reduced || !src) { stopVideo(); return; }
      vid.poster = poster || '';
      if (vid.getAttribute('src') !== src) {
        vid.setAttribute('src', src);
        vid.load();
      }
      vid.muted = true;
      vid.loop = true;
      try { vid.playbackRate = 0.6; } catch (e) {}
      var go = function () {
        try { vid.playbackRate = 0.6; } catch (e2) {}
        vid.classList.add('is-on');
        vid.play().catch(function () {});
      };
      if (vid.readyState >= 2) go();
      else vid.addEventListener('loadeddata', go, { once: true });
    }

    function renderCopy(state) {
      var map = loc(state.mappingLabel);
      if (mapHud) mapHud.textContent = map;
      if (mapInline) mapInline.textContent = map;
      if (titleEl) titleEl.textContent = loc(state.title);
      if (descEl) descEl.textContent = loc(state.description);
      var dict = I18N[lang] || I18N.en;
      if (simEl) simEl.textContent = state.id === 'presence' ? (dict.d_concept_mode || 'Concept mode') : (dict.d_sim || 'Concept data');
      if (metricsEl) {
        metricsEl.innerHTML = state.relevantData.map(function (row) {
          return '<div><dt>' + loc(row.k) + '</dt><dd>' + loc(row.v) + '</dd></div>';
        }).join('');
      }
    }

    function setMedia(state) {
      var next = 1 - front;
      var incoming = imgs[next];
      var outgoing = imgs[front];
      if (incoming) {
        incoming.src = state.posterSrc;
        incoming.alt = loc(state.mediaAlt);
        incoming.removeAttribute('aria-hidden');
        incoming.classList.add('is-on');
      }
      if (outgoing && outgoing !== incoming) {
        outgoing.classList.remove('is-on');
        outgoing.setAttribute('aria-hidden', 'true');
        outgoing.alt = '';
      }
      front = next;
      if (state.mediaSrc && !reduced) playVideo(state.mediaSrc, state.posterSrc);
      else stopVideo();
      preloadPoster(byId[neighborId(state.id)].posterSrc);
    }

    function applyState(id, mode) {
      var state = byId[id] || DATA_STATES[0];
      var changed = state.id !== activeId;
      activeId = state.id;
      modeIdx = DATA_STATES.indexOf(state);
      section.style.setProperty('--data-accent', state.accentColor);
      stage.setAttribute('data-mode', state.id);
      stage.setAttribute('aria-labelledby', 'tab-' + state.id);
      tabs.forEach(function (tab) {
        var on = tab.getAttribute('data-state') === state.id;
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.tabIndex = on ? 0 : -1;
      });
      renderCopy(state);
      if (mode === 'lang-only') {
        if (imgs[front]) imgs[front].alt = loc(state.mediaAlt);
        return;
      }
      if (mode === 'init') {
        preloadPoster(byId[neighborId(state.id)].posterSrc);
        return;
      }
      if (changed) setMedia(state);
    }

    function activateTab(tab, focus) {
      if (!tab) return;
      applyState(tab.getAttribute('data-state'), true);
      if (focus) tab.focus();
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () { activateTab(tab, false); });
    });

    if (tablist) {
      tablist.addEventListener('keydown', function (e) {
        var i = tabs.indexOf(document.activeElement);
        if (i < 0) i = tabs.findIndex(function (t) { return t.getAttribute('aria-selected') === 'true'; });
        var next = i;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = tabs.length - 1;
        else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activateTab(tabs[i], false);
          return;
        } else return;
        e.preventDefault();
        activateTab(tabs[next], true);
      });
    }

    window.__dataArtRefresh = function () { applyState(activeId, 'lang-only'); };

    applyState('tide', 'init');

    if (!canvas || reduced) return;

    var ctx = canvas.getContext('2d');
    var dpr = Math.min(1.5, window.devicePixelRatio || 1);
    var pts = [];
    var n = mqNarrow.matches ? 72 : 120;
    var running = true, visible = false;
    var clusters = [
      { x: 0.32, y: 0.38 },
      { x: 0.68, y: 0.42 },
      { x: 0.50, y: 0.62 }
    ];

    function resize() {
      var r = canvas.getBoundingClientRect();
      var w = Math.max(1, r.width), h = Math.max(1, r.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      pts = [];
      for (var i = 0; i < n; i++) {
        pts.push({
          x: Math.random(), y: Math.random(),
          vx: 0, vy: 0,
          r: 0.7 + Math.random() * 1.4,
          px: [], py: []
        });
      }
    }

    function tick() {
      ticking = false;
      if (!running || !visible) return;
      var cw = canvas.clientWidth, ch = canvas.clientHeight;
      ctx.clearRect(0, 0, cw, ch);
      var t = performance.now() * 0.00032;
      var id = activeId;
      var col = id === 'tide' ? [56, 196, 255]
        : id === 'wind' ? [186, 214, 230]
        : id === 'moon' ? [216, 204, 236]
        : [236, 216, 176];
      var breath = 1 + Math.sin(t * 0.85) * 0.28;
      var gx = 0.50 + (mx - 0.50) * 0.15;
      var gy = 0.56 + (my - 0.56) * 0.12;

      if (id === 'tide') {
        ctx.lineWidth = 1.35;
        for (var band = 0; band < 3; band++) {
          var baseY = 0.30 + band * 0.2 + Math.sin(t * 0.55 + band) * 0.018;
          ctx.strokeStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (0.16 + band * 0.03) + ')';
          ctx.beginPath();
          for (var sx = 0; sx <= 1.001; sx += 0.04) {
            var sy = baseY + Math.sin(sx * 7 + t * 0.65 + band) * 0.03 * breath;
            if (sx === 0) ctx.moveTo(sx * cw, sy * ch);
            else ctx.lineTo(sx * cw, sy * ch);
          }
          ctx.stroke();
        }
      }

      if (id === 'moon') {
        clusters[0].x = 0.34 + Math.sin(t * 0.35) * 0.06;
        clusters[0].y = 0.36 + Math.cos(t * 0.28) * 0.05;
        clusters[1].x = 0.70 + Math.cos(t * 0.3) * 0.05;
        clusters[1].y = 0.44 + Math.sin(t * 0.24) * 0.05;
        clusters[2].x = 0.50 + Math.sin(t * 0.2) * 0.04;
        clusters[2].y = 0.64 + Math.cos(t * 0.22) * 0.04;
      }

      for (var i = 0; i < pts.length; i++) {
        var a = pts[i];
        if (id === 'tide') {
          a.vx += Math.sin(t * 0.55 + a.y * 6) * 0.00009;
          a.vy += Math.sin(t * 0.7 + a.x * 5 + i * 0.04) * 0.00011;
          a.vx *= 0.94; a.vy *= 0.94;
        } else if (id === 'wind') {
          var gust = 0.00022 + Math.max(0, Math.sin(t * 0.9 + a.y * 3)) * 0.00028;
          a.vx += gust;
          a.vy += Math.sin(t * 0.5 + i) * 0.00004;
          a.vx *= 0.985; a.vy *= 0.92;
        } else if (id === 'moon') {
          var c = clusters[i % 3];
          a.vx += (c.x - a.x) * 0.00055;
          a.vy += (c.y - a.y) * 0.00055;
          a.vx *= 0.93; a.vy *= 0.93;
        } else {
          var dx = a.x - gx, dy = (a.y - gy) * 1.7;
          var d2 = dx * dx + dy * dy;
          if (d2 < 0.018) {
            var inv = 1 / Math.max(0.004, Math.sqrt(d2));
            a.vx += dx * inv * 0.00055;
            a.vy += dy * inv * 0.00055;
          } else if (d2 < 0.08) {
            a.vx += -dy * 0.00035;
            a.vy += dx * 0.00018;
          }
          a.vx *= 0.94; a.vy *= 0.94;
        }
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < -0.05) a.x = 1.05;
        if (a.x > 1.05) a.x = -0.05;
        if (a.y < -0.05) a.y = 1.05;
        if (a.y > 1.05) a.y = -0.05;

        a.px.push(a.x); a.py.push(a.y);
        if (a.px.length > 6) { a.px.shift(); a.py.shift(); }

        var rad = a.r * (id === 'tide' ? 2.05 * breath : id === 'moon' ? 1.15 : id === 'presence' ? 1.25 : 1.15);
        if (id === 'wind' && a.px.length > 1) {
          ctx.strokeStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',0.28)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(a.px[0] * cw, a.py[0] * ch);
          for (var p = 1; p < a.px.length; p++) ctx.lineTo(a.px[p] * cw, a.py[p] * ch);
          ctx.stroke();
        }
        ctx.fillStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (id === 'moon' ? 0.28 + a.r * 0.12 : 0.42 + a.r * 0.16) + ')';
        ctx.beginPath();
        ctx.arc(a.x * cw, a.y * ch, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ticking = true;
      requestAnimationFrame(tick);
    }

    function ensureTick() {
      if (!ticking && running && visible) {
        ticking = true;
        requestAnimationFrame(tick);
      }
    }

    stage.addEventListener('pointermove', function (e) {
      var r = stage.getBoundingClientRect();
      mx = (e.clientX - r.left) / Math.max(1, r.width);
      my = (e.clientY - r.top) / Math.max(1, r.height);
    }, { passive: true });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        visible = !!(entries[0] && entries[0].isIntersecting);
        if (visible) {
          ensureTick();
          if (activeId === 'presence' && vid && vid.getAttribute('src')) {
            try { vid.playbackRate = 0.6; } catch (e3) {}
            vid.play().catch(function () {});
          }
        } else if (vid) vid.pause();
      }, { rootMargin: '80px 0px', threshold: 0.08 });
      io.observe(stage);
    } else {
      visible = true;
    }
    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
      if (running && visible) ensureTick();
      else if (vid && document.hidden) vid.pause();
    });
    window.addEventListener('resize', resize, { passive: true });
    resize();
    seed();
    ensureTick();
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
    var vids = $$('.proof .lazy-vid, .story .lazy-vid');
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
