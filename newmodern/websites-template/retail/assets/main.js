(function () {
  'use strict';

  var menuBtn = document.getElementById('menuBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    var open = false;
    menuBtn.addEventListener('click', function () {
      open = !open;
      menuBtn.classList.toggle('nav-open', open);
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        open = false;
        menuBtn.classList.remove('nav-open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          ro.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Accordion for care page
  var toggles = document.querySelectorAll('[data-toggle]');
  toggles.forEach(function (t) {
    t.addEventListener('click', function () {
      var target = document.getElementById(t.getAttribute('data-toggle'));
      if (target) target.classList.toggle('hidden');
    });
  });
})();