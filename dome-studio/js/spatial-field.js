/**
 * ANDATA DOME STUDIO — Spatial field ("the cubes")
 * -----------------------------------------------------------------------------
 * Isolated WebGL scene. Safe to delete this file (and <section id="espacialidad">)
 * without affecting the hero, nav, copy, or the rest of the landing.
 *
 * 40–80 instanced cubes + spheres floating inside an invisible spherical bound
 * (echo of the dome). Mix of translucent solids and additive wireframes.
 * Desktop: mouse parallax. Mobile: scroll parallax. No real physics.
 */
import * as THREE from 'three';

var MOBILE_MQ = '(pointer: coarse), (max-width: 768px)';
var CAP_KEYS = ['cap1_t', 'cap2_t', 'cap3_t', 'cap4_t', 'cap6_t', 'cap8_t'];

var PALETTE = [
  0x3cdcff, /* cyan / ocean */
  0x1aa38a, /* sea green */
  0x7ec8ff, /* pale blue */
  0xf6f0e4  /* warm white — no marigold here */
];

export function initSpatialField() {
  var stage = document.getElementById('spatial-stage');
  var canvas = document.getElementById('spatial-canvas');
  var fallback = document.getElementById('spatial-fallback');
  var tip = document.getElementById('spatial-tip');
  if (!stage || !canvas) return false;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = window.matchMedia(MOBILE_MQ).matches;

  if (reduced || !hasWebGL()) {
    showFallback(fallback, canvas);
    return false;
  }

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: !mobile,
      powerPreference: 'high-performance'
    });
  } catch (err) {
    showFallback(fallback, canvas);
    return false;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 30);
  camera.position.set(0, 0.15, 4.15);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xb7d5ff, 0.55));
  var key = new THREE.DirectionalLight(0x3cdcff, 1.05);
  key.position.set(-2.4, 2.2, 3.2);
  scene.add(key);
  var fill = new THREE.DirectionalLight(0xfff1dc, 0.4);
  fill.position.set(2.6, -1.2, 1.8);
  scene.add(fill);

  /* Invisible spherical bound — instances stay inside this volume. */
  var BOUND = 1.55;
  var boundMesh = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.SphereGeometry(BOUND, 20, 12)),
    new THREE.LineBasicMaterial({
      color: 0x3cdcff,
      transparent: true,
      opacity: 0.07,
      depthWrite: false
    })
  );
  scene.add(boundMesh);

  var counts = mobile
    ? { cubeSolid: 14, cubeWire: 12, sphereSolid: 10, sphereWire: 8 }
    : { cubeSolid: 18, cubeWire: 16, sphereSolid: 12, sphereWire: 10 };
  /* 44 on mobile, 56 on desktop — within the 40–80 brief. */

  var layers = [];
  layers.push(makeLayer(new THREE.BoxGeometry(1, 1, 1), counts.cubeSolid, false, BOUND));
  layers.push(makeLayer(new THREE.BoxGeometry(1, 1, 1), counts.cubeWire, true, BOUND));
  layers.push(makeLayer(new THREE.SphereGeometry(0.55, 12, 10), counts.sphereSolid, false, BOUND));
  layers.push(makeLayer(new THREE.SphereGeometry(0.55, 10, 8), counts.sphereWire, true, BOUND));
  layers.forEach(function (layer) { scene.add(layer.mesh); });

  /* Six highlighted instances — titles come from already-approved capability copy. */
  var highlights = pickHighlights(layers, CAP_KEYS);
  var dummy = new THREE.Object3D();
  var mouse = new THREE.Vector2(0, 0);
  var targetMouse = new THREE.Vector2(0, 0);
  var raycaster = new THREE.Raycaster();
  var visible = false;
  var pageVisible = true;
  var running = false;
  var raf = 0;
  var t = 0;
  var clock = new THREE.Clock();
  var hovered = null;

  function resize() {
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function animateInstances(dt) {
    t += dt;
    layers.forEach(function (layer) {
      var mesh = layer.mesh;
      for (var i = 0; i < layer.items.length; i++) {
        var it = layer.items[i];
        dummy.position.set(
          it.base.x + Math.sin(t * it.sx + it.ph) * it.amp,
          it.base.y + Math.cos(t * it.sy + it.ph * 1.17) * it.amp,
          it.base.z + Math.sin(t * it.sz + it.ph * 0.81) * it.amp * 0.7
        );
        dummy.rotation.set(
          it.rot.x + t * it.spin.x,
          it.rot.y + t * it.spin.y,
          it.rot.z + t * it.spin.z
        );
        var pulse = it.highlight ? 1 + Math.sin(t * 1.4 + it.ph) * 0.06 : 1;
        dummy.scale.setScalar(it.scale * pulse);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    });
  }

  function applyParallax() {
    mouse.x += (targetMouse.x - mouse.x) * 0.06;
    mouse.y += (targetMouse.y - mouse.y) * 0.06;
    camera.position.x = mouse.x * 0.55;
    camera.position.y = 0.15 + mouse.y * 0.38;
    camera.lookAt(mouse.x * 0.12, mouse.y * 0.08, 0);
  }

  function tick() {
    raf = 0;
    if (!visible || !pageVisible) { running = false; return; }
    var dt = Math.min(0.05, clock.getDelta());
    animateInstances(dt);
    applyParallax();
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
  }

  /* Desktop mouse parallax; mobile uses the section's position in the viewport. */
  if (!mobile) {
    stage.addEventListener('pointermove', function (e) {
      var r = stage.getBoundingClientRect();
      targetMouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      targetMouse.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      pickTip(e);
    });
    stage.addEventListener('pointerleave', function () {
      targetMouse.set(0, 0);
      hideTip(tip);
      hovered = null;
    });
    stage.addEventListener('click', function (e) { pickTip(e, true); });
  } else {
    window.addEventListener('scroll', function () {
      var r = stage.getBoundingClientRect();
      var p = 1 - clamp((r.top + r.height * 0.5) / window.innerHeight, 0, 1);
      targetMouse.y = (p - 0.5) * 1.6;
    }, { passive: true });
    stage.addEventListener('click', function (e) { pickTip(e, true); });
  }

  function pickTip(e) {
    if (!tip) return;
    var r = canvas.getBoundingClientRect();
    var ndc = new THREE.Vector2(
      ((e.clientX - r.left) / r.width) * 2 - 1,
      -((e.clientY - r.top) / r.height) * 2 + 1
    );
    raycaster.setFromCamera(ndc, camera);
    var hits = raycaster.intersectObjects(highlights.map(function (h) { return h.mesh; }), false);
    var found = null;
    for (var i = 0; i < hits.length; i++) {
      var id = hits[i].instanceId;
      var h = highlights.find(function (x) {
        return x.mesh === hits[i].object && x.instanceId === id;
      });
      if (h) { found = h; break; }
    }
    if (!found) {
      if (hovered) { hideTip(tip); hovered = null; }
      return;
    }
    hovered = found;
    tip.textContent = captionFor(found.key);
    tip.hidden = false;
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0] && entries[0].isIntersecting;
      if (visible && pageVisible) startLoop();
      else stopLoop();
    }, { threshold: 0.08 }).observe(stage);
  } else {
    visible = true;
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

  stage.classList.add('is-webgl');
  if (fallback) fallback.hidden = true;
  canvas.hidden = false;
  resize();
  renderer.render(scene, camera);
  return true;
}

