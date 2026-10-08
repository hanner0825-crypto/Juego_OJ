/**
 * CAZADOR NOCTURNO: EL MONSTRUO DE 3 OJOS
 * Videojuego 2D - Motor optimizado y a prueba de fallos.
 */

// ================= SISTEMA DE AUDIO SEGURO (Web Audio API) =================
class SoundController {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.bgmPlaying = false;
    this.bgmTimer = null;
  }

  init() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (e) {
      console.warn('Audio init warning:', e);
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled && this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmPlaying = false;
    } else if (this.enabled && !this.bgmPlaying) {
      this.startDesertMusic();
    }
    return this.enabled;
  }

  playTone(freq, type, duration, startVol = 0.12, endVol = 0.001) {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(Math.max(20, freq), now);
      gain.gain.setValueAtTime(startVol, now);
      gain.gain.linearRampToValueAtTime(Math.max(0.0001, endVol), now + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  }

  playShoot() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {}
  }

  playEnemyShoot() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.18);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {}
  }

  playJump() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.linearRampToValueAtTime(560, now + 0.14);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } catch (e) {}
  }

  playHit() {
    this.playTone(160, 'square', 0.08, 0.12, 0.001);
  }

  playExplosion() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.25);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, now);
      filter.frequency.linearRampToValueAtTime(80, now + 0.25);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.25);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
    } catch (e) {}
  }

  playPowerup() {
    if (!this.enabled || !this.ctx) return;
    const notes = [320, 480, 640, 960];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.08, 0.12, 0.001);
      }, idx * 50);
    });
  }

  playBossRoar() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(75, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.3);
      osc.frequency.linearRampToValueAtTime(55, now + 1.0);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 1.0);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.0);
    } catch (e) {}
  }

  playBossLaser() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.45);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {}
  }

  startDesertMusic() {
    if (!this.enabled || this.bgmPlaying) return;
    this.bgmPlaying = true;
    const notes = [110, 130.81, 146.83, 164.81, 196, 220, 146.83, 130.81];
    let step = 0;
    this.bgmTimer = setInterval(() => {
      if (!this.enabled) return;
      const f = notes[step % notes.length];
      this.playTone(f, 'triangle', 0.22, 0.04, 0.002);
      if (step % 2 === 0) {
        this.playTone(55, 'sine', 0.25, 0.06, 0.005);
      }
      step++;
    }, 280);
  }
}

const sounds = new SoundController();

