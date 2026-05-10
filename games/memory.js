const memIcons = ['🍎','🍌','🍒','🍇','🍉','🍓','🥝','🍍'];
let memCards = [], memFlipped = [], memLocked = false, memMoves = 0, memPairs = 0, memSeconds = 0;


window.initMemoryGame = function() {
    memCards = [...memIcons, ...memIcons].sort(() => Math.random() - 0.5);
    memFlipped = []; memLocked = false; memMoves = 0; memPairs = 0; memSeconds = 0;
    document.getElementById('mem-moves').textContent = '0';
    document.getElementById('mem-pairs').textContent = '0/8';
    document.getElementById('mem-timer').textContent = '0:00';
    const grid = document.getElementById('mem-grid');
    grid.innerHTML = memCards.map((icon, i) => `
        <div class="flip-card" onclick="flipMemCard(this, ${i})" style="aspect-ratio:1;cursor:pointer;perspective:800px;">
            <div class="flip-card-inner" style="position:relative;width:100%;height:100%;transition:transform 0.35s;transform-style:preserve-3d;">
                <div class="flip-card-front" style="position:absolute;inset:0;background:var(--bg3);border:1px solid var(--border);border-radius:8px;backface-visibility:hidden;display:flex;align-items:center;justify-content:center;font-family:var(--font-head);font-size:1.2rem;color:var(--muted);">?</div>
                <div class="flip-card-back" style="position:absolute;inset:0;background:rgba(0,255,157,0.12);border:1px solid rgba(0,255,157,0.3);border-radius:8px;backface-visibility:hidden;display:flex;align-items:center;justify-content:center;font-size:2rem;transform:rotateY(180deg);">${icon}</div>
            </div>
        </div>`).join('');
    if (window.memTimerInterval) clearInterval(window.memTimerInterval);
    window.memTimerInterval = setInterval(() => {
        memSeconds++;
        const m = Math.floor(memSeconds / 60), s = memSeconds % 60;
        document.getElementById('mem-timer').textContent = `${m}:${s.toString().padStart(2, '0')}`;
    }, 1000);
};

window.flipMemCard = function(el, i) {
    if (memLocked || el.classList.contains('flipped')) return;
    if (memFlipped.some(c => c.i === i)) return;

    el.classList.add('flipped');
    memFlipped.push({ el, i, icon: memCards[i] });
if (memFlipped.length === 2) {
        memMoves++;
        document.getElementById('mem-moves').textContent = memMoves;
        memLocked = true;
        const [c1, c2] = memFlipped;
        if (c1.icon === c2.icon) {
            memPairs++;
            document.getElementById('mem-pairs').textContent = `${memPairs}/8`;
            memFlipped = []; memLocked = false;
            window.playSound('match');
            if (memPairs === 8) {
                clearInterval(window.memTimerInterval);
                const score = Math.max(0, 2000 - memMoves * 20 - memSeconds * 5);
                window.updateCurrentScore(score);
                window.playSound('win');
            }
        } else {
    setTimeout(() => {
                c1.el.classList.remove('flipped');
                c2.el.classList.remove('flipped');
                memFlipped = []; memLocked = false;
            }, 1000);
        }
    }
};