/* ANDATA DOME STUDIO — inner-sphere 360 look-around (Three.js, local). */
(function (global) {
  'use strict';

  var FS = [
    'uniform sampler2D uTexA;',
    'uniform sampler2D uTexB;',
    'uniform float uMix;',
    'uniform vec3 uAccent;',
    'varying vec3 vWorld;',
    'vec2 domeUV(vec3 p){',
    '  vec3 n = normalize(p);',
    '  float theta = acos(clamp(n.y, -1.0, 1.0));',
    '  float r = theta / 1.5707963;',
    '  float a = atan(n.x, n.z);',
    '  return vec2(0.5 + 0.5 * r * sin(a), 0.5 + 0.5 * r * cos(a));',
    '}',
    'void main(){',
    '  vec2 uv = domeUV(vWorld);',
    '  if (uv.x < 0.004 || uv.x > 0.996 || uv.y < 0.004 || uv.y > 0.996) {',
    '    gl_FragColor = vec4(0.015, 0.028, 0.055, 1.0);',
    '    return;',
    '  }',
    '  vec3 col = mix(texture2D(uTexA, uv).rgb, texture2D(uTexB, uv).rgb, uMix);',
    '  float vig = smoothstep(1.05, 0.25, length(uv - 0.5));',
    '  col *= 0.82 + vig * 0.22;',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  var VS = [
    'varying vec3 vWorld;',
    'void main(){',
    '  vWorld = (modelMatrix * vec4(position, 1.0)).xyz;',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'
  ].join('\n');

  function DomeGL(canvas, opts) {
    opts = opts || {};
    var THREE = global.THREE;
    if (!THREE) return null;

    var reduced = !!opts.reduced;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(68, 1, 0.1, 100);
    camera.position.set(0, 0, 0.001);

    var uniforms = {
      uTexA: { value: null },
      uTexB: { value: null },
      uMix: { value: 0 },
      uAccent: { value: new THREE.Color('#3CDCFF') }
    };

    var material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: VS,
      fragmentShader: FS,
      side: THREE.BackSide,
      depthWrite: false
    });

    var segments = window.innerWidth < 700 ? 48 : 72;
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(10, segments, segments), material);
    scene.add(sphere);

    var loader = new THREE.TextureLoader();
    var cache = {};
    var flip = false;
    var mix = 0;
    var mixTo = 0;
    var rotY = 0;
    var rotX = 0.12;
    var tRotY = 0;
    var tRotX = 0.12;
    var live = false;
    var raf = 0;
    var visible = true;

    function resize() {
      var w = Math.max(1, canvas.clientWidth);
      var h = Math.max(1, canvas.clientHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    function loadTex(src) {
      return new Promise(function (resolve, reject) {
        if (cache[src]) { resolve(cache[src]); return; }
        loader.load(
          src,
          function (tex) {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            cache[src] = tex;
            resolve(tex);
          },
          undefined,
          reject
        );
      });
    }

    function draw() {
      if (!live) return;
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      resize();
      var k = reduced ? 1 : 0.1;
      rotY += (tRotY - rotY) * k;
      rotX += (tRotX - rotX) * k;
      mix += (mixTo - mix) * (reduced ? 1 : 0.14);
      sphere.rotation.order = 'YXZ';
      sphere.rotation.y = rotY;
      sphere.rotation.x = rotX;
      uniforms.uMix.value = mix;
      renderer.render(scene, camera);
    }

    function start() {
      if (live) return;
      live = true;
      draw();
    }

    function stop() {
      live = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    start();

    return {
      ready: true,
      setTexture: function (src) {
        return loadTex(src).then(function (tex) {
          if (!uniforms.uTexA.value) {
            uniforms.uTexA.value = tex;
            uniforms.uTexB.value = tex;
            mix = 0;
            mixTo = 0;
            flip = false;
          } else if (!flip) {
            uniforms.uTexB.value = tex;
            mixTo = 1;
            flip = true;
          } else {
            uniforms.uTexA.value = tex;
            mixTo = 0;
            flip = false;
          }
          if (reduced) mix = mixTo;
          visible = true;
          start();
        });
      },
      preload: function (src) { return loadTex(src).then(function () {}); },
      setAccent: function (hex) { uniforms.uAccent.value.set(hex); },
      look: function (dyaw, dpitch) {
        tRotY += dyaw;
        tRotX = Math.max(-0.35, Math.min(0.55, tRotX + dpitch));
      },
      setLook: function (y, p) {
        tRotY = y;
        tRotX = Math.max(-0.35, Math.min(0.55, p));
      },
      setEnter: function (v) {
        camera.fov = 68 - Math.max(0, Math.min(1, v)) * 6;
        camera.updateProjectionMatrix();
      },
      setVisible: function (v) {
        visible = !!v;
        if (visible) start();
      },
      destroy: function () {
        stop();
        renderer.dispose();
        material.dispose();
        sphere.geometry.dispose();
      }
    };
  }

  global.DomeGL = DomeGL;
})(window);
