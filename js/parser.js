/*
** Ambiguous grammar **
0) E' -> E
1) E -> E <> E
2) E -> E > E
3) E -> E + E
4) E -> E * E
5) E -> ! E
6) E -> ( E )
7) E -> id
*/

let stack = null;
let tokens = null;
let index = null;
let isAccept = null;

function shift(id) {
  const token = tokens.shift();
  stack.push({ ...token, index });
  index = id;
}

function reduce(id) {
  const exp = stack.splice(-REDUCE_SIZE[id]);
  index = exp[0].index;

  stack.push({ symbol: "E", children: exp, index });

  SLR_TABLE["E"][index]();
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

const REDUCE_SIZE = [0, 3, 3, 3, 3, 2, 3, 1];

const SLR_TABLE = {
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

// idea: use int and bitwise operators instead of arrays
// the problem would be that JS cast numbers to 32bit when doing bitwise operations

export function parse(input) {
  index = 0;
  stack = [];
  tokens = [...input];
  tokens.push({ symbol: "$" });

  isAccept = false;

  let action;
  let max = 100;
  while (!isAccept && max > 0) {
    action = SLR_TABLE[tokens[0].symbol][index];

    if (!action) {
      console.error(`Error de parser: ${tokens[0].symbol}::${tokens[0].char}`);
    }

    action();
    max--;
  }

  if (isAccept) {
    return stack;
  }

  return [];
}