// ================= MOTOR DEL JUEGO =================
class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.groundY = 440;

    // Estado
    this.state = 'START'; // START, PLAYING, GAMEOVER, VICTORY, PAUSED
    this.score = 0;
    this.bossTriggerScore = 5000;
    this.bossSpawned = false;
    this.enemiesDefeated = 0;
    this.shakeTime = 0;

    // Teclas
    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false,
      shoot: false
    };

    // Entidades
    this.player = new Player(this);
    this.bullets = [];
    this.enemyBullets = [];
    this.enemies = [];
    this.boss = null;
    this.particles = [];
    this.powerups = [];
    this.floatingTexts = [];

    // Tiempos
    this.lastEnemySpawn = 0;
    this.lastFlyerSpawn = 0;
    this.gameTime = 0;
    this.bgOffset = 0;

    // Estrellas
    this.stars = [];
    for (let i = 0; i < 70; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * (this.groundY - 100),
        size: Math.random() * 2 + 1,
        twinkle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.05 + 0.02
      });
    }

    // Dunas
    this.dunes = [
      { speed: 0.2, color: '#131c38', height: 160, freq: 0.003 },
      { speed: 0.5, color: '#1d274d', height: 110, freq: 0.005 },
      { speed: 1.0, color: '#9c6b32', height: 60, freq: 0.008 }
    ];

    this.cactusList = [];
    for (let i = 0; i < 6; i++) {
      this.cactusList.push({
        x: i * 200 + Math.random() * 100,
        height: 35 + Math.random() * 30,
        width: 14 + Math.random() * 8
      });
    }

    this.initUI();
    this.initInputs();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  initUI() {
    this.ui = {
      healthBar: document.getElementById('health-bar'),
      healthText: document.getElementById('health-text'),
      scoreDisplay: document.getElementById('score-display'),
      scoreProgress: document.getElementById('score-progress-bar'),
      weaponDisplay: document.getElementById('weapon-display'),
      powerupTimer: document.getElementById('powerup-timer'),
      bossHud: document.getElementById('boss-hud'),
      bossHealthBar: document.getElementById('boss-health-bar'),
      bossWarning: document.getElementById('boss-warning'),
      startScreen: document.getElementById('start-screen'),
      gameOverScreen: document.getElementById('game-over-screen'),
      victoryScreen: document.getElementById('victory-screen'),
      finalScore: document.getElementById('final-score'),
      victoryScore: document.getElementById('victory-score'),
      victoryKills: document.getElementById('victory-kills'),
      soundBtn: document.getElementById('sound-btn'),
      pauseBtn: document.getElementById('pause-btn'),
      eyeBadges: [
        document.getElementById('eye-1'),
        document.getElementById('eye-2'),
        document.getElementById('eye-3')
      ]
    };

    document.getElementById('start-btn')?.addEventListener('click', () => this.startGame());
    document.getElementById('restart-btn')?.addEventListener('click', () => this.restartGame());
    document.getElementById('play-again-btn')?.addEventListener('click', () => this.restartGame());

    this.ui.soundBtn?.addEventListener('click', () => {
      sounds.init();
      const on = sounds.toggle();
      this.ui.soundBtn.textContent = on ? '🔊 SONIDO: ON' : '🔇 SONIDO: OFF';
    });

    this.ui.pauseBtn?.addEventListener('click', () => {
      if (this.state === 'PLAYING') {
        this.state = 'PAUSED';
        this.ui.pauseBtn.textContent = '▶ REANUDAR';
      } else if (this.state === 'PAUSED') {
        this.state = 'PLAYING';
        this.ui.pauseBtn.textContent = '⏸️ PAUSA';
      }
    });

    // Leaderboard
    const showLb = () => this.fetchAndShowLeaderboard();
    document.getElementById('leaderboard-btn')?.addEventListener('click', showLb);
    document.getElementById('view-leaderboard-btn')?.addEventListener('click', showLb);
    document.getElementById('view-leaderboard-victory-btn')?.addEventListener('click', showLb);
    document.getElementById('close-leaderboard-btn')?.addEventListener('click', () => {
      document.getElementById('leaderboard-modal')?.classList.add('hidden');
    });

    // Guardar puntaje derrota
    document.getElementById('save-score-btn')?.addEventListener('click', () => {
      const name = document.getElementById('player-name-input')?.value.trim() || 'Cazador';
      this.saveScoreToBackend(name, false, document.getElementById('save-feedback'), document.getElementById('save-score-btn'));
    });

    // Guardar puntaje victoria
    document.getElementById('save-victory-score-btn')?.addEventListener('click', () => {
      const name = document.getElementById('player-name-victory-input')?.value.trim() || 'Héroe del Desierto';
      this.saveScoreToBackend(name, true, document.getElementById('save-victory-feedback'), document.getElementById('save-victory-score-btn'));
    });
  }

  async fetchAndShowLeaderboard() {
    const modal = document.getElementById('leaderboard-modal');
    const tbody = document.getElementById('leaderboard-body');
    if (modal) modal.classList.remove('hidden');
    if (tbody) tbody.innerHTML = '<tr><td colspan="5">Cargando puntuaciones...</td></tr>';

    try {
      const res = await fetch('/api/scores');
      if (!res.ok) throw new Error('API no disponible');
      const data = await res.json();
      this.renderLeaderboardTable(data);
    } catch (err) {
      const local = JSON.parse(localStorage.getItem('desert_scores') || '[]');
      this.renderLeaderboardTable(local);
    }
  }

  renderLeaderboardTable(scores) {
    const tbody = document.getElementById('leaderboard-body');
    if (!tbody) return;
    if (!scores || scores.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">No hay puntuaciones registradas aún. ¡Sé el primero!</td></tr>';
      return;
    }
    tbody.innerHTML = scores.map((s, idx) => `
      <tr>
        <td style="color: #f5b041; font-weight: bold;">#${idx + 1}</td>
        <td style="font-weight: bold;">${s.player_name || 'Cazador'}</td>
        <td style="color: #00f0ff;">${Number(s.score || 0).toLocaleString()}</td>
        <td>${s.kills || 0}</td>
        <td>${s.defeated_boss ? '👑 SÍ' : '❌ NO'}</td>
      </tr>
    `).join('');
  }

  async saveScoreToBackend(playerName, defeatedBoss, feedbackEl, btnEl) {
    if (btnEl) btnEl.disabled = true;
    if (feedbackEl) {
      feedbackEl.textContent = 'Guardando puntaje...';
      feedbackEl.style.color = '#00f0ff';
    }

    const payload = {
      player_name: playerName,
      score: this.score,
      kills: this.enemiesDefeated,
      defeated_boss: defeatedBoss
    };

    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Error al guardar');
      if (feedbackEl) {
        feedbackEl.textContent = '✅ ¡Puntaje guardado con éxito en el servidor Flask!';
        feedbackEl.style.color = '#00ff88';
      }
    } catch (err) {
      const local = JSON.parse(localStorage.getItem('desert_scores') || '[]');
      local.push({ ...payload, date: new Date().toLocaleDateString() });
      local.sort((a, b) => b.score - a.score);
      localStorage.setItem('desert_scores', JSON.stringify(local.slice(0, 15)));
      if (feedbackEl) {
        feedbackEl.textContent = '✅ Guardado localmente';
        feedbackEl.style.color = '#f5b041';
      }
    }
  }

  initInputs() {
    const handleKey = (code, isDown) => {
      if (code === 'ArrowUp' || code === 'KeyW') this.keys.up = isDown;
      if (code === 'ArrowDown' || code === 'KeyS') this.keys.down = isDown;
      if (code === 'ArrowLeft' || code === 'KeyA') this.keys.left = isDown;
      if (code === 'ArrowRight' || code === 'KeyD') this.keys.right = isDown;
      if (code === 'Space' || code === 'KeyZ' || code === 'KeyX') this.keys.shoot = isDown;
    };

    window.addEventListener('keydown', (e) => {
      sounds.init();
      handleKey(e.code, true);
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      handleKey(e.code, false);
    });

    this.canvas.addEventListener('mousedown', () => {
      sounds.init();
      this.keys.shoot = true;
    });
    window.addEventListener('mouseup', () => {
      this.keys.shoot = false;
    });

    // Touch
    const bindTouch = (elemId, keyProp) => {
      const el = document.getElementById(elemId);
      if (!el) return;
      const setKey = (val, ev) => {
        ev.preventDefault();
        sounds.init();
        this.keys[keyProp] = val;
      };
      el.addEventListener('mousedown', (e) => setKey(true, e));
      el.addEventListener('mouseup', (e) => setKey(false, e));
      el.addEventListener('mouseleave', (e) => setKey(false, e));
      el.addEventListener('touchstart', (e) => setKey(true, e), { passive: false });
      el.addEventListener('touchend', (e) => setKey(false, e), { passive: false });
    };

    bindTouch('btn-up', 'up');
    bindTouch('btn-down', 'down');
    bindTouch('btn-left', 'left');
    bindTouch('btn-right', 'right');
    bindTouch('btn-shoot', 'shoot');
  }

  startGame() {
    sounds.init();
    sounds.startDesertMusic();
    this.state = 'PLAYING';
    this.ui.startScreen?.classList.add('hidden');
    this.ui.gameOverScreen?.classList.add('hidden');
    this.ui.victoryScreen?.classList.add('hidden');
    document.getElementById('leaderboard-modal')?.classList.add('hidden');
    this.resetGameData();
  }

  restartGame() {
    this.startGame();
  }

  resetGameData() {
    this.score = 0;
    this.enemiesDefeated = 0;
    this.bossSpawned = false;
    this.boss = null;
    this.bullets = [];
    this.enemyBullets = [];
    this.enemies = [];
    this.particles = [];
    this.powerups = [];
    this.floatingTexts = [];
    this.gameTime = 0;
    this.lastEnemySpawn = 0;
    this.lastFlyerSpawn = 0;
    this.player.reset();
    this.ui.bossHud?.classList.add('hidden');
    this.ui.bossWarning?.classList.add('hidden');
    this.ui.eyeBadges?.forEach(b => b?.classList.remove('destroyed'));
    this.updateHUD();
  }

  addScore(amount, x, y) {
    this.score += amount;
    if (x !== undefined && y !== undefined) {
      this.floatingTexts.push(new FloatingText(`+${amount}`, x, y, '#f5b041'));
    }
    this.updateHUD();

    if (this.score >= this.bossTriggerScore && !this.bossSpawned) {
      this.triggerBossEncounter();
    }
  }

  triggerBossEncounter() {
    this.bossSpawned = true;
    sounds.playBossRoar();
    this.shakeTime = 50;

    this.ui.bossWarning?.classList.remove('hidden');
    setTimeout(() => {
      this.ui.bossWarning?.classList.add('hidden');
      this.ui.bossHud?.classList.remove('hidden');
      this.boss = new ThreeEyedBoss(this);
    }, 2500);
  }

  updateHUD() {
    if (this.ui.healthBar) {
      const hpPct = Math.max(0, (this.player.hp / this.player.maxHp) * 100);
      this.ui.healthBar.style.width = `${hpPct}%`;
    }
    if (this.ui.healthText) {
      this.ui.healthText.textContent = `${Math.ceil(this.player.hp)} / ${this.player.maxHp}`;
    }
    if (this.ui.scoreDisplay) {
      this.ui.scoreDisplay.textContent = this.score.toLocaleString();
    }
    if (this.ui.scoreProgress) {
      const progressPct = Math.min(100, (this.score / this.bossTriggerScore) * 100);
      this.ui.scoreProgress.style.width = `${progressPct}%`;
    }

    if (this.ui.weaponDisplay && this.ui.powerupTimer) {
      if (this.player.weaponType === 'DUAL') {
        this.ui.weaponDisplay.textContent = 'PISTOLAS DUALES';
        this.ui.weaponDisplay.style.color = '#00ff88';
        this.ui.powerupTimer.textContent = 'Estándar';
      } else if (this.player.weaponType === 'SPREAD') {
        this.ui.weaponDisplay.textContent = 'TRIPLE RÁFAGA';
        this.ui.weaponDisplay.style.color = '#00f0ff';
        const sec = Math.ceil(this.player.weaponTimer / 60);
        this.ui.powerupTimer.textContent = `${sec}s restantes`;
      } else if (this.player.weaponType === 'PLASMA') {
        this.ui.weaponDisplay.textContent = 'CAÑÓN DE PLASMA';
        this.ui.weaponDisplay.style.color = '#ff007f';
        const sec = Math.ceil(this.player.weaponTimer / 60);
        this.ui.powerupTimer.textContent = `${sec}s restantes`;
      }
    }

    if (this.boss && this.ui.bossHealthBar) {
      const bossHpPct = Math.max(0, (this.boss.hp / this.boss.maxHp) * 100);
      this.ui.bossHealthBar.style.width = `${bossHpPct}%`;
    }
  }

  gameOver(reason) {
    this.state = 'GAMEOVER';
    sounds.playExplosion();
    if (this.ui.finalScore) this.ui.finalScore.textContent = this.score.toLocaleString();
    const defeatMsg = document.getElementById('defeat-msg');
    if (defeatMsg) defeatMsg.textContent = reason || 'El desierto nocturno te ha vencido.';
    const saveFeedback = document.getElementById('save-feedback');
    if (saveFeedback) saveFeedback.textContent = '';
    const saveBtn = document.getElementById('save-score-btn');
    if (saveBtn) saveBtn.disabled = false;
    this.ui.gameOverScreen?.classList.remove('hidden');
  }

  victory() {
    this.state = 'VICTORY';
    sounds.playPowerup();
    if (this.ui.victoryScore) this.ui.victoryScore.textContent = this.score.toLocaleString();
    if (this.ui.victoryKills) this.ui.victoryKills.textContent = this.enemiesDefeated;
    const saveFeedback = document.getElementById('save-victory-feedback');
    if (saveFeedback) saveFeedback.textContent = '';
    const saveBtn = document.getElementById('save-victory-score-btn');
    if (saveBtn) saveBtn.disabled = false;
    this.ui.victoryScreen?.classList.remove('hidden');
  }

  // ================= BUCLE PRINCIPAL (BLINDADO CONTRA FALLOS) =================
  loop() {
    requestAnimationFrame(this.loop);

    try {
      if (this.state === 'PLAYING') {
        this.update();
      }
      this.draw();
    } catch (err) {
      console.error('Error en el ciclo del juego:', err);
    }
  }

  update() {
    this.gameTime++;

    if (this.shakeTime > 0) this.shakeTime--;

    // Actualizar jugador
    this.player.update();

    // Generar enemigos
    if (!this.boss) {
      if (this.gameTime - this.lastEnemySpawn > 120) {
        this.spawnGroundEnemy();
        this.lastEnemySpawn = this.gameTime;
      }
      if (this.gameTime - this.lastFlyerSpawn > 160) {
        this.spawnFlyingEnemy();
        this.lastFlyerSpawn = this.gameTime;
      }
    } else {
      this.boss.update();
      if (this.gameTime % 220 === 0 && this.enemies.length < 3) {
        this.spawnFlyingEnemy();
      }
    }

    // Actualizar enemigos
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.update();
      if (e.dead || e.x < -100) {
        this.enemies.splice(i, 1);
      }
    }

    // Actualizar balas jugador
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.update();
      if (b.dead || b.x > this.width + 50 || b.x < -50 || b.y < -50 || b.y > this.height + 50) {
        this.bullets.splice(i, 1);
      }
    }

    // Actualizar balas enemigas
    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
      const eb = this.enemyBullets[i];
      eb.update();
      if (eb.dead || eb.x < -50 || eb.x > this.width + 50 || eb.y > this.height + 50) {
        this.enemyBullets.splice(i, 1);
      }
    }

    // Actualizar powerups
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const p = this.powerups[i];
      p.update();
      if (p.dead) {
        this.powerups.splice(i, 1);
      }
    }

    // Partículas
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const part = this.particles[i];
      part.update();
      if (part.alpha <= 0) this.particles.splice(i, 1);
    }

    // Textos flotantes
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.update();
      if (ft.alpha <= 0) this.floatingTexts.splice(i, 1);
    }

    this.bgOffset += 0.8;
    this.updateHUD();
  }

  spawnGroundEnemy() {
    const type = Math.random() < 0.55 ? 'STALKER' : 'SCORPION';
    this.enemies.push(new GroundMonster(this, type));
  }

  spawnFlyingEnemy() {
    const type = Math.random() < 0.5 ? 'GARGOYLE' : 'SHADOW_BAT';
    this.enemies.push(new FlyingMonster(this, type));
  }

  spawnExplosion(x, y, color = '#ff5533', count = 16) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, color));
    }
  }

  spawnPowerupDrop(x, y) {
    const rand = Math.random();
    if (rand < 0.35) {
      const type = rand < 0.15 ? 'HEALTH' : (rand < 0.25 ? 'SPREAD' : 'PLASMA');
      this.powerups.push(new PowerUp(x, y, type));
    }
  }

  // ================= RENDERIZADO =================
  draw() {
    this.ctx.save();

    if (this.shakeTime > 0) {
      const dx = (Math.random() - 0.5) * Math.min(10, this.shakeTime * 0.4);
      const dy = (Math.random() - 0.5) * Math.min(10, this.shakeTime * 0.4);
      this.ctx.translate(dx, dy);
    }

    // Cielo
    const skyGrad = this.ctx.createLinearGradient(0, 0, 0, this.groundY);
    skyGrad.addColorStop(0, '#040612');
    skyGrad.addColorStop(0.6, '#0a1026');
    skyGrad.addColorStop(1, '#161e3d');
    this.ctx.fillStyle = skyGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Luna y estrellas
    this.drawMoon();
    this.drawStars();
    this.drawParallaxDunes();
    this.drawCactus();
    this.drawGround();

    // Entidades
    this.powerups.forEach(p => p.draw(this.ctx));
    this.player.draw(this.ctx);
    this.enemies.forEach(e => e.draw(this.ctx));
    if (this.boss) this.boss.draw(this.ctx);
    this.bullets.forEach(b => b.draw(this.ctx));
    this.enemyBullets.forEach(eb => eb.draw(this.ctx));
    this.particles.forEach(p => p.draw(this.ctx));
    this.floatingTexts.forEach(ft => ft.draw(this.ctx));

    this.ctx.restore();
  }

  drawMoon() {
    const mx = 780, my = 110, r = 52;
    const glow = this.ctx.createRadialGradient(mx, my, r * 0.4, mx, my, r * 2.5);
    glow.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
    glow.addColorStop(0.5, 'rgba(179, 75, 251, 0.12)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    this.ctx.fillStyle = glow;
    this.ctx.beginPath();
    this.ctx.arc(mx, my, r * 2.5, 0, Math.PI * 2);
    this.ctx.fill();

    const moonGrad = this.ctx.createRadialGradient(mx - 12, my - 12, 4, mx, my, r);
    moonGrad.addColorStop(0, '#ffffff');
    moonGrad.addColorStop(0.7, '#d5e4ff');
    moonGrad.addColorStop(1, '#8ca3d4');
    this.ctx.fillStyle = moonGrad;
    this.ctx.beginPath();
    this.ctx.arc(mx, my, r, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawStars() {
    this.stars.forEach(s => {
      s.twinkle += s.speed;
      const alpha = 0.3 + 0.7 * Math.abs(Math.sin(s.twinkle));
      this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      this.ctx.fillRect(s.x, s.y, s.size, s.size);
    });
  }

  drawParallaxDunes() {
    this.dunes.forEach((d) => {
      this.ctx.fillStyle = d.color;
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.height);
      for (let x = 0; x <= this.width; x += 20) {
        const offset = this.bgOffset * d.speed;
        const y = this.groundY - d.height + Math.sin((x + offset) * d.freq) * 35;
        this.ctx.lineTo(x, y);
      }
      this.ctx.lineTo(this.width, this.height);
      this.ctx.closePath();
      this.ctx.fill();
    });
  }

  drawCactus() {
    this.ctx.fillStyle = '#09101f';
    this.cactusList.forEach(c => {
      const renderX = (c.x - (this.bgOffset * 0.6)) % (this.width + 100);
      const x = renderX < -50 ? renderX + this.width + 100 : renderX;
      const y = this.groundY - c.height;
      this.ctx.fillRect(x, y, c.width, c.height);
      this.ctx.fillRect(x - 6, y + 10, 6, 4);
      this.ctx.fillRect(x - 6, y + 4, 4, 10);
      this.ctx.fillRect(x + c.width, y + 14, 6, 4);
      this.ctx.fillRect(x + c.width + 2, y + 6, 4, 12);
    });
  }

  drawGround() {
    const sandGrad = this.ctx.createLinearGradient(0, this.groundY, 0, this.height);
    sandGrad.addColorStop(0, '#c28847');
    sandGrad.addColorStop(0.15, '#8c5929');
    sandGrad.addColorStop(1, '#3b210e');
    this.ctx.fillStyle = sandGrad;
    this.ctx.fillRect(0, this.groundY, this.width, this.height - this.groundY);

    this.ctx.strokeStyle = '#f5b041';
    this.ctx.lineWidth = 2.5;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.groundY);
    this.ctx.lineTo(this.width, this.groundY);
    this.ctx.stroke();
  }
}

