(function () {

  /* Mobile menu */
  var btn = document.getElementById('menuBtn');
  var menu = document.getElementById('mobileMenu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      btn.classList.toggle('nav-open');
      menu.classList.toggle('open');
      document.body.style.overflow = (menu.classList.contains('open')) ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { menu.classList.remove('open'); btn.classList.remove('nav-open'); document.body.style.overflow = ''; });
    });
  }

  /* Navbar scrolled state */
  var navbar = document.getElementById('navbar');
  if (navbar) {
    function onScroll() {
      if (window.scrollY > 40) { navbar.classList.add('scrolled'); }
      else { navbar.classList.remove('scrolled'); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Reveal on scroll */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

})();