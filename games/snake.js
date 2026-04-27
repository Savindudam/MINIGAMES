// Snake
let snakeCells, snakeDir, snakeNextDir, snakeFood, snakeBest = 0, snakePts = 0, snakeRunning = false;
const SNAKE_COLS = 20, SNAKE_ROWS = 20, CELL = 20;

window.initSnake = function() {
    snakeBest = parseInt(localStorage.getItem('snakeBest') || '0');
    document.getElementById('snake-best-display').textContent = snakeBest;
    document.getElementById('snake-overlay').classList.remove('hidden');
    document.getElementById('snake-msg').textContent = 'Press START to play';
    document.getElementById('snake-start-btn').textContent = 'START';
    document.getElementById('snake-start-btn').onclick = window.startSnake;
    snakeRunning = false;
    if (window.snakeInterval) clearInterval(window.snakeInterval);
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    window.updateCurrentScore(0);
};

window.startSnake = function() {
    document.getElementById('snake-overlay').classList.add('hidden');
    snakeCells = [{x:10,y:10},{x:9,y:10},{x:8,y:10}];
    snakeDir = {x:1,y:0}; snakeNextDir = {x:1,y:0};
    snakePts = 0;
    document.getElementById('snake-score-display').textContent = '0';
    placeSnakeFood();
    snakeRunning = true;
    if (window.snakeInterval) clearInterval(window.snakeInterval);
   window.snakeInterval = setInterval(snakeTick, 130);
};

function placeSnakeFood() {
    let pos;
    do { pos = { x: Math.floor(Math.random() * SNAKE_COLS), y: Math.floor(Math.random() * SNAKE_ROWS) }; }
    while (snakeCells.some(c => c.x === pos.x && c.y === pos.y));
    snakeFood = pos;
}

function snakeTick() {
    if (!snakeRunning) return;
    snakeDir = snakeNextDir;
    const head = { x: snakeCells[0].x + snakeDir.x, y: snakeCells[0].y + snakeDir.y };
    if (head.x < 0 || head.x >= SNAKE_COLS || head.y < 0 || head.y >= SNAKE_ROWS ||
        snakeCells.some(c => c.x === head.x && c.y === head.y)) {
        snakeRunning = false;
        clearInterval(window.snakeInterval);
        if (snakePts > snakeBest) {
            snakeBest = snakePts;
            localStorage.setItem('snakeBest', snakeBest);
            document.getElementById('snake-best-display').textContent = snakeBest;
        }
        document.getElementById('snake-msg').textContent = `GAME OVER — ${snakePts} PTS`;
        document.getElementById('snake-start-btn').textContent = 'PLAY AGAIN';
        document.getElementById('snake-overlay').classList.remove('hidden');
        window.playSound('win');
        window.updateCurrentScore(snakePts);
        return;
    }
    snakeCells.unshift(head);
    if (head.x === snakeFood.x && head.y === snakeFood.y) {
        snakePts += 10;
        document.getElementById('snake-score-display').textContent = snakePts;
        placeSnakeFood();
        window.playSound('match');
    } else snakeCells.pop();
    drawSnake();
}

function drawSnake() {
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(snakeFood.x * CELL + 2, snakeFood.y * CELL + 2, CELL - 4, CELL - 4);
    snakeCells.forEach((c, i) => {
        ctx.fillStyle = i === 0 ? '#00ff9d' : '#00cc7e';
        ctx.fillRect(c.x * CELL + 1, c.y * CELL + 1, CELL - 2, CELL - 2);
    });
}

window.addEventListener('keydown', e => {
    if (!snakeRunning) return;
    if (e.key === 'ArrowUp'    && snakeDir.y === 0) snakeNextDir = { x: 0,  y: -1 };
 if (e.key === 'ArrowDown'  && snakeDir.y === 0) snakeNextDir = { x: 0,  y:  1 };
    if (e.key === 'ArrowLeft'  && snakeDir.x === 0) snakeNextDir = { x: -1, y:  0 };
    if (e.key === 'ArrowRight' && snakeDir.x === 0) snakeNextDir = { x:  1, y:  0 };
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
});