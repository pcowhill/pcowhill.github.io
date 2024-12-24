import { HtmlCode } from "./DataStructures.js";
import { EventListener, EventListenerList } from "./EventListeners.js";

export const PageType = {
  MainMenu: 0,
  PreEncounter: 1,
  Encounter: 2,
  Settings: 3
}

export class MainMenuPage {
  constructor(
    selectNewEncounter,
    selectSettings
  ) {
    this.pageType = PageType.MainMenu;
    this.eventListeners = new EventListenerList([
      new EventListener("newEncounterButton", "click", selectNewEncounter),
      new EventListener("settingsButton", "click", selectSettings)
    ]);
  }
  getHtml() {
    return new HtmlCode(`
      <div id="mainMenu">
        <button class="primary" id="newEncounterButton">New Encounter</button>
        <button class="primary" id="settingsButton">Settings</button>
      </div>
    `);
  }
}

export class SettingsPage {
  constructor(
    enterMainMenu,
    enterDefaultCharacterIds
  ) {
    this.pageType = PageType.Settings;
    this.eventListeners = new EventListenerList([
      new EventListener("returnToMainButton", "click", enterMainMenu),
      new EventListener("editDefaultCharacters", "click", enterDefaultCharacterIds)
    ]);
  }
  getHtml() {
    return new HtmlCode(`
      <div id="settingsPage">
        <h2>Settings</h2>
        <button class="secondary" id="editDefaultCharacters">Default Characters</button>
        <br>
        <button class="secondary" id="returnToMainButton">Back to Main Menu</button>
      </div>
    `)
  }
}

export class EditDefaultCharacterIdsSubpage {
  constructor(
    enterSettings,
    addCharacter,
    editCharacter,
    removeCharacter,
    removeAllCharacters,
    presetCharacters
  ) {
    this.pageType = PageType.Settings;
    this.editCharacter = editCharacter;
    this.removeCharacter = removeCharacter;
    this.eventListeners = new EventListenerList([
      new EventListener("returnToSettingsButton", "click", enterSettings),
      new EventListener("addCharacterButton", "click", addCharacter),
      new EventListener("removeAllCharactersButton", "click", removeAllCharacters),
      new EventListener("presetCharactersButton", "click", presetCharacters)
    ])
  }
  getHtml(sessionData) {
    let htmlCode = new HtmlCode("");
    htmlCode.append(`<div id="settingsPage">`);

    // Sub Page Title
    htmlCode.append(`<h2>Settings</h2>`)
    htmlCode.append(`<h3>Edit Default Characters</h3>`)

    // Buttons
    htmlCode.append(`<button class="secondary" id="addCharacterButton">Add New Character</button>`)

    // Default Character List
    for (let i = 0; i < sessionData.defaultCharacterIds.length; i++) {
      htmlCode.append(`
        <div class="otherCreatures">
          <div class="currentCreatureName">${sessionData.defaultCharacterIds[i]}</div>
          <div class="buttonHolder">
            <button class="remove" id="remove-${i}">Remove</button>
            <button class="edit" id="edit-${i}">Edit</button>
          </div>
        </div>
      `);

      // Ensure there exist sufficient event handlers regarless of added or removed entries.
      let editEventListener = new EventListener(`edit-${i}`, "click", () => {this.editCharacter(i)});
      this.eventListeners.expire(editEventListener);
      this.eventListeners.append(editEventListener);
      let removeEventListener = new EventListener(`remove-${i}`, "click", () => {this.removeCharacter(i)});
      this.eventListeners.expire(removeEventListener);
      this.eventListeners.append(removeEventListener);
    }

    htmlCode.append(`<br>`);
    htmlCode.append(`<button class="secondary" id="removeAllCharactersButton">Remove All</button>`);
    htmlCode.append(`<button class="secondary" id="presetCharactersButton">Preset Characters</button>`);
    htmlCode.append(`<br>`);
    htmlCode.append(`<button class="secondary" id="returnToSettingsButton">Back to Settings</button>`);

    htmlCode.append(`</div>`);
    return htmlCode;
  }
}

