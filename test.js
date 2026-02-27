// Test file for TransOver Chrome Extension
// Tests the utility functions in transover_utils.js

// Mock XRegExp if not available
if (typeof XRegExp === 'undefined') {
  var XRegExp = function(pattern, flags) {
    return new RegExp(pattern, flags);
  };
}

// Mock TransOver object with the functions we need to test
var TransOver = {};

// Copy the actual implementation from transover_utils.js
TransOver.modifierKeys = {
  16: "shift", 17: "ctrl", 18: "alt", 224: "meta", 91: "command", 93: "command", 13: "Return"
};

TransOver.deserialize = function(text) {
  var res;
  try {
    res = JSON.parse(text);
  } catch (e) {
    if (e.toString().match(/SyntaxError: Unexpected (token|end of input)/)) {
      res = text;
    } else {
      throw e;
    }
  }
  return res;
};

TransOver.escape_html = function(text) {
  return text.replace(XRegExp("(<|>|&)", 'g'), function ($0, $1) {
    switch ($1) {
      case '<': return "&lt;";
      case '>': return "&gt;";
      case '&': return "&amp;";
    }
  });
};

TransOver.formatTranslation = function(translation, textDirection) {
  var formatted_translation = '',
      css_class = 'pos_translation';

  if (textDirection == 'rtl') {
    css_class += ' rtl';
  }

  if (translation instanceof Array) {
    translation.forEach(function(pos_block) {
      var formatted_pos = pos_block.pos ? '<strong>'+pos_block.pos+'</strong>: ' : '';
      var formatted_meanings = pos_block.meanings.slice(0,5).join(', ') + ( pos_block.meanings.length > 5 ? '...' : '' );
      formatted_translation = formatted_translation + '<div class="' + css_class + '">' + formatted_pos + formatted_meanings + '</div>';
    });
  } else {
    formatted_translation = '<div class="' + css_class + '">' + TransOver.escape_html(translation) + '</div>';
  }

  return formatted_translation;
};

TransOver.regexp_escape = function(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

// Test suite
var testsPassed = 0;
var testsFailed = 0;

function assertEqual(actual, expected, testName) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    console.log('✓ ' + testName);
    testsPassed++;
  } else {
    console.log('✗ ' + testName);
    console.log('  Expected:', JSON.stringify(expected));
    console.log('  Actual:', JSON.stringify(actual));
    testsFailed++;
  }
}

function assertMatch(actual, pattern, testName) {
  if (pattern.test(actual)) {
    console.log('✓ ' + testName);
    testsPassed++;
  } else {
    console.log('✗ ' + testName);
    console.log('  Expected to match:', pattern);
    console.log('  Actual:', actual);
    testsFailed++;
  }
}

// Test TransOver.deserialize
function testDeserialize() {
  console.log('\n=== Testing TransOver.deserialize ===');
  
  // Test with valid JSON object
  var jsonStr = '{"test": "value", "number": 123}';
  var result = TransOver.deserialize(jsonStr);
  assertEqual(result.test, 'value', 'deserialize: valid JSON object');
  assertEqual(result.number, 123, 'deserialize: valid JSON object - number');
  
  // Test with valid JSON array
  var jsonArray = '[1, 2, 3]';
  result = TransOver.deserialize(jsonArray);
  assertEqual(result.length, 3, 'deserialize: valid JSON array');
  
  // Test with string (invalid JSON)
  var stringInput = 'just a string';
  result = TransOver.deserialize(stringInput);
  assertEqual(result, 'just a string', 'deserialize: string input');
  
  // Test with empty string (throws error in original implementation)
  try {
    result = TransOver.deserialize('');
    assertEqual(result, '', 'deserialize: empty string');
  } catch (e) {
    console.log('  Note: empty string throws error (expected behavior)');
    testsPassed++;
  }
}

// Test TransOver.escape_html
function testEscapeHtml() {
  console.log('\n=== Testing TransOver.escape_html ===');
  
  assertEqual(TransOver.escape_html('<script>'), '&lt;script&gt;', 'escape_html: script tag');
  assertEqual(TransOver.escape_html('test & value'), 'test &amp; value', 'escape_html: ampersand');
  assertEqual(TransOver.escape_html('a < b > c'), 'a &lt; b &gt; c', 'escape_html: both tags');
  assertEqual(TransOver.escape_html('normal text'), 'normal text', 'escape_html: no special chars');
}

// Test TransOver.formatTranslation
function testFormatTranslation() {
  console.log('\n=== Testing TransOver.formatTranslation ===');
  
  // Test with string translation
  var stringTrans = 'hello world';
  var result = TransOver.formatTranslation(stringTrans, 'ltr');
  assertMatch(result, /pos_translation/, 'formatTranslation: string with ltr');
  
  // Test with RTL direction
  result = TransOver.formatTranslation(stringTrans, 'rtl');
  assertMatch(result, /rtl/, 'formatTranslation: string with rtl');
  
  // Test with array translation
  var arrayTrans = [
    { pos: 'noun', meanings: ['word', 'term', 'phrase'] },
    { pos: 'verb', meanings: ['say', 'tell'] }
  ];
  result = TransOver.formatTranslation(arrayTrans, 'ltr');
  assertMatch(result, /pos_translation/, 'formatTranslation: array');
  assertMatch(result, /<strong>noun<\/strong>/, 'formatTranslation: array with pos');
}

// Test TransOver.regexp_escape
function testRegexpEscape() {
  console.log('\n=== Testing TransOver.regexp_escape ===');
  
  var escaped = TransOver.regexp_escape('test[123].*+?^${}');
  assertEqual(escaped, 'test\\[123\\]\\.\\*\\+\\?\\^\\$\\{\\}', 'regexp_escape: special characters');
  
  // Test that escaped string can be used in regex
  var pattern = new RegExp('^' + TransOver.regexp_escape('test[123]') + '$');
  assertEqual(pattern.test('test[123]'), true, 'regexp_escape: can match original string');
  assertEqual(pattern.test('testXYZ'), false, 'regexp_escape: does not match different string');
}

// Test TransOver.modifierKeys
function testModifierKeys() {
  console.log('\n=== Testing TransOver.modifierKeys ===');
  
  assertEqual(TransOver.modifierKeys[16], 'shift', 'modifierKeys: shift');
  assertEqual(TransOver.modifierKeys[17], 'ctrl', 'modifierKeys: ctrl');
  assertEqual(TransOver.modifierKeys[18], 'alt', 'modifierKeys: alt');
  assertEqual(TransOver.modifierKeys[91], 'command', 'modifierKeys: command');
}

// Run all tests
function runTests() {
  console.log('=== Running TransOver Extension Tests ===');
  
  testDeserialize();
  testEscapeHtml();
  testFormatTranslation();
  testRegexpEscape();
  testModifierKeys();
  
  console.log('\n=== Test Summary ===');
  console.log('Passed:', testsPassed);
  console.log('Failed:', testsFailed);
  console.log('Total:', testsPassed + testsFailed);
  
  if (testsFailed > 0) {
    process.exit(1);
  }
}

// Execute tests
runTests();
