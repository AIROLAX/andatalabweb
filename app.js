/* ============================================================
   ANDATA LAB — vanilla app (light theme, fast, no build step)
   Content from data.js (window.SITE). Real assets in /videos,
   /PROJECTS, /Imagenes, /logos.
   Hero = demo reel + interactive spectrum shader + drifting motes.
   ============================================================ */
(function () {
  'use strict';
  var CONTENT = window.CONTENT || {};
  var LANG_KEY = 'andata_lang';
  function pickLang() {
    var saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) {}
    if (saved === 'en' || saved === 'es') return saved;
    var n = (navigator.language || 'en').toLowerCase();
    return n.indexOf('es') === 0 ? 'es' : 'en';
  }
  var lang = pickLang();
  var SITE = CONTENT[lang] || CONTENT.en || {};
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mqNarrow = window.matchMedia('(max-width: 768px)');
  var mqCoarse = window.matchMedia('(pointer: coarse)');
  var IS_MOBILE = mqNarrow.matches;

  function syncDeviceMode() {
    IS_MOBILE = mqNarrow.matches;
    document.documentElement.classList.toggle('is-mobile', mqNarrow.matches);
    document.documentElement.classList.toggle('is-coarse', mqCoarse.matches);
  }
  syncDeviceMode();
  if (mqNarrow.addEventListener) mqNarrow.addEventListener('change', syncDeviceMode);
  else if (mqNarrow.addListener) mqNarrow.addListener(syncDeviceMode);

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  /* ---------- smooth scroll / nav ---------- */
  function scrollToId(id) {
    var t = document.getElementById(id);
    if (!t) return;
    var navEl = $('#nav');
    var off = navEl ? navEl.offsetHeight : 56;
    var top = t.getBoundingClientRect().top + window.pageYOffset - off;
    window.scrollTo({ top: top, behavior: prefersReduced ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-target]');
    if (t) { e.preventDefault(); scrollToId(t.getAttribute('data-target')); }
  });
  var brandHome = $('#brand-home');
  if (brandHome) brandHome.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' }); });

  var nav = $('#nav');
  function onScrollNav() {
    if (!nav) return;
    if (window.scrollY > window.innerHeight * 0.7) nav.classList.add('solid');
    else nav.classList.remove('solid');
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- hero media: HD per device; pause when off-screen ---------- */
  (function heroMedia() {
    var video = $('#hero-video'), poster = $('#hero-poster'), hero = $('#s-hero');
    if (!video) return;
    var HERO_DESKTOP = 'videos/hero-desktop.mp4';
    var HERO_MOBILE = 'videos/hero-mobile.mp4';
    var HERO_FALLBACK = 'videos/DEMOREEL_AIROLAX 2026.mp4';

    function isMobileHero() {
      return window.matchMedia('(max-width: 768px)').matches;
    }
    function pickHeroSrc() {
      return isMobileHero() ? HERO_MOBILE : HERO_DESKTOP;
    }
    function hidePoster() {
      if (poster) poster.style.opacity = '0';
    }
    function applyHeroSrc() {
      var next = pickHeroSrc();
      video.preload = isMobileHero() ? 'auto' : 'metadata';
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      if (video.getAttribute('src') !== next) {
        if (poster) poster.style.opacity = '1';
        video.src = next;
        video.load();
        tryPlay();
      }
    }
    function tryPlay() {
      if (!hero) { video.play().catch(function () {}); return; }
      var r = hero.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) video.play().catch(function () {});
    }
    video.addEventListener('error', function () {
      var cur = video.getAttribute('src') || '';
      if (isMobileHero() && cur.indexOf('hero-mobile') !== -1) {
        video.src = HERO_DESKTOP;
        video.load();
        tryPlay();
        return;
      }
      if (cur.indexOf('DEMOREEL') === -1) {
        video.src = HERO_FALLBACK;
        video.load();
        tryPlay();
        return;
      }
      video.style.display = 'none';
    });
    applyHeroSrc();
    if (mqNarrow.addEventListener) mqNarrow.addEventListener('change', applyHeroSrc);
    else if (mqNarrow.addListener) mqNarrow.addListener(applyHeroSrc);
    video.addEventListener('loadeddata', hidePoster);
    video.addEventListener('playing', hidePoster);
    if (hero && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) video.play().catch(function () {});
        else video.pause();
      }, { threshold: 0.08 }).observe(hero);
    }
  })();

  /* ---------- render from data.js ---------- */
  function renderTrust() {
    var track = $('#trust-track'); if (!track || !SITE.clients) return;
    track.innerHTML = '';
    function buildItem(c) {
      if (c.img) {
        var img = el('img'); img.src = c.img; img.alt = c.name;
        img.onerror = function () { var s = el('span', 'client', c.name); if (img.parentNode) img.parentNode.replaceChild(s, img); };
        return img;
      }
      return el('span', 'client', c.name);
    }
    // two identical sets so the -50% scroll loops seamlessly
    for (var k = 0; k < 2; k++) {
      SITE.clients.forEach(function (c) { track.appendChild(buildItem(c)); });
    }
  }

  function pickServiceVideo(s) {
    if (IS_MOBILE && s.videoMobile) return s.videoMobile;
    return s.video;
  }

  function renderServices() {
    var host = $('#services-grid'); if (!host || !SITE.services) return;
    host.innerHTML = '';
    SITE.services.forEach(function (s) {
      var media = '';
      if (s.video) {
        var vSrc = pickServiceVideo(s);
        media = '<div class="card-media"><video data-src="' + vSrc + '" ' +
          (s.poster ? 'poster="' + s.poster + '" ' : '') +
          'muted loop playsinline preload="none" class="lazy-vid" aria-label="' + s.t + '"></video>' +
          '<span class="card-media-num">' + s.n + '</span></div>';
      } else if (s.img) {
        media = '<div class="card-media"><img src="' + s.img + '" alt="' + s.t + '" loading="lazy" ' +
            'onerror="this.parentNode.style.display=\'none\'">' +
            '<span class="card-media-num">' + s.n + '</span></div>';
      } else {
        media = '<span class="ds-label" style="color:var(--ink-3)">' + s.n + '</span>';
      }
      var card = el('article', 'card' + (s.img || s.video ? ' has-media' : ''));
      if (s.id) card.id = s.id;
      card.innerHTML = media +
        '<h3>' + s.t + '</h3>' +
        '<p>' + s.d + '</p>' +
        '<p class="get">' + s.get + '</p>';
      host.appendChild(card);
    });
    var a = SITE.servicesAccent || {};
    host.appendChild(el('article', 'card accent',
      '<h3>' + (a.h || '') + '</h3>' +
      '<p>' + (a.p || '') + '</p>' +
      '<button class="mini" data-target="s-contact">' + (a.btn || '') + '</button>'));
  }

  function renderWork() {
    var host = $('#work-grid'); if (!host || !SITE.work) return;
    host.innerHTML = '';
    var GRAD = [
      'linear-gradient(135deg,#0a2740,#3CDCFF)',
      'linear-gradient(135deg,#2a0a1e,#FF2E8A)',
      'linear-gradient(135deg,#2a1605,#FF8A3C)',
      'linear-gradient(135deg,#0c1a2a,#7a4cff)'
    ];
    SITE.work.forEach(function (w, i) {
      var card = el('article', 'work-card');
      card.setAttribute('data-target', 's-contact');
      var mediaInner;
      if (w.img && w.video) {
        mediaInner =
          '<img class="work-img work-img-still" src="' + w.img + '" alt="" loading="lazy" aria-hidden="true" ' +
            'onerror="this.remove();">' +
          '<video class="work-img work-img-vid lazy-vid" data-src="' + w.video + '" ' +
          (w.poster ? 'poster="' + w.poster + '" ' : '') +
          'muted loop playsinline preload="none" ' +
          'onerror="this.parentNode.classList.remove(\'work-media-stack\');this.remove();"></video>';
      } else if (w.video) {
        mediaInner = '<video class="work-img lazy-vid" data-src="' + w.video + '" ' +
          (w.poster ? 'poster="' + w.poster + '" ' : '') +
          'muted loop playsinline preload="none" ' +
          'onerror="this.parentNode.style.background=\'' + GRAD[i % 4] + '\';this.remove();"></video>';
      } else if (w.img) {
        mediaInner = '<img class="work-img" src="' + w.img + '" alt="' + w.t + '" onerror="this.parentNode.style.background=\'' + GRAD[i % 4] + '\';this.remove();">';
      } else {
        mediaInner = '';
      }
      var mediaCls = (w.img && w.video) ? ' work-media-stack' : '';
      card.innerHTML =
        '<div class="work-media' + mediaCls + '" style="background:' + GRAD[i % 4] + '">' + mediaInner + '</div>' +
        '<div class="work-body">' +
          '<span class="ds-label" style="color:var(--ink-3);font-size:10.5px">' + w.client + '</span>' +
          '<h3>' + w.t + '</h3>' +
          '<p>' + w.outcome + '</p>' +
        '</div>';
      host.appendChild(card);
    });
  }

  var processPreviewBound = false;
  var stepParticleLoops = [];

  function renderProcess() {
    var host = $('#process-grid'); if (!host || !SITE.process) return;
    host.innerHTML = '';
    SITE.process.forEach(function (p, idx) {
      var step = el('div', 'step',
        '<div class="step-inner" tabindex="0">' +
          '<canvas class="step-particles" aria-hidden="true"></canvas>' +
          '<div class="step-glow" aria-hidden="true"></div>' +
          '<div class="step-content">' +
            '<span class="step-num">' + p.n + '</span>' +
            '<h3>' + p.t + '</h3>' +
            '<p>' + p.d + '</p>' +
          '</div>' +
        '</div>');
      step.dataset.stepIndex = String(idx);
      if (p.img) step.dataset.previewImg = p.img;
      if (p.video) {
        step.dataset.previewVideo = p.video;
        if (p.poster) step.dataset.previewPoster = p.poster;
      }
      host.appendChild(step);
    });
    bindProcessPreview();
    bindStepParticles();
  }

  function bindProcessPreview() {
    var section = $('#s-process');
    var grid = $('#process-grid');
    var mediaHost = $('#process-backdrop-media');
    if (!section || !grid || !mediaHost || !SITE.process) return;

    function clearPreview() {
      section.classList.remove('process-preview-active');
      section.removeAttribute('data-active-step');
      var vid = mediaHost.querySelector('video');
      if (vid) { vid.pause(); try { vid.currentTime = 0; } catch (e) {} }
      mediaHost.innerHTML = '';
    }

    function showPreview(idx) {
      var p = SITE.process[idx];
      if (!p) return;
      section.classList.add('process-preview-active');
      section.setAttribute('data-active-step', String(idx + 1));
      mediaHost.innerHTML = '';
      if (p.video) {
        var v = document.createElement('video');
        v.className = 'process-backdrop-vid';
        v.src = p.video;
        if (p.poster) v.poster = p.poster;
        v.muted = true;
        v.loop = true;
        v.playsInline = true;
        v.setAttribute('preload', 'metadata');
        v.setAttribute('aria-hidden', 'true');
        mediaHost.appendChild(v);
        requestAnimationFrame(function () { v.play().catch(function () {}); });
      } else if (p.img) {
        var d = document.createElement('div');
        d.className = 'process-backdrop-img';
        d.style.backgroundImage = 'url(\'' + p.img + '\')';
        d.setAttribute('aria-hidden', 'true');
        mediaHost.appendChild(d);
      }
    }

    function leavingSteps(target) {
      return !target || !target.closest || !target.closest('#process-grid .step');
    }

    var activeTapStep = null;
    if (!processPreviewBound) {
      processPreviewBound = true;
      grid.addEventListener('click', function (e) {
        if (!document.documentElement.classList.contains('is-mobile')) return;
        var stepTap = e.target.closest('.step');
        if (!stepTap || !grid.contains(stepTap)) return;
        var idxTap = parseInt(stepTap.dataset.stepIndex, 10);
        if (isNaN(idxTap)) return;
        if (activeTapStep === stepTap) {
          clearPreview();
          activeTapStep = null;
          return;
        }
        activeTapStep = stepTap;
        showPreview(idxTap);
      });
      grid.addEventListener('mouseover', function (e) {
        var step = e.target.closest('.step');
        if (!step || !grid.contains(step)) return;
        var idx = parseInt(step.dataset.stepIndex, 10);
        if (!isNaN(idx)) showPreview(idx);
      });
      grid.addEventListener('mouseout', function (e) {
        var step = e.target.closest('.step');
        if (!step) return;
        var rel = e.relatedTarget;
        if (rel && step.contains(rel)) return;
        if (rel && rel.closest && rel.closest('#process-grid .step')) return;
        clearPreview();
      });
      grid.addEventListener('focusin', function (e) {
        var step = e.target.closest('.step');
        if (!step || !grid.contains(step)) return;
        var idx = parseInt(step.dataset.stepIndex, 10);
        if (!isNaN(idx)) showPreview(idx);
      });
      grid.addEventListener('focusout', function (e) {
        if (!leavingSteps(e.relatedTarget)) return;
        clearPreview();
      });
      section.addEventListener('mouseleave', function (e) {
        if (leavingSteps(e.relatedTarget)) clearPreview();
      });
    }
  }

  var lazyVideoIO = null;
  function bindLazyVideos() {
    var vids = $$('.lazy-vid');
    if (!vids.length) return;

    function markLoaded(v) { v.classList.add('is-loaded'); }

    function ensureSrc(v) {
      var src = v.getAttribute('data-src');
      if (!src || v.getAttribute('src') === src) return;
      v.setAttribute('src', src);
      v.load();
    }

    function releaseVid(v) {
      v.pause();
      v.classList.remove('is-loaded');
      if (document.documentElement.classList.contains('is-mobile')) {
        v.removeAttribute('src');
      }
    }

    function playVid(v) {
      ensureSrc(v);
      if (v.readyState >= 2) {
        markLoaded(v);
        v.play().catch(function () {});
        return;
      }
      v.addEventListener('loadeddata', function once() {
        v.removeEventListener('loadeddata', once);
        markLoaded(v);
        v.play().catch(function () {});
      }, { once: true });
    }

    if (!('IntersectionObserver' in window)) {
      vids.forEach(function (v) { playVid(v); });
      return;
    }

    var margin = document.documentElement.classList.contains('is-mobile')
      ? '60px 0px 100px 0px' : '100px 0px 140px 0px';
    if (!lazyVideoIO) {
      lazyVideoIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) playVid(en.target);
          else releaseVid(en.target);
        });
      }, { rootMargin: margin, threshold: 0.12 });
    }

    vids.forEach(function (v) {
      if (v._lazyBound) return;
      v._lazyBound = true;
      lazyVideoIO.observe(v);
      var r = v.getBoundingClientRect();
      if (r.top < window.innerHeight * 1.15 && r.bottom > -40) playVid(v);
    });
  }

  function bindStepParticles() {
    stepParticleLoops.forEach(function (stop) { if (stop) stop(); });
    stepParticleLoops = [];
    if (prefersReduced || IS_MOBILE) return;

    var accents = [
      '60,220,255', '255,46,138', '255,138,60', '155,122,255'
    ];

    document.querySelectorAll('#process-grid .step-particles').forEach(function (canvas, i) {
      var ctx = canvas.getContext('2d');
      var accent = accents[i % accents.length];
      var w = 0, h = 0, dpr = 1, parts = [], running = true, t = 0, raf = 0;

      function spawn() {
        return {
          x: Math.random() * w, y: Math.random() * h,
          r: Math.random() * 1.4 + 0.35,
          vy: -(Math.random() * 0.18 + 0.03),
          sway: Math.random() * 0.45 + 0.08, phase: Math.random() * Math.PI * 2,
          a: Math.random() * 0.28 + 0.06,
          c: Math.random() < 0.35 ? accent : '255,255,255'
        };
      }
      function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = canvas.clientWidth; h = canvas.clientHeight;
        if (!w || !h) return;
        canvas.width = w * dpr; canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        var count = Math.round(Math.min(48, Math.max(18, w / 14)));
        parts = [];
        for (var j = 0; j < count; j++) parts.push(spawn());
      }
      function draw() {
        t += 0.007;
        ctx.clearRect(0, 0, w, h);
        for (var k = 0; k < parts.length; k++) {
          var p = parts[k];
          p.y += p.vy;
          if (p.y < -8) { p.y = h + 8; p.x = Math.random() * w; }
          var x = p.x + Math.sin(t + p.phase) * p.sway * 6;
          ctx.globalAlpha = p.a;
          ctx.fillStyle = 'rgba(' + p.c + ',1)';
          ctx.beginPath();
          ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      function loop() {
        if (!running) return;
        draw();
        raf = requestAnimationFrame(loop);
      }
      resize();
      loop();
      var onResize = function () { resize(); };
      window.addEventListener('resize', onResize);
      stepParticleLoops.push(function () {
        running = false;
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', onResize);
      });
    });
  }

  var bindCardTilt = function () {};

  function renderAll() {
    renderTrust();
    renderServices();
    renderWork();
    renderProcess();
    lazyVideoIO = null;
    bindLazyVideos();
    bindCardTilt();
  }

  /* ---------- i18n: static text + language toggle ---------- */
  function applyStatic() {
    var ui = SITE.ui || {};
    $$('[data-i18n]').forEach(function (node) {
      var k = node.getAttribute('data-i18n');
      if (ui[k] != null) node.textContent = ui[k];
    });
    $$('[data-i18n-ph]').forEach(function (node) {
      var k = node.getAttribute('data-i18n-ph');
      if (ui[k] != null) node.setAttribute('placeholder', ui[k]);
    });
    document.documentElement.lang = lang;
    if (ui.doc_title) document.title = ui.doc_title;
  }

  function setLang(next) {
    if (next !== 'en' && next !== 'es') return;
    lang = next;
    SITE = CONTENT[lang] || CONTENT.en || {};
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    applyStatic();
    renderAll();
  }

  renderAll();
  applyStatic();

  function toggleLang() { setLang(lang === 'en' ? 'es' : 'en'); }
  var langToggle = $('#lang-toggle');
  if (langToggle) langToggle.addEventListener('click', toggleLang);
  var langToggleDrawer = $('#lang-toggle-drawer');
  if (langToggleDrawer) langToggleDrawer.addEventListener('click', toggleLang);

  (function mobileNav() {
    var toggle = $('#nav-toggle');
    var drawer = $('#nav-drawer');
    var backdrop = $('#nav-drawer-backdrop');
    if (!toggle || !drawer) return;
    function closeDrawer() {
      drawer.classList.remove('is-open');
      drawer.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    function openDrawer() {
      drawer.hidden = false;
      requestAnimationFrame(function () { drawer.classList.add('is-open'); });
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    toggle.addEventListener('click', function () {
      if (drawer.classList.contains('is-open')) closeDrawer();
      else openDrawer();
    });
    if (backdrop) backdrop.addEventListener('click', closeDrawer);
    drawer.querySelectorAll('[data-target]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        closeDrawer();
        scrollToId(link.getAttribute('data-target'));
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer();
    });
  })();

  /* ---------- contact form ---------- */
  var form = $('#brief-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ui = SITE.ui || {};
      var btn = form.querySelector('.submit');
      var errEl = form.querySelector('#brief-error');
      var original = btn ? btn.textContent : '';
      if (errEl) { errEl.hidden = true; errEl.textContent = ''; }
      if (btn) { btn.disabled = true; btn.textContent = ui.form_sending || 'Sending…'; }

      function fail(msg) {
        if (btn) { btn.disabled = false; btn.textContent = original; }
        if (errEl) { errEl.textContent = msg; errEl.hidden = false; }
      }

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.success) {
            form.innerHTML = '<div class="sent"><h3>' + (ui.form_thanks_h || 'Thanks — message received.') + '</h3><p>' + (ui.form_thanks_p || 'We reply within 24–48 hours.') + '</p></div>';
          } else {
            fail((res && res.message ? res.message + ' — ' : '') + (ui.form_err_send || 'Please email us directly at airolaxx@gmail.com.'));
          }
        })
        .catch(function () {
          fail(ui.form_err_net || 'Network error. Please email us directly at airolaxx@gmail.com.');
        });
    });
  }

  /* ---------- cinematic scroll reveal ---------- */
  var reveals = $$('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (r) { r.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (r) { io.observe(r); });
  }

  /* ---------- landing polish: scroll bar, hero parallax, card tilt ---------- */
  (function landingPolish() {
    if (prefersReduced) return;

    var progress = $('#scroll-progress');
    var scrollQueued = false;

    function onScroll() {
      if (scrollQueued) return;
      scrollQueued = true;
      requestAnimationFrame(function () {
        scrollQueued = false;
        var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        var p = Math.min(1, window.scrollY / max);
        if (progress) progress.style.transform = 'scaleX(' + p + ')';
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var hero = $('#s-hero');
    if (hero) {
      var smx = 0, smy = 0, pmx = 0, pmy = 0, tcx = 50, tcy = 50, scx = 50, scy = 50, srx = 50, sry = 50;
      var lcx = 50, lcy = 50, sang = 0, svel = 0, heroFxOn = false, ptrActive = false;
      var hrect = { l: 0, t: 0, w: 1, h: 1 };
      function refreshHrect() {
        var r = hero.getBoundingClientRect();
        hrect.l = r.left; hrect.t = r.top; hrect.w = r.width; hrect.h = r.height;
      }
      refreshHrect();
      window.addEventListener('resize', refreshHrect, { passive: true });
      window.addEventListener('scroll', refreshHrect, { passive: true });
      function onHeroPointer(e) {
        ptrActive = true;
        pmx = (e.clientX - hrect.l) / hrect.w - 0.5;
        pmy = (e.clientY - hrect.t) / hrect.h - 0.5;
        tcx = (e.clientX - hrect.l) / hrect.w * 100;
        tcy = (e.clientY - hrect.t) / hrect.h * 100;
        hero.classList.add('is-pointer');
      }
      hero.addEventListener('pointermove', onHeroPointer, { passive: true, capture: true });
      hero.addEventListener('pointerdown', function () { hero.classList.add('is-clicking'); }, { capture: true });
      window.addEventListener('pointerup', function () { hero.classList.remove('is-clicking'); });
      hero.addEventListener('pointerleave', function () {
        hero.classList.remove('is-pointer', 'is-clicking');
        ptrActive = false;
        pmx = 0; pmy = 0; tcx = 50; tcy = 50;
      });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) { heroFxOn = es[0].isIntersecting; }, { threshold: 0.05 }).observe(hero);
      } else heroFxOn = true;
      (function heroParallax() {
        if (heroFxOn && (ptrActive || Math.abs(tcx - scx) > 0.08 || Math.abs(tcy - scy) > 0.08)) {
          smx += (pmx - smx) * 0.065;
          smy += (pmy - smy) * 0.065;
          scx += (tcx - scx) * 0.072;
          scy += (tcy - scy) * 0.072;
          srx += (scx - srx) * 0.048;
          sry += (scy - sry) * 0.048;
          if (ptrActive) {
            var dx = scx - lcx, dy = scy - lcy;
            sang += (Math.atan2(dy, dx) * (180 / Math.PI) - sang) * 0.09;
            svel += (Math.min(1, Math.sqrt(dx * dx + dy * dy) * 0.12) - svel) * 0.1;
            lcx = scx; lcy = scy;
          }
          hero.style.setProperty('--mx', smx.toFixed(4));
          hero.style.setProperty('--my', smy.toFixed(4));
          hero.style.setProperty('--cx', scx.toFixed(2) + '%');
          hero.style.setProperty('--cy', scy.toFixed(2) + '%');
          hero.style.setProperty('--rx', srx.toFixed(2) + '%');
          hero.style.setProperty('--ry', sry.toFixed(2) + '%');
          hero.style.setProperty('--ang', sang.toFixed(1));
          hero.style.setProperty('--vel', svel.toFixed(3));
        }
        requestAnimationFrame(heroParallax);
      })();
    }

    function bindTilt(sel, max) {
      $$(sel).forEach(function (card) {
        if (card._tiltBound) return;
        card._tiltBound = true;
        card.addEventListener('pointermove', function (e) {
          var r = card.getBoundingClientRect();
          var rx = ((e.clientY - r.top) / r.height - 0.5) * -max;
          var ry = ((e.clientX - r.left) / r.width - 0.5) * max;
          card.classList.add('tilt-active');
          card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-8px)';
        });
        card.addEventListener('pointerleave', function () {
          card.classList.remove('tilt-active');
          card.style.transform = '';
        });
      });
    }
    bindCardTilt = function () {
      if (document.documentElement.classList.contains('is-coarse') ||
          document.documentElement.classList.contains('is-mobile')) return;
      bindTilt('.work-card', 5);
      bindTilt('#services-grid .card:not(.accent)', 4);
    };
    bindCardTilt();
  })();

  /* ============================================================
     HERO GAS SHADER — advanced fluid haze (mouse + click, video untouched).
     ============================================================ */
  (function heroShader() {
    var canvas = $('#hero-shader'); if (!canvas) return;
    if (prefersReduced || IS_MOBILE) { canvas.style.display = 'none'; return; }
    var hero = $('#s-hero'); if (!hero) return;
    hero.classList.add('hero-fx-on');
    var gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: false, powerPreference: 'low-power' });
    if (!gl) { canvas.style.display = 'none'; return; }
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    var VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}';
    var FRAG = [
      'precision mediump float;',
      'uniform vec2 iR; uniform float iT; uniform vec2 iM; uniform vec2 iM2;',
      'uniform float iDown; uniform float iPulse; uniform vec2 iVel; uniform float iHover;',
      'float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}',
      'float vn(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);',
      ' float a=h21(i),b=h21(i+vec2(1,0)),c=h21(i+vec2(0,1)),d=h21(i+vec2(1,1));',
      ' return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}',
      'float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<5;i++){v+=a*vn(p);p=p*2.01+vec2(7.1,3.7);a*=0.5;}return v;}',
      'vec2 warp(vec2 p,float t,float s){',
      ' vec2 e=vec2(fbm(p*2.8+vec2(t*0.11,0.0))-0.5,fbm(p*2.8+vec2(4.2,t*0.09))-0.5);',
      ' return p+e*s;}',
      'void main(){',
      ' vec2 uv=(gl_FragCoord.xy-0.5*iR)/iR.y;',
      ' vec2 m=(iM-0.5*iR)/iR.y;',
      ' vec2 m2=(iM2-0.5*iR)/iR.y;',
      ' float t=iT*0.04;',
      ' float md=length(uv-m);',
      ' float md2=length(uv-m2);',
      ' float near=pow(exp(-md*2.15),1.3);',
      ' float trail=pow(exp(-md2*2.6),1.15)*0.5;',
      ' float interact=max(near,trail)*iHover;',
      ' if(interact<0.01){ gl_FragColor=vec4(0.0); return; }',
      ' vec2 vel=iVel/iR.y;',
      ' float speed=clamp(length(vel)*16.0,0.0,1.2);',
      ' float zone=smoothstep(0.58,0.04,uv.y);',
      ' vec2 q=uv*1.24+vec2(0.0,-t*0.14)-vel*0.035*interact;',
      ' q+=(uv-m)*near*0.2*(1.0+iDown*0.4+iPulse*0.22);',
      ' q+=(uv-m2)*trail*0.1;',
      ' q=warp(q,t,0.11*interact);',
      ' q+=vec2(sin(q.y*1.5+t*0.48),cos(q.x*1.3-t*0.42))*0.025*interact;',
      ' float w=fbm(q+vec2(t*0.08,sin(t*0.28)*0.05));',
      ' float v=fbm(q+w*1.45+vec2(t*0.22,-t*0.28));',
      ' float gas=smoothstep(0.06,0.9,max(v,w));',
      ' float hx=fbm(q+vec2(0.004,0.0))-fbm(q-vec2(0.004,0.0));',
      ' float hy=fbm(q+vec2(0.0,0.004))-fbm(q-vec2(0.0,0.004));',
      ' vec3 n=normalize(vec3(-hx*2.4,-hy*2.4,0.5));',
      ' vec3 L=normalize(vec3(0.28,0.18,0.62));',
      ' float diff=0.5+0.5*max(0.0,dot(n,L));',
      ' float spec=pow(max(0.0,dot(reflect(-L,n),vec3(0.0,0.0,1.0))),24.0)*0.12;',
      ' vec3 col=mix(vec3(0.1,0.03,0.18),vec3(0.42,0.08,0.58),smoothstep(0.08,0.5,gas));',
      ' col=mix(col,vec3(0.62,0.18,0.48),smoothstep(0.2,0.68,w));',
      ' col=mix(col,vec3(0.82,0.38,0.62),smoothstep(0.3,0.85,v)*interact);',
      ' col*=diff;',
      ' col+=spec*vec3(0.85,0.5,0.72)*interact*0.65;',
      ' float click=(iDown*0.9+iPulse*0.65)*near;',
      ' float clickPop=sin(md*26.0-iPulse*9.0)*exp(-md*5.5)*click*0.22;',
      ' float energy=smoothstep(0.05,0.65,gas)*zone*0.03+near*(0.38+speed*0.26);',
      ' energy+=click*0.95/(md*md*12.0+md*3.5+0.1)+exp(-md*2.8)*click*0.35;',
      ' energy+=exp(-md*1.15)*near*0.28+clickPop+trail*0.16;',
      ' col*=clamp(energy,0.0,1.18);',
      ' col=pow(col,vec3(0.96));',
      ' float alpha=clamp(energy*0.94,0.0,0.9)*zone*iHover;',
      ' gl_FragColor=vec4(col,alpha);',
      '}'
    ].join('\n');

    function shCtx(ctx, type, src) {
      var s = ctx.createShader(type); ctx.shaderSource(s, src); ctx.compileShader(s);
      if (!ctx.getShaderParameter(s, ctx.COMPILE_STATUS)) { console.error(ctx.getShaderInfoLog(s)); return null; }
      return s;
    }
    function sh(type, src) { return shCtx(gl, type, src); }
    var vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) { canvas.style.display = 'none'; return; }
    var prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.warn('hero shader: link failed'); return; }
    gl.useProgram(prog);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var aP = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(aP); gl.vertexAttribPointer(aP, 2, gl.FLOAT, false, 0, 0);
    var uR = gl.getUniformLocation(prog, 'iR'), uT = gl.getUniformLocation(prog, 'iT'),
        uM = gl.getUniformLocation(prog, 'iM'), uM2 = gl.getUniformLocation(prog, 'iM2'),
        uDown = gl.getUniformLocation(prog, 'iDown'), uPulse = gl.getUniformLocation(prog, 'iPulse'),
        uVel = gl.getUniformLocation(prog, 'iVel'), uHover = gl.getUniformLocation(prog, 'iHover');

    var video = $('#hero-video');
    if (video) video.classList.remove('hero-video-src');
    var vfc = $('#hero-video-fx');
    if (vfc) { vfc.classList.remove('is-active'); vfc.style.display = 'none'; }

    var DPR = Math.min(window.devicePixelRatio || 1, 1.08);
    var W = 0, H = 0, hr = { l: 0, t: 0, w: 1, h: 1 };
    function refreshHeroRect() {
      var r = hero.getBoundingClientRect();
      hr.l = r.left; hr.t = r.top; hr.w = r.width; hr.h = r.height;
    }
    function resize() {
      refreshHeroRect();
      W = Math.max(1, Math.floor(hr.w * DPR)); H = Math.max(1, Math.floor(hr.h * DPR));
      if (canvas.width === W && canvas.height === H) return;
      canvas.width = W; canvas.height = H; gl.viewport(0, 0, W, H);
    }
    var mx = 0, my = 0, mx2 = 0, my2 = 0, tx = 0, ty = 0;
    var down = 0, downS = 0, pulse = 0, hover = 0, hoverS = 0, velX = 0, velY = 0, active = 0;
    function setM(cx, cy) {
      tx = (cx - hr.l) * DPR;
      ty = H - (cy - hr.t) * DPR;
      hover = 1;
      active = 1;
    }
    function onPtrDown(e) { setM(e.clientX, e.clientY); down = 1; pulse = 0.65; downS = 1; active = 1; }
    function onPtrMove(e) { setM(e.clientX, e.clientY); }
    hero.addEventListener('pointermove', onPtrMove, { passive: true, capture: true });
    hero.addEventListener('pointerdown', onPtrDown, { capture: true });
    hero.addEventListener('pointerleave', function () {
      down = 0; hover = 0;
      tx = W * 0.5;
      ty = -H * 0.2;
    }, { capture: true });
    window.addEventListener('pointerup', function () { down = 0; });
    var resizeT = 0;
    window.addEventListener('resize', function () {
      clearTimeout(resizeT);
      resizeT = setTimeout(resize, 120);
    }, { passive: true });
    window.addEventListener('scroll', refreshHeroRect, { passive: true });
    resize();
    tx = W * 0.5; ty = H * 0.35; mx = mx2 = tx; my = my2 = ty;

    var t0 = performance.now(), visible = true, running = false, lastFrame = 0;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible && !running && !prefersReduced) { running = true; requestAnimationFrame(loop); }
      }, { threshold: 0.01, rootMargin: '80px 0px' }).observe(hero);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) running = false;
      else if (visible) { running = true; requestAnimationFrame(loop); }
    });
    function frame(now) {
      mx += (tx - mx) * 0.078;
      my += (ty - my) * 0.078;
      mx2 += (mx - mx2) * 0.042;
      my2 += (my - my2) * 0.042;
      velX += ((tx - mx) - velX) * 0.1;
      velY += ((ty - my) - velY) * 0.1;
      hoverS += (hover - hoverS) * (hover ? 0.14 : 0.06);
      downS += ((down ? 1 : 0) - downS) * (down ? 0.26 : 0.08);
      if (down) pulse = Math.min(1.0, pulse + 0.16);
      else pulse *= 0.8;
      var settled = Math.abs(tx - mx) < 1.2 && Math.abs(ty - my) < 1.2 && downS < 0.03;
      if (!hover && hoverS < 0.04 && settled) { active = 0; return false; }
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uR, W, H);
      gl.uniform1f(uT, (now - t0) / 1000);
      gl.uniform2f(uM, mx, my);
      gl.uniform2f(uM2, mx2, my2);
      gl.uniform2f(uVel, velX, velY);
      gl.uniform1f(uHover, hoverS);
      gl.uniform1f(uDown, downS);
      gl.uniform1f(uPulse, pulse);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      return true;
    }
    function loop(now) {
      if (!visible || document.hidden) { running = false; return; }
      now = now || performance.now();
      if (!active && hoverS < 0.05 && downS < 0.03 && now - lastFrame < 48) {
        requestAnimationFrame(loop);
        return;
      }
      if (frame(now)) lastFrame = now;
      requestAnimationFrame(loop);
    }
    function onMqHero() {
      if (mqNarrow.matches) { canvas.style.display = 'none'; running = false; }
      else {
        canvas.style.display = '';
        resize();
        if (visible && !document.hidden) { running = true; requestAnimationFrame(loop); }
      }
    }
    if (mqNarrow.addEventListener) mqNarrow.addEventListener('change', onMqHero);
    else if (mqNarrow.addListener) mqNarrow.addListener(onMqHero);
    if (prefersReduced) { frame(performance.now()); } else { running = true; requestAnimationFrame(loop); }
  })();

  /* ============================================================
     HERO PARTICLES — mouse-reactive field + click bursts (desktop)
     ============================================================ */
  (function particles() {
    var canvas = $('#hero-particles'); if (!canvas) return;
    if (prefersReduced || IS_MOBILE) { canvas.style.display = 'none'; return; }
    var hero = $('#s-hero');
    if (!hero) return;
    var ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;
    var SPEC = ['160,50,120', '200,70,150', '140,40,130', '220,90,170'];
    var w = 0, h = 0, dpr = 1, parts = [], bursts = [], raf = 0, running = false, visible = true, t = 0;
    var ptrX = 0, ptrY = 0, spx = 0, spy = 0, ptrOn = false;
    var pr = { l: 0, t: 0 };
    function refreshPR() {
      var r = hero.getBoundingClientRect();
      pr.l = r.left; pr.t = r.top;
    }
    refreshPR();
    window.addEventListener('resize', refreshPR, { passive: true });
    window.addEventListener('scroll', refreshPR, { passive: true });

    hero.addEventListener('pointermove', function (e) {
      ptrX = e.clientX - pr.l;
      ptrY = e.clientY - pr.t;
      ptrOn = true;
    }, { passive: true, capture: true });
    hero.addEventListener('pointerleave', function () { ptrOn = false; }, { capture: true });
    hero.addEventListener('pointerdown', function (e) {
      var bx = e.clientX - pr.l, by = e.clientY - pr.t;
      for (var b = 0; b < 7; b++) {
        var ang = Math.random() * Math.PI * 2;
        var spd = Math.random() * 1.8 + 0.5;
        bursts.push({
          x: bx, y: by,
          vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
          r: Math.random() * 1.4 + 0.35,
          life: 1,
          c: SPEC[1 + ((Math.random() * 2) | 0)]
        });
      }
    }, { capture: true });

    function spawn() {
      return {
        x: Math.random() * w,
        y: h + Math.random() * 50,
        r: Math.random() * 1.4 + 0.3,
        vy: -(Math.random() * 0.18 + 0.04),
        vx: 0,
        sway: Math.random() * 0.35 + 0.06, phase: Math.random() * Math.PI * 2,
        a: Math.random() * 0.14 + 0.05,
        c: SPEC[Math.random() < 0.7 ? 1 + ((Math.random() * 2) | 0) : 0],
        glow: false
      };
    }
    function resize() {
      refreshPR();
      dpr = Math.min(window.devicePixelRatio || 1, 1);
      w = canvas.clientWidth; h = canvas.clientHeight;
      if (!w || !h) return;
      var cw = Math.floor(w * dpr), ch = Math.floor(h * dpr);
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw; canvas.height = ch;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      var count = Math.min(36, Math.max(22, Math.round(w / 24)));
      if (parts.length !== count) {
        parts = [];
        for (var i = 0; i < count; i++) parts.push(spawn());
      }
    }
    function draw() {
      t += 0.005;
      if (ptrOn) {
        spx += (ptrX - spx) * 0.055;
        spy += (ptrY - spy) * 0.055;
      }
      ctx.clearRect(0, 0, w, h);
      var rad = Math.min(w, h) * 0.26, rad2 = rad * rad;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.y += p.vy;
        p.x += p.vx;
        p.vx *= 0.94;
        if (ptrOn) {
          var dx = spx - p.x, dy = spy - p.y, d2 = dx * dx + dy * dy;
          if (d2 < rad2) {
            var pull = 0.02 / (1 + d2 * 0.00007);
            p.vx += dx * pull;
            p.vy += dy * pull * 0.32;
          }
        }
        if (p.y < -12) { parts[i] = spawn(); p = parts[i]; }
        var lift = Math.max(0, Math.min(1, (h - p.y) / (h * 0.52)));
        var x = p.x + Math.sin(t + p.phase) * p.sway * 5;
        var nearPtr = ptrOn ? Math.max(0, 1 - Math.hypot(spx - x, spy - p.y) / 180) : 0;
        ctx.globalAlpha = p.a * lift * (0.5 + nearPtr * 0.55);
        ctx.fillStyle = nearPtr > 0.25 ? 'rgba(' + p.c + ',.95)' : 'rgba(' + p.c + ',.75)';
        ctx.beginPath();
        ctx.arc(x, p.y, p.r * (1 + nearPtr * 0.3), 0, Math.PI * 2);
        ctx.fill();
      }
      for (var bi = bursts.length - 1; bi >= 0; bi--) {
        var b = bursts[bi];
        b.x += b.vx; b.y += b.vy;
        b.vx *= 0.96; b.vy *= 0.96;
        b.life -= 0.03;
        if (b.life <= 0) { bursts.splice(bi, 1); continue; }
        ctx.globalAlpha = b.life * 0.65;
        ctx.fillStyle = 'rgba(' + b.c + ',1)';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * b.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    var lastP = 0;
    function loop(now) {
      if (!running || !visible || document.hidden) { running = false; return; }
      now = now || performance.now();
      if (!ptrOn && bursts.length === 0 && now - lastP < 50) {
        raf = requestAnimationFrame(loop);
        return;
      }
      draw();
      lastP = now;
      raf = requestAnimationFrame(loop);
    }

    resize();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible && !running) { running = true; raf = requestAnimationFrame(loop); }
      }, { threshold: 0.05 }).observe(hero);
    } else { running = true; raf = requestAnimationFrame(loop); }
    var pResizeT = 0;
    window.addEventListener('resize', function () {
      clearTimeout(pResizeT);
      pResizeT = setTimeout(resize, 120);
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { running = false; cancelAnimationFrame(raf); }
      else if (visible) { running = true; raf = requestAnimationFrame(loop); }
    });
  })();

  /* ============================================================
     STATEMENT BACKGROUND SHADER — "Plasma Flux" from FLUX OS.
     Liquid energy that flows toward the cursor, behind the
     "We design and build immersive…" statement. Self-contained.
     ============================================================ */
  (function statementShader() {
    var canvas = document.getElementById('statement-fx'); if (!canvas) return;
    if (prefersReduced) { canvas.style.display = 'none'; return; }
    var panel = canvas.parentNode; if (!panel) return;
    var gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false });
    if (!gl) { canvas.style.display = 'none'; return; }

    var VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}';
    var FRAG = [
      'precision highp float;',
      'uniform vec2 iR; uniform float iT; uniform vec2 iM; uniform float iDown;',
      'float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}',
      'float vn(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);',
      ' float a=h21(i),b=h21(i+vec2(1,0)),c=h21(i+vec2(0,1)),d=h21(i+vec2(1,1));',
      ' return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}',
      'float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<6;i++){v+=a*vn(p);p=p*2.02+vec2(7.1,3.7);a*=0.5;}return v;}',
      'vec3 pal(float t,vec3 a,vec3 b,vec3 c,vec3 d){return a+b*cos(6.28318*(c*t+d));}',
      'void main(){',
      ' vec2 fc=gl_FragCoord.xy;',
      ' vec2 uv=(fc-0.5*iR)/iR.y;',
      ' vec2 m=(iM-0.5*iR)/iR.y;',
      ' float t=iT*0.16;',
      ' float md=length(uv-m);',
      ' vec2 pull=(uv-m)*exp(-md*1.4)*0.72;',
      ' vec2 q=uv*1.55 - pull;',
      ' float w1=fbm(q+vec2(0.0,t));',
      ' float w2=fbm(q*1.35 - t*1.15 + w1*1.85 + m*0.75);',
      ' float v=fbm(q + w2*2.05 + vec2(t*0.52,-t));',
      ' v+=0.32/(md*4.2+0.28);',
      ' v+=iDown*0.22;',
      ' vec3 col=pal(v*1.2 + t, vec3(0.5),vec3(0.5),vec3(1.0),vec3(0.0,0.33,0.67));',
      ' col=mix(col,vec3(1.0),smoothstep(0.68,1.35,v)*0.55);',
      ' col*=0.52+0.72*v;',
      ' col=pow(col,vec3(0.9));',
      ' gl_FragColor=vec4(col,1.0);',
      '}'
    ].join('\n');

    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s)); return null; } return s; }
    var vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) { canvas.style.display = 'none'; return; }
    var prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.style.display = 'none'; return; }
    gl.useProgram(prog);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var aP = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(aP); gl.vertexAttribPointer(aP, 2, gl.FLOAT, false, 0, 0);
    var uR = gl.getUniformLocation(prog, 'iR'), uT = gl.getUniformLocation(prog, 'iT'),
        uM = gl.getUniformLocation(prog, 'iM'), uDown = gl.getUniformLocation(prog, 'iDown');

    var DPR = IS_MOBILE ? Math.min(window.devicePixelRatio || 1, 1.15) : Math.min(window.devicePixelRatio || 1, 1.5);
    var W = 0, H = 0;
    function resize() {
      var r = panel.getBoundingClientRect();
      W = Math.max(1, Math.floor(r.width * DPR)); H = Math.max(1, Math.floor(r.height * DPR));
      canvas.width = W; canvas.height = H; gl.viewport(0, 0, W, H);
    }
    var mx = 0, my = 0, tx = 0, ty = 0, down = 0, downS = 0, drift = 0;
    function setM(cx, cy) { var r = canvas.getBoundingClientRect(); tx = (cx - r.left) * DPR; ty = H - (cy - r.top) * DPR; }
    panel.addEventListener('pointermove', function (e) { setM(e.clientX, e.clientY); }, { passive: true });
    panel.addEventListener('pointerdown', function (e) { setM(e.clientX, e.clientY); down = 1; }, { passive: true });
    panel.addEventListener('touchstart', function (e) {
      if (!e.touches || !e.touches[0]) return;
      setM(e.touches[0].clientX, e.touches[0].clientY); down = 1;
    }, { passive: true });
    window.addEventListener('pointerup', function () { down = 0; });
    window.addEventListener('touchend', function () { down = 0; });
    window.addEventListener('resize', resize);
    resize(); tx = W * 0.62; ty = H * 0.5; mx = tx; my = ty;

    var t0 = performance.now(), visible = false, running = false;
    function frame() {
      if (IS_MOBILE && !down) {
        drift += 0.008;
        tx = W * (0.52 + Math.sin(drift) * 0.12);
        ty = H * (0.48 + Math.cos(drift * 0.85) * 0.1);
      }
      mx += (tx - mx) * (IS_MOBILE ? 0.1 : 0.14);
      my += (ty - my) * (IS_MOBILE ? 0.1 : 0.14);
      downS += ((down ? 1 : 0) - downS) * 0.12;
      gl.useProgram(prog);
      gl.uniform2f(uR, W, H); gl.uniform1f(uT, (performance.now() - t0) / 1000);
      gl.uniform2f(uM, mx, my); gl.uniform1f(uDown, downS);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    function loop() { if (!visible) { running = false; return; } frame(); requestAnimationFrame(loop); }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible && !running && !prefersReduced) { running = true; requestAnimationFrame(loop); } }, { threshold: 0.01 }).observe(panel);
    } else { visible = true; }
    if (prefersReduced) { frame(); } else if (!('IntersectionObserver' in window)) { running = true; requestAnimationFrame(loop); }
  })();
})();
