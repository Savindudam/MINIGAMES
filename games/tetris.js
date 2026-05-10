window.initTetris = function() {
    const container = document.getElementById('game-tetris');
    container.innerHTML = '<canvas id="tetris-canvas" width="200" height="400" class="bg-zinc-900 rounded-xl mx-auto block border-2 border-zinc-800"></canvas>';
    const canvas = document.getElementById('tetris-canvas');
    const ctx = canvas.getContext('2d');
    const grid = 20;
    let board = Array(20).fill().map(() => Array(10).fill(0));
    let score = 0;

    const shapes = [
        [[1,1,1,1]],
        [[1,1],[1,1]],
        [[0,1,0],[1,1,1]],
        [[1,1,0],[0,1,1]],
        [[0,1,1],[1,1,0]],
        [[1,0,0],[1,1,1]],
        [[0,0,1],[1,1,1]]
    ];

    let piece = {
        pos: {x: 3, y: 0},
        shape: shapes[Math.floor(Math.random() * shapes.length)]
    };

    function draw() {
        ctx.clearRect(0, 0, 200, 400);
        board.forEach((row, y) => {
            row.forEach((val, x) => {
                if (val) {
                    ctx.fillStyle = '#3f3f46';
                    ctx.fillRect(x * grid, y * grid, grid - 1, grid - 1);
                }
            });
        });
        piece.shape.forEach((row, y) => {
            row.forEach((val, x) => {
                if (val) {
                    ctx.fillStyle = '#00ff9d';
                    ctx.fillRect((piece.pos.x + x) * grid, (piece.pos.y + y) * grid, grid - 1, grid - 1);
                }
            });
        });
    }

    function collide() {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x] && (board[piece.pos.y + y] && board[piece.pos.y + y][piece.pos.x + x]) !== 0) return true;
            }
        }
        return false;
    }

    function merge() {
        piece.shape.forEach((row, y) => {
            row.forEach((val, x) => {
                if (val) board[piece.pos.y + y][piece.pos.x + x] = 1;
            });
        });
    }

    function drop() {
        piece.pos.y++;
        if (collide()) {
            piece.pos.y--;
            merge();
            piece.pos = {x: 3, y: 0};
            piece.shape = shapes[Math.floor(Math.random() * shapes.length)];
            if (collide()) {
                board = Array(20).fill().map(() => Array(10).fill(0));
                score = 0;
                window.updateCurrentScore(0);
            }
            clearLines();
        }
        draw();
    }

    function clearLines() {
        for (let y = 19; y >= 0; y--) {
            if (board[y].every(v => v !== 0)) {
                board.splice(y, 1);
                board.unshift(Array(10).fill(0));
                score += 100;
                window.updateCurrentScore(score);
                window.playSound('match');
                y++;
            }
        }
    }

    function handleTetrisKey(e) {
        if (e.key === 'ArrowLeft') { piece.pos.x--; if (collide()) piece.pos.x++; draw(); }
        if (e.key === 'ArrowRight') { piece.pos.x++; if (collide()) piece.pos.x--; draw(); }
        if (e.key === 'ArrowDown') { drop(); }
        if (['ArrowLeft','ArrowRight','ArrowDown'].includes(e.key)) e.preventDefault();
    }
    if (window._tetrisKeyHandler) window.removeEventListener('keydown', window._tetrisKeyHandler);
    window._tetrisKeyHandler = handleTetrisKey;
    window.addEventListener('keydown', handleTetrisKey);

    if (window.tetrisInterval) clearInterval(window.tetrisInterval);
    window.tetrisInterval = setInterval(drop, 500);
};
