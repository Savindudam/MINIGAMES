const quizQuestions = [
    {q:"What does DOM stand for?",a:["Document Object Model","Data Object Manager","Display Order Map","Dynamic Output Module"],correct:0},
    {q:"Which method adds an element to the END of an array?",a:["push()","pop()","shift()","unshift()"],correct:0},
    {q:"CSS stands for...",a:["Creative Style Sheets","Cascading Style Sheets","Computer Style System","Colorful Styling Syntax"],correct:1},
    {q:"Which event fires when a user clicks an element?",a:["onhover","onclick","onload","onchange"],correct:1},
    {q:"How do you declare a constant in modern JS?",a:["var x = 10","let x = 10","const x = 10","constant x = 10"],correct:2},
    {q:"localStorage is used for...",a:["Temporary session data","Persistent client-side storage","Server-side database","API caching only"],correct:1},
    {q:"Which is NOT a JavaScript data type?",a:["string","boolean","float","object"],correct:2},
    {q:"The 'this' keyword refers to...",a:["The global window","The object that called the function","The previous variable","A random value"],correct:1},
    {q:"What does JSON.parse() do?",a:["Converts JSON string to object","Converts object to string","Formats JSON","Validates JSON"],correct:0},
    {q:"Event delegation is useful because...",a:["Less memory","Faster code","Allows dynamic elements","All of the above"],correct:3}
];






let quizIndex = 0, quizScore = 0, quizSeconds = 0;

window.initQuizGame = function() {
    quizIndex = 0; quizScore = 0; quizSeconds = 0;
    if (window.quizTimerInterval) clearInterval(window.quizTimerInterval);
    window.quizTimerInterval = setInterval(() => {
        quizSeconds++;
        document.getElementById('quiz-timer').textContent =
            `${String(Math.floor(quizSeconds / 60)).padStart(2, '0')}:${String(quizSeconds % 60).padStart(2, '0')}`;
    }, 1000);
    loadQuizQuestion();
    window.updateCurrentScore(0);
};

function loadQuizQuestion() {
    const q = quizQuestions[quizIndex];
    document.getElementById('quiz-current').textContent = quizIndex + 1;
    document.getElementById('quiz-score-display').innerHTML = `SCORE: <span class="text-[#00ff9d]">${quizScore}</span>`;
    document.getElementById('quiz-question').textContent = q.q;
    document.getElementById('quiz-options').innerHTML = q.a.map((opt, i) => `
        <button onclick="selectQuizAnswer(${i})"
                style="width:100%;text-align:left;padding:14px 18px;background:var(--bg3);border:1px solid var(--border);color:var(--text);font-family:var(--font-mono);font-size:0.75rem;cursor:pointer;margin-bottom:8px;transition:border-color 0.15s;"
                onmouseenter="if(!this.disabled)this.style.borderColor='var(--neon)'"
                onmouseleave="if(!this.disabled)this.style.borderColor='var(--border)'"
                class="quiz-opt">
            ${String.fromCharCode(65 + i)}. ${opt}
        </button>`).join('');
    document.getElementById('quiz-next-btn').classList.add('hidden');
}

window.selectQuizAnswer = function(choice) {
    const correct = quizQuestions[quizIndex].correct;
    document.querySelectorAll('.quiz-opt').forEach((btn, i) => {
        btn.disabled = true;
        if (i === correct) { btn.style.background = '#00ff9d'; btn.style.color = '#000'; }
        if (i === choice && i !== correct) btn.style.background = '#f43f5e';
    });
    if (choice === correct) { quizScore += 100; window.playSound('match'); }
    else window.playSound('click');
    document.getElementById('quiz-score-display').innerHTML = `SCORE: <span class="text-[#00ff9d]">${quizScore}</span>`;
    document.getElementById('quiz-next-btn').classList.remove('hidden');
};

window.nextQuizQuestion = function() {
    quizIndex++;
    if (quizIndex >= quizQuestions.length) finishQuiz();
    else loadQuizQuestion();
};

function finishQuiz() {
    clearInterval(window.quizTimerInterval);
    const final = quizScore + Math.max(0, 1000 - quizSeconds * 5);
    document.getElementById('quiz-question').innerHTML = `
        <div class="text-center">
            <div class="text-7xl mb-4"></div>
            <div class="text-3xl font-bold">QUIZ COMPLETE!</div>
            <div class="text-6xl mt-6 text-[#00ff9d]">${final} PTS</div>
            <div class="text-sm mt-4 text-zinc-400">Time: ${document.getElementById('quiz-timer').textContent}</div>
            <button onclick="initQuizGame()" class="game-btn" style="margin-top:32px;padding:14px 40px;font-size:0.85rem;">PLAY AGAIN</button>
        </div>`;
    document.getElementById('quiz-options').innerHTML = '';
    document.getElementById('quiz-next-btn').classList.add('hidden');
    window.updateCurrentScore(final);
    window.playSound('win');
}