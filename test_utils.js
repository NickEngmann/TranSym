// Test file for TranSym utility functions
// Tests TransOver.deserialize, TransOver.formatTranslation, TransOver.escape_html, TransOver.regexp_escape

var assert = function(condition, message) {
  if (!condition) {
    console.error('FAIL: ' + (message || 'Assertion failed'));
    process.exit(1);
  } else {
    console.log('PASS: ' + message);
  }
};

// Mock XRegExp if not available
if (typeof XRegExp === 'undefined') {
  var XRegExp = function(pattern, flags) {
    return new RegExp(pattern.replace(/\\X\\{[^}]+\\}/g, ''), flags);
  };
}

// Load the utils
var fs = require('fs');
var utilsCode = fs.readFileSync('lib/transover_utils.js', 'utf8');
eval(utilsCode);

// Test deserialize
console.log('Testing TransOver.deserialize...');
assert(TransOver.deserialize('"hello"') === 'hello', 'deserialize string');
assert(TransOver.deserialize('[1,2,3]')[0] === 1, 'deserialize array');
assert(TransOver.deserialize('{"a":1}').a === 1, 'deserialize object');
assert(TransOver.deserialize('plain text') === 'plain text', 'deserialize plain string');

// Test escape_html
console.log('Testing TransOver.escape_html...');
assert(TransOver.escape_html('<div>') === '&lt;div&gt;', 'escape angle brackets');
assert(TransOver.escape_html('a & b') === 'a &amp; b', 'escape ampersand');
assert(TransOver.escape_html('test') === 'test', 'no escape needed');

// Test regexp_escape
console.log('Testing TransOver.regexp_escape...');
var escapedDot = TransOver.regexp_escape('a.b');
console.log('escapedDot = ' + escapedDot);
assert(escapedDot.indexOf('.') === -1, 'escape dot removes special char');
var escapedStar = TransOver.regexp_escape('a*b');
console.log('escapedStar = ' + escapedStar);
assert(escapedStar.indexOf('*') === -1, 'escape asterisk removes special char');
assert(TransOver.regexp_escape('test') === 'test', 'no escape needed');

// Test formatTranslation
console.log('Testing TransOver.formatTranslation...');
var simpleTranslation = 'hello';
var formattedSimple = TransOver.formatTranslation(simpleTranslation, 'ltr');
assert(formattedSimple.indexOf('hello') !== -1, 'simple translation contains text');

var complexTranslation = [{pos: 'noun', meanings: ['word1', 'word2', 'word3', 'word4', 'word5', 'word6']}];
var formattedComplex = TransOver.formatTranslation(complexTranslation, 'ltr');
assert(formattedComplex.indexOf('noun') !== -1, 'complex translation contains POS');
assert(formattedComplex.indexOf('word1') !== -1, 'complex translation contains meanings');
assert(formattedComplex.indexOf('...') !== -1, 'complex translation truncates long list');

console.log('All tests passed!');
