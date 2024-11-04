import { PageType, MainMenuPage, PreEncounterPage, EncounterPage } from "./Pages.js";
import { HtmlCode, SessionData } from "./DataStructures.js";
import { Modal } from "./Modal.js";
import { CookieHandler } from "./Cookies.js";
import { EventListener } from "./EventListeners.js";


export class InitiativeTracker {
  constructor(htmlId) {
    this.htmlId = htmlId;
    this.cookieHandler = new CookieHandler();
    this.sessionData = this.cookieHandler.getSessionData();
    this.currentPage = new MainMenuPage(this.selectNewEncounter);
    this.currentModal = new Modal(this.update);
    switch (this.cookieHandler.getPageType()) {
      case PageType.MainMenu:
        break;
      case PageType.PreEncounter:
        this.enterPreEncounter(this.sessionData.encounterName);
        break;
      case PageType.Encounter:
        this.confirmStartEncounter();
        break;
      default:
        alert("Invalid PageType; something is wrong...")
    }
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
      this.endEncounter,
      this.getReportInitiativeEvent,
      this.otherInitiativeSetEvent,
      this.sessionData.encounterName,
      this.editInitiative,
      this.removeCreature,
      this.removeAllCreatures
    );
    this.update();
  }
  getReportInitiativeEvent = (creatureId) => {
    return () => {
      let reportInitiative = (initiative) => {
        this.sessionData.addCreatureInitiative(creatureId, initiative);
        this.update();
      }
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
    this.currentModal.activateTextInput("Enter Name:", "Monster", reportCreatureId);
  }
  editInitiative = (initiativeListIndex) => {
    if (this.sessionData.initiativeList[initiativeListIndex].hitpointsCurrent == null) {
      let updateInitiative = (initiative) => {
        this.sessionData.initiativeList[initiativeListIndex].initiative = initiative;
        this.update();
      }
      this.currentModal.activateNumberInput("Enter Initiative", this.sessionData.initiativeList[initiativeListIndex].initiative, updateInitiative);
    }
    else {
      let updateCreatureId = (creatureId) => {
        let updateInitiative = (initiative) => {
          let updateHitpoints = (hitpoints) => {
            this.sessionData.initiativeList[initiativeListIndex].creatureId = creatureId;
            this.sessionData.initiativeList[initiativeListIndex].initiative = initiative;
            this.sessionData.initiativeList[initiativeListIndex].hitpointsCurrent = hitpoints;
            this.sessionData.initiativeList[initiativeListIndex].hitpointsMax = hitpoints;
            this.update();
          }
          this.currentModal.activateNumberInput("Enter Hitpoints:", this.sessionData.initiativeList[initiativeListIndex].hitpointsCurrent, updateHitpoints);
        }
        this.currentModal.activateNumberInput("Enter Initiative:", this.sessionData.initiativeList[initiativeListIndex].initiative, updateInitiative);
      }
      this.currentModal.activateTextInput("Enter Name:", this.sessionData.initiativeList[initiativeListIndex].creatureId, updateCreatureId);
    }
  }
  removeCreature = (initiativeListIndex) => {
    let confirmRemove = () => {
      this.sessionData.initiativeList.splice(initiativeListIndex, 1);
      this.update();
    }
    this.currentModal.activateConfirm(`Remove ${this.sessionData.initiativeList[initiativeListIndex].creatureId}?`, confirmRemove);
  }
  removeAllCreatures = () => {
    let confirmRemoveAll = () => {
      this.sessionData.initiativeList = [];
      this.update();
    }
    this.currentModal.activateConfirm(`Remove all creatures?`, confirmRemoveAll);
  }

  // ##################################################
  // Encounter Logic
  // ##################################################
  startEncounter = () => {
    this.currentModal.activateConfirm("Start Encounter?", this.confirmStartEncounter);
  }
  confirmStartEncounter = () => {
    this.currentPage.eventListeners.removeAll();
    this.sessionData.sortInitiativeList();
    this.sessionData.resolveInitiativeListIssues();
    this.currentPage = new EncounterPage(
      this.endEncounter,
      this.resetEncounter,
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
    let confirmEndEncounter = () => {
      this.currentPage.eventListeners.removeAll();
      this.sessionData = new SessionData();
      this.currentPage = new MainMenuPage(this.selectNewEncounter);
      this.update();
    }
    this.currentModal.activateConfirm("End encounter?", confirmEndEncounter);
  }
  resetEncounter = () => {
    let confirmResetEncounter = () => {
      this.sessionData.resetEncounter();
      this.enterPreEncounter(this.sessionData.encounterName);
    }
    this.currentModal.activateConfirm("Reset encounter?", confirmResetEncounter);
  }
  rip = () => {
    let confirmRip = () => {
      this.sessionData.killCurrentCreature();
      this.update();
    }
    this.currentModal.activateConfirm(`Kill ${this.sessionData.initiativeList[0].creatureId}?`, confirmRip);
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