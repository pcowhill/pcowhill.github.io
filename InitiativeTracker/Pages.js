import { HtmlCode } from "./DataStructures.js";
import { EventListener, EventListenerList } from "./EventListeners.js";

export const PageType = {
  MainMenu: 0,
  PreEncounter: 1,
  Encounter: 2
}

export class MainMenuPage {
  constructor(selectNewEncounter) {
    this.pageType = PageType.MainMenu;
    this.eventListeners = new EventListenerList([
      new EventListener("newEncounterButton", "click", selectNewEncounter)
    ]);
  }
  getHtml() {
    return new HtmlCode(`
      <div id="mainMenu">
        <button class="primary" id="newEncounterButton">New Encounter</button>
      </div>
    `);
  }
}

export class PreEncounterPage {
  constructor(
    startEncounter,
    getInitiativeSetEvent,
    otherInitiativeSetEvent,
    encounterName
  ) {
    this.pageType = PageType.PreEncounter;
    this.characterIds = ["Bloop", "Cyril", "Nahala", "T'avi", "Toross"];
    this.encounterName = encounterName;
    this.eventListeners = new EventListenerList([]);
    for (let i = 0; i < this.characterIds.length; i++) {
      let id = this.characterIds[i];
      this.eventListeners.append(new EventListener(id, "click", getInitiativeSetEvent(id)));
    }
    this.eventListeners.append(new EventListener("Other", "click", otherInitiativeSetEvent));
    this.eventListeners.append(new EventListener("startEncounter", "click", startEncounter));
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
      htmlCode.append(`<div class="otherCreatures">${thisCreature} (${thisInitiative})</div>`)
    }

    htmlCode.append(`<button class="secondary" id="startEncounter">Start Encounter</button>`)

    htmlCode.append(`</div>`)
    return htmlCode;
  }
}

export class EncounterPage {
  constructor(
    endEncounter,
    encounterName,
    rip,
    delayTurn,
    endTurn
  ) {
    
    this.pageType = PageType.Encounter;
    this.encounterName = encounterName;
    this.eventListeners = new EventListenerList([
      new EventListener("rip", "click", rip),
      new EventListener("delayTurn", "click", delayTurn),
      new EventListener("endTurn", "click", endTurn),
      new EventListener("endEncounter", "click", endEncounter)
    ]);
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
      htmlCode.append(`
        <div class="currentCreature">
          <div class="currentCreatureName">${thisCreature} (${thisInitiative})</div>
          <div class="buttonHolder">
            <button class="rip" id="rip">R.I.P.</button>
            <button class="delayTurn" id="delayTurn">Delay Turn</button>
            <button class="endTurn" id="endTurn">End Turn</button>
          </div>
        </div>
      `);
    }
    for (let i = 1; i < sessionData.initiativeList.length; i++) {
      let thisCreature = sessionData.initiativeList[i].creatureId;
      let thisInitiative = sessionData.initiativeList[i].initiative;
      htmlCode.append(`<div class="otherCreatures">${thisCreature} (${thisInitiative})</div>`)
    }
    for (let i = 0; i < sessionData.deadList.length; i++) {
      let thisCreature = sessionData.deadList[i].creatureId;
      let thisInitiative = sessionData.deadList[i].initiative;
      htmlCode.append(`<div class="otherCreatures"><del>${thisCreature} (${thisInitiative})</del></div>`)
    }

    // End Encounter Button
    htmlCode.append(`<button class="secondary" id="endEncounter">End Encounter</button>`)

    htmlCode.append(`</div>`)
    return htmlCode;
  }
}