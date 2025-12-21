import axios, { AxiosResponse } from 'axios';
import { apiKey } from '../constants';

interface ForecastParams {
  city: string,
  days: number
}
interface LocationsParams {
  query: string,
}
const forecastEndpoint = (params: ForecastParams) => `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.city}&days=${params.days}&aqi=yes&alerts=no`;
const locationsEndpoint = (params: LocationsParams) => `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.query}`;

const apiCall = async <T>(endpoint: string): Promise<T | null> => {
  const options = {
    method: 'GET',
    url: endpoint
  }
  try {
    const response: AxiosResponse<T> = await axios.request(options);
    return response.data

  } catch (err) {
    console.log('error:', err)
    return null
  }
}

export const fetchWeatherForecast = (params: ForecastParams) => {
  return apiCall(forecastEndpoint(params));
}

export const fetchLocations = (params: LocationsParams) => {
  return apiCall(locationsEndpoint(params));
}
