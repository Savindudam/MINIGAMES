let currentGame    = null;
let isMuted        = false;
let currentAuthTab = 'login';
let lbData         = {};
let lbMyData       = {};
let lbTab          = 'global';
let lbGame         = 'global';

const GAME_REGISTRY = [
    { id: 'memory',    title: 'MEMORY',   icon: '', desc: 'Flip and match all pairs.' },
    { id: 'tictactoe', title: 'TIC TAC',  icon: '',  desc: 'Beat the computer... if you can.' },
    { id: 'reaction',  title: 'REACTION', icon: '',  desc: 'Test your reflex speed.' },
    { id: 'quiz',      title: 'QUIZ',     icon: '',  desc: '10 web dev questions.' },
    { id: 'snake',     title: 'SNAKE',    icon: '',  desc: 'The classic snake game.' },
    { id: 'scramble',  title: 'SCRAMBLE', icon: '',  desc: 'Unscramble the word fast.' },
    { id: 'numguess',  title: 'GUESS',    icon: '',  desc: 'Guess the hidden number.' },
    { id: 'hangman',   title: 'HANGMAN',  icon: '',  desc: 'Guess before the man hangs.' },
];
document.addEventListener('DOMContentLoaded', () => {
    buildGameCards();
});

function buildGameCards() {
    const grid = document.getElementById('game-cards-grid');
    if (!grid) return;
    grid.innerHTML = GAME_REGISTRY.map(g => `
        <div onclick="startGame('${g.id}')" class="game-card group">
            <span class="game-card-icon">${g.icon}</span>
            <div class="game-card-title">${g.title}</div>
            <div class="game-card-desc">${g.desc}</div>
        </div>
    `).join('');
}

const SCREENS = ['home', 'game', 'leaderboard', 'about', 'report', 'suggest'];

window.sidebarNav = function(section) {
    SCREENS.forEach(s => {
        const el = document.getElementById('screen-' + s);
        if (el) el.classList.add('hidden');
    });

    const target = document.getElementById('screen-' + section);
    if (target) target.classList.remove('hidden');

    document.querySelectorAll('.sidebar-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('nav-' + section);
    if (activeBtn) activeBtn.classList.add('active');

    if (section === 'leaderboard') loadLeaderboardScreen();

    if (section !== 'game') stopAllGames();

    closeSidebarMobile();
};

window.backToHome = function() {
    stopAllGames();
    sidebarNav('home');
};

window.toggleSidebar = function() {
    const sb  = document.getElementById('sidebar');
    const ov  = document.getElementById('sidebar-overlay');
    const open = sb.classList.toggle('open');
    if (open) {
        ov.classList.remove('hidden');
        ov.classList.add('visible');
    } else {
        ov.classList.add('hidden');
        ov.classList.remove('visible');
    }
};

window.closeSidebarMobile = function() {
    const sb = document.getElementById('sidebar');
    const ov = document.getElementById('sidebar-overlay');
    sb.classList.remove('open');
    ov.classList.add('hidden');
    ov.classList.remove('visible');
};

window.toggleMute = function() {
    isMuted = !isMuted;
    const btn = document.getElementById('mute-btn');
    if (btn) {
        btn.querySelector('.sidebar-icon').textContent = isMuted ? '🔇' : '🔊';
        btn.querySelector('.sidebar-label').textContent = isMuted ? 'MUTED' : 'SOUND';
    }
};

window.playSound = function(type) {
    if (isMuted) return;
    try {
        const ctx  = new (window.AudioContext || window.webkitAudioContext)();
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);

        if (type === 'click') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.start(); osc.stop(ctx.currentTime + 0.1);
        } else if (type === 'match') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(600, ctx.currentTime);
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
                o.start(ctx.currentTime + i * 0.1);
                o.stop(ctx.currentTime + i * 0.1 + 0.3);
            });
        }
    } catch (e) {}
};

