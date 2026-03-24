#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const plasmoDir = path.join(__dirname, '..', '.plasmo');

// Define HTML templates with their titles and script sources
const templates = [
  { name: 'devtools', title: 'DevTools' },
  { name: 'newtab', title: 'New Tab' },
  { name: 'options', title: 'Options' },
  { name: 'popup', title: 'Popup' },
  { name: 'sidepanel', title: 'Side Panel' },
];

// HTML template generator function
function generateHTMLTemplate(scriptName, pageTitle) {
  return `<!DOCTYPE html>
<html>
  <head>
    <title>${pageTitle}</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>

  <body>
    <div id="__plasmo"></div>
    <script src="./static/${scriptName}.tsx" type="module"></script>
  </body>
</html>
`;
}

// Generate HTML files
templates.forEach((template) => {
  const filePath = path.join(plasmoDir, `${template.name}.html`);
  const content = generateHTMLTemplate(template.name, template.title);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Generated: ${filePath}`);
});

console.log('HTML templates generated successfully!');
