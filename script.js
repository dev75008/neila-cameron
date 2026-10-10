$(function () {
  const $slides = $('.slides');
  const carousel = document.querySelector('.carousel');
  const ornaments = document.querySelector('.ornaments');
  const delay = 5500;
  let active = 0;
  let timer;

  $.getJSON('photos.json').done(function (photos) {
    $.each(photos, function (index, photo) {
      const $image = $('<img>', {
        alt: '',
        draggable: false,
        loading: index < 2 ? 'eager' : 'lazy',
        decoding: 'async'
      });
      $image.on('load', function () {
        if (index === active) positionOrnaments();
      });
      $image.attr('src', 'photos/' + encodeURIComponent(photo));
      const $slide = $('<figure>', { class: 'slide' }).append($image);
      if (index === 0) $slide.addClass('is-active');
      $slides.append($slide);
    });
    positionOrnaments();
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
    positionOrnaments();
    preload((active + 1) % count);
  }

  function next() { show(active + 1); }
  function preload(index) {
    const image = $slides.children().eq(index).find('img').get(0);
    if (image) image.loading = 'eager';
  }

  function positionOrnaments() {
    const image = $slides.children().eq(active).find('img').get(0);
    const width = carousel.clientWidth;
    const height = carousel.clientHeight;
    if (!image || !image.naturalWidth || !width || !height) {
      ornaments.classList.remove('has-side-space');
      return;
    }
    const imageWidth = Math.min(width, height * image.naturalWidth / image.naturalHeight);
    const sideSpace = Math.max(0, (width - imageWidth) / 2);
    ornaments.style.setProperty('--side-space', sideSpace + 'px');
    ornaments.classList.toggle('has-side-space', sideSpace >= 52);
  }

  window.addEventListener('resize', positionOrnaments);

  $(document).on('visibilitychange', function () {
    if (document.hidden) window.clearInterval(timer);
    else {
      timer = window.setInterval(next, delay);
    }
  });

});
