/* ── NAV SCROLL ── */
const navEl = document.getElementById('nav');
window.addEventListener('scroll', () => {
  navEl.classList.toggle('scrolled', window.scrollY > 20);
  const st = document.getElementById('scrollTop');
  if (st) st.classList.toggle('visible', window.scrollY > 400);
});

/* ── MOBILE MENU ── */
const ham = document.getElementById('ham');
const mob = document.getElementById('mob');
if (ham && mob) {
  ham.addEventListener('click', e => { e.stopPropagation(); mob.classList.toggle('open'); });
  document.addEventListener('click', e => {
    if (!mob.contains(e.target) && e.target !== ham) mob.classList.remove('open');
  });
}
function closeMob() { if (mob) mob.classList.remove('open'); }

/* ── ACTIVE NAV LINK ── */
(function() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mob-menu a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const page = href.split('/').pop();
    if (page === path || (path === '' && page === 'index.html') ||
        (path === 'index.html' && page === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ── INTERSECTION OBSERVER (fade) ── */
const fadeObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); fadeObs.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade, .fade-left, .fade-right').forEach(el => fadeObs.observe(el));

/* ── COUNTER ANIMATION ── */
function animCount(el, target, dur, pre, suf) {
  if (!el) return;
  const start = Date.now();
  const tick = () => {
    const p = Math.min((Date.now() - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = pre + Math.floor(ease * target).toLocaleString() + suf;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ── FAQ TOGGLE ── */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

/* ── SMOOTH SCROLL FOR ANCHOR BUTTONS ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
      if (mob) mob.classList.remove('open');
    }
  });
});

/* ── FORM VALIDATION & SUBMIT ── */
function clearErr(id) {
  const el = document.getElementById(id);
  const err = document.getElementById('err-' + id);
  if (el) el.classList.remove('err');
  if (err) err.classList.remove('show');
}
function showErr(id, msg) {
  const el = document.getElementById(id);
  const err = document.getElementById('err-' + id);
  if (el) { el.classList.add('err'); el.focus(); }
  if (err) { if (msg) err.textContent = msg; err.classList.add('show'); }
  return false;
}
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function submitForm(formId, successId, btnId) {
  const name = document.getElementById('fname');
  const email = document.getElementById('femail');
  const industry = document.getElementById('findustry');
  const btn = document.getElementById(btnId || 'submitBtn');

  if (!name || !name.value.trim()) return showErr('fname', 'Please enter your name');
  if (!email || !emailRe.test(email.value.trim())) return showErr('femail', 'Please enter a valid email');
  if (industry && !industry.value) return showErr('findustry', 'Please select your industry');

  if (btn) { btn.disabled = true; btn.innerHTML = '<span>Sending...</span>'; }

  /* Prepare form data */
  const templateParams = {
    from_name: name.value.trim(),
    from_email: email.value.trim(),
    industry: industry ? industry.value : 'Not specified',
    budget: (document.getElementById('fbudget') || {}).value || 'Not specified',
    phone_number: (document.getElementById('fphone') || {}).value || 'Not provided',
    message: (document.getElementById('fmsg') || {}).value || 'No message provided',
    to_email: 'rezwanahmed1050@gmail.com'
  };

  if (window.emailjs) {
    /* Send Admin Notification ONLY (this is working perfectly!) */
    emailjs.send('service_gen2xxn', 'template_fvi10vn', templateParams)
      .then(response => {
        /* Success! Show success message */
        showSuccess(formId, successId);
        if (btn) { btn.disabled = false; btn.innerHTML = 'Send Message →'; }
      })
      .catch(error => {
        /* Error handling */
        console.error('EmailJS Error:', error);
        if (btn) { btn.disabled = false; btn.innerHTML = 'Send Message →'; }
        alert('Something went wrong. Please email us directly at rezwanahmed1050@gmail.com');
      });
  } else {
    /* Fallback if EmailJS not loaded */
    console.error('EmailJS not initialized');
    if (btn) { btn.disabled = false; btn.innerHTML = 'Send Message →'; }
    alert('Email system not initialized. Please try again.');
  }
}

function showSuccess(formId, successId) {
  const form = document.getElementById(formId);
  const success = document.getElementById(successId);
  if (form) form.style.display = 'none';
  if (success) success.style.display = 'block';
}
