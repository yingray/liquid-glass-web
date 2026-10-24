/* @ds-bundle: {"format":4,"namespace":"LiquidGlass","components":[{"name":"FloatingNavbar"},{"name":"GlassButton"},{"name":"SegmentedControl"},{"name":"Toolbar"},{"name":"Modal"},{"name":"GlassPanel"}]} */
/* Liquid Glass Web — behaviour for the components in bundle.css. Framework-free; every function
   enhances markup that already works without JavaScript. Nothing runs until you call it. */
(function () {
  "use strict";
  var doc = document;
  var root = doc.documentElement;
  var STORE = "lg-preferences";
  var bound = typeof WeakMap === "function" ? new WeakMap() : null;

  function mq(q) {
    return window.matchMedia ? window.matchMedia(q) : { matches: false, addEventListener: function () {} };
  }
  function onMq(q, fn) {
    var m = mq(q);
    if (m.addEventListener) m.addEventListener("change", fn);
    else if (m.addListener) m.addListener(fn);
  }
  function readPrefs() {
    try { return JSON.parse(window.localStorage.getItem(STORE)) || {}; } catch (e) { return {}; }
  }
  function writePrefs(p) {
    try { window.localStorage.setItem(STORE, JSON.stringify(p)); } catch (e) { /* storage blocked: keep in memory */ }
  }
  function toggleAttr(el, name, on) {
    if (on) el.setAttribute(name, ""); else el.removeAttribute(name);
  }
  function cssNumber(name, fallback) {
    var v = parseFloat(getComputedStyle(root).getPropertyValue(name));
    return isNaN(v) ? fallback : v;
  }
  function isDisabled(el) {
    return !!(el.disabled || el.getAttribute("aria-disabled") === "true");
  }
  function remember(el, ctrl) { if (bound) bound.set(el, ctrl); return ctrl; }
  function known(el) { return bound ? bound.get(el) : null; }

  /* ---------- Theme resolver: scheme × (glass | solid | contrast) ---------- */
  var memoryPrefs = null;
  var listening = false;
  function resolveTheme(p) {
    var scheme = p.scheme === "light" || p.scheme === "dark" ? p.scheme : (mq("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var contrast = p.contrast === "more" || (p.contrast !== "standard" && mq("(prefers-contrast: more)").matches);
    var reduce = p.transparency === "reduce" || (p.transparency !== "full" && mq("(prefers-reduced-transparency: reduce)").matches);
    return scheme + (contrast ? "-contrast" : reduce ? "-solid" : "");
  }
  function applyTheme(options) {
    var p = memoryPrefs || readPrefs();
    if (options) {
      for (var k in options) if (Object.prototype.hasOwnProperty.call(options, k)) {
        if (options[k] === "auto" || options[k] == null) delete p[k]; else p[k] = options[k];
      }
      writePrefs(p);
    }
    memoryPrefs = p;
    var theme = resolveTheme(p);
    root.setAttribute("data-theme", theme);
    if (p.transparency === "full") root.setAttribute("data-transparency", "full"); else root.removeAttribute("data-transparency");
    if (p.motion === "reduce") root.setAttribute("data-motion", "reduce"); else root.removeAttribute("data-motion");
    if (p.glass === "strong") root.setAttribute("data-glass", "strong"); else root.removeAttribute("data-glass");
    if (!listening) {
      listening = true;
      ["(prefers-color-scheme: dark)", "(prefers-contrast: more)", "(prefers-reduced-transparency: reduce)"].forEach(function (q) {
        onMq(q, function () { applyTheme(); });
      });
    }
    root.dispatchEvent(new CustomEvent("lg:themechange", { detail: { theme: theme, preferences: p } }));
    return theme;
  }
  function preferences() {
    var p = memoryPrefs || readPrefs();
    return {
      scheme: p.scheme || "auto",
      transparency: p.transparency || "auto",
      contrast: p.contrast || "auto",
      motion: p.motion || "auto",
      glass: p.glass || "restrained",
      theme: root.getAttribute("data-theme") || resolveTheme(p)
    };
  }

  /* ---------- Local tone: glass follows the surface beneath it, not only the page theme ---------- */
  function modeSuffix() {
    var m = /-(solid|contrast)$/.exec(root.getAttribute("data-theme") || "");
    return m ? "-" + m[1] : "";
  }
  function setTone(el, tone) {
    if (tone !== "light" && tone !== "dark") {
      el.removeAttribute("data-tone");
      el.removeAttribute("data-theme");
      return;
    }
    el.setAttribute("data-tone", tone);
    el.setAttribute("data-theme", tone + modeSuffix());
  }
  function refreshTones(scope) {
    Array.prototype.forEach.call((scope || doc).querySelectorAll("[data-tone]"), function (el) {
      setTone(el, el.getAttribute("data-tone"));
    });
  }
  if (typeof MutationObserver === "function") {
    new MutationObserver(function () { refreshTones(); }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  }

  /* ---------- Refraction (rung 2): SVG displacement inside backdrop-filter, Chromium only ---------- */
  var refraction = { on: false, defs: null, n: 0, ro: null };
  function isChromium() {
    var d = navigator.userAgentData;
    if (d && d.brands) return d.brands.some(function (b) { return /Chromium/.test(b.brand); });
    /* userAgentData is missing outside secure contexts: fall back to the UA string (Safari and Firefox never send "Chrome/") */
    return /(?:Chrome|Chromium)\/\d+/.test(navigator.userAgent || "");
  }
  function displacementMap(w, h, edge) {
    var ex = Math.min(0.45, edge / Math.max(w, 1)).toFixed(4);
    var ey = Math.min(0.45, edge / Math.max(h, 1)).toFixed(4);
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '">' +
      '<defs><linearGradient id="x" x1="0" x2="1" y1="0" y2="0">' +
      '<stop offset="0" stop-color="#ff0000"/><stop offset="' + ex + '" stop-color="#800000"/>' +
      '<stop offset="' + (1 - ex) + '" stop-color="#800000"/><stop offset="1" stop-color="#000000"/></linearGradient>' +
      '<linearGradient id="y" x1="0" x2="0" y1="0" y2="1">' +
      '<stop offset="0" stop-color="#00ff00"/><stop offset="' + ey + '" stop-color="#008000"/>' +
      '<stop offset="' + (1 - ey) + '" stop-color="#008000"/><stop offset="1" stop-color="#000000"/></linearGradient></defs>' +
      '<rect width="100%" height="100%" fill="url(#x)"/>' +
      '<rect width="100%" height="100%" fill="url(#y)" style="mix-blend-mode:screen"/></svg>';
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }
  function buildFilter(el) {
    var NS = "http://www.w3.org/2000/svg";
    var id = el.getAttribute("data-refract-id");
    if (!id) { id = "lg-refract-" + (++refraction.n); el.setAttribute("data-refract-id", id); }
    var w = Math.max(1, Math.round(el.offsetWidth)), h = Math.max(1, Math.round(el.offsetHeight));
    var f = refraction.defs.querySelector("#" + id);
    if (!f) {
      f = doc.createElementNS(NS, "filter");
      f.setAttribute("id", id);
      f.setAttribute("filterUnits", "userSpaceOnUse");
      f.setAttribute("primitiveUnits", "userSpaceOnUse");
      f.setAttribute("color-interpolation-filters", "sRGB");
      var img = doc.createElementNS(NS, "feImage");
      img.setAttribute("preserveAspectRatio", "none");
      img.setAttribute("result", "map");
      var disp = doc.createElementNS(NS, "feDisplacementMap");
      disp.setAttribute("in", "SourceGraphic");
      disp.setAttribute("in2", "map");
      disp.setAttribute("xChannelSelector", "R");
      disp.setAttribute("yChannelSelector", "G");
      f.appendChild(img); f.appendChild(disp);
      refraction.defs.appendChild(f);
    }
    var scale = cssNumber("--refraction-scale", 18), edge = cssNumber("--refraction-edge", 16);
    ["x", "y"].forEach(function (a) { f.setAttribute(a, "0"); });
    f.setAttribute("width", w); f.setAttribute("height", h);
    var fe = f.firstChild;
    fe.setAttribute("x", "0"); fe.setAttribute("y", "0"); fe.setAttribute("width", w); fe.setAttribute("height", h);
    fe.setAttribute("href", displacementMap(w, h, edge));
    f.lastChild.setAttribute("scale", String(scale));
    el.style.setProperty("--lg-refract", "url(#" + id + ")");
  }
  function enableRefraction(options) {
    options = options || {};
    var scope = options.root || doc;
    if (!options.force) {
      if (!isChromium()) return false;
      if (mq("(prefers-reduced-transparency: reduce)").matches || mq("(prefers-contrast: more)").matches || mq("(forced-colors: active)").matches) return false;
      if (navigator.deviceMemory && navigator.deviceMemory < 4) return false;
    }
    if (!refraction.defs) {
      var svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("width", "0"); svg.setAttribute("height", "0");
      svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
      refraction.defs = doc.createElementNS("http://www.w3.org/2000/svg", "defs");
      svg.appendChild(refraction.defs);
      doc.body.appendChild(svg);
      if (typeof ResizeObserver === "function") {
        refraction.ro = new ResizeObserver(function (entries) { entries.forEach(function (e) { buildFilter(e.target); }); });
      }
    }
    Array.prototype.forEach.call(scope.querySelectorAll("[data-refract]"), function (el) {
      buildFilter(el);
      if (refraction.ro) refraction.ro.observe(el);
    });
    root.setAttribute("data-refraction", "on");
    refraction.on = true;
    return true;
  }
  function disableRefraction() {
    root.removeAttribute("data-refraction");
    refraction.on = false;
  }

  /* ---------- tone under a floating bar ----------
     Reads the data-surface-tone of whatever sits under the centre of `node`, ignoring the bar itself (`own`),
     so light glass never sits on a dark section: <section data-surface-tone="dark">. */
  function toneUnder(node, own) {
    if (!doc.elementsFromPoint) return null;
    var r = node.getBoundingClientRect();
    if (!r.width) return null;
    var stack = doc.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    for (var i = 0; i < stack.length; i++) {
      /* skip the bar itself and any other floating layer: the tone comes from the surface beneath them */
      if (own.contains(stack[i]) || stack[i].closest(".lg-glass, .lg-navbar, .lg-tabbar, .lg-toolbar, .lg-scroll-edge")) continue;
      var s = stack[i].closest("[data-surface-tone]");
      return s ? s.getAttribute("data-surface-tone") : null;
    }
    return null;
  }

  /* ---------- FloatingNavbar ---------- */
  function FloatingNavbar(el, options) {
    if (known(el)) return known(el);
    options = options || {};
    var scroller = options.scrollContainer || window;
    var adaptive = options.adaptiveTone !== false;
    var ticking = false;
    var toggle = el.querySelector(".lg-navbar__menu-toggle");
    var menu = toggle ? doc.getElementById(toggle.getAttribute("aria-controls")) : null;
    var islands = Array.prototype.slice.call(el.querySelectorAll(".lg-navbar__island"));
    function y() { return scroller === window ? window.scrollY : scroller.scrollTop; }
    function isOpen() { return !!(toggle && toggle.getAttribute("aria-expanded") === "true"); }
    function sampleTone(node) { return toneUnder(node, el); }
    function update() {
      ticking = false;
      if (!el.hasAttribute("data-scroll-manual")) toggleAttr(el, "data-scrolled", y() > 4);
      if (adaptive) islands.forEach(function (isl) {
        var tone = sampleTone(isl);
        if (tone !== isl.getAttribute("data-tone")) setTone(isl, tone);
      });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    function setOpen(open, returnFocus) {
      if (!toggle || !menu) return;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      menu.hidden = !open;
      if (!open && returnFocus) toggle.focus();
    }
    function onToggle() { setOpen(!isOpen(), false); }
    function onKey(e) { if (e.key === "Escape" && isOpen()) { setOpen(false, true); } }
    function onDocClick(e) { if (isOpen() && !el.contains(e.target)) setOpen(false, false); }
    function onMenuClick(e) { if (e.target.closest && e.target.closest("a")) setOpen(false, false); }
    scroller.addEventListener("scroll", onScroll, { passive: true });
    if (toggle && menu) {
      toggle.addEventListener("click", onToggle);
      doc.addEventListener("keydown", onKey);
      doc.addEventListener("click", onDocClick);
      menu.addEventListener("click", onMenuClick);
    }
    update();
    return remember(el, {
      element: el,
      open: function () { setOpen(true); },
      close: function () { setOpen(false); },
      refresh: update,
      destroy: function () {
        scroller.removeEventListener("scroll", onScroll);
        if (toggle && menu) {
          toggle.removeEventListener("click", onToggle);
          doc.removeEventListener("keydown", onKey);
          doc.removeEventListener("click", onDocClick);
          menu.removeEventListener("click", onMenuClick);
        }
        if (bound) bound.delete(el);
      }
    });
  }

  /* ---------- GlassButton ---------- */
  function GlassButton(el, options) {
    if (known(el)) return known(el);
    options = options || {};
    var isToggle = options.toggle || el.hasAttribute("aria-pressed");
    function onClick(e) {
      if (el.getAttribute("aria-disabled") === "true") { e.preventDefault(); e.stopImmediatePropagation(); return; }
      if (isToggle) {
        var next = el.getAttribute("aria-pressed") !== "true";
        el.setAttribute("aria-pressed", next ? "true" : "false");
        if (options.onToggle) options.onToggle(next, el);
      }
    }
    el.addEventListener("click", onClick, true);
    return remember(el, {
      element: el,
      setDisabled: function (on) { if (on) el.setAttribute("aria-disabled", "true"); else el.removeAttribute("aria-disabled"); },
      destroy: function () { el.removeEventListener("click", onClick, true); if (bound) bound.delete(el); }
    });
  }

  /* ---------- SegmentedControl ---------- */
  function SegmentedControl(el, options) {
    if (known(el)) return known(el);
    options = options || {};
    var items = Array.prototype.slice.call(el.querySelectorAll(".lg-segmented__item"));
    var attr = el.getAttribute("role") === "tablist" ? "aria-selected" : "aria-checked";
    var thumb = el.querySelector(".lg-segmented__thumb");
    if (!thumb) {
      thumb = doc.createElement("span");
      thumb.className = "lg-segmented__thumb";
      thumb.setAttribute("aria-hidden", "true");
      el.appendChild(thumb);
    }
    var dragging = false;
    function enabled(it) { return !isDisabled(it) && el.getAttribute("aria-disabled") !== "true"; }
    function current() {
      for (var i = 0; i < items.length; i++) if (items[i].getAttribute(attr) === "true") return items[i];
      return items[0];
    }
    function place() {
      var it = current();
      if (!it) return;
      thumb.style.setProperty("--lg-thumb-w", it.offsetWidth + "px");
      thumb.style.setProperty("--lg-thumb-x", it.offsetLeft + "px");
    }
    function select(it, focus, emit) {
      if (!it || !enabled(it)) return;
      var changed = it.getAttribute(attr) !== "true";
      items.forEach(function (i) {
        var on = i === it;
        i.setAttribute(attr, on ? "true" : "false");
        i.tabIndex = on ? 0 : -1;
      });
      place();
      if (focus) it.focus();
      if (emit && changed) {
        var detail = { index: items.indexOf(it), value: it.getAttribute("data-value") || it.textContent.trim() };
        if (options.onChange) options.onChange(detail.index, detail.value, it);
        el.dispatchEvent(new CustomEvent("lg:change", { detail: detail, bubbles: true }));
      }
    }
    function step(from, dir) {
      var i = items.indexOf(from);
      for (var n = 0; n < items.length; n++) {
        i = (i + dir + items.length) % items.length;
        if (enabled(items[i])) return items[i];
      }
      return from;
    }
    function onKey(e) {
      var rtl = getComputedStyle(el).direction === "rtl";
      var it = e.target.closest(".lg-segmented__item");
      if (!it) return;
      var next = null;
      if (e.key === "ArrowRight") next = step(it, rtl ? -1 : 1);
      else if (e.key === "ArrowLeft") next = step(it, rtl ? 1 : -1);
      else if (e.key === "ArrowDown") next = step(it, 1);
      else if (e.key === "ArrowUp") next = step(it, -1);
      else if (e.key === "Home") next = step(items[items.length - 1], 1);
      else if (e.key === "End") next = step(items[0], -1);
      if (next) { e.preventDefault(); select(next, true, true); }
    }
    function itemAt(x) {
      for (var i = 0; i < items.length; i++) {
        var r = items[i].getBoundingClientRect();
        if (x >= r.left && x <= r.right) return items[i];
      }
      return null;
    }
    function onDown(e) {
      var it = e.target.closest(".lg-segmented__item");
      if (!it || !enabled(it) || e.button > 0) return;
      dragging = true;
      el.setAttribute("data-pressed", "");
      if (el.setPointerCapture) { try { el.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } }
    }
    function onMove(e) { if (dragging) { var it = itemAt(e.clientX); if (it) select(it, false, true); } }
    function onUp(e) {
      if (!dragging) return;
      dragging = false;
      el.removeAttribute("data-pressed");
      var it = itemAt(e.clientX);
      if (it) select(it, false, true);
    }
    function onClick(e) { var it = e.target.closest(".lg-segmented__item"); if (it) select(it, false, true); }
    items.forEach(function (i) { i.tabIndex = i.getAttribute(attr) === "true" ? 0 : -1; if (i.tagName === "BUTTON" && !i.type) i.type = "button"; });
    if (!items.some(function (i) { return i.getAttribute(attr) === "true"; }) && items[0]) { items[0].setAttribute(attr, "true"); items[0].tabIndex = 0; }
    el.addEventListener("keydown", onKey);
    el.addEventListener("click", onClick);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    var ro = typeof ResizeObserver === "function" ? new ResizeObserver(place) : null;
    if (ro) ro.observe(el);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(place);
    place();
    el.setAttribute("data-ready", "");
    return remember(el, {
      element: el,
      select: function (index) { select(items[index], false, true); },
      get index() { return items.indexOf(current()); },
      destroy: function () {
        el.removeEventListener("keydown", onKey);
        el.removeEventListener("click", onClick);
        el.removeEventListener("pointerdown", onDown);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointercancel", onUp);
        if (ro) ro.disconnect();
        el.removeAttribute("data-ready");
        if (bound) bound.delete(el);
      }
    });
  }

  /* ---------- Toolbar: one tab stop, arrow keys move between buttons ---------- */
  function Toolbar(el, options) {
    if (known(el)) return known(el);
    options = options || {};
    function buttons() {
      return Array.prototype.slice.call(el.querySelectorAll(".lg-btn")).filter(function (b) { return !b.disabled && b.offsetParent !== null; });
    }
    /* one tab stop: every button but the current one leaves the tab order, disabled ones included */
    function rove(current) {
      Array.prototype.forEach.call(el.querySelectorAll(".lg-btn"), function (b) { b.tabIndex = b === current ? 0 : -1; });
    }
    rove(buttons()[0]);
    function onKey(e) {
      var list = buttons();
      var i = list.indexOf(e.target);
      if (i < 0) return;
      var rtl = getComputedStyle(el).direction === "rtl";
      var next;
      if (e.key === "ArrowRight") next = i + (rtl ? -1 : 1);
      else if (e.key === "ArrowLeft") next = i + (rtl ? 1 : -1);
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = list.length - 1;
      else return;
      next = (next + list.length) % list.length;
      if (list[next]) {
        e.preventDefault();
        rove(list[next]);
        list[next].focus();
      }
    }
    function onFocus(e) {
      var list = buttons();
      if (list.indexOf(e.target) >= 0) rove(e.target);
    }
    el.addEventListener("keydown", onKey);
    el.addEventListener("focusin", onFocus);
    Array.prototype.forEach.call(el.querySelectorAll(".lg-btn[aria-pressed], .lg-btn[aria-disabled]"), function (b) { GlassButton(b); });
    return remember(el, {
      element: el,
      destroy: function () { el.removeEventListener("keydown", onKey); el.removeEventListener("focusin", onFocus); if (bound) bound.delete(el); }
    });
  }

  /* ---------- Modal: native <dialog> with an animated close ---------- */
  function Modal(dialog, options) {
    if (known(dialog)) return known(dialog);
    options = options || {};
    var opener = null;
    /* a sheet that grows to full height turns opaque to keep focus on the task:
       "full" = it has reached its max-height (it can't grow further), or it covers ≥ 90% of the viewport */
    function measure() {
      if (!dialog.open) return;
      var h = dialog.offsetHeight, max = parseFloat(getComputedStyle(dialog).maxHeight);
      toggleAttr(dialog, "data-expanded", h >= window.innerHeight * 0.9 || (max > 0 && h >= max - 2));
    }
    var ro = typeof ResizeObserver === "function" ? new ResizeObserver(measure) : null;
    function open(trigger) {
      opener = trigger || doc.activeElement;
      if (!dialog.open) dialog.showModal();
      measure();
      if (ro) ro.observe(dialog);
      window.addEventListener("resize", measure);
      if (options.onOpen) options.onOpen(dialog);
    }
    function close(value) {
      if (!dialog.open || dialog.hasAttribute("data-closing")) return;
      var surface = dialog.querySelector(".lg-modal__surface") || dialog;
      var done = false;
      function finish() {
        if (done) return;
        done = true;
        dialog.removeAttribute("data-closing");
        dialog.close(value == null ? "" : String(value));
      }
      dialog.setAttribute("data-closing", "");
      surface.addEventListener("animationend", finish, { once: true });
      setTimeout(finish, 420);
    }
    function onCancel(e) { e.preventDefault(); close("cancel"); }
    function onClick(e) {
      if (e.target === dialog && options.dismissOnBackdrop !== false) close("backdrop");
      var c = e.target.closest && e.target.closest("[data-lg-close]");
      if (c && dialog.contains(c)) close(c.value || c.getAttribute("data-lg-close") || "close");
    }
    function onClose() {
      if (ro) ro.unobserve(dialog);
      window.removeEventListener("resize", measure);
      if (options.onClose) options.onClose(dialog.returnValue, dialog);
      if (opener && opener.focus && doc.contains(opener)) opener.focus();
    }
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("click", onClick);
    dialog.addEventListener("close", onClose);
    return remember(dialog, {
      element: dialog,
      open: open,
      close: close,
      destroy: function () {
        dialog.removeEventListener("cancel", onCancel);
        dialog.removeEventListener("click", onClick);
        dialog.removeEventListener("close", onClose);
        if (bound) bound.delete(dialog);
      }
    });
  }

  /* ---------- GlassPanel: optional show/hide with Escape and outside-click dismissal ---------- */
  function GlassPanel(el, options) {
    if (known(el)) return known(el);
    options = options || {};
    var trigger = options.trigger || (el.id ? doc.querySelector('[aria-controls="' + el.id + '"]') : null);
    function shown() { return !el.hidden; }
    /* grow out of the trigger: point the transform origin at the side of the panel nearest the control */
    function aim() {
      if (!trigger) return;
      /* measure without the entrance animation's scale, then let it run from the new origin */
      el.style.animation = "none";
      var t = trigger.getBoundingClientRect(), p = el.getBoundingClientRect();
      el.style.animation = "";
      if (!p.width) return;
      var x = Math.max(0, Math.min(p.width, t.left + t.width / 2 - p.left));
      var y = t.top + t.height / 2 < p.top + p.height / 2 ? 0 : p.height;
      el.style.setProperty("--lg-origin", Math.round(x) + "px " + Math.round(y) + "px");
    }
    function show() { el.hidden = false; aim(); if (trigger) trigger.setAttribute("aria-expanded", "true"); }
    function hide(returnFocus) {
      el.hidden = true;
      if (trigger) { trigger.setAttribute("aria-expanded", "false"); if (returnFocus) trigger.focus(); }
    }
    function onKey(e) { if (options.dismissible !== false && e.key === "Escape" && shown()) hide(true); }
    function onDoc(e) {
      if (options.dismissible === false || !shown()) return;
      if (!el.contains(e.target) && !(trigger && trigger.contains(e.target))) hide(false);
    }
    function onTrigger() { if (shown()) hide(false); else show(); }
    doc.addEventListener("keydown", onKey);
    doc.addEventListener("click", onDoc);
    if (trigger) trigger.addEventListener("click", onTrigger);
    return remember(el, {
      element: el,
      show: show,
      hide: hide,
      toggle: onTrigger,
      destroy: function () {
        doc.removeEventListener("keydown", onKey);
        doc.removeEventListener("click", onDoc);
        if (trigger) trigger.removeEventListener("click", onTrigger);
        if (bound) bound.delete(el);
      }
    });
  }

  /* ---------- TabBar (< 744px): minimizes while scrolling down, expands when scrolling back up ---------- */
  function TabBar(el, options) {
    if (known(el)) return known(el);
    options = options || {};
    var scroller = options.scrollContainer || window;
    var mode = options.minimize || el.getAttribute("data-minimize") || "scroll-down";
    var adaptive = options.adaptiveTone !== false;
    var parts = Array.prototype.slice.call(el.querySelectorAll(".lg-tabbar__tabs, .lg-tabbar__search"));
    var last = 0, ticking = false;
    function tone() {
      if (adaptive) parts.forEach(function (p) {
        var t = toneUnder(p, el);
        if (t !== p.getAttribute("data-tone")) setTone(p, t);
      });
    }
    function y() { return scroller === window ? window.scrollY : scroller.scrollTop; }
    function update() {
      ticking = false;
      tone();
      if (el.hasAttribute("data-scroll-manual")) return;
      var now = y();
      toggleAttr(el, "data-scrolled", now > 4);
      if (mode !== "off") {
        var down = now > last + 4, up = now < last - 4;
        if ((mode === "scroll-down" && down) || (mode === "scroll-up" && up)) toggleAttr(el, "data-minimized", now > 48);
        else if ((mode === "scroll-down" && up) || (mode === "scroll-up" && down) || now <= 48) toggleAttr(el, "data-minimized", false);
      }
      last = now;
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    function onFocus() { toggleAttr(el, "data-minimized", false); }
    scroller.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("focusin", onFocus);
    update();
    return remember(el, {
      element: el,
      setMinimized: function (on) { toggleAttr(el, "data-minimized", !!on); },
      destroy: function () { scroller.removeEventListener("scroll", onScroll); el.removeEventListener("focusin", onFocus); if (bound) bound.delete(el); }
    });
  }

  /* ---------- toast: one polite live region, one message at a time ---------- */
  var toastEl = null, toastTimer = null;
  function toast(message, options) {
    options = options || {};
    var host = options.root || doc.body;
    if (!toastEl || toastEl.parentNode !== host) {
      if (toastEl && toastEl.parentNode) toastEl.parentNode.removeChild(toastEl);
      toastEl = doc.createElement("div");
      toastEl.className = "lg-toast lg-glass lg-glass--popover" + (host !== doc.body ? " lg-toast--contained" : "");
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      host.appendChild(toastEl);
    }
    toastEl.hidden = false;
    toastEl.textContent = "";
    /* re-insert the text on the next frame so screen readers announce repeated messages */
    requestAnimationFrame(function () { toastEl.textContent = String(message); });
    clearTimeout(toastTimer);
    var ms = options.timeout == null ? 2800 : options.timeout;
    if (ms > 0) toastTimer = setTimeout(function () { if (toastEl) toastEl.hidden = true; }, ms);
    return toastEl;
  }

  /* ---------- keyboard: bottom bars ride above the on-screen keyboard ----------
     Sets html --lg-keyboard-inset (px) from visualViewport; .lg-tabbar and .lg-toolbar--float use it.
     Ignored while the page is pinch-zoomed, so zooming never moves the bars. */
  var keyboardBound = false;
  function trackKeyboard() {
    var vv = window.visualViewport;
    if (keyboardBound || !vv) return;
    keyboardBound = true;
    var root = doc.documentElement, raf = 0;
    function update() {
      raf = 0;
      var inset = Math.abs(vv.scale - 1) > 0.01 ? 0 : Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
      root.style.setProperty("--lg-keyboard-inset", inset + "px");
      toggleAttr(root, "data-keyboard", inset > 80);
    }
    function queue() { if (!raf) raf = requestAnimationFrame(update); }
    vv.addEventListener("resize", queue);
    vv.addEventListener("scroll", queue);
    update();
  }

  /* ---------- init: bind everything marked with data-lg ---------- */
  function init(scope, options) {
    scope = scope || doc;
    options = options || {};
    var out = [];
    trackKeyboard();
    refreshTones(scope);
    var map = { navbar: FloatingNavbar, tabbar: TabBar, segmented: SegmentedControl, toolbar: Toolbar, modal: Modal, button: GlassButton, panel: GlassPanel };
    Array.prototype.forEach.call(scope.querySelectorAll("[data-lg]"), function (el) {
      var fn = map[el.getAttribute("data-lg")];
      if (fn) out.push(fn(el, options[el.getAttribute("data-lg")]));
    });
    Array.prototype.forEach.call(scope.querySelectorAll("[data-lg-open]"), function (btn) {
      if (btn.__lgOpen) return;
      btn.__lgOpen = true;
      btn.addEventListener("click", function () {
        var d = doc.querySelector(btn.getAttribute("data-lg-open"));
        if (d) Modal(d).open(btn);
      });
    });
    if (options.refraction !== false) enableRefraction({ root: scope });
    return out;
  }

  var api = {
    version: "3.2.0",
    init: init,
    applyTheme: applyTheme,
    preferences: preferences,
    enableRefraction: enableRefraction,
    disableRefraction: disableRefraction,
    supportsRefraction: isChromium,
    setTone: setTone,
    toast: toast,
    FloatingNavbar: FloatingNavbar,
    TabBar: TabBar,
    GlassButton: GlassButton,
    SegmentedControl: SegmentedControl,
    Toolbar: Toolbar,
    Modal: Modal,
    GlassPanel: GlassPanel
  };
  window.LiquidGlass = Object.assign(window.LiquidGlass || {}, api);
})();
