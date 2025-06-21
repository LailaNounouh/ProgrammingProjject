#!/usr/bin/env node

/**
 * Security Testing Script
 * Tests various security features of the Career Launch Day application
 */

const axios = require('axios');
const colors = require('colors');

const BASE_URL = 'http://localhost:3000/api';

class SecurityTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    switch (type) {
      case 'success':
        console.log(`[${timestamp}] ✅ ${message}`.green);
        break;
      case 'error':
        console.log(`[${timestamp}] ❌ ${message}`.red);
        break;
      case 'warning':
        console.log(`[${timestamp}] ⚠️  ${message}`.yellow);
        break;
      default:
        console.log(`[${timestamp}] ℹ️  ${message}`.blue);
    }
  }

  async test(name, testFunction) {
    try {
      this.log(`Testing: ${name}`, 'info');
      await testFunction();
      this.results.passed++;
      this.results.tests.push({ name, status: 'PASSED' });
      this.log(`${name} - PASSED`, 'success');
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name, status: 'FAILED', error: error.message });
      this.log(`${name} - FAILED: ${error.message}`, 'error');
    }
  }

  // Test rate limiting
  async testRateLimiting() {
    const requests = [];
    for (let i = 0; i < 10; i++) {
      requests.push(
        axios.get(`${BASE_URL}/`, { timeout: 5000 }).catch(err => err.response)
      );
    }

    const responses = await Promise.all(requests);
    const rateLimited = responses.some(res => res && res.status === 429);
    
    if (!rateLimited) {
      throw new Error('Rate limiting not working - expected 429 status');
    }
  }

  // Test SQL injection protection
  async testSQLInjection() {
    const maliciousPayloads = [
      "'; DROP TABLE Bedrijven; --",
      "' OR '1'='1",
      "'; SELECT * FROM Admins; --"
    ];

    for (const payload of maliciousPayloads) {
      try {
        const response = await axios.post(`${BASE_URL}/login`, {
          email: payload,
          password: 'test',
          type: 'bedrijf'
        }, { timeout: 5000 });

        // Should not succeed with SQL injection
        if (response.status === 200) {
          throw new Error(`SQL injection vulnerability detected with payload: ${payload}`);
        }
      } catch (error) {
        // Expected to fail - this is good
        if (error.response && error.response.status !== 400 && error.response.status !== 401) {
          throw new Error(`Unexpected response to SQL injection: ${error.response.status}`);
        }
      }
    }
  }

  // Test XSS protection
  async testXSSProtection() {
    const xssPayloads = [
      '<script>alert("xss")</script>',
      '<img src="x" onerror="alert(1)">',
      'javascript:alert(1)'
    ];

    for (const payload of xssPayloads) {
      try {
        const response = await axios.post(`${BASE_URL}/register`, {
          type: 'student',
          naam: payload,
          email: 'test@student.ehb.be',
          wachtwoord: 'TestPassword123',
          studie: 'IT'
        }, { timeout: 5000 });

        // Check if dangerous characters were sanitized
        if (response.data && response.data.naam && response.data.naam.includes('<')) {
          throw new Error('XSS vulnerability - dangerous characters not sanitized');
        }
      } catch (error) {
        // Expected to fail due to validation - this is good
        if (error.response && error.response.status === 500) {
          throw new Error('Server error during XSS test - possible vulnerability');
        }
      }
    }
  }

  // Test authentication bypass
  async testAuthBypass() {
    try {
      // Try to access protected route without token
      const response = await axios.get(`${BASE_URL}/admin/bedrijven`, { timeout: 5000 });
      
      if (response.status === 200) {
        throw new Error('Authentication bypass detected - protected route accessible without token');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Expected - authentication required
        return;
      }
      throw new Error(`Unexpected response during auth bypass test: ${error.message}`);
    }
  }

  // Test password strength validation
  async testPasswordValidation() {
    const weakPasswords = [
      '123',
      'password',
      'abc',
      '12345678' // No uppercase/lowercase mix
    ];

    for (const password of weakPasswords) {
      try {
        const response = await axios.post(`${BASE_URL}/register`, {
          type: 'student',
          naam: 'Test User',
          email: 'test@student.ehb.be',
          wachtwoord: password,
          studie: 'IT'
        }, { timeout: 5000 });

        if (response.status === 201) {
          throw new Error(`Weak password accepted: ${password}`);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          // Expected - weak password rejected
          continue;
        }
        throw new Error(`Unexpected response during password validation test: ${error.message}`);
      }
    }
  }

  // Test CORS headers
  async testCORS() {
    try {
      const response = await axios.options(`${BASE_URL}/`, {
        headers: {
          'Origin': 'http://malicious-site.com',
          'Access-Control-Request-Method': 'GET'
        },
        timeout: 5000
      });

      const corsHeader = response.headers['access-control-allow-origin'];
      if (corsHeader === '*' || corsHeader === 'http://malicious-site.com') {
        throw new Error('CORS policy too permissive - allows unauthorized origins');
      }
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        // Expected - CORS should block unauthorized origins
        return;
      }
      throw new Error(`CORS test failed: ${error.message}`);
    }
  }

  // Run all security tests
  async runAllTests() {
    this.log('🔒 Starting Security Tests for Career Launch Day Application', 'info');
    this.log('=' .repeat(60), 'info');

    await this.test('Rate Limiting', () => this.testRateLimiting());
    await this.test('SQL Injection Protection', () => this.testSQLInjection());
    await this.test('XSS Protection', () => this.testXSSProtection());
    await this.test('Authentication Bypass Prevention', () => this.testAuthBypass());
    await this.test('Password Strength Validation', () => this.testPasswordValidation());
    await this.test('CORS Policy', () => this.testCORS());

    this.printResults();
  }

  printResults() {
    this.log('=' .repeat(60), 'info');
    this.log('🔒 Security Test Results', 'info');
    this.log('=' .repeat(60), 'info');
    
    this.log(`✅ Passed: ${this.results.passed}`, 'success');
    this.log(`❌ Failed: ${this.results.failed}`, this.results.failed > 0 ? 'error' : 'info');
    this.log(`📊 Total: ${this.results.passed + this.results.failed}`, 'info');

    if (this.results.failed > 0) {
      this.log('\n🚨 Failed Tests:', 'error');
      this.results.tests
        .filter(test => test.status === 'FAILED')
        .forEach(test => {
          this.log(`  - ${test.name}: ${test.error}`, 'error');
        });
    }

    const score = Math.round((this.results.passed / (this.results.passed + this.results.failed)) * 100);
    this.log(`\n🎯 Security Score: ${score}%`, score >= 80 ? 'success' : 'warning');
    
    if (score < 80) {
      this.log('⚠️  Security improvements needed!', 'warning');
    } else {
      this.log('🎉 Good security posture!', 'success');
    }
  }
}

// Run tests if script is executed directly
if (require.main === module) {
  const tester = new SecurityTester();
  tester.runAllTests().catch(error => {
    console.error('Security test suite failed:', error);
    process.exit(1);
  });
}

module.exports = SecurityTester;
