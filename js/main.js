/* ============================================
   Los Ramos — Main JavaScript
   Lightweight interactions, no dependencies
   ============================================ */

(function () {
  'use strict';

  // --- Scroll-triggered reveal animations ---
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: show everything immediately
    revealElements.forEach((el) => el.classList.add('visible'));
  }

  // --- Sticky nav background on scroll ---
  const nav = document.querySelector('.nav');

  function updateNav() {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // --- Mobile hamburger menu ---
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');

  function openMenu() {
    navLinks.classList.add('open');
    navOverlay.classList.add('active');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    navOverlay.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  navOverlay.addEventListener('click', closeMenu);

  // Close mobile menu on nav link click
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // --- Smooth scroll with offset for fixed nav ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = nav.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  // --- Lightbox ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  // Attach click to all lightbox-trigger images
  document.querySelectorAll('.lightbox-trigger').forEach(function (img) {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function () {
      // Use the full-size image if it's a thumbnail; otherwise use src
      var src = this.getAttribute('data-full') || this.src;
      openLightbox(src, this.alt);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // Escape key closes lightbox and mobile menu
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (lightbox.classList.contains('active')) closeLightbox();
      if (navLinks.classList.contains('open')) closeMenu();
    }
  });

  // --- Copy email to clipboard ---
  var copyBtn = document.querySelector('.contact-copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = this.getAttribute('data-email');
      navigator.clipboard.writeText(email).then(
        function () {
          copyBtn.textContent = 'Copied!';
          setTimeout(function () {
            copyBtn.textContent = 'Copy email address';
          }, 2000);
        },
        function () {
          // Fallback
          copyBtn.textContent = email;
        }
      );
    });
  }

  // --- Language toggle (EN/ES) ---
  var langToggle = document.querySelector('.lang-toggle');
  var currentLang = localStorage.getItem('losramos-lang') || 'en';

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('losramos-lang', lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-es]').forEach(function (el) {
      if (lang === 'es') {
        if (!el.hasAttribute('data-en')) {
          el.setAttribute('data-en', el.innerHTML);
        }
        el.innerHTML = el.getAttribute('data-es');
      } else {
        if (el.hasAttribute('data-en')) {
          el.innerHTML = el.getAttribute('data-en');
        }
      }
    });

    // Toggle button label
    var enLabel = langToggle.querySelector('.lang-toggle-en');
    var esLabel = langToggle.querySelector('.lang-toggle-es');
    if (lang === 'es') {
      enLabel.style.display = 'none';
      esLabel.style.display = '';
    } else {
      enLabel.style.display = '';
      esLabel.style.display = 'none';
    }
  }

  langToggle.addEventListener('click', function () {
    setLanguage(currentLang === 'en' ? 'es' : 'en');
  });

  // Apply saved language on load
  if (currentLang === 'es') {
    setLanguage('es');
  }

  // --- Hero parallax text (subtle) ---
  var heroContent = document.querySelector('.hero-content');

  function updateParallax() {
    if (window.innerWidth < 768) return;
    var scrolled = window.scrollY;
    if (scrolled < window.innerHeight && heroContent) {
      heroContent.style.transform = 'translateY(' + scrolled * 0.25 + 'px)';
      heroContent.style.opacity = 1 - scrolled / (window.innerHeight * 0.8);
    }
  }

  window.addEventListener('scroll', function () {
    requestAnimationFrame(updateParallax);
  }, { passive: true });

})();
