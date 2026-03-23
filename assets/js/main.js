// Comparte Onlus – main.js

// Nav: aggiunge classe .scrolled all'header quando si scrolla
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

// Copia codice fiscale negli appunti
const cfCopyBtn = document.getElementById('cf-copy');

if (cfCopyBtn) {
  cfCopyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('97977810585').then(() => {
      cfCopyBtn.classList.add('copied');
      setTimeout(() => cfCopyBtn.classList.remove('copied'), 2500);
    });
  });
}

// Lightbox galleria
function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = src;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});
