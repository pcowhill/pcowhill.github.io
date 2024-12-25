import { HtmlCode } from "./DataStructures.js";
import { EventListener, EventListenerList } from "./EventListeners.js";

export const ModalType = {
  Confirm: 0,
  NumberInput: 1,
  TextInput: 2,
  MultipleChoiceInput: 3
}

export class Modal {
  constructor(ownerUpdateFunction) {
    this.ownerUpdateFunction = ownerUpdateFunction;
    this.eventListeners = new EventListenerList([]);
    this.isActive = false;
    this.defaultNumber = 10;
    this.defaultText = "Monster";
  }

  // ##################################################
  // Confirm Logic
  // ##################################################
  activateConfirm(prompt, onSubmitFunction) {
    this.modalType = ModalType.Confirm;
    this.prompt = prompt;
    this.eventListeners = new EventListenerList([
      new EventListener("confirmApprove", "click", () => {this.deactivate(); onSubmitFunction();}),
      new EventListener("confirmDeny", "click", this.deactivate)
    ]);
    this.isActive = true;
    this.ownerUpdateFunction();
  }

  // ##################################################
  // Number Input Logic
  // ##################################################
  activateNumberInput(prompt, defaultNumber, onSubmitFunction) {
    this.modalType = ModalType.NumberInput;
    this.prompt = prompt;
    this.defaultNumber = defaultNumber;
    this.eventListeners = new EventListenerList([
      new EventListener("submit", "click", () => {this.processNumberInput(onSubmitFunction);})
    ]);
    this.isActive = true;
    this.ownerUpdateFunction();
  }
  processNumberInput(onSubmitFunction) {
    if (
      !Number.isInteger(Number(document.getElementById("modalInput").value))
      || !(document.getElementById("modalInput").value.trim())
    ) {
      alert('"' + document.getElementById("modalInput").value + '" is invalid input.');
      document.getElementById("modalInput").value = this.defaultNumber.toString();
      document.getElementById("modalInput").focus();
      return;
    }
    let value = document.getElementById("modalInput").value;
    this.deactivate();
    onSubmitFunction(value);
  }

  // ##################################################
  // Text Input Logic
  // ##################################################
  activateTextInput(prompt, defaultText, onSubmitFunction) {
    this.modalType = ModalType.TextInput;
    this.prompt = prompt;
    this.defaultText = defaultText;
    this.eventListeners = new EventListenerList([
      new EventListener("submit", "click", () => {this.processTextInput(onSubmitFunction);})
    ])
    this.isActive = true;
    this.ownerUpdateFunction();
  }
  processTextInput(onSubmitFunction){
    if (!(document.getElementById("modalInput").value.trim())) {
      alert('"' + document.getElementById("modalInput").value + '" is invalid input.');
      document.getElementById("modalInput").value = this.defaultText;
      document.getElementById("modalInput").focus();
      return;
    }
    let value = document.getElementById("modalInput").value;
    this.deactivate();
    onSubmitFunction(value);
  }

  // ##################################################
  // Multiple Choice Input Logic
  // ##################################################
  activateMultipleChoiceInput(prompt, labelsList, onSelectFunctionsList) {
    this.modalType = ModalType.MultipleChoiceInput;
    this.prompt = prompt;
    this.labelsList = labelsList;
    this.eventListeners = new EventListenerList([]);
    if (labelsList.length !== onSelectFunctionsList.length) {
      alert("ERROR 4: Invalid list length; something is wrong...")
    }
    for (let i = 0; i < labelsList.length; i++) {
      this.eventListeners.append(new EventListener(`option-${i}`, "click", () => {this.deactivate(); onSelectFunctionsList[i]();}));
    }
    this.eventListeners.append(new EventListener(`cancel`, "click", this.deactivate));
    this.isActive = true;
    this.ownerUpdateFunction();
  }

  // ##################################################
  // Other Functions
  // ##################################################
  deactivate = () => {
    this.isActive = false;
    this.eventListeners = new EventListenerList([]);
    this.ownerUpdateFunction();
  }
  getHtml () {
    if (!this.isActive) {
      return new HtmlCode();
    }
    switch (this.modalType) {
      case ModalType.Confirm:
        return new HtmlCode(`
          <div id="confirm" class="confirm">
            <div class="confirm-content">
              <h1 id="confirmPrompt">${this.prompt}</h1>
              <button id="confirmApprove" class="prompt">Yes</button>
              <button id="confirmDeny" class="prompt">No</button>
            </div>
          </div>
        `);
      case ModalType.NumberInput:
        return new HtmlCode(`
          <div id="modal" class="modal">
            <div class="modal-content">
              <h1 id="modalPrompt">${this.prompt}</h1>
              <input type="number" id="modalInput" class="modalInput" onfocus="this.select()" autofocus>
              <button id="submit" class="prompt">Submit</button>
            </div>
          </div>
        `);
      case ModalType.TextInput:
        return new HtmlCode(`
          <div id="modal" class="modal">
            <div class="modal-content">
              <h1 id="modalPrompt">${this.prompt}</h1>
              <input type="text" id="modalInput" class="modalInput" onfocus="this.select()" autofocus>
              <button id="submit" class="prompt">Submit</button>
            </div>
          </div>
        `);
      case ModalType.MultipleChoiceInput:
        let htmlCode = new HtmlCode(``)
        htmlCode.append(`
          <div id="modal" class="modal">
            <div class="modal-content">
              <h1 id="modalPrompt">${this.prompt}</h1>
        `);
        for (let i = 0; i < this.labelsList.length; i++) {
          htmlCode.append(`
            <button id="option-${i}" class="moreActions">${this.labelsList[i]}</button><br>
          `)
        }
        htmlCode.append(`
              <br>
              <button id="cancel" class="moreActions">Cancel</button>
            </div>
          </div>
        `)
        return htmlCode;
      default:
        alert("Invalid ModalType; something is wrong...")
    }
  }
  refreshAll () {
    if (document.getElementById("modalInput")) {
      if (!(document.getElementById("modalInput").value.trim())) {
        switch (this.modalType) {
          case ModalType.NumberInput:
            document.getElementById("modalInput").value = this.defaultNumber.toString();
            break;
          case ModalType.TextInput:
            document.getElementById("modalInput").value = this.defaultText;
            break;
        }
      }
      document.getElementById("modalInput").focus();
    }
    this.eventListeners.refreshAll();
  }
}