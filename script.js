var questions = [
  { image: 'images/e.coli.jpg',          answer: 'E. coli' },
  { image: 'images/staphy-aureus.jpg',  answer: 'Staphylococcus aureus' },
  { image: 'images/bacillus.jpeg',       answer: 'Bacillus anthracis' },
  { image: 'images/strep.jpeg',          answer: 'Streptococcus' },
  { image: 'images/mycobacterium.jpeg',  answer: 'Mycobacterium tuberculosis' }
];

function shuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

shuffle(questions);

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