export class PreEncounterPage {
  constructor(
    startEncounter,
    endEncounter,
    getInitiativeSetEvent,
    otherInitiativeSetEvent,
    encounterName,
    editInitiative,
    removeCreature,
    removeAllCreatures,
    defaultCharacterIds
  ) {
    this.pageType = PageType.PreEncounter;
    this.characterIds = defaultCharacterIds;
    this.encounterName = encounterName;
    this.editInitiative = editInitiative;
    this.removeCreature = removeCreature;
    this.eventListeners = new EventListenerList([]);
    for (let i = 0; i < this.characterIds.length; i++) {
      let id = this.characterIds[i];
      this.eventListeners.append(new EventListener(id, "click", getInitiativeSetEvent(id)));
    }
    this.eventListeners.append(new EventListener("Other", "click", otherInitiativeSetEvent));
    this.eventListeners.append(new EventListener("removeAllCreatures", "click", removeAllCreatures));
    this.eventListeners.append(new EventListener("startEncounter", "click", startEncounter));
    this.eventListeners.append(new EventListener("endEncounter", "click", endEncounter));
  }
  getHtml(sessionData) {
    let htmlCode = new HtmlCode("");
    htmlCode.append(`<div id="preEncounterPage">`);

    // Encounter Title
    htmlCode.append(`<h2>${this.encounterName}</h2>`)

    // Buttons
    for (let i = 0; i < this.characterIds.length; i++)
      if (!sessionData.containsCreature(this.characterIds[i]))
        htmlCode.append(`<button class="secondary" id="${this.characterIds[i]}">${this.characterIds[i]}</button>`)
    htmlCode.append(`<button class="secondary" id="Other">Other</button>`)

    // Initiative List
    for (let i = 0; i < sessionData.initiativeList.length; i++) {
      let thisCreature = sessionData.initiativeList[i].creatureId;
      let thisInitiative = sessionData.initiativeList[i].initiative;
      let thisHitpointsCurrent = sessionData.initiativeList[i].hitpointsCurrent;
      let thisHitpointsMax = sessionData.initiativeList[i].hitpointsMax;
      htmlCode.append(`
        <div class="otherCreatures">
          ${thisCreature} |
          <img class="icon" src="InitiativeIcon.png"> ${thisInitiative} |
      `);
      if (!(thisHitpointsCurrent == null))
        htmlCode.append(`<img class="icon" src="HitpointsIcon.png"> ${thisHitpointsCurrent}/${thisHitpointsMax}`);
      else
        htmlCode.append(`<img class="icon" src="HitpointsIcon.png"> --/--`);
      htmlCode.append(`
          <div class="buttonHolder">
            <button class="remove" id="remove-${i}">Remove</button>
            <button class="edit" id="edit-${i}">Edit</button>
          </div>
        </div>
      `);

      // Ensure there exist sufficient event handlers regarless of added or removed entries.
      let editEventListener = new EventListener(`edit-${i}`, "click", () => {this.editInitiative(i)});
      this.eventListeners.expire(editEventListener);
      this.eventListeners.append(editEventListener);
      let removeEventListener = new EventListener(`remove-${i}`, "click", () => {this.removeCreature(i)});
      this.eventListeners.expire(removeEventListener);
      this.eventListeners.append(removeEventListener);
    }

    htmlCode.append(`<br>`);
    htmlCode.append(`<button class="secondary" id="removeAllCreatures">Remove All</button>`);
    htmlCode.append(`<button class="secondary" id="startEncounter">Start Encounter</button>`);
    htmlCode.append(`<button class="secondary" id="endEncounter">End Encounter</button>`);

    htmlCode.append(`</div>`);
    return htmlCode;
  }
}