// ================= CLASE JUGADOR =================
class Player {
  constructor(game) {
    this.game = game;
    this.reset();
  }

  reset() {
    this.width = 44;
    this.height = 68;
    this.x = 120;
    this.y = this.game.groundY - this.height;
    this.vx = 0;
    this.vy = 0;
    this.speed = 4.8;
    this.jumpForce = -13.5;
    this.gravity = 0.65;
    this.isGrounded = true;
    this.isCrouching = false;
    this.facing = 1;

    this.maxHp = 100;
    this.hp = 100;
    this.invulnerableTimer = 0;

    this.weaponType = 'DUAL';
    this.weaponTimer = 0;
    this.shootCooldown = 0;
    this.fireRate = 12;
    this.gunAlternate = 0;
    this.walkCycle = 0;
  }

  update() {
    if (this.invulnerableTimer > 0) this.invulnerableTimer--;

    this.isCrouching = this.game.keys.down && this.isGrounded;

    if (this.isCrouching) {
      this.vx = 0;
      this.height = 42;
    } else {
      this.height = 68;
      if (this.game.keys.left) {
        this.vx = -this.speed;
        this.facing = -1;
        this.walkCycle += 0.2;
      } else if (this.game.keys.right) {
        this.vx = this.speed;
        this.facing = 1;
        this.walkCycle += 0.2;
      } else {
        this.vx = 0;
      }

      if (this.game.keys.up && this.isGrounded) {
        this.vy = this.jumpForce;
        this.isGrounded = false;
        sounds.playJump();
        for (let i = 0; i < 5; i++) {
          this.game.particles.push(new Particle(this.x + this.width / 2, this.game.groundY, '#d4a373', 0.5));
        }
      }
    }

    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;

    if (this.y + this.height >= this.game.groundY) {
      this.y = this.game.groundY - this.height;
      this.vy = 0;
      this.isGrounded = true;
    }

    if (this.x < 10) this.x = 10;
    if (this.x + this.width > this.game.width - 10) this.x = this.game.width - this.width - 10;

    if (this.weaponTimer > 0) {
      this.weaponTimer--;
      if (this.weaponTimer <= 0) this.weaponType = 'DUAL';
    }

    if (this.shootCooldown > 0) this.shootCooldown--;

    if (this.game.keys.shoot && this.shootCooldown <= 0) {
      this.shoot();
      this.shootCooldown = this.weaponType === 'PLASMA' ? 8 : (this.weaponType === 'SPREAD' ? 14 : this.fireRate);
    }
  }

