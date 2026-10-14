(function () {
  'use strict';

  /* ---------- Mobile navigation ---------- */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  var mobileQuery = window.matchMedia('(max-width: 960px)');

  function setNav(open) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  }

  toggle.addEventListener('click', function () {
    setNav(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setNav(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setNav(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', function (e) {
    if (mobileQuery.matches && !header.contains(e.target)) setNav(false);
  });
  mobileQuery.addEventListener('change', function () { setNav(false); });

  /* ---------- Header shadow on scroll ---------- */
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Highlight current section in nav ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-nav ul a'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-current', a.getAttribute('href') === '#' + entry.target.id);
          if (a.classList.contains('is-current')) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------- Menu tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var menuImg = document.getElementById('menu-photo-img');

  function activateTab(tab, focus) {
    tabs.forEach(function (t) {
      var active = t === tab;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !active;
    });
    if (focus) tab.focus();
    swapMenuPhoto(tab.dataset.image, tab.dataset.alt);
  }

  function swapMenuPhoto(src, alt) {
    if (!menuImg || !src || menuImg.getAttribute('src') === src) return;
    menuImg.classList.add('is-swapping');
    var next = new Image();
    next.onload = function () {
      menuImg.src = src;
      menuImg.alt = alt || '';
      menuImg.parentElement.classList.remove('is-broken');
      menuImg.classList.remove('is-swapping');
    };
    next.onerror = function () {
      menuImg.classList.remove('is-swapping');
      menuImg.parentElement.classList.add('is-broken');
    };
    next.src = src;
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { activateTab(tab, false); });
    tab.addEventListener('keydown', function (e) {
      var target = null;
      if (e.key === 'ArrowRight') target = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') target = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') target = tabs[0];
      else if (e.key === 'End') target = tabs[tabs.length - 1];
      if (target) { e.preventDefault(); activateTab(target, true); }
    });
  });

  /* ---------- Image fallback ---------- */
  function markBroken(img) { img.closest('.media') && img.closest('.media').classList.add('is-broken'); }
  document.querySelectorAll('.media img').forEach(function (img) {
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) markBroken(img);
    img.addEventListener('error', function () { markBroken(img); });
  });

  /* ---------- Placeholder links ---------- */
  var toast = document.getElementById('toast');
  var toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 3500);
  }
  document.querySelectorAll('[data-placeholder-link]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      showToast(link.dataset.placeholderLink);
    });
  });

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
