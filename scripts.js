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
    }
];

const apiUrl = 'http://localhost:3000/quiz-data';

startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        setNextQuestion();
    } else {
        showResults();
    }
});

restartBtn.addEventListener('click', startQuiz);

async function startQuiz() {
    startBtn.classList.add('hidden');
    resultContainer.classList.add('hidden');
    questionContainer.classList.remove('hidden');
    score = 0;
    currentQuestionIndex = 0;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log("Quiz Data:", data); // Check structure in console
        quizData = data.questions;  // ✅ This is correct
 // ✅ Directly assign the fetched array
 // Accessing the questions array
        if (quizData && quizData.length > 0) {
            const currentQuestion = quizData[currentQuestionIndex];
        }        
    } catch (error) {
        console.warn('Error fetching quiz data. Using fallback questions.');
        quizData = fallbackQuestions;
    }

    setNextQuestion();
}


function setNextQuestion() {
    resetState();
    console.log("Quiz Data:", quizData); 
    console.log("Questions:", quizData);  // ✅ Correct log

    if (quizData && quizData.length > 0) {  
        const currentQuestion = quizData[currentQuestionIndex];
        console.log("Current Question:", currentQuestion);  // Debug
        console.log("Options:", currentQuestion.options);   // Debug options

        if (currentQuestion && currentQuestion.options && currentQuestion.options.length > 0) {
            showQuestion(currentQuestion);
            startTimer();
        } else {
            console.warn("No options found for this question:", currentQuestion);
            questionElement.innerText = "No answer options available.";
        }
    } else {
        console.error("No questions found in quiz data.");
        questionElement.innerText = "No questions available.";
    }
}




async function fetchQuizData() {
    try {
        const response = await fetch('https://your-api-endpoint.com/quiz');
        const data = await response.json();
        console.log("Fetched Data:", data);  // Debugging

        quizData = data;
        startQuiz();  // Ensure this is called after data is assigned

    } catch (error) {
        console.error("Error fetching quiz data:", error);
    }
}



function showQuestion(question) {
    questionElement.innerText = question.description || "Untitled Question";

    if (question.options && question.options.length > 0) {
        question.options.forEach((option) => {
            const button = document.createElement('button');
            button.innerText = option.description || "No Answer Provided";
            button.classList.add('btn');

            // ✅ Add this line to set the correct attribute
            button.dataset.correct = option.is_correct; 

            button.addEventListener('click', selectAnswer);
            answerButtonsElement.appendChild(button);
        });
    } else {
        console.warn("No options available for question ID:", question.id);
        questionElement.innerText = "No answer options available.";
    }
}







function resetState() {
    clearInterval(timer);
    timerElement.innerText = 15;
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
    const correct = selectedButton.dataset.correct === "true";

    if (correct) {
        score += timeLeft;
    }
    Array.from(answerButtonsElement.children).forEach(button => {
        button.disabled = true;
        button.classList.add(button.dataset.correct === "true" ? 'correct' : 'incorrect');
    });
    nextBtn.classList.remove('hidden');
}

function showResults() {
    questionContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    scoreElement.innerText = `You scored ${score} points!`;
    badgeElement.innerText = score >= 45 ? "🏆 Quiz Master!" : "👍 Keep Practicing!";
}
