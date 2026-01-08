interface LocationBase {
  country: string,
  id: number,
  lat: number,
  lon: number,
  name: string,
  region: string,
}
export interface Location extends LocationBase {
  url: string
}
interface LocationDetails extends Location {
  tz_id: string,
  localtime_epoch: number,
  localtime: string,
}

interface Condition {
  text: string,
  icon: string,
  code: number
}

interface AirQuality {
  co: number,
  no2: number,
  o3: number,
  so2: number,
  pm2_5: number,
  pm10: number,
  "us-epa-index": number,
  "gb-defra-index": number
}

interface CurrentConditions {
  last_updated_epoch: string,
  last_updated: string,
  temp_c: number,
  temp_f: number,
  is_day: number,
  condition: Condition,
  wind_mph: number,
  wind_kph: number,
  wind_degree: number,
  wind_dir: string,
  pressure_mb: number,
  pressure_in: number,
  precip_mm: number,
  precip_in: number,
  humidity: number,
  cloud: number,
  feelslike_c: number,
  feelslike_f: number,
  windchill_c: number,
  windchill_f: number,
  heatindex_c: number,
  heatindex_f: number,
  dewpoint_c: number,
  dewpoint_f: number,
  vis_km: number,
  vis_miles: number,
  uv: number,
  gust_mph: number,
  gust_kph: number,
  air_quality: AirQuality
}

interface ForecastHour {
  time_epoch: number,
  time: string,
  temp_c: number,
  temp_f: number,
  is_day: number,
  condition: Condition,
  wind_mph: number,
  wind_kph: number,
  wind_degree: number,
  wind_dir: string,
  pressure_mb: number,
  pressure_in: number,
  precip_mm: number,
  precip_in: number,
  snow_cm: number,
  humidity: number,
  cloud: number,
  feelslike_c: number,
  feelslike_f: number,
  windchill_c: number,
  windchill_f: number,
  heatindex_c: number,
  heatindex_f: number,
  dewpoint_c: number,
  dewpoint_f: number,
  will_it_rain: number,
  chance_of_rain: number,
  will_it_snow: number,
  chance_of_snow: number,
  vis_km: number,
  vis_miles: number,
  gust_mph: number,
  gust_kph: number,
  uv: number
}
interface ForecastDay {
  maxtemp_c: number,
  maxtemp_f: number,
  mintemp_c: number,
  mintemp_f: number,
  avgtemp_c: number,
  avgtemp_f: number,
  maxwind_mph: number,
  maxwind_kph: number,
  totalprecip_mm: number,
  totalprecip_in: number,
  totalsnow_cm: number,
  avgvis_km: number,
  avgvis_miles: number,
  avghumidity: number,
  daily_will_it_rain: number,
  daily_chance_of_rain: number,
  daily_will_it_snow: number,
  daily_chance_of_snow: number,
  condition: Condition,
  uv: number
}
interface AstroDay {
  sunrise: string,
  sunset: string,
  moonrise: string,
  moonset: string,
  moon_phase: string,
  moon_illumination: number,
  is_moon_up: number,
  is_sun_up: number
}

export interface Forecast {
  date: string,
  date_epoch: number,
  day: ForecastDay,
  astro: AstroDay,
  hour: ForecastHour[]
}

export interface Weather {
  location: LocationDetails,
  current: CurrentConditions,
  forecast: {
    forecastday: Forecast[],
  }
}
