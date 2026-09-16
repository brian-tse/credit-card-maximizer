// Shared navigation and secondary utilities. Core page actions stay in each page.
(function () {
  const scriptUrl = document.currentScript?.src;
  const root = new URL('../', scriptUrl || new URL('js/interface.js', location.href));
  const href = path => new URL(path, root).href;
  const route = url => new URL(url, location.href).pathname.replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '') || '/';

  function init() {
    const main = document.querySelector('main, body > .container');
    if (main) {
      if (main.tagName !== 'MAIN') main.setAttribute('role', 'main');
      main.id ||= 'main-content';
      main.tabIndex = -1;
      if (!document.querySelector('.skip-link')) {
        const skip = document.createElement('a');
        skip.className = 'skip-link';
        skip.href = `#${main.id}`;
        skip.textContent = 'Skip to content';
        skip.addEventListener('click', () => main.focus());
        document.body.prepend(skip);
      }
    }
    document.querySelector('.navbar')?.setAttribute('aria-label', 'Primary');
    document.querySelector('.sub-navbar')?.setAttribute('aria-label', 'Your wallet');
    const links = document.querySelector('.nav-links');
    if (links && !links.querySelector('.tools-menu')) {
      const item = document.createElement('li');
      item.className = 'tools-nav-item';
      item.innerHTML = `<details class="tools-menu"><summary>Tools <span aria-hidden="true">⌄</span></summary><div class="tools-menu-links"><a href="${href('pages/categories.html')}">Spending categories</a><a href="${href('pages/partners.html')}">Transfer partners</a><a href="${href('bilt/')}">Bilt calculator</a></div></details>`;
      links.append(item);
      const menu = item.querySelector('details');
      menu.addEventListener('keydown', event => {
        if (event.key === 'Escape' && menu.open) {
          event.preventDefault(); event.stopPropagation();
          menu.open = false; menu.querySelector('summary').focus();
        }
      });
      document.addEventListener('pointerdown', event => {
        if (!menu.contains(event.target)) menu.open = false;
      });
      menu.addEventListener('focusout', event => {
        if (event.relatedTarget && !menu.contains(event.relatedTarget)) menu.open = false;
      });
    }
    document.querySelectorAll('nav a[href]').forEach(link => {
      if (route(link.href) === route(location.href) && !link.classList.contains('logo')) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    const tools = document.querySelector('.tools-menu');
    if (tools?.querySelector('[aria-current="page"]')) tools.classList.add('has-current-page');

    let footer = document.querySelector('.site-footer');
    if (!footer) {
      footer = document.createElement('footer');
      footer.className = 'site-footer';
      footer.innerHTML = '<span class="site-footer-brand">CardMax</span><div class="site-utilities" aria-label="Site utilities"></div>';
      document.body.append(footer);
    }
    const utilities = footer.querySelector('.site-utilities');
    for (const id of ['feedback-fab', 'quick-save-fab']) {
      const button = document.getElementById(id);
      if (!button) continue;
      if (id === 'feedback-fab') {
        button.textContent = 'Report an issue';
        button.title = 'Report incorrect card information';
      }
      utilities.append(button);
    }
    const navbar = document.querySelector('.navbar');
    if (navbar && typeof ResizeObserver !== 'undefined') {
      const update = () => document.documentElement.style.setProperty('--navbar-height', `${navbar.offsetHeight}px`);
      new ResizeObserver(update).observe(navbar);
      update();
    }
  }
  // Defer scripts run at "interactive", before page widgets register their DOM.
  // Wait for those DOMContentLoaded handlers before collecting utility controls.
  if (document.readyState !== 'complete') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
