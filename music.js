/* ==========================================================
   TRUST CHAIN — SHARED MUSIC PLAYER
   Nhạc tiếp tục khi chuyển trang (sessionStorage)
   ========================================================== */
(function(){
  'use strict';

  /* ====== CẤU HÌNH DANH SÁCH NHẠC ======
     Thêm/xóa bài tùy ý. Đường dẫn tính từ file HTML.
     Hỗ trợ: .mp3, .m4a, .ogg, .wav, .mp4 (chỉ lấy âm thanh) */
  var songs = [
    { src: 'music/bai-hat-1.mp3', title: 'Bài hát 1', artist: 'Nghệ sĩ 1' },
    { src: 'music/bai-hat-2.mp3', title: 'Bài hát 2', artist: 'Nghệ sĩ 2' },
    { src: 'music/bai-hat-3.mp3', title: 'Bài hát 3', artist: 'Nghệ sĩ 3' }
  ];

  if(!songs.length) return;

  /* ====== STATE ====== */
  var KEY = 'tc_music_v1';
  var saved = {};
  try { saved = JSON.parse(sessionStorage.getItem(KEY) || '{}'); } catch(e){ saved = {}; }

  var currentIndex = (typeof saved.index === 'number' && saved.index >= 0 && saved.index < songs.length)
                     ? saved.index
                     : Math.floor(Math.random() * songs.length);
  var isShuffle   = saved.shuffle !== false;
  var isLoop      = !!saved.loop;
  var isPlaying   = false;
  var pendingTime = (typeof saved.time === 'number' && saved.time > 0) ? saved.time : 0;
  var wantResume  = saved.playing === true;
  var savedVolume = (typeof saved.volume === 'number') ? saved.volume : 0.7;

  /* ====== CSS ====== */
  var CSS = `
  #music-toggle{position:fixed;bottom:calc(24px + env(safe-area-inset-bottom,0px));right:24px;z-index:100;width:48px;height:48px;border-radius:50%;background:rgba(30,30,30,.85);color:#fff;border:1px solid rgba(255,255,255,.2);cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);transition:transform .3s ease,background .3s ease;box-shadow:0 8px 30px -12px rgba(0,0,0,.4)}
  #music-toggle:hover{transform:scale(1.1);background:rgba(50,50,50,.9)}
  #music-toggle svg{width:20px;height:20px;fill:currentColor}
  #music-player{position:fixed;bottom:calc(84px + env(safe-area-inset-bottom,0px));right:24px;z-index:100;width:340px;background:rgba(30,30,30,.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:16px;color:#fff;font-family:'Inter',system-ui,sans-serif;box-shadow:0 12px 40px -10px rgba(0,0,0,.5);transition:opacity .3s ease,transform .3s ease,visibility .3s;opacity:0;visibility:hidden;transform:translateY(20px)}
  #music-player.show{opacity:1;visibility:visible;transform:translateY(0)}
  .mp-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px}
  .mp-title-wrap{text-align:center;flex:1;min-width:0}
  .mp-title{font-size:15px;font-weight:600;margin:0 0 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#fff}
  .mp-artist{font-size:12px;color:#A0A0A0;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .mp-visualizer{width:24px;height:24px;display:flex;align-items:flex-end;gap:2px;justify-content:center;flex-shrink:0;transition:opacity .3s}
  .mp-visualizer span{width:3px;background:#fff;border-radius:2px;animation:mp-vis 1s ease-in-out infinite alternate}
  .mp-visualizer span:nth-child(1){height:8px;animation-delay:0s}
  .mp-visualizer span:nth-child(2){height:16px;animation-delay:.2s}
  .mp-visualizer span:nth-child(3){height:12px;animation-delay:.4s}
  .mp-visualizer span:nth-child(4){height:20px;animation-delay:.1s}
  @keyframes mp-vis{0%{height:4px}100%{height:20px}}
  .mp-progress-wrap{display:flex;align-items:center;gap:10px;font-size:11px;color:#B0B0B0;margin-bottom:16px;font-variant-numeric:tabular-nums}
  .mp-progress-bar{flex:1;height:4px;background:rgba(255,255,255,.15);border-radius:2px;position:relative;cursor:pointer}
  .mp-progress{height:100%;background:#fff;border-radius:2px;width:0%;position:relative;transition:width .1s linear}
  .mp-progress::after{content:'';position:absolute;right:-4px;top:-3px;width:10px;height:10px;background:#fff;border-radius:50%;opacity:0;transition:opacity .2s}
  .mp-progress-bar:hover .mp-progress::after{opacity:1}
  .mp-controls{display:flex;justify-content:space-between;align-items:center;padding:0 8px}
  .mp-btn{background:none;border:none;color:#fff;cursor:pointer;padding:8px;display:flex;align-items:center;justify-content:center;opacity:.7;transition:opacity .2s,transform .2s}
  .mp-btn:hover{opacity:1;transform:scale(1.1)}
  .mp-btn svg{width:20px;height:20px;fill:currentColor}
  .mp-btn.play-pause svg{width:28px;height:28px}
  .mp-btn.active{opacity:1;filter:drop-shadow(0 0 6px rgba(255,255,255,.6))}
  @media(max-width:520px){
    #music-player{width:calc(100vw - 48px);right:24px;bottom:calc(90px + env(safe-area-inset-bottom,0px))}
    #music-toggle{bottom:calc(24px + env(safe-area-inset-bottom,0px));right:24px}
  }
  `;

  /* ====== HTML ====== */
  var HTML = `
  <button id="music-toggle" aria-label="Bật/tắt trình phát nhạc">
    <svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
  </button>
  <div id="music-player" aria-label="Trình phát nhạc">
    <div class="mp-header">
      <div style="width:24px;flex-shrink:0"></div>
      <div class="mp-title-wrap">
        <p class="mp-title" id="mp-title">Đang tải...</p>
        <p class="mp-artist" id="mp-artist">Trust Chain Music</p>
      </div>
      <div class="mp-visualizer" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
    </div>
    <div class="mp-progress-wrap">
      <span id="mp-current">0:00</span>
      <div class="mp-progress-bar" id="mp-progress-bar"><div class="mp-progress" id="mp-progress"></div></div>
      <span id="mp-duration">0:00</span>
    </div>
    <div class="mp-controls">
      <button class="mp-btn" id="mp-shuffle" title="Ngẫu nhiên"><svg viewBox="0 0 24 24"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg></button>
      <button class="mp-btn" id="mp-prev" title="Bài trước"><svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg></button>
      <button class="mp-btn play-pause" id="mp-play-pause" title="Phát / Tạm dừng">
        <svg id="mp-icon-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        <svg id="mp-icon-pause" viewBox="0 0 24 24" style="display:none"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
      </button>
      <button class="mp-btn" id="mp-next" title="Bài tiếp theo"><svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg></button>
      <button class="mp-btn" id="mp-loop" title="Lặp lại"><svg viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg></button>
    </div>
  </div>
  `;

  /* ====== INIT ====== */
  function init(){
    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);
    document.body.insertAdjacentHTML('beforeend', HTML);
    setup();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ====== PLAYER LOGIC ====== */
  function setup(){
    var audio = new Audio();
    audio.volume = savedVolume;
    audio.preload = 'auto';
    audio.loop = isLoop;

    var player       = document.getElementById('music-player');
    var toggleBtn    = document.getElementById('music-toggle');
    var titleEl      = document.getElementById('mp-title');
    var artistEl     = document.getElementById('mp-artist');
    var playPauseBtn = document.getElementById('mp-play-pause');
    var iconPlay     = document.getElementById('mp-icon-play');
    var iconPause    = document.getElementById('mp-icon-pause');
    var prevBtn      = document.getElementById('mp-prev');
    var nextBtn      = document.getElementById('mp-next');
    var shuffleBtn   = document.getElementById('mp-shuffle');
    var loopBtn      = document.getElementById('mp-loop');
    var progressBar  = document.getElementById('mp-progress-bar');
    var progress     = document.getElementById('mp-progress');
    var currentTimeEl= document.getElementById('mp-current');
    var durationEl   = document.getElementById('mp-duration');
    var visualizer   = player.querySelector('.mp-visualizer');

    function saveState(){
      try {
        sessionStorage.setItem(KEY, JSON.stringify({
          index: currentIndex,
          time: audio.currentTime || 0,
          playing: isPlaying,
          shuffle: isShuffle,
          loop: isLoop,
          volume: audio.volume
        }));
      } catch(e){}
    }

    function loadSong(i){
      var s = songs[i];
      audio.src = s.src;
      titleEl.textContent = s.title;
      artistEl.textContent = s.artist;
    }

    function updatePlayIcon(){
      iconPlay.style.display  = isPlaying ? 'none' : 'block';
      iconPause.style.display = isPlaying ? 'block' : 'none';
    }

    function playSong(){
      var p = audio.play();
      if(!p || !p.then) return;
      p.then(function(){
        isPlaying = true;
        updatePlayIcon();
        visualizer.style.opacity = '1';
        saveState();
      }).catch(function(){
        isPlaying = false;
        updatePlayIcon();
        visualizer.style.opacity = '0.3';
      });
    }

    function pauseSong(){
      isPlaying = false;
      audio.pause();
      updatePlayIcon();
      visualizer.style.opacity = '0.3';
      saveState();
    }

    function pickRandom(){
      if(songs.length <= 1) return 0;
      var i;
      do { i = Math.floor(Math.random()*songs.length); } while(i === currentIndex);
      return i;
    }

    function nextSong(){
      currentIndex = isShuffle ? pickRandom() : (currentIndex + 1) % songs.length;
      loadSong(currentIndex);
      if(isPlaying) playSong(); else { updatePlayIcon(); saveState(); }
    }

    function prevSong(){
      currentIndex = isShuffle ? pickRandom() : (currentIndex - 1 + songs.length) % songs.length;
      loadSong(currentIndex);
      if(isPlaying) playSong(); else { updatePlayIcon(); saveState(); }
    }

    function fmt(sec){
      if(!isFinite(sec) || sec < 0) return '0:00';
      var m = Math.floor(sec/60), s = Math.floor(sec%60);
      return m + ':' + (s<10?'0':'') + s;
    }

    /* ===== SỰ KIỆN ===== */
    toggleBtn.addEventListener('click', function(){ player.classList.toggle('show'); });
    playPauseBtn.addEventListener('click', function(){ if(isPlaying) pauseSong(); else playSong(); });
    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);

    shuffleBtn.addEventListener('click', function(){
      isShuffle = !isShuffle;
      shuffleBtn.classList.toggle('active', isShuffle);
      saveState();
    });

    loopBtn.addEventListener('click', function(){
      isLoop = !isLoop;
      audio.loop = isLoop;
      loopBtn.classList.toggle('active', isLoop);
      saveState();
    });

    progressBar.addEventListener('click', function(e){
      if(!audio.duration) return;
      var rect = progressBar.getBoundingClientRect();
      var pos = (e.clientX - rect.left) / rect.width;
      audio.currentTime = pos * audio.duration;
    });

    audio.addEventListener('timeupdate', function(){
      if(audio.duration){
        progress.style.width = (audio.currentTime / audio.duration * 100) + '%';
        currentTimeEl.textContent = fmt(audio.currentTime);
        durationEl.textContent = '-' + fmt(audio.duration - audio.currentTime);
      }
    });

    audio.addEventListener('loadedmetadata', function(){
      durationEl.textContent = '-' + fmt(audio.duration);
      if(pendingTime > 0 && pendingTime < audio.duration){
        try { audio.currentTime = pendingTime; } catch(e){}
      }
      pendingTime = 0;
    });

    audio.addEventListener('ended', function(){
      if(isLoop){ audio.currentTime = 0; playSong(); }
      else nextSong();
    });

    /* Lưu state */
    addEventListener('beforeunload', saveState);
    addEventListener('pagehide', saveState);
    setInterval(saveState, 2000);

    /* Khởi tạo UI */
    loadSong(currentIndex);
    shuffleBtn.classList.toggle('active', isShuffle);
    loopBtn.classList.toggle('active', isLoop);
    visualizer.style.opacity = '0.3';
    updatePlayIcon();

    /* Nếu trang trước đang phát → thử phát tiếp */
    if(wantResume){
      player.classList.add('show');

      var tryResume = function(){
        var p = audio.play();
        if(!p || !p.then) return;
        p.then(function(){
          isPlaying = true;
          updatePlayIcon();
          visualizer.style.opacity = '1';
          saveState();
        }).catch(function(){
          /* Autoplay bị chặn → chờ user tương tác */
          isPlaying = false;
          updatePlayIcon();
          var onInteract = function(){
            if(isPlaying) return;
            var pp = audio.play();
            if(!pp || !pp.then) return;
            pp.then(function(){
              isPlaying = true;
              updatePlayIcon();
              visualizer.style.opacity = '1';
              saveState();
            }).catch(function(){});
            ['click','touchstart','keydown','scroll'].forEach(function(ev){
              document.removeEventListener(ev, onInteract);
            });
          };
          ['click','touchstart','keydown'].forEach(function(ev){
            document.addEventListener(ev, onInteract);
          });
          document.addEventListener('scroll', onInteract, { passive: true });
        });
      };

      /* Chờ metadata để set currentTime rồi mới play */
      if(audio.readyState >= 1){
        tryResume();
      } else {
        audio.addEventListener('loadedmetadata', tryResume, { once: true });
      }
    }
  }
})();
