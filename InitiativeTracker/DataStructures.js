export class HtmlCode {
  constructor(content) {
    if (content == null) {
      this.content = "";
    } else {
      this.content = content;
    }
  }
  append(additionalContent) {
    if (typeof additionalContent === 'string' || additionalContent instanceof String)
      this.content = this.content + additionalContent;
    else
      this.content = this.content + additionalContent.content;
  }
}

export class SessionData {
  constructor() {
    this.initiativeList = [];
    this.deadList = [];
    this.encounterName = "The Encounter";
    this.defaultCharacterIds = ["Bloop", "Cyril", "Nahala", "T'avi", "Toross"];
  }
  addCreatureInitiative(creatureId, initiative, hitpointsCurrent=null, hitpointsMax=null, effects=[]) {
    this.initiativeList.push(new DataEntry(creatureId, initiative, hitpointsCurrent, hitpointsMax, effects));
  }
  addDeadCreatureInitiative(creatureId, initiative, hitpointsCurrent=null, hitpointsMax=null, effects=[]) {
    this.deadList.push(new DataEntry(creatureId, initiative, hitpointsCurrent, hitpointsMax, effects));
  }
  killCurrentCreature() {
    this.deadList.push(this.initiativeList[0]);
    this.initiativeList.splice(0, 1);
  }
  endTurnCurrentCreature() {
    this.initiativeList.push(this.initiativeList[0]);
    this.initiativeList.splice(0, 1);
  }
  delayTurnCurrentCreature() {
    [this.initiativeList[0], this.initiativeList[1]] = [this.initiativeList[1], this.initiativeList[0]];
  }
  editCreatureInitiative(creatureId, newInitiative) {
    for (let i = 0; i < this.initiativeList.length; i++) {
      if (this.initiativeList[i].creatureId === creatureId) {
        this.initiativeList[i].initiative = newInitiative;
        return;
      }
    }
    for (let i = 0; i < this.deadList.length; i++) {
      if (this.deadList[i].creatureId === creatureId) {
        this.deadList[i].initiative = newInitiative;
        return;
      }
    }
  }
  moveCreatureUpOnePosition(creatureId) {
    for (let i = 1; i < this.initiativeList.length; i++) {
      if (this.initiativeList[i].creatureId === creatureId) {
        [this.initiativeList[i-1], this.initiativeList[i]] = [this.initiativeList[i], this.initiativeList[i-1]];
        return;
      }
    }
    alert("ERROR 6: Creature expected, but not found in list; something is wrong...");
  }
  moveCreatureDownOnePosition(creatureId) {
    for (let i = 0; i < this.initiativeList.length - 1; i++) {
      if (this.initiativeList[i].creatureId === creatureId) {
        [this.initiativeList[i], this.initiativeList[i+1]] = [this.initiativeList[i+1], this.initiativeList[i]];
        return;
      }
    }
    alert("ERROR 7: Creature expected, but not found in list; something is wrong...");
  }
  damageCreature(creatureId, damageDealt) {
    for (let i = 0; i < this.initiativeList.length; i++) {
      if (this.initiativeList[i].creatureId === creatureId) {
        this.initiativeList[i].hitpointsCurrent -= damageDealt;
        if (this.initiativeList[i].hitpointsCurrent < 1) {
          this.deadList.push(this.initiativeList[i]);
          this.initiativeList.splice(i, 1);
        }
        break;
      }
    }
  }
  killCreature(creatureId) {
    for (let i = 0; i < this.initiativeList.length; i++) {
      if (this.initiativeList[i].creatureId === creatureId) {
        this.deadList.push(this.initiativeList[i]);
        this.initiativeList.splice(i, 1);
        break;
      }
    }
  }
  reviveCreature(creatureId, hitpoints) {
    for (let i = 0; i < this.deadList.length; i++) {
      if (this.deadList[i].creatureId === creatureId) {
        this.initiativeList.push(this.deadList[i]);
        this.deadList.splice(i, 1);
        if (hitpoints !== undefined) {
          this.initiativeList[this.initiativeList.length - 1].hitpointsCurrent = hitpoints;
        }
        break;
      }
    }
  }
  addEffectToCreature(creatureId, effectName, effectIcon) {
    for (let i = 0; i < this.initiativeList.length; i++) {
      if (this.initiativeList[i].creatureId === creatureId) {
        let effect = {};
        effect.name = effectName;
        effect.icon = effectIcon;
        this.initiativeList[i].effects.push(effect);
        break;
      }
    }
  }
  removeEffectFromCreature(creatureId, effectName) {
    for (let i = 0; i < this.initiativeList.length; i++) {
      if (this.initiativeList[i].creatureId === creatureId) {
        for (let j = 0; j < this.initiativeList[i].effects.length; j++) {
          if (this.initiativeList[i].effects[j].name === effectName) {
            this.initiativeList[i].effects.splice(j, 1);
            return;
          }
        }
      }
    }
  }
  containsCreature(creatureId) {
    for (let i = 0; i < this.initiativeList.length; i++) {
      if (this.initiativeList[i].creatureId === creatureId) {
        return true;
      }
    }
    for (let i = 0; i < this.deadList.length; i++) {
      if (this.deadList[i].creatureId === creatureId) {
        return true;
      }
    }
    return false;
  }
  isCreatureFirst(creatureId) {
    return this.initiativeList[0].creatureId === creatureId;
  }
  isCreatureLast(creatureId) {
    return this.initiativeList[this.initiativeList.length-1].creatureId === creatureId;
  }
  isCreatureAlive(creatureId) {
    for (let i = 0; i < this.initiativeList.length; i++) {
      if (this.initiativeList[i].creatureId === creatureId) {
        return true;
      }
    }
    return false;
  }
  getCreatureDataEntry(creatureId) {
    for (let i = 0; i < this.initiativeList.length; i++) {
      if (this.initiativeList[i].creatureId === creatureId) {
        return this.initiativeList[i];
      }
    }
    for (let i = 0; i < this.deadList.length; i++) {
      if (this.deadList[i].creatureId === creatureId) {
        return this.deadList[i].creatureId;
      }
    }
    alert("ERROR 5: Requested Creature does not exist; something is wrong...");
  }
  sortInitiativeList() {
    this.initiativeList.sort(function (a, b) {
      if (Number(a.initiative) > Number(b.initiative)) {
        return -1;
      } else if (Number(a.initiative) < Number(b.initiative)) {
        return 1;
      } else {
        return 0;
      }
    })
  }
  resolveInitiativeListIssues() {
    // If multiple creatures have the same name, that could be an issue.  This
    // function attempts to resolve that and provide a unique name to each
    // creature.
    let shouldRecheck = false;
    const nameCount = {};
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // First pass: count occurrences of each name
    for (let i = 0; i < this.initiativeList.length; i++) {
      let name = this.initiativeList[i].creatureId;
      if (nameCount[name] === undefined) {
        nameCount[name] = 1;
      } else {
        nameCount[name]++;
      }
    }

    // Second pass: rename duplicates
    const nameIndex = {};
    for (let i = 0; i < this.initiativeList.length; i++) {
      let name = this.initiativeList[i].creatureId;
      if (nameCount[name] > 1) {
        if (nameIndex[name] === undefined) {
          nameIndex[name] = 0;
        } else {
          nameIndex[name]++;
        }
        this.initiativeList[i].creatureId = name + ' ' + alphabet[nameIndex[name] % alphabet.length];
        shouldRecheck = true;
      }
    }

    // Repeat if any names changed
    if (shouldRecheck) {
      this.resolveInitiativeListIssues();
    }
  }
  resetEncounter() {
    // Revive
    for (let i = 0; i < this.deadList.length; i++) {
      this.initiativeList.push(this.deadList[i]);
    }
    this.deadList = [];

    // Heal
    for (let i = 0; i < this.initiativeList.length; i++) {
      this.initiativeList[i].effects = [];
      if (!(this.initiativeList[i].hitpointsCurrent == null)) {
        this.initiativeList[i].hitpointsCurrent = this.initiativeList[i].hitpointsMax;
      }
    }

    // Sort
    this.sortInitiativeList();
  }
}

class DataEntry {
  constructor(creatureId, initiative, hitpointsCurrent=null, hitpointsMax=null, effects=[]) {
    this.creatureId = creatureId;
    this.initiative = initiative;
    this.hitpointsCurrent = hitpointsCurrent;
    this.hitpointsMax = hitpointsMax;
    this.effects = effects;
  }
}