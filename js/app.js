/* love-website v20260705 - no background music */
/* ========================================
   Prevent browser auto-scroll on refresh
   ======================================== */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('beforeunload', function () {
  window.scrollTo(0, 0);
});

/* ========================================
   Petal Particle System (Canvas)
   ======================================== */
(function () {
  var canvas = document.getElementById('petalCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var petals = [];
  var petalColors = [
    'rgba(232, 154, 170, 0.7)',
    'rgba(245, 198, 208, 0.6)',
    'rgba(232, 154, 170, 0.4)',
    'rgba(210, 170, 180, 0.5)',
    'rgba(181, 200, 176, 0.3)'
  ];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function Petal() {
    this.x = Math.random() * canvas.width;
    this.y = -10;
    this.size = Math.random() * 10 + 6;
    this.speedY = Math.random() * 1.5 + 0.6;
    this.speedX = Math.random() * 0.8 - 0.4;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
    this.opacity = Math.random() * 0.5 + 0.3;
  }

  Petal.prototype.update = function () {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
    this.rotation += this.rotationSpeed;
    if (this.y > canvas.height + 10) {
      this.y = -10;
      this.x = Math.random() * canvas.width;
    }
  };

  Petal.prototype.draw = function () {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  var maxPetals = 50;
  function initPetals() {
    for (var i = 0; i < maxPetals; i++) {
      var p = new Petal();
      p.y = Math.random() * canvas.height;
      petals.push(p);
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }
    requestAnimationFrame(animate);
  }

  initPetals();
  animate();
})();

/* ========================================
   Days Timer
   ======================================== */
(function () {
  var anniversaryDate = '2024-11-02';

  updateTimer();
  setInterval(updateTimer, 1000);

  function updateTimer() {
    var start = new Date(anniversaryDate + 'T00:00:00');
    var now = new Date();
    var diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));

    if (diff < 0) diff = 0;
    var str = String(diff);

    while (str.length < 4) str = '0' + str;

    document.getElementById('daysThousands').textContent = str[0];
    document.getElementById('daysHundreds').textContent = str[1];
    document.getElementById('daysTens').textContent = str[2];
    document.getElementById('daysOnes').textContent = str[3];

    var since = document.getElementById('sinceDate');
    var dateObj = new Date(anniversaryDate + 'T00:00:00');
    var y = dateObj.getFullYear();
    var m = dateObj.getMonth() + 1;
    var d = dateObj.getDate();
    since.textContent = '从 ' + y + '年' + m + '月' + d + '日 开始';
  }

})();

/* ========================================
   Gallery with Lightbox
   ======================================== */
