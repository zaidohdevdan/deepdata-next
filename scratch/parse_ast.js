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

const diagnostics = sourceFile.parseDiagnostics;
console.log(`Found ${diagnostics.length} parse diagnostics:`);
diagnostics.forEach(diag => {
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(diag.start);
  console.log(`Error on Line ${line + 1}, Char ${character + 1}: ${diag.messageText}`);
  
  // Print context
  const lines = fileContent.split('\n');
  const startLine = Math.max(0, line - 2);
  const endLine = Math.min(lines.length - 1, line + 2);
  for (let l = startLine; l <= endLine; l++) {
    const marker = (l === line) ? ' > ' : '   ';
    console.log(`${marker}${l + 1}: ${lines[l]}`);
  }
  console.log('-'.repeat(40));
});
