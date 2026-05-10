window.initFlappy = function() {
    const container = document.getElementById('game-flappy');
    container.innerHTML = '<canvas id="flappy-canvas" width="320" height="480" class="bg-zinc-900 rounded-xl mx-auto block border-2 border-zinc-800"></canvas>';
    const canvas = document.getElementById('flappy-canvas');
    const ctx = canvas.getContext('2d');
    let birdY = 240;
    let birdV = 0;
    let pipes = [];
    let score = 0;
    let frame = 0;

    function draw() {
        ctx.clearRect(0, 0, 320, 480);
        birdV += 0.25;
        birdY += birdV;
        ctx.fillStyle = '#00ff9d';
        ctx.fillRect(50, birdY, 20, 20);

        if (frame % 100 === 0) {
            pipes.push({ x: 320, h: 100 + Math.random() * 200 });
        }

        pipes.forEach((p, i) => {
            p.x -= 2;
            ctx.fillStyle = '#3f3f46';
            ctx.fillRect(p.x, 0, 40, p.h);
            ctx.fillRect(p.x, p.h + 120, 40, 480);

            if (p.x < 70 && p.x > 30 && (birdY < p.h || birdY > p.h + 100)) {
                clearInterval(window.flappyInterval);
                alert('Game Over! Score: ' + score);
                window.initFlappy();
            }
            if (p.x === 50) {
                score++;
                window.updateCurrentScore(score);
                window.playSound('match');
            }
        });

        pipes = pipes.filter(p => p.x > -40);
        if (birdY > 480 || birdY < 0) {
            clearInterval(window.flappyInterval);
            alert('Game Over!');
            window.initFlappy();
        }
        frame++;
    }

    function handleFlappyKey(e) {
        if (e.code === 'Space') {
            birdV = -5;
            window.playSound('click');
            e.preventDefault();
        }
    }
    if (window._flappyKeyHandler) window.removeEventListener('keydown', window._flappyKeyHandler);
    window._flappyKeyHandler = handleFlappyKey;
    window.addEventListener('keydown', handleFlappyKey);
    canvas.onclick = () => {
        birdV = -5;
        window.playSound('click');
    };

    if (window.flappyInterval) clearInterval(window.flappyInterval);
    window.flappyInterval = setInterval(draw, 20);
};
