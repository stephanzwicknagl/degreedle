import { weatherImages, WeatherImageKeys } from "constants/symbols"
const isWeatherImageKey = (key: string): key is WeatherImageKeys => weatherImages.hasOwnProperty(key);
export function getWeatherImage(condition?: string): number {
  if (condition && isWeatherImageKey(condition)) {
    return weatherImages[condition];
  }
  return weatherImages['other']
}