  shoot() {
    sounds.playShoot();
    this.gunAlternate = 1 - this.gunAlternate;

    const barrelY = this.isCrouching ? this.y + 16 : this.y + 22 + (this.gunAlternate * 6);
    const barrelX = this.facing === 1 ? this.x + this.width + 4 : this.x - 4;

    for (let i = 0; i < 3; i++) {
      this.game.particles.push(new Particle(barrelX, barrelY, '#00f0ff', 0.4));
    }

    if (this.weaponType === 'DUAL') {
      this.game.bullets.push(new Bullet(barrelX, barrelY, this.facing * 12, 0, 18, '#00f0ff'));
    } else if (this.weaponType === 'SPREAD') {
      this.game.bullets.push(new Bullet(barrelX, barrelY, this.facing * 12, -2.0, 15, '#38bdf8'));
      this.game.bullets.push(new Bullet(barrelX, barrelY, this.facing * 13, 0, 15, '#00f0ff'));
      this.game.bullets.push(new Bullet(barrelX, barrelY, this.facing * 12, 2.0, 15, '#38bdf8'));
    } else if (this.weaponType === 'PLASMA') {
      this.game.bullets.push(new Bullet(barrelX, barrelY, this.facing * 15, 0, 32, '#ff007f', 10));
    }
  }

