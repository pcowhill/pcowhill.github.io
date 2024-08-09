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
let correctIndex;
let guessNumber = 0;
let hasFinished = false;


function setup() {
  correctIndex = Math.floor(Math.random() * recordings.length);
  correctAnswer = recordings[correctIndex][0];
  let correctRecording = recordings[correctIndex][1];

  // This function call has been added to attempt to address a behavior with
  // IMSLP updating their links to the audio files for recordings.  Based on
  // what I see at the time of writing, this should fix the behavior.
  find_website(correctRecording);

  // I put some instruments in here if I could not find a recording.  More
  // options could be enough to throw off our studious guessers!
  // P.s. it does not matter if there are duplicates in here, don't worry about
  // accidentally adding something that is already in recordings.js
  let validInstrumentsList = [
    "BANJO",
    "BAGPIPE",
    "CELESTA",
    "TIMPANI",
    "CARILLON",
    "XYLOPHONE",
    "HAND PAN",
    "MARACA",
    "TAMBOURINE",
    "TRIANGLE",
    "WASHBOARD",
    "BONGOS",
    "DJEMBE",
    "DRUM SET",
    "TIMBALES",
    "EUPHONIUM",
    "DIDGERIDOO",
    "KAZOO",
    "OCARINA",
    "AUTOHARP",
    "PIPA",
    "CLAVINET",
    "ERHU",
    "LYRE",
    "MANDOLIN",
    "SNARE"
  ];
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
      feedback.innerText = "You LOOOOOOOOOSE!!!  The answer was: " + correctAnswer.toUpperCase();
      hasFinished = true;
    }
    else {
      guessNumber++;
    }
  }

  if (hasFinished) {
    feedback.innerHTML = feedback.innerHTML + "<br><br>";
    feedback.innerHTML = feedback.innerHTML + recordings[correctIndex][2];
    feedback.innerHTML = feedback.innerHTML + "<br>";
    feedback.innerHTML = feedback.innerHTML + '<a href="' + recordings[correctIndex][3] + '">' + recordings[correctIndex][3] + "</a>";
  }
}

function fetchFile(url) {
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return url;
      }
    })
}

function find_website(websiteSuffix) {
  // There seems to be a behavior where IMSLP will chain the website that is
  // hosting their audio files.  However, based on some brief exploration, it
  // seems that this is done in a somewhat predictable way.  In particular, the
  // subdomain appears to cycle through the following options while the rest
  // of the URL stays the same
  //   - s9
  //   - ks15
  //   - vmirror
  // In this function, I will attempt to check all three of these potential
  // subdomains and then return the one that is correct.
  let options = [
    "https://s9." + websiteSuffix,
    "https://ks15." + websiteSuffix,
    "https://vmirror." + websiteSuffix
  ];
  const fetchPromises = options.map(url => fetchFile(url));

  Promise.race(fetchPromises)
    .then(url => {
      audioSelection.innerHTML = '<audio controls><source src="' + url + '"></audio>';
      return;
    })
    .catch(error => {
      console.error('Failed to load audio file.');
    })
}



guessButton.addEventListener("mousedown", function () {
  processGuess();
})

inputGuess.addEventListener("keydown", function (key) {
  if (key.code == "Enter") {
    processGuess();
  }
});