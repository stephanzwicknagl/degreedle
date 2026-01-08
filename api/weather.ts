import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { config } from '../constants/config';

interface ForecastParams {
  city: string,
  days: number
}
interface LocationsParams {
  query: string,
}

// Build proxy endpoint URLs
const forecastEndpoint = (params: ForecastParams) => 
  `${config.API_BASE_URL}/api/forecast?city=${encodeURIComponent(params.city)}&days=${params.days}`;

const locationsEndpoint = (params: LocationsParams) => 
  `${config.API_BASE_URL}/api/locations?query=${encodeURIComponent(params.query)}`;

// Create axios instance with default headers including API key
const apiClient = axios.create({
  headers: {
    'X-API-Key': config.PROXY_API_KEY,
    'Content-Type': 'application/json',
  },
});

const apiCall = async <T>(endpoint: string): Promise<T | null> => {
  const options: AxiosRequestConfig = {
    method: 'GET',
    url: endpoint,
  };
  
  try {
    const response: AxiosResponse<T> = await apiClient.request(options);
    return response.data;
  } catch (err) {
    console.log('error:', err);
    return null;
  }
};

export const fetchWeatherForecast = (params: ForecastParams) => {
  console.log("send query to ", forecastEndpoint(params));
  return apiCall(forecastEndpoint(params));
};

export const fetchLocations = (params: LocationsParams) => {
  return apiCall(locationsEndpoint(params));
};
