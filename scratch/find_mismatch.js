const fs = require('fs');

const content = fs.readFileSync('/home/zaidoh/dsw/deepdata-next/components/escalas/EscalasContainer.tsx', 'utf8');

// A simple stack-based JSX tag balancer
const lines = content.split('\n');
const stack = [];

// Regular expression to find JSX tags (simplistic, but handles common cases)
// e.g., <div ...> or </div> or <Shield ... />
const tagRegex = /<(\/?[a-zA-Z0-9_.-]+)(\s|>|\/)/g;

lines.forEach((line, lineIdx) => {
  const lineNum = lineIdx + 1;
  let match;
  // Temporary regex instance to avoid state sharing bugs
  const regex = new RegExp(tagRegex);
  
  while ((match = regex.exec(line)) !== null) {
    const fullTag = match[0];
    let tagName = match[1];
    
    // Ignore self-closing tags like <input />, <Plus />, <Shield />, <span className="..." />
    // Also ignore HTML comments like {/* ... */} or standard strings that might look like tags but are not
    // We can detect self-closing tags if the tag match is followed by / before > on that line
    const isSelfClosing = line.slice(match.index).split('>')[0].trim().endsWith('/');
    
    if (isSelfClosing) {
      continue;
    }
    
    if (tagName.startsWith('/')) {
      tagName = tagName.slice(1);
      if (stack.length === 0) {
        console.log(`[Line ${lineNum}] Extra closing tag found: </${tagName}>`);
      } else {
        const last = stack.pop();
        if (last.name !== tagName) {
          console.log(`[Line ${lineNum}] Mismatched closing tag: </${tagName}>, but expected </${last.name}> (opened on line ${last.line})`);
        }
      }
    } else {
      // Ignore some false positives from comparisons like: f < numFaixas or s < numFaixas or ppIndex < totalPP
      // In TSX, < followed by a name might be a tag, but let's filter out lowercase names that aren't JSX tags in js logic
      // e.g. if (parts.length >= 2), temp.push, etc.
      // A simple heuristic: if it's inside a JS statement (e.g. starts with if, for, while, let, const, etc) or has operator characters nearby, ignore it.
      const isJsComparison = /\b(if|for|while|const|let|var|const|let|return|&&|\|\|)\s*\(?.*?\b[a-zA-Z0-9_]+\s*<\s*/.test(line);
      const isArrowComparison = /<\s*[a-zA-Z0-9_]+\b/.test(line) && !line.includes('>');
      
      if (tagName === 'f' || tagName === 's' || tagName === 'i' || tagName === 'ppIndex' || tagName === 'parts.length') {
        continue;
      }
      
      stack.push({ name: tagName, line: lineNum });
    }
  }
});

if (stack.length > 0) {
  console.log('Unclosed tags remaining on stack:');
  stack.forEach(t => console.log(`  <${t.name}> opened on line ${t.line}`));
} else {
  console.log('All tags are balanced!');
}
