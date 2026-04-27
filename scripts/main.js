let currentGame    = null;
let isMuted        = false;
let currentAuthTab = 'login';
let lbData         = {};
let lbMyData       = {};
let lbTab          = 'global';
let lbGame         = 'memory';

window.toggleMute = function() {
    isMuted = !isMuted;
    const btn = document.getElementById('mute-btn');
    if (btn) btn.textContent = isMuted ? '🔇' : '🔊';
};

window.playSound = function(type) {
    if (isMuted) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);

        if (type === 'click') {
            osc.type = 'sine'; osc.frequency.setValueAtTime(400, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.start(); osc.stop(ctx.currentTime + 0.1);
        } else if (type === 'match') {
            osc.type = 'square'; osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            osc.start(); osc.stop(ctx.currentTime + 0.2);
        } else if (type === 'win') {
            [523.25, 659.25, 783.99].forEach((f, i) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.connect(g); g.connect(ctx.destination);
                o.frequency.setValueAtTime(f, ctx.currentTime + i * 0.1);
                g.gain.setValueAtTime(0.05, ctx.currentTime + i * 0.1);
                g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.3);
                o.start(ctx.currentTime + i * 0.1); o.stop(ctx.currentTime + i * 0.1 + 0.3);
            });
        }
    } catch (e) {}
};

function showScreen(id) {
    document.getElementById('screen-home').classList.add('hidden');
    document.getElementById('screen-game').classList.add('hidden');
    document.getElementById(id === 'home' ? 'screen-home' : 'screen-game').classList.remove('hidden');
}

window.startGame = function(game) {
    currentGame = game;
    showScreen('game');
    const titles = {
        memory: 'MEMORY MATCH', tictactoe: 'TIC TAC TOE',
        reaction: 'REACTION TEST', quiz: 'WEB DEV QUIZ',
        snake: 'SNAKE ARCADE', scramble: 'WORD SCRAMBLE',
        numguess: 'NUMBER GUESS', hangman: 'HANGMAN'
    };
    document.getElementById('game-title').textContent = titles[game] || game.toUpperCase();
    document.querySelectorAll('[id^="game-"]').forEach(el => el.classList.add('hidden'));
    document.getElementById('game-' + game).classList.remove('hidden');

    window.updateCurrentScore(0);
    stopAllGames();

    if (game === 'memory')          window.initMemoryGame();
    else if (game === 'tictactoe')  window.initTTT();
    else if (game === 'reaction')   window.initReactionGame();
    else if (game === 'quiz')       window.initQuizGame();
    else if (game === 'snake')      window.initSnake();
    else if (game === 'scramble')   window.initScramble();
    else if (game === 'numguess')   window.initNumGuess();
    else if (game === 'hangman')    window.initHangman();
};

window.backToHome = function() {
    stopAllGames();
    showScreen('home');
};

function stopAllGames() {
    if (window.memTimerInterval)   clearInterval(window.memTimerInterval);
    if (window.reactionTimeout)    clearTimeout(window.reactionTimeout);
    if (window.quizTimerInterval)  clearInterval(window.quizTimerInterval);
    if (window.snakeInterval)      clearInterval(window.snakeInterval);
    if (window.scrambleInterval)   clearInterval(window.scrambleInterval);
}

window.updateCurrentScore = function(s) {
    document.getElementById('current-score').textContent = Math.floor(s);
};

window.saveMyScore = async function() {
    const score = parseInt(document.getElementById('current-score').textContent);
    if (!score || score <= 0) { alert('Score must be greater than 0!'); return; }
    if (!currentGame) { alert('No active game.'); return; }
    const success = await window.fbSaveScore(currentGame, score);
    if (success) alert('Score saved to leaderboard!');
};

