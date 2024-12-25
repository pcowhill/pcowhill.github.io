import { SessionData } from "./DataStructures.js";
import { PageType } from "./Pages.js";

export class CookieHandler {
  constructor() {
    let currentVersion = document.getElementById("version").innerText;
    if (!(this.getCookie("currentVersion") === currentVersion)) {
      this.clearAll();
      this.setCookie("currentVersion", currentVersion);
    }
  }
  getSessionData() {
    return this.decodeSessionData(this.getCookie("sessionData"));
  }
  getPageType() {
    return this.decodePageType(this.getCookie("pageType"));
  }
  save(sessionData, pageType) {
    this.setCookie("sessionData", this.encodeSessionData(sessionData));
    this.setCookie("pageType", this.encodePageType(pageType));
  }
  clearAll() {
    this.deleteCookie("sessionData");
    this.deleteCookie("pageType");
  }

  // ##################################################
  // PageType Encoder/Decoder Logic
  // ##################################################
  decodePageType(encodedString) {
    switch (encodedString) {
      case "":
      case "undefined":
      case "MainMenu":
        return PageType.MainMenu;
      case "PreEncounter":
        return PageType.PreEncounter;
      case "Encounter":
        return PageType.Encounter;
      case "Settings":
        return PageType.Settings;
      default:
        alert("ERROR 1: Invalid PageType; something is wrong...")
    }
  }
  encodePageType(pageType) {
    switch (pageType) {
      case PageType.MainMenu:
        return "MainMenu"
      case PageType.PreEncounter:
        return "PreEncounter"
      case PageType.Encounter:
        return "Encounter"
      case PageType.Settings:
        return "Settings"
      default:
        alert("ERROR 2: Invalid PageType; something is wrong...")
    }
  }

  // ##################################################
  // SessionData Encoder/Decoder Logic
  // ##################################################
  encodeSessionData(sessionData) {
    let dict = {};
    dict.initiativeList = [];
    for (let i = 0; i < sessionData.initiativeList.length; i++) {
      dict.initiativeList.push({
        creatureId: sessionData.initiativeList[i].creatureId,
        initiative: sessionData.initiativeList[i].initiative,
        hitpointsCurrent: sessionData.initiativeList[i].hitpointsCurrent,
        hitpointsMax: sessionData.initiativeList[i].hitpointsMax,
        effects: sessionData.initiativeList[i].effects
      })
    }
    dict.deadList = [];
    for (let i = 0; i < sessionData.deadList.length; i++) {
      dict.deadList.push({
        creatureId: sessionData.deadList[i].creatureId,
        initiative: sessionData.deadList[i].initiative,
        hitpointsCurrent: sessionData.deadList[i].hitpointsCurrent,
        hitpointsMax: sessionData.deadList[i].hitpointsMax,
        effects: sessionData.deadList[i].effects
      })
    }
    dict.encounterName = sessionData.encounterName;
    dict.defaultCharacterIds = sessionData.defaultCharacterIds;
    return JSON.stringify(dict);
  }
  decodeSessionData(encodedString) {
    if (!encodedString.trim()) {
      return new SessionData();
    }
    let dict = JSON.parse(encodedString);
    let sessionData = new SessionData();
    for (let i = 0; i < dict.initiativeList.length; i++) {
      sessionData.addCreatureInitiative(
        dict.initiativeList[i].creatureId,
        dict.initiativeList[i].initiative,
        dict.initiativeList[i].hitpointsCurrent,
        dict.initiativeList[i].hitpointsMax,
        dict.initiativeList[i].effects
      )
    }
    for (let i = 0; i < dict.deadList.length; i++) {
      sessionData.addDeadCreatureInitiative(
        dict.deadList[i].creatureId,
        dict.deadList[i].initiative,
        dict.deadList[i].hitpointsCurrent,
        dict.deadList[i].hitpointsMax,
        dict.deadList[i].effects
      )
    }
    if (dict.encounterName !== undefined) {
      sessionData.encounterName = dict.encounterName;
    }
    if (dict.defaultCharacterIds !== undefined) {
      sessionData.defaultCharacterIds = dict.defaultCharacterIds;
    }
    return sessionData
  }

  // ##################################################
  // Cookie Getter/Setter Logic
  // ##################################################
  setCookie(key, value, days = 365) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${key}=${value};${expires};path=/`;
  }
  getCookie(key) {
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
  deleteCookie(key) {
    document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
}