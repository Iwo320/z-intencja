// ================= Z intencją — interakcje =================

// Rok w stopce
document.getElementById('year').textContent = new Date().getFullYear();

// Cieniowanie nagłówka + pasek postępu
const header = document.querySelector('[data-header]');
const progress = document.querySelector('[data-progress]');
const onScroll = () => {
  header.toggleAttribute('data-scrolled', window.scrollY > 8);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Poświata podążająca za kursorem
const glow = document.querySelector('[data-glow]');
if (glow && matchMedia('(hover: hover)').matches) {
  window.addEventListener('pointermove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
}

// Ujawnianie elementów przy przewijaniu
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));

// Filtrowanie galerii
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    galleryItems.forEach((item) => {
      const show = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('is-hidden', !show);
    });
  });
});

// Lightbox
const dialog = document.querySelector('[data-lightbox-dialog]');
const dialogImg = document.querySelector('[data-lightbox-img]');
const dialogCaption = document.querySelector('[data-lightbox-caption]');

document.querySelectorAll('[data-lightbox]').forEach((item) => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const title = item.querySelector('h3');
    dialogImg.src = img.src;
    dialogImg.alt = img.alt;
    dialogCaption.textContent = title ? title.textContent : '';
    dialog.showModal();
  });
});

document.querySelector('[data-lightbox-close]').addEventListener('click', () => dialog.close());

dialog.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close();
});
