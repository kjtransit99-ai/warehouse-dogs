/**
 * WAREHOUSE DOGS — Bar and Coffee Transit
 * 70s Noir Social Deduction Game (65" TV Host + Smartphone QR Sync)
 *
 * Firebase Project: transit-werewolf-ffe6f
 * Dedicated Collection: warehouse_dogs_rooms (isolated from existing werewolf app)
 */

(function () {
  'use strict';

  /* =========================================================================
     1. CONSTANTS & CONFIGURATION
     ========================================================================= */
  const FIREBASE_CONFIG = {
    apiKey: 'AIzaSyDxyY6iH4DTjQrSv0xn8-XsZHkDWOZr_l4',
    authDomain: 'transit-werewolf-ffe6f.firebaseapp.com',
    projectId: 'transit-werewolf-ffe6f',
    storageBucket: 'transit-werewolf-ffe6f.firebasestorage.app',
    messagingSenderId: '333282254588',
    appId: '1:333282254588:web:66f11380fa22063c838179'
  };

  const COLLECTION_NAME = 'warehouse_dogs_rooms';
  const MIN_PLAYERS = 4;
  const MAX_PLAYERS = 8;
  const QUESTION_DURATION_MS = 5 * 60 * 1000; // 05:00
  const DISCUSSION_DURATION_MS = 3 * 60 * 1000; // 03:00

  const CODENAMES = [
    { key: 'WHITE',  label: 'MR. WHITE',  color: '#F0F0F0' },
    { key: 'PINK',   label: 'MR. PINK',   color: '#FF4D8D' },
    { key: 'BLONDE', label: 'MR. BLONDE', color: '#F5C518' },
    { key: 'ORANGE', label: 'MR. ORANGE', color: '#FF6B1A' },
    { key: 'BLUE',   label: 'MR. BLUE',   color: '#2B8AFF' },
    { key: 'BROWN',  label: 'MR. BROWN',  color: '#B56E3B' },
    { key: 'RED',    label: 'MR. RED',    color: '#D90429' },
    { key: 'GREEN',  label: 'MR. GREEN',  color: '#2ECC71' }
  ];

  const I18N = {
    jp: {
      scanQr: 'QRスキャンで入室',
      crew: 'CREW / 参加者',
      waitingSlot: '空席',
      startMission: 'ミッション開始',
      needCrew: '4〜8人必要',
      newRoom: '部屋を作り直す',
      checkPhone: 'スマホで役職を確認せよ',
      theBoss: 'ボス',
      startQuestioning: '質問フェーズ開始 (05:00)',
      questionPhase: '質問フェーズ',
      discussionPhase: '議論フェーズ',
      secretWord: 'お題 / SECRET WORD',
      whoIsRat: '警察の犬は誰だ？',
      skipToVote: '投票へ進む',
      vote1Title: '第1投票：容疑者選出',
      vote1Sub: 'スマホで怪しい奴を1名選べ',
      closeVote: '投票を締め切る',
      tiebreakTitle: '同票決選',
      tiebreakSub: 'ボスの決選指名、またはランダムで決定',
      randomDecide: 'ランダム決定',
      vote2Title: '最終審判',
      isThisRat: 'こいつが警察の犬か？',
      revealVerdict: '審判を下す',
      voted: '投票済',
      votedCount: '投票完了',
      bustedMain: 'BUSTED!',
      bustedSub: '内通者確保 — 強盗団の勝利',
      escapedMain: 'THE RAT ESCAPED!',
      escapedSub: '内通者の逃亡成功 — 警察の犬の勝利',
      timeoutMain: 'MISSION FAILED',
      timeoutSub: '時間切れ — 全員敗北',
      trueRat: '真の内通者 / THE RAT',
      playAgainKeep: 'もう1戦（コードネーム維持）',
      playAgainShuffle: 'もう1戦（コードネーム再抽選）',
      // Player strings
      enterNickname: 'ニックネームを入力',
      nicknamePlaceholder: '例: タロウ',
      joinCrew: '入室する',
      roomFull: '満員です (最大8名)',
      standby: '作戦開始を待機中...',
      tapToReveal: 'タップして役職を表示',
      tapToHide: 'タップして隠す',
      roleBossTitle: 'THE BOSS / ボス',
      roleBossHint: '質問に YES / NO で答えろ',
      roleRatTitle: 'THE RAT / 警察の犬',
      roleRatHint: '正体を隠して正解へ導け',
      roleGangTitle: 'GANGSTER / 強盗団',
      roleGangSecret: 'お題を暴け',
      roleGangSecretEn: 'FIND THE SECRET',
      roleGangHint: 'ボスに質問してお題を当てろ',
      votePickSuspect: '警察の犬だと思う人物を選べ',
      voteLocked: '投票完了',
      confirmVote: 'この人物に投票する',
      confirmVerdict: 'この審判で投票する',
      changeVote: '投票し直す',
      bossTiePick: 'ボス決選指名：容疑者を1名選べ',
      waitingTie: '同票決選中...',
      verdictPrompt: 'こいつが警察の犬か？',
      yesGuilty: 'クロ',
      noInnocent: 'シロ',
      backToLobby: 'ロビーに戻る'
    },
    en: {
      scanQr: 'SCAN QR TO JOIN',
      crew: 'CREW',
      waitingSlot: 'OPEN SEAT',
      startMission: 'START MISSION',
      needCrew: 'NEED 4-8 CREW',
      newRoom: 'NEW ROOM',
      checkPhone: 'CHECK YOUR PHONE FOR YOUR ROLE',
      theBoss: 'THE BOSS',
      startQuestioning: 'START QUESTIONING (05:00)',
      questionPhase: 'QUESTION PHASE',
      discussionPhase: 'DISCUSSION PHASE',
      secretWord: 'SECRET WORD',
      whoIsRat: 'WHO IS THE RAT?',
      skipToVote: 'SKIP TO VOTE',
      vote1Title: '1ST VOTE: SUSPECT',
      vote1Sub: 'PICK YOUR SUSPECT ON YOUR PHONE',
      closeVote: 'CLOSE VOTE',
      tiebreakTitle: 'TIEBREAKER',
      tiebreakSub: 'BOSS DECIDES OR PICK AT RANDOM',
      randomDecide: 'PICK RANDOM',
      vote2Title: 'FINAL VERDICT',
      isThisRat: 'IS THIS THE RAT?',
      revealVerdict: 'REVEAL VERDICT',
      voted: 'VOTED',
      votedCount: 'VOTED',
      bustedMain: 'BUSTED!',
      bustedSub: 'THE RAT IS CAUGHT — CREW WINS',
      escapedMain: 'THE RAT ESCAPED!',
      escapedSub: 'THE RAT WINS',
      timeoutMain: 'MISSION FAILED',
      timeoutSub: 'TIME UP — EVERYONE LOSES',
      trueRat: 'THE RAT',
      playAgainKeep: 'PLAY AGAIN (KEEP CODENAMES)',
      playAgainShuffle: 'PLAY AGAIN (SHUFFLE CODENAMES)',
      // Player strings
      enterNickname: 'ENTER YOUR NAME',
      nicknamePlaceholder: 'e.g. TARO',
      joinCrew: 'JOIN CREW',
      roomFull: 'ROOM IS FULL (MAX 8)',
      standby: 'STANDBY FOR MISSION...',
      tapToReveal: 'TAP TO REVEAL ROLE',
      tapToHide: 'TAP TO HIDE',
      roleBossTitle: 'THE BOSS',
      roleBossHint: 'ANSWER QUESTIONS WITH YES OR NO',
      roleRatTitle: 'WARNING: THE RAT',
      roleRatHint: 'GUIDE THEM WITHOUT GETTING CAUGHT',
      roleGangTitle: 'GANGSTER',
      roleGangSecret: 'FIND THE SECRET',
      roleGangSecretEn: 'お題を暴け',
      roleGangHint: 'ASK THE BOSS TO FIND THE SECRET WORD',
      votePickSuspect: 'WHO IS THE RAT?',
      voteLocked: 'VOTE LOCKED',
      confirmVote: 'CONFIRM VOTE',
      confirmVerdict: 'CONFIRM VERDICT',
      changeVote: 'CHANGE VOTE',
      bossTiePick: 'BOSS TIEBREAKER: PICK THE SUSPECT',
      waitingTie: 'RESOLVING TIE...',
      verdictPrompt: 'IS THIS THE RAT?',
      yesGuilty: 'GUILTY',
      noInnocent: 'INNOCENT',
      backToLobby: 'BACK TO LOBBY'
    }
  };

  /* =========================================================================
     2. SAFE STORAGE HELPERS (Protected with try/catch)
     ========================================================================= */
  function safeLocalGet(key) {
    try { return window.localStorage.getItem(key); } catch (_) { return null; }
  }
  function safeLocalSet(key, val) {
    try { window.localStorage.setItem(key, val); } catch (_) {}
  }
  function safeLocalRemove(key) {
    try { window.localStorage.removeItem(key); } catch (_) {}
  }
  function safeSessionGet(key) {
    try { return window.sessionStorage.getItem(key); } catch (_) { return null; }
  }
  function safeSessionSet(key, val) {
    try { window.sessionStorage.setItem(key, val); } catch (_) {}
  }

  /* =========================================================================
     3. WEB AUDIO API NOIR SOUND ENGINE
     ========================================================================= */
  const SoundEngine = {
    ctx: null,
    muted: false,
    unlocked: false,

    unlock() {
      if (this.unlocked && this.ctx && this.ctx.state === 'running') return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        if (!this.ctx) {
          this.ctx = new AudioCtx();
        }
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        this.unlocked = true;
      } catch (_) {}
    },

    playHeartbeat() {
      if (this.muted || !this.ctx || this.ctx.state !== 'running') return;
      try {
        const now = this.ctx.currentTime;
        const beat = (offset, freq, gainPeak) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + offset);
          osc.frequency.exponentialRampToValueAtTime(28, now + offset + 0.16);
          gain.gain.setValueAtTime(0.001, now + offset);
          gain.gain.linearRampToValueAtTime(gainPeak, now + offset + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.22);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.24);
        };
        beat(0, 62, 0.55);
        beat(0.18, 50, 0.38);
      } catch (_) {}
    },

    playTick() {
      if (this.muted || !this.ctx || this.ctx.state !== 'running') return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1650, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.03);
        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } catch (_) {}
    },

    playJoin() {
      if (this.muted || !this.ctx || this.ctx.state !== 'running') return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(196, now);
        osc.frequency.setValueAtTime(293.66, now + 0.07);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } catch (_) {}
    },

    playUnlocked() {
      if (this.muted || !this.ctx || this.ctx.state !== 'running') return;
      try {
        const now = this.ctx.currentTime;
        [220, 277.18, 329.63, 440].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + idx * 0.03);
          gain.gain.setValueAtTime(0.14, now + idx * 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.03);
          osc.stop(now + 0.8);
        });
      } catch (_) {}
    },

    playOutcome(outcome) {
      if (this.muted || !this.ctx || this.ctx.state !== 'running') return;
      try {
        const now = this.ctx.currentTime;
        const notes = outcome === 'busted'
          ? [196, 246.94, 293.66, 392]
          : [146.83, 138.59, 130.81, 98];
        notes.forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = outcome === 'busted' ? 'triangle' : 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + i * 0.12);
          gain.gain.setValueAtTime(0.18, now + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.55);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.12);
          osc.stop(now + i * 0.12 + 0.6);
        });
      } catch (_) {}
    }
  };

  /* =========================================================================
     4. NOIR GANGSTER SIDE-PROFILE SVG SILHOUETTE (ZERO EMOJIS)
        Slicked-back hair + angular Wellington sunglasses + sharp jawline +
        3/4 black suit; ONLY backlit circle & skinny tie glow in codename color.
     ========================================================================= */
  let svgUidCounter = 0;

  function renderGangsterSVG(colorHex, isEmpty) {
    const uid = 'g' + (++svgUidCounter);
    const glowColor = isEmpty ? '#3A3A3A' : colorHex;
    const circleOpacity = isEmpty ? '0.25' : '0.92';
    const tieColor = isEmpty ? '#2F2F2F' : colorHex;
    const suitFill = isEmpty ? '#161616' : '#080808';
    const rimStroke = isEmpty ? '#2A2A2A' : 'rgba(255,255,255,0.16)';

    return `
      <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
        <defs>
          <radialGradient id="bg-${uid}" cx="50%" cy="46%" r="50%">
            <stop offset="0%" stop-color="${glowColor}" stop-opacity="${isEmpty ? '0.18' : '0.88'}"/>
            <stop offset="68%" stop-color="${glowColor}" stop-opacity="${isEmpty ? '0.08' : '0.32'}"/>
            <stop offset="100%" stop-color="${glowColor}" stop-opacity="0"/>
          </radialGradient>
          <filter id="glow-${uid}" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <clipPath id="clip-${uid}">
            <rect x="0" y="0" width="160" height="160" rx="4"/>
          </clipPath>
        </defs>
        <g clip-path="url(#clip-${uid})">
          <!-- Glowing Backlit Circle -->
          <circle cx="80" cy="70" r="62" fill="url(#bg-${uid})" opacity="${circleOpacity}"/>
          <circle cx="80" cy="70" r="46" fill="none" stroke="${glowColor}" stroke-opacity="${isEmpty ? '0.15' : '0.55'}" stroke-width="1.8"/>

          <!-- 3/4 Angle Black Suit Shoulders & Torso -->
          <path d="M18 162 L24 126 C28 113 44 107 62 103 L76 100 L108 104 C126 108 138 117 142 132 L146 162 Z"
                fill="${suitFill}" stroke="${rimStroke}" stroke-width="1.2"/>

          <!-- Crisp White Shirt Collar V -->
          <polygon points="73,103 99,105 90,144 76,126" fill="${isEmpty ? '#262626' : '#ECE9E2'}"/>

          <!-- Suit Lapels (Hardboiled Sharp Cut) -->
          <polygon points="56,105 74,103 86,144 64,136" fill="${suitFill}" stroke="${rimStroke}" stroke-width="1"/>
          <polygon points="111,106 98,105 90,144 106,136" fill="${suitFill}" stroke="${rimStroke}" stroke-width="1"/>

          <!-- Glowing Skinny Tie -->
          <g ${isEmpty ? '' : `filter="url(#glow-${uid})"`}>
            <polygon points="82,107 93,108 90,115 84,115" fill="${tieColor}"/>
            <polygon points="84,115 90,115 93,158 88,162 82,158" fill="${tieColor}"/>
          </g>

          <!-- Neck -->
          <path d="M62 88 L64 108 L92 109 L91 92 Z" fill="${suitFill}"/>

          <!-- Head & Slicked-Back Hair (3/4 Side Profile Facing Right) -->
          <path d="
            M56 76
            C51 64 51 44 60 32
            C69 21 88 20 101 26
            C107 29 109 35 106 40
            L108 49
            L115 62
            L109 65
            L110 71
            L107 74
            L108 79
            C106 85 101 91 92 94
            L75 96
            C64 95 59 87 56 76 Z"
            fill="${suitFill}" stroke="${rimStroke}" stroke-width="1.1"/>

          <!-- Slicked-back Hair Pompadour Sweep Detail -->
          <path d="M57 44 C64 31 85 25 102 30 C91 32 75 37 64 47 Z"
                fill="rgba(255,255,255,${isEmpty ? '0.04' : '0.13'})"/>

          <!-- Ear Notch -->
          <path d="M62 63 C58 63 57 70 61 73" fill="none" stroke="${rimStroke}" stroke-width="1.4"/>

          <!-- Angular Wellington Sunglasses (3/4 Profile) -->
          <polygon points="73,53 111,51 112,56 108,64 93,64 89,57 73,57"
                   fill="#030303" stroke="${isEmpty ? '#333' : '#666'}" stroke-width="1"/>
          <!-- Specular Lens Glint -->
          <polygon points="94,54 101,53 98,62 93,62" fill="rgba(255,255,255,${isEmpty ? '0.05' : '0.26'})"/>
          <line x1="63" y1="59" x2="75" y2="55" stroke="${isEmpty ? '#2A2A2A' : '#555'}" stroke-width="2.2"/>
        </g>
      </svg>
    `;
  }

  /* =========================================================================
     5. APPLICATION STATE
     ========================================================================= */
  const urlParams = new URLSearchParams(window.location.search);
  const queryRoomId = (urlParams.get('room') || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const isPlayerMode = Boolean(queryRoomId);
  const isDemoMode = !isPlayerMode && urlParams.get('demo') === '1';

  const state = {
    mode: isPlayerMode ? 'player' : 'tv',
    lang: safeLocalGet('wd_lang') === 'en' ? 'en' : 'jp',
    roomId: isPlayerMode ? queryRoomId : initHostRoomId(),
    playerId: null,
    roleRevealed: false,
    room: null,
    syncStatus: 'connecting', // 'connecting' | 'online' | 'error'
    syncErrorMsg: '',
    lastPhase: null,
    lastPlayerCount: 0,
    lastTickSecond: -1,
    joining: false,
    joinError: '',
    pendingVote1: null,
    pendingVote2: null,
    editingVote1: false,
    editingVote2: false
  };

  let db = null;
  let roomRef = null;
  let unsubscribeRoom = null;
  let timerInterval = null;

  function initHostRoomId() {
    const saved = safeSessionGet('wd_host_room_id');
    if (saved && /^[A-Z0-9]{4,8}$/.test(saved)) return saved;
    const fresh = generateRoomId();
    safeSessionSet('wd_host_room_id', fresh);
    return fresh;
  }

  function generateRoomId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let out = '';
    for (let i = 0; i < 6; i++) {
      out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
  }

  function generatePlayerId() {
    return 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
  }

  function t(key) {
    return (I18N[state.lang] && I18N[state.lang][key]) || I18N.jp[key] || key;
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getSortedPlayers(room) {
    const map = (room && room.players) || {};
    return Object.values(map).sort((a, b) => (a.codenameIndex - b.codenameIndex) || (a.joinedAt - b.joinedAt));
  }

  function getPlayerById(room, id) {
    if (!room || !room.players || !id) return null;
    return room.players[id] || null;
  }

  function getCodename(index) {
    return CODENAMES[index % CODENAMES.length] || CODENAMES[0];
  }

  function createEmptyRoomData(roomId) {
    return {
      roomId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      phase: 'lobby',
      genre: 'random',
      round: 0,
      usedWords: [],
      players: {},
      word: null,
      bossId: null,
      ratId: null,
      roles: {},
      phaseEndTime: null,
      unlockedAt: null,
      votes1: {},
      tiedIds: [],
      suspectId: null,
      votes2: {},
      outcome: null
    };
  }

  /* =========================================================================
     6. FIREBASE INITIALIZATION (Safari/Mobile Resilient — NO runTransaction)
     ========================================================================= */
  function initFirebase() {
    try {
      if (!window.firebase) {
        state.syncStatus = 'error';
        state.syncErrorMsg = 'Firebase SDK not loaded';
        renderSyncToast();
        return;
      }
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
      db = firebase.firestore();
      // Critical mobile Safari / cellular resilience settings
      db.settings({
        experimentalForceLongPolling: true,
        useFetchStreams: false
      });
      connectToRoom(state.roomId);
    } catch (err) {
      state.syncStatus = 'error';
      state.syncErrorMsg = err && err.message ? err.message : 'Init error';
      renderSyncToast();
    }
  }

  function connectToRoom(roomId) {
    if (unsubscribeRoom) {
      try { unsubscribeRoom(); } catch (_) {}
      unsubscribeRoom = null;
    }
    state.roomId = roomId;
    roomRef = db.collection(COLLECTION_NAME).doc(roomId);

    if (state.mode === 'tv') {
      // Ensure room document exists without blocking initial UI
      roomRef.get().then((snap) => {
        if (!snap.exists) {
          const initial = createEmptyRoomData(roomId);
          return roomRef.set(initial);
        }
      }).catch((err) => {
        state.syncStatus = 'error';
        state.syncErrorMsg = err && err.message ? err.message : 'Connection retry...';
        renderSyncToast();
      });
    } else {
      // Restore saved playerId for this room if present
      const savedPid = safeLocalGet('wd_pid_' + roomId);
      if (savedPid) {
        state.playerId = savedPid;
      }
    }

    unsubscribeRoom = roomRef.onSnapshot(
      (snap) => {
        state.syncStatus = 'online';
        state.syncErrorMsg = '';
        if (snap.exists) {
          const data = snap.data();
          handleRoomUpdate(data);
        } else if (state.mode === 'tv') {
          // Recreate if deleted externally
          const initial = createEmptyRoomData(roomId);
          state.room = initial;
          roomRef.set(initial).catch(() => {});
          render();
        } else {
          state.room = null;
          render();
        }
      },
      (err) => {
        state.syncStatus = 'error';
        state.syncErrorMsg = err && err.message ? err.message : 'Offline';
        renderSyncToast();
      }
    );
  }

  function handleRoomUpdate(data) {
    const prevPhase = state.lastPhase;
    const players = getSortedPlayers(data);

    // TV Host: resolve any rare simultaneous codenameIndex collision (no runTransaction needed)
    if (state.mode === 'tv' && data.phase === 'lobby' && players.length > 1) {
      resolveDuplicateCodenamesIfAny(data, players);
    }

    // TV Host: sound & flash triggers on phase transitions
    if (state.mode === 'tv') {
      if (data.phase === 'lobby' && players.length > state.lastPlayerCount && state.lastPhase === 'lobby') {
        SoundEngine.playJoin();
      }
      if (prevPhase === 'questioning' && data.phase === 'discussion') {
        triggerUnlockedFlash();
        SoundEngine.playUnlocked();
      }
      if (prevPhase && prevPhase !== 'result' && data.phase === 'result') {
        SoundEngine.playOutcome(data.outcome);
      }
      // Auto-advance Vote 1 when all players have voted
      if (data.phase === 'vote1' && players.length > 0) {
        const voteCount = Object.keys(data.votes1 || {}).length;
        if (voteCount >= players.length) {
          finalizeVote1(data);
        }
      }
      // Auto-advance Vote 2 when all players have voted
      if (data.phase === 'vote2' && players.length > 0) {
        const voteCount = Object.keys(data.votes2 || {}).length;
        if (voteCount >= players.length) {
          finalizeVote2(data);
        }
      }
    }

    // Player: reset local phase UI state when phase changes
    if (state.mode === 'player' && prevPhase !== data.phase) {
      if (data.phase === 'roles') {
        state.roleRevealed = false;
      }
      state.pendingVote1 = null;
      state.pendingVote2 = null;
      state.editingVote1 = false;
      state.editingVote2 = false;
    }

    state.lastPhase = data.phase;
    state.lastPlayerCount = players.length;
    state.room = data;
    render();
  }

  function resolveDuplicateCodenamesIfAny(room, players) {
    const used = new Set();
    const sortedByTime = [...players].sort((a, b) => (a.joinedAt || 0) - (b.joinedAt || 0));
    const updates = {};
    let needsFix = false;

    for (const p of sortedByTime) {
      if (!used.has(p.codenameIndex) && p.codenameIndex >= 0 && p.codenameIndex < MAX_PLAYERS) {
        used.add(p.codenameIndex);
      } else {
        for (let idx = 0; idx < MAX_PLAYERS; idx++) {
          if (!used.has(idx)) {
            used.add(idx);
            updates['players.' + p.id + '.codenameIndex'] = idx;
            needsFix = true;
            break;
          }
        }
      }
    }
    if (needsFix && roomRef) {
      roomRef.update(updates).catch(() => {});
    }
  }

  /* =========================================================================
     7. GAME ACTIONS (Direct get/update — Zero runTransaction)
     ========================================================================= */
  function setGenre(genreId) {
    if (!roomRef) return;
    if (state.room) state.room.genre = genreId;
    render();
    roomRef.update({ genre: genreId, updatedAt: Date.now() }).catch(() => {});
  }

  function kickPlayer(playerId) {
    if (!roomRef || !playerId) return;
    roomRef.update({
      ['players.' + playerId]: firebase.firestore.FieldValue.delete(),
      updatedAt: Date.now()
    }).catch(() => {});
  }

  function pickSecretWord(genre, usedWords) {
    const usedSet = new Set(usedWords || []);
    let pool = [];
    if (genre === 'random' || !window.WD_WORDS[genre]) {
      Object.keys(window.WD_WORDS).forEach((g) => {
        window.WD_WORDS[g].forEach((w) => pool.push({ jp: w.jp, en: w.en, genre: g }));
      });
    } else {
      pool = window.WD_WORDS[genre].map((w) => ({ jp: w.jp, en: w.en, genre }));
    }
    let fresh = pool.filter((w) => !usedSet.has(w.jp + '|' + w.en));
    if (fresh.length === 0) fresh = pool;
    return fresh[Math.floor(Math.random() * fresh.length)];
  }

  function addDemoBots() {
    const room = state.room;
    if (!room || !roomRef) return;
    const existing = getSortedPlayers(room);
    const usedIndices = new Set(existing.map((p) => p.codenameIndex));
    const updates = { updatedAt: Date.now() };
    let added = 0;
    const botNames = ['BOT-1', 'BOT-2', 'BOT-3', 'BOT-4', 'BOT-5', 'BOT-6', 'BOT-7'];
    for (let i = 0; i < MAX_PLAYERS && added < 3; i++) {
      if (usedIndices.has(i)) continue;
      usedIndices.add(i);
      const pid = 'bot_' + Date.now().toString(36) + '_' + i;
      updates['players.' + pid] = {
        id: pid,
        name: botNames[added] || ('BOT-' + (added + 1)),
        codenameIndex: i,
        joinedAt: Date.now() + added,
        isBot: true
      };
      added++;
    }
    if (added > 0) {
      roomRef.update(updates).catch(() => {});
    }
  }

  function castDemoBotVotes1() {
    const room = state.room;
    if (!room || !roomRef || room.phase !== 'vote1') return;
    const players = getSortedPlayers(room);
    const bots = players.filter((p) => p.isBot);
    const candidates = players.filter((p) => p.id !== room.bossId);
    if (!bots.length || !candidates.length) return;
    const updates = { updatedAt: Date.now() };
    bots.forEach((bot) => {
      const valid = candidates.filter((c) => c.id !== bot.id);
      const pool = valid.length ? valid : candidates;
      const pick = pool[Math.floor(Math.random() * pool.length)];
      updates['votes1.' + bot.id] = pick.id;
    });
    roomRef.update(updates).catch(() => {});
  }

  function castDemoBotVotes2() {
    const room = state.room;
    if (!room || !roomRef || room.phase !== 'vote2') return;
    const bots = getSortedPlayers(room).filter((p) => p.isBot);
    if (!bots.length) return;
    const updates = { updatedAt: Date.now() };
    bots.forEach((bot) => {
      updates['votes2.' + bot.id] = Math.random() < 0.65 ? 'YES' : 'NO';
    });
    roomRef.update(updates).catch(() => {});
  }

  function startMission() {
    const room = state.room;
    if (!room || !roomRef) return;
    const players = getSortedPlayers(room);
    if (players.length < MIN_PLAYERS || players.length > MAX_PLAYERS) return;

    // Shuffle player IDs to randomly select 1 Boss & 1 Rat
    const ids = players.map((p) => p.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    const bossId = ids[0];
    const ratId = ids[1];
    const roles = {};
    ids.forEach((id) => {
      if (id === bossId) roles[id] = 'boss';
      else if (id === ratId) roles[id] = 'rat';
      else roles[id] = 'gangster';
    });

    const word = pickSecretWord(room.genre || 'random', room.usedWords || []);
    const nextUsed = [...(room.usedWords || []), word.jp + '|' + word.en].slice(-80);

    roomRef.update({
      phase: 'roles',
      round: (room.round || 0) + 1,
      word,
      usedWords: nextUsed,
      bossId,
      ratId,
      roles,
      phaseEndTime: null,
      unlockedAt: null,
      votes1: {},
      tiedIds: [],
      suspectId: null,
      votes2: {},
      outcome: null,
      updatedAt: Date.now()
    }).catch(() => {});
  }

  function startQuestioning() {
    if (!roomRef) return;
    state.lastTickSecond = -1;
    roomRef.update({
      phase: 'questioning',
      phaseEndTime: Date.now() + QUESTION_DURATION_MS,
      updatedAt: Date.now()
    }).catch(() => {});
  }

  function triggerUnlocked() {
    if (!roomRef) return;
    roomRef.update({
      phase: 'discussion',
      unlockedAt: Date.now(),
      phaseEndTime: Date.now() + DISCUSSION_DURATION_MS,
      updatedAt: Date.now()
    }).catch(() => {});
  }

  function triggerTimeout() {
    if (!roomRef || !state.room || state.room.phase !== 'questioning') return;
    roomRef.update({
      phase: 'result',
      outcome: 'timeout',
      phaseEndTime: null,
      updatedAt: Date.now()
    }).catch(() => {});
  }

  function startVote1() {
    if (!roomRef) return;
    roomRef.update({
      phase: 'vote1',
      phaseEndTime: null,
      votes1: {},
      tiedIds: [],
      suspectId: null,
      updatedAt: Date.now()
    }).catch(() => {});
  }

  function castVote1(targetId) {
    if (!roomRef || !state.playerId) return;
    roomRef.update({
      ['votes1.' + state.playerId]: targetId,
      updatedAt: Date.now()
    }).catch(() => {});
  }

  let finalizingVote1 = false;
  function finalizeVote1(room) {
    if (finalizingVote1 || !roomRef || !room || room.phase !== 'vote1') return;
    finalizingVote1 = true;

    const votes = room.votes1 || {};
    const counts = {};
    const candidates = getSortedPlayers(room).filter((p) => p.id !== room.bossId);
    candidates.forEach((p) => { counts[p.id] = 0; });

    Object.values(votes).forEach((targetId) => {
      if (counts[targetId] !== undefined) counts[targetId]++;
    });

    let maxVotes = -1;
    let topIds = [];
    Object.keys(counts).forEach((id) => {
      if (counts[id] > maxVotes) {
        maxVotes = counts[id];
        topIds = [id];
      } else if (counts[id] === maxVotes) {
        topIds.push(id);
      }
    });

    const p = topIds.length === 1
      ? roomRef.update({
          phase: 'vote2',
          suspectId: topIds[0],
          tiedIds: [],
          votes2: {},
          updatedAt: Date.now()
        })
      : roomRef.update({
          phase: 'tiebreak',
          tiedIds: topIds,
          updatedAt: Date.now()
        });

    p.finally(() => {
      setTimeout(() => { finalizingVote1 = false; }, 600);
    });
  }

  function pickTiebreakSuspect(suspectId) {
    if (!roomRef || !suspectId) return;
    roomRef.update({
      phase: 'vote2',
      suspectId,
      votes2: {},
      updatedAt: Date.now()
    }).catch(() => {});
  }

  function pickRandomTiebreak() {
    const room = state.room;
    if (!room || !room.tiedIds || !room.tiedIds.length) return;
    const chosen = room.tiedIds[Math.floor(Math.random() * room.tiedIds.length)];
    pickTiebreakSuspect(chosen);
  }

  function castVote2(choice) {
    if (!roomRef || !state.playerId) return;
    roomRef.update({
      ['votes2.' + state.playerId]: choice,
      updatedAt: Date.now()
    }).catch(() => {});
  }

  let finalizingVote2 = false;
  function finalizeVote2(room) {
    if (finalizingVote2 || !roomRef || !room || room.phase !== 'vote2') return;
    finalizingVote2 = true;

    const votes = Object.values(room.votes2 || {});
    const yesCount = votes.filter((v) => v === 'YES').length;
    const noCount = votes.filter((v) => v === 'NO').length;
    const isMajorityYes = yesCount > noCount;
    const isCorrectSuspect = room.suspectId === room.ratId;
    const outcome = (isCorrectSuspect && isMajorityYes) ? 'busted' : 'escaped';

    roomRef.update({
      phase: 'result',
      outcome,
      updatedAt: Date.now()
    }).finally(() => {
      setTimeout(() => { finalizingVote2 = false; }, 600);
    });
  }

  function playAgain(shuffleCodenames) {
    const room = state.room;
    if (!room || !roomRef) return;

    const players = getSortedPlayers(room);
    const updatedPlayers = {};
    if (shuffleCodenames) {
      const indices = players.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      players.forEach((p, idx) => {
        updatedPlayers[p.id] = { ...p, codenameIndex: indices[idx] };
      });
    } else {
      players.forEach((p) => {
        updatedPlayers[p.id] = p;
      });
    }

    roomRef.update({
      phase: 'lobby',
      players: updatedPlayers,
      word: null,
      bossId: null,
      ratId: null,
      roles: {},
      phaseEndTime: null,
      unlockedAt: null,
      votes1: {},
      tiedIds: [],
      suspectId: null,
      votes2: {},
      outcome: null,
      updatedAt: Date.now()
    }).catch(() => {});
  }

  function createBrandNewRoom() {
    const freshId = generateRoomId();
    safeSessionSet('wd_host_room_id', freshId);
    state.room = createEmptyRoomData(freshId);
    state.lastPhase = 'lobby';
    state.lastPlayerCount = 0;
    render();
    connectToRoom(freshId);
  }

  /* --- Player Join Action (Direct get + update, NO runTransaction) --- */
  async function joinRoomAsPlayer(rawName) {
    const nickname = (rawName || '').trim().slice(0, 14);
    if (!nickname || !roomRef || state.joining) return;

    state.joining = true;
    state.joinError = '';
    render();

    try {
      const snap = await roomRef.get();
      if (!snap.exists) {
        state.joinError = state.lang === 'jp' ? '部屋が見つかりません' : 'ROOM NOT FOUND';
        state.joining = false;
        render();
        return;
      }

      const data = snap.data();
      const existingPlayers = Object.values(data.players || {});
      if (existingPlayers.length >= MAX_PLAYERS) {
        state.joinError = t('roomFull');
        state.joining = false;
        render();
        return;
      }

      const usedIndices = new Set(existingPlayers.map((p) => p.codenameIndex));
      let assignedIndex = 0;
      for (let i = 0; i < MAX_PLAYERS; i++) {
        if (!usedIndices.has(i)) {
          assignedIndex = i;
          break;
        }
      }

      const pid = generatePlayerId();
      const playerObj = {
        id: pid,
        name: nickname,
        codenameIndex: assignedIndex,
        joinedAt: Date.now()
      };

      await roomRef.update({
        ['players.' + pid]: playerObj,
        updatedAt: Date.now()
      });

      state.playerId = pid;
      safeLocalSet('wd_pid_' + state.roomId, pid);
      safeLocalSet('wd_last_nickname', nickname);
      state.joining = false;
      render();
    } catch (err) {
      state.joinError = (err && err.message) || 'Network error';
      state.joining = false;
      render();
    }
  }

  /* =========================================================================
     8. TIMER TICKER & FLASH EFFECT
     ========================================================================= */
  function triggerUnlockedFlash() {
    const el = document.getElementById('flash-overlay');
    if (!el) return;
    el.classList.remove('is-unlocked');
    void el.offsetWidth;
    el.classList.add('is-unlocked');
  }

  function formatMMSS(ms) {
    const totalSec = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  function startTimerLoop() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const room = state.room;
      if (!room || !room.phaseEndTime) return;
      if (room.phase !== 'questioning' && room.phase !== 'discussion') return;

      const remaining = room.phaseEndTime - Date.now();
      const secLeft = Math.max(0, Math.ceil(remaining / 1000));
      const formatted = formatMMSS(remaining);

      const timerEl = document.getElementById('timer-display');
      if (timerEl) timerEl.textContent = formatted;

      const isDanger = (room.phase === 'questioning' && secLeft <= 60 && secLeft > 0) ||
                       (room.phase === 'discussion' && secLeft <= 30 && secLeft > 0);

      const shellEl = document.getElementById('phase-shell');
      if (shellEl) shellEl.classList.toggle('is-danger', isDanger);

      const pTimerEl = document.getElementById('player-timer-box');
      if (pTimerEl) pTimerEl.classList.toggle('is-danger', isDanger);

      // TV Audio: Heartbeat & Watch Tick in final 60s of questioning (and final 30s of discussion)
      if (state.mode === 'tv' && isDanger && secLeft !== state.lastTickSecond) {
        state.lastTickSecond = secLeft;
        SoundEngine.playTick();
        if (room.phase === 'questioning') {
          SoundEngine.playHeartbeat();
        }
      }

      // TV Auto-transition on 00:00
      if (state.mode === 'tv' && remaining <= 0) {
        if (room.phase === 'questioning') {
          triggerTimeout();
        } else if (room.phase === 'discussion') {
          startVote1();
        }
      }
    }, 200);
  }

  /* =========================================================================
     9. QR CODE GENERATION (Dynamic from current public URL, z-index: 10000)
     ========================================================================= */
  function buildPlayerJoinUrl(roomId) {
    const base = window.location.origin + window.location.pathname;
    return base + '?room=' + encodeURIComponent(roomId);
  }

  function mountQRCode(containerId, roomId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const qrFactory = (typeof window.qrcode === 'function')
      ? window.qrcode
      : (typeof qrcode === 'function' ? qrcode : null);
    if (!qrFactory) {
      container.innerHTML = '<div style="color:#000;font-weight:900;padding:20px;">QR LIB LOADING...</div>';
      return;
    }
    try {
      const url = buildPlayerJoinUrl(roomId);
      const qr = qrFactory(0, 'M');
      qr.addData(url);
      qr.make();
      // Crisp high-contrast SVG with zero blur
      const svgMarkup = qr.createSvgTag({ cellSize: 8, margin: 0, scalable: true });
      container.innerHTML = svgMarkup;
    } catch (_) {
      container.innerHTML = '';
    }
  }

  /* =========================================================================
     10. SHARED MARKUP HELPERS
     ========================================================================= */
  function renderBrandLogo(compact) {
    return `
      <div class="brand-logo ${compact ? 'is-compact' : ''}">
        <h1 class="brand-title">
          <span class="w-yellow">WAREHOUSE</span>
          <span class="w-red">DOGS</span>
        </h1>
        <div class="brand-sub">BAR AND COFFEE TRANSIT</div>
      </div>
    `;
  }

  function renderSyncToast() {
    let toast = document.getElementById('sync-toast');
    if (state.syncStatus === 'online') {
      if (toast) toast.remove();
      return;
    }
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'sync-toast';
      toast.className = 'sync-toast';
      document.body.appendChild(toast);
    }
    if (state.syncStatus === 'error') {
      toast.classList.add('is-error');
      toast.textContent = 'SYNC RETRYING... ' + state.syncErrorMsg;
    } else {
      toast.classList.remove('is-error');
      toast.textContent = 'SYNCING...';
    }
  }

  /* =========================================================================
     11. TV HOST RENDERERS (65-Inch Large Monitor)
     ========================================================================= */
  function renderTV() {
    const room = state.room || createEmptyRoomData(state.roomId);
    const phase = room.phase || 'lobby';
    const app = document.getElementById('app');

    if (phase === 'lobby') {
      app.innerHTML = renderTVLobby(room);
      mountQRCode('tv-qr-stage', state.roomId);
      bindTVLobbyEvents();
    } else if (phase === 'roles') {
      app.innerHTML = renderTVRoles(room);
      const btn = document.getElementById('btn-start-questioning');
      if (btn) btn.addEventListener('click', startQuestioning);
    } else if (phase === 'questioning') {
      app.innerHTML = renderTVQuestioning(room);
      const demoUnlockBtn = document.getElementById('btn-demo-unlocked');
      if (demoUnlockBtn) demoUnlockBtn.addEventListener('click', triggerUnlocked);
    } else if (phase === 'discussion') {
      app.innerHTML = renderTVDiscussion(room);
      const skipBtn = document.getElementById('btn-skip-vote');
      if (skipBtn) skipBtn.addEventListener('click', startVote1);
    } else if (phase === 'vote1') {
      app.innerHTML = renderTVVote1(room);
      const closeBtn = document.getElementById('btn-close-vote1');
      if (closeBtn) closeBtn.addEventListener('click', () => finalizeVote1(room));
      const botVote1Btn = document.getElementById('btn-demo-vote1');
      if (botVote1Btn) botVote1Btn.addEventListener('click', castDemoBotVotes1);
    } else if (phase === 'tiebreak') {
      app.innerHTML = renderTVTiebreak(room);
      const rndBtn = document.getElementById('btn-tie-random');
      if (rndBtn) rndBtn.addEventListener('click', pickRandomTiebreak);
    } else if (phase === 'vote2') {
      app.innerHTML = renderTVVote2(room);
      const revBtn = document.getElementById('btn-reveal-verdict');
      if (revBtn) revBtn.addEventListener('click', () => finalizeVote2(room));
      const botVote2Btn = document.getElementById('btn-demo-vote2');
      if (botVote2Btn) botVote2Btn.addEventListener('click', castDemoBotVotes2);
    } else if (phase === 'result') {
      app.innerHTML = renderTVResult(room);
      const keepBtn = document.getElementById('btn-replay-keep');
      const shufBtn = document.getElementById('btn-replay-shuffle');
      const newBtn = document.getElementById('btn-new-room-result');
      if (keepBtn) keepBtn.addEventListener('click', () => playAgain(false));
      if (shufBtn) shufBtn.addEventListener('click', () => playAgain(true));
      if (newBtn) newBtn.addEventListener('click', createBrandNewRoom);
    }
    renderSyncToast();
  }

  function renderTVLobby(room) {
    const players = getSortedPlayers(room);
    const bySlot = {};
    players.forEach((p) => { bySlot[p.codenameIndex] = p; });

    let slotsHtml = '';
    for (let i = 0; i < MAX_PLAYERS; i++) {
      const p = bySlot[i];
      const code = getCodename(i);
      if (p) {
        slotsHtml += `
          <div class="crew-card is-filled">
            <button class="crew-kick-btn" data-kick="${escapeHtml(p.id)}" type="button" title="Remove">&times;</button>
            <div class="crew-avatar-wrap">${renderGangsterSVG(code.color, false)}</div>
            <div class="crew-codename" style="color:${code.color};">${code.label}</div>
            <div class="crew-nickname">${escapeHtml(p.name)}</div>
          </div>
        `;
      } else {
        slotsHtml += `
          <div class="crew-card is-empty">
            <div class="crew-avatar-wrap">${renderGangsterSVG('#333', true)}</div>
            <div class="crew-codename" style="color:#4A4A4A;">${code.label}</div>
            <div class="crew-empty-label">${t('waitingSlot')}</div>
          </div>
        `;
      }
    }

    const genresHtml = window.WD_GENRES.map((g) => {
      const active = (room.genre || 'random') === g.id ? 'active' : '';
      const label = state.lang === 'jp' ? g.jp : g.en;
      return `<button class="genre-btn ${active}" data-genre="${g.id}" type="button">${escapeHtml(label)}</button>`;
    }).join('');

    const canStart = players.length >= MIN_PLAYERS && players.length <= MAX_PLAYERS;
    const startLabel = canStart
      ? t('startMission')
      : `${t('startMission')} (${t('needCrew')})`;

    return `
      <div id="phase-shell" class="tv-shell">
        <header class="tv-header">
          ${renderBrandLogo(false)}
        </header>
        <section class="tv-lobby-main">
          <div class="tv-qr-column">
            <div class="noir-heading tv-qr-label">SCAN QR TO JOIN</div>
            ${state.lang === 'jp' ? `<div class="tv-qr-sub">${t('scanQr')}</div>` : ''}
            <div id="tv-qr-stage" class="qr-stage"></div>
          </div>
          <div class="tv-crew-column">
            <div class="crew-header-row">
              <div class="noir-heading crew-title">${t('crew')}</div>
              <div class="crew-count">${players.length} / ${MAX_PLAYERS}</div>
            </div>
            <div class="crew-grid">${slotsHtml}</div>
            <div class="tv-lobby-controls">
              <div class="genre-bar">${genresHtml}</div>
              <div class="lobby-action-row">
                <button id="btn-start-mission" class="btn-noir btn-primary" type="button" ${canStart ? '' : 'disabled'}>
                  ${escapeHtml(startLabel)}
                </button>
                ${isDemoMode ? `<button id="btn-demo-add-bots" class="btn-noir btn-yellow" style="font-size:clamp(1.1rem,1.4vw,1.5rem);padding:12px 18px;" type="button">+3 BOT</button>` : ''}
                <button id="btn-new-room" class="btn-noir btn-ghost" type="button">${t('newRoom')}</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  function bindTVLobbyEvents() {
    document.querySelectorAll('[data-genre]').forEach((btn) => {
      btn.addEventListener('click', () => setGenre(btn.getAttribute('data-genre')));
    });
    document.querySelectorAll('[data-kick]').forEach((btn) => {
      btn.addEventListener('click', () => kickPlayer(btn.getAttribute('data-kick')));
    });
    const startBtn = document.getElementById('btn-start-mission');
    if (startBtn) startBtn.addEventListener('click', startMission);
    const addBotsBtn = document.getElementById('btn-demo-add-bots');
    if (addBotsBtn) addBotsBtn.addEventListener('click', addDemoBots);
    const newBtn = document.getElementById('btn-new-room');
    if (newBtn) newBtn.addEventListener('click', createBrandNewRoom);
  }

  function renderTVRoles(room) {
    const boss = getPlayerById(room, room.bossId);
    const code = boss ? getCodename(boss.codenameIndex) : CODENAMES[0];

    return `
      <div id="phase-shell" class="tv-shell">
        <header class="tv-header">
          ${renderBrandLogo(true)}
        </header>
        <section class="tv-center-stage">
          <div class="phase-banner">${t('checkPhone')}</div>
          ${boss ? `
            <div class="boss-spotlight">
              <div class="boss-avatar-lg">${renderGangsterSVG(code.color, false)}</div>
              <div class="boss-info">
                <div class="boss-tag">${t('theBoss')}</div>
                <div class="boss-codename" style="color:${code.color};">${code.label}</div>
                <div class="boss-nickname">${escapeHtml(boss.name)}</div>
              </div>
            </div>
          ` : ''}
          <button id="btn-start-questioning" class="btn-noir btn-yellow" type="button">
            ${t('startQuestioning')}
          </button>
        </section>
      </div>
    `;
  }

  function renderTVQuestioning(room) {
    const boss = getPlayerById(room, room.bossId);
    const code = boss ? getCodename(boss.codenameIndex) : CODENAMES[0];
    const remaining = room.phaseEndTime ? (room.phaseEndTime - Date.now()) : QUESTION_DURATION_MS;
    const isDanger = Math.ceil(remaining / 1000) <= 60;

    return `
      <div id="phase-shell" class="tv-shell ${isDanger ? 'is-danger' : ''}">
        <header class="tv-header">
          ${renderBrandLogo(true)}
          <div class="noir-heading" style="font-size:clamp(1.7rem,2.6vw,3rem);color:var(--yellow);">
            ${t('questionPhase')}
          </div>
        </header>
        <section class="tv-timer-stage">
          <div id="timer-display" class="giant-timer">${formatMMSS(remaining)}</div>
          ${boss ? `
            <div class="timer-meta-bar">
              <div class="boss-pill">
                <span class="boss-pill-label">${t('theBoss')}:</span>
                <span style="color:${code.color};font-family:var(--font-display);">${code.label}</span>
                <span>${escapeHtml(boss.name)}</span>
              </div>
              ${isDemoMode ? `<button id="btn-demo-unlocked" class="btn-noir btn-yellow" style="font-size:1.3rem;padding:12px 24px;" type="button">DEMO: UNLOCKED!</button>` : ''}
            </div>
          ` : ''}
        </section>
      </div>
    `;
  }

  function renderTVDiscussion(room) {
    const remaining = room.phaseEndTime ? (room.phaseEndTime - Date.now()) : DISCUSSION_DURATION_MS;
    const isDanger = Math.ceil(remaining / 1000) <= 30;
    const word = room.word || { jp: '', en: '' };

    return `
      <div id="phase-shell" class="tv-shell ${isDanger ? 'is-danger' : ''}">
        <header class="tv-header">
          ${renderBrandLogo(true)}
          <div class="noir-heading" style="font-size:clamp(1.7rem,2.6vw,3rem);color:var(--red-bright);">
            ${t('whoIsRat')}
          </div>
        </header>
        <section class="tv-center-stage">
          <div class="secret-reveal-box">
            <div class="secret-reveal-label">${t('secretWord')}</div>
            <div class="secret-reveal-jp">${escapeHtml(word.jp)}</div>
            <div class="secret-reveal-en">${escapeHtml(word.en)}</div>
          </div>
          <div id="timer-display" class="discussion-timer">${formatMMSS(remaining)}</div>
          <button id="btn-skip-vote" class="btn-noir btn-primary" style="flex:0;padding:18px 54px;" type="button">
            ${t('skipToVote')}
          </button>
        </section>
      </div>
    `;
  }

  function renderTVVote1(room) {
    const players = getSortedPlayers(room);
    const votes = room.votes1 || {};
    const votedCount = Object.keys(votes).length;

    const cardsHtml = players.map((p) => {
      const code = getCodename(p.codenameIndex);
      const hasVoted = Boolean(votes[p.id]);
      return `
        <div class="vote-crew-card ${hasVoted ? 'has-voted' : ''}">
          ${hasVoted ? `<div class="voted-stamp">${t('voted')}</div>` : ''}
          <div class="crew-avatar-wrap">${renderGangsterSVG(code.color, false)}</div>
          <div class="crew-codename" style="color:${code.color};">${code.label}</div>
          <div class="crew-nickname">${escapeHtml(p.name)}</div>
        </div>
      `;
    }).join('');

    return `
      <div id="phase-shell" class="tv-shell">
        <header class="tv-header">
          ${renderBrandLogo(true)}
          <div class="vote-progress-badge">${votedCount} / ${players.length} ${t('votedCount')}</div>
        </header>
        <section class="tv-center-stage" style="gap:16px;">
          <div class="phase-banner">${t('vote1Title')}</div>
          <div class="check-phone-prompt" style="margin-top:-10px;">${t('vote1Sub')}</div>
          <div class="vote-crew-grid">${cardsHtml}</div>
          <div style="display:flex;gap:14px;">
            ${isDemoMode ? `<button id="btn-demo-vote1" class="btn-noir btn-yellow" style="font-size:1.25rem;padding:12px 22px;" type="button">DEMO: BOT投票</button>` : ''}
            <button id="btn-close-vote1" class="btn-noir btn-ghost" type="button">${t('closeVote')}</button>
          </div>
        </section>
      </div>
    `;
  }

  function renderTVTiebreak(room) {
    const tiedPlayers = (room.tiedIds || []).map((id) => getPlayerById(room, id)).filter(Boolean);
    const cardsHtml = tiedPlayers.map((p) => {
      const code = getCodename(p.codenameIndex);
      return `
        <div class="vote-crew-card is-tied">
          <div class="crew-avatar-wrap">${renderGangsterSVG(code.color, false)}</div>
          <div class="crew-codename" style="color:${code.color};">${code.label}</div>
          <div class="crew-nickname">${escapeHtml(p.name)}</div>
        </div>
      `;
    }).join('');

    return `
      <div id="phase-shell" class="tv-shell">
        <header class="tv-header">
          ${renderBrandLogo(true)}
        </header>
        <section class="tv-center-stage">
          <div class="phase-banner" style="color:var(--red-bright);">${t('tiebreakTitle')}</div>
          <div class="check-phone-prompt">${t('tiebreakSub')}</div>
          <div class="vote-crew-grid" style="grid-template-columns:repeat(${Math.min(tiedPlayers.length || 2, 4)}, minmax(220px, 300px));justify-content:center;">
            ${cardsHtml}
          </div>
          <button id="btn-tie-random" class="btn-noir btn-yellow" type="button">${t('randomDecide')}</button>
        </section>
      </div>
    `;
  }

  function renderTVVote2(room) {
    const suspect = getPlayerById(room, room.suspectId);
    const code = suspect ? getCodename(suspect.codenameIndex) : CODENAMES[0];
    const players = getSortedPlayers(room);
    const votedCount = Object.keys(room.votes2 || {}).length;

    return `
      <div id="phase-shell" class="tv-shell">
        <header class="tv-header">
          ${renderBrandLogo(true)}
          <div class="vote-progress-badge">${votedCount} / ${players.length} ${t('votedCount')}</div>
        </header>
        <section class="tv-center-stage">
          <div class="phase-banner" style="color:var(--red-bright);">${t('isThisRat')}</div>
          ${suspect ? `
            <div class="suspect-spotlight">
              <div class="boss-avatar-lg">${renderGangsterSVG(code.color, false)}</div>
              <div class="boss-info">
                <div class="boss-tag" style="background:var(--red);color:var(--white);">${t('vote2Title')}</div>
                <div class="boss-codename" style="color:${code.color};">${code.label}</div>
                <div class="boss-nickname">${escapeHtml(suspect.name)}</div>
              </div>
            </div>
          ` : ''}
          <div style="display:flex;gap:14px;">
            ${isDemoMode ? `<button id="btn-demo-vote2" class="btn-noir btn-yellow" style="font-size:1.25rem;padding:12px 22px;" type="button">DEMO: BOT投票</button>` : ''}
            <button id="btn-reveal-verdict" class="btn-noir btn-ghost" type="button">${t('revealVerdict')}</button>
          </div>
        </section>
      </div>
    `;
  }

  function renderTVResult(room) {
    const outcome = room.outcome || 'escaped';
    const rat = getPlayerById(room, room.ratId);
    const ratCode = rat ? getCodename(rat.codenameIndex) : CODENAMES[0];
    const word = room.word || { jp: '', en: '' };

    let mainTitle = t('escapedMain');
    let subTitle = t('escapedSub');
    let bannerClass = 'is-escaped';
    if (outcome === 'busted') {
      mainTitle = t('bustedMain');
      subTitle = t('bustedSub');
      bannerClass = 'is-busted';
    } else if (outcome === 'timeout') {
      mainTitle = t('timeoutMain');
      subTitle = t('timeoutSub');
      bannerClass = 'is-timeout';
    }

    const v2 = Object.values(room.votes2 || {});
    const yesCount = v2.filter((v) => v === 'YES').length;
    const noCount = v2.filter((v) => v === 'NO').length;
    const suspect = getPlayerById(room, room.suspectId);

    return `
      <div id="phase-shell" class="tv-shell">
        <header class="tv-header">
          ${renderBrandLogo(true)}
        </header>
        <section class="tv-center-stage" style="gap:clamp(14px,2vh,26px);">
          <div class="result-banner ${bannerClass}">${mainTitle}</div>
          <div class="result-sub">${subTitle}</div>

          <div class="result-details-row">
            ${rat ? `
              <div class="result-rat-card">
                <div class="crew-avatar-wrap" style="width:130px;height:130px;">${renderGangsterSVG(ratCode.color, false)}</div>
                <div class="boss-info">
                  <div class="boss-tag" style="background:var(--red);color:var(--white);font-size:1.25rem;">${t('trueRat')}</div>
                  <div class="boss-codename" style="color:${ratCode.color};font-size:clamp(2.2rem,3.6vw,4rem);">${ratCode.label}</div>
                  <div class="boss-nickname" style="font-size:clamp(1.8rem,2.8vw,3.2rem);">${escapeHtml(rat.name)}</div>
                </div>
              </div>
            ` : ''}
            <div class="result-word-card">
              <div class="secret-reveal-label">${t('secretWord')}</div>
              <div class="secret-reveal-jp" style="font-size:clamp(2rem,3.4vw,3.8rem);">${escapeHtml(word.jp)}</div>
              <div class="secret-reveal-en" style="font-size:clamp(1.3rem,2.2vw,2.4rem);">${escapeHtml(word.en)}</div>
              ${outcome !== 'timeout' && suspect ? `
                <div class="result-votes-line">
                  YES ${yesCount} / NO ${noCount}
                </div>
              ` : ''}
            </div>
          </div>

          <div class="result-actions">
            <button id="btn-replay-keep" class="btn-noir btn-yellow" style="font-size:clamp(1.3rem,1.9vw,2.1rem);" type="button">
              ${t('playAgainKeep')}
            </button>
            <button id="btn-replay-shuffle" class="btn-noir btn-primary" style="flex:0;font-size:clamp(1.3rem,1.9vw,2.1rem);" type="button">
              ${t('playAgainShuffle')}
            </button>
            <button id="btn-new-room-result" class="btn-noir btn-ghost" type="button">
              ${t('newRoom')}
            </button>
          </div>
        </section>
      </div>
    `;
  }

  /* =========================================================================
     12. SMARTPHONE PLAYER RENDERERS
     ========================================================================= */
  function renderPlayer() {
    const app = document.getElementById('app');
    const room = state.room;
    const me = room && state.playerId ? getPlayerById(room, state.playerId) : null;

    // Not yet joined (or kicked) -> show Nickname Join Form immediately
    if (!me) {
      const existingInput = document.getElementById('nickname-input');
      const prevValue = existingInput ? existingInput.value : '';
      const wasFocused = existingInput && document.activeElement === existingInput;

      app.innerHTML = renderPlayerJoin(room);
      const newInput = document.getElementById('nickname-input');
      if (newInput) {
        if (prevValue) {
          newInput.value = prevValue;
        } else {
          const savedNick = safeLocalGet('wd_last_nickname');
          if (savedNick) newInput.value = savedNick;
        }
      }
      if (newInput && wasFocused) {
        newInput.focus();
      }
      const form = document.getElementById('join-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const input = document.getElementById('nickname-input');
          joinRoomAsPlayer(input ? input.value : '');
        });
      }
      renderSyncToast();
      return;
    }

    const myCode = getCodename(me.codenameIndex);
    const phase = room.phase || 'lobby';
    let bodyHtml = '';

    if (phase === 'lobby') {
      bodyHtml = `
        <div class="player-card">
          <div style="width:140px;height:140px;">${renderGangsterSVG(myCode.color, false)}</div>
          <div class="crew-codename" style="color:${myCode.color};font-size:2.4rem;">${myCode.label}</div>
          <div class="crew-nickname" style="font-size:2rem;">${escapeHtml(me.name)}</div>
          <div style="margin-top:10px;font-weight:900;color:var(--yellow);font-size:1.3rem;letter-spacing:0.08em;">
            ${t('standby')}
          </div>
        </div>
      `;
    } else if (phase === 'roles' || phase === 'questioning') {
      bodyHtml = renderPlayerRoleAndQuestion(room, me, myCode);
    } else if (phase === 'discussion') {
      bodyHtml = renderPlayerDiscussion(room, me, myCode);
    } else if (phase === 'vote1') {
      bodyHtml = renderPlayerVote1(room, me);
    } else if (phase === 'tiebreak') {
      bodyHtml = renderPlayerTiebreak(room, me);
    } else if (phase === 'vote2') {
      bodyHtml = renderPlayerVote2(room, me);
    } else if (phase === 'result') {
      bodyHtml = renderPlayerResult(room, me);
    }

    app.innerHTML = `
      <div class="player-shell">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          ${renderBrandLogo(true)}
        </div>
        ${phase !== 'lobby' ? `
          <div style="display:flex;align-items:center;gap:12px;background:#161616;border:2px solid #2E2E2E;padding:10px 14px;">
            <div style="width:46px;height:46px;flex-shrink:0;">${renderGangsterSVG(myCode.color, false)}</div>
            <div style="min-width:0;">
              <div style="font-family:var(--font-display);font-size:1.3rem;color:${myCode.color};line-height:1;">${myCode.label}</div>
              <div style="font-weight:900;font-size:1.15rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(me.name)}</div>
            </div>
          </div>
        ` : ''}
        ${bodyHtml}
      </div>
    `;

    bindPlayerPhaseEvents(room, me);
    renderSyncToast();
  }

  function renderPlayerJoin(room) {
    const playerCount = room ? Object.keys(room.players || {}).length : 0;
    const isFull = playerCount >= MAX_PLAYERS;
    return `
      <div class="player-shell" style="justify-content:center;">
        <div style="margin-bottom:8px;">${renderBrandLogo(true)}</div>
        <form id="join-form" class="player-card">
          <label for="nickname-input" class="noir-heading" style="font-size:1.9rem;color:var(--yellow);">
            ${t('enterNickname')}
          </label>
          <input id="nickname-input" class="player-input" type="text" maxlength="14"
                 autocomplete="off" autocorrect="off" required
                 placeholder="${t('nicknamePlaceholder')}" ${isFull ? 'disabled' : ''}>
          ${state.joinError ? `<div style="color:var(--red-bright);font-weight:900;font-size:1.15rem;">${escapeHtml(state.joinError)}</div>` : ''}
          <button class="player-btn-full is-red" type="submit" ${state.joining || isFull ? 'disabled' : ''}>
            ${isFull ? t('roomFull') : (state.joining ? '...' : t('joinCrew'))}
          </button>
        </form>
      </div>
    `;
  }

  function renderPlayerRoleAndQuestion(room, me) {
    const role = (room.roles && room.roles[me.id]) || 'gangster';
    const word = room.word || { jp: '', en: '' };
    const isQuestioning = room.phase === 'questioning';
    const remaining = room.phaseEndTime ? (room.phaseEndTime - Date.now()) : QUESTION_DURATION_MS;
    const isDanger = isQuestioning && Math.ceil(remaining / 1000) <= 60;

    let roleCardHtml = '';
    if (!state.roleRevealed) {
      roleCardHtml = `
        <div id="role-toggle-card" class="role-card role-hidden">
          <div class="noir-heading" style="font-size:2rem;color:var(--yellow);">${t('tapToReveal')}</div>
          <div style="font-size:1rem;color:var(--muted);font-weight:700;">CONFIDENTIAL / 極秘</div>
        </div>
      `;
    } else if (role === 'boss') {
      roleCardHtml = `
        <div id="role-toggle-card" class="role-card role-boss">
          <div class="role-title-lg" style="color:var(--yellow);">${t('roleBossTitle')}</div>
          <div style="width:100%;border-top:2px solid #444;padding-top:12px;">
            <div style="font-family:var(--font-display);font-size:1rem;color:var(--yellow);letter-spacing:0.12em;">SECRET WORD</div>
            <div class="role-word-jp">${escapeHtml(word.jp)}</div>
            <div class="role-word-en">${escapeHtml(word.en)}</div>
          </div>
          <div class="role-hint">${t('roleBossHint')}</div>
          <div style="font-size:0.85rem;color:var(--muted);">(${t('tapToHide')})</div>
        </div>
      `;
    } else if (role === 'rat') {
      roleCardHtml = `
        <div id="role-toggle-card" class="role-card role-rat">
          <div class="role-title-lg" style="color:var(--red-bright);">${t('roleRatTitle')}</div>
          <div style="width:100%;border-top:2px solid var(--red-dark);padding-top:12px;">
            <div style="font-family:var(--font-display);font-size:1rem;color:var(--red-bright);letter-spacing:0.12em;">SECRET WORD</div>
            <div class="role-word-jp">${escapeHtml(word.jp)}</div>
            <div class="role-word-en">${escapeHtml(word.en)}</div>
          </div>
          <div class="role-hint">${t('roleRatHint')}</div>
          <div style="font-size:0.85rem;color:var(--muted);">(${t('tapToHide')})</div>
        </div>
      `;
    } else {
      roleCardHtml = `
        <div id="role-toggle-card" class="role-card role-gangster">
          <div class="role-title-lg" style="color:var(--white);">${t('roleGangTitle')}</div>
          <div style="width:100%;border-top:2px solid #3A3A3A;padding-top:14px;">
            <div class="role-word-jp" style="color:var(--yellow);">${t('roleGangSecret')}</div>
            <div class="role-word-en" style="color:var(--white);">${t('roleGangSecretEn')}</div>
          </div>
          <div class="role-hint">${t('roleGangHint')}</div>
          <div style="font-size:0.85rem;color:var(--muted);">(${t('tapToHide')})</div>
        </div>
      `;
    }

    return `
      ${isQuestioning ? `
        <div id="player-timer-box" class="player-timer-bar ${isDanger ? 'is-danger' : ''}">
          <span id="timer-display">${formatMMSS(remaining)}</span>
        </div>
      ` : ''}
      ${roleCardHtml}
      ${isQuestioning && role === 'boss' ? `
        <button id="btn-boss-unlocked" class="btn-unlocked-giant" type="button">
          <span class="btn-unlocked-jp">正解が出た！</span>
          <span class="btn-unlocked-en">UNLOCKED!</span>
        </button>
      ` : ''}
    `;
  }

  function renderPlayerDiscussion(room) {
    const remaining = room.phaseEndTime ? (room.phaseEndTime - Date.now()) : DISCUSSION_DURATION_MS;
    const word = room.word || { jp: '', en: '' };
    const boss = getPlayerById(room, room.bossId);
    const bossCode = boss ? getCodename(boss.codenameIndex) : CODENAMES[0];

    return `
      <div id="player-timer-box" class="player-timer-bar">
        <span id="timer-display">${formatMMSS(remaining)}</span>
      </div>
      <div class="player-card" style="border-color:var(--yellow);">
        <div class="noir-heading" style="font-size:2rem;color:var(--red-bright);">${t('whoIsRat')}</div>
        <div style="width:100%;border-top:2px solid #333;padding-top:12px;">
          <div style="font-family:var(--font-display);font-size:1rem;color:var(--yellow);letter-spacing:0.12em;">${t('secretWord')}</div>
          <div class="role-word-jp">${escapeHtml(word.jp)}</div>
          <div class="role-word-en">${escapeHtml(word.en)}</div>
        </div>
        ${boss ? `
          <div style="font-size:1.1rem;font-weight:900;color:var(--muted);margin-top:6px;">
            ${t('theBoss')}: <span style="color:${bossCode.color};">${bossCode.label}</span> (${escapeHtml(boss.name)})
          </div>
        ` : ''}
      </div>
    `;
  }

  function renderPlayerVote1(room, me) {
    const myVote = room.votes1 && room.votes1[me.id];
    if (myVote && !state.editingVote1) {
      const target = getPlayerById(room, myVote);
      const code = target ? getCodename(target.codenameIndex) : CODENAMES[0];
      return `
        <div class="player-card" style="border-color:var(--yellow);">
          <div class="noir-heading" style="font-size:2.2rem;color:var(--yellow);">${t('voteLocked')}</div>
          ${target ? `
            <div style="width:110px;height:110px;">${renderGangsterSVG(code.color, false)}</div>
            <div class="crew-codename" style="color:${code.color};font-size:2rem;">${code.label}</div>
            <div class="crew-nickname" style="font-size:1.7rem;">${escapeHtml(target.name)}</div>
          ` : ''}
          <button id="btn-change-vote1" class="player-btn-full is-dark" style="margin-top:8px;font-size:1.35rem;padding:14px;" type="button">
            ${t('changeVote')}
          </button>
        </div>
      `;
    }

    const candidates = getSortedPlayers(room).filter((p) => p.id !== room.bossId && p.id !== me.id);
    const selectedId = state.pendingVote1 || (state.editingVote1 ? myVote : null);
    const listHtml = candidates.map((p) => {
      const code = getCodename(p.codenameIndex);
      const isSelected = selectedId === p.id;
      return `
        <button class="player-vote-item ${isSelected ? 'selected' : ''}" data-select-vote1="${escapeHtml(p.id)}" type="button">
          <div class="player-vote-avatar">${renderGangsterSVG(code.color, false)}</div>
          <div class="player-vote-names">
            <span class="player-vote-code" style="color:${code.color};">${code.label}</span>
            <span class="player-vote-nick">${escapeHtml(p.name)}</span>
          </div>
        </button>
      `;
    }).join('');

    return `
      <div class="player-card">
        <div class="noir-heading" style="font-size:1.85rem;color:var(--yellow);">${t('votePickSuspect')}</div>
        <div class="player-vote-list">${listHtml}</div>
        <button id="btn-confirm-vote1" class="player-btn-full is-yellow" style="margin-top:6px;" type="button" ${selectedId ? '' : 'disabled'}>
          ${t('confirmVote')}
        </button>
      </div>
    `;
  }

  function renderPlayerTiebreak(room, me) {
    const isBoss = room.bossId === me.id;
    if (!isBoss) {
      return `
        <div class="player-card" style="border-color:var(--red);">
          <div class="noir-heading" style="font-size:2.2rem;color:var(--red-bright);">${t('tiebreakTitle')}</div>
          <div style="font-weight:900;font-size:1.3rem;">${t('waitingTie')}</div>
        </div>
      `;
    }
    const tiedPlayers = (room.tiedIds || []).map((id) => getPlayerById(room, id)).filter(Boolean);
    const listHtml = tiedPlayers.map((p) => {
      const code = getCodename(p.codenameIndex);
      return `
        <button class="player-vote-item" data-tiepick="${escapeHtml(p.id)}" type="button">
          <div class="player-vote-avatar">${renderGangsterSVG(code.color, false)}</div>
          <div class="player-vote-names">
            <span class="player-vote-code" style="color:${code.color};">${code.label}</span>
            <span class="player-vote-nick">${escapeHtml(p.name)}</span>
          </div>
        </button>
      `;
    }).join('');

    return `
      <div class="player-card" style="border-color:var(--red);">
        <div class="noir-heading" style="font-size:1.8rem;color:var(--yellow);">${t('bossTiePick')}</div>
        <div class="player-vote-list">${listHtml}</div>
      </div>
    `;
  }

  function renderPlayerVote2(room, me) {
    const suspect = getPlayerById(room, room.suspectId);
    const code = suspect ? getCodename(suspect.codenameIndex) : CODENAMES[0];
    const myVote = room.votes2 && room.votes2[me.id];

    if (myVote && !state.editingVote2) {
      return `
        <div class="player-card" style="border-color:var(--yellow);">
          <div class="noir-heading" style="font-size:2.2rem;color:var(--yellow);">${t('voteLocked')}</div>
          <div style="font-family:var(--font-display);font-size:3rem;color:${myVote === 'YES' ? 'var(--red-bright)' : 'var(--white)'};">
            ${myVote}
          </div>
          <button id="btn-change-vote2" class="player-btn-full is-dark" style="margin-top:8px;font-size:1.35rem;padding:14px;" type="button">
            ${t('changeVote')}
          </button>
        </div>
      `;
    }

    const selectedChoice = state.pendingVote2 || (state.editingVote2 ? myVote : null);

    return `
      <div class="player-card" style="border-color:var(--red);">
        <div class="noir-heading" style="font-size:1.9rem;color:var(--red-bright);">${t('verdictPrompt')}</div>
        ${suspect ? `
          <div style="width:110px;height:110px;">${renderGangsterSVG(code.color, false)}</div>
          <div class="crew-codename" style="color:${code.color};font-size:2.1rem;">${code.label}</div>
          <div class="crew-nickname" style="font-size:1.8rem;">${escapeHtml(suspect.name)}</div>
        ` : ''}
        <div class="verdict-btn-grid">
          <button class="verdict-btn is-yes" data-select-vote2="YES" type="button"
                  style="${selectedChoice === 'YES' ? 'outline:4px solid var(--yellow);transform:scale(1.03);' : 'opacity:0.78;'}">
            <span class="verdict-main">YES</span>
            <span class="verdict-sub">（${t('yesGuilty')}）</span>
          </button>
          <button class="verdict-btn is-no" data-select-vote2="NO" type="button"
                  style="${selectedChoice === 'NO' ? 'outline:4px solid var(--yellow);transform:scale(1.03);' : 'opacity:0.78;'}">
            <span class="verdict-main">NO</span>
            <span class="verdict-sub">（${t('noInnocent')}）</span>
          </button>
        </div>
        <button id="btn-confirm-vote2" class="player-btn-full is-yellow" style="margin-top:6px;" type="button" ${selectedChoice ? '' : 'disabled'}>
          ${t('confirmVerdict')}
        </button>
      </div>
    `;
  }

  function renderPlayerResult(room) {
    const outcome = room.outcome || 'escaped';
    const rat = getPlayerById(room, room.ratId);
    const ratCode = rat ? getCodename(rat.codenameIndex) : CODENAMES[0];
    const word = room.word || { jp: '', en: '' };

    const main = outcome === 'busted' ? t('bustedMain') : (outcome === 'timeout' ? t('timeoutMain') : t('escapedMain'));
    const sub = outcome === 'busted' ? t('bustedSub') : (outcome === 'timeout' ? t('timeoutSub') : t('escapedSub'));
    const color = outcome === 'busted' ? 'var(--yellow)' : 'var(--red-bright)';

    return `
      <div class="player-card" style="border-color:${color};">
        <div class="noir-heading" style="font-size:2.6rem;color:${color};">${main}</div>
        <div style="font-weight:900;font-size:1.3rem;">${sub}</div>
        ${rat ? `
          <div style="width:100%;border-top:2px solid #333;padding-top:14px;display:flex;flex-direction:column;align-items:center;">
            <div style="font-family:var(--font-display);color:var(--red-bright);letter-spacing:0.1em;">${t('trueRat')}</div>
            <div style="width:96px;height:96px;margin:6px 0;">${renderGangsterSVG(ratCode.color, false)}</div>
            <div class="crew-codename" style="color:${ratCode.color};font-size:1.9rem;">${ratCode.label}</div>
            <div class="crew-nickname" style="font-size:1.6rem;">${escapeHtml(rat.name)}</div>
          </div>
        ` : ''}
        <div style="width:100%;border-top:2px solid #333;padding-top:12px;">
          <div style="font-family:var(--font-display);font-size:0.95rem;color:var(--yellow);">${t('secretWord')}</div>
          <div class="role-word-jp" style="font-size:1.8rem;">${escapeHtml(word.jp)}</div>
          <div class="role-word-en" style="font-size:1.35rem;">${escapeHtml(word.en)}</div>
        </div>
      </div>
    `;
  }

  function bindPlayerPhaseEvents(room, me) {
    const roleCard = document.getElementById('role-toggle-card');
    if (roleCard) {
      roleCard.addEventListener('click', () => {
        state.roleRevealed = !state.roleRevealed;
        render();
      });
    }
    const unlockedBtn = document.getElementById('btn-boss-unlocked');
    if (unlockedBtn) {
      unlockedBtn.addEventListener('click', () => {
        unlockedBtn.disabled = true;
        triggerUnlocked();
      });
    }
    // Vote 1: select -> confirm & change vote
    document.querySelectorAll('[data-select-vote1]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.pendingVote1 = btn.getAttribute('data-select-vote1');
        render();
      });
    });
    const confirmVote1Btn = document.getElementById('btn-confirm-vote1');
    if (confirmVote1Btn) {
      confirmVote1Btn.addEventListener('click', () => {
        const myVote = room && room.votes1 && me ? room.votes1[me.id] : null;
        const choice = state.pendingVote1 || (state.editingVote1 ? myVote : null);
        if (!choice) return;
        state.editingVote1 = false;
        state.pendingVote1 = null;
        castVote1(choice);
      });
    }
    const changeVote1Btn = document.getElementById('btn-change-vote1');
    if (changeVote1Btn) {
      changeVote1Btn.addEventListener('click', () => {
        state.editingVote1 = true;
        state.pendingVote1 = room && room.votes1 && me ? room.votes1[me.id] : null;
        render();
      });
    }
    // Tiebreak
    document.querySelectorAll('[data-tiepick]').forEach((btn) => {
      btn.addEventListener('click', () => pickTiebreakSuspect(btn.getAttribute('data-tiepick')));
    });
    // Vote 2: select -> confirm & change vote
    document.querySelectorAll('[data-select-vote2]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.pendingVote2 = btn.getAttribute('data-select-vote2');
        render();
      });
    });
    const confirmVote2Btn = document.getElementById('btn-confirm-vote2');
    if (confirmVote2Btn) {
      confirmVote2Btn.addEventListener('click', () => {
        const myVote = room && room.votes2 && me ? room.votes2[me.id] : null;
        const choice = state.pendingVote2 || (state.editingVote2 ? myVote : null);
        if (!choice) return;
        state.editingVote2 = false;
        state.pendingVote2 = null;
        castVote2(choice);
      });
    }
    const changeVote2Btn = document.getElementById('btn-change-vote2');
    if (changeVote2Btn) {
      changeVote2Btn.addEventListener('click', () => {
        state.editingVote2 = true;
        state.pendingVote2 = room && room.votes2 && me ? room.votes2[me.id] : null;
        render();
      });
    }
  }

  /* =========================================================================
     13. RENDER DISPATCH & TOP CONTROLS
     ========================================================================= */
  function render() {
    updateTopControlsUI();
    if (state.mode === 'tv') {
      renderTV();
    } else {
      renderPlayer();
    }
  }

  function updateTopControlsUI() {
    const jpEl = document.getElementById('lang-jp');
    const enEl = document.getElementById('lang-en');
    if (jpEl) jpEl.classList.toggle('active', state.lang === 'jp');
    if (enEl) enEl.classList.toggle('active', state.lang === 'en');

    const audioBtn = document.getElementById('audio-toggle-btn');
    const iconOn = document.getElementById('audio-icon-on');
    const iconOff = document.getElementById('audio-icon-off');
    if (audioBtn) {
      audioBtn.classList.toggle('hidden', state.mode !== 'tv');
      audioBtn.classList.toggle('is-muted', SoundEngine.muted);
    }
    if (iconOn && iconOff) {
      iconOn.classList.toggle('hidden', SoundEngine.muted);
      iconOff.classList.toggle('hidden', !SoundEngine.muted);
    }
  }

  function setupGlobalEvents() {
    // Unlock Web Audio API on first user interaction
    const unlockOnce = () => { SoundEngine.unlock(); };
    document.addEventListener('pointerdown', unlockOnce, { passive: true });
    document.addEventListener('keydown', unlockOnce, { passive: true });

    const langBtn = document.getElementById('lang-toggle-btn');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        state.lang = state.lang === 'jp' ? 'en' : 'jp';
        safeLocalSet('wd_lang', state.lang);
        render();
      });
    }

    const audioBtn = document.getElementById('audio-toggle-btn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        SoundEngine.unlock();
        SoundEngine.muted = !SoundEngine.muted;
        updateTopControlsUI();
      });
    }

    // Smartphone browser Back-button guard (prevents accidental exit to entry screen)
    if (state.mode === 'player') {
      try {
        window.history.pushState({ wdGuard: true }, '', window.location.href);
        window.addEventListener('popstate', () => {
          try {
            window.history.pushState({ wdGuard: true }, '', window.location.href);
          } catch (_) {}
          // If player pressed Back after voting, open Change Vote picker
          const room = state.room;
          if (room && room.phase === 'vote1' && room.votes1 && room.votes1[state.playerId]) {
            state.editingVote1 = true;
            state.pendingVote1 = room.votes1[state.playerId];
            render();
          } else if (room && room.phase === 'vote2' && room.votes2 && room.votes2[state.playerId]) {
            state.editingVote2 = true;
            state.pendingVote2 = room.votes2[state.playerId];
            render();
          }
        });
      } catch (_) {}
    }
  }

  /* =========================================================================
     14. BOOTSTRAP — Instant Render First, Then Background Sync
     ========================================================================= */
  function bootstrap() {
    document.body.classList.add(state.mode === 'tv' ? 'mode-tv' : 'mode-player');
    if (state.mode === 'tv') {
      // Pre-populate empty lobby so TV renders instantaneously (never black screen)
      state.room = createEmptyRoomData(state.roomId);
      state.lastPhase = 'lobby';
    }
    setupGlobalEvents();
    render();
    startTimerLoop();
    initFirebase();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
