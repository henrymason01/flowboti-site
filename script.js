// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Smooth reveal on scroll
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const delay = e.target.getAttribute('data-delay');
        if (delay) e.target.style.setProperty('--d', `${parseInt(delay,10)}ms`);
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  document.querySelectorAll('[data-anim]').forEach(el => io.observe(el));
}

// Subtle parallax for hero text
if (!prefersReduced) {
  const copy = document.querySelector('.hero-copy');
  let ticking = false;
  if (copy) {
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = Math.min(1, window.scrollY / 400);
          copy.style.transform = `translateY(${y * 16}px)`;
          copy.style.opacity = String(1 - y * 0.15);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
}

// Contact form validation + submit
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

function setError(field, msg) {
  const err = field?.parentElement?.querySelector('.error');
  if (err) err.textContent = msg || '';
}
function validateEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)}
function validateURL(v){try{new URL(v);return true}catch{return false}}

if (form) {
  form.addEventListener('submit', async (e) => {
    const hp = form.querySelector('input.hp');
    if (hp && hp.value.trim() !== '') { e.preventDefault(); if(statusEl) statusEl.textContent='Submission blocked.'; return; }

    const fullName = form.querySelector('input[name="full_name"]');
    const website  = form.querySelector('input[name="website"]');
    const email    = form.querySelector('input[name="_replyto"]');
    const reqs     = form.querySelector('textarea[name="requirements"]');

    let ok = true;
    if (!fullName.value.trim()) { setError(fullName,'Enter your full name'); ok=false; } else setError(fullName,'');
    if (!validateURL(website.value.trim())) { setError(website,'Enter a valid website URL'); ok=false; } else setError(website,'');
    if (!validateEmail(email.value.trim())) { setError(email,'Enter a valid email'); ok=false; } else setError(email,'');
    if (!reqs.value.trim()) { setError(reqs,'Describe what the assistant should do'); ok=false; } else setError(reqs,'');

    if (!ok) { e.preventDefault(); return; }

    e.preventDefault();
    if (statusEl) statusEl.textContent = 'Sending…';

    try {
      const data = new FormData(form);
      const r = await fetch(form.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' }});
      if (r.ok) { form.reset(); if(statusEl) statusEl.textContent = 'Thanks. We will get back to you shortly.'; }
      else { if(statusEl) statusEl.textContent = 'Something went wrong. Try emailing hello@flowbotai.co.uk'; }
    } catch {
      if (statusEl) statusEl.textContent = 'Network issue. Try again or email hello@flowbotai.co.uk';
    }
  });
}
