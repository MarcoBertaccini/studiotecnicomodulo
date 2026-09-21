/* ============================================================
   hero.js — reticolo strutturale animato (mesh tipo traliccio/FEM)
   Luminoso, performante, rispetta prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";
  var canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var COBALT = "30,56,212";
  var SIGNAL = "255,90,31";
  var nodes = [];
  var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  var pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  var LINK = 150;      // distanza massima di collegamento
  var raf = null;

  function size() {
    var rect = canvas.getBoundingClientRect();
    W = rect.width; H = rect.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  function build() {
    // densità proporzionale all'area, con tetto per performance
    var target = Math.min(90, Math.max(28, Math.round((W * H) / 15000)));
    nodes = [];
    for (var i = 0; i < target; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.6 + 1,
        hot: Math.random() < 0.12
      });
    }
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    var px = (pointer.x - 0.5) * 40; // parallax
    var py = (pointer.y - 0.5) * 40;

    // aggiorna posizioni
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    }

    // collegamenti
    for (var a = 0; a < nodes.length; a++) {
      for (var b = a + 1; b < nodes.length; b++) {
        var dx = nodes[a].x - nodes[b].x;
        var dy = nodes[a].y - nodes[b].y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK) {
          var alpha = (1 - d / LINK) * 0.5;
          ctx.strokeStyle = "rgba(" + COBALT + "," + alpha.toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[a].x + px * 0.4, nodes[a].y + py * 0.4);
          ctx.lineTo(nodes[b].x + px * 0.4, nodes[b].y + py * 0.4);
          ctx.stroke();
        }
      }
    }

    // nodi
    for (var k = 0; k < nodes.length; k++) {
      var m = nodes[k];
      var col = m.hot ? SIGNAL : COBALT;
      ctx.fillStyle = "rgba(" + col + "," + (m.hot ? 0.9 : 0.55) + ")";
      ctx.beginPath();
      ctx.arc(m.x + px, m.y + py, m.r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  }

  function staticFrame() {
    // versione ferma per reduced-motion
    ctx.clearRect(0, 0, W, H);
    for (var a = 0; a < nodes.length; a++) {
      for (var b = a + 1; b < nodes.length; b++) {
        var dx = nodes[a].x - nodes[b].x, dy = nodes[a].y - nodes[b].y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK) {
          ctx.strokeStyle = "rgba(" + COBALT + "," + ((1 - d / LINK) * 0.4).toFixed(3) + ")";
          ctx.beginPath(); ctx.moveTo(nodes[a].x, nodes[a].y); ctx.lineTo(nodes[b].x, nodes[b].y); ctx.stroke();
        }
      }
    }
    for (var k = 0; k < nodes.length; k++) {
      var m = nodes[k];
      ctx.fillStyle = "rgba(" + (m.hot ? SIGNAL : COBALT) + ",0.6)";
      ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2); ctx.fill();
    }
  }

  window.addEventListener("pointermove", function (e) {
    pointer.tx = e.clientX / window.innerWidth;
    pointer.ty = e.clientY / window.innerHeight;
  }, { passive: true });

  var resizeT;
  window.addEventListener("resize", function () {
    clearTimeout(resizeT);
    resizeT = setTimeout(function () { size(); if (reduce) staticFrame(); }, 180);
  });

  // Pausa quando la hero esce dallo schermo (risparmio CPU)
  var hero = document.querySelector(".hero");
  if ("IntersectionObserver" in window && hero) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (reduce) return;
        if (en.isIntersecting) { if (!raf) raf = requestAnimationFrame(frame); }
        else { if (raf) { cancelAnimationFrame(raf); raf = null; } }
      });
    }, { threshold: 0.02 }).observe(hero);
  }

  size();
  if (reduce) staticFrame(); else raf = requestAnimationFrame(frame);
})();
