var assert = require('assert');

// Mock DOM environment
var jsdom = require('jsdom');
var { JSDOM } = jsdom;
var dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
});
global.window = dom.window;
global.document = window.document;
global.$ = require('jquery');

// Mock Chrome extension APIs
var chrome = {
  storage: {
    local: {
      get: function(keys, callback) {
        callback({});
      },
      set: function(data, callback) {
        if (callback) callback();
      }
    },
    sync: {
      get: function(keys, callback) {
        callback({});
      }
    }
  },
  runtime: {
    sendMessage: function(msg) {}
  },
  i18n: {
    getMessage: function(msg) {
      return msg;
    }
  }
};
global.chrome = chrome;

// Mock localStorage
var localStorage = (function() {
  var store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    removeItem: function(key) {
      delete store[key];
    },
    clear: function() {
      store = {};
    }
  };
})();
global.localStorage = localStorage;

// Load the TransOver module - it's a global object, not a module
// We need to eval the script to get the global object
var fs = require('fs');
var transoverScript = fs.readFileSync('./lib/transover_utils.js', 'utf8');
eval(transoverScript);

// Test TransOver functions
describe('TransOver', function() {
  describe('deserialize', function() {
    it('should parse valid JSON', function() {
      var result = TransOver.deserialize('{"test": "value"}');
      assert.strictEqual(result.test, 'value');
    });
    
    it('should handle empty string', function() {
      var result = TransOver.deserialize('');
      assert.strictEqual(result, undefined);
    });
  });
  
  describe('serialize', function() {
    it('should serialize object to JSON', function() {
      var result = TransOver.serialize({test: 'value'});
      assert.strictEqual(result, '{"test":"value"}');
    });
  });
  
  describe('escapeHTML', function() {
    it('should escape HTML entities', function() {
      assert.strictEqual(TransOver.escapeHTML('<div>'), '&lt;div&gt;');
      assert.strictEqual(TransOver.escapeHTML('>'), '&gt;');
      assert.strictEqual(TransOver.escapeHTML('&'), '&amp;');
    });
  });
  
  describe('regexp_escape', function() {
    it('should escape regex special characters', function() {
      assert.strictEqual(TransOver.regexp_escape('a.b'), 'a\.b');
      assert.strictEqual(TransOver.regexp_escape('a*b'), 'a\*b');
      assert.strictEqual(TransOver.regexp_escape('a+b'), 'a\+b');
    });
  });
});

// Test Options module - it's also a global object
var optionsScript = fs.readFileSync('./lib/options.js', 'utf8');
eval(optionsScript);

describe('Options', function() {
  before(function() {
    // Clear localStorage
    localStorage.clear();
  });
  
  describe('except_urls', function() {
    it('should store URLs as comma-separated string', function() {
      Options.except_urls(['example.com', 'test.com']);
      assert.strictEqual(localStorage.getItem('except_urls'), 'example.com,test.com');
    });
    
    it('should return stored URLs', function() {
      localStorage.setItem('except_urls', 'url1,url2');
      var urls = Options.except_urls();
      assert.deepStrictEqual(urls, ['url1', 'url2']);
    });
  });
  
  describe('popup_show_trigger', function() {
    it('should store and return trigger value', function() {
      Options.popup_show_trigger('ctrl');
      assert.strictEqual(Options.popup_show_trigger(), 'ctrl');
    });
    
    it('should return default value when not set', function() {
      localStorage.removeItem('popup_show_trigger');
      assert.strictEqual(Options.popup_show_trigger(), 'alt');
    });
  });
});

// Test ignoreThisPage function - it's defined in contentscript.js
var contentscriptScript = fs.readFileSync('./lib/contentscript.js', 'utf8');
eval(contentscriptScript);

describe('ignoreThisPage', function() {
  it('should return true for matching URLs', function() {
    var options = { except_urls: ['example\.com'] };
    assert.strictEqual(ignoreThisPage(options), true);
  });
  
  it('should return false for non-matching URLs', function() {
    var options = { except_urls: ['test\.com'] };
    assert.strictEqual(ignoreThisPage(options), false);
  });
});
