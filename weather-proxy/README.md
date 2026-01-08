# Weather Proxy API

A Rust-based API proxy server built with Rocket that secures a WeatherAPI.com key by proxying requests from the React Native app.

## Features

- **Secure API Key Management**: WeatherAPI.com key is stored server-side in environment variables
- **API Key Authentication**: Requires `X-API-Key` header for all requests
- **Rate Limiting**: Prevents abuse with configurable rate limits
- **CORS Support**: Configured for React Native app access
- **Error Handling**: Proper error responses with meaningful messages

## Setup

### 1. Create Environment File

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

Edit `.env`:
```
WEATHER_API_KEY=your_actual_weather_api_key_from_weatherapi.com
PROXY_API_KEY=generate_a_secure_random_string_here
PORT=3000
```

**Generate a secure PROXY_API_KEY:**
```bash
# On Linux/Mac:
openssl rand -hex 32

# Or use any random string generator
```

### 2. Build and Run

```bash
# Build the project
cargo build --release

# Run the server
cargo run
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## API Endpoints

### Health Check
```
GET /health
```
Returns `OK` if the server is running.

### Get Weather Forecast
```
GET /api/forecast?city={city}&days={days}
Headers: X-API-Key: {your_proxy_api_key}
```

**Parameters:**
- `city` (required): City name or location query
- `days` (optional): Number of forecast days (default: 5, max: 10)

**Example:**
```bash
curl -H "X-API-Key: your_proxy_api_key" \
  "http://localhost:3000/api/forecast?city=London&days=5"
```

### Search Locations
```
GET /api/locations?query={query}
Headers: X-API-Key: {your_proxy_api_key}
```

**Parameters:**
- `query` (required): Location search query

**Example:**
```bash
curl -H "X-API-Key: your_proxy_api_key" \
  "http://localhost:3000/api/locations?query=London"
```

## Development

### Hot Reload (Optional)

For development with hot reload, install `cargo-watch`:

```bash
cargo install cargo-watch
```

Then run:

```bash
cargo watch -x run
```

