let guesses = [
  document.getElementById("firstGuess"),
  document.getElementById("secondGuess"),
  document.getElementById("thirdGuess"),
  document.getElementById("fourthGuess"),
  document.getElementById("fifthGuess"),
  document.getElementById("sixthGuess")
];

let inputGuess = document.getElementById("inputGuess");
let guessButton = document.getElementById("guessButton");
let instrumentsList = document.getElementById("instrumentsList");
let feedback = document.getElementById("feedback");

let correctAnswer = "accordion";
let guessNumber = 0;
let hasFinished = false;

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