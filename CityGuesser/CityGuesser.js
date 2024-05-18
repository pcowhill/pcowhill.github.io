import { city_names } from "./city_names.js";
import { city_lats } from "./city_lats.js";
import { city_lons } from "./city_lons.js";
import { city_states } from "./city_states.js";
import { state_borders } from "./state_borders.js";

let city_names_lowercase = [];
for (let i = 0; i < city_names.length; i++) {
  city_names_lowercase.push(city_names[i].toLowerCase());
}

let myReport = document.getElementById("myReport");
let myCanvas = document.getElementById("myCanvas");
let myEntry = document.getElementById("myEntry");
let fitToWindowButton = document.getElementById("fitToWindow");
let increaseWidthButton = document.getElementById("increaseWidth");
let decreaseWidthButton = document.getElementById("decreaseWidth");
let increaseHeightButton = document.getElementById("increaseHeight");
let decreaseHeightButton = document.getElementById("decreaseHeight");
let submitButton = document.getElementById("submitButton");
let myScoreBoard = document.getElementById("myScoreBoard");
let myFeedback = document.getElementById("myFeedback");
let myContext = myCanvas.getContext("2d");

myCanvas.width = window.innerWidth - 100;
myCanvas.height = 1;

myReport.innerText = "To begin, type in a city name into the box below."
myScoreBoard.innerText = "\n";
myFeedback.innerText = "\n\n\n\n\n\n\n\n\n\n";

import { calc_minmax_latlon, Mapper, plot_states } from "./city_guesser_utils.js";

const minmax_latlon = calc_minmax_latlon(city_lats, city_lons, state_borders);

let revealDistance = 1.5;
let latLonRatio = 1.2;
let map = new Mapper(minmax_latlon, myCanvas.width, myCanvas.height, revealDistance, latLonRatio);
myCanvas.height = map.getOptimalHeight();
map = new Mapper(minmax_latlon, myCanvas.width, myCanvas.height, revealDistance, latLonRatio);


myContext.fillStyle = "rgb(240,240,240)";
myContext.fillRect(0, 0, myCanvas.width, myCanvas.height);
plot_states(map, myContext, state_borders);

let complete_state_counts = {};
let working_state_counts = {};
for (let i = 0; i < city_states.length; i++) {
  if (city_states[i] in complete_state_counts) {
    complete_state_counts[city_states[i]]++;
  }
  else {
    complete_state_counts[city_states[i]] = 1;
    working_state_counts[city_states[i]] = 0;
  }
}

let citiesNamed = [];
let citiesNamedLowercase = [];
let citiesNamedIndexes = [];
let citiesRevealedIndexes = [];
let statesNamed = [];
let statesRevealed = [];
let statesFullyRevealed = [];
let inputValue = "";
let inputValueLower = "";
let thisCityName = "";
let cititesAddedCount;
let index, lat, lon, pixPos;
let latsDiff, lonsDiff, latSq, lonSq;
let revealDistanceSq = revealDistance * revealDistance;

function draw() {
  myContext.fillStyle = "rgb(240,240,240)";
    myContext.fillRect(0, 0, myCanvas.width, myCanvas.height);
    myContext.fillStyle = "rgb(0,0,200)";
    for (let i = 0; i < citiesNamedIndexes.length; i++) {
      index = citiesNamedIndexes[i];
      lat = city_lats[index];
      lon = city_lons[index];
      pixPos = map.latlon2pixpos(lat, lon);
      myContext.beginPath();
      myContext.arc(pixPos.x, pixPos.y,map.getRevealPixRadius(),0,2*Math.PI,false);
      myContext.fill();
    }
    myContext.fillStyle = "rgb(255,165,0)";
    for (let i = 0; i < citiesRevealedIndexes.length; i++) {
      index = citiesRevealedIndexes[i];
      lat = city_lats[index];
      lon = city_lons[index];
      pixPos = map.latlon2pixpos(lat, lon);
      myContext.beginPath();
      myContext.arc(pixPos.x, pixPos.y,map.getCityPixRadius(),0,2*Math.PI,false);
      myContext.fill();
    }
    plot_states(map, myContext, state_borders);
}

