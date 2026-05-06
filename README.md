# WeatherPy - Flask Weather App

A simple weather web app built with Flask, HTML, CSS, and vanilla JavaScript.

Search any city to get live weather data (temperature, humidity, wind, pressure, visibility), dynamic weather-themed backgrounds, and practical "What to Wear / Take" tips.

## Features

- Search weather by city name
- Real-time data from OpenWeatherMap
- Clean UI with weather-based visual backdrop changes
- Helpful outfit and carry-item suggestions based on conditions
- Basic client-side error handling for invalid cities and network issues

## Tech Stack

- **Backend:** Flask, Requests
- **Frontend:** HTML, CSS, JavaScript (no framework)
- **Weather API:** OpenWeatherMap Current Weather API

## Project Structure

```text
weatherpy/
|- app.py
|- templates/
|  `- index.html
`- static/
   |- style.css
   `- script.js
```

## How It Works

1. User opens `/`, served by Flask (`index.html`).
2. User enters a city and clicks Search (or presses Enter).
3. Frontend calls `/get-weather?city=<city>`.
4. Flask fetches weather data from OpenWeatherMap and returns JSON.
5. Frontend renders weather stats, icon, tips, and updates the backdrop.

## Getting Started

### 1) Clone the repository

```bash
git clone <your-repo-url>
cd weatherpy
```

### 2) Create and activate a virtual environment (recommended)

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3) Install dependencies

```bash
pip install flask requests
```

### 4) Configure API key

Create a `.env` file in the project root:

```env
OPENWEATHER_API_KEY=your_api_key_here
```

> Get your free API key from [OpenWeatherMap](https://openweathermap.org/api).

### 5) Run the app

```bash
python app.py
```

Open your browser at: [http://127.0.0.1:5000](http://127.0.0.1:5000)

## Recommended Security Update

This project currently has the API key hardcoded in `app.py`.  
Before pushing publicly, move it to an environment variable and read it with `os.getenv("OPENWEATHER_API_KEY")`.

## API Endpoint Used

- `GET /get-weather?city=<city>`

Proxy target:

- `http://api.openweathermap.org/data/2.5/weather?q=<city>&appid=<API_KEY>&units=metric`

## Future Improvements

- Add loading state while fetching weather
- Add forecast support (3-day / 7-day)
- Add unit toggle (Celsius/Fahrenheit)
- Add tests for backend route and frontend utility functions
- Add Docker support for easy deployment

## License

MIT (or your preferred license)
