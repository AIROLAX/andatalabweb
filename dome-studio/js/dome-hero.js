/**
 * ANDATA DOME STUDIO — Hero 3D dome
 * -----------------------------------------------------------------------------
 * Isolated WebGL scene for the landing hero. Safe to delete this file (and the
 * matching <canvas id="orb-webgl">) without breaking the rest of the page:
 * the existing CSS orb + stills take over via window.__initDomeOrbFallback.
 *
 * Stack: vanilla ES module + Three.js 0.160 from the same CDN import-map used
 * on index-immersive.html. No extra frameworks.
 *
 * What it draws: a landing-sized 3D hemisphere. The show is mapped on the
 * outside (over the blue meridians) and inside, with an exaggerated red
 * calibration grid. Click cycles stories; drag orbits 360°.
 */
import * as THREE from 'three';

var STORIES_EL = 'dome-hero-stories';
var MOBILE_MQ = '(pointer: coarse), (max-width: 768px)';

export function initDomeHero() {
  var canvas = document.getElementById('orb-webgl');
  var orb = document.getElementById('orb');
  var spin = document.getElementById('orb-spin');
  var img = document.getElementById('orb-img');
  var amb = document.querySelector('.hero-amb img');
  var hero = document.querySelector('.hero');
  if (!canvas || !orb || !spin || !img) return false;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = window.matchMedia(MOBILE_MQ).matches;
  if (reduced || !hasWebGL()) return false;

  var stories = readStories();
  if (!stories.length) return false;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: !mobile,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: false
    });
  } catch (err) {
    return false;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(36, 1, 0.08, 40);
  /* Landing pose: low three-quarter, looking up into the opening — not from above. */
  camera.position.set(0, -0.32, 3.05);
  camera.lookAt(0, 0.28, 0);

  scene.add(new THREE.AmbientLight(0x7ec8ff, 0.38));
  var key = new THREE.DirectionalLight(0x3cdcff, 1.15);
  key.position.set(-2.2, 1.6, 2.4);
  scene.add(key);
  var warm = new THREE.DirectionalLight(0xfff3e0, 0.55);
  warm.position.set(2.4, -0.4, 1.6);
  scene.add(warm);

  var rig = new THREE.Group();
  scene.add(rig);

  var dome = buildDome();
  rig.add(dome.group);

  var index = 0;
  var videos = stories.map(function () { return makeVideo(); });
  var posterTex = new THREE.TextureLoader().load(stories[0].src);
  posterTex.colorSpace = THREE.SRGBColorSpace;
  posterTex.wrapS = THREE.ClampToEdgeWrapping;
  posterTex.wrapT = THREE.ClampToEdgeWrapping;
  dome.innerMat.uniforms.uMap.value = posterTex;

  var videoTex = null;
  var visible = true;
  var pageVisible = true;
  var running = false;
  var raf = 0;
  var yaw = 0.42;
  var pitch = -0.68;
  var vYaw = 0;
  var vPitch = 0;
  var dragging = false;
  var lastX = 0;
  var lastY = 0;
  var moved = 0;
  var idle = true;
  var clock = new THREE.Clock();
  var PITCH_MAX = Math.PI * 0.92;

  function resize() {
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function applyStory(i, fromClick) {
    index = ((i % stories.length) + stories.length) % stories.length;
    var s = stories[index];
    orb.dataset.story = String(index);
    orb.style.setProperty('--acc', s.acc);
    var disc = orb.querySelector('.disc');
    if (disc) disc.style.setProperty('--acc', s.acc);

    img.src = s.src;
    if (amb) amb.src = s.src;
    var cap = document.getElementById('orb-cap');
    if (cap) cap.textContent = s.cap || '';

    var dots = document.querySelectorAll('#hero-dots button');
    Array.prototype.forEach.call(dots, function (d, k) {
      if (k === index) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });

    videos.forEach(function (v, k) {
      if (k !== index) v.pause();
    });
    bindVideo(videos[index], s);
    window.dispatchEvent(new CustomEvent('dome-hero:index', { detail: index }));
  }

  function bindVideo(video, story) {
    var poster = new THREE.TextureLoader().load(story.src, function (tex) {
      tex.colorSpace = THREE.SRGBColorSpace;
      posterTex = tex;
      posterTex.wrapS = THREE.ClampToEdgeWrapping;
      posterTex.wrapT = THREE.ClampToEdgeWrapping;
      if (!videoTex) dome.innerMat.uniforms.uMap.value = tex;
    });
    poster.colorSpace = THREE.SRGBColorSpace;

    if (video.getAttribute('src') !== story.video) {
      videoTex = null;
      dome.innerMat.uniforms.uMap.value = poster;
      video.setAttribute('src', story.video);
      video.load();
    }

    function attach() {
      if (videoTex) videoTex.dispose();
      videoTex = new THREE.VideoTexture(video);
      videoTex.minFilter = THREE.LinearFilter;
      videoTex.magFilter = THREE.LinearFilter;
      videoTex.generateMipmaps = false;
      videoTex.colorSpace = THREE.SRGBColorSpace;
      videoTex.wrapS = THREE.ClampToEdgeWrapping;
      videoTex.wrapT = THREE.ClampToEdgeWrapping;
      dome.innerMat.uniforms.uMap.value = videoTex;
    }

    function tryPlay() {
      if (!visible || !pageVisible) return;
      var p = video.play();
      if (p && p.catch) p.catch(function () { /* autoplay blocked: keep poster */ });
    }

    if (video.readyState >= 2) {
      attach();
      tryPlay();
    } else {
      video.addEventListener('loadeddata', function onReady() {
        video.removeEventListener('loadeddata', onReady);
        attach();
        tryPlay();
      });
    }
  }

  function tick() {
    raf = 0;
    if (!visible || !pageVisible) { running = false; return; }
    var dt = Math.min(0.05, clock.getDelta());

    if (!dragging) {
      vYaw *= 0.935;
      vPitch *= 0.935;
      yaw += vYaw;
      pitch += vPitch;
      if (idle && !mobile) {
        yaw += dt * 0.1;
      } else if (Math.abs(vYaw) < 0.0004 && Math.abs(vPitch) < 0.0004) {
        idle = true;
      }
    }
    pitch = clamp(pitch, -PITCH_MAX, PITCH_MAX);
    rig.rotation.y = yaw;
    rig.rotation.x = pitch;
    dome.innerMat.uniforms.uTime.value += dt;

    resize();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }

  function startLoop() {
    if (running) return;
    running = true;
    clock.getDelta();
    raf = requestAnimationFrame(tick);
  }

  function stopLoop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    videos.forEach(function (v) { v.pause(); });
  }

  /* Full-hero orbit: pointer is captured so drag keeps going off the mesh.
     Mobile keeps tap-to-cycle so vertical scroll is never captured. */
  function onDown(e) {
    if (mobile) {
      lastX = e.clientX;
      lastY = e.clientY;
      moved = 0;
      dragging = true;
      return;
    }
    dragging = true;
    idle = false;
    moved = 0;
    lastX = e.clientX;
    lastY = e.clientY;
    vYaw = 0;
    vPitch = 0;
    orb.classList.add('is-drag');
    if (orb.setPointerCapture) orb.setPointerCapture(e.pointerId);
  }
  function onMove(e) {
    if (!dragging) return;
    var dx = e.clientX - lastX;
    var dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    moved += Math.abs(dx) + Math.abs(dy);
    if (mobile) return;
    yaw += dx * 0.01;
    pitch = clamp(pitch - dy * 0.0085, -PITCH_MAX, PITCH_MAX);
    vYaw = dx * 0.01;
    vPitch = -dy * 0.0085;
  }
  function onUp() {
    if (!dragging) return;
    dragging = false;
    orb.classList.remove('is-drag');
    if (moved < 10) applyStory(index + 1, true);
  }

  orb.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);

  var dots = document.querySelectorAll('#hero-dots button');
  Array.prototype.forEach.call(dots, function (d, k) {
    d.addEventListener('click', function (e) {
      e.stopPropagation();
      applyStory(k, true);
    });
  });

  if ('IntersectionObserver' in window && hero) {
    new IntersectionObserver(function (entries) {
      visible = entries[0] && entries[0].isIntersecting;
      if (visible && pageVisible) {
        startLoop();
        var v = videos[index];
        if (v) v.play().catch(function () {});
      } else {
        stopLoop();
      }
    }, { threshold: 0.08 }).observe(hero);
  } else {
    startLoop();
  }

  document.addEventListener('visibilitychange', function () {
    pageVisible = document.visibilityState !== 'hidden';
    if (pageVisible && visible) startLoop();
    else stopLoop();
  });

  window.addEventListener('resize', function () {
    mobile = window.matchMedia(MOBILE_MQ).matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    resize();
  }, { passive: true });

  orb.classList.add('is-dome3d');
  if (hero) hero.classList.add('is-dome3d');
  applyStory(0, false);
  resize();
  renderer.render(scene, camera);
  startLoop();
  return true;
}

