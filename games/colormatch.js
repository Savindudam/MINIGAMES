window.initColorMatch = function() {
    const container = document.getElementById('game-colormatch');
    let gameArea = document.getElementById('colormatch-game-area');
    if (!gameArea) {
    gameArea = document.createElement('div');
gameArea.id = 'colormatch-game-area';
        gameArea.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:16px;width:100%;';
        container.appendChild(gameArea);
    }
    gameArea.innerHTML = '<div id="color-word" style="font-family:var(--font-head);font-size:2.5rem;font-weight:900;margin-bottom:8px;letter-spacing:0.1em;"></div><div id="color-btns" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:280px;width:100%;"></div>';
    const wordEl = document.getElementById('color-word');
    const btnsEl = document.getElementById('color-btns');
    const colors = [
        { name: 'RED', hex: '#ef4444' },
        { name: 'BLUE', hex: '#3b82f6' },
        { name: 'GREEN', hex: '#22c55e' },
        { name: 'YELLOW', hex: '#eab308' }
    ];
    let score = 0;

    function next() {
        btnsEl.innerHTML = '';
        const target = colors[Math.floor(Math.random() * colors.length)];
        const display = colors[Math.floor(Math.random() * colors.length)];
        wordEl.textContent = target.name;
        wordEl.style.color = display.hex;

        colors.forEach(c => {
            const btn = document.createElement('button');
            btn.style.cssText = `padding:20px;border:none;border-radius:8px;font-family:var(--font-head);font-size:0.55rem;letter-spacing:0.1em;cursor:pointer;font-weight:700;color:#000;background:${c.hex};transition:transform 0.1s;`;
            btn.textContent = c.name;
            btn.onmouseenter = () => { btn.style.transform = 'scale(1.04)'; };
            btn.onmouseleave = () => { btn.style.transform = ''; };
            btn.onclick = () => {
                if (c.name === target.name) {
                    score += 10;
                    window.updateCurrentScore(score);
                    window.playSound('match');
                    next();
                } else {
                    alert('Wrong! Score: ' + score);
                    score = 0;
                    window.updateCurrentScore(0);
                    next();
                }
            };
            btnsEl.appendChild(btn);
        });
    }
    next();
};