window.startGame = function(game) {
    currentGame = game;

    SCREENS.forEach(s => {
        const el = document.getElementById('screen-' + s);
        if (el) el.classList.add('hidden');
    });
    document.getElementById('screen-game').classList.remove('hidden');
    document.querySelectorAll('.sidebar-btn').forEach(btn => btn.classList.remove('active'));

    const entry = GAME_REGISTRY.find(g => g.id === game);
    document.getElementById('game-title').textContent =
        entry ? `${entry.icon} ${entry.title}` : game.toUpperCase();

    document.querySelectorAll('[id^="game-"]').forEach(el => el.classList.add('hidden'));
    const panel = document.getElementById('game-' + game);
    if (panel) panel.classList.remove('hidden');

    window.updateCurrentScore(0);
    stopAllGames();

    const inits = {
        memory:    () => window.initMemoryGame?.(),
        tictactoe: () => window.initTTT?.(),
        reaction:  () => window.initReactionGame?.(),
        quiz:      () => window.initQuizGame?.(),
        snake:     () => window.initSnake?.(),
        scramble:  () => window.initScramble?.(),
        numguess:  () => window.initNumGuess?.(),
        hangman:   () => window.initHangman?.(),
    };
    if (inits[game]) inits[game]();

    closeSidebarMobile();
};

function stopAllGames() {
    if (window.memTimerInterval)  clearInterval(window.memTimerInterval);
    if (window.reactionTimeout)   clearTimeout(window.reactionTimeout);
    if (window.quizTimerInterval) clearInterval(window.quizTimerInterval);
    if (window.snakeInterval)     clearInterval(window.snakeInterval);
    if (window.scrambleInterval)  clearInterval(window.scrambleInterval);
}

window.updateCurrentScore = function(s) {
    document.getElementById('current-score').textContent = Math.floor(s);
};

window.saveMyScore = async function() {
    const score = parseInt(document.getElementById('current-score').textContent);
    if (!score || score <= 0) { alert('Score must be greater than 0!'); return; }
    if (!currentGame) { alert('No active game.'); return; }
    const ok = await window.fbSaveScore(currentGame, score);
    if (ok) alert('Score saved to leaderboard!');
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

(function watchAuthBtn() {
    const original = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    setInterval(() => {
        const pill  = document.getElementById('nav-user-pill');
        const label = document.getElementById('auth-btn-label');
        if (!pill || !label) return;
        const loggedIn = !pill.classList.contains('hidden');
        label.textContent = loggedIn ? 'LOGOUT' : 'LOGIN';
        const authBtn = document.getElementById('auth-btn');
        if (authBtn) {
            authBtn.onclick = loggedIn ? window.fbLogout : () => window.showAuthModal('login');
            authBtn.querySelector('.sidebar-icon').textContent = loggedIn ? '◀' : '▶';
        }
    }, 500);
})();

async function loadLeaderboardScreen() {
    document.getElementById('lb-content').innerHTML =
        `<div class="text-center py-12 text-zinc-500 text-xs">Loading scores...</div>`;
    try {
        lbData   = await window.fbLoadLeaderboard();
        lbMyData = await window.fbLoadMyScores();
    } catch (e) {
        console.error('LB load failed:', e);
        lbData = {}; lbMyData = {};
    }
    renderLB();
}

window.switchLBTab = function(t) {
    lbTab = t;
    document.querySelectorAll('.lb-tab').forEach(btn => btn.classList.remove('active'));
    document.getElementById(t === 'global' ? 'lb-tab-global' : 'lb-tab-mine').classList.add('active');
    renderLB();
};

window.selectLBGame = function(g) {
    lbGame = g;
    document.querySelectorAll('.lb-game-btn').forEach(btn => btn.classList.remove('active-pill'));
    const active = document.getElementById('lbg-' + g);
    if (active) active.classList.add('active-pill');
    renderLB();
};

function renderLB() {
    const container = document.getElementById('lb-content');
    if (!container) return;
    if (lbTab === 'mine' && !window._currentUser) {
        container.innerHTML = `<div class="text-center py-12 text-zinc-500 text-xs">LOG IN TO SEE YOUR SCORES</div>`;
        return;
    }
    const data = lbTab === 'global' ? (lbData[lbGame] || []) : (lbMyData[lbGame] || []);
    if (data.length === 0) {
        container.innerHTML = `<div class="text-center py-12 text-zinc-500 text-xs">NO SCORES YET</div>`;
        return;
    }
    const medals = ['🥇','🥈','🥉'];
    const isGlobal = lbGame === 'global';
    container.innerHTML = `
        <div class="space-y-3">
            ${data.map((d, i) => `
                <div class="leaderboard-row flex items-center justify-between bg-zinc-800/50 p-4 rounded-2xl border border-zinc-800">
                    <div class="flex items-center gap-4">
                        <span class="rank font-bold w-8 text-sm">${medals[i] || '#' + (i + 1)}</span>
                        <div>
                            <div class="text-xs font-bold">${(d.displayName || 'PLAYER').toUpperCase()}</div>
                            ${isGlobal ? `<div style="font-size:0.4rem;color:var(--text-muted);margin-top:3px">${d.gamesPlayed || 0} GAMES PLAYED</div>` : ''}
                        </div>
                    </div>
                    <div class="text-right">
                        <div style="color:var(--neon);font-size:0.9rem;font-weight:bold">${d.score.toLocaleString()}</div>
                        <div style="font-size:0.4rem;color:var(--text-muted)">${isGlobal ? 'TOTAL PTS' : 'BEST SCORE'}</div>
                    </div>
                </div>
            `).join('')}
        </div>`;
}


async function sendToDiscord(embed) {
    const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] })
    });
    if (!res.ok) throw new Error(`Webhook failed: ${res.status}`);
}