function buildDome() {
  var group = new THREE.Group();

  var innerGeo = new THREE.SphereGeometry(1.0, 96, 48, 0, Math.PI * 2, 0, Math.PI / 2);
  remapHemisphereUv(innerGeo);

  var innerMat = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: null },
      uTime: { value: 0 },
      uRimCool: { value: new THREE.Color(0x3cdcff) },
      uRimWarm: { value: new THREE.Color(0xf6f0e4) },
      uGrid: { value: new THREE.Color(0xff2a4a) }
    },
    vertexShader: [
      'varying vec2 vUv;',
      'varying vec3 vWorldNormal;',
      'varying vec3 vViewDir;',
      'void main() {',
      '  vUv = uv;',
      '  vec4 world = modelMatrix * vec4(position, 1.0);',
      '  vWorldNormal = normalize(mat3(modelMatrix) * normal);',
      '  vViewDir = cameraPosition - world.xyz;',
      '  gl_Position = projectionMatrix * viewMatrix * world;',
      '}'
    ].join('\n'),
    fragmentShader: [
      'uniform sampler2D uMap;',
      'uniform float uTime;',
      'uniform vec3 uRimCool;',
      'uniform vec3 uRimWarm;',
      'uniform vec3 uGrid;',
      'varying vec2 vUv;',
      'varying vec3 vWorldNormal;',
      'varying vec3 vViewDir;',
      'void main() {',
      '  vec3 base = texture2D(uMap, vUv).rgb;',
      '  vec2 gv = vec2(vUv.x * 24.0, vUv.y * 12.0);',
      '  vec2 fw = fwidth(gv) * 1.8;',
      '  vec2 g = abs(fract(gv - 0.5) - 0.5);',
      '  float line = 1.0 - min(smoothstep(0.0, fw.x, g.x), smoothstep(0.0, fw.y, g.y));',
      '  float pulse = 0.55 + 0.45 * sin(uTime * 3.2);',
      '  float scan = smoothstep(0.08, 0.0, abs(fract(vUv.y * 0.5 - uTime * 0.12) - 0.5));',
      '  base += uGrid * line * (0.55 + 0.7 * pulse);',
      '  base += uGrid * scan * 0.28;',
      '  vec3 n = normalize(vWorldNormal);',
      '  vec3 v = normalize(vViewDir);',
      '  float fres = pow(1.0 - abs(dot(n, v)), 2.1);',
      '  vec3 rim = mix(uRimCool, uRimWarm, smoothstep(0.3, 1.0, fres));',
      '  vec3 col = base * 0.96 + rim * fres * 0.45;',
      '  gl_FragColor = vec4(col, 1.0);',
      '}'
    ].join('\n'),
    side: THREE.DoubleSide,
    transparent: false,
    depthWrite: true
  });
  var show = new THREE.Mesh(innerGeo, innerMat);
  show.renderOrder = 2;
  group.add(show);

  addMeridians(group);

  var ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.0, 0.014, 8, 96),
    new THREE.MeshStandardMaterial({
      color: 0xe8eef2,
      emissive: new THREE.Color(0x3cdcff),
      emissiveIntensity: 0.55,
      roughness: 0.35,
      metalness: 0.45
    })
  );
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  return { group: group, innerMat: innerMat };
}

