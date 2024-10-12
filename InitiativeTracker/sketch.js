// Setup Functions

function setupEncounterMenu() {
  currentPage = 1;
  saveCookies();

  function reportEncounterName() {
    document.getElementById("mainMenu").style.display = "none";
    encounterName = document.getElementById("modalInput").value;
    saveCookies();
    document.getElementById("encounterTitle").innerText = encounterName;
    document.getElementById("modalInput").value = "";
    document.getElementById("modalSubmit").removeEventListener("click", reportEncounterName);
    document.getElementById("modalSubmit").addEventListener("click", throwInvalidOperation);
    document.getElementById("modal").style.display = "none";
    document.getElementById("modalPrompt").innerText = "Enter Input:"
    document.getElementById("encounterSubtitle").innerText = "Set Creature Initiative";
    document.getElementById("Toross").style.display = "inline";
    document.getElementById("Nahala").style.display = "inline";
    document.getElementById("T'avi").style.display = "inline";
    document.getElementById("Cyril").style.display = "inline";
    document.getElementById("Bloop").style.display = "inline";
    document.getElementById("other").style.display = "inline";
    document.getElementById("startEncounter").style.display = "inline";
    refreshPreEncounterList()
  }
  if (encounterName == "") {
    document.getElementById("modalPrompt").innerText = "Encounter Name:";
    document.getElementById("modalInput").type = "text";
    document.getElementById("modalInput").value = "Tavern Brawl"
    document.getElementById("modal").style.display = "block";
    document.getElementById("modalInput").focus();
    document.getElementById("modalSubmit").removeEventListener("click", throwInvalidOperation);
    document.getElementById("modalSubmit").addEventListener("click", reportEncounterName);
  } else {
    document.getElementById("mainMenu").style.display = "none";
    document.getElementById("encounterTitle").innerText = encounterName;
    document.getElementById("encounterSubtitle").innerText = "Set Creature Initiative";
    document.getElementById("Toross").style.display = "inline";
    document.getElementById("Nahala").style.display = "inline";
    document.getElementById("T'avi").style.display = "inline";
    document.getElementById("Cyril").style.display = "inline";
    document.getElementById("Bloop").style.display = "inline";
    document.getElementById("other").style.display = "inline";
    let characters = ["Toross", "Nahala", "T'avi", "Cyril", "Bloop"];
    for (let i = 0; i < initiativeList.length; i++) {
      if (characters.includes(initiativeList[i][0])) {
        document.getElementById(initiativeList[i][0]).style.display = "none";
      }
    }
    document.getElementById("startEncounter").style.display = "inline";
    refreshPreEncounterList()
  }
}


// Functions

function throwInvalidOperation() {
  alert("Invalidly mapped input; something is wrong...")
}

function getInitiativeSetEvent(creatureId) {
  return function () {
    document.getElementById("modalPrompt").innerText = "Enter Initiative:";
    document.getElementById("modal").style.display = "block";
    document.getElementById("modalInput").value = "";
    document.getElementById("modalInput").type = "number";
    document.getElementById("modalInput").focus();
    document.getElementById("modalSubmit").removeEventListener("click", throwInvalidOperation);
    function reportInitiative() {
      if (!Number.isInteger(Number(document.getElementById("modalInput").value)) || !(document.getElementById("modalInput").value.trim())) {
        alert('"' + document.getElementById("modalInput").value + '" is invalid input.');
        document.getElementById("modalInput").value = "10";
        document.getElementById("modalInput").focus();
        return;
      }
      initiativeList.push([creatureId, document.getElementById("modalInput").value]);
      saveCookies();
      refreshPreEncounterList();
      document.getElementById(creatureId).style.display = "none";
      document.getElementById("modalInput").value = "";
      document.getElementById("modalInput").type = "text";
      document.getElementById("modalSubmit").removeEventListener("click", reportInitiative);
      document.getElementById("modalSubmit").addEventListener("click", throwInvalidOperation);
      document.getElementById("modal").style.display = "none";
      document.getElementById("modalPrompt").innerText = "Enter Input:"
    }
    document.getElementById("modalSubmit").addEventListener("click", reportInitiative);
  }
}

