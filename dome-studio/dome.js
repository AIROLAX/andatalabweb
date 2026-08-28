(function () {
  'use strict';
  var LANG_KEY = 'andata_lang';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var weak = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4 && navigator.deviceMemory && navigator.deviceMemory <= 4);
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  var PROGRAMS = [
    { src: 'img/dome-whale-concept.jpg', acc: '#3CDCFF', t: 'c1_t', d: 'c1_d', cat: 'c1_cat', k1: 'c1_k1', k2: 'c1_k2', k3: 'c1_k3', live: false },
    { src: 'img/dome-memory-concept.jpg', acc: '#FF2E8A', t: 'c2_t', d: 'c2_d', cat: 'c2_cat', k1: 'c2_k1', k2: 'c2_k2', k3: 'c2_k3', live: false },
    { src: 'img/dome-destination-pv.jpg', acc: '#FF8A3C', t: 'c3_t', d: 'c3_d', cat: 'c3_cat', k1: 'c3_k1', k2: 'c3_k2', k3: 'c3_k3', live: false },
    { src: 'img/dome-data-experience.jpg', acc: '#9b7aff', t: 'c4_t', d: 'c4_d', cat: 'c4_cat', k1: 'c4_k1', k2: 'c4_k2', k3: 'c4_k3', live: true }
  ];

  var I18N = {
    en: {
      nav_work: 'Work', nav_hosp: 'Hospitality', nav_cta: 'Design a pilot', nav_home: 'Home', nav_contact: 'Contact',
      h_t1: 'One dome.', h_t2: 'Many reasons to return.',
      h_sub: 'Immersive content, live data and audience interaction—programmed to keep one venue changing.',
      h_hint: 'Drag to look around · Select a program',
      h_cta1: 'Explore the program', h_cta2: 'Design a pilot',
      c1_t: 'Journey of the Whales', c1_cat: 'Immersive story',
      c1_d: 'Monumental whales, spatial sound and environmental data turn the dome into a living ocean.',
      c1_k1: 'Ocean', c1_k2: 'Spatial audio', c1_k3: 'Environmental data',
      c2_t: 'Living Memory', c2_cat: 'Participatory experience',
      c2_d: 'A contemporary ritual of shared portraits, marigold, light and sound.',
      c2_k1: 'Participation', c2_k2: 'Opt-in portraits', c2_k3: 'Collective memory',
      c3_t: 'The Living Destination', c3_cat: 'Cultural tourism',
      c3_d: 'The territory told through drone, landscape, architecture and local culture.',
      c3_k1: 'Drone capture', c3_k2: 'Place identity', c3_k3: 'Destination',
      c4_t: 'Data Dome', c4_cat: 'Live data art',
      c4_d: 'Weather, tide and presence composed into a show that never repeats.',
      c4_k1: 'Live data', c4_k2: 'Generative', c4_k3: 'Never twice',
      live_t: 'Live inputs', live_v: 'Weather · Tide · Audience', live_n: 'Illustrative data feed',
      ph: 'Conceptual visualization',
      o1: 'Content worlds', o2: 'Fulldome format', o3: 'Systems', o4: 'Required',
      p_eye: 'Programming', p_t: 'One venue. A different reason to enter all day.',
      p_p: 'Sample programming model. Final programming adapts to each venue.',
      s1_t: 'Journey of the Whales', s1_a: 'Schools · Families · Immersive story', s1_k: 'Scheduled',
      s2_t: 'Data Dome', s2_a: 'Live data · Educational · Generative', s2_k: 'Generative',
      s3_t: 'The Living Destination', s3_a: 'Tourism · Groups · Destination storytelling', s3_k: 'Scheduled',
      s4_t: 'Living Memory / Live Dome', s4_a: 'Participatory · Performance · Private event', s4_k: 'Interactive',
      r_eye: 'System', r_t: 'How the space responds.',
      r_p: 'Guests, cameras and a real-time engine — without an app.',
      n1: 'Guest', n2: 'Camera / depth sensor', n3: 'Real-time engine', n4: 'Dome response',
      cam1: 'Opt-in portrait capture', cam2: 'Body and zone tracking', cam3: 'Live operation', cam4: 'Fulldome projection',
      r_note: 'Conceptual system layout. Final sensor and camera configuration depends on venue geometry.',
      ev1: 'Capture station', ev2: 'Participatory kiosk', ev3: 'Live control',
      pr_eye: 'Proof', pr_t: 'Built from systems we already run.',
      pr_p: 'Interactive installations, calibrated surfaces and real-time engines—the same foundation behind Dome Studio.',
      pr_del: 'Delivered project',
      pr1_c: 'Interactive · Mexico City', pr1: 'Presence drives a multi-screen room.',
      pr2_c: 'Museum · Aguascalientes', pr2: 'Motion-tracked rooms for general audiences.',
      pr3_c: 'Mapping · Jalisco', pr3: 'Projection calibrated to complex architecture.',
      see: 'View project',
      st_eye: 'Stack', st_t: 'Four systems. One venue.',
      st1: 'Fulldome · Domemaster · Adaptation',
      st2: 'Depth cameras · Sensors · Kiosks',
      st3: 'TouchDesigner · Generative visuals · Live data',
      st4: 'Spatial audio · DMX · Show control · Programming',
      st1_d: 'Pieces designed to wrap the audience, produced or adapted per venue.',
      st2_d: 'Presence becomes image. Opt-in capture, depth tracking, kiosks — no app.',
      st3_d: 'A live engine that can follow weather, tide, music or an operator.',
      st4_d: 'Sound, light and calendar around the same projection surface.',
      in_t: 'Inputs', out_t: 'Outputs',
      st1_i: 'Brief, venue geometry, existing media', st1_o: 'Domemaster masters, seasonal cuts',
      st2_i: 'Silhouette, zone, opt-in portrait', st2_o: 'Interactive layers in the dome',
      st3_i: 'Sensors, operators, public datasets', st3_o: 'Generative and live image',
      st4_i: 'Show file, lighting plot, hours', st4_o: 'A day that can be programmed',
      cta_eye: 'Pilot', cta_t: 'Start with one signature program.',
      cta_p: 'Build the calendar from there.',
      cta_1: 'Design a dome pilot', cta_2: 'Tell us about your venue',
      label_email: 'Email', label_based: 'Based', label_reply: 'Reply',
      based: 'Mexico · working worldwide', reply: '24–48 hours', rights: 'All rights reserved.',
      doc_title: 'Dome Content, Interactivity & Programming | ANDATA DOME STUDIO'
    },
    es: {
      nav_work: 'Proyectos', nav_hosp: 'Hospitality', nav_cta: 'Diseñar un piloto', nav_home: 'Inicio', nav_contact: 'Contacto',
      h_t1: 'Un domo.', h_t2: 'Muchas razones para volver.',
      h_sub: 'Contenido inmersivo, datos en vivo e interacción con el público, programados para mantener un mismo espacio en constante cambio.',
      h_hint: 'Arrastra para mirar alrededor · Selecciona un programa',
      h_cta1: 'Explorar programación', h_cta2: 'Diseñar un piloto',
      c1_t: 'Viaje de las Ballenas', c1_cat: 'Historia inmersiva',
      c1_d: 'Ballenas monumentales, audio espacial y datos ambientales convierten el domo en un océano vivo.',
      c1_k1: 'Océano', c1_k2: 'Audio espacial', c1_k3: 'Datos ambientales',
      c2_t: 'Memoria Viva', c2_cat: 'Experiencia participativa',
      c2_d: 'Un rito contemporáneo de retratos compartidos, cempasúchil, luz y sonido.',
      c2_k1: 'Participación', c2_k2: 'Retratos voluntarios', c2_k3: 'Memoria colectiva',
      c3_t: 'El Destino Vivo', c3_cat: 'Turismo cultural',
      c3_d: 'El territorio contado con dron, paisaje, arquitectura y cultura local.',
      c3_k1: 'Captura con dron', c3_k2: 'Identidad del lugar', c3_k3: 'Destino',
      c4_t: 'Data Dome', c4_cat: 'Data art en vivo',
      c4_d: 'Clima, marea y presencia compuestos en una función que no se repite.',
      c4_k1: 'Datos en vivo', c4_k2: 'Generativo', c4_k3: 'Nunca igual',
      live_t: 'Entradas en vivo', live_v: 'Clima · Marea · Público', live_n: 'Señal ilustrativa',
      ph: 'Visualización conceptual',
      o1: 'Mundos de contenido', o2: 'Formato fulldome', o3: 'Sistemas', o4: 'Necesaria',
      p_eye: 'Programación', p_t: 'Un mismo espacio. Una razón diferente para entrar todo el día.',
      p_p: 'Modelo ilustrativo de programación. El programa final se adapta a cada recinto.',
      s1_t: 'Viaje de las Ballenas', s1_a: 'Escuelas · Familias · Historia inmersiva', s1_k: 'Programado',
      s2_t: 'Data Dome', s2_a: 'Datos en vivo · Educativo · Generativo', s2_k: 'Generativo',
      s3_t: 'El Destino Vivo', s3_a: 'Turismo · Grupos · Relato del destino', s3_k: 'Programado',
      s4_t: 'Memoria Viva / Live Dome', s4_a: 'Participativo · Performance · Evento privado', s4_k: 'Interactivo',
      r_eye: 'Sistema', r_t: 'Cómo responde el espacio.',
      r_p: 'Huéspedes, cámaras y un motor en tiempo real — sin app.',
      n1: 'Huésped', n2: 'Cámara / sensor de profundidad', n3: 'Motor en tiempo real', n4: 'Respuesta del domo',
      cam1: 'Captura voluntaria de retrato', cam2: 'Tracking de cuerpo y zona', cam3: 'Operación en vivo', cam4: 'Proyección fulldome',
      r_note: 'Plano conceptual. La configuración final de sensores y cámaras depende de la geometría del recinto.',
      ev1: 'Estación de captura', ev2: 'Kiosco participativo', ev3: 'Control en vivo',
      pr_eye: 'Prueba', pr_t: 'Construido con sistemas que ya operamos.',
      pr_p: 'Instalaciones interactivas, superficies calibradas y motores en tiempo real — la misma base de Dome Studio.',
      pr_del: 'Proyecto realizado',
      pr1_c: 'Interactivo · Ciudad de México', pr1: 'La presencia mueve una sala multi-pantalla.',
      pr2_c: 'Museo · Aguascalientes', pr2: 'Salas con seguimiento de movimiento para público general.',
      pr3_c: 'Mapping · Jalisco', pr3: 'Proyección calibrada sobre arquitectura compleja.',
      see: 'Ver proyecto',
      st_eye: 'Stack', st_t: 'Cuatro sistemas. Un recinto.',
      st1: 'Fulldome · Domemaster · Adaptación',
      st2: 'Cámaras de profundidad · Sensores · Kioscos',
      st3: 'TouchDesigner · Visuales generativos · Datos en vivo',
      st4: 'Audio espacial · DMX · Show control · Programación',
      st1_d: 'Piezas diseñadas para envolver al público, producidas o adaptadas por recinto.',
      st2_d: 'La presencia se vuelve imagen. Captura voluntaria, tracking, kioscos — sin app.',
      st3_d: 'Un motor en vivo que puede seguir clima, marea, música o un operador.',
      st4_d: 'Sonido, luz y calendario alrededor de la misma superficie.',
      in_t: 'Entradas', out_t: 'Salidas',
      st1_i: 'Brief, geometría, media existente', st1_o: 'Masters domemaster, cortes de temporada',
      st2_i: 'Silueta, zona, retrato voluntario', st2_o: 'Capas interactivas en el domo',
      st3_i: 'Sensores, operadores, datasets públicos', st3_o: 'Imagen generativa y en vivo',
      st4_i: 'Show file, plano de luces, horario', st4_o: 'Un día que se puede programar',
      cta_eye: 'Piloto', cta_t: 'Empecemos con un programa emblemático.',
      cta_p: 'A partir de ahí construimos el calendario.',
      cta_1: 'Diseñar un piloto', cta_2: 'Cuéntanos sobre tu recinto',
      label_email: 'Correo', label_based: 'Ubicación', label_reply: 'Respuesta',
      based: 'México · trabajamos en todo el mundo', reply: '24–48 horas', rights: 'Todos los derechos reservados.',
      doc_title: 'Contenido, interactividad y programación para domos | ANDATA DOME STUDIO'
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
  var dict = function () { return I18N[lang] || I18N.en; };

  function applyLang() {
    var d = dict();
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(function (node) {
      var k = node.getAttribute('data-i18n');
      if (d[k] != null) node.innerHTML = d[k];
    });
    if (d.doc_title) document.title = d.doc_title;
    var btn = $('#lang-toggle');
    if (btn) {
      btn.textContent = (lang === 'en') ? 'ES' : 'EN';
      btn.setAttribute('aria-label', lang === 'en' ? 'Cambiar a español' : 'Switch to English');
    }
    paintProgram(active);
    paintSlot(slotIndex);
    paintStack(stackIndex);
    setCam(camIndex);
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
      if (dome && dome.setEnter) {
        dome.setEnter(Math.min(1, y / Math.max(1, window.innerHeight * 0.35)));
      }
    }
    function onScroll() { if (!queued) { queued = true; requestAnimationFrame(frame); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    frame();
  })();

  var active = 0;
  var dome = null;
  var fallback = $('#dome-fallback');
  var shell = $('#dome-shell');
  var canvas = $('#dome-gl');
  var canGL = canvas && !reduced && !saveData && !weak && window.THREE && window.DomeGL;

  function paintProgram(i) {
    var p = PROGRAMS[i];
    var d = dict();
    document.body.style.setProperty('--acc', p.acc);
    $$('#prog-tabs [role="tab"]').forEach(function (t, k) {
      t.setAttribute('aria-selected', k === i ? 'true' : 'false');
      t.tabIndex = k === i ? 0 : -1;
    });
    var desc = $('#prog-desc');
    if (desc) desc.textContent = d[p.d];
    var tags = $('#prog-tags');
    if (tags) {
      tags.innerHTML = '';
      [p.k1, p.k2, p.k3].forEach(function (key) {
        var s = document.createElement('span');
        s.className = 'tag';
        s.textContent = d[key];
        tags.appendChild(s);
      });
    }
    var live = $('#live-legend');
    if (live) live.classList.toggle('is-on', !!p.live);
    if (fallback) fallback.src = p.src;
    if (shell) shell.style.setProperty('--acc', p.acc);
  }

  function selectProgram(i, fromKey) {
    i = (i + PROGRAMS.length) % PROGRAMS.length;
    if (i === active && !fromKey) return;
    active = i;
    var p = PROGRAMS[i];
    paintProgram(i);
    if (dome && dome.setTexture) {
      dome.setAccent(p.acc);
      dome.setTexture(p.src);
    }
  }

  $$('#prog-tabs [role="tab"]').forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectProgram(i); });
    tab.addEventListener('keydown', function (e) {
      var next = i;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = i + 1;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = i - 1;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = PROGRAMS.length - 1;
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectProgram(i); return; }
      else return;
      e.preventDefault();
      selectProgram(next, true);
      var n = $$('#prog-tabs [role="tab"]')[active];
      if (n) n.focus();
    });
  });

  if (canGL) {
    dome = window.DomeGL(canvas, { reduced: reduced, stacks: window.innerWidth < 700 ? 20 : 28, slices: window.innerWidth < 700 ? 40 : 56 });
      if (dome && dome.ready) {
      dome.setAccent(PROGRAMS[0].acc);
      dome.setTexture(PROGRAMS[0].src).then(function () {
        shell.classList.add('is-gl');
        if (saveData) return;
        var idle = window.requestIdleCallback || function (fn) { setTimeout(fn, 600); };
        idle(function () {
          PROGRAMS.slice(1).forEach(function (p) { dome.preload(p.src); });
        });
      }).catch(function () { shell.classList.remove('is-gl'); });
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          dome.setVisible(entries[0] && entries[0].isIntersecting);
        }, { threshold: 0.05 });
        io.observe(shell);
      }
      (function drag() {
        var down = false, lx = 0, ly = 0;
        function start(x, y) { down = true; lx = x; ly = y; }
        function move(x, y) {
          if (!down) return;
          dome.look((x - lx) * 0.008, (ly - y) * 0.006);
          lx = x; ly = y;
        }
        shell.addEventListener('pointerdown', function (e) {
          shell.setPointerCapture(e.pointerId);
          start(e.clientX, e.clientY);
        });
        shell.addEventListener('pointermove', function (e) { move(e.clientX, e.clientY); });
        shell.addEventListener('pointerup', function () { down = false; });
        shell.addEventListener('pointercancel', function () { down = false; });
      })();
    } else {
      dome = null;
    }
  }

  var slotIndex = 0;
  var SLOTS = [
    { src: 'img/dome-whale-concept.jpg', t: 's1_t', a: 's1_a', k: 's1_k', acc: '#3CDCFF' },
    { src: 'img/dome-data-experience.jpg', t: 's2_t', a: 's2_a', k: 's2_k', acc: '#9b7aff' },
    { src: 'img/dome-destination-pv.jpg', t: 's3_t', a: 's3_a', k: 's3_k', acc: '#FF8A3C' },
    { src: 'img/dome-memory-concept.jpg', t: 's4_t', a: 's4_a', k: 's4_k', acc: '#FF2E8A' }
  ];
  function paintSlot(i) {
    var d = dict();
    var s = SLOTS[i];
    $$('.slot').forEach(function (el, k) {
      el.setAttribute('aria-selected', k === i ? 'true' : 'false');
      el.tabIndex = k === i ? 0 : -1;
    });
    var img = $('#slot-img');
    if (img) img.src = s.src;
    var title = $('#slot-title');
    if (title) title.textContent = d[s.t];
    var aud = $('#slot-aud');
    if (aud) aud.textContent = d[s.a] + ' · ' + d[s.k];
  }
  $$('.slot').forEach(function (el, i) {
    el.addEventListener('click', function () { slotIndex = i; paintSlot(i); });
    el.addEventListener('keydown', function (e) {
      var next = i;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = i + 1;
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = i - 1;
      else return;
      e.preventDefault();
      slotIndex = (next + SLOTS.length) % SLOTS.length;
      paintSlot(slotIndex);
      $$('.slot')[slotIndex].focus();
    });
  });

  var camIndex = 0;
  var setCam = function () {};
  (function plan() {
    var cones = $$('.cone');
    var cams = $$('.cam-hit');
    var note = $('#cam-note');
    var keys = ['cam1', 'cam2', 'cam3', 'cam4'];
    function set(i) {
      camIndex = i;
      cones.forEach(function (c, k) { c.classList.toggle('is-on', k === i); });
      cams.forEach(function (c, k) { c.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
      $$('.flow .node').forEach(function (n) { n.classList.remove('is-hot'); });
      var chain = $$('.flow .node');
      if (chain[Math.min(i + 1, chain.length - 1)]) chain[Math.min(i + 1, chain.length - 1)].classList.add('is-hot');
      if (note) note.textContent = dict()[keys[i]];
    }
    setCam = set;
    cams.forEach(function (c, i) {
      c.addEventListener('click', function () { set(i); });
      c.addEventListener('mouseenter', function () { set(i); });
      c.addEventListener('focus', function () { set(i); });
    });
    set(0);
  })();

  var stackIndex = 0;
  function paintStack(i) {
    var d = dict();
    $$('.layers button').forEach(function (b, k) { b.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
    var map = [
      { d: 'st1_d', i: 'st1_i', o: 'st1_o' },
      { d: 'st2_d', i: 'st2_i', o: 'st2_o' },
      { d: 'st3_d', i: 'st3_i', o: 'st3_o' },
      { d: 'st4_d', i: 'st4_i', o: 'st4_o' }
    ][i];
    var elD = $('#st-d'), elI = $('#st-i'), elO = $('#st-o');
    if (elD) elD.textContent = d[map.d];
    if (elI) elI.textContent = d[map.i];
    if (elO) elO.textContent = d[map.o];
  }
  $$('.layers button').forEach(function (b, i) {
    b.addEventListener('click', function () { stackIndex = i; paintStack(i); });
    b.addEventListener('keydown', function (e) {
      var next = i;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = i + 1;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = i - 1;
      else return;
      e.preventDefault();
      stackIndex = (next + 4) % 4;
      paintStack(stackIndex);
      $$('.layers button')[stackIndex].focus();
    });
  });

  applyLang();
  paintProgram(0);
  paintSlot(0);
  paintStack(0);
})();
