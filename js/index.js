import { solve } from "./solver.js";
import { tokenize } from "./lexer.js";
import { parse } from "./parser.js";

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
  const input = displayText.innerText;
  const { tokens, vars } = tokenize(input);
  const ast = parse(tokens);
  const { result, varsMap } = solve(ast, vars);
  console.log(result);
  buildTable(input, vars, varsMap, result);
}

function addCol(fragment, text) {
  const div = document.createElement("div");
  div.className = "col outcol";
  div.innerText = text;
  fragment.append(div);
}

function buildTable(proposition, varsNames, varsMap, result) {
  const fragment = new DocumentFragment();

  // Header
  for (const varName of varsNames) {
    addCol(fragment, varName);
  }
  addCol(fragment, proposition);

  // Body
  for (let i = 0; i < result.length; i++) {
    for (const varName of varsNames) {
      addCol(fragment, varsMap[varName][i] ? "V" : "F");
    }
    addCol(fragment, result[i] ? "V" : "F");
  }

  output.innerHTML = "";
  output.append(fragment);
  output.style.gridTemplateColumns = `repeat(${varsNames.length + 1}, 1fr)`;
  output.style.display = "grid";
  output.scrollIntoView(true);
}

document
  .querySelectorAll(".operator-button,.var-button")
  .forEach((el) => (el.onclick = onInput));
document.querySelector("#clear-button").onclick = clear;
document.querySelector("#backspace-button").onclick = backspace;
document.querySelector("#brackets-button").onclick = insertBracket;
document.querySelector("#equals-button").onclick = onEnter;
