window.initTower = function() {
    const container = document.getElementById('game-tower');
    container.innerHTML = '<canvas id="tower-canvas" width="400" height="300" class="bg-zinc-900 rounded-xl mx-auto block border-2 border-zinc-800"></canvas>';
    const canvas = document.getElementById('tower-canvas');
    const ctx = canvas.getContext('2d');
    let enemies = [];
    let towers = [];
    let score = 0;
    let frame = 0;

    canvas.onclick = (e) => {
        let rect = canvas.getBoundingClientRect();
        towers.push({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        window.playSound('click');
    };

    function draw() {
        ctx.clearRect(0, 0, 400, 300);
        if (frame % 60 === 0) enemies.push({ x: 0, y: 150, hp: 10 });

        towers.forEach(t => {
            ctx.fillStyle = '#00ff9d';
            ctx.fillRect(t.x - 10, t.y - 10, 20, 20);
            enemies.forEach(en => {
                let dist = Math.hypot(en.x - t.x, en.y - t.y);
                if (dist < 100 && frame % 20 === 0) {
                    en.hp -= 2;
                    ctx.strokeStyle = '#00ff9d';
                    ctx.beginPath(); ctx.moveTo(t.x, t.y); ctx.lineTo(en.x, en.y); ctx.stroke();
                }
            });
        });

        enemies.forEach((en, i) => {
            en.x += 1;
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(en.x - 5, en.y - 5, 10, 10);
            if (en.hp <= 0) {
                enemies.splice(i, 1);
                score += 50;
                window.updateCurrentScore(score);
                window.playSound('match');
            }
            if (en.x > 400) {
                enemies.splice(i, 1);
                score = Math.max(0, score - 100);
                window.updateCurrentScore(score);
            }
        });
        frame++;
    }

    if (window.towerInterval) clearInterval(window.towerInterval);
    window.towerInterval = setInterval(draw, 20);
};
