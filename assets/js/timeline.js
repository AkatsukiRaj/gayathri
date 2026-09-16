/**
 * Timeline, Lifeline Tracker, Lightbox & Romantic Audio
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Intersection Observer for Scroll Reveals
  const revealElements = document.querySelectorAll('.milestone-item, .poem-interlude-slide');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -15% 0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        if (navigator.vibrate && entry.target.classList.contains('milestone-item')) {
          try { navigator.vibrate(25); } catch(e) {}
        }
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // 2. Dynamic Lifeline Progress Tracking
  const timelineContainer = document.querySelector('.timeline-container');
  const progressLine = document.querySelector('.lifeline-progress-glow');
  const pulseCursor = document.querySelector('.lifeline-pulse-cursor');

  function updateLifeline() {
    if (!timelineContainer || !progressLine) return;
    
    const rect = timelineContainer.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const containerTop = rect.top;
    const containerHeight = rect.height;

    const scrollProgress = (windowHeight * 0.65 - containerTop) / containerHeight;
    const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
    const percentage = clampedProgress * 100;

    progressLine.style.height = percentage + '%';
    if (pulseCursor) {
      pulseCursor.style.top = percentage + '%';
      pulseCursor.style.opacity = percentage > 0.5 ? '1' : '0';
    }
  }

  window.addEventListener('scroll', updateLifeline, { passive: true });
  window.addEventListener('resize', updateLifeline);
  updateLifeline();

  // 3. Audio Player & Romantic Web Audio Synthesizer
  const audioBtn = document.getElementById('audio-toggle');
  const bgmAudio = document.getElementById('bgm-audio');
  let isPlaying = false;
  let audioCtx = null;
  let synthInterval = null;

  const chordProgression = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7/9
    [220.00, 261.63, 329.63, 392.00], // Am7
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [196.00, 246.94, 293.66, 392.00]  // G6
  ];
  let chordIdx = 0;

  function initSynthAudio() {
    if (audioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    } catch(e) {}
  }

  function playAmbientPad() {
    if (!audioCtx || audioCtx.state === 'suspended') return;
    const chord = chordProgression[chordIdx % chordProgression.length];
    chordIdx++;

    chord.forEach(freq => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.035, audioCtx.currentTime + 1.5);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 5.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 5.8);
    });
  }

  function toggleAudio() {
    initSynthAudio();
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!isPlaying) {
      if (bgmAudio && bgmAudio.src && !bgmAudio.error) {
        bgmAudio.play().then(() => {
          isPlaying = true;
          audioBtn.classList.add('audio-playing');
        }).catch(() => {
          isPlaying = true;
          audioBtn.classList.add('audio-playing');
          playAmbientPad();
          synthInterval = setInterval(playAmbientPad, 4500);
        });
      } else {
        isPlaying = true;
        audioBtn.classList.add('audio-playing');
        playAmbientPad();
        synthInterval = setInterval(playAmbientPad, 4500);
      }
    } else {
      isPlaying = false;
      audioBtn.classList.remove('audio-playing');
      if (bgmAudio) bgmAudio.pause();
      if (synthInterval) clearInterval(synthInterval);
    }
  }

  if (audioBtn) {
    audioBtn.addEventListener('click', toggleAudio);
  }

  // 4. Floating Hearts & Rose Petal Shower Effect
  const floatingContainer = document.getElementById('floating-elements');

  function spawnFloatingHeart(customChar) {
    if (!floatingContainer) return;
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    
    const symbols = ['❤️', '💖', '✨', '🌹', '💕', '🌸', '💘', '🪐', '💫'];
    heart.textContent = customChar || symbols[Math.floor(Math.random() * symbols.length)];
    
    heart.style.left = Math.random() * 92 + 4 + '%';
    heart.style.animationDuration = (Math.random() * 2 + 3.2) + 's';
    heart.style.fontSize = (Math.random() * 1.2 + 1.2) + 'rem';
    
    floatingContainer.appendChild(heart);
    setTimeout(() => {
      if (heart.parentNode) heart.parentNode.removeChild(heart);
    }, 5500);
  }

  function triggerHeartShower(count = 30) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => spawnFloatingHeart(), i * 110);
    }
  }

  // 5. Love Letter Modal
  const openLetterBtn = document.getElementById('open-letter-btn');
  const closeLetterBtn = document.getElementById('close-letter-btn');
  const letterModal = document.getElementById('love-letter-modal');
  const climaxHeart = document.getElementById('climax-big-heart');

  function openLetter() {
    if (!letterModal) return;
    letterModal.classList.add('active');
    triggerHeartShower(35);
    if (navigator.vibrate) {
      try { navigator.vibrate([40, 60, 40]); } catch(e) {}
    }
  }

  function closeLetter() {
    if (!letterModal) return;
    letterModal.classList.remove('active');
  }

  if (openLetterBtn) openLetterBtn.addEventListener('click', openLetter);
  if (climaxHeart) climaxHeart.addEventListener('click', openLetter);
  if (closeLetterBtn) closeLetterBtn.addEventListener('click', closeLetter);

  if (letterModal) {
    letterModal.addEventListener('click', (e) => {
      if (e.target === letterModal) closeLetter();
    });
  }

  // 6. Replay Journey Button
  const replayBtn = document.getElementById('replay-journey-btn');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 7. Lightbox Zoom for Images
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close-btn');

  document.querySelectorAll('.image-frame').forEach(frame => {
    frame.addEventListener('click', () => {
      const img = frame.querySelector('img');
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = img.alt || '';
        lightbox.classList.add('active');
        triggerHeartShower(10);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('active');
    });
  }

  // 8. Birthday Countdown Timer to October 3
  function initBirthdayCountdown() {
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');
    const surpriseMsgEl = document.getElementById('surprise-msg');

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    function getNextOct3() {
      const now = new Date();
      let target = new Date(now.getFullYear(), 9, 3, 0, 0, 0); // Month is 0-indexed: 9 = October
      if (now.getTime() > target.getTime() + (24 * 60 * 60 * 1000)) {
        target = new Date(now.getFullYear() + 1, 9, 3, 0, 0, 0);
      }
      return target;
    }

    const targetDate = getNextOct3();

    function updateTimer() {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0 && diff > -86400000) {
        // Today is October 3!
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minsEl.textContent = '00';
        secsEl.textContent = '00';
        if (surpriseMsgEl) {
          surpriseMsgEl.innerHTML = '🎉 இன்று என் பொண்டாட்டி காயத்ரி பிறந்தநாள்! 🎂👑';
        }
        return;
      }

      const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
      const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
      const seconds = Math.max(0, Math.floor((diff % (1000 * 60)) / 1000));

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minsEl.textContent = String(minutes).padStart(2, '0');
      secsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  initBirthdayCountdown();

});
