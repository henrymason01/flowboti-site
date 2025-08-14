<script>
// FlowBotAI site interactions
(() => {
  /* ===== Footer year ===== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== Scroll reveal ===== */
  const revealItems = document.querySelectorAll('[data-anim]');
  if (revealItems.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealItems.forEach(el => io.observe(el));
  }

  /* ===== Formspree handling ===== */
  const form = document.querySelector('form[data-formspree]');
  if (form) {
    const status = document.getElementById('form-status');
    const submitBtn = form.querySelector('button[type="submit"]');

    const showMsg = (msg, success = false) => {
      if (status) {
        status.textContent = msg;
        status.style.color = success ? '#9ef7c9' : '#ffb3b3';
      }
    };

    const validateForm = () => {
      let valid = true;
      form.querySelectorAll('.error').forEach(e => e.textContent = '');
      const honeypot = form.querySelector('input[name="company_website"]');
      if (honeypot && honeypot.value.trim()) return false; // bot trap

      form.querySelectorAll('[required]').forEach(field => {
        const errEl = field.closest('.field')?.querySelector('.error');
        if (!field.value.trim()) {
          valid = false;
          if (errEl) errEl.textContent = 'This field is required';
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          valid = false;
          if (errEl) errEl.textContent = 'Enter a valid email';
        } else if (field.type === 'url') {
          try { new URL(field.value); }
          catch { valid = false; if (errEl) errEl.textContent = 'Enter a valid URL'; }
        }
      });
      return valid;
    };

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!validateForm()) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      try {
        const resp = await fetch(form.action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });

        if (resp.ok) {
          form.reset();
          showMsg('Thanks. We’ll get back to you soon.', true);
        } else {
          showMsg('Something went wrong. Please try again or email hello@flowbotai.co.uk');
        }
      } catch {
        showMsg('Network error. Please try again or email hello@flowbotai.co.uk');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Request demo';
        }
      }
    });
  }
})();
</script>