(function () {
  var grid = document.getElementById('galleryGrid');
  var photos = [
    { src: '', alt: '我们的第一张合照' },
    { src: '', alt: '一起看日落' },
    { src: '', alt: '你的生日' },
    { src: '', alt: '海边旅行' },
    { src: '', alt: '一起做饭' },
    { src: '', alt: '雨天散步' },
    { src: '', alt: '跨年烟火' },
    { src: '', alt: '我们的日常' },
  ];

  var placeholderColors = [
    ['#FCE4EC', '#F0C0C8'],
    ['#FDE8EE', '#F2C4CC'],
    ['#FEEBF0', '#F5C8D0'],
    ['#FBE0E8', '#EEC0C8'],
    ['#FDE8EE', '#F0C4CC'],
    ['#FCE4EC', '#F0C0C8'],
    ['#FDE8EE', '#F2C4CC'],
    ['#FEEBF0', '#F5C8D0'],
  ];

  for (var i = 0; i < photos.length; i++) {
    var item = document.createElement('div');
    item.className = 'gallery__item';
    var gradient = 'linear-gradient(135deg, ' + placeholderColors[i][0] + ', ' + placeholderColors[i][1] + ')';
    item.innerHTML =
      '<div class="gallery__item-img gallery__item-img--placeholder" style="background:' + gradient + '">' +
        '<span class="gallery__item-placeholder-icon">&#10087;</span>' +
      '</div>' +
      '<div class="gallery__item-overlay">' + photos[i].alt + '</div>';
    item.addEventListener('click', (function (idx) {
      return function () { openLightbox(idx); };
    })(i));
    grid.appendChild(item);
  }

  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    var gradient = 'linear-gradient(135deg, ' + placeholderColors[index][0] + ', ' + placeholderColors[index][1] + ')';
    lightboxImg.style.display = 'none';
    lightboxImg.style.background = gradient;
    lightboxImg.style.minWidth = '300px';
    lightboxImg.style.minHeight = '200px';
    lightboxCaption.textContent = photos[index].alt;
    lightbox.classList.add('lightbox--active');
    document.body.style.overflow = 'hidden';
  }

  function showPlaceholder(index) {
    var gradient = 'linear-gradient(135deg, ' + placeholderColors[index][0] + ', ' + placeholderColors[index][1] + ')';
    lightboxImg.style.display = 'none';
    lightboxImg.style.background = gradient;
    lightboxImg.style.minWidth = '300px';
    lightboxImg.style.minHeight = '200px';
  }

  function closeLightbox() {
    lightbox.classList.remove('lightbox--active');
    document.body.style.overflow = '';
  }

  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.getElementById('lightboxPrev').addEventListener('click', function () {
    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    showPlaceholder(currentIndex);
    lightboxCaption.textContent = photos[currentIndex].alt;
  });

  document.getElementById('lightboxNext').addEventListener('click', function () {
    currentIndex = (currentIndex + 1) % photos.length;
    showPlaceholder(currentIndex);
    lightboxCaption.textContent = photos[currentIndex].alt;
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('lightbox--active')) return;
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + photos.length) % photos.length;
      showPlaceholder(currentIndex);
      lightboxCaption.textContent = photos[currentIndex].alt;
    }
    if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % photos.length;
      showPlaceholder(currentIndex);
      lightboxCaption.textContent = photos[currentIndex].alt;
    }
    if (e.key === 'Escape') closeLightbox();
  });

  window.openLightbox = openLightbox;
})();

/* ========================================
   Timeline
   ======================================== */
(function () {
  var timelineList = document.getElementById('timelineList');
  var events = [
    { date: '2023年12月15日', title: '第一次相遇', desc: '在朋友聚会上第一次见到你，你的笑容让我再也忘不掉。' },
    { date: '2024年11月2日', title: '我们在一起了', desc: '和你在一起的每一天，都成了我人生最宝贵的记忆。' },
    { date: '2025年3月14日', title: '第一次旅行', desc: '白色情人节，我们去了海边。海风很大，但牵着你的手就不觉得冷。' },
    { date: '2025年6月20日', title: '你的生日', desc: '给你准备了惊喜派对，看到你开心的样子，觉得一切都值得。' },
    { date: '2025年10月1日', title: '一起养了猫', desc: '我们的第一只猫咪——小团子，让我们的家更加完整。' },
    { date: '2025年11月2日', title: '一周年纪念', desc: '一年了，每一天都很幸福。和你在一起的时光总是过得太快。' },
  ];

  for (var i = 0; i < events.length; i++) {
    var item = document.createElement('div');
    item.className = 'timeline__item reveal';
    item.innerHTML =
      '<div class="timeline__date">' + events[i].date + '</div>' +
      '<div class="timeline__card">' +
        '<h3 class="timeline__card-title">' + events[i].title + '</h3>' +
        '<p class="timeline__card-desc">' + events[i].desc + '</p>' +
      '</div>';
    timelineList.appendChild(item);
  }
})();

/* ========================================
   Food Map
   ======================================== */
