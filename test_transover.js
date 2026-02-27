// Test file for TransOver utility functions

function assertEqual(actual, expected, message) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    console.error('FAIL: ' + message);
    console.error('  Expected: ' + expectedStr);
    console.error('  Actual: ' + actualStr);
    return false;
  }
  console.log('PASS: ' + message);
  return true;
}

function assertDeepEqual(actual, expected, message) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    console.error('FAIL: ' + message);
    console.error('  Expected: ' + expectedStr);
    console.error('  Actual: ' + actualStr);
    return false;
  }
  console.log('PASS: ' + message);
  return true;
}

function assertStringEqual(actual, expected, message) {
  if (actual !== expected) {
    console.error('FAIL: ' + message);
    console.error('  Expected: ' + expected);
    console.error('  Actual: ' + actual);
    return false;
  }
  console.log('PASS: ' + message);
  return true;
}

// Load TransOver module
var TransOver = {};

// Source code from transover_utils.js
TransOver.modifierKeys = {
  16: "shift", 17: "ctrl", 18: "alt", 224: "meta", 91: "command", 93: "command", 13: "Return"
};

TransOver.deserialize = function(text) {
  var res;
  try {
    res = JSON.parse(text);
  } catch (e) {
    try {
      res = eval('(' + text + ')');
    } catch (e2) {
      res = null;
    }
  }
  return res;
};

TransOver.formatTranslation = function(translation, direction, syn) {
  var result = '';
  if (translation && translation[0] && translation[0][0]) {
    result += translation[0][0] + '\n';
  }
  if (syn && syn.length > 0) {
    result += 'Synonyms: ' + syn.join(', ') + '\n';
  }
  if (direction) {
    result += 'Direction: ' + direction;
  }
  return result;
};

TransOver.escape_html = function(s) {
  return s.replace(/[<>&]/g, function(c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
    }
  });
};

TransOver.regexp_escape = function(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

// Test deserialize
console.log('\n=== Testing deserialize ===');
assertDeepEqual(TransOver.deserialize('{"a":1}'), {a:1}, 'deserialize JSON object');
assertDeepEqual(TransOver.deserialize('[1,2,3]'), [1,2,3], 'deserialize JSON array');
assertEqual(TransOver.deserialize('"hello"'), 'hello', 'deserialize JSON string');
assertEqual(TransOver.deserialize('invalid'), null, 'deserialize invalid JSON');

// Test escape_html
console.log('\n=== Testing escape_html ===');
assertStringEqual(TransOver.escape_html('<div>'), '&lt;div&gt;', 'escape less than and greater than');
assertStringEqual(TransOver.escape_html('a & b'), 'a &amp; b', 'escape ampersand');
assertStringEqual(TransOver.escape_html('no special'), 'no special', 'no special characters');
assertStringEqual(TransOver.escape_html('<>&'), '&lt;&gt;&amp;', 'escape all special characters');

// Test regexp_escape
console.log('\n=== Testing regexp_escape ===');
assertStringEqual(TransOver.regexp_escape('a.b'), 'a\\.b', 'escape dot');
assertStringEqual(TransOver.regexp_escape('a*b'), 'a\\*b', 'escape asterisk');
assertStringEqual(TransOver.regexp_escape('a+b'), 'a\\+b', 'escape plus');
assertStringEqual(TransOver.regexp_escape('a?b'), 'a\\?b', 'escape question mark');
assertStringEqual(TransOver.regexp_escape('a(b)'), 'a\\(b\\)', 'escape parentheses');
assertStringEqual(TransOver.regexp_escape('a[b]'), 'a\\[b\\]', 'escape brackets');
assertStringEqual(TransOver.regexp_escape('a{b}'), 'a\\{b\\}', 'escape braces');
assertStringEqual(TransOver.regexp_escape('a^b'), 'a\\^b', 'escape caret');
assertStringEqual(TransOver.regexp_escape('a$b'), 'a\\$b', 'escape dollar');
// Test backslash: input "a\\b" contains 3 chars (a, backslash, b), output should be 5 chars (a, 2 backslashes, b)
// In JS: "a\\b" = a + \ + b (3 chars), "a\\\\b" = a + \ + \ + b (4 chars in source, but represents 5 chars when escaped)
var backslashInput = 'a\' + String.fromCharCode(92) + 'b';
var backslashExpected = 'a\' + String.fromCharCode(92) + String.fromCharCode(92) + 'b';
assertStringEqual(TransOver.regexp_escape(backslashInput), backslashExpected, 'escape backslash');
assertStringEqual(TransOver.regexp_escape('a/b'), 'a\\/b', 'escape forward slash');
assertStringEqual(TransOver.regexp_escape('normal text'), 'normal text', 'no special regex chars');

// Test formatTranslation
console.log('\n=== Testing formatTranslation ===');
var translation1 = [['hello'], ['world']];
var syn1 = ['hi', 'greeting'];
var dir1 = 'en->zh';
assertStringEqual(TransOver.formatTranslation(translation1, dir1, syn1), 'hello\nSynonyms: hi, greeting\nDirection: en->zh', 'formatTranslation with all params');

var translation2 = null;
assertStringEqual(TransOver.formatTranslation(translation2, null, []), '', 'formatTranslation with null translation');

var translation3 = [['test']];
assertStringEqual(TransOver.formatTranslation(translation3, null, null), 'test\n', 'formatTranslation with minimal params');

console.log('\n=== All tests completed ===');
