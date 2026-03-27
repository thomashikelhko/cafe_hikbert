/* ============================================================
   Café Hikbert – main.js
   Handles: sticky nav, mobile menu, menu tabs, reservation form
   ============================================================ */

(function () {
  'use strict';

  /* ---- Utilities ---- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---- Set current year in footer ---- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Sticky / transparent navigation ---- */
  const nav = $('#nav');
  const SCROLL_THRESHOLD = 60;

  function updateNav() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ---- Mobile navigation toggle ---- */
  const navToggle = $('#navToggle');
  const navLinks  = $('#navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on link click
    $$('a', navLinks).forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---- Menu tabs ---- */
  const tabs   = $$('.menu__tab');
  const panels = $$('.menu__panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = `tab-${tab.dataset.tab}`;

      tabs.forEach((t) => {
        t.classList.remove('menu__tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach((p) => p.classList.remove('menu__panel--active'));

      tab.classList.add('menu__tab--active');
      tab.setAttribute('aria-selected', 'true');

      const targetPanel = $(`#${targetId}`);
      if (targetPanel) targetPanel.classList.add('menu__panel--active');
    });
  });

  /* ---- Set minimum date for reservation to today ---- */
  const dateInput = $('#res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.value = today;
  }

  /* ---- Reservation form submission ---- */
  const form       = $('#reservationForm');
  const msgEl      = $('#formMessage');
  const submitBtn  = $('#reserveBtn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Collect form data
      const data = {
        name:   form.elements['name'].value.trim(),
        email:  form.elements['email'].value.trim(),
        phone:  form.elements['phone'].value.trim(),
        date:   form.elements['date'].value,
        time:   form.elements['time'].value,
        guests: form.elements['guests'].value,
        notes:  form.elements['notes'].value.trim(),
      };

      // Client-side validation
      if (!data.name || !data.email || !data.date || !data.time || !data.guests) {
        showMessage('error', 'Please fill in all required fields.');
        return;
      }

      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(data.email)) {
        showMessage('error', 'Please provide a valid email address.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      hideMessage();

      try {
        const response = await fetch('/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          showMessage('success', result.message || 'Reservation confirmed! We look forward to seeing you.');
          form.reset();
          if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
        } else {
          showMessage('error', result.error || 'Something went wrong. Please try again.');
        }
      } catch {
        showMessage('error', 'Could not connect to the server. Please call us directly.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirm Reservation';
      }
    });
  }

  function showMessage(type, text) {
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.className = `form__message form__message--${type}`;
    msgEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideMessage() {
    if (!msgEl) return;
    msgEl.textContent = '';
    msgEl.className = 'form__message';
  }

  /* ---- Smooth-scroll for anchor links (polyfill for older browsers) ---- */
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = $(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

})();
