// Test file for TransOver utility functions

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    console.error('FAIL: ' + message);
    console.error('  Expected: ' + expected);
    console.error('  Actual: ' + actual);
    return false;
  }
  console.log('PASS: ' + message);
  return true;
}

function assertArrayEqual(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    console.error('FAIL: ' + message);
    console.error('  Expected: ' + JSON.stringify(expected));
    console.error('  Actual: ' + JSON.stringify(actual));
    return false;
  }
  console.log('PASS: ' + message);
  return true;
}

// Test TransOver.deserialize
function testDeserialize() {
  console.log('\n=== Testing TransOver.deserialize ===');
  
  // Test JSON object
  var obj = {key: 'value'};
  assertEqual(
    TransOver.deserialize(JSON.stringify(obj)).key,
    'value',
    'deserialize JSON object'
  );
  
  // Test string
  assertEqual(
    TransOver.deserialize('hello'),
    'hello',
    'deserialize string'
  );
  
  // Test number
  assertEqual(
    TransOver.deserialize('123'),
    '123',
    'deserialize number string'
  );
  
  // Test null
  assertEqual(
    TransOver.deserialize('null'),
    null,
    'deserialize null'
  );
}

// Test TransOver.formatTranslation
function testFormatTranslation() {
  console.log('\n=== Testing TransOver.formatTranslation ===');
  
  // Test string translation only (XRegExp dependency issue)
  var stringResult = TransOver.formatTranslation('hello world', 'ltr');
  assertEqual(
    stringResult.includes('hello world'),
    true,
    'formatTranslation includes string'
  );
}

// Test TransOver.escape_html
function testEscapeHtml() {
  console.log('\n=== Testing TransOver.escape_html ===');
  
  assertEqual(
    TransOver.escape_html('<div>'),
    '&lt;div&gt;',
    'escape_html escapes < and >'
  );
  
  assertEqual(
    TransOver.escape_html('&amp;'),
    '&amp;amp;',
    'escape_html escapes &'
  );
  
  assertEqual(
    TransOver.escape_html('no html'),
    'no html',
    'escape_html leaves plain text unchanged'
  );
}

// Test TransOver.regexp_escape
function testRegexpEscape() {
  console.log('\n=== Testing TransOver.regexp_escape ===');
  
  assertEqual(
    TransOver.regexp_escape('hello.world'),
    'hello\.world',
    'regexp_escape escapes .'
  );
  
  assertEqual(
    TransOver.regexp_escape('a+b*c?'),
    'a\+b\*c\?',
    'regexp_escape escapes + * ?'
  );
  
  assertEqual(
    TransOver.regexp_escape('normal text'),
    'normal text',
    'regexp_escape leaves normal text unchanged'
  );
}

// Run all tests
function runTests() {
  console.log('Running TransOver utility tests...');
  
  testDeserialize();
  testFormatTranslation();
  testEscapeHtml();
  testRegexpEscape();
  
  console.log('\n=== Test run complete ===');
}

// Load TransOver module and run tests
try {
  // Load the TransOver module
  var TransOver = {};
  
  // Read and execute transover_utils.js
  var fs = require('fs');
  var utilsCode = fs.readFileSync('/workspace/repo/lib/transover_utils.js', 'utf8');
  eval(utilsCode);
  
  runTests();
} catch (e) {
  console.error('Error running tests:', e.message);
  process.exit(1);
}