(function () {
  var foodGrid = document.getElementById('foodGrid');
  var foods = [
    {
      name: '街头小笼包',
      place: '上海 · 老弄堂',
      desc: '你第一次带我去吃的小笼包，汤汁很烫但好吃到停不下来。',
      color: '#FCE4EC'
    },
    {
      name: '深夜烧烤摊',
      place: '家门口 · 路边摊',
      desc: '每次加班晚了你都会等我一起吃夜宵，烤鸡翅永远是必点。',
      color: '#FDE8EE'
    },
    {
      name: '日料定食',
      place: '人均300+ · 纪念日餐厅',
      desc: '一周年纪念那天去的，你说三文鱼刺身好吃到眯眼睛的样子太可爱了。',
      color: '#FBE0E8'
    },
    {
      name: '手作甜点',
      place: '家里 · 你的厨房',
      desc: '你第一次给我做蛋糕，虽然形状不太完美，但我觉得比任何蛋糕店都好吃。',
      color: '#FEEBF0'
    },
  ];

  for (var i = 0; i < foods.length; i++) {
    var card = document.createElement('div');
    card.className = 'food__card reveal';
    var gradient = 'linear-gradient(135deg, ' + foods[i].color + ', rgba(232, 154, 170, 0.2))';

    card.innerHTML =
      '<div class="food__card-img food__card-img--placeholder" style="background:' + gradient + '">' +
        '<span class="food__card-placeholder-icon">&#127860;</span>' +
      '</div>' +
      '<div class="food__card-body">' +
        '<h3 class="food__card-title">' + foods[i].name + '</h3>' +
        '<div class="food__card-meta">' +
          '<span>' + foods[i].place + '</span>' +
        '</div>' +
        '<p class="food__card-desc">' + foods[i].desc + '</p>' +
      '</div>';
    foodGrid.appendChild(card);
  }
})();

/* ========================================
   Love Letters
   ======================================== */
(function () {
  var container = document.getElementById('letterCards');
  var letters = [
    { title: '第一封信', emoji: '💌', content: '亲爱的，这是我们在一起的第1个月。这个月里我每天最开心的事就是看到你。你让我的世界变得不一样了。' },
    { title: '小纸条', emoji: '💝', content: '今天突然想对你说——你是我遇到过最好的人。温柔、善良、偶尔有点小任性，但这就是我爱着的你。' },
    { title: '写在一周年', emoji: '💕', content: '一周年快乐！这一年来，我们一起经历了那么多。有欢笑有泪水，但最重要的是我们一直在一起。我爱你，不止今天。' },
  ];

  for (var i = 0; i < letters.length; i++) {
    (function (letter) {
      var envelope = document.createElement('div');
      envelope.className = 'letter__envelope reveal';
      envelope.innerHTML =
        '<div class="letter__envelope-inner">' +
          '<div class="letter__envelope-front">' +
            '<div class="letter__envelope-stamp">' + letter.emoji + '</div>' +
            '<div class="letter__envelope-title">' + letter.title + '</div>' +
            '<div class="letter__envelope-hint">点击打开阅读</div>' +
          '</div>' +
          '<div class="letter__envelope-back">' +
            '<h3>' + letter.title + '</h3>' +
            '<p>' + letter.content + '</p>' +
          '</div>' +
        '</div>';
      envelope.addEventListener('click', function () {
        envelope.classList.toggle('letter__envelope--open');
      });
      container.appendChild(envelope);
    })(letters[i]);
  }
})();

/* ========================================
   Music Player
   ======================================== */
