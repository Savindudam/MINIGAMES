window.init2048 = function() {
    const container = document.getElementById('game-2048');
    container.innerHTML = '<div id="grid-2048" class="grid grid-cols-4 gap-2 bg-zinc-800 p-2 rounded-xl max-w-xs mx-auto"></div>';
    const grid = document.getElementById('grid-2048');
    let board = Array(16).fill(0);
    let score = 0;

    function render() {
        grid.innerHTML = '';
        board.forEach(val => {
            const cell = document.createElement('div');
            cell.className = 'w-16 h-16 flex items-center justify-center rounded-lg font-bold text-sm ' + (val ? 'bg-neon text-black' : 'bg-zinc-700 text-zinc-500');
            cell.textContent = val || '';
            grid.appendChild(cell);
        });
        window.updateCurrentScore(score);
    }

    function addTile() {
        const empty = board.map((v, i) => v === 0 ? i : null).filter(v => v !== null);
        if (empty.length) {
            board[empty[Math.floor(Math.random() * empty.length)]] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function slide(row) {
        let filtered = row.filter(v => v);
        for (let i = 0; i < filtered.length - 1; i++) {
            if (filtered[i] === filtered[i + 1]) {
                filtered[i] *= 2;
                score += filtered[i];
                filtered.splice(i + 1, 1);
            }
        }
        while (filtered.length < 4) filtered.push(0);
        return filtered;
    }

    function move(dir) {
        let changed = false;
        const oldBoard = [...board];
        for (let i = 0; i < 4; i++) {
            let row = [];
            if (dir === 'left' || dir === 'right') {
                for (let j = 0; j < 4; j++) row.push(board[i * 4 + j]);
                if (dir === 'right') row.reverse();
                row = slide(row);
                if (dir === 'right') row.reverse();
                for (let j = 0; j < 4; j++) board[i * 4 + j] = row[j];
            } else {
                for (let j = 0; j < 4; j++) row.push(board[j * 4 + i]);
                if (dir === 'down') row.reverse();
                row = slide(row);
                if (dir === 'down') row.reverse();
                for (let j = 0; j < 4; j++) board[j * 4 + i] = row[j];
            }
        }
        if (board.some((v, i) => v !== oldBoard[i])) {
            addTile();
            render();
            window.playSound('click');
        }
    }

    function handle2048Key(e) {
        if (e.key === 'ArrowLeft') move('left');
        if (e.key === 'ArrowRight') move('right');
        if (e.key === 'ArrowUp') move('up');
        if (e.key === 'ArrowDown') move('down');
        if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) e.preventDefault();
    }
    if (window._2048KeyHandler) window.removeEventListener('keydown', window._2048KeyHandler);
    window._2048KeyHandler = handle2048Key;
    window.addEventListener('keydown', handle2048Key);

    addTile();
    addTile();
    render();
};
