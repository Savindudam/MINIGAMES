let reactionTimes = [], reactionStart = 0, waitingForClick = false;

window.initReactionGame = function() {
    reactionTimes = [];
    document.getElementById('reaction-results').innerHTML = '';
    document.getElementById('reaction-best').textContent = 'BEST: — ms';
    document.getElementById('reaction-display').style.backgroundColor = '#27272a';
    document.getElementById('reaction-text').textContent = 'READY?';
    document.getElementById('reaction-start-btn').classList.remove('hidden');
    document.getElementById('reaction-start-btn').textContent = 'START TEST';
    document.getElementById('reaction-start-btn').onclick = window.startReactionTest;
    window.updateCurrentScore(0);
};

window.startReactionTest = function() {
    document.getElementById('reaction-start-btn').classList.add('hidden');
    reactionTimes = [];
    document.getElementById('reaction-results').innerHTML = '';
    nextReactionRound();
};

function nextReactionRound() {
    if (reactionTimes.length >= 5) { finishReactionTest(); return; }
    waitingForClick = false;
    document.getElementById('reaction-display').style.backgroundColor = '#27272a';
    document.getElementById('reaction-text').textContent = `ROUND ${reactionTimes.length + 1} — WAIT...`;
    window.reactionTimeout = setTimeout(() => {
        waitingForClick = true; reactionStart = Date.now();
        document.getElementById('reaction-display').style.backgroundColor = '#00ff9d';
        document.getElementById('reaction-text').innerHTML = '<span style="color:#000">CLICK!</span>';
        window.playSound('click');
    }, Math.random() * 3300 + 1200);
}

window.handleReactionClick = function() {
    if (!waitingForClick) {
        clearTimeout(window.reactionTimeout);
        document.getElementById('reaction-display').style.backgroundColor = '#f43f5e';
        document.getElementById('reaction-text').textContent = 'TOO EARLY!';
        reactionTimes.push(999);
        setTimeout(nextReactionRound, 1200);
        return;
    }
    const t = Date.now() - reactionStart; waitingForClick = false;
    reactionTimes.push(t);
    document.getElementById('reaction-display').style.backgroundColor = '#27272a';
    document.getElementById('reaction-text').textContent = `✅ ${t}ms`;
    const el = document.createElement('div');
    el.className = 'px-4 py-2 bg-zinc-800 rounded-2xl text-center';
    el.innerHTML = `<div class="text-xs text-zinc-400">R${reactionTimes.length}</div><div class="text-2xl font-bold">${t}</div>`;
    document.getElementById('reaction-results').appendChild(el);
    const best = Math.min(...reactionTimes);
    document.getElementById('reaction-best').textContent = `BEST: ${best}ms`;
    window.updateCurrentScore(Math.max(0, 800 - best));
    setTimeout(nextReactionRound, 900);
};

function finishReactionTest() {
    const valid = reactionTimes.filter(t => t < 999);
    const avg = valid.length
        ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length)
        : 0;
    document.getElementById('reaction-text').innerHTML = `AVG<br><span class="text-5xl">${avg}ms</span>`;
    const btn = document.getElementById('reaction-start-btn');
    btn.textContent = 'PLAY AGAIN';
    btn.onclick = window.initReactionGame;
    btn.classList.remove('hidden');
    window.playSound('win');let reactionTimes = [], reactionStart = 0, waitingForClick = false;

window.initReactionGame = function() {
    reactionTimes = [];
    document.getElementById('reaction-results').innerHTML = '';
    document.getElementById('reaction-best').textContent = 'BEST: --- ms';
    document.getElementById('reaction-display').style.backgroundColor = '#27272a';
    document.getElementById('reaction-text').textContent = 'READY?';
    document.getElementById('reaction-start-btn').classList.remove('hidden');
    document.getElementById('reaction-start-btn').textContent = 'START TEST';
    document.getElementById('reaction-start-btn').onclick = window.startReactionTest;
    window.updateCurrentScore(0);
};

window.startReactionTest = function() {
    document.getElementById('reaction-start-btn').classList.add('hidden');
    reactionTimes = [];
    document.getElementById('reaction-results').innerHTML = '';
    nextReactionRound();
};

function nextReactionRound() {
    if (reactionTimes.length >= 5) { finishReactionTest(); return; }
    waitingForClick = false;
    document.getElementById('reaction-display').style.backgroundColor = '#27272a';
    document.getElementById('reaction-text').textContent = `ROUND ${reactionTimes.length + 1} --- WAIT...`;
    window.reactionTimeout = setTimeout(() => {
        waitingForClick = true; reactionStart = Date.now();
        document.getElementById('reaction-display').style.backgroundColor = '#00ff9d';
        document.getElementById('reaction-text').innerHTML = '<span style="color:#000">CLICK!</span>';
        window.playSound('click');
    }, Math.random() * 3300 + 1200);
}

window.handleReactionClick = function() {
    if (!waitingForClick) {
        clearTimeout(window.reactionTimeout);
        document.getElementById('reaction-display').style.backgroundColor = '#f43f5e';
        document.getElementById('reaction-text').textContent = 'TOO EARLY!';
        reactionTimes.push(999);
        setTimeout(nextReactionRound, 1200);
        return;
    }
    const t = Date.now() - reactionStart; waitingForClick = false;
    reactionTimes.push(t);
    document.getElementById('reaction-display').style.backgroundColor = '#27272a';
    document.getElementById('reaction-text').textContent = `[OK] ${t}ms`;
    const el = document.createElement('div');
    el.className = 'px-4 py-2 bg-zinc-800 rounded-2xl text-center';
    el.innerHTML = `<div class="text-xs text-zinc-400">R${reactionTimes.length}</div><div class="text-2xl font-bold">${t}</div>`;
    document.getElementById('reaction-results').appendChild(el);
    const best = Math.min(...reactionTimes);
    document.getElementById('reaction-best').textContent = `BEST: ${best}ms`;
    window.updateCurrentScore(Math.max(0, 800 - best));
    setTimeout(nextReactionRound, 900);
};

function finishReactionTest() {
    const valid = reactionTimes.filter(t => t < 999);
    const avg = valid.length
        ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length)
        : 0;
    document.getElementById('reaction-text').innerHTML = `AVG<br><span class="text-5xl">${avg}ms</span>`;
    const btn = document.getElementById('reaction-start-btn');
    btn.textContent = 'PLAY AGAIN';
    btn.onclick = window.initReactionGame;
    btn.classList.remove('hidden');
    window.playSound('win');
}
}