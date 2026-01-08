use rocket::{
    http::Status,
    request::{FromRequest, Outcome, Request},
    State,
};
use std::collections::HashMap;
use std::sync::Arc;
use std::time::{Duration, Instant};
use tokio::sync::RwLock;

pub struct RateLimiter {
    requests: Arc<RwLock<HashMap<String, (u32, Instant)>>>,
    limit: u32,
    window: Duration,
}

impl RateLimiter {
    pub fn new(limit: u32, window_seconds: u64) -> Self {
        Self {
            requests: Arc::new(RwLock::new(HashMap::new())),
            limit,
            window: Duration::from_secs(window_seconds),
        }
    }

    pub async fn check(&self, key: &str) -> Result<(), Status> {
        let mut requests = self.requests.write().await;
        let now = Instant::now();

        // Clean up old entries
        requests.retain(|_, (_, timestamp)| now.duration_since(*timestamp) < self.window);

        let entry = requests.entry(key.to_string()).or_insert((0, now));

        if entry.0 >= self.limit {
            return Err(Status::TooManyRequests);
        }

        entry.0 += 1;
        entry.1 = now;

        Ok(())
    }
}

pub struct ApiKey;

#[rocket::async_trait]
impl<'r> FromRequest<'r> for ApiKey {
    type Error = ();

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        // Check for X-API-Key header
        let api_key = req
            .headers()
            .get_one("X-API-Key")
            .or_else(|| req.headers().get_one("Authorization"))
            .map(|s| {
                // Support both "Bearer <token>" and direct token
                if s.starts_with("Bearer ") {
                    s.strip_prefix("Bearer ").unwrap()
                } else {
                    s
                }
            });

        let provided_key = match api_key {
            Some(key) => key,
            None => {
                tracing::warn!("Request missing API key");
                return Outcome::Error((Status::Unauthorized, ()));
            }
        };

        // Get proxy API key from state
        let state_result = req.guard::<&State<crate::AppState>>().await;
        match state_result {
            Outcome::Success(state) => {
                // Use constant-time comparison to prevent timing attacks
                if !constant_time_eq::constant_time_eq(
                    provided_key.as_bytes(),
                    state.proxy_api_key.as_bytes(),
                ) {
                    tracing::warn!("Invalid API key attempt");
                    return Outcome::Error((Status::Unauthorized, ()));
                }
                Outcome::Success(ApiKey)
            }
            _ => Outcome::Error((Status::InternalServerError, ())),
        }
    }
}

