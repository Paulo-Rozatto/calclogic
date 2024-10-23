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

const VARS_SET = new Set();

export const SYMBOLS = {
  VAR: /[p-u]/,
  NOT: /\u00AC/,
  AND: /\u2227/,
  OR: /\u2228/,
  CON: /\u2192/, // conditional
  BIC: /\u2194/, // biconditional
  LPR: /\(/, // left parenthesis
  RPR: /\)/, // right parethesis
};

export function tokenize(text) {
  const input = text.trim().split("");
  const tokens = [];
  let erroFlag;
  let col = 1;

  VARS_SET.clear();

  for (const char of input) {
    erroFlag = true;

    for (const [key, symbol] of Object.entries(SYMBOLS)) {
      if (symbol.test(char)) {
        tokens.push({ symbol: key, char, col });
        erroFlag = false;

        if (key == "VAR") {
          VARS_SET.add(char);
        }

        col += 1;
        break;
      }
    }

    if (erroFlag) {
      throw new Error(`Caractere inválido, col ${col}: '${char}'`);
    }
  }

  const vars = Array.from(VARS_SET);
  vars.sort();

  return { tokens, vars };
}
