
export class EventListener {
    constructor(elementId, eventType, reaction) {
      this.elementId = elementId;
      this.eventType = eventType;
      this.reaction = reaction;
    }
    add() {
      if (document.getElementById(this.elementId) != null)
        document.getElementById(this.elementId).addEventListener(this.eventType, this.reaction);
    }
    remove() {
      if (document.getElementById(this.elementId) != null)
        document.getElementById(this.elementId).removeEventListener(this.eventType, this.reaction);
    }
    refresh() {
      this.remove();
      this.add();
    }
    isEqual(otherEventListener) {
      if (
        this.elementId == otherEventListener.elementId &&
        this.eventType == otherEventListener.eventType &&
        this.reaction.toString() == otherEventListener.reaction.toString()
      ) {
        return true;
      }
      return false;
    }
  }
  
  export class EventListenerList {
    constructor(list) {
      this.list = list;
    }
    addAll() {
      if (this.list == null)
        return;
      for (let i = 0; i < this.list.length; i++)
        this.list[i].add();
    }
    removeAll() {
      if (this.list == null)
        return;
      for (let i = 0; i < this.list.length; i++)
        this.list[i].remove();
    }
    refreshAll() {
      if (this.list == null)
        return;
      for (let i = 0; i < this.list.length; i++)
        this.list[i].refresh();
    }
    append(newEventListener) {
      this.list.push(newEventListener);
      newEventListener.add();
    }
    expire(expiredEventListener) {
      if (this.list == null)
        return;
      for (let i = 0; i < this.list.length; i++)
        if (this.list[i].isEqual(expiredEventListener)) {
          this.list.splice(i, 1);
          return;
        }
    }
    hasListenerWithId(elementId) {
      for (let i = 0; i < this.list.length; i++)
        if (this.list[i].elementId == elementId) {
          return true;
        }
      return false;
    }
    getFromId(elementId) {
      for (let i = 0; i < this.list.length; i++)
        if (this.list[i].elementId == elementId) {
          return this.list[i];
        }
      return EventListener([]);
    }
  }