  takeDamage(amount) {
    if (this.invulnerableTimer > 0) return;
    this.hp -= amount;
    this.invulnerableTimer = 35;
    sounds.playHit();
    this.game.shakeTime = 12;

    for (let i = 0; i < 6; i++) {
      this.game.particles.push(new Particle(this.x + this.width / 2, this.y + this.height / 2, '#ff3344'));
    }

    this.game.floatingTexts.push(new FloatingText(`-${Math.round(amount)}`, this.x + 20, this.y, '#ff3344'));

    if (this.hp <= 0) {
      this.hp = 0;
      this.game.gameOver('Has sido derrotado por los monstruos del desierto.');
    }
  }

  draw(ctx) {
    if (this.invulnerableTimer > 0 && Math.floor(this.invulnerableTimer / 4) % 2 === 0) {
      return;
    }

    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height);
    if (this.facing === -1) {
      ctx.scale(-1, 1);
    }

    // Sombra
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 0, this.width * 0.6, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    const legOffset = Math.sin(this.walkCycle) * 6;

    if (this.isCrouching) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-14, -14, 28, 14);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-12, -30, 24, 18);
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, -36, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(2, -38, 8, 4);
      ctx.fillStyle = '#475569';
      ctx.fillRect(8, -24, 16, 6);
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(22, -23, 4, 3);
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-10 + legOffset, -24, 7, 24);
      ctx.fillRect(3 - legOffset, -24, 7, 24);
      ctx.fillStyle = '#c28847';
      ctx.fillRect(-11 + legOffset, -6, 9, 6);
      ctx.fillRect(2 - legOffset, -6, 9, 6);

      ctx.fillStyle = '#0369a1';
      ctx.fillRect(-12, -48, 24, 26);

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(-12, -44);
      ctx.lineTo(-18 - Math.abs(this.vx * 1.5), -16);
      ctx.lineTo(-8, -22);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, -56, 11, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.ellipse(0, -62, 18, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(2, -58, 9, 4);

      ctx.fillStyle = '#334155';
      ctx.fillRect(-2, -42, 14, 6);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(10, -44, 15, 6);
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(23, -43, 4, 3);
      ctx.fillStyle = '#475569';
      ctx.fillRect(6, -36, 14, 5);
    }

    ctx.restore();
  }
}

// ================= CLASE BALA JUGADOR =================
class Bullet {
  constructor(x, y, vx, vy, damage, color = '#00f0ff', radius = 5) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.damage = damage;
    this.color = color;
    this.radius = radius;
    this.dead = false;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.radius;
    ctx.beginPath();
    ctx.moveTo(this.x - this.vx * 1.2, this.y - this.vy * 1.2);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
    ctx.restore();
  }
}

