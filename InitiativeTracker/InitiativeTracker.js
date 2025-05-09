import { PageType, MainMenuPage, SettingsPage, PreEncounterPage, EncounterPage, EditDefaultCharacterIdsSubpage } from "./Pages.js";
import { HtmlCode, SessionData } from "./DataStructures.js";
import { Modal } from "./Modal.js";
import { CookieHandler } from "./Cookies.js";
import { EventListener } from "./EventListeners.js";


export class InitiativeTracker {
  constructor(htmlId) {
    this.htmlId = htmlId;
    this.cookieHandler = new CookieHandler();
    // Uncomment temporarily to clear all cookies
    // this.cookieHandler.clearAll();
    this.sessionData = this.cookieHandler.getSessionData();
    this.currentPage = new MainMenuPage(this.selectNewEncounter, this.enterSettings);
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
      case PageType.Settings:
        this.enterMainMenu();
        break;
      default:
        alert("ERROR 3: Invalid PageType; something is wrong...")
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
  enterMainMenu = () => {
    this.currentPage.eventListeners.removeAll();
    this.currentPage = new MainMenuPage(
      this.selectNewEncounter, 
      this.enterSettings
    );
    this.update();
  }
  selectNewEncounter = () => {
    this.currentModal.activateTextInput("Encounter Name:", "Tavern Brawl", this.enterPreEncounter);
  }

  // ##################################################
  // Settings Logic
  // ##################################################
  enterSettings = () => {
    this.currentPage.eventListeners.removeAll();
    this.currentPage = new SettingsPage(this.enterMainMenu, this.enterDefaultCharacterIds);
    this.update();
  }
  // Edit Default Character Ids Subpage
  enterDefaultCharacterIds = () => {
    this.currentPage.eventListeners.removeAll();

    // Logical Functions
    let addCharacter = () => {
      let reportCharacterId = (creatureId) => {
        this.sessionData.defaultCharacterIds.push(creatureId);
        this.update();
      }
      this.currentModal.activateTextInput("Enter Name:", "Hero", reportCharacterId);
    }
    let editCharacter = (defaultCharactersListIndex) => {
      let reportCharacterId = (creatureId) => {
        this.sessionData.defaultCharacterIds[defaultCharactersListIndex] = creatureId;
        this.update();
      }
      let previousName = this.sessionData.defaultCharacterIds[defaultCharactersListIndex];
      this.currentModal.activateTextInput("Enter Name:", previousName, reportCharacterId);
    }
    let removeCharacter = (defaultCharactersListIndex) => {
      let confirmRemove = (creatureId) => {
        this.sessionData.defaultCharacterIds.splice(defaultCharactersListIndex, 1);
        this.update();
      }
      let characterName = this.sessionData.defaultCharacterIds[defaultCharactersListIndex];
      this.currentModal.activateConfirm(`Remove ${characterName}?`, confirmRemove)
    }
    let removeAllCharacters = () => {
      let confirmRemove = (creatureId) => {
        this.sessionData.defaultCharacterIds = [];
        this.update();
      }
      this.currentModal.activateConfirm(`Remove All Characters?`, confirmRemove)
    }
    let presetCharacters = () => {
      let confirmPreset = () => {
        let presetSessionData = new SessionData();
        this.sessionData.defaultCharacterIds = presetSessionData.defaultCharacterIds;
        this.update();
      }
      this.currentModal.activateConfirm("Populate with Presets?", confirmPreset);
    }

    // Make the page
    this.currentPage = new EditDefaultCharacterIdsSubpage(
      this.enterSettings,
      addCharacter,
      editCharacter,
      removeCharacter,
      removeAllCharacters,
      presetCharacters
    )
    this.update();
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
      this.removeAllCreatures,
      this.sessionData.defaultCharacterIds
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
      this.killCreature,
      this.viewCreatureActions,
      this.reviveCreature,
      this.sessionData
    );
    this.update();
  }
  endEncounter = () => {
    let confirmEndEncounter = () => {
      this.currentPage.eventListeners.removeAll();
      this.sessionData.initiativeList = [];
      this.sessionData.deadList = [];
      this.sessionData.encounterName = "The Encounter";
      this.currentPage = new MainMenuPage(this.selectNewEncounter, this.enterSettings);
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
  killCreature = (creatureId) => {
    let confirmKill = () => {
      this.sessionData.killCreature(creatureId);
      this.update();
    }
    this.currentModal.activateConfirm(`Kill ${creatureId}?`, confirmKill);
  }
  viewCreatureActions = (creatureId) => {
    let editInitiative = () => {
      let setInitiative = (newInitiative) => {
        this.sessionData.editCreatureInitiative(creatureId, newInitiative);
        this.update();
      }
      let currentInitiative = this.sessionData.getCreatureDataEntry(creatureId).initiative;
      this.currentModal.activateNumberInput("Enter Initiative:", currentInitiative, setInitiative);
    }
    let moveUpOnePosition = () => {
      this.sessionData.moveCreatureUpOnePosition(creatureId);
      this.update();
    }
    let moveDownOnePosition = () => {
      this.sessionData.moveCreatureDownOnePosition(creatureId);
      this.update();
    }

    let addEffect = () => {
      let selectBaned = () => {
        this.sessionData.addEffectToCreature(creatureId, "BANED", "banedIcon.png");
        this.update();
      }
      let selectProne = () => {
        this.sessionData.addEffectToCreature(creatureId, "PRONE", "proneIcon.png");
        this.update();
      }
      let selectCustom = () => {
        let setName = (name) => {
          let setIcon = (icon) => {
            return () => {
              this.sessionData.addEffectToCreature(creatureId, name.toUpperCase(), icon);
              this.update();
            }
          }
          this.currentModal.activateMultipleChoiceInput(
            "Select Icon",
            [
              `<img class="icon" src="banedIcon.png">`,
              `<img class="icon" src="burnIcon.png">`,
              `<img class="icon" src="frostIcon.png">`,
              `<img class="icon" src="proneIcon.png">`
            ],
            [
              setIcon("banedIcon.png"),
              setIcon("burnIcon.png"),
              setIcon("frostIcon.png"),
              setIcon("proneIcon.png")
            ]
          );
        }
        this.currentModal.activateTextInput("Enter Effect Name:", "Baned", setName);
      }

      this.currentModal.activateMultipleChoiceInput(
        "Select Effect",
        ["Baned", "Prone", "Custom"],
        [selectBaned, selectProne, selectCustom]
      );
    }

    let removeEffect = () => {
      let selectEffect = (effectName) => {
        return () => {
          this.sessionData.removeEffectFromCreature(creatureId, effectName);
          this.update();
        }
      }
      let thisCreature = this.sessionData.getCreatureDataEntry(creatureId);
      let effectNames = [];
      let selectEffectFunctions = [];
      for (let i = 0; i < thisCreature.effects.length; i++) {
        effectNames.push(thisCreature.effects[i].name);
        selectEffectFunctions.push(selectEffect(effectNames[i]));
      }
      this.currentModal.activateMultipleChoiceInput(
        "Select Effect", effectNames, selectEffectFunctions
      );
    }

    let labelsList = [];
    let onSelectFunctionsList = [];

    if (this.sessionData.isCreatureAlive(creatureId)) {
      if (!this.sessionData.isCreatureFirst(creatureId)) {
        labelsList.push("Move Up");
        onSelectFunctionsList.push(moveUpOnePosition);
      }
  
      if (!this.sessionData.isCreatureLast(creatureId)) {
        labelsList.push("Move Down");
        onSelectFunctionsList.push(moveDownOnePosition);
      }
    }

    labelsList.push("Add Effect");
    onSelectFunctionsList.push(addEffect);

    labelsList.push("Remove Effect");
    onSelectFunctionsList.push(removeEffect);
    
    labelsList.push("Edit Initiative");
    onSelectFunctionsList.push(editInitiative);

    this.currentModal.activateMultipleChoiceInput("Select An Action", labelsList, onSelectFunctionsList)
  }
  reviveCreature = (creatureId) => {
    if (this.sessionData.defaultCharacterIds.includes(creatureId)) {
      this.sessionData.reviveCreature(creatureId);
      this.update();
    }
    else {
      let setHealth = (hitpoints) => {
        this.sessionData.reviveCreature(creatureId, hitpoints);
        this.update();
      }
      this.currentModal.activateNumberInput("Enter Hitpoints:", 5, setHealth);
    }
  }
}