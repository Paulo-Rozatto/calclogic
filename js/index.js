import { drawTruthTable } from "./script.js";

const displayText = document.querySelector("#display-text");
const displayMessage = document.querySelector("#display-message");
const output = document.querySelector("#output");

function onInput(e) {
  displayText.innerText += e.target.innerText;
  displayText.scrollLeft = displayText.scrollWidth;
}

function backspace() {
  const last = displayText.innerText.length - 1;
  displayText.innerText = displayText.innerText.substring(last, 0) || "\u205f";
}

function clear() {
  displayText.innerText = "\u205f";
  displayMessage.innerText = "\u205f";
  output.style.display = "none";
}

function insertBracket() {
  const text = displayText.innerText;
  const opens = (text.match(/\(/g) || []).length;
  const closes = (text.match(/\)/g) || []).length;

  displayText.innerText += opens <= closes || text.endsWith("(") ? "(" : ")";
  displayText.scrollLeft = displayText.scrollWidth;
}

function onEnter() {
  // temp replacements while main logic isn't refactored
  displayText.innerText = displayText.innerText
    .replaceAll("\u205f", "")
    .replaceAll("\u00ac", "~")
    .replaceAll("\u2227", "^")
    .replaceAll("\u2228", "|")
    .replaceAll("\u2192", "->")
    .replaceAll("\u2194", "<->");

  drawTruthTable();
}

document.querySelectorAll(".operator-button,.var-button").forEach((el) => {
  el.onclick = onInput;
});
document.querySelector("#clear-button").onclick = clear;
document.querySelector("#backspace-button").onclick = backspace;
document.querySelector("#brackets-button").onclick = insertBracket;
document.querySelector("#equals-button").onclick = onEnter;