// ================= CLASE BALA ENEMIGA =================
class EnemyBullet {
  constructor(x, y, vx, vy, damage = 10, type = 'ORB', color = '#ff3377') {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.damage = damage;
    this.type = type;
    this.color = color;
    this.dead = false;
    this.radius = type === 'METEOR' ? 12 : 6;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Colisión con el jugador
    const player = window.gameInstance?.player;
    if (player && !this.dead) {
      if (
        this.x > player.x &&
        this.x < player.x + player.width &&
        this.y > player.y &&
        this.y < player.y + player.height
      ) {
        this.dead = true;
        player.takeDamage(this.damage);
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    if (this.type === 'METEOR') {
      ctx.fillStyle = '#ffeb3b';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

// ================= MONSTRUOS TERRESTRES =================
class GroundMonster {
  constructor(game, type = 'STALKER') {
    this.game = game;
    this.type = type;
    this.width = type === 'STALKER' ? 48 : 56;
    this.height = type === 'STALKER' ? 44 : 36;
    this.x = this.game.width + 30;
    this.y = this.game.groundY - this.height;
    this.speed = type === 'STALKER' ? 2.2 : 2.7;
    this.hp = type === 'STALKER' ? 50 : 75;
    this.maxHp = this.hp;
    this.points = type === 'STALKER' ? 150 : 250;
    this.shootTimer = Math.floor(Math.random() * 60) + 40;
    this.dead = false;
    this.animTime = 0;
  }

  update() {
    this.animTime += 0.15;
    this.x -= this.speed;

    this.shootTimer--;
    if (this.shootTimer <= 0 && this.x > 80 && this.x < this.game.width - 40) {
      this.shoot();
      this.shootTimer = 90 + Math.floor(Math.random() * 60);
    }

    // Colisión con balas del jugador
    this.game.bullets.forEach(b => {
      if (!b.dead && this.checkCollision(b.x - b.radius, b.y - b.radius, b.radius * 2, b.radius * 2)) {
        b.dead = true;
        this.hp -= b.damage;
        sounds.playHit();
        this.game.particles.push(new Particle(b.x, b.y, '#00ff88'));
        if (this.hp <= 0 && !this.dead) this.die();
      }
    });

    // Colisión física con jugador
    if (!this.dead && this.checkCollision(this.game.player.x, this.game.player.y, this.game.player.width, this.game.player.height)) {
      this.game.player.takeDamage(15);
    }
  }

  shoot() {
    sounds.playEnemyShoot();
    const target = this.game.player;
    const dx = (target.x + target.width / 2) - this.x;
    const dy = (target.y + target.height / 2) - (this.y + 15);
    const dist = Math.hypot(dx, dy) || 1;
    const speed = 5.2;

    this.game.enemyBullets.push(
      new EnemyBullet(this.x, this.y + 15, (dx / dist) * speed, (dy / dist) * speed, 12, 'ORB', '#00ff88')
    );
  }

  die() {
    this.dead = true;
    sounds.playExplosion();
    this.game.spawnExplosion(this.x + this.width / 2, this.y + this.height / 2, '#00ff88', 14);
    this.game.addScore(this.points, this.x, this.y);
    this.game.enemiesDefeated++;
    this.game.spawnPowerupDrop(this.x + this.width / 2, this.y + this.height / 2);
  }

  checkCollision(x, y, w, h) {
    return this.x < x + w && this.x + this.width > x && this.y < y + h && this.y + this.height > y;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    const legMove = Math.sin(this.animTime) * 4;

    if (this.type === 'STALKER') {
      ctx.fillStyle = '#064e3b';
      ctx.beginPath();
      ctx.ellipse(this.width / 2, this.height / 2, this.width * 0.45, this.height * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#052e16';
      ctx.lineWidth = 3;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(this.width / 2 + i * 12, this.height * 0.6);
        ctx.lineTo(this.width / 2 + i * 18, this.height + legMove * i);
        ctx.stroke();
      }

      ctx.fillStyle = '#00ff88';
      ctx.beginPath();
      ctx.arc(12, this.height / 2 - 4, 5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#450a0a';
      ctx.fillRect(8, 10, this.width - 16, this.height - 15);
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(0, 16 + legMove, 10, 10);

      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(this.width - 12, 15);
      ctx.quadraticCurveTo(this.width + 10, -5, this.width - 6, -12);
      ctx.stroke();

      ctx.fillStyle = '#ff0055';
      ctx.beginPath();
      ctx.arc(this.width - 6, -12, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    if (this.hp < this.maxHp) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, -8, this.width, 3);
      ctx.fillStyle = '#00ff88';
      ctx.fillRect(0, -8, (this.hp / this.maxHp) * this.width, 3);
    }
    ctx.restore();
  }
}

// ================= MONSTRUOS VOLADORES =================
class FlyingMonster {
  constructor(game, type = 'GARGOYLE') {
    this.game = game;
    this.type = type;
    this.width = type === 'GARGOYLE' ? 50 : 40;
    this.height = type === 'GARGOYLE' ? 36 : 30;
    this.x = this.game.width + 40;
    this.baseY = 90 + Math.random() * 180;
    this.y = this.baseY;
    this.speed = type === 'GARGOYLE' ? 3.0 : 3.6;
    this.hp = type === 'GARGOYLE' ? 45 : 30;
    this.maxHp = this.hp;
    this.points = type === 'GARGOYLE' ? 200 : 180;
    this.shootTimer = Math.floor(Math.random() * 50) + 30;
    this.dead = false;
    this.wingCycle = 0;
  }

  update() {
    this.wingCycle += 0.22;
    this.x -= this.speed;
    this.y = this.baseY + Math.sin(this.wingCycle) * 22;

    this.shootTimer--;
    if (this.shootTimer <= 0 && this.x > 90 && this.x < this.game.width - 30) {
      this.shoot();
      this.shootTimer = 85 + Math.floor(Math.random() * 50);
    }

    this.game.bullets.forEach(b => {
      if (!b.dead && this.checkCollision(b.x - b.radius, b.y - b.radius, b.radius * 2, b.radius * 2)) {
        b.dead = true;
        this.hp -= b.damage;
        sounds.playHit();
        this.game.particles.push(new Particle(b.x, b.y, '#ff007f'));
        if (this.hp <= 0 && !this.dead) this.die();
      }
    });

    if (!this.dead && this.checkCollision(this.game.player.x, this.game.player.y, this.game.player.width, this.game.player.height)) {
      this.game.player.takeDamage(12);
    }
  }

  shoot() {
    sounds.playEnemyShoot();
    const target = this.game.player;
    const dx = (target.x + target.width / 2) - this.x;
    const dy = (target.y + target.height / 2) - this.y;
    const dist = Math.hypot(dx, dy) || 1;
    const speed = 5.0;

    this.game.enemyBullets.push(
      new EnemyBullet(this.x, this.y + 10, (dx / dist) * speed, (dy / dist) * speed, 10, 'ORB', '#b34bfb')
    );
  }

  die() {
    this.dead = true;
    sounds.playExplosion();
    this.game.spawnExplosion(this.x + this.width / 2, this.y + this.height / 2, '#b34bfb', 14);
    this.game.addScore(this.points, this.x, this.y);
    this.game.enemiesDefeated++;
    this.game.spawnPowerupDrop(this.x + this.width / 2, this.y + this.height / 2);
  }

  checkCollision(x, y, w, h) {
    return this.x < x + w && this.x + this.width > x && this.y < y + h && this.y + this.height > y;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    const wingFlap = Math.sin(this.wingCycle) * 16;

    ctx.fillStyle = '#581c87';
    ctx.beginPath();
    ctx.moveTo(-8, 0);
    ctx.lineTo(-22, -18 - wingFlap);
    ctx.lineTo(6, -6);
    ctx.moveTo(8, 0);
    ctx.lineTo(22, -18 - wingFlap);
    ctx.lineTo(-6, -6);
    ctx.fill();

    ctx.fillStyle = '#3b0764';
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ff007f';
    ctx.beginPath();
    ctx.arc(-5, -2, 3.5, 0, Math.PI * 2);
    ctx.arc(5, -2, 3.5, 0, Math.PI * 2);
    ctx.fill();

    if (this.hp < this.maxHp) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(-this.width / 2, -20, this.width, 3);
      ctx.fillStyle = '#b34bfb';
      ctx.fillRect(-this.width / 2, -20, (this.hp / this.maxHp) * this.width, 3);
    }
    ctx.restore();
  }
}

// ================= JEFE SUPREMO: EL MONSTRUO DE 3 OJOS =================
class ThreeEyedBoss {
  constructor(game) {
    this.game = game;
    this.width = 160;
    this.height = 240;
    this.x = this.game.width + 40;
    this.targetX = this.game.width - 200;
    this.y = this.game.groundY - this.height;
    this.maxHp = 2200;
    this.hp = 2200;
    this.dead = false;

    this.eyes = [
      { id: 1, relX: 45, relY: 55, radius: 20, alive: true, hp: 500, color: '#ff0055', attackTimer: 70 },
      { id: 2, relX: 85, relY: 115, radius: 26, alive: true, hp: 700, color: '#b34bfb', attackTimer: 110 },
      { id: 3, relX: 40, relY: 175, radius: 20, alive: true, hp: 500, color: '#00f0ff', attackTimer: 140 }
    ];

    this.bodyAnim = 0;
    this.laserActive = false;
    this.laserTimer = 0;
    this.laserY = 0;
  }

  update() {
    this.bodyAnim += 0.05;

    if (this.x > this.targetX) {
      this.x -= 2;
    } else {
      this.y = (this.game.groundY - this.height) + Math.sin(this.bodyAnim) * 14;
    }

    // Ataques de cada ojo
    this.eyes.forEach((eye, index) => {
      if (!eye.alive) return;
      eye.attackTimer--;

      if (eye.attackTimer <= 0) {
        this.performEyeAttack(eye, index);
        const rateBonus = (1 - (this.hp / this.maxHp)) * 30;
        eye.attackTimer = Math.max(50, 110 - rateBonus + Math.floor(Math.random() * 40));
      }
    });

    if (this.laserActive) {
      this.laserTimer--;
      if (this.laserTimer <= 0) {
        this.laserActive = false;
      } else {
        const player = this.game.player;
        if (player.y < this.laserY + 22 && player.y + player.height > this.laserY - 22) {
          player.takeDamage(1.2);
        }
      }
    }

    // Colisión con balas
    this.game.bullets.forEach(b => {
      if (b.dead) return;

      let hitEye = false;
      this.eyes.forEach((eye, idx) => {
        if (!eye.alive) return;
        const eyeAbsX = this.x + eye.relX;
        const eyeAbsY = this.y + eye.relY;
        const dist = Math.hypot(b.x - eyeAbsX, b.y - eyeAbsY);

        if (dist <= eye.radius + b.radius) {
          b.dead = true;
          hitEye = true;
          eye.hp -= b.damage;
          this.hp -= b.damage * 1.5;
          sounds.playHit();
          this.game.spawnExplosion(b.x, b.y, eye.color, 5);
          this.game.floatingTexts.push(new FloatingText(`¡CRÍTICO! -${Math.ceil(b.damage * 1.5)}`, b.x, b.y, eye.color));

          if (eye.hp <= 0 && eye.alive) {
            this.destroyEye(eye, idx);
          }
        }
      });

      if (!hitEye && this.checkCollision(b.x - b.radius, b.y - b.radius, b.radius * 2, b.radius * 2)) {
        b.dead = true;
        this.hp -= b.damage;
        sounds.playHit();
        this.game.spawnExplosion(b.x, b.y, '#ff3344', 4);
      }
    });

    if (this.hp <= 0 && !this.dead) {
      this.die();
    }
  }

  performEyeAttack(eye, index) {
    const eyeAbsX = this.x + eye.relX;
    const eyeAbsY = this.y + eye.relY;
    const player = this.game.player;

    if (index === 0) {
      sounds.playEnemyShoot();
      for (let i = -1; i <= 1; i++) {
        this.game.enemyBullets.push(
          new EnemyBullet(eyeAbsX, eyeAbsY, -7, i * 2.2, 16, 'METEOR', '#ff3344')
        );
      }
    } else if (index === 1) {
      sounds.playBossLaser();
      this.laserActive = true;
      this.laserTimer = 50;
      this.laserY = eyeAbsY;
      this.game.shakeTime = 25;
    } else if (index === 2) {
      sounds.playEnemyShoot();
      const dx = (player.x + player.width / 2) - eyeAbsX;
      const dy = (player.y + player.height / 2) - eyeAbsY;
      const dist = Math.hypot(dx, dy) || 1;
      this.game.enemyBullets.push(
        new EnemyBullet(eyeAbsX, eyeAbsY, (dx / dist) * 7.0, (dy / dist) * 7.0, 16, 'ORB', '#00f0ff')
      );
    }
  }

  destroyEye(eye, index) {
    eye.alive = false;
    sounds.playExplosion();
    this.game.spawnExplosion(this.x + eye.relX, this.y + eye.relY, '#ff007f', 30);
    this.game.shakeTime = 35;
    this.game.addScore(1000, this.x + eye.relX, this.y + eye.relY);

    if (this.game.ui.eyeBadges && this.game.ui.eyeBadges[index]) {
      this.game.ui.eyeBadges[index].classList.add('destroyed');
    }
  }

  die() {
    this.dead = true;
    sounds.playExplosion();
    sounds.playBossRoar();
    this.game.spawnExplosion(this.x + this.width / 2, this.y + this.height / 2, '#ff007f', 70);
    this.game.shakeTime = 70;
    this.game.addScore(5000);
    setTimeout(() => {
      this.game.victory();
    }, 1200);
  }

  checkCollision(x, y, w, h) {
    return this.x < x + w && this.x + this.width > x && this.y < y + h && this.y + this.height > y;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Sombra
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.ellipse(this.width / 2, this.height, this.width * 0.7, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cuerpo
    const bodyGrad = ctx.createLinearGradient(0, 0, this.width, this.height);
    bodyGrad.addColorStop(0, '#2a0845');
    bodyGrad.addColorStop(0.5, '#1b002c');
    bodyGrad.addColorStop(1, '#0b0014');
    ctx.fillStyle = bodyGrad;

    ctx.beginPath();
    ctx.moveTo(30, 20);
    ctx.quadraticCurveTo(80, -20, 130, 20);
    ctx.quadraticCurveTo(170, 80, 150, 180);
    ctx.quadraticCurveTo(130, 240, 80, 235);
    ctx.quadraticCurveTo(20, 240, 10, 170);
    ctx.quadraticCurveTo(-10, 70, 30, 20);
    ctx.fill();

    // Cuernos
    ctx.fillStyle = '#0f051d';
    ctx.beginPath();
    ctx.moveTo(35, 25);
    ctx.lineTo(10, -35);
    ctx.lineTo(55, 10);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(125, 25);
    ctx.lineTo(150, -35);
    ctx.lineTo(105, 10);
    ctx.fill();

    // Ojos
    this.eyes.forEach((eye) => {
      const pulse = eye.alive ? Math.sin(this.bodyAnim * 3 + eye.id) * 2 : 0;
      const eyeR = eye.radius + pulse;

      ctx.fillStyle = '#05000a';
      ctx.beginPath();
      ctx.arc(eye.relX, eye.relY, eye.radius + 5, 0, Math.PI * 2);
      ctx.fill();

      if (eye.alive) {
        ctx.fillStyle = eye.color;
        ctx.beginPath();
        ctx.arc(eye.relX, eye.relY, eyeR, 0, Math.PI * 2);
        ctx.fill();

        const player = this.game.player;
        const dx = (player.x + player.width / 2) - (this.x + eye.relX);
        const dy = (player.y + player.height / 2) - (this.y + eye.relY);
        const angle = Math.atan2(dy, dx);
        const pupilDist = 4;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(eye.relX + Math.cos(angle) * pupilDist, eye.relY + Math.sin(angle) * pupilDist, eyeR * 0.45, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(eye.relX + Math.cos(angle) * (pupilDist + 2), eye.relY + Math.sin(angle) * (pupilDist + 2), eyeR * 0.25, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#262626';
        ctx.beginPath();
        ctx.arc(eye.relX, eye.relY, eye.radius * 0.7, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#7f1d1d';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(eye.relX - 10, eye.relY - 10);
        ctx.lineTo(eye.relX + 10, eye.relY + 10);
        ctx.moveTo(eye.relX + 10, eye.relY - 10);
        ctx.lineTo(eye.relX - 10, eye.relY + 10);
        ctx.stroke();
      }
    });

    ctx.restore();

    if (this.laserActive) {
      ctx.save();
      const beamGrad = ctx.createLinearGradient(0, this.laserY - 18, 0, this.laserY + 18);
      beamGrad.addColorStop(0, 'rgba(179, 75, 251, 0)');
      beamGrad.addColorStop(0.3, '#ff007f');
      beamGrad.addColorStop(0.5, '#ffffff');
      beamGrad.addColorStop(0.7, '#ff007f');
      beamGrad.addColorStop(1, 'rgba(179, 75, 251, 0)');

      ctx.fillStyle = beamGrad;
      ctx.fillRect(0, this.laserY - 14, this.x + this.eyes[1].relX, 28);
      ctx.restore();
    }
  }
}

// ================= POWER-UPS =================
class PowerUp {
  constructor(x, y, type = 'HEALTH') {
    this.x = x;
    this.y = y;
    this.type = type;
    this.width = 28;
    this.height = 28;
    this.dead = false;
    this.time = 0;
    this.vy = -1.2;
  }

  update() {
    this.time += 0.08;
    this.y += this.vy;
    if (this.y < 380) this.vy = 0.5;
    if (this.y > 420) this.vy = -0.5;

    const p = this.game.player;
    if (p.x < this.x + this.width && p.x + p.width > this.x && p.y < this.y + this.height && p.y + p.height > this.y) {
      this.collect(p);
    }
  }

  collect(player) {
    this.dead = true;
    sounds.playPowerup();
    if (this.type === 'HEALTH') {
      player.hp = Math.min(player.maxHp, player.hp + 30);
      this.game.floatingTexts.push(new FloatingText('+30 SALUD', this.x, this.y, '#00ff88'));
    } else if (this.type === 'SPREAD') {
      player.weaponType = 'SPREAD';
      player.weaponTimer = 600;
      this.game.floatingTexts.push(new FloatingText('TRIPLE DISPARO', this.x, this.y, '#00f0ff'));
    } else if (this.type === 'PLASMA') {
      player.weaponType = 'PLASMA';
      player.weaponTimer = 480;
      this.game.floatingTexts.push(new FloatingText('CAÑÓN PLASMA', this.x, this.y, '#ff007f'));
    }
    this.game.spawnExplosion(this.x + 14, this.y + 14, '#ffffff', 8);
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + 14, this.y + 14);
    const float = Math.sin(this.time) * 4;
    ctx.translate(0, float);

    let color = '#00ff88';
    let icon = '+';
    if (this.type === 'SPREAD') { color = '#00f0ff'; icon = 'III'; }
    if (this.type === 'PLASMA') { color = '#ff007f'; icon = '⚡'; }

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, 0, 1);
    ctx.restore();
  }
}

// ================= PARTÍCULAS =================
class Particle {
  constructor(x, y, color = '#ff3344', speedMult = 1) {
    this.x = x;
    this.y = y;
    this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = (Math.random() * 4 + 1) * speedMult;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.size = Math.random() * 4 + 2;
    this.alpha = 1.0;
    this.decay = Math.random() * 0.03 + 0.02;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.restore();
  }
}

// ================= TEXTOS FLOTANTES =================
class FloatingText {
  constructor(text, x, y, color = '#f5b041') {
    this.text = text;
    this.x = x;
    this.y = y;
    this.color = color;
    this.alpha = 1.0;
    this.vy = -1.5;
  }

  update() {
    this.y += this.vy;
    this.alpha -= 0.02;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.font = 'bold 14px Orbitron, sans-serif';
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}

// Inicializar juego
window.addEventListener('DOMContentLoaded', () => {
  window.gameInstance = new Game();
});
