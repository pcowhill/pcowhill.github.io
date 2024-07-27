import { recordings } from "./recordings.js";

let guesses = [
  document.getElementById("firstGuess"),
  document.getElementById("secondGuess"),
  document.getElementById("thirdGuess"),
  document.getElementById("fourthGuess"),
  document.getElementById("fifthGuess"),
  document.getElementById("sixthGuess")
];

let audioSelection = document.getElementById("audioSelection");

let inputGuess = document.getElementById("inputGuess");
let guessButton = document.getElementById("guessButton");
let instrumentsList = document.getElementById("instrumentsList");
let feedback = document.getElementById("feedback");

let correctAnswer = "accordion";
let guessNumber = 0;
let hasFinished = false;


function setup() {
  let randomSelection = Math.floor(Math.random() * recordings.length);
  correctAnswer = recordings[randomSelection][0];
  let correctRecording = recordings[randomSelection][1];
  audioSelection.innerHTML = '<audio controls><source src="' + correctRecording + '"></audio>';
  let validInstrumentsList = [];
  for (let i = 0; i < recordings.length; i++) {
    if (!validInstrumentsList.includes(recordings[i][0])) {
      validInstrumentsList.push(recordings[i][0].toUpperCase());
    }
  }
  validInstrumentsList.sort();
  instrumentsList.innerHTML = "";
  for (let i = 0; i < validInstrumentsList.length; i++) {
    instrumentsList.innerHTML = instrumentsList.innerHTML + '<option value="' + validInstrumentsList[i] + '"></option>';
  }
}


setup();


function processGuess() {
  let inputValue = inputGuess.value;
  inputGuess.value = "";

  if (hasFinished) {
    return;
  }

  guesses[guessNumber].innerText = inputValue.toUpperCase();

  if (correctAnswer.toLowerCase() === inputValue.toLowerCase()) {
    feedback.innerText = "You WIN!!!";
    hasFinished = true;
    guesses[guessNumber].innerHTML = "<mark>" + guesses[guessNumber].innerText + "</mark>";
  }
  else {
    feedback.innerText = inputValue.toUpperCase() + " is incorrect... try again...";
    if (guessNumber == 5) {
      feedback.innerText = "You LOOOOOOOOOSE!!!";
      hasFinished = true;
    }
    else {
      guessNumber++;
    }
  }
}

guessButton.addEventListener("mousedown", function () {
  processGuess();
})