import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Get an API key from https://openweathermap.org/api
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'MOCK_API_KEY';

/**
 * Service to fetch live weather data to feed into the ML model
 */
export const getWeatherData = async (city: string) => {
  if (OPENWEATHER_API_KEY === 'MOCK_API_KEY') {
    // If no API key is provided, return mock data for the hackathon
    console.log('[Weather Service] Using mock weather data (No API key found)');
    return {
      rainfall_mm: Math.random() * 20, // 0 to 20mm
      temperature_c: 20 + Math.random() * 15 // 20 to 35 C
    };
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const response = await axios.get(url);
    
    // Extract rainfall (OpenWeather returns rain.1h if it's raining)
    const rainfall = response.data.rain ? (response.data.rain['1h'] || 0) : 0;
    const temp = response.data.main.temp;

    return {
      rainfall_mm: rainfall,
      temperature_c: temp
    };
  } catch (error: any) {
    console.error(`[Weather Service] Error fetching weather for ${city}:`, error.message);
    return { rainfall_mm: 0, temperature_c: 25 }; // fallback
  }
};