function updateScoreBoard() {
  myScoreBoard.innerText = "" + 
    (citiesNamedIndexes.length / city_names.length * 100).toFixed(2) + "% (" +
    citiesNamedIndexes.length + "/" + city_names.length + ") cities named.\n" +
    (citiesRevealedIndexes.length / city_names.length * 100).toFixed(2) + "% (" +
    citiesRevealedIndexes.length + "/" + city_names.length + ") cities revealed.\n" +
    (statesNamed.length / 49 * 100).toFixed(2) + "% (" +
    statesNamed.length + "/49) states partially named.\n" +
    (statesRevealed.length / 49 * 100).toFixed(2) + "% (" +
    statesRevealed.length + "/49) states partially revealed.\n" +
    (statesFullyRevealed.length / 49 * 100).toFixed(2) + "% (" +
    statesFullyRevealed.length + "/49) states fully revealed.\n";
}
updateScoreBoard();

function submitGuess() {
  // Checking City Existance Logic
  inputValue = myEntry.value;
  inputValueLower = inputValue.toLowerCase();
  myEntry.value = "";
  if (citiesNamedLowercase.includes(inputValueLower)) {
    myReport.innerText = "You have already named " + inputValue + "!";
  }
  else if (city_names_lowercase.includes(inputValueLower)) {
    cititesAddedCount = 0;
    for (let i = 0; i < city_names.length; i++) {
      if (city_names_lowercase[i] === inputValueLower) {
        cititesAddedCount++;
        thisCityName = city_names[i];
        citiesNamedIndexes.push(i);
        if (!statesNamed.includes(city_states[i])) {
          statesNamed.push(city_states[i]);
          myFeedback.innerText = city_states[i] + " has been partially named!\n" + myFeedback.innerText;
        }
        for (let j = 0; j < city_names.length; j++) {
          if (citiesRevealedIndexes.includes(j)) continue;
          latsDiff = (city_lats[i] - city_lats[j]) / latLonRatio;
          lonsDiff = city_lons[i] - city_lons[j];
          latSq = latsDiff * latsDiff;
          lonSq = lonsDiff * lonsDiff;
          if (latSq + lonSq < revealDistanceSq) {
            citiesRevealedIndexes.push(j);
            working_state_counts[city_states[j]]++;
            if (working_state_counts[city_states[j]] == complete_state_counts[city_states[j]]) {
              statesFullyRevealed.push(city_states[j])
              myFeedback.innerText = city_states[j] + " has been fully revealed!!!\n" + myFeedback.innerText;
            }
            if (!statesRevealed.includes(city_states[j])) {
              statesRevealed.push(city_states[j])
              myFeedback.innerText = city_states[j] + " has been partially revealed!\n" + myFeedback.innerText;
            }
          }
        }
      }
    }
    citiesNamed.push(thisCityName);
    citiesNamedLowercase.push(thisCityName.toLowerCase());
    if (cititesAddedCount > 1) {
      myReport.innerText = "There are " + cititesAddedCount + " citites named " + thisCityName + "!";
    }
    else {
      myReport.innerText = "There is " + cititesAddedCount + " city named " + thisCityName + "!";
    }
  }
  else {
    myReport.innerText = inputValue + " is not the name of a city :(";
  }

  // Track Reports within Feedback
  myFeedback.innerText = myReport.innerText + "\n" + myFeedback.innerText;

  // Update Score Board
  updateScoreBoard();

  // Updating Canvas
  draw();
}

submitButton.addEventListener("mousedown", function () {
  submitGuess();
})

myEntry.addEventListener("keydown", function (key) {
  if (key.code == "Enter") {
    submitGuess();
  }
});

increaseWidthButton.addEventListener("mousedown", function () {
  myCanvas.width += 100;
  map = new Mapper(minmax_latlon, myCanvas.width, myCanvas.height, revealDistance, latLonRatio);
  myCanvas.height = map.getOptimalHeight();
  map = new Mapper(minmax_latlon, myCanvas.width, myCanvas.height, revealDistance, latLonRatio);
  draw();
});

decreaseWidthButton.addEventListener("mousedown", function () {
  if (myCanvas.width >= 200) myCanvas.width -= 100;
  else myCanvas.width = 100;
  map = new Mapper(minmax_latlon, myCanvas.width, myCanvas.height, revealDistance, latLonRatio);
  myCanvas.height = map.getOptimalHeight();
  map = new Mapper(minmax_latlon, myCanvas.width, myCanvas.height, revealDistance, latLonRatio);
  draw();
});

fitToWindowButton.addEventListener("mousedown", function () {
  myCanvas.width = window.innerWidth - 100;
  myCanvas.height = 1;
  map = new Mapper(minmax_latlon, myCanvas.width, myCanvas.height, revealDistance, latLonRatio);
  myCanvas.height = map.getOptimalHeight();
  map = new Mapper(minmax_latlon, myCanvas.width, myCanvas.height, revealDistance, latLonRatio);
  draw();
})
