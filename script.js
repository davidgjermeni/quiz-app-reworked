class Answer{
  constructor(text, correct){
    this.text = text;
    this.correct = correct;
  }
}


class Question{
  constructor(question, answers, image){
    this.question = question;
    this.answers = answers;
    this.image = image;
  }

  checkAnswer(index){
    return this.answers[index].correct;
  }
}

const questions = [
    new Question("How many pyramids are at the Giza plateau? <br>(Including the queens)",
    [
    new Answer("6 pyramids", false),
    new Answer("9 pyramids", true),
    new Answer("10 pyramids", false),
    new Answer("12 pyramids", false),   
    ], "/background/egypt.webp"),


    new Question("What do Greeks celebrate on October 28th?",
    [
      new Answer("Ohi <όχι> day (to Ottomans)", false),
      new Answer("Independence day 1821 (from Italy)", false),
      new Answer("Independence day 1821 (from Ottomans)", false),
      new Answer("Ohi <όχι> day (to Italy)", true),
    ], "/background/greek.webp"),


    new Question("Whats the elevation of Mount Everest?",
    [
      new Answer("8,529m", false),
      new Answer("8,243m", false),
      new Answer("8,849m", true),
      new Answer("8,950m", false),
    ], "/background/everest.webp"),



    new Question("How many planets do we have in our solar system?",
    [
      new Answer("6 planets", false),
      new Answer("8 planets", true),
      new Answer("9 planets", false),
      new Answer("10 planets", false),
    ],"/background/solar-system.webp"),
    

];





const startBtn = document.getElementById("start");
const intro = document.querySelector(".quiz-intro");
const questionForm = document.querySelector(".quiz-form");
const form = document.querySelector(".form");

startBtn.addEventListener("click", () => {
  intro.classList.add("remove"); 
  questionForm.classList.remove("remove");
  
});

const questionElement = document.getElementById("question");
const answerElement = document.getElementById("answers");
const nextBtn = document.getElementById("nextBtn");
const scoreInfo = document.getElementById("score");
const timeleft = document.getElementById("timeleft");
const start = document.getElementById("start");
const bgImage = document.getElementById("bgImage");
const bgVideo = document.getElementById("bgVideo");

let currentIndex = 0;
let score = 0;
let correctQuestions = 0;
let interval;

start.addEventListener("click", startQuiz);

function startQuiz(){
  currentIndex = 0;
  score = 0;
  correctQuestions = 0;
  nextBtn.innerHTML = "Next";
  showQuestion()
}

function showQuestion(){
  timer(7);
  resetState();
  timeleft.classList.remove("hide");
  scoreInfo.classList.remove("hide");
  if (bgVideo.style.display != "none"){ 
    bgVideo.style.zIndex = "-4";
    bgVideo.style.display = "none" ;
  }
  let currentQuestion = questions[currentIndex];
  showImage(currentQuestion);
  let questionNo = currentIndex + 1;
  questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

  currentQuestion.answers.forEach((answer, index)  => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("answersBtn");
    answerElement.appendChild(button);
    button.addEventListener("click",() => selectAnswer(index));
  });

}

function resetState(){ 
  nextBtn.classList.add("hide");
  timeleft.classList.add("hide");
  scoreInfo.classList.add("hide");
  scoreInfo.innerHTML = `Score: ${score}`;
  while(answerElement.firstChild){
    answerElement.removeChild(answerElement.firstChild);
  }

}

function selectAnswer(index){
  clearInterval(interval);
  const currentQuestion = questions[currentIndex];
  const isCorrect = currentQuestion.checkAnswer(index);
  if(isCorrect){
    answerElement.children[index].classList.add("correct");
    score += 25;
    correctQuestions++;
  }else{
    answerElement.children[index].classList.add("incorrect");
    score = Math.max(0, score - 25);
  }
  
  Array.from(answerElement.children).forEach((btn, i) => {
  if(currentQuestion.checkAnswer(i)){
    btn.classList.add("correct");
  }
  btn.disabled = true;
    });

scoreInfo.innerHTML = `Score: ${score}` 
nextBtn.style.visibility="visible";
}

function showScore(){
  resetState();
  questionElement.innerHTML = `You answered ${correctQuestions} out of ${questions.length} questions correctly. <br>Your score is ${score} out of 100.`;
  nextBtn.innerHTML = "Play  Again";
  nextBtn.style.visibility = "visible";
}

function handleNextButton(){
  currentIndex++;
  if (currentIndex < questions.length){
    showQuestion();
  }else{
    showScore();
  }
  
}

nextBtn.addEventListener("click", () => { 
  if(currentIndex < questions.length){
    handleNextButton();
  }else{
    startQuiz();
  }
});


function timer(seconds){
  clearInterval(interval);
  timeleft.innerHTML = seconds;
  let time = seconds;
  interval = setInterval(() => {
    time = Math.max(0, time - 1)
    timeleft.innerHTML = time;
  
    if (time <= 0){
      clearInterval(interval);
      currentIndex++;
      score = Math.max(0, score - 25);
      (currentIndex >= questions.length ? showScore() : showQuestion());
    }
  },1000)
}

function showImage(currentQuestion){
  const preload = new Image();
  preload.src = currentQuestion.image;
  preload.onload = () => {
    bgImage.src = preload.src;
    
  }
}
