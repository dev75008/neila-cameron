$(function () {
  const $carousel = $('.carousel');
  const $slides = $('.slides');
  const $progress = $('.progress span');
  const delay = 5500;
  let active = 0;
  let timer;
  let paused = false;
  let touchX = null;

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
  function previous() { show(active - 1); }
  function preload(index) {
    const image = $slides.children().eq(index).find('img').get(0);
    if (image) image.loading = 'eager';
  }

  function runProgress() {
    $progress.css({ transition: 'none', transform: 'scaleX(0)' });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (!paused) $progress.css({ transition: 'transform ' + delay + 'ms linear', transform: 'scaleX(1)' });
      });
    });
  }

  function restartProgress() {
    if (paused) return;
    window.clearInterval(timer);
    runProgress();
    timer = window.setInterval(next, delay);
  }

  function pause() {
    paused = true;
    window.clearInterval(timer);
    $progress.css({ transition: 'none' });
    $('.toggle').text('▶').attr({ 'aria-label': 'Reprendre le diaporama', 'aria-pressed': 'false' });
  }

  function play() {
    paused = false;
    $('.toggle').text('Ⅱ').attr({ 'aria-label': 'Mettre le diaporama en pause', 'aria-pressed': 'true' });
    runProgress();
    window.clearInterval(timer);
    timer = window.setInterval(next, delay);
  }

  $('.next').on('click', next);
  $('.previous').on('click', previous);
  $('.toggle').on('click', function () { paused ? play() : pause(); });
  $(document).on('keydown', function (event) {
    if (event.key === 'ArrowRight') next();
    if (event.key === 'ArrowLeft') previous();
    if (event.key === ' ' && !$(event.target).is('button')) {
      event.preventDefault();
      paused ? play() : pause();
    }
  });
  $carousel.on('touchstart', function (event) {
    touchX = event.originalEvent.changedTouches[0].clientX;
  });
  $carousel.on('touchend', function (event) {
    if (touchX === null) return;
    const delta = event.originalEvent.changedTouches[0].clientX - touchX;
    if (Math.abs(delta) > 45) delta < 0 ? next() : previous();
    touchX = null;
  });
  $(document).on('visibilitychange', function () {
    if (document.hidden) window.clearInterval(timer);
    else if (!paused) play();
  });

  let youtubePlayer = null;
  let audioUnlocked = false;
  window.onYouTubeIframeAPIReady = function () {
    youtubePlayer = new YT.Player('music-player', {
      events: {
        onReady: function (event) {
          if (audioUnlocked) startMusic(event.target);
          else event.target.playVideo();
        },
        onStateChange: function (event) {
          if (event.data === YT.PlayerState.ENDED) event.target.playVideo();
        }
      }
    });
  };

  function startMusic(player) {
    audioUnlocked = true;
    const activePlayer = player || youtubePlayer;
    if (activePlayer) {
      activePlayer.setVolume(100);
      activePlayer.unMute();
      activePlayer.playVideo();
    }
  }

  window.addEventListener('pointerdown', function unlockAudio() {
    startMusic();
  }, { once: true, passive: true });
  window.addEventListener('keydown', function unlockAudio() {
    startMusic();
  }, { once: true });

  const youtubeApi = document.createElement('script');
  youtubeApi.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(youtubeApi);
});
