const scrambleData = [
    {w:"JAVASCRIPT",h:"The language of the web"},
    {w:"FIREBASE",h:"Google's backend platform"},
    {w:"TAILWIND",h:"Utility-first CSS framework"},
    {w:"ARCADE",h:"A place to play games"},
    {w:"VARIABLE",h:"A container for data"},
    {w:"FUNCTION",h:"A reusable block of code"},
    {w:"BROWSER",h:"Chrome, Firefox, Safari..."},
    {w:"DATABASE",h:"Where scores are stored"}
];
let scrambleIdx = 0, scrambleTime = 30, scramblePts = 0;

window.initScramble = function() {
    scrambleIdx = 0; scramblePts = 0;
    document.getElementById('scramble-pts').textContent = '0';
    nextScrambleWord();
};

function nextScrambleWord() {
    if (scrambleIdx >= scrambleData.length) { finishScramble(); return; }
    const q = scrambleData[scrambleIdx];
    let scrambled;
    do { scrambled = q.w.split('').sort(() => Math.random() - 0.5).join(''); } while (scrambled === q.w && q.w.length > 1);
    document.getElementById('scramble-word').textContent = scrambled;
    document.getElementById('scramble-hint').textContent = `HINT: ${q.h}`;
    document.getElementById('scramble-input').value = '';
    document.getElementById('scramble-feedback').textContent = '';
    scrambleTime = 30;
    document.getElementById('scramble-timer').textContent = scrambleTime;
    if (window.scrambleInterval) clearInterval(window.scrambleInterval);
    window.scrambleInterval = setInterval(() => {
        scrambleTime--;
    document.getElementById('scramble-timer').textContent = scrambleTime;
        if (scrambleTime <= 0) { scrambleIdx++; nextScrambleWord(); }
    }, 1000);
}

window.checkScramble = function() {
    if (scrambleIdx >= scrambleData.length) return;
    const val = document.getElementById('scramble-input').value.trim().toUpperCase();
    if (val === scrambleData[scrambleIdx].w) {
        scramblePts += 100 + scrambleTime * 5;
        document.getElementById('scramble-pts').textContent = scramblePts;
        document.getElementById('scramble-feedback').textContent = 'CORRECT! ';
        document.getElementById('scramble-feedback').style.color = '#00ff9d';
        window.playSound('match');
        scrambleIdx++;
        setTimeout(nextScrambleWord, 1000);
    } else {
        document.getElementById('scramble-feedback').textContent = 'TRY AGAIN ';
     document.getElementById('scramble-feedback').style.color = '#f43f5e';
        window.playSound('click');
    }
};

function finishScramble() {
    clearInterval(window.scrambleInterval);
    document.getElementById('scramble-word').textContent = 'DONE!';
    document.getElementById('scramble-hint').textContent = `FINAL SCORE: ${scramblePts}`;
    window.updateCurrentScore(scramblePts);
    window.playSound('win');
}