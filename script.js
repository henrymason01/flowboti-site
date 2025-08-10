// Mobile nav
const btn = document.querySelector('.hamburger');
const menu = document.getElementById('mobile-menu');
if (btn && menu) {
  btn.addEventListener('click', () => {
    const open = menu.hasAttribute('hidden') ? false : true;
    if (open) {
      menu.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
    } else {
      menu.removeAttribute('hidden');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
}

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Contact form validation + safe submit
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

function setError(field, msg) {
  const err = field.parentElement.querySelector('.error');
  if (err) err.textContent = msg || '';
}

function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

if (form) {
  form.addEventListener('submit', async (e) => {
    // Honeypot: if filled, block
    const hp = form.querySelector('input.hp');
    if (hp && hp.value.trim() !== '') {
      e.preventDefault();
      statusEl.textContent = 'Submission blocked.';
      return;
    }

    // Client validation
    const name = form.querySelector('input[name="name"]');
    const email = form.querySelector('input[name="_replyto"]');
    const msg = form.querySelector('textarea[name="message"]');

    let ok = true;
    if (!name.value.trim()) { setError(name, 'Please enter your name'); ok = false; } else setError(name,'');
    if (!validateEmail(email.value.trim())) { setError(email, 'Enter a valid email'); ok = false; } else setError(email,'');
    if (!msg.value.trim()) { setError(msg, 'Add a short message'); ok = false; } else setError(msg,'');

    if (!ok) {
      e.preventDefault();
      return;
    }

    // Progressive enhancement: submit via fetch for nicer UX
    e.preventDefault();
    statusEl.textContent = 'Sending…';

    try {
      const data = new FormData(form);
      const r = await fetch(form.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' }});
      if (r.ok) {
        form.reset();
        statusEl.textContent = 'Thanks. We will get back to you shortly.';
      } else {
        statusEl.textContent = 'Something went wrong. Try email hello@flowbotai.com';
      }
    } catch (err) {
      statusEl.textContent = 'Network issue. Try again or email hello@flowbotai.com';
    }
  });
}
