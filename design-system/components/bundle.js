/* @ds-bundle: {"format":4,"namespace":"LiquidGlass","components":[{"name":"FloatingNavbar"},{"name":"GlassButton"},{"name":"SegmentedControl"},{"name":"Toolbar"},{"name":"Modal"},{"name":"GlassPanel"},{"name":"Composer"},{"name":"SelectList"}]} */
/* Liquid Glass Web — behaviour for the components in bundle.css. Framework-free; every function
   enhances markup that already works without JavaScript. Nothing runs until you call it.
   Contract for every controller: it owns only the DOM it was given, it reads callbacks at call time
   (so a host can swap them), and destroy() releases everything it added and is safe to call twice. */
(function () {
  "use strict";
  var doc = document;
  var root = doc.documentElement;
  var STORE = "lg-preferences";
  var bound = typeof WeakMap === "function" ? new WeakMap() : null;
  var registry = typeof Set === "function" ? new Set() : null;
  var slice = function (list) { return Array.prototype.slice.call(list); };
  var isApple = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || "");

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
  function rendered(el) { return !el.hidden && el.getClientRects().length > 0; }
  /* every controller goes through here: one per element, destroy() is idempotent and leaves the registry */
  function remember(el, ctrl) {
    var inner = ctrl.destroy, dead = false;
    ctrl.destroy = function () {
      if (dead) return;
      dead = true;
      if (inner) inner();
      if (bound && bound.get(el) === ctrl) bound.delete(el);
      if (registry) registry.delete(ctrl);
    };
    if (bound) bound.set(el, ctrl);
    if (registry) registry.add(ctrl);
    return ctrl;
  }
  function known(el) { return bound ? bound.get(el) : null; }

  /* ---------- Overlay stack: one Escape closes one layer, the top one ----------
     Navbar menus, panels, menus and modals push themselves when they open. Escape goes to the top layer
     only; the layer that handles it cancels the key, so a native <dialog> underneath does not close too. */
  var layers = [];
  var escapeTaken = false;
  function pushLayer(l) { dropLayer(l); layers.push(l); }
  function dropLayer(l) { var i = layers.indexOf(l); if (i >= 0) layers.splice(i, 1); }
  function isTop(l) { return layers[layers.length - 1] === l; }
  function takeEscape(e) {
    e.preventDefault();
    escapeTaken = true;
    setTimeout(function () { escapeTaken = false; }, 0);
  }
  /* where focus goes back to: the element itself, or, if it is gone or hidden (an item of a closed menu),
     the visible control that names its container with aria-controls */
  function returnTarget(el) {
    for (var n = el; n && n !== doc.body; n = n.parentElement) {
      if (n === el && doc.contains(n) && rendered(n)) return n;
      if (n.id) {
        var c = doc.querySelector('[aria-controls="' + n.id + '"]');
        if (c && rendered(c)) return c;
      }
    }
    return null;
  }

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
    if (p.density === "compact" || p.density === "comfortable") root.setAttribute("data-density", p.density); else root.removeAttribute("data-density");
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
      density: p.density || "auto",
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
    slice((scope || doc).querySelectorAll("[data-tone]")).forEach(function (el) {
      setTone(el, el.getAttribute("data-tone"));
    });
  }
  if (typeof MutationObserver === "function") {
    new MutationObserver(function () { refreshTones(); }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  }

  /* ---------- Refraction (rung 2): SVG displacement inside backdrop-filter, Chromium only ----------
     Disable stops the work (no resize observation) and keeps the built filters as a cache; an element that
     leaves the document, or a root passed to destroy(), releases its filter for good. */
  var refraction = { on: false, defs: null, n: 0, ro: null, els: typeof Set === "function" ? new Set() : null };
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
  function releaseRefraction(el) {
    if (refraction.ro) refraction.ro.unobserve(el);
    if (refraction.els) refraction.els.delete(el);
    var id = el.getAttribute("data-refract-id");
    var f = id && refraction.defs ? refraction.defs.querySelector("#" + id) : null;
    if (f) f.parentNode.removeChild(f);
    el.removeAttribute("data-refract-id");
    el.style.removeProperty("--lg-refract");
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
    }
    if (!refraction.ro && typeof ResizeObserver === "function") {
      refraction.ro = new ResizeObserver(function (entries) {
        entries.forEach(function (e) { if (e.target.isConnected) buildFilter(e.target); else releaseRefraction(e.target); });
      });
    }
    slice(scope.querySelectorAll("[data-refract]")).forEach(function (el) {
      buildFilter(el);
      if (refraction.ro) refraction.ro.observe(el);
      if (refraction.els) refraction.els.add(el);
    });
    root.setAttribute("data-refraction", "on");
    refraction.on = true;
    return true;
  }
  function disableRefraction() {
    root.removeAttribute("data-refraction");
    if (refraction.ro) { refraction.ro.disconnect(); refraction.ro = null; }
    if (refraction.els) refraction.els.clear();
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
    var islands = slice(el.querySelectorAll(".lg-navbar__island"));
    var layer = { element: menu };
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
      if (open) pushLayer(layer); else dropLayer(layer);
      if (!open && returnFocus) toggle.focus();
    }
    function onToggle() { setOpen(!isOpen(), false); }
    function onKey(e) { if (e.key === "Escape" && isOpen() && !e.defaultPrevented && isTop(layer)) { takeEscape(e); setOpen(false, true); } }
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
        dropLayer(layer);
        if (toggle && menu) {
          toggle.removeEventListener("click", onToggle);
          doc.removeEventListener("keydown", onKey);
          doc.removeEventListener("click", onDocClick);
          menu.removeEventListener("click", onMenuClick);
        }
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
      destroy: function () { el.removeEventListener("click", onClick, true); }
    });
  }

  /* ---------- SegmentedControl ----------
     State has two parts: the committed item (the value) and the shown item (what the thumb and aria state show).
     They differ only while a drag previews another item; release commits once, a cancelled gesture reverts.
     options.controlled: a change is only a request (onChange); the host commits it with select(i, { emit: false }).
     Tabs (role="tablist") show the panel named by each item's aria-controls and hide the rest. */
  function SegmentedControl(el, options) {
    if (known(el)) return known(el);
    options = options || {};
    var tabs = el.getAttribute("role") === "tablist";
    var attr = tabs ? "aria-selected" : "aria-checked";
    var vertical = el.getAttribute("aria-orientation") === "vertical";
    var manual = (options.activation || el.getAttribute("data-activation")) === "manual";
    var items = [];
    var committed = null, drag = null, swallowClick = false, pending = 0;
    var thumb = el.querySelector(".lg-segmented__thumb");
    if (!thumb) {
      thumb = doc.createElement("span");
      thumb.className = "lg-segmented__thumb";
      thumb.setAttribute("aria-hidden", "true");
      el.appendChild(thumb);
    }
    function collect() {
      items = slice(el.querySelectorAll(".lg-segmented__item"));
      items.forEach(function (i) { if (i.tagName === "BUTTON" && !i.getAttribute("type")) i.type = "button"; });
    }
    function enabled(it) { return !!it && !isDisabled(it) && el.getAttribute("aria-disabled") !== "true"; }
    function shown() {
      for (var i = 0; i < items.length; i++) if (items[i].getAttribute(attr) === "true") return items[i];
      return null;
    }
    /* the data identity of an item: data-value, else its label without badges or hidden helper text */
    function valueOf(it) {
      if (!it) return null;
      var v = it.getAttribute("data-value");
      if (v != null) return v;
      var t = "";
      slice(it.childNodes).forEach(function (n) {
        if (n.nodeType === 3) t += n.textContent;
        else if (n.nodeType === 1 && !n.matches(".lg-badge, .lg-sr-only, svg")) t += n.textContent;
      });
      return t.trim();
    }
    function place() {
      var it = shown();
      if (!it) return;
      thumb.style.setProperty("--lg-thumb-w", it.offsetWidth + "px");
      thumb.style.setProperty("--lg-thumb-x", it.offsetLeft + "px");
    }
    function show(it) {
      items.forEach(function (i) { i.setAttribute(attr, i === it ? "true" : "false"); });
      place();
      if (tabs) items.forEach(function (i) {
        var id = i.getAttribute("aria-controls"), panel = id ? doc.getElementById(id) : null;
        if (panel) panel.hidden = i !== it;
      });
    }
    function stop(it) { items.forEach(function (i) { i.tabIndex = i === it ? 0 : -1; }); }
    function detail(it) { return { index: items.indexOf(it), value: valueOf(it) }; }
    function emit(it) {
      var d = detail(it);
      if (options.onChange) options.onChange(d.index, d.value, it);
      el.dispatchEvent(new CustomEvent("lg:change", { detail: d, bubbles: true }));
    }
    /* user intent: commit (or request, when controlled) */
    function choose(it, focus) {
      if (!enabled(it)) { show(committed); return; }
      if (focus) it.focus();
      if (it === committed) { show(committed); stop(committed); return; }
      if (options.controlled) {
        show(it); stop(it);
        emit(it);
        /* the host accepts by calling select(); if it has not by the next frame, the request was declined */
        cancelAnimationFrame(pending);
        pending = requestAnimationFrame(function () {
          if (committed !== it) {
            var refocus = doc.activeElement === it;
            show(committed); stop(committed);
            if (refocus && committed) committed.focus();
          }
        });
        return;
      }
      committed = it;
      show(it); stop(it);
      emit(it);
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
      swallowClick = false;
      var it = e.target.closest(".lg-segmented__item");
      if (!it) return;
      var rtl = getComputedStyle(el).direction === "rtl";
      var horizontalKeys = !vertical, verticalKeys = vertical || !tabs;
      var next = null;
      if (horizontalKeys && e.key === "ArrowRight") next = step(it, rtl ? -1 : 1);
      else if (horizontalKeys && e.key === "ArrowLeft") next = step(it, rtl ? 1 : -1);
      else if (verticalKeys && e.key === "ArrowDown") next = step(it, 1);
      else if (verticalKeys && e.key === "ArrowUp") next = step(it, -1);
      else if (e.key === "Home") next = step(items[items.length - 1], 1);
      else if (e.key === "End") next = step(items[0], -1);
      if (!next) return;
      e.preventDefault();
      if (manual) { stop(next); next.focus(); } else choose(next, true);
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
      swallowClick = false;
      if (!it || !enabled(it) || e.button > 0) return;
      drag = { start: committed, over: shown() };
      el.setAttribute("data-pressed", "");
      if (el.setPointerCapture) { try { el.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } }
    }
    function onMove(e) {
      if (!drag) return;
      var it = itemAt(e.clientX);
      if (!it || !enabled(it) || it === drag.over) return;
      drag.over = it;
      show(it);
      if (options.onPreview) { var d = detail(it); options.onPreview(d.index, d.value, it); }
    }
    function onUp(e) {
      if (!drag) return;
      var it = itemAt(e.clientX) || drag.over;
      drag = null;
      el.removeAttribute("data-pressed");
      swallowClick = true;
      choose(it, false);
    }
    function onCancel() {
      if (!drag) return;
      var start = drag.start;
      drag = null;
      el.removeAttribute("data-pressed");
      show(start);
    }
    function onClick(e) {
      var it = e.target.closest(".lg-segmented__item");
      if (swallowClick) { swallowClick = false; return; }
      if (it) choose(it, false);
    }
    function refresh() {
      collect();
      var keep = committed && items.indexOf(committed) >= 0 ? committed : null;
      if (!keep && committed) {
        var v = valueOf(committed);
        for (var i = 0; i < items.length; i++) if (valueOf(items[i]) === v) { keep = items[i]; break; }
      }
      if (!keep) keep = shown();
      if (!keep || !enabled(keep)) keep = items.filter(enabled)[0] || items[0] || null;
      committed = keep;
      show(keep); stop(keep);
    }
    collect();
    committed = shown() || items.filter(enabled)[0] || items[0] || null;
    show(committed); stop(committed);
    el.addEventListener("keydown", onKey);
    el.addEventListener("click", onClick);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onCancel);
    el.addEventListener("lostpointercapture", onCancel);
    var ro = typeof ResizeObserver === "function" ? new ResizeObserver(place) : null;
    if (ro) ro.observe(el);
    var mo = typeof MutationObserver === "function" ? new MutationObserver(function (list) {
      if (list.some(function (m) { return m.type === "childList"; })) refresh();
    }) : null;
    if (mo) mo.observe(el, { childList: true });
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(place);
    place();
    el.setAttribute("data-ready", "");
    return remember(el, {
      element: el,
      /* commit by index; { emit: false } syncs from the host (controlled mode) without another onChange */
      select: function (index, o) {
        var it = items[index];
        if (!it) return;
        var changed = it !== committed;
        committed = it;
        show(it); stop(it);
        if (changed && !(o && o.emit === false)) emit(it);
      },
      refresh: refresh,
      get index() { return items.indexOf(committed); },
      get value() { return valueOf(committed); },
      destroy: function () {
        el.removeEventListener("keydown", onKey);
        el.removeEventListener("click", onClick);
        el.removeEventListener("pointerdown", onDown);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointercancel", onCancel);
        el.removeEventListener("lostpointercapture", onCancel);
        cancelAnimationFrame(pending);
        if (ro) ro.disconnect();
        if (mo) mo.disconnect();
        el.removeAttribute("data-ready");
      }
    });
  }

  /* ---------- Toolbar: one tab stop, arrow keys move between buttons ----------
     The tab stop is re-checked whenever buttons are hidden, disabled, added or removed, so the toolbar
     always keeps exactly one way in. aria-disabled buttons stay reachable (discoverable, not runnable);
     native disabled and hidden ones are skipped. */
  function Toolbar(el, options) {
    if (known(el)) return known(el);
    options = options || {};
    var current = null;
    function usable(b) {
      if (b.disabled || b.hidden) return false;
      var h = b.closest("[hidden]");
      if (h && el.contains(h)) return false;
      /* not rendered yet (for example inside a closed dialog): trust the attributes */
      if (el.getClientRects().length === 0) return true;
      return b.getClientRects().length > 0;
    }
    function buttons() { return slice(el.querySelectorAll(".lg-btn")).filter(usable); }
    /* every button but the current one leaves the tab order, disabled ones included */
    function rove(next) {
      current = next || null;
      slice(el.querySelectorAll(".lg-btn")).forEach(function (b) { b.tabIndex = b === current ? 0 : -1; });
    }
    function refresh() {
      var list = buttons();
      rove(current && list.indexOf(current) >= 0 ? current : list[0]);
    }
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
      if (buttons().indexOf(e.target) >= 0) rove(e.target);
    }
    refresh();
    el.addEventListener("keydown", onKey);
    el.addEventListener("focusin", onFocus);
    var mo = typeof MutationObserver === "function" ? new MutationObserver(refresh) : null;
    if (mo) mo.observe(el, { subtree: true, childList: true, attributes: true, attributeFilter: ["hidden", "disabled", "aria-disabled", "class"] });
    var ro = typeof ResizeObserver === "function" ? new ResizeObserver(refresh) : null;
    if (ro) ro.observe(el);
    slice(el.querySelectorAll(".lg-btn[aria-pressed], .lg-btn[aria-disabled]")).forEach(function (b) { GlassButton(b); });
    return remember(el, {
      element: el,
      refresh: refresh,
      destroy: function () {
        el.removeEventListener("keydown", onKey);
        el.removeEventListener("focusin", onFocus);
        if (mo) mo.disconnect();
        if (ro) ro.disconnect();
      }
    });
  }

  /* ---------- Modal: native <dialog> with an animated close ----------
     Every way out is a close request with a reason ("escape", "backdrop", "close-button"); beforeClose(reason)
     or an "lg:closerequest" listener can refuse it, for example to keep a draft. close() from code always closes. */
  function Modal(dialog, options) {
    if (known(dialog)) return known(dialog);
    options = options || {};
    var opener = null, pressedOutside = false, watching = false;
    var layer = { element: dialog };
    /* a sheet that grows to full height turns opaque to keep focus on the task:
       "full" = it has reached its max-height (it can't grow further), or it covers ≥ 90% of the viewport */
    function measure() {
      if (!dialog.open) return;
      var h = dialog.offsetHeight, max = parseFloat(getComputedStyle(dialog).maxHeight);
      toggleAttr(dialog, "data-expanded", h >= window.innerHeight * 0.9 || (max > 0 && h >= max - 2));
    }
    var ro = typeof ResizeObserver === "function" ? new ResizeObserver(measure) : null;
    function watch(on) {
      if (on === watching) return;
      watching = on;
      if (on) { if (ro) ro.observe(dialog); window.addEventListener("resize", measure); }
      else { if (ro) ro.unobserve(dialog); window.removeEventListener("resize", measure); }
    }
    function open(trigger) {
      opener = trigger || doc.activeElement;
      if (!dialog.open) dialog.showModal();
      pushLayer(layer);
      measure();
      watch(true);
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
    function request(reason, value) {
      if (options.beforeClose && options.beforeClose(reason, dialog) === false) return false;
      if (!dialog.dispatchEvent(new CustomEvent("lg:closerequest", { cancelable: true, detail: { reason: reason } }))) return false;
      close(value);
      return true;
    }
    /* outside = on the ::backdrop: the click lands on the <dialog> itself, beyond its border box */
    function outside(e) {
      if (e.target !== dialog) return false;
      var r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    }
    function onCancel(e) {
      e.preventDefault();
      if (escapeTaken || !isTop(layer)) return;
      request("escape", "cancel");
    }
    function onDown(e) { pressedOutside = outside(e); }
    function onClick(e) {
      var fromBackdrop = pressedOutside && outside(e);
      pressedOutside = false;
      if (fromBackdrop && options.dismissOnBackdrop !== false) { request("backdrop", "backdrop"); return; }
      var c = e.target.closest && e.target.closest("[data-lg-close]");
      if (c && dialog.contains(c)) request("close-button", c.value || c.getAttribute("data-lg-close") || "close");
    }
    function onClose() {
      watch(false);
      dropLayer(layer);
      hideToastIn(dialog);
      if (options.onClose) options.onClose(dialog.returnValue, dialog);
      var back = opener ? returnTarget(opener) : null;
      if (back && back.focus) back.focus();
    }
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("pointerdown", onDown);
    dialog.addEventListener("click", onClick);
    dialog.addEventListener("close", onClose);
    return remember(dialog, {
      element: dialog,
      open: open,
      close: close,
      requestClose: function (reason) { return request(reason || "api"); },
      destroy: function () {
        dialog.removeEventListener("cancel", onCancel);
        dialog.removeEventListener("pointerdown", onDown);
        dialog.removeEventListener("click", onClick);
        dialog.removeEventListener("close", onClose);
        watch(false);
        if (ro) ro.disconnect();
        dropLayer(layer);
      }
    });
  }

  /* ---------- GlassPanel: show/hide with Escape and outside-click dismissal ----------
     role="menu": the APG menu button pattern. Opening focuses the first item (ArrowUp on the trigger: the last);
     arrows, Home, End and a typed character move between visible items; Escape returns to the trigger; Tab leaves
     and closes; activating an item closes the menu. Items with aria-disabled="true" stay focusable but never run.
     role="dialog" (inline confirmation): opening focuses its first control. Other panels keep focus where it is. */
  function GlassPanel(el, options) {
    if (known(el)) return known(el);
    options = options || {};
    var trigger = options.trigger || (el.id ? doc.querySelector('[aria-controls="' + el.id + '"]') : null);
    var role = el.getAttribute("role");
    var isMenu = role === "menu";
    var layer = { element: el };
    var ITEM = '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], .lg-menu__item';
    if (trigger) {
      if (isMenu && !trigger.hasAttribute("aria-haspopup")) trigger.setAttribute("aria-haspopup", "menu");
      if (!trigger.hasAttribute("aria-expanded")) trigger.setAttribute("aria-expanded", el.hidden ? "false" : "true");
    }
    function shown() { return !el.hidden; }
    function items() { return slice(el.querySelectorAll(ITEM)).filter(rendered); }
    if (isMenu) slice(el.querySelectorAll(ITEM)).forEach(function (i) { i.tabIndex = -1; });
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
    function show(where) {
      el.hidden = false;
      aim();
      pushLayer(layer);
      if (trigger) trigger.setAttribute("aria-expanded", "true");
      if (where === false) return;
      if (isMenu) {
        var list = items();
        var to = where === "last" ? list[list.length - 1] : list[0];
        if (to) to.focus();
      } else if (role === "dialog") {
        var f = el.querySelector("button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex='-1'])");
        if (f) f.focus();
      }
    }
    function hide(returnFocus) {
      var was = shown();
      el.hidden = true;
      dropLayer(layer);
      if (trigger) { trigger.setAttribute("aria-expanded", "false"); if (returnFocus) trigger.focus(); }
      if (was && options.onHide) options.onHide(el);
    }
    function move(from, dir) {
      var list = items();
      if (!list.length) return;
      var i = list.indexOf(from);
      var to = dir === "first" ? list[0] : dir === "last" ? list[list.length - 1] : list[(i + dir + list.length) % list.length];
      if (to) to.focus();
    }
    function typeahead(from, ch) {
      var list = items();
      var start = list.indexOf(from);
      for (var n = 1; n <= list.length; n++) {
        var it = list[(start + n) % list.length];
        if (it.textContent.trim().toLowerCase().indexOf(ch) === 0) { it.focus(); return; }
      }
    }
    function onKey(e) {
      if (options.dismissible === false || e.key !== "Escape" || !shown() || e.defaultPrevented || !isTop(layer)) return;
      takeEscape(e);
      hide(true);
    }
    function onMenuKey(e) {
      var it = e.target.closest && e.target.closest(ITEM);
      if (!it || !el.contains(it)) return;
      if (e.key === "ArrowDown") { e.preventDefault(); move(it, 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); move(it, -1); }
      else if (e.key === "Home") { e.preventDefault(); move(it, "first"); }
      else if (e.key === "End") { e.preventDefault(); move(it, "last"); }
      else if (e.key === "Tab") hide(false);
      else if (e.key.length === 1 && /\S/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); typeahead(it, e.key.toLowerCase()); }
    }
    /* disabled guard: aria-disabled items look disabled and must be inert for pointer, keyboard and script alike */
    function onGuard(e) {
      var it = e.target.closest && e.target.closest(ITEM);
      if (it && el.contains(it) && it.getAttribute("aria-disabled") === "true") { e.preventDefault(); e.stopImmediatePropagation(); }
    }
    function onActivate(e) {
      if (!isMenu || e.defaultPrevented) return;
      var it = e.target.closest && e.target.closest(ITEM);
      if (!it || !el.contains(it) || it.hasAttribute("aria-haspopup") || it.hasAttribute("data-keep-open")) return;
      /* close after the item's own handler; return focus only if that handler did not move it elsewhere (a modal) */
      var focusInside = el.contains(doc.activeElement) || doc.activeElement === doc.body;
      hide(focusInside);
    }
    function onDoc(e) {
      if (options.dismissible === false || !shown()) return;
      if (!el.contains(e.target) && !(trigger && trigger.contains(e.target))) hide(false);
    }
    function onTrigger() { if (shown()) hide(false); else show(); }
    function onTriggerKey(e) {
      if (!isMenu || (e.key !== "ArrowDown" && e.key !== "ArrowUp")) return;
      e.preventDefault();
      show(e.key === "ArrowUp" ? "last" : "first");
    }
    doc.addEventListener("keydown", onKey);
    doc.addEventListener("click", onDoc);
    el.addEventListener("click", onGuard, true);
    el.addEventListener("click", onActivate);
    if (isMenu) el.addEventListener("keydown", onMenuKey);
    if (trigger) { trigger.addEventListener("click", onTrigger); trigger.addEventListener("keydown", onTriggerKey); }
    if (shown()) pushLayer(layer);
    return remember(el, {
      element: el,
      show: show,
      hide: hide,
      toggle: onTrigger,
      destroy: function () {
        doc.removeEventListener("keydown", onKey);
        doc.removeEventListener("click", onDoc);
        el.removeEventListener("click", onGuard, true);
        el.removeEventListener("click", onActivate);
        el.removeEventListener("keydown", onMenuKey);
        if (trigger) { trigger.removeEventListener("click", onTrigger); trigger.removeEventListener("keydown", onTriggerKey); }
        dropLayer(layer);
      }
    });
  }

  /* ---------- SelectList: a list of rows people choose from (role="listbox" > role="option") ----------
     Single selection follows focus (arrow keys select); with aria-multiselectable="true", arrows only move focus
     and Space or a click toggles, so moving never clears what was chosen. */
  function SelectList(el, options) {
    if (known(el)) return known(el);
    options = options || {};
    var multi = el.getAttribute("aria-multiselectable") === "true";
    function opts() { return slice(el.querySelectorAll('[role="option"]')).filter(function (o) { return !o.hidden; }); }
    function selected() { return opts().filter(function (o) { return o.getAttribute("aria-selected") === "true"; }); }
    function values() { return selected().map(function (o) { return o.getAttribute("data-value") || o.textContent.trim(); }); }
    function stop(o) { opts().forEach(function (x) { x.tabIndex = x === o ? 0 : -1; }); }
    function emit(o) {
      var d = { values: values(), index: opts().indexOf(o) };
      if (options.onChange) options.onChange(d.values, o);
      el.dispatchEvent(new CustomEvent("lg:change", { detail: d, bubbles: true }));
    }
    function pick(o) {
      if (!o || isDisabled(o)) return;
      if (multi) o.setAttribute("aria-selected", o.getAttribute("aria-selected") === "true" ? "false" : "true");
      else {
        if (o.getAttribute("aria-selected") === "true") return;
        opts().forEach(function (x) { x.setAttribute("aria-selected", x === o ? "true" : "false"); });
      }
      emit(o);
    }
    function onKey(e) {
      var o = e.target.closest('[role="option"]');
      if (!o) return;
      var list = opts(), i = list.indexOf(o), to = null;
      if (e.key === "ArrowDown") to = list[Math.min(list.length - 1, i + 1)];
      else if (e.key === "ArrowUp") to = list[Math.max(0, i - 1)];
      else if (e.key === "Home") to = list[0];
      else if (e.key === "End") to = list[list.length - 1];
      else if (e.key === " " || e.key === "Enter") { e.preventDefault(); pick(o); return; }
      else return;
      e.preventDefault();
      stop(to); to.focus();
      if (!multi) pick(to);
    }
    function onClick(e) {
      var o = e.target.closest('[role="option"]');
      if (!o || !el.contains(o)) return;
      stop(o);
      pick(o);
    }
    stop(selected()[0] || opts()[0]);
    el.addEventListener("keydown", onKey);
    el.addEventListener("click", onClick);
    return remember(el, {
      element: el,
      get values() { return values(); },
      select: function (index) { var o = opts()[index]; if (o) { stop(o); pick(o); } },
      refresh: function () { stop(selected()[0] || opts()[0]); },
      destroy: function () { el.removeEventListener("keydown", onKey); el.removeEventListener("click", onClick); }
    });
  }

  /* ---------- TabBar (< 744px): minimizes while scrolling down, expands when scrolling back up ----------
     Minimized, the bar gets shorter and drops its labels, but every destination keeps its icon: no destination
     is ever more than one tap away, and no gesture has to be guessed to get them back. */
  function TabBar(el, options) {
    if (known(el)) return known(el);
    options = options || {};
    var scroller = options.scrollContainer || window;
    var mode = options.minimize || el.getAttribute("data-minimize") || "scroll-down";
    var adaptive = options.adaptiveTone !== false;
    var parts = slice(el.querySelectorAll(".lg-tabbar__tabs, .lg-tabbar__search"));
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
      destroy: function () { scroller.removeEventListener("scroll", onScroll); el.removeEventListener("focusin", onFocus); }
    });
  }

  /* ---------- shortcuts: registered keys only ----------
     shortcut("k", fn) binds ⌘K on Apple platforms and Ctrl+K elsewhere. It ignores keys typed during IME
     composition and inside rich-text editors (contenteditable), where ⌘K usually means "insert link".
     The returned label ("⌘K" / "Ctrl K") is what a hint may show: show a hint only for a bound shortcut. */
  function prettyKeys(spec) {
    return String(spec).split(/\s+/)[0].split("+").map(function (k) {
      if (/^(Meta|Cmd|Command)$/i.test(k)) return isApple ? "⌘" : "Ctrl";
      if (/^(Control|Ctrl)$/i.test(k)) return isApple ? "⌃" : "Ctrl";
      if (/^Shift$/i.test(k)) return isApple ? "⇧" : "Shift";
      if (/^Alt$/i.test(k)) return isApple ? "⌥" : "Alt";
      return k.length === 1 ? k.toUpperCase() : k;
    }).join(isApple ? "" : " ");
  }
  function shortcut(key, handler, options) {
    options = options || {};
    key = String(key).toLowerCase();
    function onKey(e) {
      if (e.isComposing || e.keyCode === 229) return;
      var mod = isApple ? e.metaKey : e.ctrlKey, other = isApple ? e.ctrlKey : e.metaKey;
      if (!mod || other || e.altKey || !!e.shiftKey !== !!options.shift) return;
      if ((e.key || "").toLowerCase() !== key) return;
      var t = e.target;
      if (t && t.isContentEditable && !options.inEditable) return;
      e.preventDefault();
      handler(e);
    }
    doc.addEventListener("keydown", onKey);
    var spec = (isApple ? "Meta+" : "Control+") + (options.shift ? "Shift+" : "") + key.toUpperCase();
    return { label: prettyKeys(spec), aria: spec, destroy: function () { doc.removeEventListener("keydown", onKey); } };
  }

  /* ---------- Composer: an instruction field with a scope, a send button and host-owned async state ----------
     Send is enabled only when there is text. data-shortcut="k" (or options.shortcut) binds ⌘K / Ctrl+K to focus
     the input and writes the platform hint; without a bound shortcut the hint stays empty and hidden.
     setStatus("pending" | "error" | "idle", message): pending blocks a second submit and keeps the text;
     error keeps the text, shows the message in a status region and re-enables Send for a retry. */
  function Composer(form, options) {
    if (known(form)) return known(form);
    options = options || {};
    var input = form.querySelector(".lg-composer__input");
    var submit = form.querySelector('[type="submit"]');
    var hint = form.querySelector(".lg-composer__hint");
    var key = options.shortcut !== undefined ? options.shortcut : form.getAttribute("data-shortcut");
    var bind = null;
    var status = form.querySelector(".lg-composer__status");
    if (!status) {
      status = doc.createElement("span");
      status.className = "lg-composer__status";
      status.setAttribute("role", "status");
      if (submit) form.insertBefore(status, submit); else form.appendChild(status);
    }
    var state = "idle";
    function empty() { return !input || !input.value.trim(); }
    function sync() { if (submit) submit.disabled = state === "pending" || empty(); }
    function setStatus(next, message) {
      state = next === "pending" || next === "error" ? next : "idle";
      if (state === "idle") form.removeAttribute("data-state"); else form.setAttribute("data-state", state);
      if (state === "pending") form.setAttribute("aria-busy", "true"); else form.removeAttribute("aria-busy");
      status.textContent = state === "idle" ? "" : (message || (state === "pending" ? "Sending…" : ""));
      sync();
    }
    function onSubmit(e) {
      if (state === "pending" || empty()) { e.preventDefault(); return; }
      if (options.onSubmit) { e.preventDefault(); options.onSubmit(input.value, form); }
    }
    if (key && input) {
      bind = shortcut(key, function () { input.focus(); input.select && input.select(); });
      if (hint) hint.textContent = bind.label;
      input.setAttribute("aria-keyshortcuts", bind.aria);
    }
    if (input) input.addEventListener("input", sync);
    form.addEventListener("submit", onSubmit);
    sync();
    return remember(form, {
      element: form,
      focus: function () { if (input) input.focus(); },
      setStatus: setStatus,
      get status() { return state; },
      destroy: function () {
        if (input) input.removeEventListener("input", sync);
        form.removeEventListener("submit", onSubmit);
        if (bind) { bind.destroy(); if (hint) hint.textContent = ""; if (input) input.removeAttribute("aria-keyshortcuts"); }
      }
    });
  }

  /* ---------- toast: one polite live region; messages queue instead of replacing each other ----------
     While a modal is open the toast goes inside it (the top layer), and closing the modal clears it.
     A toast with an action (Undo) jumps the queue and stays 8 s; hovering or focusing it pauses the timer.
     Errors and results people must act on belong in the content, not only in a toast. */
  var toastEl = null, toastTimer = null, toastQueue = [], toastNow = null;
  function topModal() {
    var list = doc.querySelectorAll("dialog[open]");
    for (var i = list.length - 1; i >= 0; i--) {
      try { if (list[i].matches(":modal")) return list[i]; } catch (e) { return list[i]; }
    }
    return null;
  }
  function toastHide() {
    clearTimeout(toastTimer);
    toastNow = null;
    if (toastEl) toastEl.hidden = true;
    if (toastQueue.length) setTimeout(function () { if (!toastNow && toastQueue.length) toastShow(toastQueue.shift()); }, 160);
  }
  function toastArm() {
    clearTimeout(toastTimer);
    var o = toastNow && toastNow.options;
    if (!o) return;
    var ms = o.timeout == null ? (o.action ? 8000 : 2800) : o.timeout;
    if (ms > 0) toastTimer = setTimeout(toastHide, ms);
  }
  function toastShow(item) {
    var o = item.options;
    var host = o.root || topModal() || doc.body;
    if (!toastEl || toastEl.parentNode !== host) {
      if (toastEl && toastEl.parentNode) toastEl.parentNode.removeChild(toastEl);
      toastEl = doc.createElement("div");
      toastEl.className = "lg-toast lg-glass lg-glass--popover" + (host !== doc.body ? " lg-toast--contained" : "");
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      toastEl.addEventListener("mouseenter", function () { clearTimeout(toastTimer); });
      toastEl.addEventListener("mouseleave", toastArm);
      toastEl.addEventListener("focusin", function () { clearTimeout(toastTimer); });
      toastEl.addEventListener("focusout", toastArm);
      host.appendChild(toastEl);
    }
    toastNow = item;
    toastEl.hidden = false;
    toastEl.textContent = "";
    /* re-insert the text on the next frame so screen readers announce repeated messages */
    requestAnimationFrame(function () {
      if (toastNow !== item) return;
      toastEl.textContent = item.message;
      if (o.action && o.action.label) {
        var b = doc.createElement("button");
        b.type = "button";
        b.className = "lg-btn lg-btn--plain lg-btn--sm lg-toast__action";
        b.textContent = o.action.label;
        b.addEventListener("click", function () { if (o.action.onClick) o.action.onClick(); toastHide(); });
        toastEl.appendChild(b);
      }
    });
    toastArm();
  }
  function toast(message, options) {
    var item = { message: String(message), options: options || {} };
    if (!toastNow || item.options.replace || item.options.action) toastShow(item);
    else if (toastNow.message === item.message) toastArm();
    else if (!toastQueue.some(function (q) { return q.message === item.message; })) toastQueue.push(item);
    return toastEl;
  }
  function hideToastIn(scope) {
    if (toastEl && scope.contains(toastEl)) { toastQueue = []; toastHide(); }
  }

  /* ---------- tooltips: [data-tooltip] on icon-only controls ----------
     Shows the accessible name (plus a registered shortcut from aria-keyshortcuts) after a short hover or on
     keyboard focus; Escape hides it, moving the pointer onto it keeps it, it never takes focus. Touch shows
     nothing: give touch layouts visible labels instead. data-tooltip="text" overrides the name. */
  var tip = null, tipFor = null, tipTimer = 0, tipsBound = false;
  function tipText(el) {
    var t = el.getAttribute("data-tooltip") || el.getAttribute("aria-label") || el.textContent.trim();
    var k = el.getAttribute("aria-keyshortcuts");
    return k ? t + " (" + prettyKeys(k) + ")" : t;
  }
  function placeTip(el) {
    var r = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight, gap = 8;
    var x = Math.max(8, Math.min(window.innerWidth - w - 8, r.left + r.width / 2 - w / 2));
    var y = r.top - h - gap >= 8 ? r.top - h - gap : r.bottom + gap;
    tip.style.left = Math.round(x) + "px";
    tip.style.top = Math.round(y) + "px";
  }
  function showTip(el) {
    var host = el.closest("dialog[open]") || doc.body;
    if (!tip) {
      tip = doc.createElement("div");
      tip.className = "lg-tooltip lg-glass lg-glass--popover";
      tip.setAttribute("role", "tooltip");
      tip.hidden = true;
    }
    if (tip.parentNode !== host) host.appendChild(tip);
    tipFor = el;
    tip.textContent = tipText(el);
    tip.hidden = false;
    placeTip(el);
  }
  function hideTip() {
    clearTimeout(tipTimer);
    tipFor = null;
    if (tip) tip.hidden = true;
  }
  function bindTooltips() {
    if (tipsBound) return;
    tipsBound = true;
    function later(fn, ms) { clearTimeout(tipTimer); tipTimer = setTimeout(fn, ms); }
    doc.addEventListener("pointerover", function (e) {
      if (e.pointerType === "touch") return;
      var el = e.target.closest && e.target.closest("[data-tooltip]");
      if (el) { if (el !== tipFor) later(function () { showTip(el); }, 500); else clearTimeout(tipTimer); }
      else if (tip && tip.contains(e.target)) clearTimeout(tipTimer);
      else if (tipFor) later(hideTip, 120);
    });
    doc.addEventListener("focusin", function (e) {
      var el = e.target.closest && e.target.closest("[data-tooltip]");
      var keyboard = false;
      try { keyboard = el && el.matches(":focus-visible"); } catch (err) { keyboard = !!el; }
      if (keyboard) later(function () { showTip(el); }, 500);
    });
    doc.addEventListener("focusout", function () { if (tipFor) hideTip(); });
    doc.addEventListener("pointerdown", function () { if (tipFor) hideTip(); }, true);
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && tip && !tip.hidden) { hideTip(); takeEscape(e); e.stopPropagation(); }
    }, true);
    window.addEventListener("scroll", function () { if (tipFor) hideTip(); }, { passive: true, capture: true });
  }

  /* ---------- seek bars: <input class="lg-scrub lg-scrub--input" type="range"> paints its fill from --lg-value ---------- */
  var rangesBound = false;
  function paintRange(el) {
    var min = parseFloat(el.min) || 0, max = parseFloat(el.max), v = parseFloat(el.value) || 0;
    if (isNaN(max)) max = 100;
    el.style.setProperty("--lg-value", (max > min ? ((v - min) / (max - min)) * 100 : 0) + "%");
  }
  function bindRanges(scope) {
    slice(scope.querySelectorAll("input.lg-scrub--input")).forEach(paintRange);
    if (rangesBound) return;
    rangesBound = true;
    doc.addEventListener("input", function (e) { if (e.target.matches && e.target.matches("input.lg-scrub--input")) paintRange(e.target); });
  }

  /* ---------- keyboard: bottom bars ride above the on-screen keyboard ----------
     Sets html --lg-keyboard-inset (px) from visualViewport; .lg-tabbar and .lg-toolbar--float use it.
     Ignored while the page is pinch-zoomed, so zooming never moves the bars. */
  var keyboardBound = false;
  function trackKeyboard() {
    var vv = window.visualViewport;
    if (keyboardBound || !vv) return;
    keyboardBound = true;
    var raf = 0;
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

  /* ---------- init / destroy ---------- */
  var MAP = { navbar: FloatingNavbar, tabbar: TabBar, segmented: SegmentedControl, toolbar: Toolbar, modal: Modal, button: GlassButton, panel: GlassPanel, composer: Composer, list: SelectList };
  function init(scope, options) {
    scope = scope || doc;
    options = options || {};
    var out = [];
    trackKeyboard();
    bindTooltips();
    bindRanges(scope);
    refreshTones(scope);
    slice(scope.querySelectorAll("[data-lg]")).forEach(function (el) {
      var name = el.getAttribute("data-lg"), fn = MAP[name];
      if (fn) out.push(fn(el, options[name]));
    });
    slice(scope.querySelectorAll("[data-lg-open]")).forEach(function (btn) {
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
  /* releases every controller bound inside `scope` (and its refraction filters); returns how many */
  function destroy(scope) {
    scope = scope || doc;
    var n = 0;
    if (registry) slice(Array.from(registry)).forEach(function (c) {
      if (scope === doc || (c.element && scope.contains(c.element))) { c.destroy(); n++; }
    });
    if (refraction.els) Array.from(refraction.els).forEach(function (el) {
      if (scope === doc || scope.contains(el)) releaseRefraction(el);
    });
    return n;
  }

  var api = {
    version: "3.3.0",
    init: init,
    destroy: destroy,
    applyTheme: applyTheme,
    preferences: preferences,
    enableRefraction: enableRefraction,
    disableRefraction: disableRefraction,
    supportsRefraction: isChromium,
    setTone: setTone,
    toast: toast,
    shortcut: shortcut,
    FloatingNavbar: FloatingNavbar,
    TabBar: TabBar,
    GlassButton: GlassButton,
    SegmentedControl: SegmentedControl,
    Toolbar: Toolbar,
    Modal: Modal,
    GlassPanel: GlassPanel,
    SelectList: SelectList,
    Composer: Composer
  };
  window.LiquidGlass = Object.assign(window.LiquidGlass || {}, api);
})();