window.submitReport = async function() {
    const game  = document.getElementById('report-game').value;
    const desc  = document.getElementById('report-desc').value.trim();
    const anon  = document.getElementById('report-anon').checked;
    const status = document.getElementById('report-status');

    if (!desc) { status.style.color = '#f43f5e'; status.textContent = 'Please describe the bug.'; return; }

    const sender = (!anon && window._currentUser)
        ? (window._currentUser.displayName || window._currentUser.email)
        : 'Anonymous';

    status.style.color = '#71717a';
    status.textContent = 'Sending...';
    document.querySelector('#screen-report .submit-btn').disabled = true;

    try {
        await sendToDiscord({
            title: '🐛 Bug Report',
            color: 0xf43f5e,
            fields: [
                { name: 'Game',        value: game,   inline: true  },
                { name: 'From',        value: sender, inline: true  },
                { name: 'Description', value: desc,   inline: false },
            ],
            timestamp: new Date().toISOString()
        });
        status.style.color = '#00ff9d';
        status.textContent = ' Report sent! Thanks.';
        document.getElementById('report-desc').value = '';
    } catch (e) {
        console.error('Webhook error:', e);
        status.style.color = '#f43f5e';
        status.textContent = ' Failed to send. Try again.';
    } finally {
        document.querySelector('#screen-report .submit-btn').disabled = false;
    }
};

window.submitSuggestion = async function() {
    const name  = document.getElementById('suggest-name').value.trim();
    const desc  = document.getElementById('suggest-desc').value.trim();
    const anon  = document.getElementById('suggest-anon').checked;
    const status = document.getElementById('suggest-status');

    if (!name) { status.style.color = '#f43f5e'; status.textContent = 'Please enter a game name.'; return; }

    const sender = (!anon && window._currentUser)
        ? (window._currentUser.displayName || window._currentUser.email)
        : 'Anonymous';

    status.style.color = '#71717a';
    status.textContent = 'Sending...';
    document.querySelector('#screen-suggest .submit-btn').disabled = true;

    try {
        await sendToDiscord({
            title: '💡 Game Suggestion',
            color: 0x00ff9d,
            fields: [
                { name: 'Game Idea', value: name,   inline: true  },
                { name: 'From',      value: sender, inline: true  },
                { name: 'Details',   value: desc || '(no details)', inline: false },
            ],
            timestamp: new Date().toISOString()
        });
        status.style.color = '#00ff9d';
        status.textContent = '✅ Suggestion sent! Thanks!';
        document.getElementById('suggest-name').value = '';
        document.getElementById('suggest-desc').value = '';
    } catch (e) {
        console.error('Webhook error:', e);
        status.style.color = '#f43f5e';
        status.textContent = '❌ Failed to send. Try again.';
    } finally {
        document.querySelector('#screen-suggest .submit-btn').disabled = false;
    }
};

window.openLB  = () => sidebarNav('leaderboard');
window.closeLB = () => sidebarNav('home');