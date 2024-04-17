function validateInput(text) {
  let isValid = false;
  let errorText;
  const checkInvalidChars = /\w{2,}|[^\w\s\(\)\^~|<>-]|\d/;
  const checkInvalidSymbols = /<(?!->)|-(?!>)|[^-]>|^>/;
  const checkParentheses = /\(|\)/g;
  let parentheses;
  let ctrl = 0;

  text = text.match(/[^\s]/g);

  if (text) {
    text = text.join("");
    isValid = true;

    if (checkInvalidChars.test(text) || checkInvalidSymbols.test(text)) {
      errorText = "Caractere inválido";
      isValid = false;
    } else if (!text.match(/\w/)) {
      errorText = "Sintaxe inválida";
      isValid = false;
    } else if ((parentheses = text.match(checkParentheses)) !== null) {
      for (let i = 0; i < parentheses.length; i++) {
        if (parentheses[i] == "(") ctrl++;
        else if (parentheses[i] == ")") ctrl--;
        if (ctrl < 0) break;
      }

      if (ctrl != 0) {
        errorText = "Parenteses inválidos";
        isValid = false;
      }
    }
  } else errorText = "Entrada vazia";

  if (!isValid) {
    errorCol(errorText);
  }

  return {
    isValid,
    text,
  };
}

function printOutput(text) {
    const output = document.getElementById("output")
    output.value = text
}

function readPropositions(text) {
    const propsKeys = []
    const propositions = []
    text = text.match(/\w/g)

    for (let i = 0; i < text.length; i++) {
        if (!propsKeys.includes(text[i])) {

            propsKeys.push(text[i])
        }
    }
    propsKeys.sort()
    for (let i = 0; i < propsKeys.length; i++) {
        propositions[i] = propositionFactory(propsKeys[i], i, propsKeys.length)
    }

    return propositions
}

function propositionFactory(key, order, numberProps) {
    const values = []
    let cont = 0
    let value = true

    if (Array.isArray(arguments[0]) && arguments.length == 1) {
        if (typeof propositionFactory.autoId == 'undefined') {
            propositionFactory.autoId = 0
        }
        propositionFactory.autoId += 1
        return {
            key: propositionFactory.autoId,
            values: arguments[0],
            desc: ""
        }
    }

    for (let i = 0; i < Math.pow(2, numberProps); i++) {
        if (cont >= Math.pow(2, (numberProps - order - 1))) {
            value = !value
            cont = 0
        }
        values[i] = value
        cont++;
    }
    return {
        key,
        values
    }
}

function solveProposition(propositions, begin) {
    if (!propositions) return null
    if (!begin) begin = 0;

    for (let i = begin; i < Input.text.length; i++) {
        if (Input.text[i] == '(') {
            let end = solveProposition(propositions, i + 1)
            if (!end) return null

            const nestedProp = Input.text.slice(i, end)
            const nestedPropVal = unifyProps(nestedProp, propositions)
            if (!nestedPropVal) return null
            const newProp = propositionFactory(nestedPropVal)

            newProp.desc = nestedProp.replace(/\d/g, (n) => {
                return propositions.find(p => p.key == n).desc
            })
            Input.text = Input.text.replace(nestedProp, newProp.key)
            propositions.push(newProp)
        } else if (Input.text[i] == ')') {
            return i + 1
        }
    }

    return unifyProps(Input.text, propositions)
}

