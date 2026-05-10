window.initTicTacToe = function() {
    const container = document.getElementById('game-tictactoe');
    let board = Array(9).fill(null);
    let playerTurn = true;
    let gameOver = false;

    function render() {
        container.innerHTML = `
        <div style="text-align:center; margin-bottom:16px; font-size:0.6rem; color:var(--muted); font-family:var(--font-head); letter-spacing:0.1em;" id="ttt-status">YOUR TURN (X)</div>
        <div id="ttt-grid" style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px; width:100%; max-width:280px; margin:0 auto;"></div>
        <button class="game-btn" onclick="window.initTicTacToe()" style="margin-top:20px; display:block; margin-left:auto; margin-right:auto;">NEW GAME</button>
    `;
        const grid = document.getElementById('ttt-grid');
        board.forEach((cell, i) => {
            const btn = document.createElement('button');
            btn.style.cssText = 'width:100%; aspect-ratio:1; background:var(--card); border:2px solid var(--border); font-family:var(--font-head),system-ui; font-size:1.8rem; cursor:pointer; color:' + (cell === 'X' ? 'var(--neon)' : '#f43f5e');
            btn.textContent = cell || '';
            btn.onclick = () => playerMove(i);
            grid.appendChild(btn);
        });
    }

    function checkWinner(b) {
        const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        for (const [a,c,d] of lines) {
            if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
        }
        return b.every(Boolean) ? 'draw' : null;
    }

    function playerMove(i) {
        if (!playerTurn || gameOver || board[i]) return;
        board[i] = 'X';
        playerTurn = false;
        const result = checkWinner(board);
        render();
        if (result) { endGame(result); return; }
        document.getElementById('ttt-status').textContent = 'COMPUTER THINKING...';
        setTimeout(aiMove, 400);
    }

    function aiMove() {
        // Try to win, then block, then center, then random
        const empty = board.map((v,i) => v === null ? i : null).filter(v => v !== null);
        const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

        function findBest(mark) {
            for (const [a,b,c] of lines) {
                const cells = [board[a],board[b],board[c]];
                if (cells.filter(v=>v===mark).length===2 && cells.includes(null)) {
                    return [a,b,c][cells.indexOf(null)];
                }
            }
            return null;
        }

        let move = findBest('O') ?? findBest('X');
        if (move === null) move = board[4] === null ? 4 : empty[Math.floor(Math.random()*empty.length)];

        board[move] = 'O';
        playerTurn = true;
        const result = checkWinner(board);
        render();
        if (result) endGame(result);
    }

    function endGame(result) {
        gameOver = true;
        const status = document.getElementById('ttt-status');
        if (result === 'X') {
            status.textContent = 'YOU WIN!';
            status.style.color = '#00ff9d';
            window.updateCurrentScore(100);
            window.playSound('win');
        } else if (result === 'O') {
            status.textContent = 'COMPUTER WINS!';
            status.style.color = '#f43f5e';
            window.playSound('click');
        } else {
            status.textContent = "DRAW!";
            status.style.color = 'var(--text-muted)';
            window.updateCurrentScore(50);
        }
    }

    render();
    window.updateCurrentScore(0);
};