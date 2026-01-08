use crate::middleware::ApiKey;
use crate::types::{ErrorResponse, Location, Weather};
use crate::AppState;
use rocket::{
    http::Status,
    serde::json::Json,
    State,
};

#[rocket::get("/health")]
pub fn health_handler() -> &'static str {
    "OK"
}

#[rocket::get("/api/forecast?<city>&<days>")]
pub async fn forecast_handler(
    city: String,
    days: Option<u32>,
    _api_key: ApiKey,
    state: &State<AppState>,
) -> Result<Json<Weather>, (Status, Json<ErrorResponse>)> {
    // Validate parameters
    if city.is_empty() {
        return Err((
            Status::BadRequest,
            Json(ErrorResponse {
                error: "City parameter is required".to_string(),
            }),
        ));
    }

    // Check rate limiting
    if let Err(_) = state.rate_limiter.check("default").await {
        return Err((
            Status::TooManyRequests,
            Json(ErrorResponse {
                error: "Rate limit exceeded".to_string(),
            }),
        ));
    }

    let days = days.unwrap_or(5).min(10); // Limit to 10 days max

    // Build WeatherAPI URL
    let url = format!(
        "https://api.weatherapi.com/v1/forecast.json?key={}&q={}&days={}&aqi=yes&alerts=no",
        state.weather_api_key, city, days
    );

    tracing::info!("Fetching forecast for city: {}", city);

    // Make request to WeatherAPI
    let response = reqwest::get(&url)
        .await
        .map_err(|e| {
            tracing::error!("Failed to fetch forecast: {}", e);
            (
                Status::BadGateway,
                Json(ErrorResponse {
                    error: "Failed to fetch weather data".to_string(),
                }),
            )
        })?;

    let status = response.status();
    let response_text = response.text().await.map_err(|e| {
        tracing::error!("Failed to read response body: {}", e);
        (
            Status::BadGateway,
            Json(ErrorResponse {
                error: "Failed to read weather service response".to_string(),
            }),
        )
    })?;

    if !status.is_success() {
        tracing::error!("WeatherAPI error ({}): {}", status, response_text);
        return Err((
            Status::BadGateway,
            Json(ErrorResponse {
                error: format!("Weather service error: {}", response_text),
            }),
        ));
    }

    let weather: Weather = serde_json::from_str(&response_text).map_err(|e| {
        tracing::error!("Failed to parse weather response: {}", e);
        tracing::error!("Response body: {}", response_text);
        (
            Status::BadGateway,
            Json(ErrorResponse {
                error: format!("Invalid response from weather service: {}", e),
            }),
        )
    })?;

    Ok(Json(weather))
}

#[rocket::get("/api/locations?<query>")]
pub async fn locations_handler(
    query: String,
    _api_key: ApiKey,
    state: &State<AppState>,
) -> Result<Json<Vec<Location>>, (Status, Json<ErrorResponse>)> {
    // Validate parameters
    if query.is_empty() {
        return Err((
            Status::BadRequest,
            Json(ErrorResponse {
                error: "Query parameter is required".to_string(),
            }),
        ));
    }

    // Check rate limiting
    if let Err(_) = state.rate_limiter.check("default").await {
        return Err((
            Status::TooManyRequests,
            Json(ErrorResponse {
                error: "Rate limit exceeded".to_string(),
            }),
        ));
    }

    // Build WeatherAPI URL
    let url = format!(
        "https://api.weatherapi.com/v1/search.json?key={}&q={}",
        state.weather_api_key, query
    );

    tracing::info!("Searching locations for query: {}", query);

    // Make request to WeatherAPI
    let response = reqwest::get(&url)
        .await
        .map_err(|e| {
            tracing::error!("Failed to search locations: {}", e);
            (
                Status::BadGateway,
                Json(ErrorResponse {
                    error: "Failed to search locations".to_string(),
                }),
            )
        })?;

    let status = response.status();
    let response_text = response.text().await.map_err(|e| {
        tracing::error!("Failed to read response body: {}", e);
        (
            Status::BadGateway,
            Json(ErrorResponse {
                error: "Failed to read location service response".to_string(),
            }),
        )
    })?;

    if !status.is_success() {
        tracing::error!("WeatherAPI error ({}): {}", status, response_text);
        return Err((
            Status::BadGateway,
            Json(ErrorResponse {
                error: format!("Location service error: {}", response_text),
            }),
        ));
    }

    let locations: Vec<Location> = serde_json::from_str(&response_text).map_err(|e| {
        tracing::error!("Failed to parse locations response: {}", e);
        tracing::error!("Response body: {}", response_text);
        (
            Status::BadGateway,
            Json(ErrorResponse {
                error: format!("Invalid response from location service: {}", e),
            }),
        )
    })?;

    Ok(Json(locations))
}
