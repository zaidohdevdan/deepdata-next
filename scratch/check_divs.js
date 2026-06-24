const fs = require('fs');
const content = fs.readFileSync('/home/zaidoh/dsw/deepdata-next/components/escalas/EscalasContainer.tsx', 'utf8');

const lines = content.split('\n');

let openDivs = 0;
let closeDivs = 0;

lines.forEach((line, idx) => {
  const lineNum = idx + 1;
  
  // Find all <div (not self-closing) on this line
  // Avoid matching inside comments
  const cleanLine = line.replace(/\{\/\*.*?\*\/\}/g, '').replace(/\/\/.*$/, '');
  
  const openMatches = cleanLine.match(/<div(\s|>)/g) || [];
  const closeMatches = cleanLine.match(/<\/div>/g) || [];
  
  if (openMatches.length > 0 || closeMatches.length > 0) {
    openDivs += openMatches.length;
    closeDivs += closeMatches.length;
    console.log(`[Line ${lineNum}] +${openMatches.length} / -${closeMatches.length} | Total Open: ${openDivs}, Total Closed: ${closeDivs}, Active: ${openDivs - closeDivs}`);
  }
});

console.log(`\nFinal tally - Open divs: ${openDivs}, Close divs: ${closeDivs}, Difference: ${openDivs - closeDivs}`);