function makeLayer(geo, count, wire, bound) {
  var mat;
  if (wire) {
    mat = new THREE.MeshBasicMaterial({
      color: 0x9ee9ff,
      wireframe: true,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
  } else {
    mat = new THREE.MeshStandardMaterial({
      color: 0x3cdcff,
      roughness: 0.38,
      metalness: 0.18,
      transparent: true,
      opacity: 0.22,
      emissive: new THREE.Color(0x123848),
      emissiveIntensity: 0.55
    });
  }
  var mesh = new THREE.InstancedMesh(geo, mat, count);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  if (mesh.instanceColor === null && mesh.setColorAt) {
    /* per-instance tint */
  }
  var color = new THREE.Color();
  var items = [];
  var dummy = new THREE.Object3D();
  for (var i = 0; i < count; i++) {
    var p = randomInSphere(bound * 0.92);
    var scale = wire ? (0.08 + Math.random() * 0.16) : (0.09 + Math.random() * 0.2);
    var item = {
      base: p,
      scale: scale,
      ph: Math.random() * Math.PI * 2,
      amp: 0.04 + Math.random() * 0.08,
      sx: 0.25 + Math.random() * 0.45,
      sy: 0.22 + Math.random() * 0.4,
      sz: 0.2 + Math.random() * 0.38,
      rot: new THREE.Vector3(Math.random() * 6, Math.random() * 6, Math.random() * 6),
      spin: new THREE.Vector3(
        (Math.random() - 0.5) * 0.35,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.3
      ),
      highlight: false,
      capKey: null
    };
    dummy.position.copy(p);
    dummy.rotation.set(item.rot.x, item.rot.y, item.rot.z);
    dummy.scale.setScalar(scale);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
    color.setHex(PALETTE[i % PALETTE.length]);
    if (mesh.setColorAt) mesh.setColorAt(i, color);
    items.push(item);
  }
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  return { mesh: mesh, items: items, wire: wire };
}

function pickHighlights(layers, keys) {
  /* Prefer solid instances so hover/tap has a real volume to hit. */
  var solids = layers.filter(function (l) { return !l.wire; });
  var pool = solids.length ? solids : layers;
  var out = [];
  var k = 0;
  for (var L = 0; L < pool.length && k < keys.length; L++) {
    var layer = pool[L];
    var step = Math.max(1, Math.floor(layer.items.length / Math.max(2, keys.length / pool.length)));
    for (var i = 0; i < layer.items.length && k < keys.length; i += step) {
      if (layer.items[i].highlight) continue;
      layer.items[i].highlight = true;
      layer.items[i].capKey = keys[k];
      layer.items[i].scale *= 1.55;
      out.push({ mesh: layer.mesh, instanceId: i, key: keys[k] });
      k++;
    }
  }
  return out;
}

function randomInSphere(r) {
  /* Uniform-ish volume sample, then reject anything outside the bound. */
  var v;
  do {
    v = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    );
  } while (v.lengthSq() > 1);
  return v.multiplyScalar(r * (0.28 + Math.random() * 0.72));
}

function captionFor(key) {
  var node = document.querySelector('[data-i18n="' + key + '"]');
  return node ? node.textContent : key;
}

function hideTip(tip) {
  if (tip) tip.hidden = true;
}

function showFallback(fallback, canvas) {
  if (canvas) canvas.hidden = true;
  if (fallback) fallback.hidden = false;
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
