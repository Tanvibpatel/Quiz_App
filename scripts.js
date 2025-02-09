const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const questionContainer = document.getElementById('quiz-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const resultContainer = document.getElementById('result-container');
const scoreElement = document.getElementById('score');
const badgeElement = document.getElementById('badge');
const timerElement = document.getElementById('time-remaining');

let currentQuestionIndex, score, quizData, timer, timeLeft;

const fallbackQuestions = [
    {
      question: "What is the capital of France?",
      answers: [
        { text: "Paris", correct: true },
        { text: "London", correct: false },
        { text: "Berlin", correct: false },
        { text: "Madrid", correct: false }
      ]
    },
    {
      question: "Which planet is known as the Red Planet?",
      answers: [
        { text: "Mars", correct: true },
        { text: "Earth", correct: false },
        { text: "Venus", correct: false },
        { text: "Jupiter", correct: false }
      ]
    },
    {
        question: "Golden Temple is situated in",
        answers: [
          { text: "New Delhi", correct: false },
          { text: "Agra", correct: false },
          { text: "Amritsar", correct: true },
          { text: "Mumbai", correct: false }
        ]
      }
  ];


  async function startQuiz() {
    startBtn.classList.add('hidden');
    resultContainer.classList.add('hidden');
    questionContainer.classList.remove('hidden');
    score = 0;
    currentQuestionIndex = 0;
  
    try {
      const response = await fetch('https://api.jsonserve.com/Uw5CrX');
      quizData = await response.json();
    } catch (error) {
      console.warn('Error fetching quiz data. Using fallback questions.');
      quizData = fallbackQuestions;
    }
    setNextQuestion();
  }

startBtn.addEventListener('click', startQuiz);


nextBtn.addEventListener('click', () => {
  currentQuestionIndex++;
  setNextQuestion();
});
restartBtn.addEventListener('click', startQuiz);

function setNextQuestion() {
    resetState();
    if (currentQuestionIndex < quizData.length) {
      showQuestion(quizData[currentQuestionIndex]);
      startTimer();
    } else {
      showResults();
    }
  }

  function showQuestion(questionData) {
    questionElement.innerText = questionData.question;
    questionData.answers.forEach(answer => {
      const button = document.createElement('button');
      button.innerText = answer.text;
      button.classList.add('btn');
      if (answer.correct) {
        button.dataset.correct = answer.correct;
      }
      button.addEventListener('click', selectAnswer);
      answerButtonsElement.appendChild(button);
    });
  }
  
  function resetState() {
    clearInterval(timer);
    timerElement.innerText = 15;
    questionElement.classList.remove('hidden');
    nextBtn.classList.add('hidden');
    while (answerButtonsElement.firstChild) {
      answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
  }
  
  function startTimer() {
    timeLeft = 15;
    timer = setInterval(() => {
      timeLeft--;
      timerElement.innerText = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timer);
        nextBtn.classList.remove('hidden');
        Array.from(answerButtonsElement.children).forEach(button => button.disabled = true);
      }
    }, 1000);
  }
  
  function selectAnswer(e) {
    clearInterval(timer);
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    if (correct) {
      score += timeLeft; // Bonus points for quick answers
    }
    Array.from(answerButtonsElement.children).forEach(button => {
      button.disabled = true;
      if (button.dataset.correct) {
        button.classList.add('correct');
      } else {
        button.classList.add('incorrect');
      }
    });
    nextBtn.classList.remove('hidden');
  }
  
  function showResults() {
    questionElement.classList.add('hidden');
    questionContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    scoreElement.innerText = `You scored ${score} points!`;
  
    if (score >= 30) {
      badgeElement.innerText = "🏆 Quiz Master!";
    } else if (score >= 20) {
      badgeElement.innerText = "🎯 Sharp Thinker!";
    } else {
      badgeElement.innerText = "👍 Keep Practicing!";
    }
  }