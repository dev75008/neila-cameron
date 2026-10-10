$(function () {
  const $slides = $('.slides');
  const carousel = document.querySelector('.carousel');
  const nameFx = document.querySelector('.name-fx');
  const particleRoot = document.querySelector('.gold-particles');
  const delay = 5500;
  let active = 0;
  let timer;

  const particles = [];
  for (let index = 0; index < 48; index += 1) {
    const particle = document.createElement('span');
    particle.className = 'gold-particle';
    particle.style.setProperty('--lag', (Math.random() * 0.7) + 's');
    particle.style.setProperty('--life', (1.7 + Math.random() * 1.5) + 's');
    particle.style.setProperty('--size', (1.2 + Math.random() * 2.3) + 'px');
    particleRoot.appendChild(particle);
    particles.push(particle);
  }
  layoutParticles();

  $.getJSON('photos.json').done(function (photos) {
    $.each(photos, function (index, photo) {
      const $image = $('<img>', {
        alt: '',
        draggable: false,
        loading: index < 2 ? 'eager' : 'lazy',
        decoding: 'async'
      });
      $image.attr('src', 'photos/' + encodeURIComponent(photo));
      const $slide = $('<figure>', { class: 'slide' }).append($image);
      if (index === 0) $slide.addClass('is-active');
      $slides.append($slide);
    });
    burstNames();
    timer = window.setInterval(next, delay);
    preload(1);
  }).fail(function () {
    $('.controls').hide();
  });

  function show(index) {
    const count = $slides.children().length;
    if (!count) return;
    active = (index + count) % count;
    $slides.children().removeClass('is-active').eq(active).addClass('is-active');
    burstNames();
    preload((active + 1) % count);
  }

  function next() { show(active + 1); }
  function preload(index) {
    const image = $slides.children().eq(index).find('img').get(0);
    if (image) image.loading = 'eager';
  }

  function burstNames() {
    nameFx.classList.remove('is-burst');
    void nameFx.offsetWidth;
    nameFx.classList.add('is-burst');
  }

  function layoutParticles() {
    const responsive = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;
    carousel.classList.toggle('responsive-layout', responsive);
    particles.forEach(function (particle, index) {
      const firstGroup = index < 24;
      if (responsive) {
        particle.style.left = (31 + Math.random() * 38) + '%';
        particle.style.top = firstGroup
          ? (2.5 + Math.random() * 7) + '%'
          : (90.5 + Math.random() * 7) + '%';
        const direction = firstGroup ? -1 : 1;
        particle.style.setProperty('--drift-x', (Math.random() * 100 - 50) + 'px');
        particle.style.setProperty('--drift-y', direction * (15 + Math.random() * 85) + 'px');
      } else {
        particle.style.left = firstGroup
          ? (6 + Math.random() * 14) + '%'
          : (80 + Math.random() * 14) + '%';
        particle.style.top = (43 + Math.random() * 14) + '%';
        particle.style.setProperty('--drift-x', (Math.random() * 90 - 45) + 'px');
        particle.style.setProperty('--drift-y', (Math.random() * -110 - 12) + 'px');
      }
    });
  }

  window.addEventListener('resize', function () {
    layoutParticles();
    burstNames();
  });

  $(document).on('visibilitychange', function () {
    if (document.hidden) window.clearInterval(timer);
    else {
      timer = window.setInterval(next, delay);
    }
  });

});
