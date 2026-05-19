var allQuestions = [
  { image: 'Images/e.coli.jpg',          answer: 'E. coli' },
  { image: 'Images/staphy-aureus.jpg',   answer: 'Staphylococcus aureus' },
  { image: 'Images/bacillus.jpeg',       answer: 'Bacillus anthracis' },
  { image: 'Images/strep.jpeg',          answer: 'Streptococcus' },
  { image: 'Images/mycobacterium.jpeg',  answer: 'Mycobacterium tuberculosis' }
];

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

var questions, current, score, answered, results;

function startGame() {
  questions = shuffle(allQuestions);
  current   = 0;
  score     = 0;
  answered  = false;
  results   = [];

  document.getElementById('game-screen').style.display = 'block';
  document.getElementById('complete-screen').style.display = 'none';
  document.getElementById('next-btn').textContent = 'Next';

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

  document.getElementById('guess-input').value = '';
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = '';
  document.getElementById('question-num').textContent = current + 1;
  document.getElementById('guess-input').focus();
  answered = false;

  var isLast = current === questions.length - 1;
  document.getElementById('next-btn').textContent = isLast ? 'See Results' : 'Next';
}

function submitGuess() {
  if (answered) return;

  var guess    = document.getElementById('guess-input').value.trim().toLowerCase();
  var answer   = questions[current].answer.toLowerCase();
  var feedback = document.getElementById('feedback');

  answered = true;

  var correct = guess === answer;
  if (correct) {
    score++;
    feedback.textContent = 'Correct!';
    feedback.className = 'correct';
  } else {
    feedback.textContent = 'Incorrect. The answer was: ' + questions[current].answer;
    feedback.className = 'incorrect';
  }

  results.push({ answer: questions[current].answer, correct: correct });
}

function showComplete() {
  document.getElementById('game-screen').style.display = 'none';
  document.getElementById('complete-screen').style.display = 'block';

  document.getElementById('final-score').textContent = 'You got ' + score + ' out of ' + questions.length + ' correct!';

  var missedList   = document.getElementById('missed-list');
  var correctList  = document.getElementById('correct-list');
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

document.getElementById('submit-btn').addEventListener('click', submitGuess);

document.getElementById('guess-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') submitGuess();
});

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
