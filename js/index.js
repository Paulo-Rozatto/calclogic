const displayText = document.querySelector("#display-text");
const displayMessage = document.querySelector("#display-message");

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
}

function onEnter() {
  displayMessage.innerText = "Not Implemented Error";
}

document.querySelectorAll(".operator-button,.var-button").forEach((el) => {
  el.onclick = onInput;
});
document.querySelector("#clear-button").onclick = clear;
document.querySelector("#backspace-button").onclick = backspace;
document.querySelector("#brackets-button").onclick = null;
document.querySelector("#equals-button").onclick = onEnter;
