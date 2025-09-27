
import { useState, useEffect } from 'react';
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
  const cities = [
    'London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Cairo', 'Rio de Janeiro',
    'Moscow', 'Toronto', 'Dubai', 'Cape Town', 'Beijing', 'Berlin', 'Rome', 'Bangkok',
    'Istanbul', 'Mumbai', 'Mexico City', 'Seoul', 'Singapore',
    'Los Angeles', 'Chicago', 'San Francisco', 'Madrid', 'Barcelona', 'Lisbon', 'Vienna',
    'Prague', 'Budapest', 'Warsaw', 'Helsinki', 'Stockholm', 'Oslo', 'Copenhagen',
    'Zurich', 'Geneva', 'Brussels', 'Amsterdam', 'Dublin', 'Edinburgh', 'Venice',
    'Florence', 'Athens', 'Tel Aviv', 'Jerusalem', 'Doha', 'Kuala Lumpur', 'Jakarta',
    'Manila', 'Hanoi', 'Ho Chi Minh City', 'Lagos', 'Nairobi', 'Johannesburg',
    'Buenos Aires', 'Santiago', 'Lima', 'Bogota', 'Caracas', 'Montreal', 'Vancouver',
    'Boston', 'Miami', 'San Diego', 'Houston', 'Dallas', 'Philadelphia', 'Phoenix',
    'Seattle', 'Melbourne', 'Auckland', 'Perth', 'Brisbane', 'Adelaide', 'Cape Town',
    'Casablanca', 'Marrakesh', 'Rabat', 'Algiers', 'Tunis', 'Accra', 'Abuja', 'Kampala',
    'Addis Ababa', 'Dar es Salaam', 'Kigali', 'Antananarivo', 'Port Louis', 'Colombo',
    'Kathmandu', 'Dhaka', 'Karachi', 'Lahore', 'Islamabad', 'Tehran', 'Baghdad',
    'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Muscat', 'Abu Dhabi', 'Sharjah', 'Doha',
    'Kuwait City', 'Amman', 'Beirut', 'Damascus', 'Aleppo', 'Sanaa', 'Tripoli',
    'Benghazi', 'Tunis', 'Algiers', 'Rabat', 'Fes', 'Tangier', 'Marrakesh', 'Agadir'
  ];
  const [weatherList, setWeatherList] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function getRandomCities(count: number) {
    const shuffled = [...cities].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  const fetchWeatherForCities = async (cityNames: string[]) => {
    setLoading(true);
    setError('');
    setWeatherList([]);
    try {
      const apiKey = '1da56765c1c874776b767cbe97d54eab'; // Replace with your API key
      const promises = cityNames.map(async (city) => {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
        );
        if (!res.ok) throw new Error('City not found: ' + city);
        return res.json();
      });
      const data = await Promise.all(promises);
      setWeatherList(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching weather');
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather for 5 random cities on mount
  useEffect(() => {
    const randomCities = getRandomCities(5);
    fetchWeatherForCities(randomCities);
    // eslint-disable-next-line
  }, []);

  const handleRefresh = () => {
    const randomCities = getRandomCities(5);
    fetchWeatherForCities(randomCities);
  };

  return (
    <div className="weather-app-container">
      <h1 className="weather-title">Weather App</h1>
      {error && <div className="weather-error">{error}</div>}
      <div className="weather-cards-grid">
        {weatherList.map((weather, idx) => (
          <div className="weather-card" key={weather.name + idx}>
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
        ))}
      </div>
      <button className="weather-btn" onClick={handleRefresh} disabled={loading} style={{marginTop: '2rem'}}>
        {loading ? 'Loading...' : 'Refresh Cities'}
      </button>
    </div>
  );
}

export default App;
