// FlowBotAI site interactions: simple reveal, year, and Formspree submission
(function(){
  // Year in footer
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Reveal on scroll
  const items = document.querySelectorAll('[data-anim]');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, {threshold:.08});
  items.forEach(el=>io.observe(el));

  // Formspree wiring
  const form = document.querySelector('form[data-formspree]');
  if (form) {
    const status = document.getElementById('form-status');
    const btn = form.querySelector('button[type="submit"]');
    const show = (msg, ok=false) => {
      if (!status) return;
      status.textContent = msg;
      status.style.color = ok ? '#9ef7c9' : '#ffb3b3';
    };

    const validate = () => {
      let valid = true;
      form.querySelectorAll('.error').forEach(e=>e.textContent='');
      const hp = form.querySelector('input[name="company_website"]');
      if (hp && hp.value.trim() !== '') return false; // bot
      form.querySelectorAll('[required]').forEach(field=>{
        const wrapper = field.closest('.field');
        const err = wrapper ? wrapper.querySelector('.error') : null;
        if (!field.value.trim()) {
          valid = false;
          if (err) err.textContent = 'This field is required';
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          valid = false;
          if (err) err.textContent = 'Enter a valid email';
        } else if (field.type === 'url') {
          try { new URL(field.value); } catch(e) { valid = false; if (err) err.textContent='Enter a valid URL'; }
        }
      });
      return valid;
    };

    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      if (!validate()) return;

      if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

      const data = new FormData(form);
      try {
        const endpoint = form.getAttribute('action');
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: data
        });
        if (resp.ok) {
          form.reset();
          show('Thanks. We’ll get back to you soon.', true);
        } else {
          show('Something went wrong. Please try again or email hello@flowbotai.co.uk');
        }
      } catch(err) {
        show('Network error. Please try again or email hello@flowbotai.co.uk');
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = 'Request demo'; }
      }
    });
  }
})();