function unifyProps(text, propositions) {
    let index

    text = text.replace(/<->/g, "<")
    text = text.replace(/->/g, ">")

    text = text.match(/[a-z]|[\d]+|[<>|\^~]/g)

    for (let i = 0; i < text.length; i++) {
        let prop = propositions.find(p => p.key == text[i])
        if (prop) {
            text[i] = [...prop.values]
        }
    }

    while ((index = text.indexOf("~")) != -1) {

        if (text[index + 1]) {
            if (text[index + 1] != "~") {
                for (let i = 0; i < text[index + 1].length; i++) {
                    text[index + 1][i] = !text[index + 1][i]
                }
                text.splice(index, 1)
            } else {
                text.splice(index, 2)
            }
        } else return null
    }

    while ((index = text.indexOf("^")) != -1) {

        if (text[index + 1] && text[index - 1]) {
            for (let i = 0; i < text[index + 1].length; i++) {
                text[index + 1][i] = text[index + 1][i] && text[index - 1][i]
            }
            text.splice(index - 1, 2)
        } else return null

    }

    while ((index = text.indexOf("|")) != -1) {

        if (text[index + 1] && text[index - 1]) {
            for (let i = 0; i < text[index + 1].length; i++) {
                text[index + 1][i] = text[index + 1][i] || text[index - 1][i]
            }
            text.splice(index - 1, 2)
        } else return null
    }

    while ((index = text.indexOf(">")) != -1) {

        if (text[index + 1] && text[index - 1]) {
            for (let i = 0; i < text[index + 1].length; i++) {
                text[index + 1][i] = (!text[index - 1][i] || text[index + 1][i])
            }
            text.splice(index - 1, 2)
        } else return null

    }

    while ((index = text.indexOf("<")) != -1) {

        if (text[index + 1] && text[index - 1]) {
            for (let i = 0; i < text[index + 1].length; i++) {
                text[index + 1][i] = (!text[index + 1][i] || text[index - 1][i]) && (text[index + 1][i] || !text[index - 1][i])
            }
            text.splice(index - 1, 2)
        } else return null

    }

    return text[0]
}

function Input() {
    Input.text = document.getElementById("input").value
    return Input.text
}

function addTextInput(text) {
    const input = document.getElementById("input");
    const pos = input.selectionStart;

    if (text == 'backspace') {
        input.value = input.value.slice(0, pos - 1) + input.value.slice(pos)
    } else {
        input.value = input.value.slice(0, pos) + text + input.value.slice(pos)
    }
}

function clearInput() {
    const output = document.getElementById("input");
    output.value = ""
}

function setOutput(nCols) {
    const output = document.getElementById('output')
    output.innerHTML = ""
    output.className = `row justify-content-between align-items-center row-cols-${nCols ? nCols: 5}`
}

function addOutputCol(text) {
    const div = document.createElement('div');

    div.className = 'col outcol';

    div.innerHTML = text;

    document.getElementById('output').appendChild(div);
}

function deleteOutput() {
    document.getElementById('output').innerHTML = ""
}

function errorCol(text) {
    setOutput(1)
    addOutputCol(text)
}

function drawTruthTable() {
    let text = Input()
    const validation = validateInput(text)

    if (!validation.isValid) {
        return null
    }

    text = validation.text
    const propositions = readPropositions(text)

    const result = solveProposition(propositions)

    if (!result) {
        errorCol('Erro de sintaxe')
        return null
    }

    setOutput(propositions.length + 1)

    for (let i = 0; i < propositions.length; i++) {
        if (propositions[i].desc) {
            addOutputCol(propositions[i].desc)
        } else {
            addOutputCol(propositions[i].key)
        }
    }
    addOutputCol(text)

    for (let i = 0; i < propositions[0].values.length; i++) {
        for (let j = 0; j < propositions.length; j++) {
            addOutputCol(propositions[j].values[i] ? 'T' : 'F')
        }
        addOutputCol(result[i] ? 'T' : 'F')
    }

    document.getElementById('output').scrollIntoView(true)
}

function copyToClipboard() {
    const output = document.getElementById("output");

    output.select();
    output.setSelectionRange(0, 99999); /*For mobile devices*/
    document.getSelection().removeAllRanges()

    document.execCommand("copy");
    output.selectionEnd = output.selectionStart
}

function workingOn() {
    setOutput(1)
    addOutputCol("Função ainda sendo implementada.")
}