window.initSudoku = function() {
    const container = document.getElementById('game-sudoku');
    container.innerHTML = '<div id="sudoku-grid" class="grid grid-cols-9 gap-1 max-w-sm mx-auto bg-zinc-800 p-1"></div>';
    const grid = document.getElementById('sudoku-grid');
    const puzzle = [
        5,3,0,0,7,0,0,0,0,
        6,0,0,1,9,5,0,0,0,
        0,9,8,0,0,0,0,6,0,
        8,0,0,0,6,0,0,0,3,
        4,0,0,8,0,3,0,0,1,
        7,0,0,0,2,0,0,0,6,
        0,6,0,0,0,0,2,8,0,
        0,0,0,4,1,9,0,0,5,
        0,0,0,0,8,0,0,7,9
    ];

    puzzle.forEach((val, i) => {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.className = 'w-8 h-8 text-center bg-zinc-900 text-white border-none text-[0.5rem] p-0';
        if (val !== 0) {
            input.value = val;
            input.disabled = true;
            input.className += ' text-neon';
        }
        input.oninput = () => {
            if (!/^[1-9]$/.test(input.value)) input.value = '';
            window.playSound('click');
            checkWin();
        };
        grid.appendChild(input);
    });

    function checkWin() {
        const inputs = Array.from(grid.children);
        const current = inputs.map(el => parseInt(el.value) || 0);
        if (current.includes(0)) return;
        function getGroup(indices) { return indices.map(i => current[i]); }
        function valid(arr) { const s = new Set(arr); return s.size === 9 && !s.has(0); }
        for (let i = 0; i < 9; i++) {
            const row = Array.from({length:9},(_,j)=>i*9+j);
            const col = Array.from({length:9},(_,j)=>j*9+i);
            const br = Math.floor(i/3)*3, bc = (i%3)*3;
            const box = Array.from({length:3},(_,r)=>Array.from({length:3},(_,c)=>(br+r)*9+(bc+c))).flat();
            if (!valid(getGroup(row)) || !valid(getGroup(col)) || !valid(getGroup(box))) {
                inputs.forEach(el => { if (!el.disabled) el.style.borderColor = 'var(--neon2)'; });
                return;
            }
        }
        window.updateCurrentScore(100);
        window.playSound('win');
        alert('Solved! Well done!');
    }
};
