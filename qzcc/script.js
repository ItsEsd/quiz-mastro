"use strict";
function getURLParameter(url, parameter) {
  const urlSearchParams = new URLSearchParams(new URL(url).search);
  return urlSearchParams.get(parameter);
}

function getCurrentURL() {
  return window.location.href;
}

const currentURL = getCurrentURL();
const parameters = {};
const mnurg = "https://script.google.com/macros/s/";
const urlSearchParams = new URLSearchParams(new URL(currentURL).search);
for (const [key, value] of urlSearchParams) {
  parameters[key] = value;
}

const xhr = new XMLHttpRequest();
const mqurl =
  mnurg +
  "AKfycbyvClzLuZi9-TPGNaAzw6rAPIhSKg3TahZ8rUaUSI1imbDZnLpNmmnudrYGfb_ehwnB/exec";
const queryString = Object.entries(parameters)
  .map(([key, value]) => `${key}=${value}`)
  .join("&");

xhr.open(
  "GET",
  mqurl + "?callback=ctrlres&" + queryString + "&action=rdqz",
  true
);

xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    const responseData = xhr.responseText;

    const regex = /ctrlres\((.*?)\)/;
    const match = responseData.match(regex);

    if (match) {
      const jsonData = match[1];
      const parsedData = JSON.parse(jsonData);
      console.log(parsedData);
      const firstRecord = parsedData.records[0];
      const QId = firstRecord.QId;
      const QPass = firstRecord.QPass;
      const quizData = JSON.parse(firstRecord.QZdata);
      const questions = JSON.parse(firstRecord.QSdata);
      const USER = firstRecord.USER;
      const QState = firstRecord.QState;

      console.log("QId:", QId);
      console.log("QPass:", QPass);
      console.log("QZdata:", quizData);
      console.log("QSdata:", questions);
      console.log("USER:", USER);
      console.log("QState:", QState);

      let currentQuestion = 1;

      const userAnswers = [];
      let selectedButtonInfo = null;

      function createQuiz() {
        const quizContainer = document.getElementById("quiz-container");
        quizContainer.innerHTML = "";

        const quizInfoDiv = document.createElement("div");
        quizInfoDiv.classList.add("quiz-info");
        quizInfoDiv.innerHTML = `<p>${quizData.quizTitle}<span>${quizData.quizId} | ${quizData.creationDate}</span></p>`;
        quizInfoDiv.classList.add("qzinfo");
        quizContainer.appendChild(quizInfoDiv);

        const questionDiv = document.createElement("div");
        questionDiv.innerHTML = `<p><span style='font-size:16px;'>Question:</span><br><br>${
          questions[currentQuestion - 1].questionStatement
        }</p>`;
        quizContainer.appendChild(questionDiv);

        const optionsDiv = document.createElement("div");
        const options = questions[currentQuestion - 1].options;
        for (const option in options) {
          const optionButton = document.createElement("button");
          optionButton.textContent = options[option];
          optionButton.classList.add("option-button");

          if (
            selectedButtonInfo &&
            selectedButtonInfo.button.textContent === options[option]
          ) {
            optionButton.style.cssText = selectedButtonInfo.css;
            optionButton.classList.add("selected");
          }

          optionButton.addEventListener("click", () =>
            handleOptionClick(option)
          );
          optionsDiv.appendChild(optionButton);
        }
        optionsDiv.classList.add("optndv");
        quizContainer.appendChild(optionsDiv);
        document.getElementById("prevcont").style.display = "none";
        document.getElementById("submit-button").style.display = "block";
        const navButtonsDiv = document.createElement("div");
        const prevButton = document.createElement("button");
        const nextButton = document.createElement("button");

        prevButton.textContent = "<< Previous";
        nextButton.textContent = "Next >>";

        prevButton.classList.add("nav-button");
        nextButton.classList.add("nav-button");

        prevButton.addEventListener("click", () => navigateQuestion(-1));
        nextButton.addEventListener("click", () => navigateQuestion(1));

        navButtonsDiv.appendChild(prevButton);
        navButtonsDiv.appendChild(nextButton);

        quizContainer.appendChild(navButtonsDiv);
      }

      function handleOptionClick(selectedOption) {
        userAnswers[currentQuestion - 1] = selectedOption;

        const optionButtons = document.querySelectorAll(".option-button");
        optionButtons.forEach((button) => button.classList.remove("selected"));
        event.target.classList.add("selected");

        selectedButtonInfo = {
          button: event.target,
          css: event.target.style.cssText,
        };
      }

      function navigateQuestion(direction) {
        if (selectedButtonInfo) {
          const optionButtons = document.querySelectorAll(".option-button");
          optionButtons.forEach((button) => {
            if (button.textContent === selectedButtonInfo.button.textContent) {
              selectedButtonInfo.css = button.style.cssText;
            }
          });
        }

        currentQuestion += direction;

        if (currentQuestion < 1) {
          currentQuestion = 1;
        } else if (currentQuestion > questions.length) {
          currentQuestion = questions.length;
        }
        createQuiz();
      }

      function submitQuiz() {
        let correctCount = 0;

        for (let i = 0; i < questions.length; i++) {
          const userAnswer = userAnswers[i];
          const correctAnswer = questions[i].answer;

          if (userAnswer === correctAnswer) {
            correctCount++;
          }
        }

        const resultMessage = `You got ${correctCount} out of ${questions.length} questions correct.`;
        alert(resultMessage);
      }

      createQuiz();

      document
        .getElementById("submit-button")
        .addEventListener("click", submitQuiz);
    }
  } else if (xhr.readyState === 4 && xhr.status !== 200) {
    console.error("Error: Unable to fetch data");
  }
};

xhr.send();

document.addEventListener("DOMContentLoaded", function () {
  const createButton = document.getElementById("crtqz");
  const mainContainer = document.getElementById("maincon");

  createButton.addEventListener("click", function () {
    const iframeContainer = document.createElement("div");
    iframeContainer.style.width = "100%";
    iframeContainer.style.height = "98vh";
    iframeContainer.style.position = "fixed";
    iframeContainer.style.top = "0";
    iframeContainer.style.left = "0";
    iframeContainer.style.zIndex = "9999";
    iframeContainer.id = "iframeContainer";
    const iframe = document.createElement("iframe");
    iframe.src = "https://mastrowall.com/quiz-editor/";
    iframe.style.width = "100%";
    iframe.style.height = "95.5vh";
    iframe.style.border = "none";

    const closeButton = document.createElement("button");
    closeButton.textContent = "Reset and Close";
    closeButton.style.position = "fixed";
    closeButton.style.top = "97.5vh";
    closeButton.style.left = "50%";
    closeButton.style.transform = "translate(-50%, -50%)";
    closeButton.style.width = "100%";
    closeButton.style.maxWidth = "701px";
    closeButton.style.cursor = "pointer";
    closeButton.style.padding = "10px";
    closeButton.style.zIndex = "9999";
    closeButton.style.border = "0px";
    closeButton.id = "closeButtonfrm";
    iframeContainer.appendChild(iframe);
    iframeContainer.appendChild(closeButton);
    mainContainer.appendChild(iframeContainer);
    closeButton.addEventListener("click", function () {
      mainContainer.removeChild(iframeContainer);
    });
  });
});
