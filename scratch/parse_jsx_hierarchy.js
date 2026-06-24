const ts = require('typescript');
const fs = require('fs');

const fileName = '/home/zaidoh/dsw/deepdata-next/components/escalas/EscalasContainer.tsx';
const fileContent = fs.readFileSync(fileName, 'utf8');

const sourceFile = ts.createSourceFile(
  fileName,
  fileContent,
  ts.ScriptTarget.Latest,
  true
);

function getLine(pos) {
  return sourceFile.getLineAndCharacterOfPosition(pos).line + 1;
}

function traceNode(node, depth = 0) {
  if (depth > 3) return;
  if (ts.isJsxElement(node)) {
    const opening = node.openingElement;
    const closing = node.closingElement;
    const startLine = getLine(opening.getStart());
    const endLine = closing ? getLine(closing.getStart()) : 'UNCLOSED';
    console.log('  '.repeat(depth) + `<${opening.tagName.getText()}> (Line ${startLine} to ${endLine})`);
    node.children.forEach(child => traceNode(child, depth + 1));
  } else if (ts.isJsxSelfClosingElement(node)) {
    const startLine = getLine(node.getStart());
    console.log('  '.repeat(depth) + `<${node.tagName.getText()} /> (Line ${startLine})`);
  } else if (ts.isJsxExpression(node)) {
    const startLine = getLine(node.getStart());
    const endLine = getLine(node.getEnd());
    console.log('  '.repeat(depth) + `{ Expression } (Line ${startLine} to ${endLine})`);
    if (node.expression) {
      traceNode(node.expression, depth + 1);
    }
  } else {
    ts.forEachChild(node, child => traceNode(child, depth));
  }
}

let targetNode = null;
function findTarget(node) {
  if (ts.isJsxExpression(node)) {
    const line = getLine(node.getStart());
    if (line >= 920 && line <= 940) {
      targetNode = node;
      return;
    }
  }
  ts.forEachChild(node, findTarget);
}

findTarget(sourceFile);

if (targetNode) {
  console.log(`Found target JSX Expression starting on line ${getLine(targetNode.getStart())}:`);
  traceNode(targetNode);
} else {
  console.log("Could not find the target JSX Expression in the line range 920-940.");
}
