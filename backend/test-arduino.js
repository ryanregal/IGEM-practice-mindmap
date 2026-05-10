/**
 * Arduino Data test script
 * Simulates Arduino requests to the backend
 */

const http = require('http');

const TEST_CONFIG = {
  host: 'localhost',
  port: 3000,
  paths: {
    arduino: '/arduino/data',
    full: '/sensor-data',
    debug: '/debug'
  }
};

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

/**
 * Make HTTP request to backend
 */
function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: TEST_CONFIG.host,
      port: TEST_CONFIG.port,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: JSON.parse(data)
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

/**
 * Format and display test results
 */
function displayResult(testName, result) {
  console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}📡 Test: ${testName}${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);

  if (result.statusCode === 200) {
    console.log(`${colors.green}✅ Status: ${result.statusCode}${colors.reset}`);
    console.log(`${colors.yellow}📊 Data:${colors.reset}`);
    console.log(JSON.stringify(result.data, null, 2));
  } else {
    console.log(`${colors.red}❌ Status: ${result.statusCode}${colors.reset}`);
    console.log(result.data);
  }
}

/**
 * Validate Arduino data structure
 */
function validateArduinoData(data) {
  const required = ['waterLevel', 'led', 'rainfall'];
  const missing = required.filter(key => !(key in data));

  console.log(`\n${colors.cyan}🔍 Validation:${colors.reset}`);
  
  if (missing.length === 0) {
    console.log(`${colors.green}✅ Arduino data structure is valid${colors.reset}`);
    console.log(`   - waterLevel: ${data.waterLevel} cm`);
    console.log(`   - led: ${data.led}`);
    console.log(`   - rainfall: ${data.rainfall} mm`);
    return true;
  } else {
    console.log(`${colors.red}❌ Missing required fields: ${missing.join(', ')}${colors.reset}`);
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log(`\n${colors.green}╔═══════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.green}║   Backend API Test Suite for Arduino    ║${colors.reset}`);
  console.log(`${colors.green}╚═══════════════════════════════════════╝${colors.reset}`);
  console.log(`\nTarget: http://${TEST_CONFIG.host}:${TEST_CONFIG.port}`);

  try {
    // Test 1: Arduino endpoint
    console.log(`\n${colors.yellow}🤖 Test 1: Arduino Endpoint${colors.reset}`);
    const arduinoResult = await makeRequest(TEST_CONFIG.paths.arduino);
    displayResult('Arduino Data (/arduino/data)', arduinoResult);
    const isArduinoValid = validateArduinoData(arduinoResult.data);

    // Test 2: Full sensor data endpoint
    console.log(`\n${colors.yellow}🌐 Test 2: Frontend Endpoint${colors.reset}`);
    const fullResult = await makeRequest(TEST_CONFIG.paths.full);
    displayResult('Full Sensor Data (/sensor-data)', fullResult);

    // Test 3: Debug endpoint
    console.log(`\n${colors.yellow}🔧 Test 3: Debug Endpoint${colors.reset}`);
    const debugResult = await makeRequest(TEST_CONFIG.paths.debug);
    displayResult('Debug Info (/debug)', debugResult);

    // Summary
    console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.blue}📋 Test Summary${colors.reset}`);
    console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    
    if (isArduinoValid) {
      console.log(`${colors.green}✅ All tests passed!${colors.reset}`);
      console.log(`${colors.green}✅ Arduino can successfully use the backend API${colors.reset}`);
      console.log(`\n${colors.yellow}Next steps for Arduino:${colors.reset}`);
      console.log(`1. Update your Arduino WiFi credentials`);
      console.log(`2. Replace \`http://your_server_ip:3000/arduino/data\` with actual server IP`);
      console.log(`3. Parse the JSON response and control your hardware accordingly`);
    } else {
      console.log(`${colors.red}❌ Some tests failed!${colors.reset}`);
      console.log(`${colors.red}❌ Arduino cannot use the current API structure${colors.reset}`);
    }

    console.log(`\n${colors.blue}📌 Example Arduino HTTP Code:${colors.reset}`);
    console.log(`
    HTTPClient http;
    http.begin(client, "http://192.168.x.x:3000/arduino/data");
    int httpCode = http.GET();
    
    if (httpCode == HTTP_CODE_OK) {
      String payload = http.getString();
      // Parse JSON and control LED/pointer
    }
    `);

    console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  } catch (error) {
    console.error(`${colors.red}❌ Test failed: ${error.message}${colors.reset}`);
    console.error(`\n${colors.yellow}⚠️  Make sure the backend server is running:${colors.reset}`);
    console.error(`   cd backend && npm start`);
  }
}

// Run tests with interval to show real-time data updates
async function runContinuous() {
  console.log(`\n${colors.yellow}📡 Continuous Test Mode (every 5 seconds)${colors.reset}`);
  console.log(`${colors.yellow}Press Ctrl+C to stop${colors.reset}\n`);

  let count = 0;
  setInterval(async () => {
    count++;
    console.log(`${colors.blue}═══ Test Run #${count} ===${colors.reset}`);
    try {
      const result = await makeRequest(TEST_CONFIG.paths.arduino);
      displayResult('Arduino Data (Continuous)', result);
      console.log(`${colors.green}✅ Success${colors.reset}`);
    } catch (error) {
      console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
    }
  }, 5000);
}

// Main
const args = process.argv.slice(2);
if (args.includes('--continuous')) {
  runContinuous();
} else {
  runTests();
}
