/* ==========================================================
   TRUST CHAIN — SHARED MUSIC PLAYER
   - Autoplay muted → unmute on first gesture
   - Thanh âm lượng: 0 → 200 (mặc định 100)
   - Chuyển bài tuần tự
   ========================================================== */
(function(){
  'use strict';

  /* ====== DANH SÁCH NHẠC ====== */
  var songs = [
    { src: 'music/君との夏はソーダ味.mp3', title: '君との夏はソーダ味', artist: 'Unknown' },
    { src: 'music/サブカルに恋して.mp3',   title: 'サブカルに恋して',   artist: 'Unknown' },
    { src: 'music/だらけモードON.mp3',    title: 'だらけモードON',    artist: 'Unknown' }
  ];

  if(!songs.length) return;

  var VOL_MIN = 0, VOL_MAX = 200, VOL_DEFAULT = 100;

  /* ====== STATE ====== */
  var KEY = 'tc_music_v2';
  var saved = {};
  try { saved = JSON.parse(sessionStorage.getItem(KEY) || '{}'); } catch(e){ saved = {}; }

  var currentIndex = (typeof saved.index === 'number' && saved.index >= 0 && saved.index < songs.length)
                     ? saved.index : 0;
  var isLoop      = !!saved.loop;
  var isPlaying   = false;
  var pendingTime = (typeof saved.time === 'number' && saved.time > 0) ? saved.time : 0;
  var wantResume  = saved.playing !== false;

  var savedVolume200;
  if (typeof saved.volume === 'number'){
    savedVolume200 = saved.volume <= 1 ? Math.round(saved.volume * VOL_MAX) : saved.volume;
  } else {
    savedVolume200 = VOL_DEFAULT;
  }
  savedVolume200 = Math.max(VOL_MIN, Math.min(VOL_MAX, savedVolume200));

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
  .mp-volume-row{max-height:0;overflow:hidden;opacity:0;display:flex;align-items:center;gap:10px;font-size:11px;color:#B0B0B0;margin:0;transition:max-height .35s ease,opacity .25s ease,margin .35s ease;font-variant-numeric:tabular-nums}
  #music-player.volume-open .mp-volume-row{max-height:40px;opacity:1;margin-bottom:16px}
  .mp-volume-row svg{width:14px;height:14px;fill:#B0B0B0;flex-shrink:0}
  .mp-volume-bar{flex:1;height:4px;background:rgba(255,255,255,.15);border-radius:2px;position:relative;cursor:pointer}
  .mp-volume-fill{height:100%;background:#fff;border-radius:2px;width:50%;position:relative;transition:width .1s linear}
  .mp-volume-fill::after{content:'';position:absolute;right:-4px;top:-3px;width:10px;height:10px;background:#fff;border-radius:50%;opacity:0;transition:opacity .2s}
  .mp-volume-bar:hover .mp-volume-fill::after{opacity:1}
  .mp-volume-val{min-width:32px;text-align:right}
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
    <div class="mp-volume-row" id="mp-volume-row">
      <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
      <div class="mp-volume-bar" id="mp-volume-bar"><div class="mp-volume-fill" id="mp-volume-fill"></div></div>
      <span class="mp-volume-val" id="mp-volume-val">100</span>
    </div>
    <div class="mp-controls">
      <button class="mp-btn" id="mp-volume-toggle" title="Âm lượng">
        <svg id="mp-icon-vol-on" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
        <svg id="mp-icon-vol-off" viewBox="0 0 24 24" style="display:none"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
      </button>
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

  function setup(){
    var audio = new Audio();
    audio.volume = savedVolume200 / VOL_MAX;
    audio.preload = 'auto';
    audio.loop = isLoop;

    var player        = document.getElementById('music-player');
    var toggleBtn     = document.getElementById('music-toggle');
    var titleEl       = document.getElementById('mp-title');
    var artistEl      = document.getElementById('mp-artist');
    var playPauseBtn  = document.getElementById('mp-play-pause');
    var iconPlay      = document.getElementById('mp-icon-play');
    var iconPause     = document.getElementById('mp-icon-pause');
    var prevBtn       = document.getElementById('mp-prev');
    var nextBtn       = document.getElementById('mp-next');
    var loopBtn       = document.getElementById('mp-loop');
    var progressBar   = document.getElementById('mp-progress-bar');
    var progress      = document.getElementById('mp-progress');
    var currentTimeEl = document.getElementById('mp-current');
    var durationEl    = document.getElementById('mp-duration');
    var visualizer    = player.querySelector('.mp-visualizer');

    var volumeToggle  = document.getElementById('mp-volume-toggle');
    var iconVolOn     = document.getElementById('mp-icon-vol-on');
    var iconVolOff    = document.getElementById('mp-icon-vol-off');
    var volumeBar     = document.getElementById('mp-volume-bar');
    var volumeFill    = document.getElementById('mp-volume-fill');
    var volumeVal     = document.getElementById('mp-volume-val');

    var lastVolume200 = savedVolume200 > 0 ? savedVolume200 : VOL_DEFAULT;

    function getVolume200(){ return Math.round(audio.volume * VOL_MAX); }

    function updateVolumeUI(){
      var isSilent = audio.muted || audio.volume === 0;
      var v200 = isSilent ? 0 : getVolume200();
      volumeFill.style.width = (v200 / VOL_MAX * 100) + '%';
      volumeVal.textContent = v200;
      iconVolOn.style.display  = isSilent ? 'none' : 'block';
      iconVolOff.style.display = isSilent ? 'block' : 'none';
    }

    function setVolume200(v200){
      v200 = Math.max(VOL_MIN, Math.min(VOL_MAX, Math.round(v200)));
      audio.volume = v200 / VOL_MAX;
      if (v200 > 0){ audio.muted = false; lastVolume200 = v200; }
      updateVolumeUI();
      saveState();
    }

    function saveState(){
      try {
        sessionStorage.setItem(KEY, JSON.stringify({
          index: currentIndex,
          time: audio.currentTime || 0,
          playing: isPlaying,
          loop: isLoop,
          volume: getVolume200()
        }));
      } catch(e){}
    }

    function loadSong(i){
      var s = songs[i];
      audio.src = encodeURI(s.src);
      titleEl.textContent = s.title;
      artistEl.textContent = s.artist;
    }

    function updatePlayIcon(){
      iconPlay.style.display  = isPlaying ? 'none' : 'block';
      iconPause.style.display = isPlaying ? 'block' : 'none';
    }

    function playSong(){
      audio.muted = false;
      var p = audio.play();
      if(!p || !p.then) return;
      p.then(function(){
        isPlaying = true;
        updatePlayIcon();
        updateVolumeUI();
        visualizer.style.opacity = '1';
        saveState();
      }).catch(function(){
        isPlaying = false;
        updatePlayIcon();
      });
    }

    function pauseSong(){
      isPlaying = false;
      audio.pause();
      updatePlayIcon();
      visualizer.style.opacity = '0.3';
      saveState();
    }

    function nextSong(){
      currentIndex = (currentIndex + 1) % songs.length;
      loadSong(currentIndex);
      if(isPlaying) playSong(); else { updatePlayIcon(); saveState(); }
    }

    function prevSong(){
      currentIndex = (currentIndex - 1 + songs.length) % songs.length;
      loadSong(currentIndex);
      if(isPlaying) playSong(); else { updatePlayIcon(); saveState(); }
    }

    function fmt(sec){
      if(!isFinite(sec) || sec < 0) return '0:00';
      var m = Math.floor(sec/60), s = Math.floor(sec%60);
      return m + ':' + (s<10?'0':'') + s;
    }

    /* ===== SỰ KIỆN UI ===== */
    toggleBtn.addEventListener('click', function(){ player.classList.toggle('show'); });
    playPauseBtn.addEventListener('click', function(){ if(isPlaying) pauseSong(); else playSong(); });
    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);

    loopBtn.addEventListener('click', function(){
      isLoop = !isLoop;
      audio.loop = isLoop;
      loopBtn.classList.toggle('active', isLoop);
      saveState();
    });

    volumeToggle.addEventListener('click', function(e){
      if (e.shiftKey){
        if (getVolume200() > 0 || audio.muted){
          lastVolume200 = getVolume200() || VOL_DEFAULT;
          setVolume200(0);
        } else {
          setVolume200(lastVolume200 || VOL_DEFAULT);
        }
        return;
      }
      player.classList.toggle('volume-open');
      updateVolumeUI();
    });

    var volDragging = false;
    function setVolFromEvent(e){
      var rect = volumeBar.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      var ratio = Math.max(0, Math.min(1, x / rect.width));
      setVolume200(ratio * VOL_MAX);
    }
    volumeBar.addEventListener('mousedown', function(e){ volDragging = true; setVolFromEvent(e); e.preventDefault(); });
    document.addEventListener('mousemove', function(e){ if(volDragging) setVolFromEvent(e); });
    document.addEventListener('mouseup',   function(){ volDragging = false; });
    volumeBar.addEventListener('touchstart', function(e){ setVolFromEvent(e); e.preventDefault(); }, {passive:false});
    volumeBar.addEventListener('touchmove',  function(e){ setVolFromEvent(e); e.preventDefault(); }, {passive:false});

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

    addEventListener('beforeunload', saveState);
    addEventListener('pagehide', saveState);
    setInterval(saveState, 2000);

    /* ===== KHỞI TẠO UI ===== */
    loadSong(currentIndex);
    loopBtn.classList.toggle('active', isLoop);
    visualizer.style.opacity = '0.3';
    updatePlayIcon();
    updateVolumeUI();

    /* =============================================================
       AUTOPLAY: gọi nhiều lần nhưng có guard `isPlaying`
       ============================================================= */
    var GESTURE_EVENTS = ['click','touchstart','keydown','pointerdown'];

    function armUnmute(){
      function unmute(){
        if (!audio.muted) return;
        audio.muted = false;
        updateVolumeUI();
        saveState();
        GESTURE_EVENTS.forEach(function(ev){ document.removeEventListener(ev, unmute); });
      }
      GESTURE_EVENTS.forEach(function(ev){
        document.addEventListener(ev, unmute, { passive: true });
      });
    }

    function armRetryPlay(){
      function retry(){
        GESTURE_EVENTS.forEach(function(ev){ document.removeEventListener(ev, retry); });
        if (isPlaying) return;
        attemptPlay();
      }
      GESTURE_EVENTS.forEach(function(ev){
        document.addEventListener(ev, retry, { passive: true });
      });
    }

    function attemptPlay(){
      /* Chặn gọi lại khi đang phát */
      if (isPlaying) return;

      /* Bước 1: thử phát có tiếng */
      audio.muted = false;
      var p = audio.play();
      if (!p || !p.then) return;
      p.then(function(){
        isPlaying = true;
        updatePlayIcon();
        updateVolumeUI();
        visualizer.style.opacity = '1';
        saveState();
      }).catch(function(){
        /* Bước 2: bị chặn → phát muted (luôn được phép) */
        audio.muted = true;
        var pp = audio.play();
        if (!pp || !pp.then) return;
        pp.then(function(){
          isPlaying = true;
          updatePlayIcon();
          updateVolumeUI();
          visualizer.style.opacity = '1';
          saveState();
          /* Chờ user gesture → unmute */
          armUnmute();
        }).catch(function(){
          /* Cả 2 đều fail → chờ user gesture để thử lại */
          isPlaying = false;
          updatePlayIcon();
          armRetryPlay();
        });
      });
    }

    attemptPlay();
    setTimeout(attemptPlay, 600);
    setTimeout(attemptPlay, 1800);
    setTimeout(attemptPlay, 3200);

    var loader = document.getElementById('loader');
    if (loader){
      var mo = new MutationObserver(function(){
        if (loader.classList.contains('done')){
          setTimeout(attemptPlay, 100);
        }
      });
      mo.observe(loader, { attributes: true, attributeFilter: ['class'] });
    }

    /* Khi user bấm nút Play trên UI mà audio đang paused → phát */
    document.addEventListener('visibilitychange', function(){
      if (document.visibilityState === 'visible' && !isPlaying && wantResume){
        attemptPlay();
      }
    });
  }
})();
