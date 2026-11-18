(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const gradeKeys = ['10', '11', '12'];
  const letters = gradeKeys.flatMap(grade => (HEART_DATA[grade] || []).map((entry, index) => ({
    ...entry,
    grade,
    index,
    title: entry.name,
    content: LETTER_CONTENT[entry.id] || ''
  })));
  const state = { grade: 'all', query: '', typing: false, mediaMode: 'youtube' };
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const TYPE_DELAY = 27;
  const TYPE_CHUNK = 2;
  let timer = 0;
  let typingToken = 0;
  let toastTimer = 0;
  let typingRun = null;
  let lastOpenedButton = null;
  let activeLetterId = '';
  let requestYouTubePlayOnReady = false;
  let currentFilmDimensions = null;
  let filmResizeFrame = 0;
  let randomDeck = [];
  let randomDeckKey = '';
  let lastRandomId = '';
  let youtubePlayer = null;
  let youtubeApiPromise = null;
  let youtubeRequestToken = 0;
  let selectedMediaFile = null;
  let selectedMediaObjectUrl = '';
  let selectedMediaConfig = null;

  function normalize(value) {
    return String(value).toLocaleLowerCase('vi').normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  }

  function filteredLetters() {
    const query = normalize(state.query);
    return letters.filter(item =>
      (state.grade === 'all' || item.grade === state.grade) &&
      (!query || normalize(`${item.title} ${item.specialty || ''} khoi ${item.grade}`).includes(query))
    );
  }

  function toast(message) {
    const element = $('#toast');
    if (!element) return;
    element.textContent = message;
    element.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => element.classList.remove('show'), 2400);
  }

  function renderHearts() {
    const grid = $('#heartCanvas');
    if (!grid) return;
    const items = filteredLetters();
    const fragment = document.createDocumentFragment();
    let previousGrade = '';

    items.forEach(item => {
      if (item.grade !== previousGrade) {
        const group = document.createElement('div');
        group.className = `heart-group-heading grade-${item.grade}`;
        group.setAttribute('role', 'heading');
        group.setAttribute('aria-level', '3');

        const groupDot = document.createElement('span');
        groupDot.className = 'heart-group-dot';
        const groupName = document.createElement('b');
        groupName.textContent = `Khối ${item.grade}`;
        const groupCount = items.filter(candidate => candidate.grade === item.grade).length;
        group.setAttribute('aria-label', `Khối ${item.grade}, ${groupCount} lớp`);

        group.append(groupDot, groupName);
        fragment.append(group);
        previousGrade = item.grade;
      }

      const button = document.createElement('button');
      button.type = 'button';
      button.className = `heart-node grade-${item.grade}`;
      button.dataset.id = item.id;
      const globalIndex = letters.findIndex(letter => letter.id === item.id);
      button.dataset.motif = String(globalIndex % 6);
      button.style.setProperty('--float-delay', `${-((globalIndex * 0.67) % 8.2).toFixed(2)}s`);
      button.style.setProperty('--float-duration', `${(5.2 + (globalIndex % 8) * 0.29).toFixed(2)}s`);
      button.style.setProperty('--sparkle-delay', `${-((globalIndex * 0.73) % 7.4).toFixed(2)}s`);
      button.style.setProperty('--sparkle-right', `${18 + (globalIndex % 5) * 6}%`);
      button.style.setProperty('--sparkle-top', `${14 + (globalIndex % 4) * 3}%`);
      button.style.setProperty('--rest-y', `${[-3, 2, 4, -1][globalIndex % 4]}px`);
      button.style.setProperty('--rest-rotate', `${[-1.1, .8, 1.25, -.65][globalIndex % 4]}deg`);
      button.setAttribute('aria-label', `Mở thư ${item.title}, khối ${item.grade}`);

      const aura = document.createElement('span');
      aura.className = 'heart-aura';
      aura.setAttribute('aria-hidden', 'true');

      const glyph = document.createElement('span');
      glyph.className = 'heart-glyph';
      glyph.setAttribute('aria-hidden', 'true');

      const sparkle = document.createElement('span');
      sparkle.className = 'heart-sparkle';
      sparkle.textContent = '✦';
      sparkle.setAttribute('aria-hidden', 'true');

      const name = document.createElement('span');
      name.className = 'node-name';
      name.textContent = item.title;

      const meta = document.createElement('span');
      meta.className = 'node-meta';
      meta.textContent = `KHỐI ${item.grade} · ${(item.specialty || '').toLocaleUpperCase('vi')}`;

      button.append(aura, glyph, sparkle, name, meta);
      button.addEventListener('click', () => {
        button.classList.remove('is-opening');
        void button.offsetWidth;
        button.classList.add('is-opening');
        window.setTimeout(() => button.classList.remove('is-opening'), 520);
        openLetter(item, button);
      });
      fragment.append(button);
    });

    grid.replaceChildren(fragment);
    grid.dataset.view = state.grade;
    $('#searchEmpty').hidden = items.length > 0;
    $('#resultCount').textContent = `${items.length} lớp`;
    $('#resultCount').style.display = 'inline-flex';

    const dot = $('.grade-dot');
    dot.className = `grade-dot ${state.grade === 'all' ? 'all-dot' : `g${state.grade}`}`;
    $('.grade-intro b').textContent = state.grade === 'all' ? '36 trái tim' : `${items.length} trái tim · Khối ${state.grade}`;
    $('.grade-intro small').textContent = state.grade === 'all'
      ? 'Ba khối · Một vườn lời chúc'
      : `Sắc màu nhận diện khối ${state.grade}`;
  }

  // Letter reveal: paced text progression, appended in small batches.
  function stopTyping() {
    typingToken += 1;
    window.clearTimeout(timer);
    timer = 0;
    typingRun = null;
    state.typing = false;
  }

  function splitLetterParagraphs(text) {
    if (!text) return [];
    // Tách nhịp đọc tại dấu kết câu hoặc xuống dòng; ghép lại vẫn nguyên văn tuyệt đối.
    const parts = text.split(/(?<=[.!?。！？])(?=\s+[A-ZÀ-Ỹ“"“‘])|(?<=\n)/u).filter(part => part.length > 0);
    return parts.length ? parts : [text];
  }

  function typeText(text) {
    stopTyping();
    const target = $('#dialogCopy');
    target.replaceChildren();
    const parts = splitLetterParagraphs(text);

    if (reducedMotionQuery.matches || !text) {
      const fragment = document.createDocumentFragment();
      parts.forEach(part => {
        const paragraph = document.createElement('p');
        paragraph.textContent = part;
        fragment.append(paragraph);
      });
      target.replaceChildren(fragment);
      return;
    }

    const fragment = document.createDocumentFragment();
    const runs = parts.map(part => {
      const paragraph = document.createElement('p');
      const textNode = document.createTextNode('');
      paragraph.append(textNode);
      fragment.append(paragraph);
      return { chars: Array.from(part), index: 0, textNode };
    });
    target.replaceChildren(fragment);

    const run = { parts: runs, partIndex: 0, token: typingToken, tick: null };
    typingRun = run;
    state.typing = true;

    run.tick = () => {
      if (run.token !== typingToken || !$('#letterDialog').open || typingRun !== run) return;
      if (document.hidden) {
        timer = 0;
        return;
      }

      let delay = TYPE_DELAY;
      let count = 0;
      while (run.partIndex < run.parts.length && count < TYPE_CHUNK) {
        const current = run.parts[run.partIndex];
        if (current.index >= current.chars.length) {
          run.partIndex += 1;
          if (run.partIndex < run.parts.length) delay = 135;
          continue;
        }

        const character = current.chars[current.index++];
        current.textNode.appendData(character);
        count += 1;
        if (/[.!?。！？]/u.test(character)) {
          delay = 185;
          break;
        }
        if (/[,;:，；：]/u.test(character)) {
          delay = 100;
          break;
        }
        if (/\n/u.test(character)) {
          delay = 125;
          break;
        }
      }

      while (run.partIndex < run.parts.length && run.parts[run.partIndex].index >= run.parts[run.partIndex].chars.length) {
        run.partIndex += 1;
      }
      if (run.partIndex >= run.parts.length) {
        state.typing = false;
        typingRun = null;
        timer = 0;
        return;
      }
      timer = window.setTimeout(run.tick, delay);
    };

    timer = window.setTimeout(run.tick, 220);
  }

  function resetFeedback() {
    $$('.feedback-options button').forEach(button => {
      button.classList.remove('selected');
      button.setAttribute('aria-pressed', 'false');
    });
    const thanks = $('#feedbackThanks');
    thanks.textContent = '';
    thanks.classList.remove('feedback-thanks-show');
  }

  function updateLetterNavigation() {
    const items = filteredLetters();
    const index = items.findIndex(item => item.id === activeLetterId);
    const previous = $('#prevLetter');
    const next = $('#nextLetter');
    const position = $('#letterPosition');

    previous.disabled = index <= 0;
    next.disabled = index < 0 || index >= items.length - 1;
    position.textContent = index < 0
      ? `— / ${String(items.length).padStart(2, '0')}`
      : `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
  }

  function openLetter(item, triggerButton = null) {
    stopTyping();
    const dialog = $('#letterDialog');
    const wasOpen = dialog.open;
    if (!wasOpen) lastOpenedButton = triggerButton || document.activeElement;
    activeLetterId = item.id;
    resetFeedback();

    dialog.className = `letter-dialog grade-${item.grade}`;
    $('#dialogGrade').textContent = `KHỐI ${item.grade} · ${(item.specialty || '').toLocaleUpperCase('vi')}`;
    $('#dialogTitle').textContent = item.title;
    $('#dialogCopy').textContent = '';

    const content = $('.letter-content', dialog);
    content.classList.remove('letter-change');
    void content.offsetWidth;
    content.classList.add('letter-change');
    const finishLetterArrival = event => {
      if (event.target !== content) return;
      content.classList.remove('letter-change');
      content.removeEventListener('animationend', finishLetterArrival);
    };
    content.addEventListener('animationend', finishLetterArrival);

    if (!wasOpen) dialog.showModal();
    dialog.scrollTop = 0;
    updateLetterNavigation();
    typeText(item.content || '');
  }

  function stepLetter(direction) {
    const items = filteredLetters();
    const currentIndex = items.findIndex(item => item.id === activeLetterId);
    const nextItem = items[currentIndex + direction];
    if (!nextItem) return;
    openLetter(nextItem);
  }

  $('#prevLetter').addEventListener('click', () => stepLetter(-1));
  $('#nextLetter').addEventListener('click', () => stepLetter(1));

  function closeLetter() {
    stopTyping();
    const dialog = $('#letterDialog');
    if (dialog.open) dialog.close();
  }

  $('#closeDialog').addEventListener('click', closeLetter);
  $('#letterDialog').addEventListener('cancel', () => stopTyping());
  $('#letterDialog').addEventListener('close', () => {
    stopTyping();
    if (lastOpenedButton?.isConnected) lastOpenedButton.focus({ preventScroll: true });
    else $('#heartSearch').focus({ preventScroll: true });
  });
  $('#letterDialog').addEventListener('click', event => {
    if (event.target === $('#letterDialog')) closeLetter();
  });

  // Pause without losing progress while the visitor switches tabs or apps.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && typingRun && timer) {
      window.clearTimeout(timer);
      timer = 0;
    } else if (!document.hidden && typingRun && !timer) {
      timer = window.setTimeout(typingRun.tick, 70);
    }
  });

  const feedbackReplies = [
    'Một lựa chọn thật dễ thương. Cảm ơn cậu nha ♡',
    'Một lời cảm ơn thật xinh. Cảm ơn cậu nha ✦',
    'Cảm giác được quan tâm thật ấm áp ☀'
  ];
  $$('.feedback-options button').forEach((button, index) => button.addEventListener('click', () => {
    $$('.feedback-options button').forEach(candidate => {
      const chosen = candidate === button;
      candidate.classList.toggle('selected', chosen);
      candidate.setAttribute('aria-pressed', String(chosen));
    });
    const thanks = $('#feedbackThanks');
    thanks.textContent = feedbackReplies[index];
    thanks.classList.remove('feedback-thanks-show');
    window.requestAnimationFrame(() => thanks.classList.add('feedback-thanks-show'));
  }));

  $$('.grade-tab').forEach(button => button.addEventListener('click', () => {
    state.grade = button.dataset.grade;
    $$('.grade-tab').forEach(tab => {
      const selected = tab === button;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-pressed', String(selected));
    });
    renderHearts();
  }));

  $('#heartSearch').addEventListener('input', event => {
    state.query = event.target.value.trim();
    $('#clearSearch').hidden = !state.query;
    renderHearts();
  });
  $('#clearSearch').addEventListener('click', () => {
    $('#heartSearch').value = '';
    state.query = '';
    $('#clearSearch').hidden = true;
    renderHearts();
    $('#heartSearch').focus();
  });
  $('#randomLetter').addEventListener('click', () => {
    const options = filteredLetters();
    if (!options.length) return toast('Chưa tìm thấy lớp phù hợp.');

    const key = options.map(item => item.id).join('|');
    if (key !== randomDeckKey || randomDeck.length === 0) {
      randomDeckKey = key;
      randomDeck = options.map(item => item.id);
      for (let index = randomDeck.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [randomDeck[index], randomDeck[swapIndex]] = [randomDeck[swapIndex], randomDeck[index]];
      }
      if (randomDeck.length > 1 && randomDeck[randomDeck.length - 1] === lastRandomId) {
        [randomDeck[0], randomDeck[randomDeck.length - 1]] = [randomDeck[randomDeck.length - 1], randomDeck[0]];
      }
    }

    const nextId = randomDeck.pop();
    const selected = options.find(item => item.id === nextId);
    if (!selected) return toast('Chưa tìm thấy lớp phù hợp.');
    lastRandomId = selected.id;
    openLetter(selected);
  });

  // Video player. Configuration lives in media/video-config.js, never in data.js.
  const defaultInvite = {
    eyebrow: 'AFTER THE FILM',
    copy: 'Những lời nhắn nhỏ đang đợi được mở. Chạm xuống khu vườn và chọn một trái tim nhé.',
    action: 'Đi đến khu vườn thư'
  };

  function setFilmPlayOverlay(visible, label = 'BẮT ĐẦU XEM') {
    const overlay = $('#filmPlayOverlay');
    if (!overlay) return;
    overlay.hidden = !visible;
    $('#filmPlayLabel').textContent = label;
  }

  function fitFilmStage() {
    const stage = $('#memoryStage');
    if (!currentFilmDimensions) return;
    const { width, height } = currentFilmDimensions;
    const isPhone = window.matchMedia('(max-width: 699px)').matches;
    const isPortrait = height > width * 1.08;
    const parentWidth = stage.parentElement.getBoundingClientRect().width;
    const maxWidth = isPortrait
      ? Math.min(parentWidth, isPhone ? 320 : 360)
      : parentWidth;
    const maxHeight = isPortrait
      ? Math.min(window.innerHeight * (isPhone ? 0.62 : 0.64), isPhone ? 520 : 560)
      : Math.min(window.innerHeight * 0.72, 720);
    const scale = Math.min(maxWidth / width, maxHeight / height);
    stage.style.width = `${Math.round(width * scale * 100) / 100}px`;
    stage.style.height = `${Math.round(height * scale * 100) / 100}px`;
  }

  function setFilmAspect(width, height) {
    const stage = $('#memoryStage');
    if (!width || !height) return;
    currentFilmDimensions = { width, height };
    stage.classList.toggle('is-portrait', height > width * 1.08);
    fitFilmStage();
  }

  window.addEventListener('resize', () => {
    if (!currentFilmDimensions) return;
    if (filmResizeFrame) window.cancelAnimationFrame(filmResizeFrame);
    filmResizeFrame = window.requestAnimationFrame(() => {
      filmResizeFrame = 0;
      fitFilmStage();
    });
  }, { passive: true });

  function resetFilmInvite() {
    $('#filmInvite').classList.remove('film-finished');
    $('#memoryStage').classList.remove('is-finished', 'is-playing');
    $('#filmInviteEyebrow').textContent = defaultInvite.eyebrow;
    $('#filmInviteCopy').textContent = defaultInvite.copy;
    $('#filmInviteAction').textContent = defaultInvite.action;
  }

  function handleFilmEnded() {
    const invite = $('#filmInvite');
    const stage = $('#memoryStage');
    invite.classList.remove('film-finished');
    stage.classList.remove('is-playing');
    stage.classList.add('is-finished');
    void invite.offsetWidth;
    invite.classList.add('film-finished');
    $('#filmInviteCopy').textContent = 'Thước phim khép lại, nhưng những lời nhắn vẫn còn ở phía trước. Chạm xuống khu vườn để mở một trái tim nhé.';
    $('#filmInviteEyebrow').textContent = 'THE NEXT LITTLE SURPRISE';
    $('#filmInviteAction').textContent = 'Mở khu vườn lời nhắn';
    setFilmPlayOverlay(true, 'XEM LẠI THƯỚC PHIM');
  }

  function playMemoryVideo() {
    const player = $('#memoryPlayer');
    if (!player.hidden && player.getAttribute('src')) {
      if (player.ended) player.currentTime = 0;
      const playAttempt = player.play();
      if (playAttempt && typeof playAttempt.catch === 'function') {
        playAttempt.catch(() => toast('Trình duyệt chưa thể phát video. Hãy chạm nút phát trong trình xem.'));
      }
      return;
    }

    if (youtubePlayer && typeof youtubePlayer.playVideo === 'function') {
      youtubePlayer.playVideo();
      return;
    }

    requestYouTubePlayOnReady = true;
    toast('Trình phát đang chuẩn bị. Chạm lại sau giây lát nhé.');
  }

  $('#filmPlayOverlay').addEventListener('click', playMemoryVideo);

  function formatDuration(seconds) {
    if (!Number.isFinite(seconds) || seconds <= 0) return '';
    const whole = Math.floor(seconds);
    const mins = Math.floor(whole / 60);
    const secs = whole % 60;
    const hours = Math.floor(mins / 60);
    return hours > 0
      ? `${hours}:${String(mins % 60).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      : `${mins}:${String(secs).padStart(2, '0')}`;
  }

  function setMediaCaption(title, caption) {
    $('#mediaName').textContent = String(title || 'THƯỚC PHIM 19/11').toLocaleUpperCase('vi');
    $('#mediaMeta').textContent = caption || 'Chuyên Hạ Long · 19.11.2026';
  }

  function setVideoPlaceholder(message = 'Video kỷ niệm sẽ được cập nhật tại đây.') {
    requestYouTubePlayOnReady = false;
    $('#memoryPlayer').pause();
    $('#memoryPlayer').removeAttribute('src');
    $('#memoryPlayer').load();
    $('#memoryPlayer').hidden = true;
    $('#memoryYoutubeHost').hidden = true;
    $('#memoryYoutubeHost').replaceChildren();
    $('#memoryEmpty').hidden = false;
    $('#memoryEmpty small').textContent = 'Một video · Chuyên Hạ Long 19.11';
    $('#videoFallback').hidden = true;
    $('#memoryStage').classList.remove('has-media', 'is-playing', 'is-finished', 'is-portrait');
    currentFilmDimensions = null;
    $('#memoryStage').style.removeProperty('--film-ratio');
    $('#memoryStage').style.removeProperty('aspect-ratio');
    $('#memoryStage').style.removeProperty('width');
    $('#memoryStage').style.removeProperty('height');
    setFilmPlayOverlay(false);
    $('#mediaMeta').textContent = message;
    destroyYoutubePlayer();
  }

  function destroyYoutubePlayer() {
  youtubeRequestToken += 1;

  if (youtubePlayer && typeof youtubePlayer.destroy === 'function') {
    try {
      youtubePlayer.destroy();
    } catch (_) {
      // Trình phát có thể đã bị gỡ.
    }
  }

  youtubePlayer = null;
}

 
function loadYouTubeApi() {
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }

  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve, reject) => {
    let finished = false;

    const timeout = window.setTimeout(() => {
      if (finished) return;
      finished = true;
      reject(new Error('Không tải được YouTube Player API.'));
    }, 14000);

    const previousCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      try {
        if (typeof previousCallback === 'function') {
          previousCallback();
        }
      } catch (error) {
        console.warn('YouTube callback cũ gặp lỗi:', error);
      }

      if (finished) return;

      if (window.YT && window.YT.Player) {
        finished = true;
        window.clearTimeout(timeout);
        resolve(window.YT);
      }
    };

    let script = $('script[data-youtube-iframe-api]');

    if (!script) {
      script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.dataset.youtubeIframeApi = 'true';

      script.onerror = () => {
        if (finished) return;
        finished = true;
        window.clearTimeout(timeout);
        reject(new Error('Trình duyệt không tải được trình phát YouTube.'));
      };

      document.head.append(script);
    }
  }).catch(error => {
    youtubeApiPromise = null;
    throw error;
  });

  return youtubeApiPromise;
}


  function applyFileVideo(source, title, caption) {
    requestYouTubePlayOnReady = false;
    destroyYoutubePlayer();
    $('#memoryYoutubeHost').hidden = true;
    $('#memoryYoutubeHost').replaceChildren();
    $('#memoryEmpty').hidden = true;
    $('#videoFallback').hidden = true;
    $('#memoryStage').classList.add('has-media');
    $('#memoryStage').classList.remove('is-playing', 'is-finished', 'is-portrait');
    currentFilmDimensions = null;
    $('#memoryStage').style.setProperty('--film-ratio', '16 / 9');
    $('#memoryStage').style.aspectRatio = '16 / 9';
    $('#memoryStage').style.width = '100%';
    $('#memoryStage').style.height = 'auto';
    const player = $('#memoryPlayer');
    player.hidden = false;
    player.pause();
    player.src = source;
    player.load();
    setFilmPlayOverlay(true, 'BẮT ĐẦU XEM');
    setMediaCaption(title, caption || 'Video · Chuyên Hạ Long 19.11');
  }

  
