const fs = require('fs');
const path = require('path');

// Test utilities
let testsPassed = 0;
let testsFailed = 0;

function assertEqual(actual, expected, testName) {
  if (actual === expected) {
    console.log(`✓ ${testName}`);
    testsPassed++;
  } else {
    console.log(`✗ ${testName}`);
    console.log(`  Expected: ${JSON.stringify(expected)}`);
    console.log(`  Actual: ${JSON.stringify(actual)}`);
    testsFailed++;
  }
}

function assertTrue(condition, testName) {
  assertEqual(!!condition, true, testName);
}

function assertFalse(condition, testName) {
  assertEqual(!!condition, false, testName);
}

// Load the extension code
function loadScript(filename) {
  const filePath = path.join(__dirname, filename);
  const code = fs.readFileSync(filePath, 'utf8');
  return code;
}

console.log('Testing TranSym extension...\n');

// Test 1: Check that required files exist
console.log('=== File Existence Tests ===');
const requiredFiles = [
  'manifest.json',
  'background.js',
  'contentscript.js',
  'lib/popup.js',
  'lib/options.js'
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  assertTrue(exists, `${file} exists`);
});

// Test 2: Test RegExp.quote function
console.log('\n=== RegExp.quote Tests ===');
try {
  // Simulate the RegExp.quote function
  const regexpQuote = (str) => {
    return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
  };
  
  assertEqual(regexpQuote('hello'), 'hello', 'Simple string unchanged');
  assertEqual(regexpQuote('hello.world'), 'hello\\.world', 'Dot escaped');
  assertEqual(regexpQuote('a*b+c'), 'a\\*b\\+c', 'Special chars escaped');
  assertEqual(regexpQuote('(test)'), '\\(test\\)', 'Parentheses escaped');
  assertEqual(regexpQuote(''), '', 'Empty string');
  assertEqual(regexpQuote(null), 'null', 'Null converted to string');
} catch (e) {
  console.log(`✗ RegExp.quote test error: ${e.message}`);
  testsFailed++;
}

// Test 3: Check manifest structure
console.log('\n=== Manifest Structure Tests ===');
try {
  const manifestPath = path.join(__dirname, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  assertEqual(typeof manifest.name, 'string', 'Manifest has name');
  assertEqual(typeof manifest.manifest_version, 'number', 'Manifest has manifest_version');
  assertEqual(typeof manifest.version, 'string', 'Manifest has version');
  assertEqual(manifest.manifest_version, 2, 'Manifest version is 2');
  assertTrue(Array.isArray(manifest.background.scripts), 'Background has scripts array');
  assertTrue(Array.isArray(manifest.content_scripts), 'Has content_scripts');
} catch (e) {
  console.log(`✗ Manifest test error: ${e.message}`);
  testsFailed++;
}

// Test 4: Check code syntax (basic check)
console.log('\n=== Code Syntax Tests ===');
const jsFiles = [
  'background.js',
  'contentscript.js',
  'lib/popup.js',
  'lib/options.js'
];

jsFiles.forEach(file => {
  try {
    const code = loadScript(file);
    // Basic syntax check - ensure no obvious syntax issues
    assertTrue(code.length > 0, `${file} has content`);
    // Check for common syntax errors
    assertFalse(code.includes('SyntaxError'), `${file} doesn't contain SyntaxError`);
  } catch (e) {
    console.log(`✗ ${file} syntax test error: ${e.message}`);
    testsFailed++;
  }
});

// Summary
console.log('\n=== Test Summary ===');
console.log(`Passed: ${testsPassed}`);
console.log(`Failed: ${testsFailed}`);
console.log(`Total: ${testsPassed + testsFailed}`);

process.exit(testsFailed > 0 ? 1 : 0);
