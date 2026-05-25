const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.disable('etag');
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// Initialize cached data
let cachedData = {
  rainfall: 0,
  waterLevel: 0,
  temperature: 20,
  alert: 'Normal',
  led: 'off',  // For Arduino LED control
  timestamp: new Date().toISOString()
};

// BOM API URL for Melbourne (IDV60901 is Melbourne CBD)
const BOM_API_URL = 'http://www.bom.gov.au/fwo/IDV60901/IDV60901.95936.json';
const simulatedRiskCycle = [
  { rainfall: 3, waterLevel: 20, alert: 'Normal' },
  { rainfall: 11, waterLevel: 45, alert: 'Flood Alert' },
  { rainfall: 18, waterLevel: 78, alert: 'Flood Alert' }
];
let simulatedRiskIndex = 0;

/**
 * Fetch and parse BOM data, then update cached data
 */
async function fetchBOMData() {
  try {
    const response = await axios.get(BOM_API_URL, { timeout: 10000 });
    const data = response.data;

    // Parse BOM observations data
    if (data.observations && data.observations.data && data.observations.data.length > 0) {
      const latestObs = data.observations.data[0];
      
      const rainfall = latestObs.rain_trace ? parseFloat(latestObs.rain_trace) : 0;
      const temperature = latestObs.air_temp ? parseFloat(latestObs.air_temp) : 20;
      
      // Calculate water level based on rainfall (simple model)
      let waterLevel = 0;
      if (rainfall > 0) {
        waterLevel = Math.min((rainfall / 5) * 10, 100);
        waterLevel += (Math.random() - 0.5) * 5;
      }
      waterLevel = Math.max(0, Math.min(100, waterLevel));

      const alert = rainfall > 10 ? 'Flood Alert' : 'Normal';
      const led = rainfall > 10 ? 'on' : 'off';

      cachedData = {
        rainfall: parseFloat(rainfall.toFixed(2)),
        waterLevel: parseFloat(waterLevel.toFixed(2)),
        temperature: parseFloat(temperature.toFixed(2)),
        alert,
        led,
        timestamp: new Date().toISOString(),
        source: 'BOM'
      };
      
      console.log(`✅ [${cachedData.timestamp}] BOM data updated:`, cachedData);
    } else {
      throw new Error('Invalid BOM data structure');
    }
  } catch (error) {
    console.error('⚠️  BOM API error:', error.message);
    console.log('📊 Using simulated data instead...');
    
    // Fallback demo data cycles through minor, moderate, and major risk.
    const simulatedRisk = simulatedRiskCycle[simulatedRiskIndex];
    simulatedRiskIndex = (simulatedRiskIndex + 1) % simulatedRiskCycle.length;

    const rainfall = simulatedRisk.rainfall;
    const temperature = 15 + Math.random() * 10;
    const waterLevel = simulatedRisk.waterLevel;

    cachedData = {
      rainfall: parseFloat(rainfall.toFixed(2)),
      waterLevel: parseFloat(waterLevel.toFixed(2)),
      temperature: parseFloat(temperature.toFixed(2)),
      alert: simulatedRisk.alert,
      led: simulatedRisk.alert === 'Flood Alert' ? 'on' : 'off',
      timestamp: new Date().toISOString(),
      source: 'Simulated'
    };
    console.log(`📡 [${cachedData.timestamp}] Simulated data:`, cachedData);
  }
}

// Perform initial fetch
fetchBOMData();

// Update every 10 seconds (10000 ms) to match frontend polling interval
setInterval(fetchBOMData, 10000);

/**
 * Main sensor data endpoint - for both frontend and Arduino
 * Returns: { rainfall, waterLevel, temperature, alert, led, timestamp }
 */
app.get('/sensor-data', (req, res) => {
  res.json(cachedData);
});

/**
 * Simplified endpoint for Arduino - returns minimal data
 * Returns: { waterLevel, led, rainfall }
 */
app.get('/arduino/data', (req, res) => {
  res.json({
    waterLevel: cachedData.waterLevel,
    led: cachedData.led,
    rainfall: cachedData.rainfall
  });
});

/**
 * Health check endpoint
 */
app.get('/', (req, res) => {
  res.json({ 
    status: 'FloodRisk Backend API is running',
    uptime: process.uptime(),
    lastUpdate: cachedData.timestamp
  });
});

/**
 * Debug endpoint to check current data
 */
app.get('/debug', (req, res) => {
  res.json({
    cachedData,
    serverTime: new Date().toISOString(),
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 FloodRisk Backend running on port ${PORT}`);
  console.log(`📡 Frontend endpoint: http://localhost:${PORT}/sensor-data`);
  console.log(`🤖 Arduino endpoint: http://localhost:${PORT}/arduino/data`);
  console.log(`🔧 Debug endpoint: http://localhost:${PORT}/debug`);
});
