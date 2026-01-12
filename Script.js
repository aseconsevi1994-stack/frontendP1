// Tema claro / oscuro
const themeToggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

function setTheme(mode) {
  document.documentElement.setAttribute('data-theme', mode);
  themeToggle.textContent = mode === 'dark' ? 'Modo claro' : 'Modo oscuro';
}

setTheme(prefersDark ? 'dark' : 'light');

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// Carrusel automático
const heroCarouselEl = document.querySelector('#heroCarousel');
if (heroCarouselEl) {
  new bootstrap.Carousel(heroCarouselEl, {
    interval: 4500,
    ride: 'carousel'
  });
}

// Filtro de servicios
document.getElementById('filterSelect')?.addEventListener('change', e => {
  const t = e.target.value;
  document.querySelectorAll('.service-card').forEach(card => {
    card.style.display = (t === 'all' || card.dataset.type === t) ? '' : 'none';
  });
});

// Mostrar extra de servicios
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('click', () => {
    const extra = card.querySelector('.service-extra');
    if (!extra) return;
    extra.style.display = extra.style.display === 'block' ? 'none' : 'block';
  });
});

// Formulario multi-pasos
const form = document.getElementById('multiForm');
if (form) {
  const steps = form.querySelectorAll('.form-step');
  form.addEventListener('click', e => {
    const action = e.target.dataset.action;
    if (!action) return;

    const current = form.querySelector('.form-step.active');
    if (action === 'next') {
      const inputs = current.querySelectorAll('input[required], select[required]');
      for (const input of inputs) {
        if (!input.value.trim()) {
          input.focus();
          return;
        }
      }
      current.classList.remove('active');
      current.nextElementSibling.classList.add('active');
    } else if (action === 'prev') {
      current.classList.remove('active');
      current.previousElementSibling.classList.add('active');
    } else if (action === 'submit') {
      alert('Solicitud enviada (simulación)');
      form.reset();
      steps.forEach(st => st.classList.remove('active'));
      steps[0].classList.add('active');
    }
  });
}

// Buscar noticias
document.getElementById('searchNews')?.addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  document.querySelectorAll('.news-card').forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(q) ? '' : 'none';
  });
});
