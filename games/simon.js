window.initSimon = function() {
    const container = document.getElementById('game-simon');
    container.innerHTML = '<div id="simon-board" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:280px;width:100%;margin:0 auto;"></div>';
    const board = document.getElementById('simon-board');
    const colorDefs = [
        { hex: '#ef4444', name: 'red' },
        { hex: '#3b82f6', name: 'blue' },
        { hex: '#22c55e', name: 'green' },
        { hex: '#eab308', name: 'yellow' }
    ];
    let sequence = [];
    let playerSequence = [];
    let score = 0;
    let canPlay = false;

    colorDefs.forEach((color, i) => {
        const btn = document.createElement('button');
        btn.style.cssText = `aspect-ratio:1;background:${color.hex};border:none;border-radius:8px;cursor:pointer;opacity:0.4;transition:opacity 0.1s;`;
        btn.onclick = () => {
            if (!canPlay) return;
            flash(i);
            playerSequence.push(i);
            check(playerSequence.length - 1);
        };
        board.appendChild(btn);
    });

    function flash(i) {
        const btn = board.children[i];
        btn.style.opacity = '1';
        window.playSound('click');
        setTimeout(() => { btn.style.opacity = '0.4'; }, 300);
    }

    function nextRound() {
        playerSequence = [];
        sequence.push(Math.floor(Math.random() * 4));
        canPlay = false;
        let i = 0;
        const interval = setInterval(() => {
            flash(sequence[i]);
            i++;
            if (i >= sequence.length) {
                clearInterval(interval);
                canPlay = true;
            }
        }, 600);
    }

    function check(idx) {
        if (playerSequence[idx] !== sequence[idx]) {
            alert('Game Over! Score: ' + score);
            sequence = [];
            score = 0;
            window.updateCurrentScore(0);
            nextRound();
            return;
        }
        if (playerSequence.length === sequence.length) {
            score += 10;
            window.updateCurrentScore(score);
            window.playSound('match');
            setTimeout(nextRound, 1000);
        }
    }

    nextRound();
};
