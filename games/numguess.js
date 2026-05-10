let ngTarget, ngLives, ngOver = false;

window.initNumGuess = function() {
    ngTarget = Math.floor(Math.random() * 100) + 1;
    ngLives = 10; ngOver = false;
    document.getElementById('numguess-lives').textContent = ngLives;
    document.getElementById('numguess-hint').textContent = 'GUESS A NUMBER (1–100)';
    document.getElementById('numguess-history').innerHTML = '';
    document.getElementById('numguess-input').value = '';
    document.getElementById('numguess-play-again').classList.add('hidden');
    window.updateCurrentScore(0);
};




window.submitGuess = function() {
    if (ngOver) return;
    const val = parseInt(document.getElementById('numguess-input').value);
    if (isNaN(val) || val < 1 || val > 100) return;
    ngLives--;
    document.getElementById('numguess-lives').textContent = ngLives;
    const hist = document.getElementById('numguess-history');
    const el = document.createElement('span');
    el.className = 'px-3 py-1 bg-zinc-800 rounded-lg text-xs';
    el.textContent = val;
    hist.appendChild(el);
    if (val === ngTarget) {
        ngOver = true;
        document.getElementById('numguess-hint').textContent = 'CORRECT!';
        document.getElementById('numguess-play-again').classList.remove('hidden');
        window.updateCurrentScore(ngLives * 100 + 100);
        window.playSound('win');
    } else if (ngLives <= 0) {
        ngOver = true;
        document.getElementById('numguess-hint').textContent = `GAME OVER! IT WAS ${ngTarget}`;
        document.getElementById('numguess-play-again').classList.remove('hidden');
    } else {
        document.getElementById('numguess-hint').textContent = val < ngTarget ? 'HIGHER! ' : 'LOWER! ';
        window.playSound('click');
    }
    document.getElementById('numguess-input').value = '';
};