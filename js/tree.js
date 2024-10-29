const treeRoot = document.querySelector("#tree");
const example = {
    "symbol": "E",
    "children": [
        {
            "symbol": "E",
            "children": [
                {
                    "symbol": "VAR",
                    "char": "p",
                    "col": 1,
                    "index": 0
                }
            ],
            "index": 0
        },
        {
            "symbol": "AND",
            "char": "∧",
            "col": 2,
            "index": 1
        },
        {
            "symbol": "E",
            "children": [
                {
                    "symbol": "VAR",
                    "char": "q",
                    "col": 3,
                    "index": 8
                }
            ],
            "index": 8
        }
    ],
    "index": 0
}

const svg = document.getElementById('ast-visualization');

const radius = 20;
const childXOffset = radius * 3;

function drawCircle(x, y, text) {
    // Create node circle
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", radius);
    circle.setAttribute("class", "node");
    svg.appendChild(circle);

    // Create node label
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", x);
    label.setAttribute("y", y + 5); // Adjusted for vertical centering
    label.setAttribute("class", "label");
    label.textContent = text;
    svg.appendChild(label);
}

function draw(node, x, y, level) {
    const childrenOffset = node.children ? node.children.length : 0;
    const xOffset = (childXOffset * (childrenOffset - 1)) / 2;
    const children = node?.children;

    switch (children?.length) {
        case 1: {
            drawCircle(x, y, children[0].char || children[0].symbol);
            break;
        }
        case 2: {
            drawCircle(x, y, children[0].char || children[0].symbol);

            const childX = x;
            const childY = y + 100; // vertical space between levels

            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", x);
            line.setAttribute("y1", y + radius);
            line.setAttribute("x2", childX);
            line.setAttribute("y2", childY - radius);
            line.setAttribute("class", "line");
            svg.appendChild(line);

            // Recursive call to draw child
            draw(children[1], childX, childY, level + 1);
            break;
        }
        case 3: {
            if (children[0].symbol == "LPR") {
                drawCircle(x, y, "( )");

                const childX = x;
                const childY = y + 100; // vertical space between levels

                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", x);
                line.setAttribute("y1", y + radius);
                line.setAttribute("x2", childX);
                line.setAttribute("y2", childY - radius);
                line.setAttribute("class", "line");
                svg.appendChild(line);

                draw(children[1], childX, childY, level + 1)
                break;
            }

            drawCircle(x, y, children[1].char || children[1].symbol);

            let childX = x - childXOffset;
            let childY = y + 100; // vertical space between levels

            let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", x);
            line.setAttribute("y1", y + radius);
            line.setAttribute("x2", childX);
            line.setAttribute("y2", childY - radius);
            line.setAttribute("class", "line");
            svg.appendChild(line);

            // Recursive call to draw child
            draw(children[0], childX, childY, level + 1);

            childX = x + childXOffset;
            childY = y + 100; // vertical space between levels

            line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", x);
            line.setAttribute("y1", y + radius);
            line.setAttribute("x2", childX);
            line.setAttribute("y2", childY - radius);
            line.setAttribute("class", "line");
            svg.appendChild(line);

            // Recursive call to draw child
            draw(children[2], childX, childY, level + 1);
            break;
        }
    }
}

export function drawTree(ast) {
    svg.innerHTML = "";
    draw(ast, 400, 50, 0);
}

drawTree(example);
