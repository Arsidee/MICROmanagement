var questions = [
  { image: '', answer: 'E. coli' },
  { image: '', answer: 'Staphylococcus aureus' },
  { image: '', answer: 'Streptococcus' },
  { image: '', answer: 'Bacillus anthracis' },
  { image: '', answer: 'Mycobacterium tuberculosis' }
];

var current = 0;
var score = 0;
var total = 0;
var answered = false;

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
  document.getElementById('guess-input').focus();
  answered = false;
}

function submitGuess() {
  if (answered) return;

  var guess = document.getElementById('guess-input').value.trim().toLowerCase();
  var answer = questions[current].answer.toLowerCase();
  var feedback = document.getElementById('feedback');

  total++;
  answered = true;

  if (guess === answer) {
    score++;
    feedback.textContent = 'Correct!';
    feedback.className = 'correct';
  } else {
    feedback.textContent = 'Incorrect. The answer was: ' + questions[current].answer;
    feedback.className = 'incorrect';
  }

  document.getElementById('score').textContent = score;
  document.getElementById('total').textContent = total;
}

document.getElementById('submit-btn').addEventListener('click', submitGuess);

document.getElementById('guess-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') submitGuess();
});

document.getElementById('next-btn').addEventListener('click', function() {
  current = (current + 1) % questions.length;
  loadQuestion();
});

loadQuestion();