function setOtherInitiativeEvent() {
  document.getElementById("modalPrompt").innerText = "Enter Name:";
  document.getElementById("modal").style.display = "block";
  document.getElementById("modalInput").value = "";
  document.getElementById("modalInput").type = "text";
  document.getElementById("modalInput").focus();
  document.getElementById("modalSubmit").removeEventListener("click", throwInvalidOperation);
  function reportName() {
    let creatureName = document.getElementById("modalInput").value;
    document.getElementById("modalPrompt").innerText = "Enter Initiative:";
    document.getElementById("modalInput").value = "";
    document.getElementById("modalInput").type = "number";
    document.getElementById("modalInput").focus();
    document.getElementById("modalSubmit").removeEventListener("click", reportName);
    function reportInitiative() {
      if (!Number.isInteger(Number(document.getElementById("modalInput").value)) || !(document.getElementById("modalInput").value.trim())) {
        alert('"' + document.getElementById("modalInput").value + '" is invalid input.');
        document.getElementById("modalInput").value = "10";
        document.getElementById("modalInput").focus();
        return;
      }
      initiativeList.push([creatureName, document.getElementById("modalInput").value]);
      saveCookies();
      refreshPreEncounterList();
      document.getElementById("modalInput").value = "";
      document.getElementById("modalInput").type = "text";
      document.getElementById("modalSubmit").removeEventListener("click", reportInitiative);
      document.getElementById("modalSubmit").addEventListener("click", throwInvalidOperation);
      document.getElementById("modal").style.display = "none";
      document.getElementById("modalPrompt").innerText = "Enter Input:"
    }
    document.getElementById("modalSubmit").addEventListener("click", reportInitiative);
  }
  document.getElementById("modalSubmit").addEventListener("click", reportName);
}

function refreshPreEncounterList() {
  let newHTML = ""
  let theList = document.getElementById("preEncounterList");
  newHTML = "";
  newHTML = newHTML + '<table>';
  newHTML = newHTML + "<tr>";
  newHTML = newHTML + "<th>Creature</th>";
  newHTML = newHTML + "<th>Initiative</th>";
  newHTML = newHTML + "</tr>";
  for (let i = 0; i < initiativeList.length; i++) {
    newHTML = newHTML + "<tr>"
    newHTML = newHTML + "<td>" + initiativeList[i][0] + "</td>";
    newHTML = newHTML + "<td>" + initiativeList[i][1] + "</td>";
    newHTML = newHTML + "</tr>"
  }
  newHTML = newHTML + "</table>";
  document.getElementById("preEncounterList").innerHTML = newHTML;
}

function sortInitiativeList() {
  initiativeList.sort(function (a, b) {
    if (Number(a[1]) > Number(b[1])) {
      return -1;
    } else if (Number(a[1]) < Number(b[1])) {
      return 1;
    } else {
      return 0;
    }
  });
}

function resolveInitiativeListIssues() {
  // If multiple creatures have the same name, that could be an issue.  This
  // function attempts to resolve that and provide a unique name to each
  // creature.
  let shouldRecheck = false;
  const nameCount = {};
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // First pass: count occurrences of each name
  for (let i = 0; i < initiativeList.length; i++) {
    let name = initiativeList[i][0];
    if (nameCount[name] === undefined) {
      nameCount[name] = 1;
    } else {
      nameCount[name]++;
    }
  }

  // Second pass: rename duplicates
  const nameIndex = {};
  for (let i = 0; i < initiativeList.length; i++) {
    let name = initiativeList[i][0];
    if (nameCount[name] > 1) {
      if (nameIndex[name] === undefined) {
        nameIndex[name] = 0;
      } else {
        nameIndex[name]++;
      }
      initiativeList[i][0] = name + ' ' + alphabet[nameIndex[name] % alphabet.length];
      shouldRecheck = true;
    }
  }

  // Repeat if any names changed
  if (shouldRecheck) {
    resolveInitiativeListIssues()
  }
}