(function () {
  var audio = document.getElementById('bgAudio');
  var playlist = document.getElementById('musicPlaylist');
  var recordingsEl = document.getElementById('musicRecordings');

  // Song playlist (replace with your own audio files)
  var songs = [
    { title: '星晴', artist: '周杰伦', file: 'assets/audio/星晴.mp3' },
    { title: '明天过后', artist: '', file: 'assets/audio/明天过后.m4a' },
    { title: '蝴蝶 love u~', artist: '', file: 'assets/audio/蝴蝶_love u~.m4a' },
    { title: '梦祺起床啦', artist: '', file: 'assets/audio/梦祺起床啦.mp3' },
  ];

  // Voice recordings
  var recordings = [
    { name: '梦祺起床啦.mp3', date: '录制时间', file: 'assets/audio/梦祺起床啦.mp3' },
    { name: '明天过后.m4a', date: '录制时间', file: 'assets/audio/明天过后.m4a' },
    { name: '蝴蝶 love u~.m4a', date: '录制时间', file: 'assets/audio/蝴蝶_love u~.m4a' },
  ];

  var currentTrack = -1;
  var isPlaying = false;

  // Build playlist
  for (var i = 0; i < songs.length; i++) {
    (function (idx) {
      var track = document.createElement('div');
      track.className = 'music__track';
      track.innerHTML =
        '<div class="music__track-num">' + (idx + 1) + '</div>' +
        '<div class="music__track-info">' +
          '<div class="music__track-title">' + songs[idx].title + '</div>' +
          '<div class="music__track-artist">' + songs[idx].artist + '</div>' +
        '</div>';
      track.addEventListener('click', function () {
        playTrack(idx);
        if (songs[idx].file) {
          audio.src = songs[idx].file;
          audio.play();
          isPlaying = true;
          updatePlayBtn();
          updateDisc();
        }
      });
      playlist.appendChild(track);
    })(i);
  }

  // Build recordings
  for (var j = 0; j < recordings.length; j++) {
    (function (idx) {
      var rec = document.createElement('div');
      rec.className = 'music__recording';
      rec.innerHTML =
        '<div class="music__recording-icon">🎙️</div>' +
        '<div class="music__recording-info">' +
          '<div class="music__recording-name">' + recordings[idx].name + '</div>' +
          '<div class="music__recording-date">' + recordings[idx].date + '</div>' +
        '</div>' +
        '<button class="music__recording-play" title="播放">▶</button>';
      var playBtn = rec.querySelector('.music__recording-play');
      playBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (recordings[idx].file) {
          if (audio.src.includes(recordings[idx].file) && !audio.paused) {
            audio.pause();
            isPlaying = false;
            playBtn.textContent = '▶';
            updateDisc();
          } else {
            audio.src = recordings[idx].file;
            audio.play();
            isPlaying = true;
            playBtn.textContent = '⏸';
            updateDisc();
          }
        }
      });
      recordingsEl.appendChild(rec);
    })(j);
  }

  function playTrack(index) {
    var tracks = playlist.querySelectorAll('.music__track');
    for (var t = 0; t < tracks.length; t++) {
      tracks[t].classList.remove('music__track--active');
    }
    currentTrack = index;
    if (index >= 0) {
      tracks[index].classList.add('music__track--active');
      document.getElementById('musicTitle').textContent = songs[index].title;
      document.getElementById('musicArtist').textContent = songs[index].artist;
    }
  }

  // Play/Pause
  document.getElementById('musicPlay').addEventListener('click', function () {
    if (currentTrack < 0) {
      playTrack(0);
      switchAndPlay(0);
      return;
    }
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      if (!audio.src || audio.src === window.location.href) {
        switchAndPlay(currentTrack);
        return;
      }
      audio.play();
      isPlaying = true;
    }
    updatePlayBtn();
    updateDisc();
  });

  // Prev
  document.getElementById('musicPrev').addEventListener('click', function () {
    if (songs.length === 0) return;
    var prev = (currentTrack - 1 + songs.length) % songs.length;
    playTrack(prev);
    switchAndPlay(prev);
  });

  // Next
  document.getElementById('musicNext').addEventListener('click', function () {
    if (songs.length === 0) return;
    var next = (currentTrack + 1) % songs.length;
    playTrack(next);
    switchAndPlay(next);
  });

  function switchAndPlay(idx) {
    if (songs[idx].file) {
      audio.src = songs[idx].file;
      audio.play();
      isPlaying = true;
      updatePlayBtn();
      updateDisc();
    }
  }

  // Volume
  document.getElementById('musicVolume').addEventListener('input', function () {
    audio.volume = this.value / 100;
  });
  audio.volume = 0.7;

  // Progress bar
  var progressBar = document.getElementById('musicProgressBar');
  progressBar.addEventListener('click', function (e) {
    if (!audio.duration) return;
    var rect = this.getBoundingClientRect();
    var ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  });

  audio.addEventListener('timeupdate', function () {
    var pct = audio.duration ? audio.currentTime / audio.duration : 0;
    document.getElementById('musicProgressFill').style.transform = 'scaleX(' + pct + ')';
    document.getElementById('musicCurrentTime').textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener('loadedmetadata', function () {
    document.getElementById('musicDuration').textContent = formatTime(audio.duration);
  });

  function updatePlayBtn() {
    document.getElementById('musicPlay').innerHTML = isPlaying ? '⏸' : '▶';
  }

  function updateDisc() {
    var disc = document.getElementById('musicDisc');
    if (isPlaying) {
      disc.classList.add('music__disc--playing');
    } else {
      disc.classList.remove('music__disc--playing');
    }
  }

  function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
  }

  audio.addEventListener('ended', function () {
    var next = (currentTrack + 1) % songs.length;
    playTrack(next);
    switchAndPlay(next);
  });
})();

