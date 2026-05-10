window.initBreakout = function() {
    const container = document.getElementById('game-breakout');
    container.innerHTML = '<canvas id="breakout-canvas" width="400" height="300" class="bg-zinc-900 rounded-xl mx-auto block border-2 border-zinc-800"></canvas>';
    const canvas = document.getElementById('breakout-canvas');
    const ctx = canvas.getContext('2d');
    let x = 200, y = 250, dx = 2, dy = -2;
    let paddleX = 175, paddleW = 50;
    let bricks = [];
    let score = 0;
    for (let c = 0; c < 5; c++) {
        bricks[c] = [];
        for (let r = 0; r < 3; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

function draw() {
        ctx.clearRect(0, 0, 400, 300);
        ctx.fillStyle = '#00ff9d';
        ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI*2); ctx.fill();
        ctx.fillRect(paddleX, 280, paddleW, 10);

        for (let c = 0; c < 5; c++) {
            for (let r = 0; r < 3; r++) {
                if (bricks[c][r].status === 1) {
                    let bx = c * 80 + 5, by = r * 30 + 30;
                    bricks[c][r].x = bx; bricks[c][r].y = by;
                    ctx.fillStyle = '#3f3f46';
                    ctx.fillRect(bx, by, 70, 20);
                    if (x > bx && x < bx + 70 && y > by && y < by + 20) {
                        dy = -dy; bricks[c][r].status = 0;
                        score += 10; window.updateCurrentScore(score);
                        window.playSound('match');
                    }
                }
            }
        }

    if (x + dx > 395 || x + dx < 5) dx = -dx;
    if (y + dy < 5) dy = -dy;
    else if (y + dy > 275) {
    if (x > paddleX && x < paddleX + paddleW) {
                dy = -dy;
                window.playSound('click');
        } else {
                clearInterval(window.breakoutInterval);
                alert('Game Over!');
                window.initBreakout();
            }
        }
        x += dx; y += dy;
    }

canvas.onmousemove = (e) => {
        let rect = canvas.getBoundingClientRect();
        paddleX = e.clientX - rect.left - paddleW / 2;
    };

    if (window.breakoutInterval) clearInterval(window.breakoutInterval);
    window.breakoutInterval = setInterval(draw, 10);
};
