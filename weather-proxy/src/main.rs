mod handlers;
mod middleware;
mod types;

use handlers::{forecast_handler, health_handler, locations_handler};
use middleware::RateLimiter;
use rocket::{build, Config};
use rocket_cors::{AllowedHeaders, AllowedOrigins, CorsOptions};
use std::env;

pub struct AppState {
    pub weather_api_key: String,
    pub proxy_api_key: String,
    pub rate_limiter: RateLimiter,
}

#[rocket::launch]
fn rocket() -> _ {
    // Load environment variables
    dotenv::dotenv().ok();

    // Initialize tracing
    tracing_subscriber::fmt::init();

    // Load configuration from environment
    let weather_api_key = env::var("WEATHER_API_KEY")
        .expect("WEATHER_API_KEY environment variable is required");

    let proxy_api_key = env::var("PROXY_API_KEY")
        .expect("PROXY_API_KEY environment variable is required");

    let port = env::var("PORT")
        .unwrap_or_else(|_| "3000".to_string())
        .parse::<u16>()
        .expect("Invalid PORT value");

    // Initialize rate limiter (100 requests per 60 seconds per API key)
    let rate_limiter = RateLimiter::new(100, 60);

    // Create application state
    let app_state = AppState {
        weather_api_key,
        proxy_api_key,
        rate_limiter,
    };

    // Configure CORS
    let cors = CorsOptions::default()
        .allowed_origins(AllowedOrigins::all())
        .allowed_methods(
            vec![
                rocket::http::Method::Get,
                rocket::http::Method::Post,
                rocket::http::Method::Put,
                rocket::http::Method::Delete,
                rocket::http::Method::Options,
            ]
            .into_iter()
            .map(From::from)
            .collect(),
        )
        .allowed_headers(AllowedHeaders::some(&[
            "Authorization",
            "Accept",
            "Content-Type",
            "X-API-Key",
        ]))
        .to_cors()
        .expect("CORS configuration failed");

    // Build and configure Rocket
    let figment = Config::figment()
        .merge(("port", port))
        .merge(("address", "0.0.0.0"));

    tracing::info!("Weather proxy server starting on http://0.0.0.0:{}", port);

    build()
        .configure(figment)
        .manage(app_state)
        .attach(cors)
        .mount("/", rocket::routes![health_handler])
        .mount("/", rocket::routes![forecast_handler, locations_handler])
}