export class EncounterPage {
  constructor(
    endEncounter,
    resetEncounter,
    encounterName,
    rip,
    delayTurn,
    endTurn,
    hitCreature,
    sessionData
  ) {
    this.pageType = PageType.Encounter;
    this.encounterName = encounterName;
    this.eventListeners = new EventListenerList([
      new EventListener("rip", "click", rip),
      new EventListener("delayTurn", "click", delayTurn),
      new EventListener("endTurn", "click", endTurn),
      new EventListener("resetEncounter", "click", resetEncounter),
      new EventListener("endEncounter", "click", endEncounter)
    ]);
    for (let i = 0; i < sessionData.initiativeList.length; i++) {
      const thisCreatureId = sessionData.initiativeList[i].creatureId;
      this.eventListeners.append(new EventListener(`hit-${thisCreatureId}`, "click", () => {hitCreature(thisCreatureId);}));
    }
  }
  getHtml(sessionData) {
    let htmlCode = new HtmlCode("");
    htmlCode.append(`<div id="encounterPage">`);

    // Encounter Title
    htmlCode.append(`<h2>${this.encounterName}</h2>`)

    // Initiative List
    if (sessionData.initiativeList.length > 0) {
      let thisCreature = sessionData.initiativeList[0].creatureId;
      let thisInitiative = sessionData.initiativeList[0].initiative;
      let thisHitpointsCurrent = sessionData.initiativeList[0].hitpointsCurrent;
      let thisHitpointsMax = sessionData.initiativeList[0].hitpointsMax;
      htmlCode.append(`
        <div class="currentCreature">
          <div class="currentCreatureName">${thisCreature}</div>
          <div class="currentCreatureDetails">
      `);
      htmlCode.append(`Initiative | <img class="icon" src="InitiativeIcon.png"> ${thisInitiative}`);
      if (!(thisHitpointsCurrent == null)) {
        htmlCode.append(`</br>Hitpoints | <img class="icon" src="HitpointsIcon.png"> ${thisHitpointsCurrent}/${thisHitpointsMax}`);
      }
      else {
        htmlCode.append(`</br>Hitpoints | <img class="icon" src="HitpointsIcon.png"> --/--`);
      }
      htmlCode.append(`
          </div>
          <div class="buttonHolder">`);
      if (!(thisHitpointsCurrent == null)) {
        htmlCode.append(`<button class="rip" id="hit-${thisCreature}">Hit</button>`);
      }
      else {
        htmlCode.append(`<button class="rip" id="rip">R.I.P.</button>`);
      }
      htmlCode.append(`
            <button class="delayTurn" id="delayTurn">Delay Turn</button>
            <button class="endTurn" id="endTurn">End Turn</button>
          </div>
        </div>
      `);
    }
    for (let i = 1; i < sessionData.initiativeList.length; i++) {
      let thisCreature = sessionData.initiativeList[i].creatureId;
      let thisInitiative = sessionData.initiativeList[i].initiative;
      let thisHitpointsCurrent = sessionData.initiativeList[i].hitpointsCurrent;
      let thisHitpointsMax = sessionData.initiativeList[i].hitpointsMax;
      htmlCode.append(`<div class="otherCreatures">`);
      if (!(thisHitpointsCurrent == null)) {
        htmlCode.append(`
            ${thisCreature} | <img class="icon" src="InitiativeIcon.png"> ${thisInitiative} | <img class="icon" src="HitpointsIcon.png"> ${thisHitpointsCurrent}/${thisHitpointsMax}
            <div class="buttonHolder">
              <button class="hit" id="hit-${thisCreature}">Hit</button>
            </div>
        `);
      }
      else {
        htmlCode.append(`
            ${thisCreature} | <img class="icon" src="InitiativeIcon.png"> ${thisInitiative} | <img class="icon" src="HitpointsIcon.png"> --/--
        `);
      }
      htmlCode.append(`</div>`)
    }
    for (let i = 0; i < sessionData.deadList.length; i++) {
      let thisCreature = sessionData.deadList[i].creatureId;
      let thisInitiative = sessionData.deadList[i].initiative;
      htmlCode.append(`<div class="otherCreatures"><del>${thisCreature}</del></div>`)
    }

    // End Encounter Button
    htmlCode.append(`<button class="secondary" id="resetEncounter">Reset Encounter</button>`)
    htmlCode.append(`<button class="secondary" id="endEncounter">End Encounter</button>`)

    htmlCode.append(`</div>`)
    return htmlCode;
  }
}