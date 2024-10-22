/*
** Ambiguous grammar **
E' -> E
E -> E <> E
E -> E > E
E -> E + E
E -> E * E
E -> ! E
E -> ( E )
E -> id
*/

import * as lexer from "./lexer.js";

const displayText = document.querySelector("#display-text");
document.querySelector("#equals-button").addEventListener("click", init);

let stack = null;
let input = null;
let index = null;
let isAccept = null;

let varMap = null;

// idea: use int and bitwise operators instead of arrays
// the problem would be that JS cast numbers to 32bit when doing bitwise operations

function initVars() {
  const size = 2 ** lexer.VARS_SET.size;
  const vars = Array.from(lexer.VARS_SET);
  vars.sort();
  varMap = {};

  for (let i = 0; i < vars.length; i++) {
    const arr = new Array(size);

    const blockSize = size / 2 ** i;
    const split = blockSize / 2;

    for (let j = 0; j < size; j++) {
      arr[j] = j % blockSize < split;
    }

    varMap[vars[i]] = arr;
  }
}

const BIOPS = {
  AND: (left, right) => left && right,
  OR: (left, right) => left || right,
  CON: (left, right) => !left || right,
  BIC: (left, right) => left === right,
};

function biop(op, left, right) {
  console.log(op);
  const result = new Array(left.length);
  op = BIOPS[op];
  for (let i = 0; i < left.length; i++) {
    result[i] = op(left[i], right[i]);
  }
  return result;
}

function not(vars) {
  const result = new Array(vars.length);
  for (let i = 0; i < vars.length; i++) {
    result[i] = !vars[i];
  }
  return result;
}

function evaluate(el) {
  if (el.symbol == "VAR") {
    console.log("here");
    return varMap[el.char];
  }

  switch (el.children.length) {
    case 1:
      return varMap[el.children[0].char];
    case 2:
      return not(evaluate(el.children[1]));
    case 3:
      const [left, middle, right] = el.children;
      return left.symbol == "LPR"
        ? evaluate(middle)
        : biop(middle.symbol, evaluate(left), evaluate(right));
    default:
      console.error("Operacao errada!", el);
  }
}

function init() {
  index = 0;
  stack = [];
  input = lexer.tokenize(displayText.innerText);
  input.push({ symbol: "$" });

  initVars();

  isAccept = false;

  let action;
  let max = 100;
  while (!isAccept && max > 0) {
    action = SLR[input[0].symbol][index];

    if (!action) {
      console.error(`Error de parser: ${input[0].symbol}::${input[0].char}`);
    }

    action();
    max--;
  }

  if (isAccept) {
    console.log("Good!");
    console.log(stack);
    console.log("oi", evaluate(stack[0]));
  }
}

function shift(id) {
  const token = input.shift();
  stack.push({ ...token, index });
  index = id;
}

function reduce(id) {
  const exp = stack.splice(-R[id]);
  index = exp[0].index;

  stack.push({ symbol: "E", children: exp, index });

  SLR["E"][index]();
}

function goto(id) {
  index = id;
}

function accept() {
  isAccept = true;
}

const shift2 = () => shift(2);
const shift3 = () => shift(3);
const shift4 = () => shift(4);
const shift5 = () => shift(5);
const shift6 = () => shift(6);
const shift7 = () => shift(7);
const shift8 = () => shift(8);
const shift15 = () => shift(15);

const reduce1 = () => reduce(1);
const reduce2 = () => reduce(2);
const reduce3 = () => reduce(3);
const reduce4 = () => reduce(4);
const reduce5 = () => reduce(5);
const reduce6 = () => reduce(6);
const reduce7 = () => reduce(7);

const R = [0, 3, 3, 3, 3, 2, 3, 1];

const SLR = {
  VAR: {
    0: shift4,
    2: shift4,
    3: shift4,
    5: shift4,
    6: shift4,
    7: shift4,
    8: shift4,
  },
  NOT: {
    0: shift2,
    2: shift2,
    3: shift2,
    5: shift2,
    6: shift2,
    7: shift2,
    8: shift2,
  },
  AND: {
    1: shift8,
    4: reduce7,
    9: reduce5,
    10: shift8,
    11: shift8,
    12: shift8,
    13: shift8,
    14: reduce4,
    15: reduce6,
  },
  OR: {
    1: shift7,
    4: reduce7,
    9: reduce5,
    10: shift7,
    11: shift7,
    12: shift7,
    13: reduce3,
    14: reduce4,
    15: reduce6,
  },
  CON: {
    1: shift6,
    4: reduce7,
    9: reduce5,
    10: shift6,
    11: shift6,
    12: reduce2,
    13: reduce3,
    14: reduce4,
    15: reduce6,
  },
  BIC: {
    1: shift5,
    4: reduce7,
    9: reduce5,
    10: shift5,
    11: reduce1,
    12: reduce2,
    13: reduce3,
    14: reduce4,
    15: reduce6,
  },
  LPR: {
    0: shift3,
    2: shift3,
    3: shift3,
    5: shift3,
    6: shift3,
    7: shift3,
    8: shift3,
  },
  RPR: {
    4: reduce7,
    9: reduce5,
    10: shift15,
    11: reduce1,
    12: reduce2,
    13: reduce3,
    14: reduce4,
    15: reduce6,
  },
  $: {
    1: accept,
    4: reduce7,
    9: reduce5,
    11: reduce1,
    12: reduce2,
    13: reduce3,
    14: reduce4,
    15: reduce6,
  },
  E: {
    0: () => goto(1),
    2: () => goto(9),
    3: () => goto(10),
    5: () => goto(11),
    6: () => goto(12),
    7: () => goto(13),
    8: () => goto(14),
  },
};
