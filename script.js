(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const dotsRoot = document.querySelector('.dots');
  const current = document.querySelector('[data-current]');
  const total = document.querySelector('[data-total]');
  const playButton = document.querySelector('[data-play]');
  const soundButton = document.querySelector('[data-sound-toggle]');
  const audio = document.querySelector('[data-audio]');
  let active = 0;
  let timer;
  let playing = true;

  total.textContent = String(slides.length).padStart(2, '0');
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Afficher la photo ${index + 1}`);
    dot.addEventListener('click', () => show(index));
    dotsRoot.append(dot);
  });
  const dots = [...dotsRoot.children];

  function show(index) {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const selected = i === active;
      slide.classList.toggle('is-active', selected);
      slide.setAttribute('aria-hidden', String(!selected));
      if (selected) {
        const image = slide.querySelector('img');
        image.loading = 'eager';
      }
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === active);
      if (i === active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    current.textContent = String(active + 1).padStart(2, '0');
  }

  function start() {
    clearInterval(timer);
    timer = setInterval(() => show(active + 1), 5500);
    playing = true;
    playButton.setAttribute('aria-pressed', 'true');
    playButton.setAttribute('aria-label', 'Mettre le diaporama en pause');
    playButton.querySelector('[data-play-icon]').textContent = 'Ⅱ';
  }

  function stop() {
    clearInterval(timer);
    playing = false;
    playButton.setAttribute('aria-pressed', 'false');
    playButton.setAttribute('aria-label', 'Reprendre le diaporama');
    playButton.querySelector('[data-play-icon]').textContent = '▶';
  }

  document.querySelector('[data-previous]').addEventListener('click', () => show(active - 1));
  document.querySelector('[data-next]').addEventListener('click', () => show(active + 1));
  playButton.addEventListener('click', () => playing ? stop() : start());
  document.querySelectorAll('.gallery-card').forEach(card => card.addEventListener('click', () => {
    show(Number(card.dataset.index));
    document.querySelector('.hero').scrollIntoView({ behavior: 'smooth' });
  }));

  document.querySelector('.carousel').addEventListener('mouseenter', stop);
  document.querySelector('.carousel').addEventListener('mouseleave', () => { if (!playing) start(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(timer);
    else if (playing) start();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') show(active + 1);
    if (event.key === 'ArrowLeft') show(active - 1);
  });

  soundButton.addEventListener('click', async () => {
    if (audio.paused) {
      try {
        await audio.play();
        soundButton.classList.add('is-playing');
        soundButton.setAttribute('aria-pressed', 'true');
        soundButton.setAttribute('aria-label', 'Mettre la musique en pause');
        soundButton.querySelector('[data-sound-label]').textContent = 'MUSIQUE EN COURS';
      } catch {
        soundButton.querySelector('[data-sound-label]').textContent = 'AJOUTEZ VOTRE MUSIQUE';
      }
    } else {
      audio.pause();
      soundButton.classList.remove('is-playing');
      soundButton.setAttribute('aria-pressed', 'false');
      soundButton.setAttribute('aria-label', 'Lancer la musique');
      soundButton.querySelector('[data-sound-label]').textContent = 'LANCER LA MUSIQUE';
    }
  });

  const carousel = document.querySelector('.carousel');
  carousel.addEventListener('touchstart', event => { carousel.dataset.touchStart = event.changedTouches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', event => {
    const startX = Number(carousel.dataset.touchStart);
    const delta = event.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 55) show(active + (delta < 0 ? 1 : -1));
  }, { passive: true });
  show(0);
  start();
})();