/* ========================================
   Heart Click Effect
   ======================================== */
(function () {
  document.addEventListener('click', function (e) {
    if (e.target.closest('.nav') || e.target.closest('.nav-toggle') ||
        e.target.closest('.lightbox') || e.target.closest('.music__btn') ||
        e.target.closest('.music__track') || e.target.closest('.music__recording') ||
        e.target.closest('button') || e.target.closest('input')) return;

    var heart = document.createElement('span');
    heart.className = 'heart-particle';
    heart.textContent = '❤';
    heart.style.left = e.clientX - 10 + 'px';
    heart.style.top = e.clientY - 10 + 'px';
    heart.style.color = ['#E89AAA', '#F5C6D0', '#F0A0B0', '#E0A0B0'][Math.floor(Math.random() * 4)];
    heart.style.fontSize = (Math.random() * 16 + 14) + 'px';
    document.body.appendChild(heart);

    setTimeout(function () {
      heart.remove();
    }, 1000);
  });
})();

/* ========================================
   Scroll Reveal
   ======================================== */
(function () {
  var reveals = document.querySelectorAll('.reveal');

  function checkReveal() {
    var windowHeight = window.innerHeight;
    for (var i = 0; i < reveals.length; i++) {
      var top = reveals[i].getBoundingClientRect().top;
      if (top < windowHeight - 100) {
        reveals[i].classList.add('reveal--active');
      }
    }
  }

  // Also lazy-init reveals for dynamic content
  function refreshReveals() {
    reveals = document.querySelectorAll('.reveal');
    checkReveal();
  }

  window.addEventListener('scroll', checkReveal, { passive: true });
  window.addEventListener('resize', checkReveal);

  // Observe DOM changes for dynamic content
  var observer = new MutationObserver(function () {
    refreshReveals();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  refreshReveals();
})();

/* ========================================
   Navigation Active State
   ======================================== */
(function () {
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav__link');
  var sectionTops = [];
  var ticking = false;

  function cacheTops() {
    sectionTops = [];
    for (var i = 0; i < sections.length; i++) {
      sectionTops[i] = sections[i].offsetTop;
    }
  }

  function updateNav() {
    var scrollPos = window.scrollY + 100;
    for (var i = sections.length - 1; i >= 0; i--) {
      if (sectionTops[i] <= scrollPos) {
        for (var j = 0; j < navLinks.length; j++) {
          navLinks[j].classList.remove('nav__link--active');
          if (navLinks[j].getAttribute('href') === '#' + sections[i].id) {
            navLinks[j].classList.add('nav__link--active');
          }
        }
        break;
      }
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', cacheTops);
  cacheTops();
  updateNav();

  // Smooth scroll for nav links
  for (var k = 0; k < navLinks.length; k++) {
    navLinks[k].addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
})();

/* ========================================
   Back to Top
   ======================================== */
(function () {
  var btn = document.getElementById('backToTop');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 600) {
      btn.classList.add('back-to-top--visible');
    } else {
      btn.classList.remove('back-to-top--visible');
    }
  });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
