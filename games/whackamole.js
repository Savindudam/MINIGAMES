window.initWhackAMole = function() {
    const container = document.getElementById('game-whackamole');
    container.innerHTML = '<div id="mole-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:320px;width:100%;margin:0 auto;"></div>';
    const grid = document.getElementById('mole-grid');
    let score = 0;
    let activeMole = -1;

    for (let i = 0; i < 9; i++) {
        const hole = document.createElement('div');
        hole.style.cssText = 'aspect-ratio:1;background:var(--bg3);border:2px solid var(--border);border-radius:50%;cursor:pointer;position:relative;overflow:hidden;transition:border-color 0.1s;';
        hole.onmouseenter = () => { if (i === activeMole) hole.style.borderColor = 'var(--neon)'; };
        hole.onclick = () => {
            if (i === activeMole) {
                score += 10;
                window.updateCurrentScore(score);
                window.playSound('match');
                hideMole();
            }
        };
        grid.appendChild(hole);
    }

    function showMole() {
        hideMole();
        activeMole = Math.floor(Math.random() * 9);
        const mole = document.createElement('div');
        mole.className = 'absolute inset-2 rounded-full';
        mole.style.cssText = 'position:absolute;inset:8px;background:var(--neon);border-radius:50%;box-shadow:0 0 16px rgba(0,255,157,0.8);';
        grid.children[activeMole].appendChild(mole);
        window.moleTimeout = setTimeout(showMole, 800 + Math.random() * 1000);
    }

    function hideMole() {
        if (activeMole !== -1) {
            grid.children[activeMole].innerHTML = '';
            activeMole = -1;
        }
    }

    showMole();
};
