// Anti-spam email protection.
// The address never appears in the HTML. Here it is split into user + domain,
// each reversed and base64-encoded, so harvesters scanning page source or JS
// for "name@domain" patterns find nothing. It is assembled only after a real
// (trusted) click or key press from a person — scripted clicks are ignored.
const EMAIL_PARTS = ['b2ZuaQ==', 'bW9jLmduaWNydW9zdHVvLWVnbmFybw=='];

function decode(enc) {
  return atob(enc).split('').reverse().join('');
}

function getEmail() {
  return EMAIL_PARTS.map(decode).join('0040');
}

// Messages shown by this script, per page language (<html lang="...">).
const MESSAGES = {
  en: {
    thanks: 'Thanks for submitting!',
    invalid: 'Please fill in your name, email and message.',
    opening: 'Thanks for submitting! Your email app should open now.',
    subject: (name) => `Enquiry from ${name}`,
  },
  vi: {
    thanks: 'Cảm ơn bạn đã gửi!',
    invalid: 'Vui lòng nhập họ tên, email và nội dung.',
    opening: 'Cảm ơn bạn đã gửi! Ứng dụng email của bạn sẽ mở ngay.',
    subject: (name) => `Yêu cầu tư vấn từ ${name}`,
  },
};
const t = MESSAGES[document.documentElement.lang] || MESSAGES.en;

const revealBtn = document.getElementById('email-reveal');
revealBtn.addEventListener('click', (e) => {
  if (!e.isTrusted) return;
  const email = getEmail();
  const link = document.createElement('a');
  link.href = `mailto:${email}`;
  link.textContent = email;
  revealBtn.replaceWith(link);
  link.focus();
});

// Contact form: no backend on GitHub Pages, so open the visitor's mail client.
const form = document.getElementById('contact-form');
const status = form.querySelector('.form-status');
const loadedAt = Date.now();

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!e.isTrusted) return;

  // Bot checks: honeypot filled in, or submitted faster than a human could type.
  if (form.website.value || Date.now() - loadedAt < 3000) {
    status.textContent = t.thanks;
    form.reset();
    return;
  }

  if (!form.checkValidity()) {
    status.textContent = t.invalid;
    form.reportValidity();
    return;
  }
  const data = new FormData(form);
  const subject = data.get('subject') || t.subject(data.get('name'));
  const body = `${data.get('message')}\n\n— ${data.get('name')} (${data.get('email')})`;
  window.location.href =
    `mailto:${getEmail()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  status.textContent = t.opening;
  form.reset();
});

// Mobile nav
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('nav-menu');
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
menu.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

// Header shadow once the page scrolls
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Fade sections in as they enter the viewport (staggered within a group)
const fades = document.querySelectorAll('.fade');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const siblings = [...entry.target.parentElement.children].filter((el) => el.classList.contains('fade'));
      entry.target.style.transitionDelay = `${Math.max(0, siblings.indexOf(entry.target)) * 90}ms`;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  fades.forEach((el) => io.observe(el));
} else {
  fades.forEach((el) => el.classList.add('in'));
}

document.getElementById('year').textContent = new Date().getFullYear();
