/* ==========================================================================
   eWasteGang — site.js
   Plain vanilla JavaScript, no dependencies, no build step.
   Every feature below is optional: if the matching markup isn't on the page,
   that block simply does nothing.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     1. MOBILE NAVIGATION
     ------------------------------------------------------------------------ */
  function initNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var panel = document.querySelector('[data-nav-panel]');
    if (!toggle || !panel) return;

    toggle.addEventListener('click', function () {
      var open = panel.classList.toggle('hidden') === false;
      toggle.setAttribute('aria-expanded', String(open));
    });

    // Close the menu after tapping a link so the new page isn't hidden behind it.
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        panel.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ------------------------------------------------------------------------
     2. SCROLL REVEALS
     Adds .is-visible to anything marked .reveal once it scrolls into view.
     ------------------------------------------------------------------------ */
  function initReveals() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        // Stagger siblings slightly for a sequenced feel.
        var delay = Number(entry.target.dataset.revealDelay || 0);
        setTimeout(function () { entry.target.classList.add('is-visible'); }, delay);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------------------------------
     3. COUNT-UP NUMBERS
     Markup: <span data-count-to="240">0</span>
     ------------------------------------------------------------------------ */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count-to]');
    if (!counters.length) return;

    function run(el) {
      var target = Number(el.dataset.countTo);
      if (reduceMotion || isNaN(target)) { el.textContent = String(target || 0); return; }

      var duration = 1200;
      var started = null;

      function step(now) {
        if (started === null) started = now;
        var progress = Math.min((now - started) / duration, 1);
        // easeOutCubic
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(run);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        run(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------------------------------
     4. COPY-TO-CLIPBOARD (crypto wallet addresses)
     Markup: <button data-copy="1A2b3C...">Copy</button>
     ------------------------------------------------------------------------ */
  function initCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var value = btn.dataset.copy;
        var original = btn.textContent;

        function done(msg) {
          btn.textContent = msg;
          setTimeout(function () { btn.textContent = original; }, 1800);
        }

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(value).then(
            function () { done('Copied'); },
            function () { done('Press Ctrl+C'); }
          );
        } else {
          // Fallback for pages served over plain http.
          var field = document.createElement('textarea');
          field.value = value;
          field.setAttribute('readonly', '');
          field.style.position = 'fixed';
          field.style.opacity = '0';
          document.body.appendChild(field);
          field.select();
          try { document.execCommand('copy'); done('Copied'); }
          catch (err) { done('Press Ctrl+C'); }
          document.body.removeChild(field);
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     5. MAILTO FORMS
     GitHub Pages is static — there is no server to POST to. These forms
     assemble a pre-filled email in the visitor's mail client instead.

     Markup: <form data-mailto-form data-mailto-to="service@ewastegang.org"
                   data-mailto-subject="Workshop request">
     Every field needs a name and a matching <label>.

     WANT REAL FORM SUBMISSIONS INSTEAD?
     Sign up for a free static-form service (Formspree, Basin, Netlify Forms)
     and replace the two attributes above with:
        action="https://formspree.io/f/YOUR_ID" method="POST"
     then delete the data-mailto-form attribute. Everything else still works.
     ------------------------------------------------------------------------ */
  function initMailtoForms() {
    document.querySelectorAll('[data-mailto-form]').forEach(function (form) {
      var status = form.querySelector('[data-form-status]');

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!form.reportValidity()) return;

        var to = form.dataset.mailtoTo || 'service@ewastegang.org';
        var subject = form.dataset.mailtoSubject || 'Website enquiry';
        var lines = [];

        new FormData(form).forEach(function (value, key) {
          var field = form.elements[key];
          var label = form.querySelector('label[for="' + (field && field.id) + '"]');
          var name = label ? label.textContent.replace(/\*/g, '').trim() : key;
          lines.push(name + ': ' + value);
        });

        var href = 'mailto:' + to +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(lines.join('\n\n'));

        window.location.href = href;

        if (status) {
          status.textContent =
            'Your email app should be opening with this filled in. ' +
            'If nothing happened, email ' + to + ' directly.';
          status.classList.remove('hidden');
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     6. WORKSHOP FILTER (workshops.html)
     Buttons with data-filter="youth" show cards with data-audience="youth".
     ------------------------------------------------------------------------ */
  function initFilter() {
    var buttons = document.querySelectorAll('[data-filter]');
    var cards = document.querySelectorAll('[data-audience]');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var want = btn.dataset.filter;

        buttons.forEach(function (b) {
          var on = b === btn;
          b.setAttribute('aria-pressed', String(on));
          // These class names also appear in the HTML on the default-active
          // button, which guarantees the Tailwind CDN generates them.
          b.classList.toggle('bg-circuit', on);
          b.classList.toggle('text-ink', on);
          b.classList.toggle('border-circuit', on);
        });

        cards.forEach(function (card) {
          var match = want === 'all' || card.dataset.audience.split(' ').indexOf(want) > -1;
          card.classList.toggle('hidden', !match);
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     7. FOOTER YEAR
     ------------------------------------------------------------------------ */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */
  function boot() {
    initNav();
    initReveals();
    initCounters();
    initCopyButtons();
    initMailtoForms();
    initFilter();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
