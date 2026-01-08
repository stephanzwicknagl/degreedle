// API configuration
// Configure via .env file (not tracked by git)
// For development:
//   - iOS Simulator: use 'http://localhost:3000'
//   - Android Emulator: use 'http://10.0.2.2:3000' (special IP for host machine)
//   - Physical Device (Android/iOS): use your computer's local IP 
// For production, set EXPO_PUBLIC_API_BASE_URL in your deployment environment

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 
  process.env.API_BASE_URL || 
  'http://localhost:3000'; // Fallback default

// Proxy API key - this is the key your React Native app uses to authenticate with the Rust proxy
// This is different from the WeatherAPI.com key which stays on the server
const PROXY_API_KEY =
  process.env.PROXY_API_KEY || 
  process.env.EXPO_PUBLIC_PROXY_API_KEY || 
  'your_proxy_api_key_here'; // Replace with your actual proxy API key

export const config = {
  API_BASE_URL,
  PROXY_API_KEY,
};
