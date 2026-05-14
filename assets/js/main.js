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

const galleryData = [
  { src: 'assets/img/galleria/01.webp', alt: 'Comunità di Nuevo Horizonte, Petén, Guatemala', project: 'Comparte Comunidad', caption: 'Petén, Guatemala · Comparte Comunidad' },
  { src: 'assets/img/galleria/02.webp', alt: 'Formazione agricola nelle comunità rurali del Guatemala', project: 'Comparte Comunidad', caption: 'Formazione agricola nelle comunità rurali' },
  { src: 'assets/img/galleria/03.webp', alt: 'Nuevo Horizonte, dove è iniziato tutto', project: 'Comparte Onlus', caption: 'Nuevo Horizonte — dove è iniziato tutto' },
  { src: 'assets/img/galleria/04.webp', alt: 'Il pranzo da cui è nata Comparte nel 2018', project: 'Comparte Onlus', caption: 'Il pranzo da cui è nata Comparte, 2018' },
  { src: 'assets/img/galleria/05.webp', alt: 'Consegna diplomi USAC Comparte Universidad Petén', project: 'Comparte Universidad', caption: 'Consegna diplomi USAC · Comparte Universidad' },
  { src: 'assets/img/galleria/06.webp', alt: 'Seminario in presenza Centro Universitario de Petén Guatemala', project: 'Comparte Universidad', caption: 'Registrazione seminario di Comparte Universidad - Francesca Izzo' },
  { src: 'assets/img/galleria/07.webp', alt: 'Vita nelle comunità rurali del Petén Guatemala', project: 'Comparte Comunidad', caption: 'Vita nelle comunità del Petén' },
  { src: 'assets/img/galleria/08.webp', alt: 'Comparte Cinema proiezione nelle comunità rurali Guatemala', project: 'Comparte Cinema', caption: 'Comparte Cinema · proiezione nelle comunità rurali' },
  { src: 'assets/img/galleria/09.webp', alt: 'Cerimonia USAC studentesse indigene del Petén Guatemala', project: 'Comparte Universidad', caption: 'Cerimonia USAC · studentesse del Petén' },
  { src: 'assets/img/galleria/10.webp', alt: 'Foresta del Petén Guatemala 180000 alberi piantati zeroCO2', project: 'Comparte Comunidad', caption: 'Foresta del Petén · 180.000 alberi piantati' },
  { src: 'assets/img/galleria/11.webp', alt: 'Seminario online Comparte Universidad Centro Universitario Petén', project: 'Comparte Universidad', caption: 'Seminario online · Comparte Universidad' }
];

let currentIndex = 0;

function initGallery() {
  const thumbsContainer = document.getElementById('galleria-thumbs');
  if (!thumbsContainer) return;

  galleryData.forEach((item, i) => {
    const thumb = document.createElement('div');
    thumb.className = 'galleria-thumb' + (i === 0 ? ' active' : '');
    thumb.innerHTML = `<img src="${item.src}" alt="${item.alt}" loading="lazy">`;
    thumb.addEventListener('click', () => setSlide(i));
    thumbsContainer.appendChild(thumb);
  });

  document.getElementById('galleria-total').textContent = galleryData.length;
  setSlide(0);

  document.getElementById('galleria-prev').addEventListener('click', () => {
    setSlide((currentIndex - 1 + galleryData.length) % galleryData.length);
  });
  document.getElementById('galleria-next').addEventListener('click', () => {
    setSlide((currentIndex + 1) % galleryData.length);
  });
}

function setSlide(index) {
  currentIndex = index;
  const item = galleryData[index];
  const mainImg = document.getElementById('galleria-main-img');
  mainImg.style.opacity = '0';
  setTimeout(() => {
    mainImg.src = item.src;
    mainImg.alt = item.alt;
    mainImg.style.opacity = '1';
  }, 150);
  document.getElementById('galleria-caption-project').textContent = item.project;
  document.getElementById('galleria-caption-text').textContent = item.caption;
  document.getElementById('galleria-current').textContent = index + 1;
  document.querySelectorAll('.galleria-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === index);
  });
}

document.addEventListener('DOMContentLoaded', initGallery);