window.showAuthModal = function(tab = 'login') {
    const m = document.getElementById('auth-modal');
    m.style.display = 'flex';
    m.classList.remove('hidden');
    window.switchTab(tab);
};
window.hideAuthModal = function() {
    const m = document.getElementById('auth-modal');
    m.style.display = 'none';
    m.classList.add('hidden');
};
window.switchTab = function(tab) {
    currentAuthTab = tab;
    const isLogin = tab === 'login';
    document.getElementById('tab-login').classList.toggle('active', isLogin);
    document.getElementById('tab-login').classList.toggle('text-zinc-400', !isLogin);
    document.getElementById('tab-register').classList.toggle('active', !isLogin);
    document.getElementById('tab-register').classList.toggle('text-zinc-400', isLogin);
    document.getElementById('field-name').classList.toggle('hidden', isLogin);
    document.getElementById('auth-btn-text').textContent = isLogin ? 'LOGIN' : 'CREATE ACCOUNT';
    document.getElementById('auth-error').textContent = '';
};
window.setAuthLoading = function(l) {
    document.getElementById('auth-spinner').classList.toggle('hidden', !l);
    document.getElementById('auth-submit-btn').disabled = l;
    document.getElementById('auth-submit-btn').style.opacity = l ? '0.7' : '1';
};

window.openLB = async function() {
    const m = document.getElementById('lb-modal');
    m.style.display = 'flex';
    m.classList.remove('hidden');
    document.getElementById('lb-content').innerHTML =
        `<div class="text-center py-12 text-zinc-500 text-xs">Loading scores...</div>`;
    try {
        lbData   = await window.fbLoadLeaderboard();
        lbMyData = await window.fbLoadMyScores();
    } catch (e) {
        console.error('Leaderboard load failed:', e);
        lbData = {}; lbMyData = {};
    }
    renderLB();
};
window.closeLB = function() {
    const m = document.getElementById('lb-modal');
    m.style.display = 'none';
    m.classList.add('hidden');
};
window.switchLBTab = function(t) {
    lbTab = t;
    document.getElementById('lb-tab-global').classList.toggle('active', t === 'global');
    document.getElementById('lb-tab-global').classList.toggle('text-zinc-400', t !== 'global');
    document.getElementById('lb-tab-mine').classList.toggle('active', t === 'mine');
    document.getElementById('lb-tab-mine').classList.toggle('text-zinc-400', t !== 'mine');
    renderLB();
};
window.selectLBGame = function(g) {
    lbGame = g;
    document.querySelectorAll('.lb-game-btn').forEach(btn => {
        btn.classList.remove('bg-[#00ff9d]', 'text-black');
        btn.classList.add('bg-zinc-800');
    });
    const active = document.getElementById('lbg-' + g);
    if (active) {
        active.classList.add('bg-[#00ff9d]', 'text-black');
        active.classList.remove('bg-zinc-800');
    }
    renderLB();
};

function renderLB() {
    const container = document.getElementById('lb-content');
    if (lbTab === 'mine' && !window._currentUser) {
        container.innerHTML = `<div class="text-center py-12 text-zinc-500 text-xs">LOG IN TO SEE YOUR SCORES</div>`;
        return;
    }
    const data = lbTab === 'global' ? (lbData[lbGame] || []) : (lbMyData[lbGame] || []);
    if (data.length === 0) {
        container.innerHTML = `<div class="text-center py-12 text-zinc-500 text-xs">NO SCORES RECORDED YET</div>`;
        return;
    }
    container.innerHTML = `
        <div class="space-y-2">
            ${data.map((d, i) => `
                <div class="leaderboard-row flex items-center justify-between bg-zinc-800/50 p-4 rounded-2xl border border-zinc-800">
                    <div class="flex items-center gap-4">
                        <span class="rank font-bold w-6">#${i + 1}</span>
                        <span class="text-xs font-bold">${(d.displayName || 'PLAYER').toString().toUpperCase()}</span>
                    </div>
                    <span class="text-[#00ff9d] font-bold">${d.score}</span>
                </div>
            `).join('')}
        </div>
    `;
}

// this always turn into bug mmode so check it before checking anything for an error
