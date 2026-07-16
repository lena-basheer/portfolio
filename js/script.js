// ============================================
// LENA B — PORTFOLIO SCRIPT
// ============================================
(function () {
  'use strict';

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle (persisted) ---------- */
  var root = document.documentElement;
  var themeToggle = document.getElementById('themeToggle');
  var STORAGE_KEY = 'lena-portfolio-theme';

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      themeToggle && themeToggle.setAttribute('aria-pressed', 'true');
      themeToggle && themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      root.removeAttribute('data-theme');
      themeToggle && themeToggle.setAttribute('aria-pressed', 'false');
      themeToggle && themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  var savedTheme = null;
  try { savedTheme = localStorage.getItem(STORAGE_KEY); } catch (e) { /* storage unavailable */ }

  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var isDark = root.getAttribute('data-theme') === 'dark';
      var next = isDark ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* ignore */ }
    });
  }

  /* ---------- Sticky toolbar shadow on scroll ---------- */
  var toolbar = document.getElementById('toolbar');
  var toTopBtn = document.getElementById('toTop');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (toolbar) toolbar.classList.toggle('is-scrolled', y > 8);
    if (toTopBtn) toTopBtn.classList.toggle('is-visible', y > 600);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTopBtn) {
    toTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Mobile nav ---------- */
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll-spy for nav active state ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[data-nav]'));

  if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navAnchors.forEach(function (a) {
            a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal-on-scroll for major blocks ---------- */
  var revealTargets = document.querySelectorAll(
    '.about-frame, .about-copy, .skill-tabs, .skill-panel, .project-card, .t-item, .edu-card, .cert-list li, .contact-copy, .contact-form'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(function (el) { revealer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Dashboard count-up (runs once, on load) ---------- */
  var tiles = document.querySelectorAll('.tile[data-count]');
  var countedUp = false;

  function runCountUp() {
    if (countedUp) return;
    countedUp = true;
    tiles.forEach(function (tile) {
      var target = parseInt(tile.getAttribute('data-count'), 10) || 0;
      var numEl = tile.querySelector('.num');
      if (!numEl) return;
      var start = 0;
      var duration = 1200;
      var startTime = null;

      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        numEl.textContent = Math.round(start + (target - start) * eased);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  var dashboard = document.querySelector('.dashboard');
  if (dashboard && 'IntersectionObserver' in window) {
    var dashObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCountUp();
          dashObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    dashObserver.observe(dashboard);
  } else {
    runCountUp();
  }

  /* ---------- Tile tilt on hover (subtle, desktop only) ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.tile').forEach(function (tile) {
      tile.addEventListener('mousemove', function (e) {
        var rect = tile.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        tile.style.transform = 'perspective(400px) rotateX(' + (y * -6) + 'deg) rotateY(' + (x * 6) + 'deg) translateY(-3px)';
      });
      tile.addEventListener('mouseleave', function () {
        tile.style.transform = '';
      });
    });
  }

  /* ---------- Skill tabs ---------- */
  var tabs = document.querySelectorAll('.skill-tab');
  var panels = document.querySelectorAll('.skill-panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-tab');

      tabs.forEach(function (t) {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
      panels.forEach(function (panel) {
        var match = panel.getAttribute('data-panel') === target;
        panel.hidden = !match;
        panel.classList.toggle('is-active', match);
        if (match) {
          // restart badge entrance animation
          panel.querySelectorAll('.badge').forEach(function (b) {
            b.style.animation = 'none';
            void b.offsetWidth;
            b.style.animation = '';
          });
        }
      });
    });
  });

  /* ============================================
     CONTACT FORM
     - Client-side validation
     - Submits to Formspree (replace endpoint below)
     - Graceful mailto fallback if the request fails
     ============================================ */

  // TODO: Replace with your own Formspree endpoint (see README for setup —
  // it's free and takes about 2 minutes at https://formspree.io).
  var FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

  var form = document.getElementById('contactForm');
  var statusEl = document.getElementById('formStatus');
  var submitBtn = document.getElementById('submitBtn');

  function setError(fieldId, message) {
    var errEl = document.getElementById(fieldId + 'Error');
    if (errEl) errEl.textContent = message || '';
  }

  function validate() {
    var valid = true;
    var name = document.getElementById('name');
    var email = document.getElementById('email');
    var message = document.getElementById('message');

    setError('name', ''); setError('email', ''); setError('message', '');

    if (!name.value.trim() || name.value.trim().length < 2) {
      setError('name', 'Please enter your name.');
      valid = false;
    }
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      setError('email', 'Please enter a valid email address.');
      valid = false;
    }
    if (!message.value.trim() || message.value.trim().length < 10) {
      setError('message', 'Message should be at least 10 characters.');
      valid = false;
    }
    return valid;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      statusEl.textContent = '';
      statusEl.className = 'form-status';

      // Honeypot check — if filled, silently "succeed" (bot caught)
      var honeypot = form.querySelector('.hp-field');
      if (honeypot && honeypot.value) {
        form.reset();
        return;
      }

      if (!validate()) return;

      var data = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim()
      };

      var endpointConfigured = FORM_ENDPOINT.indexOf('YOUR_FORM_ID') === -1;

      if (!endpointConfigured) {
        // Fallback: open the user's email client pre-filled, so the form is
        // still fully usable before a Formspree endpoint is wired up.
        var subject = encodeURIComponent('Portfolio message from ' + data.name);
        var body = encodeURIComponent(data.message + '\n\n— ' + data.name + ' (' + data.email + ')');
        window.location.href = 'mailto:lenabasheer.in@gmail.com?subject=' + subject + '&body=' + body;
        statusEl.textContent = 'Opening your email client to send this message…';
        statusEl.classList.add('is-success');
        form.reset();
        return;
      }

      form.classList.add('is-loading');
      submitBtn.disabled = true;

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (res.ok) {
            statusEl.textContent = 'Thanks — your message is on its way. I\'ll reply by email soon.';
            statusEl.classList.add('is-success');
            form.reset();
          } else {
            throw new Error('Request failed');
          }
        })
        .catch(function () {
          statusEl.textContent = 'Something went wrong. Please email me directly at lenabasheer.in@gmail.com.';
          statusEl.classList.add('is-error');
        })
        .finally(function () {
          form.classList.remove('is-loading');
          submitBtn.disabled = false;
        });
    });

    // Live-clear errors as the user types
    ['name', 'email', 'message'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function () { setError(id, ''); });
    });
  }

})();
