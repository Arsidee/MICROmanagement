var allQuestions = [
  { image: 'Images/e.coli.jpg',          answer: 'E. coli' },
  { image: 'Images/staphy-aureus.jpg',   answer: 'Staphylococcus aureus' },
  { image: 'Images/bacillus.jpeg',       answer: 'Bacillus anthracis' },
  { image: 'Images/strep.jpeg',          answer: 'Streptococcus' },
  { image: 'Images/mycobacterium.jpeg',  answer: 'Mycobacterium tuberculosis' }
];

var TIMER_SECONDS = 15;

function shuffle(arr) {
  var copy = arr.slice();
  for (var i = copy.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

var questions, current, score, streak, answered, results, timerInterval, timeLeft;

function startGame() {
  questions = shuffle(allQuestions);
  current   = 0;
  score     = 0;
  streak    = 0;
  answered  = false;
  results   = [];

  document.getElementById('game-screen').style.display = 'block';
  document.getElementById('complete-screen').style.display = 'none';
  document.getElementById('next-btn').style.display = 'none';

  loadQuestion();
}

function loadQuestion() {
  var q = questions[current];
  var img = document.getElementById('micro-image');
  var placeholder = document.getElementById('image-placeholder');

  if (q.image) {
    img.src = q.image;
    img.style.display = 'block';
    placeholder.style.display = 'none';
  } else {
    img.style.display = 'none';
    placeholder.style.display = 'block';
  }

  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = '';
  document.getElementById('question-num').textContent = current + 1;
  document.getElementById('next-btn').style.display = 'none';
  answered = false;

  buildChoices();
  startTimer();
  updateStreakDisplay();
}

function buildChoices() {
  var correct = questions[current].answer;

  var wrongOptions = allQuestions
    .map(function(q) { return q.answer; })
    .filter(function(a) { return a !== correct; });

  var options = shuffle([correct].concat(shuffle(wrongOptions).slice(0, 3)));

  var container = document.getElementById('choices');
  container.innerHTML = '';

  options.forEach(function(option) {
    var btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = option;
    btn.addEventListener('click', function() {
      submitGuess(option);
    });
    container.appendChild(btn);
  });
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = TIMER_SECONDS;

  var display = document.getElementById('timer-display');
  display.textContent = timeLeft;
  display.className = '';

  timerInterval = setInterval(function() {
    timeLeft--;
    display.textContent = timeLeft;
    if (timeLeft <= 5) {
      display.className = 'timer-low';
    }
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      if (!answered) timeExpired();
    }
  }, 1000);
}

function timeExpired() {
  answered = true;
  streak = 0;
  updateStreakDisplay();

  var feedback = document.getElementById('feedback');
  feedback.textContent = "Time's up! The answer was: " + questions[current].answer;
  feedback.className = 'incorrect';

  highlightChoices(null);
  results.push({ answer: questions[current].answer, correct: false });
  showNextBtn();
}

function submitGuess(chosen) {
  if (answered) return;
  clearInterval(timerInterval);
  answered = true;

  var correct = questions[current].answer;
  var feedback = document.getElementById('feedback');
  var isCorrect = chosen === correct;

  if (isCorrect) {
    score++;
    streak++;
    feedback.textContent = 'Correct!';
    feedback.className = 'correct';
  } else {
    streak = 0;
    feedback.textContent = 'Incorrect. The answer was: ' + correct;
    feedback.className = 'incorrect';
  }

  updateStreakDisplay();
  highlightChoices(chosen);
  results.push({ answer: correct, correct: isCorrect });
  showNextBtn();
}

function highlightChoices(chosen) {
  var correct = questions[current].answer;
  var buttons = document.querySelectorAll('.choice-btn');
  buttons.forEach(function(btn) {
    btn.disabled = true;
    if (btn.textContent === correct) {
      btn.classList.add('choice-correct');
    } else if (btn.textContent === chosen) {
      btn.classList.add('choice-wrong');
    }
  });
}

function showNextBtn() {
  var nextBtn = document.getElementById('next-btn');
  nextBtn.style.display = 'inline-block';
  nextBtn.textContent = current === questions.length - 1 ? 'See Results' : 'Next';
}

function updateStreakDisplay() {
  var el = document.getElementById('streak-display');
  el.textContent = streak >= 2 ? 'Streak: ' + streak : '';
}

function showComplete() {
  clearInterval(timerInterval);
  document.getElementById('game-screen').style.display = 'none';
  document.getElementById('complete-screen').style.display = 'block';

  document.getElementById('final-score').textContent =
    'You got ' + score + ' out of ' + questions.length + ' correct!';

  var missedList    = document.getElementById('missed-list');
  var correctList   = document.getElementById('correct-list');
  var missedSection = document.getElementById('missed-section');

  missedList.innerHTML  = '';
  correctList.innerHTML = '';

  var missedCount = 0;
  for (var i = 0; i < results.length; i++) {
    var li = document.createElement('li');
    li.textContent = results[i].answer;
    if (results[i].correct) {
      correctList.appendChild(li);
    } else {
      missedList.appendChild(li);
      missedCount++;
    }
  }

  missedSection.style.display = missedCount > 0 ? 'block' : 'none';
}

document.getElementById('next-btn').addEventListener('click', function() {
  if (!answered) return;
  if (current === questions.length - 1) {
    showComplete();
  } else {
    current++;
    loadQuestion();
  }
});

document.getElementById('reset-btn').addEventListener('click', startGame);

startGame();
