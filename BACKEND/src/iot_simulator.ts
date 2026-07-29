import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'http://localhost:5000/api';

/**
 * Simulates an IoT sensor sending data every 5 seconds.
 */
async function simulateSensors() {
  console.log('Starting IoT Sensor Simulation...');
  
  // Fake Sensor IDs
  const sensors = ['sensor_alpha_01', 'sensor_beta_02'];
  
  setInterval(async () => {
    for (const sensor of sensors) {
      // Normal flow is ~60, Normal pressure is ~70
      // 5% chance to simulate a burst pipe/leak
      const isBurst = Math.random() < 0.05;
      
      const flowRate = isBurst ? (90 + Math.random() * 30) : (55 + Math.random() * 10);
      const pressure = isBurst ? (20 + Math.random() * 20) : (65 + Math.random() * 10);
      
      const payload = {
        sensor_id: sensor,
        flow_rate: flowRate,
        pressure: pressure
      };

      try {
        console.log(`[IoT] Sending data for ${sensor}: Flow=${flowRate.toFixed(2)}, Pressure=${pressure.toFixed(2)}`);
        await axios.post(`${API_URL}/sensors/data`, payload);
      } catch (err: any) {
        console.error(`[IoT Error] Failed to send data: ${err.message}`);
      }
    }
  }, 5000); // Every 5 seconds
}

simulateSensors();
