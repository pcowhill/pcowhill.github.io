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
  }
  addCreatureInitiative(creatureId, initiative, hitpointsCurrent=null, hitpointsMax=null) {
    this.initiativeList.push(new DataEntry(creatureId, initiative, hitpointsCurrent, hitpointsMax));
  }
  addDeadCreatureInitiative(creatureId, initiative) {
    this.deadList.push(new DataEntry(creatureId, initiative));
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
  damageCreature(creatureId, damageDealt) {
    for (let i = 0; i < this.initiativeList.length; i++) {
      if (this.initiativeList[i].creatureId === creatureId) {
        this.initiativeList[i].hitpointsCurrent -= damageDealt;
        if (this.initiativeList[i].hitpointsCurrent < 1) {
          this.deadList.push(this.initiativeList[i]);
          this.initiativeList.splice(i, 1);
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
      if (!(this.initiativeList[i].hitpointsCurrent == null)) {
        this.initiativeList[i].hitpointsCurrent = this.initiativeList[i].hitpointsMax;
      }
    }

    // Sort
    this.sortInitiativeList();
  }
}

class DataEntry {
  constructor(creatureId, initiative, hitpointsCurrent=null, hitpointsMax=null) {
    this.creatureId = creatureId;
    this.initiative = initiative;
    this.hitpointsCurrent = hitpointsCurrent;
    this.hitpointsMax = hitpointsMax;
  }
}