let tttBoard = [], tttActive = true;

window.initTTT = function() {
    tttBoard = Array(9).fill(null); tttActive = true;
    document.getElementById('ttt-status').textContent = 'YOUR TURN (X)';
    const board = document.getElementById('ttt-board');
    board.innerHTML = tttBoard.map((_, i) => `
        <div onclick="makeTTTMove(${i})" class="board-cell aspect-square bg-zinc-900 border-2 border-zinc-800 rounded-2xl flex items-center justify-center text-4xl font-bold cursor-pointer"></div>
    `).join('');
};

window.makeTTTMove = function(i) {
    if (!tttActive || tttBoard[i]) return;
    tttBoard[i] = 'X';
    renderTTT();
    if (checkTTTWin('X')) { finishTTT('YOU WIN!'); window.updateCurrentScore(100); return; }
    if (tttBoard.every(b => b)) { finishTTT("IT'S A DRAW"); return; }
    tttActive = false;
    document.getElementById('ttt-status').textContent = 'MACHINE THINKING...';
    setTimeout(makeTTTBotMove, 600);
};

function makeTTTBotMove() {
    const empty = tttBoard.reduce((acc, b, i) => { if (b === null) acc.push(i); return acc; }, []);
    const move = empty[Math.floor(Math.random() * empty.length)];
    tttBoard[move] = 'O';
    renderTTT();
    if (checkTTTWin('O')) { finishTTT('MACHINE WINS'); return; }
    if (tttBoard.every(b => b)) { finishTTT("IT'S A DRAW"); return; }
    tttActive = true;
    document.getElementById('ttt-status').textContent = 'YOUR TURN (X)';
}

function renderTTT() {
    const cells = document.querySelectorAll('#ttt-board .board-cell');
    tttBoard.forEach((b, i) => {
        cells[i].textContent = b || '';
        if (b === 'X') cells[i].style.color = '#00ff9d';
        if (b === 'O') cells[i].style.color = '#f43f5e';
    });
}

function checkTTTWin(p) {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return wins.some(w => w.every(i => tttBoard[i] === p));
}

function finishTTT(msg) {
    tttActive = false;
    document.getElementById('ttt-status').textContent = msg;
    if (msg.includes('WIN')) window.playSound('win');
}