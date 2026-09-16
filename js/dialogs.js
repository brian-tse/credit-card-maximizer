// Dialog focus and keyboard handling shared by the catalog and settings.
(function () {
  const previousFocus = new WeakMap();
  function open(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    if (!overlay.classList.contains('active')) previousFocus.set(overlay, document.activeElement);
    overlay.classList.add('active');
    overlay.querySelector('[role="dialog"]')?.setAttribute('aria-modal', 'true');
    (overlay.querySelector('input, button, select, textarea, a[href]') || overlay).focus();
  }
  function close(id) {
    const overlay = document.getElementById(id);
    if (!overlay?.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.querySelector('[role="dialog"]')?.removeAttribute('aria-modal');
    const previous = previousFocus.get(overlay);
    if (previous?.isConnected) previous.focus();
    else document.getElementById('card-search')?.focus();
  }
  document.addEventListener('keydown', event => {
    const overlay = [...document.querySelectorAll('.modal-overlay.active')].at(-1);
    if (!overlay) return;
    if (event.key === 'Escape') { event.preventDefault(); close(overlay.id); return; }
    if (event.key !== 'Tab') return;
    const focusable = [...overlay.querySelectorAll('a[href], button, input, select, textarea, [tabindex="0"]')].filter(el => !el.disabled && el.getClientRects().length);
    if (!focusable.length) { event.preventDefault(); return; }
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  window.CardMaxDialogs = { open, close };
})();
