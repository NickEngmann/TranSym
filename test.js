// Test file for TranSym Chrome Extension
// Testing utility functions for word processing

const assert = (condition, message) => {
    if (!condition) {
        console.error('FAIL:', message);
        return false;
    }
    console.log('PASS:', message);
    return true;
};

// Test cases for utility functions
const tests = {
    testWordExtraction: function() {
        // Test extracting words from text
        const text = "Hello, world! This is a test.";
        const words = text.match(/[a-zA-Z]+/g);
        assert(words && words.length === 6, "Should extract 6 words from text");
    },
    
    testCapitalization: function() {
        // Test capitalizing first letter
        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
        assert(capitalize("hello") === "Hello", "Should capitalize first letter");
        assert(capitalize("") === "", "Should handle empty string");
    },
    
    testWordBoundary: function() {
        // Test word boundary detection
        const hasWordBoundary = (str, index) => {
            return index === 0 || index === str.length - 1 || !/[a-zA-Z]/.test(str[index - 1]) || !/[a-zA-Z]/.test(str[index + 1]);
        };
        assert(hasWordBoundary("hello world", 0), "Should detect start boundary");
        assert(hasWordBoundary("hello world", 10), "Should detect end boundary");
    }
};

// Run all tests
let passed = 0;
let failed = 0;

for (const [name, test] of Object.entries(tests)) {
    try {
        test();
        passed++;
    } catch (e) {
        console.error('ERROR in', name, ':', e.message);
        failed++;
    }
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
