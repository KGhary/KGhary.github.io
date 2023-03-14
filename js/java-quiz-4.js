// select Elements

let countSpan = document.querySelector(".count span");
let bulletsSpans = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown")


// set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let questionsCount = questionsObject.length;


      // creat Bullets + set Questions Count 
      createBullets(questionsCount);

      // Add Question Data
      addQuestionData(questionsObject[currentIndex], questionsCount);

      // Start Countdown
      countdown(120, questionsCount);

      // Click On Submit
      submitButton.onclick = () => {

        // Get Right Answer
        let theRightAnswer = questionsObject[currentIndex].right_answer;

        // Icrease Index
        currentIndex++;

        // Check The Answer
        checkAnswer(theRightAnswer, questionsCount);

        // wait 3 seconds and then switch to next question
        setTimeout(() => {
          // Remove Previous Question
          quizArea.innerHTML = "";
          answersArea.innerHTML = "";

          // Add Question Data
          addQuestionData(questionsObject[currentIndex], questionsCount);

          // Handel Bullets Class
          handleBullets();

          // Start Countdown
          clearInterval(countdownInterval);
          countdown(120, questionsCount);

          // Show Result
          showResults(questionsCount);
        }, 3000);
      };

    }
  };

  myRequest.open("GET", "html4-question.json", true);
  myRequest.send();
}

getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  // create span
  for (let i = 0; i < num; i++) {
    // create Bullet
    let theBullet = document.createElement("span");

    // check if its first span
    if (i === 0) {
      theBullet.className = "on";
    }

    // append Bullets to Main Bullet countainer
    bulletsSpanContainer.appendChild(theBullet);
  }
}

let choosedAnswerElement = null;
function addQuestionData(obj, count) {

  if (currentIndex < count) {
    // create H2 Question Title
    let questionTitle = document.createElement("h2");

    // create H2 Question Text
    let questionText = document.createTextNode(obj['title']);

    // Append Text To H2
    questionTitle.appendChild(questionText);

    // Append The H2 To 
    quizArea.appendChild(questionTitle);

    // Create The Answers
    for (let i = 1; i <= 3; i++) {

      // Create Main Answer Div
      let mainDiv = document.createElement("div");

      // Add Class To Main Div
      mainDiv.className = 'answer';

      // Create Radio Input
      let radioInput = document.createElement("input");

      // Add Type + Name + Id + Data-Attribute
      radioInput.name = 'question';
      radioInput.type = 'radio';
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      radioInput.addEventListener('click', function () {
        if (!this.disabled) {
          choosedAnswerElement = mainDiv;
        }
      });


      // Make First Option Selected
      if (i === 1) {
        radioInput.checked = true;
        choosedAnswerElement = mainDiv;
      }


      // create Label
      let theLabel = document.createElement("label");

      // Add For Attribute
      theLabel.htmlFor = `answer_${i}`;

      // Create Lable Text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);

      // Add The Text To Lable
      theLabel.appendChild(theLabelText);

      // Add Input + Lable To Main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // Append All Divs To Answers Area
      answersArea.appendChild(mainDiv);

    }

  }

}

function checkAnswer(rAnswer, count) {

  let answers = document.getElementsByName("question");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {

    if (answers[i].checked) {

      theChoosenAnswer = answers[i].dataset.answer;

    }

  }



  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
    console.log("Good Answer");
    choosedAnswerElement?.classList.add('right-answer');
  } else {
    choosedAnswerElement?.classList.add('wrong-answer');
  }
}

function handleBullets() {
  let bulletsSpan = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpan);
  arrayOfSpans.forEach((span, index) => {

    if (currentIndex === index) {

      span.className = "on";

    }

  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bulletsSpans.remove();

    if (rightAnswers > 2 && rightAnswers < count) {
      theResults = `<div class="good">عدد الاجابات الصحيحه , ${rightAnswers} من ${count}<div class="good-img" ></div></div>`;
    }
    else if (rightAnswers === count) {
      theResults = `<div class="perfect">عدد الاجابات الصحيحه ,${rightAnswers} من ${count}<div class="perfect-img" ></div></div>`;
    }
    else {
      theResults = `<div class="bad">عدد الاجابات الصحيحه ,${rightAnswers} من ${count} حاول مره اخري : <div class="bad-img" ></div></div>`;
    }

    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "20px";
    resultsContainer.style.backgroundColor = "silver";
    resultsContainer.style.marginTop = "20px";
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {

      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();

      }

    }, 1000);
  }
}