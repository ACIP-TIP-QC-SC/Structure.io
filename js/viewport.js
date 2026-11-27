/* Skyscraper.io — viewport lock for phones and tablets.
 *
 * iOS Safari lets the page be dragged while the on-screen keyboard is open:
 * the layout viewport stays full height, so the player can pan down past the
 * game until only the blue background shows. This file:
 *   1. keeps the document scrolled to the top (window can never move),
 *   2. blocks touch-drags except inside panels that really scroll,
 *   3. publishes the visible height (--app-h) and keyboard height (--kb) as
 *      CSS variables so the phone card can sit right above the keyboard.
 */
(function () {
  "use strict";
  const root = document.documentElement;
  const vv = window.visualViewport;

  function pinTop() {
    if (window.scrollX || window.scrollY) window.scrollTo(0, 0);
    if (document.body && (document.body.scrollTop || document.body.scrollLeft)) {
      document.body.scrollTop = 0; document.body.scrollLeft = 0;
    }
  }

  function update() {
    pinTop();
    const full = window.innerHeight;
    const visH = vv ? vv.height : full;
    // On iOS the keyboard overlays the page: visible height shrinks, layout height doesn't.
    // Ignore pinch-zoom (scale > 1) so zooming in doesn't look like a keyboard.
    const zoomed = vv && vv.scale > 1.01;
    const kb = zoomed ? 0 : Math.max(0, Math.round(full - visH));
    root.style.setProperty("--app-h", Math.round(zoomed ? full : visH) + "px");
    root.style.setProperty("--kb", kb + "px");
    root.classList.toggle("kb-open", kb > 80);
  }

  if (vv) {
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
  }
  window.addEventListener("resize", update);
  window.addEventListener("scroll", pinTop, { passive: true });
  window.addEventListener("orientationchange", () => setTimeout(update, 250));
  // iOS scrolls the page to show a focused field; undo it once the keyboard settles.
  document.addEventListener("focusin", () => { update(); setTimeout(update, 60); setTimeout(update, 350); });
  document.addEventListener("focusout", () => setTimeout(update, 60));

  // Only let a drag through when it starts inside something that can actually scroll
  // (the end-screen summary, a tall card). Canvas dragging uses pointer events and
  // `touch-action: none`, so it is unaffected.
  function scrollableParent(el) {
    for (; el && el !== document.body && el !== root; el = el.parentElement) {
      if (el.nodeType !== 1) continue;
      const s = getComputedStyle(el);
      if ((s.overflowY === "auto" || s.overflowY === "scroll") && el.scrollHeight > el.clientHeight + 1) return el;
    }
    return null;
  }
  let startY = 0, scroller = null;
  document.addEventListener("touchstart", e => {
    if (e.touches.length !== 1) { scroller = null; return; }
    startY = e.touches[0].clientY;
    scroller = scrollableParent(e.target);
  }, { passive: true });
  document.addEventListener("touchmove", e => {
    if (e.touches.length !== 1) return;              // leave pinch-zoom alone
    if (!scroller) { if (e.cancelable) e.preventDefault(); return; }
    // stop the rubber-band at the ends from dragging the whole page
    const dy = e.touches[0].clientY - startY;
    const atTop = scroller.scrollTop <= 0;
    const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1;
    if ((atTop && dy > 0) || (atBottom && dy < 0)) { if (e.cancelable) e.preventDefault(); }
  }, { passive: false });

  update();
  window.SkyViewport = { update };
})();
