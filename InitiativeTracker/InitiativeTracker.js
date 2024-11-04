import { PageType, MainMenuPage, PreEncounterPage, EncounterPage } from "./Pages.js";
import { HtmlCode, SessionData } from "./DataStructures.js";
import { Modal } from "./Modal.js";
import { CookieHandler } from "./Cookies.js";


export class InitiativeTracker {
  constructor(htmlId) {
    this.htmlId = htmlId;
    this.cookieHandler = new CookieHandler();
    this.sessionData = this.cookieHandler.getSessionData();
    switch (this.cookieHandler.getPageType()) {
      case PageType.MainMenu:
        this.currentPage = new MainMenuPage(this.selectNewEncounter);
        break;
      case PageType.PreEncounter:
        this.currentPage = new PreEncounterPage(
          this.startEncounter,
          this.getReportInitiativeEvent,
          this.otherInitiativeSetEvent,
          this.sessionData.encounterName
        );
        break;
      case PageType.Encounter:
        this.currentPage = new EncounterPage(
          this.endEncounter,
          this.sessionData.encounterName,
          this.rip,
          this.delayTurn,
          this.endTurn,
          this.hitCreature,
          this.sessionData
        );
        break;
      default:
        alert("Invalid PageType; something is wrong...")
    }
    this.currentModal = new Modal(this.update);
    this.update();
  }
  update = () => {
    let htmlCode = new HtmlCode();
    htmlCode.append(this.currentPage.getHtml(this.sessionData));
    htmlCode.append(this.currentModal.getHtml());
    document.getElementById(this.htmlId).innerHTML = htmlCode.content;
    this.currentPage.eventListeners.refreshAll();
    this.currentModal.refreshAll();
    this.cookieHandler.save(this.sessionData, this.currentPage.pageType);
  }

  // ##################################################
  // Main Menu Logic
  // ##################################################
  selectNewEncounter = () => {
    this.currentModal.activateTextInput("Encounter Name:", "Tavern Brawl", this.enterPreEncounter);
  }

  // ##################################################
  // Pre Encounter Logic
  // ##################################################
  enterPreEncounter = (encounterName) => {
    this.sessionData.encounterName = encounterName;
    this.currentPage.eventListeners.removeAll();
    this.currentPage = new PreEncounterPage(
      this.startEncounter,
      this.getReportInitiativeEvent,
      this.otherInitiativeSetEvent,
      this.sessionData.encounterName
    );
    this.update();
  }
  getReportInitiativeEvent = (creatureId) => {
    return () => {
      let reportInitiative = (initiative) => {
        this.sessionData.addCreatureInitiative(creatureId, initiative);
        this.update();
      }
      this.currentPage.eventListeners.expire(this.currentPage.eventListeners.getFromId(creatureId));
      this.currentModal.activateNumberInput("Enter Initiative:", 10, reportInitiative);
    }
  }
  otherInitiativeSetEvent = () => {
    let reportCreatureId = (creatureId) => {
      let reportInitiative = (initiative) => {
        let reportHitpoints = (hitpoints) => {
          this.sessionData.addCreatureInitiative(creatureId, initiative, hitpoints, hitpoints);
          this.update();
        }
        this.currentModal.activateNumberInput("Enter Hitpoints", 20, reportHitpoints);
      }
      this.currentModal.activateNumberInput("Enter Initiative:", 10, reportInitiative);
    }
    this.currentModal.activateTextInput("Enter Creature Name:", "Monster", reportCreatureId);
  }

  // ##################################################
  // Encounter Logic
  // ##################################################
  startEncounter = () => {
    this.currentPage.eventListeners.removeAll();
    this.sessionData.sortInitiativeList();
    this.sessionData.resolveInitiativeListIssues();
    this.currentPage = new EncounterPage(
      this.endEncounter,
      this.sessionData.encounterName,
      this.rip,
      this.delayTurn,
      this.endTurn,
      this.hitCreature,
      this.sessionData
    );
    this.update();
  }
  endEncounter = () => {
    this.currentPage.eventListeners.removeAll();
    this.sessionData = new SessionData();
    this.currentPage = new MainMenuPage(this.selectNewEncounter);
    this.update();
  }
  rip = () => {
    this.sessionData.killCurrentCreature();
    this.update();
  }
  delayTurn = () => {
    this.sessionData.delayTurnCurrentCreature();
    this.update();
  }
  endTurn = () => {
    this.sessionData.endTurnCurrentCreature();
    this.update();
  }
  hitCreature = (creatureId) => {
    let dealDamage = (damageDealt) => {
      this.sessionData.damageCreature(creatureId, damageDealt);
      this.update();
    }
    this.currentModal.activateNumberInput("Enter Damage Delt:", 5, dealDamage);
  }
}