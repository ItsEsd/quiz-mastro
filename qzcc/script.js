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

// Specify the required parameters you are checking for
const requiredParameters = ["qid", "v"];

// Check if all required parameters are present
const hasRequiredParameters = requiredParameters.every((param) =>
  urlSearchParams.has(param)
);

if (hasRequiredParameters) {
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
        const firstRecord = parsedData.records[0];
        const QId = firstRecord.QId;
        const QPass = firstRecord.QPass;
        const quizData = JSON.parse(atob(firstRecord.QZdata));
        const questions = JSON.parse(atob(firstRecord.QSdata));
        const USER = firstRecord.USER;
        const QState = firstRecord.QState;

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
          optionButtons.forEach((button) =>
            button.classList.remove("selected")
          );
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
              if (
                button.textContent === selectedButtonInfo.button.textContent
              ) {
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
      alert("Error: Unable to fetch data");
    }
  };

  xhr.send();
} else {
  getqzdt();
}

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
function getqzdt() {
  document.getElementById(
    "prevcont"
  ).innerHTML = `<h3 style="margin-top: 200px">Loading...</h3>`;
  var murlg = "https://script.google.com/macros/s/";
  var curlg =
    murlg +
    "AKfycbxuYY8en9hfB2z6koBQRDQwsMPlU9n6lFUYUoB_cMyVat_OhdvsCHlvlSvSw_U2ScfX/exec" +
    "?callback=ctrlqzadt&domain=mastrowall.com&action=rdqzdt";

  var request = jQuery.ajax({
    crossDomain: true,
    url: curlg,
    method: "GET",
    dataType: "jsonp",
  });
}

$("#rfshqzdt").click(function () {
  getqzdt();
});

function ctrlqzadt(e) {
  var res = e.records;
  var len = res.length;
  const divElement = document.getElementById("prevcont");
  divElement.innerHTML = "";

  for (var k = len - 1; k >= 1; k--) {
    var qzstElement = document.createElement("div");
    qzstElement.className = "qzaldt";

    if (res[k].QState === "Private") {
      qzstElement.style.background = "#b1b1b1";
    } else {
      qzstElement.style.background = "#ffba59";
    }

    qzstElement.innerHTML = `<div onclick="opnqznw(this)">
      <p class="qztt">${JSON.parse(atob(res[k].QZdata)).quizTitle}</p>
      <p class="qzid" style="display:none;">${res[k].QId}</p>
      <p class="qzps" style="display:none;">${res[k].QPass}</p>
      <p class="qzst">${res[k].QState}</p>
      <p class="qzdt">Date: ${
        JSON.parse(atob(res[k].QZdata)).creationDate
      }</p></div>
    `;
    divElement.appendChild(qzstElement);
  }
  divElement.innerHTML += `<button id="rfshqzdt" onclick="getqzdt()">Refresh</button>`;
}

function opnqznw(element) {
  var qd = element.querySelector(".qzid").innerText;
  var qp = element.querySelector(".qzps").innerText;
  var chkpv = element.querySelector(".qzst").innerText;
  if (chkpv != "Public") {
    if (document.getElementById("passDiv")) {
      document.getElementById("passDiv").remove();
    }
    var passDiv = document.createElement("div");
    passDiv.id = "passDiv";
    passDiv.innerHTML = `
   <div><label for="quizPassword">Enter Quiz Pass:</label>
   <input type="text" id="quizPassword" autocomplete="off"/>
   <button onclick="checkPassword('${qp}')" class="pvtqzps">Go</button>
   <button onclick="closePasswordDiv()" class="pvtqzcls">Close</button></div>
 `;
    document.body.appendChild(passDiv);
  } else {
    var link = "https://quiz.mastrowall.com?qid=" + qd + "&v=" + qp;
    window.open(link, "_blank");
  }
}

function checkPassword(correctPassword) {
  var enteredPassword = document.getElementById("quizPassword").value;

  if (btoa(enteredPassword) === correctPassword) {
    var qd = document.querySelector(".qzid").innerText;
    var qp = document.querySelector(".qzps").innerText;
    var link = "https://quiz.mastrowall.com?qid=" + qd + "&v=" + qp;
    window.open(link, "_blank");
    closePasswordDiv();
  } else {
    alert("Incorrect password. Try again.");
  }
}

function closePasswordDiv() {
  document.getElementById("passDiv").remove();
}