function addMeridians(group) {
  var mat = new THREE.LineBasicMaterial({
    color: 0x3cdcff,
    transparent: true,
    opacity: 0.55,
    depthWrite: false
  });
  var i;
  var t;
  var pts;
  var theta;
  var phi;
  for (i = 0; i < 18; i++) {
    phi = (i / 18) * Math.PI * 2;
    pts = [];
    for (t = 0; t <= 32; t++) {
      theta = (t / 32) * Math.PI / 2;
      pts.push(pointOnDome(theta, phi, 0.988));
    }
    var line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat);
    line.renderOrder = 1;
    group.add(line);
  }
  for (i = 1; i <= 4; i++) {
    theta = (i / 5) * Math.PI / 2;
    pts = [];
    for (t = 0; t <= 64; t++) {
      phi = (t / 64) * Math.PI * 2;
      pts.push(pointOnDome(theta, phi, 0.988));
    }
    var par = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat);
    par.renderOrder = 1;
    group.add(par);
  }
}

function pointOnDome(theta, phi, r) {
  return new THREE.Vector3(
    -Math.cos(phi) * Math.sin(theta),
    Math.cos(theta),
    Math.sin(phi) * Math.sin(theta)
  ).multiplyScalar(r);
}

function remapHemisphereUv(geo) {
  /* Fisheye cover: the 16:9 center fills the dome so the equator is a
     circle around the frame, not a stretched strip of the bottom edge. */
  var pos = geo.attributes.position;
  var uv = geo.attributes.uv;
  var aspect = 16 / 9;
  var i;
  for (i = 0; i < uv.count; i++) {
    var x = pos.getX(i);
    var z = pos.getZ(i);
    var rho = Math.min(1, Math.sqrt(x * x + z * z));
    var ang = Math.atan2(z, x);
    uv.setXY(
      i,
      0.5 + rho * Math.cos(ang) * 0.5 / aspect,
      0.5 + rho * Math.sin(ang) * 0.5
    );
  }
  uv.needsUpdate = true;
}

function makeVideo() {
  var v = document.createElement('video');
  v.muted = true;
  v.defaultMuted = true;
  v.loop = true;
  v.playsInline = true;
  v.setAttribute('playsinline', '');
  v.setAttribute('muted', '');
  v.preload = 'auto';
  v.crossOrigin = 'anonymous';
  v.setAttribute('aria-hidden', 'true');
  v.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;overflow:hidden;';
  document.body.appendChild(v);
  return v;
}

function readStories() {
  var el = document.getElementById(STORIES_EL);
  if (!el) return [];
  try { return JSON.parse(el.textContent); } catch (e) { return []; }
}

function hasWebGL() {
  try {
    var c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl'));
  } catch (e) {
    return false;
  }
}

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
