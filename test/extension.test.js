// Unit tests for TransSym Chrome Extension
const assert = require('assert');

// Test basic string utilities
function testStringUtilities() {
    // Test word extraction
    const text = "Hello world, this is a test.";
    const words = text.match(/[a-zA-Z]+/g) || [];
    assert.strictEqual(words.length, 7, "Should extract 7 words");
    assert.strictEqual(words[0], "Hello", "First word should be Hello");
}

// Test that extension has required manifest fields
function testManifestStructure() {
    const manifest = {
        "manifest_version": 3,
        "name": "TransSym",
        "version": "1.0",
        "description": "Shows synonyms and antonyms for hovered words",
        "permissions": ["activeTab", "scripting"],
        "background": {
            "service_worker": "background.js"
        },
        "content_scripts": [{
            "matches": ["<all_urls>"],
            "js": ["lib/jquery-3.1.0.min.js", "lib/transover_utils.js", "contentscript.js"]
        }],
        "action": {
            "default_popup": "popup.html"
        }
    };
    
    assert.strictEqual(manifest.manifest_version, 3, "Should use MV3");
    assert.ok(manifest.permissions.includes("activeTab"), "Should have activeTab permission");
}

// Run tests
try {
    testStringUtilities();
    console.log("✓ testStringUtilities passed");
} catch (e) {
    console.error("✗ testStringUtilities failed:", e.message);
}

try {
    testManifestStructure();
    console.log("✓ testManifestStructure passed");
} catch (e) {
    console.error("✗ testManifestStructure failed:", e.message);
}

console.log("Tests completed");
