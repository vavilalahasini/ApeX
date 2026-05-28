/**
 * Contact Form Security Test Script
 * Tests various security measures of the contact form API
 */

const API_URL = process.env.NEXT_PUBLIC_SITE_URL 
  ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/contact`
  : 'http://localhost:3000/api/contact';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testSecurity(testName, testData, expectedStatus = 201) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    
    if (response.status === expectedStatus) {
      log(`✓ ${testName}: PASSED (Status: ${response.status})`, 'green');
      return true;
    } else {
      log(`✗ ${testName}: FAILED (Expected: ${expectedStatus}, Got: ${response.status})`, 'red');
      log(`  Response: ${JSON.stringify(result)}`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`✗ ${testName}: ERROR - ${error.message}`, 'red');
    return false;
  }
}

async function runTests() {
  log('\n=== Contact Form Security Tests ===\n', 'blue');

  const validData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    company: 'Test Company',
    currentWebsite: '',
    service: 'Web Development',
    message: 'This is a test message for the contact form.',
    website: '', // Honeypot field
  };

  let passed = 0;
  let failed = 0;

  // Test 1: Valid submission
  if (await testSecurity('Valid submission', validData)) passed++;
  else failed++;

  // Test 2: Missing required field
  if (await testSecurity('Missing required field (firstName)', { ...validData, firstName: '' }, 400)) passed++;
  else failed++;

  // Test 3: Invalid email
  if (await testSecurity('Invalid email', { ...validData, email: 'invalid-email' }, 400)) passed++;
  else failed++;

  // Test 4: XSS attempt in message
  if (await testSecurity('XSS attempt in message', { ...validData, message: '<script>alert("xss")</script>' }, 400)) passed++;
  else failed++;

  // Test 5: Honeypot field filled (bot detection)
  if (await testSecurity('Honeypot field filled', { ...validData, website: 'spam' }, 400)) passed++;
  else failed++;

  // Test 6: Message too short
  if (await testSecurity('Message too short', { ...validData, message: 'short' }, 400)) passed++;
  else failed++;

  // Test 7: Invalid URL in currentWebsite
  if (await testSecurity('Invalid URL', { ...validData, currentWebsite: 'not-a-url' }, 400)) passed++;
  else failed++;

  // Test 8: SQL injection pattern
  if (await testSecurity('SQL injection pattern', { ...validData, message: "'; DROP TABLE users; --" }, 400)) passed++;
  else failed++;

  // Test 9: JavaScript injection
  if (await testSecurity('JavaScript injection', { ...validData, message: 'javascript:alert(1)' }, 400)) passed++;
  else failed++;

  // Test 10: Empty service selection
  if (await testSecurity('Empty service selection', { ...validData, service: '' }, 400)) passed++;
  else failed++;

  log('\n=== Test Summary ===', 'blue');
  log(`Passed: ${passed}`, 'green');
  log(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  log(`Total: ${passed + failed}\n`, 'reset');

  return failed === 0;
}

// Run tests
runTests()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    log(`Test suite error: ${error.message}`, 'red');
    process.exit(1);
  });
