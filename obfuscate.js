const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');

const distDirectory = 'dist/'; // Replace with your actual dist directory

// Get a list of JavaScript files in the dist directory
const jsFiles = fs.readdirSync(distDirectory).filter(file => file.endsWith('.js') && (/^[0-9]/.test(file) || file.startsWith('844')));

// Obfuscate each JavaScript file using javascript-obfuscator
jsFiles.forEach(async file => {
  const filePath = `${distDirectory}/${file}`;
  const outputFilePath = `${distDirectory}/${file.replace(/\.js$/, '.js')}`;

  // Read the content of the file
  const fileContent = fs.readFileSync(filePath, 'utf8');

  // Obfuscate the file content
  const obfuscationResult = JavaScriptObfuscator.obfuscate(fileContent, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: false,
    debugProtectionInterval: 0, // Set to 0 or a positive integer
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    renameGlobals: false,
    rotateStringArray: true,
    selfDefending: true,
    stringArray: true,
    stringArrayEncoding: ['rc4'], // Set as an array
    stringArrayThreshold: 0.75,
    unicodeEscapeSequence: false,
  });

  // Write the obfuscated content to the output file
  fs.writeFileSync(outputFilePath, obfuscationResult.getObfuscatedCode());

  console.log(`Obfuscated ${file} successfully.`);
});

console.log('Obfuscation complete.');
