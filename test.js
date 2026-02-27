// Test file for TranSym Chrome Extension

// Include the RegExp.quote function from background.js
RegExp.quote = function(str) {
  return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
};

// Test RegExp.quote function
function testRegExpQuote() {
  const testCases = [
    { input: "hello", expected: "hello" },
    { input: "hello.world", expected: "hello\\.world" },
    { input: "a*b+c", expected: "a\\*b\\+c" },
    { input: "(test)", expected: "\\(test\\)" },
    { input: "test|sample", expected: "test\\|sample" }
  ];
  
  let passed = 0;
  for (const tc of testCases) {
    const result = RegExp.quote(tc.input);
    if (result === tc.expected) {
      passed++;
    } else {
      console.log(`FAIL: RegExp.quote("${tc.input}") = "${result}", expected "${tc.expected}"`);
    }
  }
  console.log(`RegExp.quote tests: ${passed}/${testCases.length} passed`);
  return passed === testCases.length;
}

// Test ignoreThisPage function
function testIgnoreThisPage() {
  const options = {
    except_urls: ['google\.com', 'facebook\.com']
  };
  
  // Test cases
  const testCases = [
    { url: 'https://google.com', shouldIgnore: true },
    { url: 'https://facebook.com', shouldIgnore: true },
    { url: 'https://example.com', shouldIgnore: false }
  ];
  
  let passed = 0;
  for (const tc of testCases) {
    // Simulate the ignoreThisPage logic
    const ignored = options.except_urls.some(url => new RegExp(url).test(tc.url));
    const result = ignored === tc.shouldIgnore;
    if (result) {
      passed++;
    } else {
      console.log(`FAIL: ignoreThisPage("${tc.url}") = ${ignored}, expected ${tc.shouldIgnore}`);
    }
  }
  console.log(`ignoreThisPage tests: ${passed}/${testCases.length} passed`);
  return passed === testCases.length;
}

// Run all tests
console.log("Running TranSym tests...");
const regexpPassed = testRegExpQuote();
const ignorePassed = testIgnoreThisPage();
const allPassed = regexpPassed && ignorePassed;
console.log(allPassed ? "All tests passed!" : "Some tests failed!");
process.exit(allPassed ? 0 : 1);