function startEncounter() {
  currentPage = 2;
  saveCookies();

  // Local Functions
  function populateInitiativeTrackingElements() {
    for (let i = 0; i < initiativeList.length; i++) {
      document.getElementById("creature-" + i.toString() + "_name").innerText = initiativeList[i][0] + " (" + initiativeList[i][1].toString() + ")";
    }
    for (let i = 0; i < deadList.length; i++) {
      document.getElementById("creature-" + (i + initiativeList.length).toString() + "_name").innerHTML = "<del>" + deadList[i][0] + " (" + deadList[i][1].toString() + ")</del>";
    }
  }

  // Set up
  document.getElementById("mainMenu").style.display = "none";
  document.getElementById("encounterTitle").innerText = encounterName;
  document.getElementById("Toross").style.display = "none";
  document.getElementById("Nahala").style.display = "none";
  document.getElementById("T'avi").style.display = "none";
  document.getElementById("Cyril").style.display = "none";
  document.getElementById("Bloop").style.display = "none";
  document.getElementById("other").style.display = "none";
  document.getElementById("startEncounter").style.display = "none";
  document.getElementById("encounterSubtitle").innerText = "";
  document.getElementById("preEncounterList").innerHTML = "";
  document.getElementById("endEncounter").style.display = "inline";

  // Create Initiative Tracking Elements
  let newHTML = "";
  if (initiativeList.length > 0) {
    newHTML = newHTML + '<div class="currentCreature" id="creature-0">';
    newHTML = newHTML + '<div class="currentCreatureName" id="creature-0_name"></div>';
    newHTML = newHTML + '<div class="buttonHolder">';
    newHTML = newHTML + '<button class="rip" id="rip">R.I.P.</button>';
    newHTML = newHTML + '<button class="delayTurn" id="delayTurn">Delay Turn</button>';
    newHTML = newHTML + '<button class="endTurn" id="endTurn">End Turn</button>';
    newHTML = newHTML + '</div>';
    newHTML = newHTML + '</div>';
  }
  for (let i = 1; i < initiativeList.length + deadList.length; i++) {
    newHTML = newHTML + '<div class="otherCreatures" id="creature-' + i.toString() + '">';
    newHTML = newHTML + '<div id="creature-' + i.toString() + '_name"></div>';
    newHTML = newHTML + '</div>';
  }
  document.getElementById("encounterList").innerHTML = newHTML;

  // Populate Initiative Tracking Elements
  populateInitiativeTrackingElements();

  // Add Events
  document.getElementById("rip").addEventListener("click", function () {
    if (initiativeList.length == 0) {
      return;
    }
    deadList.push(initiativeList[0]);
    initiativeList.splice(0, 1);
    saveCookies();
    populateInitiativeTrackingElements();
  })
  document.getElementById("endTurn").addEventListener("click", function () {
    if (initiativeList.length == 0) {
      return;
    }
    initiativeList.push(initiativeList[0]);
    initiativeList.splice(0, 1);
    saveCookies();
    populateInitiativeTrackingElements();
  })
  document.getElementById("delayTurn").addEventListener("click", function () {
    if (initiativeList.length < 2) {
      return;
    }
    [initiativeList[0], initiativeList[1]] = [initiativeList[1], initiativeList[0]];
    saveCookies();
    populateInitiativeTrackingElements();
  })
}

function encounterTransition() {
  // Prepare the initiative list
  sortInitiativeList();
  resolveInitiativeListIssues();

  // Start the encounter
  startEncounter();
}

