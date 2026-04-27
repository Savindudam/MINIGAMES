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
        <div class="flip-card aspect-square cursor-pointer" onclick="flipMemCard(this, ${i})">
            <div class="flip-card-inner relative w-full h-full">
         <div class="flip-card-front absolute inset-0 bg-zinc-800 rounded-2xl border-2 border-zinc-700 flex items-center justify-center text-2xl">?</div>
                <div class="flip-card-back absolute inset-0 bg-[#00ff9d] rounded-2xl flex items-center justify-center text-4xl">${icon}</div>
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