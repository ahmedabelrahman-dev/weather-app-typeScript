
import { useState } from 'react';
import './App.css';

type WeatherData = {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
};

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setWeather(null);
    try {
      const apiKey = '1da56765c1c874776b767cbe97d54eab'; // Replace with your API key
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
      );
      if (!res.ok) throw new Error('City not found');
      const data = await res.json();
      setWeather(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching weather');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-app-container">
      <h1 className="weather-title">Weather App</h1>
      <form className="weather-form" onSubmit={fetchWeather}>
        <input
          className="weather-input"
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={e => setCity(e.target.value)}
          required
        />
        <button className="weather-btn" type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </form>
      {error && <div className="weather-error">{error}</div>}
      {weather && (
        <div className="weather-card">
          <h2>{weather.name}</h2>
          <div className="weather-main">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <div>
              <div className="weather-temp">{Math.round(weather.main.temp)}°C</div>
              <div className="weather-desc">{weather.weather[0].description}</div>
            </div>
          </div>
          <div className="weather-details">
            <span>Humidity: {weather.main.humidity}%</span>
            <span>Wind: {weather.wind.speed} m/s</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
