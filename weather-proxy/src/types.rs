use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Location {
    pub country: String,
    pub id: i32,
    pub lat: f64,
    pub lon: f64,
    pub name: String,
    pub region: String,
    pub url: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LocationDetails {
    pub country: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<i32>, // Only present in search results, not in forecast response
    pub lat: f64,
    pub lon: f64,
    pub name: String,
    pub region: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub url: Option<String>, // Only present in search results, not in forecast response
    pub tz_id: String,
    #[serde(rename = "localtime_epoch")]
    pub localtime_epoch: i64,
    pub localtime: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Condition {
    pub text: String,
    pub icon: String,
    pub code: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AirQuality {
    pub co: f64,
    pub no2: f64,
    pub o3: f64,
    pub so2: f64,
    #[serde(rename = "pm2_5")]
    pub pm2_5: f64,
    pub pm10: f64,
    #[serde(rename = "us-epa-index")]
    pub us_epa_index: i32,
    #[serde(rename = "gb-defra-index")]
    pub gb_defra_index: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CurrentConditions {
    #[serde(rename = "last_updated_epoch")]
    pub last_updated_epoch: i64, // WeatherAPI returns this as integer, not string
    pub last_updated: String,
    pub temp_c: f64,
    pub temp_f: f64,
    pub is_day: i32,
    pub condition: Condition,
    pub wind_mph: f64,
    pub wind_kph: f64,
    pub wind_degree: i32,
    pub wind_dir: String,
    pub pressure_mb: f64,
    pub pressure_in: f64,
    pub precip_mm: f64,
    pub precip_in: f64,
    pub humidity: i32,
    pub cloud: i32,
    pub feelslike_c: f64,
    pub feelslike_f: f64,
    pub windchill_c: f64,
    pub windchill_f: f64,
    pub heatindex_c: f64,
    pub heatindex_f: f64,
    pub dewpoint_c: f64,
    pub dewpoint_f: f64,
    pub vis_km: f64,
    pub vis_miles: f64,
    pub uv: f64,
    pub gust_mph: f64,
    pub gust_kph: f64,
    pub air_quality: AirQuality,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ForecastHour {
    pub time_epoch: i64,
    pub time: String,
    pub temp_c: f64,
    pub temp_f: f64,
    pub is_day: i32,
    pub condition: Condition,
    pub wind_mph: f64,
    pub wind_kph: f64,
    pub wind_degree: i32,
    pub wind_dir: String,
    pub pressure_mb: f64,
    pub pressure_in: f64,
    pub precip_mm: f64,
    pub precip_in: f64,
    pub snow_cm: f64,
    pub humidity: i32,
    pub cloud: i32,
    pub feelslike_c: f64,
    pub feelslike_f: f64,
    pub windchill_c: f64,
    pub windchill_f: f64,
    pub heatindex_c: f64,
    pub heatindex_f: f64,
    pub dewpoint_c: f64,
    pub dewpoint_f: f64,
    pub will_it_rain: i32,
    pub chance_of_rain: i32,
    pub will_it_snow: i32,
    pub chance_of_snow: i32,
    pub vis_km: f64,
    pub vis_miles: f64,
    pub gust_mph: f64,
    pub gust_kph: f64,
    pub uv: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ForecastDay {
    pub maxtemp_c: f64,
    pub maxtemp_f: f64,
    pub mintemp_c: f64,
    pub mintemp_f: f64,
    pub avgtemp_c: f64,
    pub avgtemp_f: f64,
    pub maxwind_mph: f64,
    pub maxwind_kph: f64,
    pub totalprecip_mm: f64,
    pub totalprecip_in: f64,
    pub totalsnow_cm: f64,
    pub avgvis_km: f64,
    pub avgvis_miles: f64,
    pub avghumidity: i32,
    pub daily_will_it_rain: i32,
    pub daily_chance_of_rain: i32,
    pub daily_will_it_snow: i32,
    pub daily_chance_of_snow: i32,
    pub condition: Condition,
    pub uv: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AstroDay {
    pub sunrise: String,
    pub sunset: String,
    pub moonrise: String,
    pub moonset: String,
    pub moon_phase: String,
    pub moon_illumination: i32,
    pub is_moon_up: i32,
    pub is_sun_up: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Forecast {
    pub date: String,
    pub date_epoch: i64,
    pub day: ForecastDay,
    pub astro: AstroDay,
    pub hour: Vec<ForecastHour>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ForecastData {
    pub forecastday: Vec<Forecast>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Weather {
    pub location: LocationDetails,
    pub current: CurrentConditions,
    pub forecast: ForecastData,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ErrorResponse {
    pub error: String,
}
