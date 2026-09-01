// ANDATA LAB — bilingual homepage content (EN / ES)
// Wired to the REAL assets (videos/, PROJECTS/, Imagenes/, logos/)
// app.js reads window.CONTENT[lang]. Assets are shared; only text differs.

(function () {
  // Shared, language-independent data
  var CLIENTS = [
    { name: 'Nissan', img: 'logos/1nissan.png' },
    { name: 'Gobierno de Chapala', img: 'logos/2.png' },
    { name: 'Museo Descubre', img: 'logos/museo-descubre.png' },
    { name: 'Edzná', img: 'logos/edzna.png' },
    { name: 'Gobierno de México', img: 'logos/gobierno-mexico.png' },
    { name: 'Conjunto Santander', img: 'logos/conjunto-santander-source.png' },
  ];

  // Per-service shared assets (image), text added per language
  // Background images for process steps (hover preview)
  var PROCESS_IMG = [
    'Imagenes/concepts/rubik-immersive.png', // 01 Concept — immersive brand concept
    'Imagenes/SHOW CONTROL.jpg',   // 02 Prototype — real-time tests
    'PROJECTS/7.jpg',                // 03 Build — staging & systems
    'Imagenes/deliver-04.jpg',       // 04 Deliver — on-site control / pink screen
  ];

  var SERVICE_IMG = [
    'Imagenes/chapala.png',        // 01 mapping (matches Ajijic work)
    'Imagenes/SHOW CONTROL.jpg',   // 02 real-time (matches TouchScreen work)
    'Imagenes/AI INSTA.jpg',       // 03 interactive
    'Imagenes/OHM2.png',             // 04 immersive — laser room install (not used in work grid)
    'Imagenes/concept-immersive.jpg', // 05 AI — poetic AI immersive concept
  ];

  var AI_CONCEPT = {
    video: 'videos/concept-immersive.mp4',
    videoMobile: 'videos/services-mobile/concept-immersive.mp4',
    poster: 'Imagenes/concept-immersive.jpg',
  };

  var IMMERSIVE_AV = {
    video: 'videos/immersive-audiovisual.mp4',
    videoMobile: 'videos/services-mobile/immersive-audiovisual.mp4',
    poster: 'Imagenes/immersive-audiovisual-poster.jpg',
  };

  var ARCHITECTURAL_MAPPING = {
    video: 'videos/architectural-mapping.mp4',
    videoMobile: 'videos/services-mobile/architectural-mapping.mp4',
    poster: 'Imagenes/architectural-mapping-poster.jpg',
  };

  var REAL_TIME_GENERATIVE = {
    video: 'videos/real-time-generative.mp4',
    videoMobile: 'videos/services-mobile/real-time-generative.mp4',
    poster: 'Imagenes/real-time-generative-poster.jpg',
  };

  var INTERACTIVE_INSTALLATIONS_SVC = {
    video: 'videos/interactive-service.mp4',
    videoMobile: 'videos/services-mobile/interactive-service.mp4',
    poster: 'Imagenes/interactive-service-poster.jpg',
  };

  var MULTI_SCREEN_INSTALL = {
    video: 'videos/multi-screen-installation.mp4',
    poster: 'Imagenes/multi-screen-installation-poster.jpg',
  };

  // Per-work shared assets (id, video, poster), text added per language
  var WORK_MEDIA = [
    { id: 'bio',    video: 'PROJECTS/0.mp4',                 poster: 'Imagenes/AI INSTA.jpg',     url: 'biointerface/' },
    { id: 'part',   video: 'videos/export11-lite.mp4',       poster: 'Imagenes/MOTION.png',       url: 'particle-system/' },
    { id: 'rtg',    video: REAL_TIME_GENERATIVE.video,       poster: REAL_TIME_GENERATIVE.poster, url: 'https://airolax.com/work/biointerface-2.html' },
    { id: 'wavey',  video: INTERACTIVE_INSTALLATIONS_SVC.video, poster: INTERACTIVE_INSTALLATIONS_SVC.poster },
    { id: 'ohm',   videos: ['videos/ohm-laser-arp.mp4', IMMERSIVE_AV.video], poster: 'Imagenes/OHM2.png', url: 'https://airolax.com/work/ohm-interactive-laser-sculpture.html' },
    { id: 'tollan', video: 'videos/tollan-inmersivo.mp4',    poster: 'Imagenes/tollan-inmersivo-poster.jpg', url: 'salamastache/' },
    { id: 'museo',  video: 'videos/10-lite.mp4',             poster: 'Imagenes/AUDIOVISUAL TECH.webp', url: 'museo-descubre/' },
    { id: 'ajijic', videos: ['PROJECTS/2.mp4', ARCHITECTURAL_MAPPING.video], poster: 'Imagenes/architectural-mapping-poster.jpg', url: 'ajijic-mapping/' },
    { id: 'touch',  video: 'PROJECTS/1.mp4',                 poster: 'Imagenes/SHOW CONTROL.jpg', url: 'https://airolax.com/work/thermosense.html' },
    { id: 'santander', video: 'videos/conjunto-santander.mp4', poster: 'Imagenes/conjunto-santander-poster.jpg', url: 'https://airolax.com/work/breathing-space.html' },
  ];

  function merge(mediaArr, textArr) {
    return mediaArr.map(function (m, i) {
      var t = textArr[i] || {};
      var out = {};
      for (var k in m) out[k] = m[k];
      for (var j in t) out[j] = t[j];
      return out;
    });
  }

  /* ===================== ENGLISH ===================== */
  var EN = {
    ui: {
      doc_title: 'ANDATA LAB | Immersive Experiences & Projection Mapping',
      meta_desc: 'ANDATA LAB is an experiential technology studio in Mexico. Immersive experiences, projection mapping, interactive installations and real-time audiovisual systems — worldwide.',
      nav_work: 'Work', nav_process: 'Process', nav_dome: 'Dome Studio', nav_hosp: 'Hospitality',
      cta_start: 'Start a project',
      hero_reel: 'Showreel 2026',
      hero_h1a: 'Immersive Experiences,', hero_h1b: 'Engineered.',
      hero_sub: 'Projection mapping, interactive installations, real-time 3D and immersive audiovisual systems for brands, museums, hospitality and cultural spaces.',
      hero_caps: 'Projection Mapping / Interactive Installations / Real-Time 3D / Generative & AI Visuals / Immersive Rooms / Spatial Audio / Sensor-Driven Systems',
      cta_work: 'View Work',
      scroll: 'Scroll',
      statement_lead: 'We design and build immersive experiences — projection mapping, interactive installations and real-time systems',
      statement_muted: 'for brands, museums, hospitality and cultural spaces. Experiential technology, concept to on-site, by one studio.',
      link_map: 'Architectural Projection Mapping',
      link_museum: 'Interactive Museum Exhibits',
      link_hosp: 'Permanent Immersive Hospitality Experiences',
      trust_label: 'Clients & venues',
      services_eyebrow: 'What we do', services_title: 'Built for spaces, audiences and stories.',
      work_eyebrow: 'Selected work', work_title: 'Built, staged and running.',
      process_eyebrow: 'How we work', process_title: 'One team, concept to on-site.',
      contact_title: "Let's build something unforgettable.",
      contact_lead: 'Tell us about the space, the audience and the idea. We scope, design and deliver end-to-end — and reply within 24–48 hours.',
      label_email: 'Email', label_based: 'Based', based_mexico: 'Mexico', based_worldwide: 'Working worldwide',
      ph_name: 'Name', ph_email: 'Email', ph_org: 'Organization (museum, brand, festival…)', ph_msg: 'The space, the audience, the timeline…',
      form_submit: 'Send project brief', form_sending: 'Sending…',
      form_thanks_h: 'Thanks — message received.', form_thanks_p: 'We reply within 24–48 hours.',
      form_fineprint: "No obligation — we'll tell you honestly if we're the right fit.",
      form_err_send: 'Please email us directly at airolaxx@gmail.com.',
      form_err_net: 'Network error. Please email us directly at airolaxx@gmail.com.',
      footer_copy: '© 2026 — Experiential Technology Studio · Mexico / Worldwide',
      lang_switch: 'ES',
    },
    clients: CLIENTS,
    services: [
      { n: '01', t: 'Architectural & Large-Scale Mapping', d: 'Facade and site-specific projection that turns buildings and heritage spaces into living canvases.', get: 'Concept · content · high-lumen staging · on-site calibration', video: ARCHITECTURAL_MAPPING.video, videoMobile: ARCHITECTURAL_MAPPING.videoMobile, poster: ARCHITECTURAL_MAPPING.poster },
      { n: '02', t: 'Real-Time & Generative Systems', d: 'TouchDesigner and custom engines that generate visuals live — reactive, never the same twice.', get: 'Engine build · generative content · show control', video: REAL_TIME_GENERATIVE.video, videoMobile: REAL_TIME_GENERATIVE.videoMobile, poster: REAL_TIME_GENERATIVE.poster },
      { n: '03', t: 'Interactive Installations', d: 'Sensor- and motion-driven environments where the audience becomes part of the artwork.', get: 'Interaction design · sensor systems · real-time behavior', video: INTERACTIVE_INSTALLATIONS_SVC.video, videoMobile: INTERACTIVE_INSTALLATIONS_SVC.videoMobile, poster: INTERACTIVE_INSTALLATIONS_SVC.poster },
      { n: '04', t: 'Immersive Audiovisual Environments', d: 'Full-room experiences uniting projection, spatial sound and lighting into one narrative.', get: 'Experiential direction · media integration · spatial audio', video: IMMERSIVE_AV.video, videoMobile: IMMERSIVE_AV.videoMobile, poster: IMMERSIVE_AV.poster },
    ],
    servicesAccent: { h: 'Not sure where it fits?', p: "Bring us the space and the ambition. We'll shape the rest.", btn: 'Book a call →' },
    work: merge(WORK_MEDIA, [
      { t: 'Biointerface',          client: 'Interactive Art Installation · Mexico City', outcome: 'Sensor-driven interactive system — real-time biometric data translated into living digital art.' },
      { t: 'Particle System Art',    client: 'Generative Art Work',                        outcome: 'Bioluminescent fluid dynamics rendered as real-time generative art.' },
      { t: 'Real-Time & Generative Systems', client: 'Generative Systems · Multi-Screen', outcome: 'TouchDesigner and custom engines generating live visuals across a multi-screen installation — reactive, never the same twice.' },
      { t: 'Mirror Noise',           client: 'Interactive Mirror Installation',            outcome: 'A sensor-driven mirror where the audience becomes part of the artwork — noise, reflection and live behavior.' },
      { t: 'Ohm Sound Laser Sculpture', client: 'Immersive Laser Installation',            outcome: 'A circular chamber of laser light, spatial sound and projection — a full-room audiovisual sculpture experienced in the round.' },
      { t: 'Tollan Inmersivo',      client: 'Immersive Interpretation Room · Tula, Hidalgo', outcome: 'El Viaje del Héroe Tolteca — a five-act journey through Toltec civilization with 360° projection, kinetic interactives, immersive tunnel and VR.' },
      { t: 'Museo Descubre',         client: 'Interactive Museum Exhibits · Aguascalientes',        outcome: 'Museum exhibit design with sensor-driven walls and motion-tracked rooms.' },
      { t: 'Whispers of the Lake',   client: 'Architectural Projection Mapping · Chapala, Mexico', outcome: 'Site-specific 3D projection mapping on a historic facade — TouchDesigner playback, spatial audio and on-site calibration.' },
      { t: 'Volumetric TouchScreen', client: 'Interactive Display · Mexico City',         outcome: 'A spatial, touch-driven narrative on a volumetric display.' },
      { t: 'Conjunto Santander',     client: 'Real-Time Generative Systems · Puebla',      outcome: 'A generative light column and floor grid for a live wellness experience — visuals driven in real time for Conjunto Santander.' },
    ]),
    process: [
      { n: '01', t: 'Concept', d: 'We start with the space, the audience and the story — then design the experience around them.', img: PROCESS_IMG[0] },
      { n: '02', t: 'Prototype', d: 'Real-time tests and visual studies so you see the idea moving before we build at scale.', img: PROCESS_IMG[1] },
      { n: '03', t: 'Build', d: 'Generative systems, content and hardware engineered to run reliably, night after night.', img: PROCESS_IMG[2] },
      { n: '04', t: 'Deliver', d: 'On-site staging, calibration and technical direction. We are there until it runs perfectly.', img: PROCESS_IMG[3] },
    ],
  };

  /* ===================== ESPAÑOL ===================== */
  var ES = {
    ui: {
      doc_title: 'ANDATA LAB | Experiencias inmersivas y projection mapping',
      meta_desc: 'ANDATA LAB es un estudio de tecnología experiencial en México. Experiencias inmersivas, projection mapping, instalaciones interactivas y sistemas audiovisuales en tiempo real.',
      nav_work: 'Proyectos', nav_process: 'Proceso', nav_dome: 'Dome Studio', nav_hosp: 'Hospitality',
      cta_start: 'Inicia un proyecto',
      hero_reel: 'Showreel 2026',
      hero_h1a: 'Experiencias inmersivas,', hero_h1b: 'con ingeniería.',
      hero_sub: 'Projection mapping, instalaciones interactivas, 3D en tiempo real y sistemas audiovisuales inmersivos para marcas, museos, hospitality y espacios culturales.',
      hero_caps: 'Projection Mapping / Instalaciones interactivas / 3D en tiempo real / Visuales generativos e IA / Salas inmersivas / Audio espacial / Sistemas con sensores',
      cta_work: 'Ver proyectos',
      scroll: 'Desliza',
      statement_lead: 'Diseñamos y construimos experiencias inmersivas — projection mapping, instalaciones interactivas y sistemas en tiempo real',
      statement_muted: 'para marcas, museos, hospitality y espacios culturales. Tecnología experiencial, del concepto al sitio, por un solo estudio.',
      link_map: 'Videomapping arquitectónico',
      link_museum: 'Exhibiciones interactivas de museo',
      link_hosp: 'Hospitality inmersivo permanente',
      trust_label: 'Clientes y sedes',
      services_eyebrow: 'Qué hacemos', services_title: 'Hecho para espacios, audiencias e historias.',
      work_eyebrow: 'Trabajo seleccionado', work_title: 'Construido, montado y en marcha.',
      process_eyebrow: 'Cómo trabajamos', process_title: 'Un solo equipo, del concepto al sitio.',
      contact_title: 'Construyamos algo inolvidable.',
      contact_lead: 'Cuéntanos sobre el espacio, la audiencia y la idea. Definimos, diseñamos y entregamos de principio a fin — y respondemos en 24–48 horas.',
      label_email: 'Correo', label_based: 'Ubicación', based_mexico: 'México', based_worldwide: 'Trabajamos en todo el mundo',
      ph_name: 'Nombre', ph_email: 'Correo', ph_org: 'Organización (museo, marca, festival…)', ph_msg: 'El espacio, la audiencia, los tiempos…',
      form_submit: 'Enviar brief del proyecto', form_sending: 'Enviando…',
      form_thanks_h: 'Gracias — mensaje recibido.', form_thanks_p: 'Respondemos en 24–48 horas.',
      form_fineprint: 'Sin compromiso — te diremos con honestidad si somos el equipo indicado.',
      form_err_send: 'Por favor escríbenos directo a airolaxx@gmail.com.',
      form_err_net: 'Error de red. Por favor escríbenos directo a airolaxx@gmail.com.',
      footer_copy: '© 2026 — Estudio de tecnología experiencial · México / todo el mundo',
      lang_switch: 'EN',
    },
    clients: CLIENTS,
    services: [
      { n: '01', t: 'Videomapping Arquitectónico y de Gran Escala', d: 'Proyección en fachadas y sitios específicos que convierte edificios y espacios patrimoniales en lienzos vivos.', get: 'Concepto · contenido · montaje de alta luminosidad · calibración en sitio', video: ARCHITECTURAL_MAPPING.video, videoMobile: ARCHITECTURAL_MAPPING.videoMobile, poster: ARCHITECTURAL_MAPPING.poster },
      { n: '02', t: 'Sistemas Generativos y en Tiempo Real', d: 'TouchDesigner y motores a medida que generan visuales en vivo — reactivos, nunca iguales dos veces.', get: 'Desarrollo de motor · contenido generativo · show control', video: REAL_TIME_GENERATIVE.video, videoMobile: REAL_TIME_GENERATIVE.videoMobile, poster: REAL_TIME_GENERATIVE.poster },
      { n: '03', t: 'Instalaciones Interactivas', d: 'Entornos accionados por sensores y movimiento donde la audiencia se vuelve parte de la obra.', get: 'Diseño de interacción · sistemas de sensores · comportamiento en tiempo real', video: INTERACTIVE_INSTALLATIONS_SVC.video, videoMobile: INTERACTIVE_INSTALLATIONS_SVC.videoMobile, poster: INTERACTIVE_INSTALLATIONS_SVC.poster },
      { n: '04', t: 'Entornos Audiovisuales Inmersivos', d: 'Experiencias de sala completa que unen proyección, sonido espacial e iluminación en una sola narrativa.', get: 'Dirección experiencial · integración de medios · audio espacial', video: IMMERSIVE_AV.video, videoMobile: IMMERSIVE_AV.videoMobile, poster: IMMERSIVE_AV.poster },
    ],
    servicesAccent: { h: '¿No sabes dónde encaja?', p: 'Tráenos el espacio y la ambición. Nosotros damos forma al resto.', btn: 'Agenda una llamada →' },
    work: merge(WORK_MEDIA, [
      { t: 'Biointerfaz',                   client: 'Instalación de arte interactivo · Ciudad de México', outcome: 'Sistema interactivo con sensores — datos biométricos en tiempo real traducidos en arte digital vivo.' },
      { t: 'Particle System Art',           client: 'Obra de Arte Generativo',                         outcome: 'Dinámica de fluidos bioluminiscente renderizada como arte generativo en tiempo real.' },
      { t: 'Sistemas Generativos y en Tiempo Real', client: 'Sistemas Generativos · Multi-Pantalla', outcome: 'TouchDesigner y motores a medida generando visuales en vivo en una instalación multi-pantalla — reactivos, nunca iguales dos veces.' },
      { t: 'Mirror Noise',                  client: 'Instalación de espejo interactivo',                 outcome: 'Un espejo con sensores donde la audiencia se vuelve parte de la obra — ruido, reflejo y comportamiento en vivo.' },
      { t: 'Ohm Sound Laser Sculpture',     client: 'Instalación Láser Inmersiva',                       outcome: 'Una cámara circular de luz láser, sonido espacial y proyección — una escultura audiovisual de sala completa vivida desde adentro.' },
      { t: 'Tollan Inmersivo',              client: 'Sala de Interpretación Guadalupe Mastache · Tula, Hidalgo', outcome: 'El Viaje del Héroe Tolteca — cinco actos que recorren cosmos, apogeo, caída y trascendencia con proyección 360°, túnel inmersivo y VR.' },
      { t: 'Museo Descubre',                client: 'Exhibiciones interactivas de museo · Aguascalientes',                outcome: 'Diseño de exhibiciones con muros de sensores y salas con seguimiento de movimiento.' },
      { t: 'Whispers of the Lake',          client: 'Videomapping arquitectónico · Chapala, México', outcome: 'Projection mapping 3D de sitio específico sobre una fachada histórica — reproducción en TouchDesigner, audio espacial y calibración en sitio.' },
      { t: 'Pantalla Táctil Volumétrica',   client: 'Pantalla Interactiva · Ciudad de México',           outcome: 'Una narrativa espacial y táctil en una pantalla volumétrica.' },
      { t: 'Conjunto Santander',            client: 'Sistemas Generativos en Tiempo Real · Puebla',      outcome: 'Columna de luz generativa y piso en grid para una experiencia de bienestar en vivo — visuales en tiempo real para Conjunto Santander.' },
    ]),
    process: [
      { n: '01', t: 'Concepto', d: 'Partimos del espacio, la audiencia y la historia — y diseñamos la experiencia en torno a ellos.', img: PROCESS_IMG[0] },
      { n: '02', t: 'Prototipo', d: 'Pruebas en tiempo real y estudios visuales para que veas la idea en movimiento antes de construir a escala.', img: PROCESS_IMG[1] },
      { n: '03', t: 'Construcción', d: 'Sistemas generativos, contenido y hardware diseñados para funcionar de forma confiable, noche tras noche.', img: PROCESS_IMG[2] },
      { n: '04', t: 'Entrega', d: 'Montaje en sitio, calibración y dirección técnica. Estamos ahí hasta que funcione a la perfección.', img: PROCESS_IMG[3] },
    ],
  };

  window.CONTENT = { en: EN, es: ES };
})();
