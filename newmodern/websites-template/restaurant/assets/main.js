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

  var navbar = document.getElementById('navbar');
  if (navbar) {
    var setNav = function () {
      if (window.scrollY > 40) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    };
    window.addEventListener('scroll', setNav, { passive: true });
    setNav();
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

  // FAQ accordion
  var faqButtons = document.querySelectorAll('[data-faq]');
  faqButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var ans = document.getElementById(btn.getAttribute('data-faq'));
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btns = document.querySelectorAll('[data-faq]');
      btns.forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
        var a = document.getElementById(b.getAttribute('data-faq'));
        if (a) a.classList.add('hidden');
      });
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        if (ans) ans.classList.remove('hidden');
      }
    });
  });
})();