async function applyYouTubeVideo(videoId, title, caption) {
  requestYouTubePlayOnReady = false;
  destroyYoutubePlayer();

  const requestToken = youtubeRequestToken;
  const host = $('#memoryYoutubeHost');
  const mount = document.createElement('div');

  mount.id = 'memoryYoutubePlayer';
  host.replaceChildren(mount);
  host.hidden = false;

  $('#memoryPlayer').pause();
  $('#memoryPlayer').removeAttribute('src');
  $('#memoryPlayer').load();
  $('#memoryPlayer').hidden = true;

  $('#memoryEmpty').hidden = true;
  $('#memoryStage').classList.add('has-media');
  $('#memoryStage').classList.remove('is-playing', 'is-finished', 'is-portrait');
  currentFilmDimensions = null;
  $('#memoryStage').style.setProperty('--film-ratio', '16 / 9');
  $('#memoryStage').style.aspectRatio = '16 / 9';
  $('#memoryStage').style.width = '100%';
  $('#memoryStage').style.height = 'auto';
  setFilmPlayOverlay(true, 'BẮT ĐẦU XEM');
  $('#videoFallback').href =
    `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
  $('#videoFallback').hidden = false;

  setMediaCaption(
    title,
    caption || 'YouTube · Chuyên Hạ Long 19.11'
  );

  try {
    const YT = await loadYouTubeApi();

    if (
      requestToken !== youtubeRequestToken ||
      !host.isConnected ||
      host.hidden ||
      !host.contains(mount)
    ) {
      return;
    }

    const player = new YT.Player(mount, {
      width: '100%',
      height: '100%',
      videoId,
      host: 'https://www.youtube-nocookie.com',
      playerVars: {
        playsinline: 1,
        rel: 0,
        modestbranding: 1,
        origin: window.location.origin === 'null'
          ? undefined
          : window.location.origin
      },
      events: {
        onReady: event => {
          if (requestToken !== youtubeRequestToken) {
            event.target.destroy();
            return;
          }

          youtubePlayer = event.target;
          $('#memoryEmpty').hidden = true;
          $('#videoFallback').hidden = false;
          if (requestYouTubePlayOnReady) {
            requestYouTubePlayOnReady = false;
            event.target.playVideo();
          }
        },

        onStateChange: event => {
          if (requestToken !== youtubeRequestToken) return;

          if (event.data === YT.PlayerState.PLAYING) {
            resetFilmInvite();
            $('#memoryStage').classList.add('is-playing');
            setFilmPlayOverlay(false);
          }

          if (event.data === YT.PlayerState.PAUSED) {
            $('#memoryStage').classList.remove('is-playing');
            setFilmPlayOverlay(true, 'TIẾP TỤC XEM');
          }

          if (event.data === YT.PlayerState.ENDED) {
            handleFilmEnded();
          }
        },

        onError: () => {
          if (requestToken !== youtubeRequestToken) return;

          host.hidden = true;
          currentFilmDimensions = null;
          $('#memoryStage').classList.remove('has-media', 'is-playing', 'is-finished', 'is-portrait');
          $('#memoryStage').style.removeProperty('width');
          $('#memoryStage').style.removeProperty('height');
          setFilmPlayOverlay(false);
          $('#memoryEmpty').hidden = false;
          $('#memoryEmpty small').textContent =
            'Không thể phát video nhúng. Bạn có thể mở trực tiếp trên YouTube.';

          $('#videoFallback').hidden = false;
          toast('Video YouTube chưa phát được. Hãy kiểm tra quyền xem hoặc mở trực tiếp.');
        }
      }
    });

    youtubePlayer = player;

  } catch (error) {
    if (requestToken !== youtubeRequestToken) return;

    host.hidden = true;
    currentFilmDimensions = null;
    $('#memoryStage').classList.remove('has-media', 'is-playing', 'is-finished', 'is-portrait');
    $('#memoryStage').style.removeProperty('width');
    $('#memoryStage').style.removeProperty('height');
    setFilmPlayOverlay(false);
    $('#memoryEmpty').hidden = false;
    $('#memoryEmpty small').textContent =
      'Trình phát YouTube chưa tải được. Hãy kiểm tra kết nối mạng.';

    $('#videoFallback').hidden = false;
    toast('Không tải được trình phát YouTube.');
  }
 }

  function applyMediaConfig(config) {
    const type = config?.type;
    const title = config?.title || 'THƯỚC PHIM 19/11';
    const caption = config?.caption || 'Chuyên Hạ Long · 19.11.2026';
    const player = $('#memoryPlayer');
    if (config?.poster) player.poster = config.poster;
    if (type === 'file' && typeof config.src === 'string' && config.src.trim()) {
      applyFileVideo(config.src, title, caption);
      return;
    }
    if (type === 'youtube' && /^[A-Za-z0-9_-]{11}$/.test(config.id || '')) {
      applyYouTubeVideo(config.id, title, caption);
      return;
    }
    setVideoPlaceholder('Video kỷ niệm sẽ được cập nhật tại đây.');
  }

  $('#memoryPlayer').addEventListener('loadedmetadata', () => {
    const player = $('#memoryPlayer');
    setFilmAspect(player.videoWidth, player.videoHeight);
    $('#memoryEmpty').hidden = true;
  });
  $('#memoryPlayer').addEventListener('play', () => {
    resetFilmInvite();
    $('#memoryStage').classList.add('is-playing');
    setFilmPlayOverlay(false);
  });
  $('#memoryPlayer').addEventListener('pause', () => {
    const player = $('#memoryPlayer');
    if (!player.ended && player.currentTime > 0 && !player.hidden) {
      $('#memoryStage').classList.remove('is-playing');
      setFilmPlayOverlay(true, 'TIẾP TỤC XEM');
    }
  });
  $('#memoryPlayer').addEventListener('ended', handleFilmEnded);
  $('#memoryPlayer').addEventListener('error', () => {
    const player = $('#memoryPlayer');
    const configured = window.MEMORY_VIDEO_CONFIG?.type === 'file';
    if (!configured || !player.currentSrc) return;
    setVideoPlaceholder('Không thể tải tệp video. Vui lòng kiểm tra lại đường dẫn.');
    $('#memoryEmpty small').textContent = 'Video chưa tải được. Kiểm tra tên tệp và đường dẫn trong media/.';
    toast('Không tải được video. Hãy kiểm tra đường dẫn tệp trong media/.');
  });

  // Private media setup helper: open with ?media-admin=1. This creates a config file;
  // a static website cannot upload a large media file to hosting without a server API.
  function parseYouTubeId(value) {
    const raw = String(value || '').trim();
    if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;
    let url;
    try { url = new URL(raw); } catch (_) { return ''; }
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    const allowed = ['youtube.com', 'm.youtube.com', 'youtu.be', 'youtube-nocookie.com'];
    if (!allowed.includes(host) && !host.endsWith('.youtube.com')) return '';

    let id = '';
    if (host === 'youtu.be') id = url.pathname.split('/').filter(Boolean)[0] || '';
    else if (url.pathname === '/watch') id = url.searchParams.get('v') || '';
    else {
      const pieces = url.pathname.split('/').filter(Boolean);
      const kindIndex = pieces.findIndex(piece => ['embed', 'shorts', 'live', 'v'].includes(piece));
      if (kindIndex >= 0) id = pieces[kindIndex + 1] || '';
    }
    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : '';
  }


function safeMediaFilename(name) {
  const original = String(name || 'video.mp4').split(/[\\/]/).pop();

  const rawExtension = original.includes('.')
    ? original.split('.').pop().toLowerCase()
    : 'mp4';

  const extension = ['mp4', 'webm'].includes(rawExtension)
    ? rawExtension
    : 'mp4';

  const base = original
    .replace(/\.[^.]+$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'video-1911';

  return `${base}.${extension}`;
}


  function prettyBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 MB';
    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / (1024 ** index);
    return `${value >= 10 || index === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[index]}`;
  }

  function configureMediaAdmin() {
    const params = new URLSearchParams(window.location.search);
    const adminEnabled = params.get('media-admin') === '1' || window.__MEDIA_ADMIN__ === true;
    const panel = $('#mediaAdmin');
    if (!adminEnabled || !panel) return;
    panel.hidden = false;
    panel.classList.add('media-admin-ready');

    const modeButtons = $$('.media-mode');
    const youtubeSetup = $('#youtubeSetup');
    const fileSetup = $('#fileSetup');
    const status = $('#mediaAdminStatus');
    const saveButton = $('#saveMediaConfig');

    function setMode(mode) {
      if (!['youtube', 'file'].includes(mode)) return;
      if (state.mediaMode !== mode) {
        if (selectedMediaObjectUrl) resetSelectedFile();
        else setVideoPlaceholder('Chưa chọn nguồn video trong công cụ thiết lập.');
      }
      state.mediaMode = mode;
      modeButtons.forEach(button => {
        const active = button.dataset.mediaMode === mode;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      youtubeSetup.hidden = mode !== 'youtube';
      fileSetup.hidden = mode !== 'file';
      selectedMediaConfig = null;
      saveButton.disabled = true;
      status.textContent = mode === 'youtube'
        ? 'Dán đường dẫn YouTube rồi chọn “Kiểm tra link”.'
        : 'Chọn một tệp MP4 hoặc WebM để kiểm tra và xem thử.';
    }

    modeButtons.forEach(button => button.addEventListener('click', () => setMode(button.dataset.mediaMode)));

    $('#previewYoutube').addEventListener('click', () => {
      const id = parseYouTubeId($('#youtubeUrl').value);
      if (!id) {
        selectedMediaConfig = null;
        saveButton.disabled = true;
        status.textContent = 'Link chưa đúng định dạng. Hãy dán link video YouTube đầy đủ hoặc mã video 11 ký tự.';
        toast('Không nhận diện được link YouTube.');
        return;
      }
      selectedMediaConfig = {
        type: 'youtube',
        id,
        isDemo: false,
        title: 'THƯỚC PHIM 19/11',
        caption: 'YouTube · Chuyên Hạ Long 19.11.2026'
      };
      saveButton.disabled = false;
      status.textContent = `Đã nhận diện video YouTube · mã ${id}. Đang mở xem thử ở khung chính.`;
      applyMediaConfig(selectedMediaConfig);
    });

    const fileInput = $('#mediaFileInput');
    const dropZone = $('#mediaDrop');
    const fileFeedback = $('#mediaFileFeedback');

 
function resetSelectedFile() {
  inspectFile.pickToken = (inspectFile.pickToken || 0) + 1;

  if (selectedMediaObjectUrl) {
    URL.revokeObjectURL(selectedMediaObjectUrl);
  }

  selectedMediaObjectUrl = '';
  selectedMediaFile = null;
  selectedMediaConfig = null;

  fileInput.value = '';
  fileFeedback.textContent = '';

  saveButton.disabled = true;
}


    function inspectFile(file) {
      resetSelectedFile();
      if (!file) return;
      const extension = file.name.split('.').pop().toLowerCase();
      const validExtension = ['mp4', 'webm'].includes(extension);
      const validMime = !file.type || file.type.startsWith('video/');
      if (!validExtension || !validMime || file.size <= 0) {
        fileFeedback.textContent = 'Tệp chưa phù hợp. Hãy chọn video MP4 hoặc WebM hợp lệ.';
        status.textContent = 'Chưa thể dùng tệp này. Hãy kiểm tra định dạng video.';
        return;
      }

      selectedMediaFile = file;
      selectedMediaObjectUrl = URL.createObjectURL(file);
      const preview = $('#memoryPlayer');
      const pickToken = (inspectFile.pickToken || 0) + 1;
      inspectFile.pickToken = pickToken;
      preview.addEventListener('loadedmetadata', function onPreviewMetadata() {
        preview.removeEventListener('loadedmetadata', onPreviewMetadata);
        if (pickToken !== inspectFile.pickToken) return;
        if (!preview.videoWidth || !preview.videoHeight) {
          fileFeedback.textContent = `${file.name} · Tệp không có khung hình video hợp lệ.`;
          status.textContent = 'Không nhận được kích thước khung hình. Hãy chọn lại tệp MP4 / WebM có hình ảnh.';
          selectedMediaConfig = null;
          saveButton.disabled = true;
          return;
        }
        const width = preview.videoWidth;
        const height = preview.videoHeight;
        const ratio = width / Math.max(height, 1);
        const duration = formatDuration(preview.duration) || 'Chưa xác định thời lượng';
        const notes = [`${width} × ${height}`, duration, prettyBytes(file.size)];
        let advisory = '';
        if (file.size > 500 * 1024 * 1024) advisory = ' Tệp khá lớn; nên cân nhắc YouTube để website tải nhanh hơn.';
        else if (Math.min(width, height) < 540) advisory = ' Độ phân giải khá thấp; nên ưu tiên bản MP4 rõ nét hơn nếu có.';
        else if (Math.abs(ratio - (16 / 9)) > 0.12) advisory = ' Video không phải 16:9; website sẽ giữ đúng tỷ lệ, không kéo méo hình.';
        fileFeedback.textContent = `${file.name} · ${notes.join(' · ')}.${advisory}`;
        status.textContent = 'Video hợp lệ và đã xem thử được. Tải cấu hình để hoàn tất bước tích hợp.';
        selectedMediaConfig = {
          type: 'file',
          isDemo: false,
          src: `media/${safeMediaFilename(file.name)}`,
          previewSrc: selectedMediaObjectUrl,
          title: 'THƯỚC PHIM 19/11',
          caption: 'Chuyên Hạ Long · 19.11.2026'
        };
        saveButton.disabled = false;
      }, { once: true });
      preview.addEventListener('error', () => {
        if (pickToken !== inspectFile.pickToken) return;
        fileFeedback.textContent = `${file.name} · Trình duyệt không đọc được tệp này. Hãy thử MP4 mã H.264.`;
        status.textContent = 'Không thể xem thử tệp. Hãy xuất lại MP4 H.264 hoặc WebM chuẩn.';
        selectedMediaConfig = null;
        saveButton.disabled = true;
      }, { once: true });
      applyFileVideo(selectedMediaObjectUrl, 'THƯỚC PHIM 19/11 · XEM THỬ', 'Bản xem thử trên thiết bị này');
    }

    fileInput.addEventListener('change', () => inspectFile(fileInput.files?.[0]));
    ['dragenter', 'dragover'].forEach(type => dropZone.addEventListener(type, event => {
      event.preventDefault();
      dropZone.classList.add('drag-over');
    }));
    ['dragleave', 'drop'].forEach(type => dropZone.addEventListener(type, event => {
      event.preventDefault();
      dropZone.classList.remove('drag-over');
    }));
    dropZone.addEventListener('drop', event => {
      const file = event.dataTransfer?.files?.[0];
      if (!file) return;
      inspectFile(file);
    });

    saveButton.addEventListener('click', () => {
      if (!selectedMediaConfig) return;
      const exportConfig = { ...selectedMediaConfig };
      delete exportConfig.previewSrc;
      const source = `/* Generated by 19.11 Media Setup. Keep this file in media/video-config.js. */\nwindow.MEMORY_VIDEO_CONFIG = Object.freeze(${JSON.stringify(exportConfig, null, 2)});\n`;
      const blob = new Blob([source], { type: 'text/javascript;charset=utf-8' });
      const downloadUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = downloadUrl;
      anchor.download = 'video-config.js';
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);

      if (selectedMediaConfig.type === 'file') {
        const safeName = selectedMediaConfig.src.replace(/^media\//, '');
        status.textContent = `Đã tải video-config.js. Tiếp theo: đổi tên video thành “${safeName}”, đặt vào thư mục media/ rồi tải lại website lên hosting.`;
      } else {
        status.textContent = 'Đã tải video-config.js. Đặt tệp này vào thư mục media/ và tải lại website lên hosting.';
      }
      toast('Đã tạo file cấu hình video.');
    });

    // An accidental URL typo or stale file should not silently leave the save control enabled.
    $('#youtubeUrl').addEventListener('input', () => {
      if (state.mediaMode === 'youtube') {
        selectedMediaConfig = null;
        saveButton.disabled = true;
        status.textContent = 'Đường dẫn đã thay đổi. Hãy kiểm tra lại link trước khi lưu.';
      }
    });

    setMode('youtube');
  }

  if (!reducedMotionQuery.matches) {
    const count = window.innerWidth < 600 ? 10 : 20;
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < count; index += 1) {
      const dot = document.createElement('i');
      dot.className = 'ambient-dot';
      dot.style.left = `${(index * 67 + 13) % 100}%`;
      dot.style.top = `${(index * 43 + 7) % 100}%`;
      dot.style.setProperty('--dot-delay', `${-(index % 7)}s`);
      fragment.append(dot);
    }
    $('.sky-wash').append(fragment);
  }

  $$('.mobile-dock a').forEach(link => link.addEventListener('click', () => {
    if (document.activeElement === $('#heartSearch')) $('#heartSearch').blur();
  }));

  // Defensive data check. Source data is intentionally kept separate and unmodified.
  const missingLetters = letters.filter(item => !item.content.trim());
  if (letters.length !== 36 || missingLetters.length) {
    console.warn('19.11 data check:', { classes: letters.length, missingLetters: missingLetters.map(item => item.id) });
  }

  renderHearts();
  applyMediaConfig(window.MEMORY_VIDEO_CONFIG || { type: 'none' });
  configureMediaAdmin();
})();
