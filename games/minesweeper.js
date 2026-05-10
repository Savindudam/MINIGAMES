window.initMinesweeper = function() {
    const container = document.getElementById('game-minesweeper');
    container.innerHTML = '<div id="mine-grid" style="display:grid;grid-template-columns:repeat(8,1fr);gap:2px;max-width:360px;width:100%;"></div>';
    const grid = document.getElementById('mine-grid');
    const size = 8;
    const minesCount = 10;
    let board = [];
    let revealed = 0;

    for (let i = 0; i < size * size; i++) {
        board.push({ mine: false, count: 0, revealed: false });
    }

    let placed = 0;
    while (placed < minesCount) {
        let idx = Math.floor(Math.random() * (size * size));
        if (!board[idx].mine) { board[idx].mine = true; placed++; }
    }

    for (let i = 0; i < size * size; i++) {
        if (board[i].mine) continue;
        let count = 0;
        const r = Math.floor(i / size), c = i % size;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < size && nc >= 0 && nc < size && board[nr * size + nc].mine) count++;
            }
        }
        board[i].count = count;
    }

    board.forEach((cell, i) => {
        const btn = document.createElement('button');
        btn.style.cssText = 'aspect-ratio:1;background:var(--bg3);border:1px solid var(--border);font-family:var(--font-mono);font-size:0.65rem;cursor:pointer;color:var(--neon);display:flex;align-items:center;justify-content:center;transition:border-color 0.1s;';
        btn.onmouseenter = () => { if (!board[i].revealed) btn.style.borderColor = 'var(--neon)'; };
        btn.onmouseleave = () => { if (!board[i].revealed) btn.style.borderColor = 'var(--border)'; };
        btn.onclick = () => reveal(i);
        grid.appendChild(btn);
    });

    function reveal(i) {
        if (board[i].revealed) return;
        board[i].revealed = true;
        const btn = grid.children[i];
        btn.style.background = 'var(--bg)';
        btn.style.cursor = 'default';
        if (board[i].mine) {
            btn.style.background = '#ef4444';
            btn.textContent = 'x';
            alert('Game Over!');
            window.initMinesweeper();
            return;
        }
        const numColors = ['','#00ff9d','#3b82f6','#ef4444','#7b2fff','#f43f5e','#06b6d4','#000','#6b7280'];
        btn.textContent = board[i].count || '';
        if (board[i].count) btn.style.color = numColors[board[i].count] || 'var(--neon)';
        revealed++;
        window.updateCurrentScore(revealed * 5);
        if (revealed === size * size - minesCount) {
            alert('You Win! ');
            window.playSound('win');
        }
        if (board[i].count === 0) {
            const r = Math.floor(i / size), c = i % size;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < size && nc >= 0 && nc < size) reveal(nr * size + nc);
                }
            }
        }
    }
};
