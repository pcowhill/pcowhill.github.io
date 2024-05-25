// ============================================
// Import, Initialization, and Preparation
// ============================================
import {
  CATEGORY,
  SECTION,
  SUBSECTION,
  ENTRY,
  textContents
} from "./textContents.js";
let dynamicContent = document.getElementById("dynamicContent");
const ignoreFields = ["type", "description"];

// ============================================
// Compose the page HTML contents
// ============================================
dynamicContent.innerHTML = generateHTMLfromDictionary(textContents);

// ============================================
// Support Functions
// ============================================
function generateHTMLfromDictionary(dict) {
  let returnHTML = "";
  const keys = Object.keys(dict);
  if (keys.includes("description")) {
    returnHTML += tagwrap("i", dict["description"]);
  }
  switch (dict.type) {
    case CATEGORY:
      for (let category of keys) {
        if (ignoreFields.includes(category)) continue;
        returnHTML += tagwrap("h1", category);
        returnHTML += generateHTMLfromDictionary(dict[category]);
      }
      break;
    case SECTION:
      for (let section of keys) {
        if (ignoreFields.includes(section)) continue;
        returnHTML += tagwrap("h2", section);
        returnHTML += generateHTMLfromDictionary(dict[section]);
      }
      break;
    case SUBSECTION:
      for (let subsection of keys) {
        if (ignoreFields.includes(subsection)) continue;
        returnHTML += tagwrap("h3", subsection);
        returnHTML += generateHTMLfromDictionary(dict[subsection]);
      }
      break;
    case ENTRY:
      if (keys.includes("text")) {
        returnHTML += tagwrap("p", dict["text"]);
      }
      if (keys.includes("list")) {
        returnHTML += "<ul>";
        for (let item of dict["list"]) {
          returnHTML += tagwrap("li", item);
        }
        returnHTML += "</ul>";
      }
      break;
    default:
      return "ERROR: INVALID DICTIONARY TYPE."
  }
  return returnHTML;
}

function tagwrap(tag, contents) {
  return "<" + tag + ">" + contents + "</" + tag + ">";
}