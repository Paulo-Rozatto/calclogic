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

  VARS_SET.clear();

  for (const char of input) {
    erroFlag = true;

    for (const [key, symbol] of Object.entries(SYMBOLS)) {
      if (symbol.test(char)) {
        tokens.push({ symbol: key, char });
        erroFlag = false;

        if (key == "VAR") {
          VARS_SET.add(char);
        }

        break;
      }
    }

    if (erroFlag) {
      throw new Error(`Caractere invalido: ${char}`);
    }
  }

  const vars = Array.from(VARS_SET);
  vars.sort();

  return { tokens, vars };
}