function endEncounter() {
  document.getElementById("confirm").style.display = "block";
  document.getElementById("confirmApprove").removeEventListener("click", throwInvalidOperation)
  document.getElementById("confirmDeny").removeEventListener("click", throwInvalidOperation);
  function approveEnd() {
    document.getElementById("confirm").style.display = "none";
    currentPage = 0;
    initiativeList = [];
    deadList = [];
    encounterName = "";
    saveCookies();
    document.getElementById("encounterList").innerHTML = "";
    document.getElementById("encounterTitle").innerText = "";
    document.getElementById("encounterSubtitle").innerText = "";
    document.getElementById("mainMenu").style.display = "inline";
    document.getElementById("endEncounter").style.display = "none";
    document.getElementById("confirmApprove").removeEventListener("click", approveEnd)
    document.getElementById("confirmDeny").removeEventListener("click", denyEnd);
    document.getElementById("confirmApprove").addEventListener("click", throwInvalidOperation);
    document.getElementById("confirmDeny").addEventListener("click", throwInvalidOperation);
  }
  function denyEnd() {
    document.getElementById("confirm").style.display = "none";
    document.getElementById("confirmApprove").removeEventListener("click", approveEnd)
    document.getElementById("confirmDeny").removeEventListener("click", denyEnd);
    document.getElementById("confirmApprove").addEventListener("click", throwInvalidOperation);
    document.getElementById("confirmDeny").addEventListener("click", throwInvalidOperation);
  }
  document.getElementById("confirmApprove").addEventListener("click", approveEnd);
  document.getElementById("confirmDeny").addEventListener("click", denyEnd);

}

function setCookie(key, value, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${key}=${value};${expires};path=/`;
}

function getCookie(key) {
  const name = `${key}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) === 0) {
          return cookie.substring(name.length, cookie.length);
      }
  }
  return "";
}

function deleteCookie(key) {
  document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

function saveCookies() {
  console.log('Cookies Saved!')
  setCookie('initiativeList', JSON.stringify(initiativeList));
  setCookie('deadList', JSON.stringify(deadList));
  setCookie('currentPage', currentPage);
  setCookie('encounterName', encounterName);
  console.log(document.cookie);
}

// Events

document.getElementById("newEncounter").addEventListener("click", setupEncounterMenu);

document.getElementById("Toross").addEventListener("click", getInitiativeSetEvent("Toross"));
document.getElementById("Nahala").addEventListener("click", getInitiativeSetEvent("Nahala"));
document.getElementById("T'avi").addEventListener("click", getInitiativeSetEvent("T'avi"));
document.getElementById("Cyril").addEventListener("click", getInitiativeSetEvent("Cyril"));
document.getElementById("Bloop").addEventListener("click", getInitiativeSetEvent("Bloop"));
document.getElementById("other").addEventListener("click", setOtherInitiativeEvent);
document.getElementById("startEncounter").addEventListener("click", encounterTransition);
document.getElementById("endEncounter").addEventListener("click", endEncounter);

document.getElementById("modalSubmit").addEventListener("click", throwInvalidOperation);
document.getElementById("confirmApprove").addEventListener("click", throwInvalidOperation);
document.getElementById("confirmDeny").addEventListener("click", throwInvalidOperation);

if (0) {
  deleteCookie('initiativeList');
  deleteCookie('deadList');
  deleteCookie('currentPage');
  deleteCookie('encounterName');
}

// Load Page From Previous State
console.log(document.cookie);
let initiativeList = getCookie('initiativeList')
let deadList = getCookie('deadList')
let currentPage = getCookie('currentPage')
let encounterName = getCookie('encounterName')

if (initiativeList == "") {
  initiativeList = [];
} else {
  initiativeList = JSON.parse(initiativeList);
}
if (deadList == "") {
  deadList = [];
} else {
  deadList = JSON.parse(deadList);
}
if (currentPage == "") {
  currentPage = 0;
} else {
  currentPage = parseInt(currentPage);
}

if (currentPage == 1){
  setupEncounterMenu();
} else if (currentPage == 2) {
  startEncounter();
}