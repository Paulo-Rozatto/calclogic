const BIOPS = {
  AND: (left, right) => left && right,
  OR: (left, right) => left || right,
  CON: (left, right) => !left || right,
  BIC: (left, right) => left === right,
};

let varsMap = null;

function initVars(vars) {
  const size = 2 ** vars.length;
  vars.sort();

  varsMap = {};

  for (let i = 0; i < vars.length; i++) {
    const arr = new Array(size);

    const blockSize = size / 2 ** i;
    const split = blockSize / 2;

    for (let j = 0; j < size; j++) {
      arr[j] = j % blockSize < split;
    }

    varsMap[vars[i]] = arr;
  }
}

function biop(op, left, right) {
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
  switch (el.children.length) {
    case 1:
      return varsMap[el.children[0].char];
    case 2:
      return not(evaluate(el.children[1]));
    case 3:
      const [left, middle, right] = el.children;
      return left.symbol == "LPR"
        ? evaluate(middle)
        : biop(middle.symbol, evaluate(left), evaluate(right));
    default:
      console.error("Operação inválida!", el);
      throw new Error(`Operação '${el.symbol}' inválida!`);
  }
}

export function solve(ast, varsSet) {
  initVars(varsSet);
  return { result: evaluate(ast[0]), varsMap };
}
