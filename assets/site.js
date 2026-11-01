/* jesus.garrobo.es — menú móvil, preferencia de idioma y modo claro/oscuro */
(function () {
  var root = document.documentElement;

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  /* Menú móvil: el logo abre y cierra la navegación */
  var brand = document.querySelector('.brand');
  var menu = document.getElementById('site-nav');
  var mq = window.matchMedia('(max-width: 640px)');

  function setMenu(open) {
    if (!menu || !brand) return;
    menu.classList.toggle('open', open);
    brand.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  if (brand && menu) {
    brand.addEventListener('click', function (e) {
      if (!mq.matches) return;
      e.preventDefault();
      setMenu(!menu.classList.contains('open'));
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('click', function (e) { if (!e.target.closest('.site-header')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    if (mq.addEventListener) mq.addEventListener('change', function () { setMenu(false); });
  }

  /* Móvil: mostrar el nombre en la cabecera a partir de la sección Experiencia */
  var header = document.querySelector('.site-header');
  var profile = document.getElementById('experiencia') || document.getElementById('experience');
  if (header) {
    if (!profile) {
      header.classList.add('show-name');
    } else {
      var ticking = false;
      var update = function () {
        ticking = false;
        header.classList.toggle('show-name', profile.getBoundingClientRect().top <= header.offsetHeight + 1);
      };
      window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
      }, { passive: true });
      window.addEventListener('resize', update);
      update();
    }
  }

  /* Email de contacto: se compone en el navegador para que no lo recojan los robots */
  document.querySelectorAll('.js-mail').forEach(function (a) {
    var addr = a.getAttribute('data-u') + '@' + a.getAttribute('data-d');
    a.href = 'mailto:' + addr;
    a.title = addr;
    a.hidden = false;
  });

  /* Idioma elegido a mano: tiene prioridad sobre el del navegador */
  document.querySelectorAll('.lang').forEach(function (a) {
    a.addEventListener('click', function () { store('lang', a.getAttribute('hreflang')); });
  });

  /* Modo claro/oscuro: por defecto sigue al sistema; el botón fija una preferencia */
  var darkMq = window.matchMedia('(prefers-color-scheme: dark)');

  function current() {
    return root.getAttribute('data-theme') || (darkMq.matches ? 'dark' : 'light');
  }

  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store('theme', next);
    });
  });
})();
