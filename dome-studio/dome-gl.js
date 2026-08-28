/* ANDATA DOME STUDIO — concave interior renderer (WebGL1, no CDN). */
(function (global) {
  'use strict';

  var VS = [
    'attribute vec3 aPos;',
    'uniform mat4 uMVP;',
    'varying vec3 vPos;',
    'void main(){',
    '  vPos = aPos;',
    '  gl_Position = uMVP * vec4(aPos, 1.0);',
    '}'
  ].join('\n');

  var FS = [
    'precision mediump float;',
    'varying vec3 vPos;',
    'uniform sampler2D uTexA;',
    'uniform sampler2D uTexB;',
    'uniform float uMix;',
    'uniform vec3 uAccent;',
    'uniform float uRibs;',
    'uniform vec3 uEye;',
    'vec2 domeUV(vec3 p){',
    '  vec3 n = normalize(p);',
    '  float theta = acos(clamp(n.y, -1.0, 1.0));',
    '  float r = theta / 1.5707963;',
    '  float a = atan(n.x, n.z);',
    '  return vec2(0.5 + 0.5 * r * sin(a), 0.5 + 0.5 * r * cos(a));',
    '}',
    'void main(){',
    '  vec3 n = normalize(vPos);',
    '  if (n.y < -0.02) discard;',
    '  vec2 uv = domeUV(vPos);',
    '  uv = clamp(uv, 0.002, 0.998);',
    '  vec4 ca = texture2D(uTexA, uv);',
    '  vec4 cb = texture2D(uTexB, uv);',
    '  vec3 col = mix(ca.rgb, cb.rgb, uMix);',
    '  vec3 view = normalize(uEye - vPos);',
    '  float fres = pow(1.0 - abs(dot(n, view)), 1.6);',
    '  col *= 0.88 + 0.18 * abs(dot(n, view));',
    '  col += uAccent * fres * 0.12;',
    '  float lat = acos(clamp(n.y, 0.0, 1.0));',
    '  float lon = atan(n.x, n.z);',
    '  float mer = abs(sin(lon * 10.0));',
    '  float par = abs(sin(lat * 8.0));',
    '  float rib = (1.0 - smoothstep(0.0, 0.022, min(mer, par))) * uRibs * 0.14;',
    '  float rim = smoothstep(1.22, 1.50, lat);',
    '  col = mix(col, vec3(0.04, 0.06, 0.1), rim * 0.28);',
    '  col += rib * mix(vec3(0.75), uAccent, 0.45);',
    '  col += uAccent * rim * 0.22;',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  function program(gl) {
    var vs = compile(gl, gl.VERTEX_SHADER, VS);
    var fs = compile(gl, gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return null;
    var p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.bindAttribLocation(p, 0, 'aPos');
    gl.linkProgram(p);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
    return p;
  }

  function hemisphere(stacks, slices) {
    var pos = [], idx = [];
    var i, j, t, p, x, y, z;
    for (i = 0; i <= stacks; i++) {
      t = (i / stacks) * Math.PI * 0.5;
      for (j = 0; j <= slices; j++) {
        p = (j / slices) * Math.PI * 2;
        x = Math.sin(t) * Math.sin(p);
        y = Math.cos(t);
        z = Math.sin(t) * Math.cos(p);
        pos.push(x, y, z);
      }
    }
    var row = slices + 1;
    for (i = 0; i < stacks; i++) {
      for (j = 0; j < slices; j++) {
        var a = i * row + j;
        var b = a + row;
        idx.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
    return { pos: new Float32Array(pos), idx: new Uint16Array(idx) };
  }

  function ident() {
    return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
  }
  function mul(a, b) {
    var o = new Float32Array(16), i, j, k;
    for (i = 0; i < 4; i++) {
      for (j = 0; j < 4; j++) {
        var s = 0;
        for (k = 0; k < 4; k++) s += a[k * 4 + j] * b[i * 4 + k];
        o[i * 4 + j] = s;
      }
    }
    return o;
  }
  function perspective(fov, aspect, near, far) {
    var f = 1 / Math.tan(fov / 2), nf = 1 / (near - far);
    var o = new Float32Array(16);
    o[0] = f / aspect; o[5] = f; o[10] = (far + near) * nf; o[11] = -1;
    o[14] = 2 * far * near * nf;
    return o;
  }
  function lookAt(ex, ey, ez, cx, cy, cz, ux, uy, uz) {
    var fx = cx - ex, fy = cy - ey, fz = cz - ez;
    var fl = 1 / Math.hypot(fx, fy, fz); fx *= fl; fy *= fl; fz *= fl;
    var sx = fy * uz - fz * uy, sy = fz * ux - fx * uz, sz = fx * uy - fy * ux;
    var sl = 1 / Math.hypot(sx, sy, sz); sx *= sl; sy *= sl; sz *= sl;
    var rx = sy * fz - sz * fy, ry = sz * fx - sx * fz, rz = sx * fy - sy * fx;
    // Column-major gluLookAt: rows are side, up, -forward.
    var o = ident();
    o[0] = sx; o[4] = sy; o[8] = sz;
    o[1] = rx; o[5] = ry; o[9] = rz;
    o[2] = -fx; o[6] = -fy; o[10] = -fz;
    o[12] = -(sx * ex + sy * ey + sz * ez);
    o[13] = -(rx * ex + ry * ey + rz * ez);
    o[14] = fx * ex + fy * ey + fz * ez;
    return o;
  }

  function placeholder(gl, rgb) {
    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array(rgb));
    return t;
  }

  function hexToRgb(hex) {
    var h = (hex || '#3CDCFF').replace('#', '');
    if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
    return [
      parseInt(h.slice(0, 2), 16) / 255,
      parseInt(h.slice(2, 4), 16) / 255,
      parseInt(h.slice(4, 6), 16) / 255
    ];
  }

  function DomeGL(canvas, opts) {
    opts = opts || {};
    var gl = canvas.getContext('webgl', { alpha: false, antialias: true, depth: true });
    if (!gl) return null;
    var prog = program(gl);
    if (!prog) return null;

    var mesh = hemisphere(opts.stacks || 28, opts.slices || 56);
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.pos, gl.STATIC_DRAW);
    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.idx, gl.STATIC_DRAW);
    var count = mesh.idx.length;

    var uMVP = gl.getUniformLocation(prog, 'uMVP');
    var uTexA = gl.getUniformLocation(prog, 'uTexA');
    var uTexB = gl.getUniformLocation(prog, 'uTexB');
    var uMix = gl.getUniformLocation(prog, 'uMix');
    var uAccent = gl.getUniformLocation(prog, 'uAccent');
    var uRibs = gl.getUniformLocation(prog, 'uRibs');
    var uEye = gl.getUniformLocation(prog, 'uEye');

    var texA = placeholder(gl, [8, 12, 22]);
    var texB = placeholder(gl, [8, 12, 22]);
    var mix = 0, mixTo = 0, flip = false;
    var accent = hexToRgb('#3CDCFF');
    var yaw = 0, pitch = 0.08, dist = 0.42;
    var tYaw = 0, tPitch = 0.08, tDist = 0.26;
    var enter = 0;
    var live = false, raf = 0, visible = true;
    var reduced = !!opts.reduced;
    var cache = {};
    var hasTex = false;
    var maxYaw = 12 * Math.PI / 180;
    var maxPitch = 8 * Math.PI / 180;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var w = Math.max(1, canvas.clientWidth);
      var h = Math.max(1, canvas.clientHeight);
      var W = Math.round(w * dpr), H = Math.round(h * dpr);
      if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W; canvas.height = H;
      }
      gl.viewport(0, 0, W, H);
    }

    function bindTex(unit, tex) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
    }

    function upload(img) {
      var t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      return t;
    }

    function loadImage(src) {
      return new Promise(function (resolve, reject) {
        if (cache[src]) { resolve(cache[src]); return; }
        var existing = null;
        var imgs = document.images;
        for (var i = 0; i < imgs.length; i++) {
          var s = imgs[i].getAttribute('src') || '';
          if (s === src || imgs[i].currentSrc.indexOf(src.replace('./', '')) !== -1) { existing = imgs[i]; break; }
        }
        if (existing && existing.complete && existing.naturalWidth) {
          try {
            cache[src] = upload(existing);
            resolve(cache[src]);
            return;
          } catch (e) {}
        }
        var img = new Image();
        img.decoding = 'sync';
        img.onload = function () {
          try {
            cache[src] = upload(img);
            resolve(cache[src]);
          } catch (e) { reject(e); }
        };
        img.onerror = function () { reject(new Error('texture ' + src)); };
        img.src = src;
      });
    }

    function draw(now) {
      if (!live) return;
      raf = requestAnimationFrame(draw);
      var t = (now || 0) * 0.001;
      var k = reduced ? 1 : 0.085;
      yaw += (tYaw - yaw) * k;
      pitch += (tPitch - pitch) * k;
      dist += (tDist - dist) * (reduced ? 1 : 0.06);
      mix += (mixTo - mix) * (reduced ? 1 : 0.14);
      var lookYaw = yaw + (reduced ? 0 : Math.sin(t * 0.35) * 0.012);
      var lookPitch = pitch + (reduced ? 0 : Math.cos(t * 0.28) * 0.008);
      if (!visible) return;
      resize();

      // Inside the hemisphere: pull back so the full rim stays in frame.
      var eyeX = Math.sin(lookYaw) * 0.12;
      var eyeY = 0.12 + lookPitch * 0.2;
      var eyeZ = 0.44 - enter * 0.1;
      var cx = Math.sin(lookYaw) * 0.28;
      var cy = 0.28 + lookPitch * 0.65;
      var cz = -0.52 + Math.cos(lookYaw) * 0.06;
      var aspect = canvas.width / Math.max(1, canvas.height);
      var proj = perspective(98 * Math.PI / 180, aspect, 0.05, 6);
      var view = lookAt(eyeX, eyeY, eyeZ, cx, cy, cz, 0, 1, 0);
      var mvp = mul(proj, view);

      gl.enable(gl.DEPTH_TEST);
      gl.disable(gl.CULL_FACE);
      gl.clearColor(0.015, 0.025, 0.05, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
      gl.uniformMatrix4fv(uMVP, false, mvp);
      gl.uniform3f(uEye, eyeX, eyeY, eyeZ);
      bindTex(0, flip ? texB : texA);
      bindTex(1, flip ? texA : texB);
      gl.uniform1i(uTexA, 0);
      gl.uniform1i(uTexB, 1);
      gl.uniform1f(uMix, flip ? 1 - mix : mix);
      gl.uniform3fv(uAccent, accent);
      gl.uniform1f(uRibs, 0.7 + enter * 0.2);
      gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
    }

    function start() {
      if (live) return;
      live = true;
      raf = requestAnimationFrame(draw);
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
        return loadImage(src).then(function (tex) {
          if (!hasTex) {
            texA = tex;
            texB = tex;
            mix = 0;
            mixTo = 0;
            flip = false;
            hasTex = true;
          } else if (!flip) {
            texB = tex;
            mixTo = 1;
            flip = true;
          } else {
            texA = tex;
            mixTo = 0;
            flip = false;
          }
          if (reduced) mix = mixTo;
          visible = true;
          start();
        });
      },
      preload: function (src) { return loadImage(src).then(function () {}); },
      setAccent: function (hex) { accent = hexToRgb(hex); },
      look: function (dyaw, dpitch) {
        tYaw = Math.max(-maxYaw, Math.min(maxYaw, tYaw + dyaw));
        tPitch = Math.max(-0.02, Math.min(0.22, tPitch + dpitch));
      },
      setLook: function (y, p) {
        tYaw = Math.max(-maxYaw, Math.min(maxYaw, y));
        tPitch = Math.max(0.08, Math.min(0.38, p));
      },
      setEnter: function (v) {
        enter = Math.max(0, Math.min(1, v));
        tDist = 0.42 - enter * 0.16;
      },
      setVisible: function (v) {
        visible = !!v;
        if (visible) start();
      },
      destroy: function () {
        stop();
        try {
          var ext = gl.getExtension('WEBGL_lose_context');
          if (ext) ext.loseContext();
        } catch (e) {}
      }
    };
  }

  global.DomeGL = DomeGL;
})(window);
