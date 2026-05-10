const hmData = [
    {w:"FIREBASE",c:"TECH",h:"GOOGLE'S BACKEND"},
    {w:"TAILWIND",c:"TECH",h:"CSS FRAMEWORK"},
    {w:"JAVASCRIPT",c:"TECH",h:"WEB LANGUAGE"},
    {w:"REACT",c:"TECH",h:"UI LIBRARY"},
    {w:"PYTHON",c:"TECH",h:"SNAKE LANGUAGE"},
    {w:"ARCADE",c:"GAME",h:"PLACE TO PLAY"},
    {w:"PIXEL",c:"GAME",h:"TINY DOT"},
    {w:"JOYSTICK",c:"GAME",h:"CONTROLLER"}
    // Umm find more words in the dic you saved some in the notepad tooo check it 
];
let hmWord, hmGuessed, hmLives, hmStreak = 0;

window.initHangman = function() {
    const q = hmData[Math.floor(Math.random() * hmData.length)];
    hmWord = q.w; hmGuessed = []; hmLives = 6;
    document.getElementById('hm-lives').textContent = hmLives;
    document.getElementById('hm-category').textContent = q.c;
    document.getElementById('hm-hint').textContent = `HINT: ${q.h}`;
    document.getElementById('hm-streak').textContent = hmStreak;
    document.getElementById('hm-result').classList.add('hidden');
    document.getElementById('hm-keyboard').classList.remove('hidden');
    document.getElementById('hm-word').classList.remove('hidden');
    ['head','body','larm','rarm','lleg','rleg'].forEach(id => {
        const el = document.getElementById('hm-' + id);
        el.classList.remove('show');
        el.style.display = 'none';
    });
    renderHangman();
};

function renderHangman() {
    document.getElementById('hm-word').innerHTML = hmWord.split('').map(l => `
        <div class="w-10 h-12 border-b-4 border-zinc-700 flex items-center justify-center">
            ${hmGuessed.includes(l) ? l : ''}
        </div>`).join('');
    const kb = document.getElementById('hm-keyboard');
    kb.innerHTML = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => `
        <button onclick="guessHangman('${l}')"
                ${hmGuessed.includes(l) ? 'disabled' : ''}
                class="w-10 h-10 bg-zinc-800 rounded-lg text-xs font-bold hover:bg-zinc-700 disabled:opacity-30 transition">
            ${l}
        </button>`).join('');
}

window.guessHangman = function(l) {
    if (hmGuessed.includes(l)) return;
    hmGuessed.push(l);
    if (!hmWord.includes(l)) {
        hmLives--;
        document.getElementById('hm-lives').textContent = hmLives;
        const parts = ['head','body','larm','rarm','lleg','rleg'];
        const idx = 5 - hmLives;
        if (parts[idx]) {
            const partEl = document.getElementById('hm-' + parts[idx]);
            partEl.style.display = '';
            partEl.classList.add('show');
        }
        window.playSound('click');
    } else window.playSound('match');
    renderHangman();
    if (hmWord.split('').every(ch => hmGuessed.includes(ch))) finishHangman(true);
    else if (hmLives <= 0) finishHangman(false);
};

function finishHangman(win) {
    document.getElementById('hm-keyboard').classList.add('hidden');
    document.getElementById('hm-result').classList.remove('hidden');
    const msg = document.getElementById('hm-result-msg');
    msg.textContent = win ? 'YOU SURVIVED!' : 'GAME OVER';
    msg.style.color = win ? '#00ff9d' : '#f43f5e';
    document.getElementById('hm-result-word').textContent = `THE WORD WAS: ${hmWord}`;
    if (win) { hmStreak++; window.playSound('win'); window.updateCurrentScore(hmStreak * 200); }
    else { hmStreak = 0; }
    document.getElementById('hm-streak').textContent = hmStreak;
}