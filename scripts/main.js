/* ============================================================
   main.js — interazioni del sito
   nav, progress, reveal, contatori, filtri, tilt, cursore, form
   ============================================================ */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.querySelector(".site-header");
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("menu");
  var progress = document.querySelector(".progress");

  /* ---- anno footer ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- header: stato scroll + barra progresso ---- */
  function onScroll() {
    var s = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle("is-scrolled", s > 8);
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (docH > 0 ? (s / docH) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- menu mobile ---- */
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle("is-open", open);
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Chiudi il menu" : "Apri il menu");
  }
  if (toggle) toggle.addEventListener("click", function () { setMenu(!menu.classList.contains("is-open")); });
  if (menu) menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* ---- link attivo secondo la sezione visibile ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__link[href^="#"]'));
  var map = {};
  links.forEach(function (l) { map[l.getAttribute("href").slice(1)] = l; });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var l = map[en.target.id];
        if (!l) return;
        if (en.isIntersecting) {
          links.forEach(function (x) { x.classList.remove("is-active"); });
          l.classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) spy.observe(sec);
    });
  }

  /* ---- reveal allo scroll ---- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var ro = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); obs.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { ro.observe(el); });
  }

  /* ---- contatori animati ---- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (reduce) { el.textContent = format(target); return; }
    var dur = 1400, start = null;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(target * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = format(target);
    }
    requestAnimationFrame(step);
  }
  function format(v) {
    var n = Math.round(v);
    return n.toLocaleString("it-IT");
  }
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); obs.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = format(parseFloat(c.getAttribute("data-count"))); });
  }

  /* ---- filtri progetti ---- */
  var filters = Array.prototype.slice.call(document.querySelectorAll(".filter"));
  var projects = Array.prototype.slice.call(document.querySelectorAll(".project"));
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.getAttribute("data-filter");
      filters.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      projects.forEach(function (p) {
        var show = f === "all" || p.getAttribute("data-cat") === f;
        p.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* ---- tilt 3D sulle card progetti ---- */
  if (!reduce && window.matchMedia("(hover: hover)").matches) {
    projects.forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
        card.style.transform = "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) translateY(-4px)";
      });
      card.addEventListener("pointerleave", function () { card.style.transform = ""; });
    });
  }

  /* ---- cursore custom ---- */
  var cursor = document.querySelector(".cursor");
  if (cursor && !reduce && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var cx = 0, cy = 0, tx = 0, ty = 0;
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY; cursor.classList.add("is-active");
    }, { passive: true });
    document.addEventListener("pointerdown", function () { cursor.classList.add("is-hot"); });
    document.addEventListener("pointerup", function () { cursor.classList.remove("is-hot"); });
    var hot = "a, button, input, textarea, select, .project, .service";
    document.querySelectorAll(hot).forEach(function (el) {
      el.addEventListener("pointerenter", function () { cursor.classList.add("is-hot"); });
      el.addEventListener("pointerleave", function () { cursor.classList.remove("is-hot"); });
    });
    (function loop() {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cursor.style.transform = "translate(" + cx + "px," + cy + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
  }

  /* ---- form (demo, nessun invio reale) ---- */
  var form = document.getElementById("contact-form");
  if (form) {
    var fields = [
      { id: "f-nome", test: function (v) { return v.trim().length >= 2; }, msg: "Inserisci il tuo nome." },
      { id: "f-email", test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }, msg: "Inserisci un'email valida." },
      { id: "f-msg", test: function (v) { return v.trim().length >= 10; }, msg: "Scrivi almeno due righe." }
    ];
    function validateField(f) {
      var input = document.getElementById(f.id);
      var wrap = input.closest(".field");
      var err = wrap.querySelector(".field__err");
      var ok = f.test(input.value);
      wrap.classList.toggle("is-invalid", !ok);
      input.setAttribute("aria-invalid", String(!ok));
      if (err) err.textContent = ok ? "" : f.msg;
      return ok;
    }
    fields.forEach(function (f) {
      var input = document.getElementById(f.id);
      input.addEventListener("blur", function () { validateField(f); });
      input.addEventListener("input", function () {
        if (input.closest(".field").classList.contains("is-invalid")) validateField(f);
      });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var allOk = true, firstBad = null;
      fields.forEach(function (f) { if (!validateField(f) && !firstBad) { firstBad = f; allOk = false; } else if (!validateField(f)) allOk = false; });
      if (!allOk) { if (firstBad) document.getElementById(firstBad.id).focus(); return; }
      form.classList.add("is-sent");
      var ok = form.querySelector(".form__ok");
      if (ok) ok.classList.add("is-shown");
    });
  }
})();
