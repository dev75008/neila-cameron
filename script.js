$(function () {
  const $slides = $('.slides');
  const $progress = $('.progress span');
  const delay = 5500;
  let active = 0;
  let timer;

  $.getJSON('photos.json').done(function (photos) {
    $.each(photos, function (index, photo) {
      const $image = $('<img>', {
        src: 'photos/' + encodeURIComponent(photo),
        alt: '',
        draggable: false,
        loading: index < 2 ? 'eager' : 'lazy',
        decoding: 'async'
      });
      const $slide = $('<figure>', { class: 'slide' }).append($image);
      if (index === 0) $slide.addClass('is-active');
      $slides.append($slide);
    });
    runProgress();
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
    preload((active + 1) % count);
    restartProgress();
  }

  function next() { show(active + 1); }
  function preload(index) {
    const image = $slides.children().eq(index).find('img').get(0);
    if (image) image.loading = 'eager';
  }

  function runProgress() {
    $progress.css({ transition: 'none', transform: 'scaleX(0)' });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        $progress.css({ transition: 'transform ' + delay + 'ms linear', transform: 'scaleX(1)' });
      });
    });
  }

  function restartProgress() {
    window.clearInterval(timer);
    runProgress();
    timer = window.setInterval(next, delay);
  }

  $(document).on('visibilitychange', function () {
    if (document.hidden) window.clearInterval(timer);
    else {
      runProgress();
      timer = window.setInterval(next, delay);
    }
  });

});
