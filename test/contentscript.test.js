const fs = require('fs');
const path = require('path');

describe('contentscript', () => {
  test('should exist and be a valid JavaScript file', () => {
    const contentscriptPath = path.join(__dirname, '..', 'contentscript.js');
    expect(fs.existsSync(contentscriptPath)).toBe(true);
    
    const content = fs.readFileSync(contentscriptPath, 'utf8');
    expect(content).toContain('document');
    expect(content).toContain('window');
  });
});
