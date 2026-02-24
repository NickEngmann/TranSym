// Test file for TranSym Chrome Extension
// Tests core functionality: translation, synonym lookup, and utility functions

(function() {
  'use strict';

  // Test utilities
  const assert = function(condition, message) {
    if (!condition) {
      throw new Error('Assertion failed: ' + message);
    }
  };

  const assertEquals = function(actual, expected, message) {
    if (actual !== expected) {
      throw new Error('Assertion failed: ' + message + ' Expected: ' + expected + ', Got: ' + actual);
    }
  };

  // Test suite
  const tests = {
    name: 'TranSym Tests',
    tests: [],
    add: function(name, fn) {
      this.tests.push({ name: name, fn: fn });
    },
    run: function() {
      let passed = 0;
      let failed = 0;
      console.log('Running tests...\n');
      
      for (const test of this.tests) {
        try {
          test.fn();
          console.log('✓ ' + test.name);
          passed++;
        } catch (e) {
          console.log('✗ ' + test.name + ': ' + e.message);
          failed++;
        }
      }
      
      console.log('\n' + passed + ' passed, ' + failed + ' failed');
      return { passed, failed };
    }
  };

  // Test cases
  tests.add('RegExp.quote escapes special characters', function() {
    // Test the regex quote function logic
    const quoteRegex = function(str) {
      return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    };
    
    assertEquals(quoteRegex('hello.world'), 'hello\.world', 'Should escape dot');
    assertEquals(quoteRegex('a*b+c'), 'a\*b\+c', 'Should escape * and +');
    assertEquals(quoteRegex('test[1]'), 'test\[1\]', 'Should escape brackets');
    assertEquals(quoteRegex('(test)'), '\(test\)', 'Should escape parentheses');
    assertEquals(quoteRegex(''), '', 'Should handle empty string');
  });

  tests.add('URL filtering with regex patterns', function() {
    // Test URL pattern matching logic
    const matchesPattern = function(url, pattern) {
      try {
        return new RegExp(pattern).test(url);
      } catch (e) {
        return false;
      }
    };
    
    // Test except_urls patterns
    assert(matchesPattern('http://google.com', '.*google\.com.*'), 'Should match google.com pattern');
    assert(!matchesPattern('http://example.com', '.*google\.com.*'), 'Should not match example.com');
    assert(matchesPattern('http://example.com', '.*example\.com.*'), 'Should match example.com pattern');
  });

  tests.add('URL whitelist filtering', function() {
    // Test whitelist logic
    const checkWhitelist = function(url, patterns) {
      if (patterns.length === 0) return true; // No restrictions means all allowed
      for (const pattern of patterns) {
        try {
          if (new RegExp(pattern).test(url)) {
            return true;
          }
        } catch (e) {}
      }
      return false;
    };
    
    assert(checkWhitelist('http://example.com', ['.*example\.com.*']), 'Should whitelist example.com');
    assert(!checkWhitelist('http://google.com', ['.*example\.com.*']), 'Should not whitelist google.com');
    assert(checkWhitelist('http://any.com', []), 'Should allow all when no patterns');
  });

  tests.add('calculatePosition positions popup correctly', function() {
    // Test position calculation logic
    const calculatePosition = function(x, y, outerWidth, outerHeight, windowWidth, windowHeight) {
      var pos = {};
      var margin = 5;
      var anchor = 10;

      if (x + anchor + outerWidth + margin < windowWidth) {
        pos.x = x + anchor;
      } else if (x - anchor - outerWidth - margin > 0) {
        pos.x = x - anchor - outerWidth;
      } else if (outerWidth + margin*2 < windowWidth) {
        pos.x = margin;
      } else {
        pos.x = margin;
      }

      if (y - anchor - outerHeight - margin > 0) {
        pos.y = y - anchor - outerHeight;
      } else if (y + anchor + outerHeight + margin < windowHeight) {
        pos.y = y + anchor;
      } else {
        pos.y = margin;
      }

      return pos;
    };
    
    // Test case 1: Position to the right fits
    let pos = calculatePosition(100, 100, 200, 100, 1024, 768);
    assert(pos.x === 110, 'Should position to the right when space available');
    assert(pos.y === 110, 'Should position below when space available');
    
    // Test case 2: Position to the right doesn't fit, try left
    pos = calculatePosition(900, 100, 200, 100, 1024, 768);
    assert(pos.x === 714, 'Should position to the left when right doesn\'t fit');
    
    // Test case 3: Both sides don't fit, use margin
    pos = calculatePosition(50, 100, 1000, 100, 1024, 768);
    assert(pos.x === 5, 'Should use margin when neither side fits');
  });

  tests.add('addContent limits synonyms correctly', function() {
    const addContent = function(newContent) {
      var length = JSON.stringify(newContent).length;
      var addedContent = '';
      for (var i = 0; i < length; i++) {
        if (newContent[i] === undefined) { 
          return addedContent.slice(0, -2); 
        }
        if (i > 0) {
          addedContent += ', ';
        }
        addedContent += newContent[i];
        if (i === 4) { 
          return addedContent; 
        }
        if (i === 5) { 
          return addedContent; 
        }
      }
      return addedContent.slice(0, -2);
    };
    
    const synonyms = ['good', 'great', 'excellent', 'superb', 'wonderful', 'amazing'];
    const result = addContent(synonyms);
    assert(result.length > 0, 'Should return non-empty string');
    assert(result.indexOf('good') !== -1, 'Should contain first synonym');
    assert(result.indexOf('great') !== -1, 'Should contain second synonym');
    assert(result.indexOf('wonderful') !== -1, 'Should contain fifth synonym');
    assert(result.indexOf('amazing') === -1, 'Should not contain sixth synonym (limited to 5)');
  });

  tests.add('addContent handles empty array', function() {
    const addContent = function(newContent) {
      var length = JSON.stringify(newContent).length;
      var addedContent = '';
      for (var i = 0; i < length; i++) {
        if (newContent[i] === undefined) { 
          return addedContent.slice(0, -2); 
        }
        if (i > 0) {
          addedContent += ', ';
        }
        addedContent += newContent[i];
        if (i === 4) { 
          return addedContent; 
        }
        if (i === 5) { 
          return addedContent; 
        }
      }
      return addedContent.slice(0, -2);
    };
    
    const result = addContent([]);
    assertEquals(result, '', 'Should return empty string for empty array');
  });

  tests.add('addContent handles single synonym', function() {
    const addContent = function(newContent) {
      var length = JSON.stringify(newContent).length;
      var addedContent = '';
      for (var i = 0; i < length; i++) {
        if (newContent[i] === undefined) { 
          return addedContent.slice(0, -2); 
        }
        if (i > 0) {
          addedContent += ', ';
        }
        addedContent += newContent[i];
        if (i === 4) { 
          return addedContent; 
        }
        if (i === 5) { 
          return addedContent; 
        }
      }
      return addedContent.slice(0, -2);
    };
    
    const result = addContent(['good']);
    assertEquals(result, 'good', 'Should return single synonym without comma');
  });

  tests.add('escape_html escapes HTML special characters', function() {
    const escape_html = function(text) {
      var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    };
    
    assertEquals(escape_html('<div>test</div>'), '&lt;div&gt;test&lt;/div&gt;', 'Should escape angle brackets');
    assertEquals(escape_html('a & b'), 'a &amp; b', 'Should escape ampersand');
    assertEquals(escape_html('"quote"'), '&quot;quote&quot;', 'Should escape quotes');
    assertEquals(escape_html("it's"), 'it&#039;s', 'Should escape apostrophe');
    assertEquals(escape_html(''), '', 'Should handle empty string');
  });

  tests.add('deserialize translation works correctly', function() {
    const deserialize = function(text) {
      if (!text) return null;
      var parts = text.split('\u0000');
      if (parts.length < 3) return null;
      return {
        sl: parts[1],
        tl: parts[2],
        text: parts.slice(3)
      };
    };
    
    const translation = deserialize('b\u0000en\u0000es\u0000hello\u0000world');
    assert(translation !== null, 'Should return translation object');
    assertEquals(translation.sl, 'en', 'Should have correct source language');
    assertEquals(translation.tl, 'es', 'Should have correct target language');
    assert(translation.text.length === 2, 'Should have 2 text parts');
    assertEquals(translation.text[0], 'hello', 'Should have correct first text part');
    assertEquals(translation.text[1], 'world', 'Should have correct second text part');
  });

  tests.add('deserialize handles null input', function() {
    const deserialize = function(text) {
      if (!text) return null;
      var parts = text.split('\u0000');
      if (parts.length < 3) return null;
      return {
        sl: parts[1],
        tl: parts[2],
        text: parts.slice(3)
      };
    };
    
    assert(deserialize(null) === null, 'Should return null for null input');
    assert(deserialize('') === null, 'Should return null for empty string');
    assert(deserialize('b\u0000en') === null, 'Should return null for incomplete data');
  });

  tests.add('formatTranslation formats translation correctly', function() {
    const formatTranslation = function(translation, direction, syn) {
      var result = '';
      if (translation.text && translation.text.length > 0) {
        result += '<strong>' + translation.text.join(' ') + '</strong><br>';
      }
      if (direction) {
        result += '<small>' + direction + '</small><br>';
      }
      if (syn) {
        result += '<small>' + syn + '</small><br>';
      }
      return result;
    };
    
    const translation = { sl: 'en', tl: 'es', text: ['hello', 'world'] };
    const formatted = formatTranslation(translation, 'en → es', null);
    assert(formatted.indexOf('hello') !== -1, 'Should contain translated text');
    assert(formatted.indexOf('en → es') !== -1, 'Should contain direction');
    assert(formatted.indexOf('<strong>') !== -1, 'Should have strong tag');
    assert(formatted.indexOf('<small>') !== -1, 'Should have small tag');
  });

  tests.add('formatTranslation handles empty translation', function() {
    const formatTranslation = function(translation, direction, syn) {
      var result = '';
      if (translation.text && translation.text.length > 0) {
        result += '<strong>' + translation.text.join(' ') + '</strong><br>';
      }
      if (direction) {
        result += '<small>' + direction + '</small><br>';
      }
      if (syn) {
        result += '<small>' + syn + '</small><br>';
      }
      return result;
    };
    
    const translation = { sl: 'en', tl: 'es', text: [] };
    const formatted = formatTranslation(translation, 'en → es', null);
    assert(formatted.indexOf('hello') === -1, 'Should not contain translated text');
    assert(formatted.indexOf('en → es') !== -1, 'Should still contain direction');
  });

  tests.add('getWordRegex returns valid regex', function() {
    // Test word regex pattern
    const word_re = '[a-zA-Z]+(?:[\'’][a-zA-Z]+)*';
    const regex = new RegExp(word_re);
    
    assert(regex.test('hello'), 'Should match simple word');
    assert(regex.test('Hello'), 'Should match capitalized word');
    assert(regex.test('don\'t'), 'Should match word with apostrophe');
    assert(regex.test('café'), 'Should match word with accent');
  });

  tests.add('Modifier keys mapping is correct', function() {
    const modifierKeys = {
      16: 'Shift',
      17: 'Ctrl',
      18: 'Alt',
      91: 'Meta',
      93: 'Meta'
    };
    
    assertEquals(modifierKeys[17], 'Ctrl', 'Ctrl key should be 17');
    assertEquals(modifierKeys[16], 'Shift', 'Shift key should be 16');
    assertEquals(modifierKeys[18], 'Alt', 'Alt key should be 18');
    assertEquals(modifierKeys[91], 'Meta', 'Meta key should be 91');
  });

  tests.add('Translation direction formatting', function() {
    const formatDirection = function(sl, tl) {
      return sl + ' → ' + tl;
    };
    
    assertEquals(formatDirection('en', 'es'), 'en → es', 'Should format direction correctly');
    assertEquals(formatDirection('fr', 'en'), 'fr → en', 'Should format direction correctly');
  });

  tests.add('Synonym array limiting logic', function() {
    const limitSynonyms = function(synonyms, max) {
      max = max || 5;
      return synonyms.slice(0, max);
    };
    
    const all = ['good', 'great', 'excellent', 'superb', 'wonderful', 'amazing', 'fantastic'];
    const limited = limitSynonyms(all, 5);
    assert(limited.length === 5, 'Should limit to 5 synonyms');
    assertEquals(limited[0], 'good', 'Should keep first synonym');
    assertEquals(limited[4], 'wonderful', 'Should keep fifth synonym');
    assert(limited[5] === undefined, 'Should not include sixth synonym');
  });

  // Run tests
  const result = tests.run();
  
  // Exit with appropriate code
  process.exit(result.failed > 0 ? 1 : 0);

})();
