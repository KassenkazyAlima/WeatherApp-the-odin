document.addEventListener('DOMContentLoaded', () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoidXNlcm5hbWV6bSIsImEiOiJjbTRwbzFsN3UwNnppMmlxdHk4eWZwdTJiIn0.HY_EbaudkgXXSyjE3-jtrQ';
    const weatherApiKey = '1f56be5014b0b0ba3f0d316deb5bf011'; // OpenWeatherMap API Key
  
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [2.3488, 48.8534], // Default center (Paris)
      zoom: 9
    });
  
    async function getWeather() {
      const city = document.getElementById('cityInput').value.trim();
      const weatherDataContainer = document.getElementById('weatherData');
      const newsDataContainer = document.getElementById('newsData');
      const musicRecommendation = document.getElementById('musicRecommendation');
  
      if (!city) {
        weatherDataContainer.innerHTML = `<p style="color: red;">Please enter a city name.</p>`;
        return;
      }
  
      try {
        // Fetch Weather Data
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`
        );
        if (!weatherResponse.ok) throw new Error('City not found.');
  
        const weatherData = await weatherResponse.json();
  
        // Display Weather Data
        weatherDataContainer.innerHTML = `
          <h2>Weather in ${weatherData.name}, ${weatherData.sys.country}</h2>
          <p>Temperature: ${weatherData.main.temp}°C</p>
          <p>Feels Like: ${weatherData.main.feels_like}°C</p>
          <p>Weather: ${weatherData.weather[0].description}</p>
          <img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="Weather Icon">
          <p>Coordinates: [${weatherData.coord.lat}, ${weatherData.coord.lon}]</p>
          <p>Humidity: ${weatherData.main.humidity}%</p>
          <p>Wind Speed: ${weatherData.wind.speed} m/s</p>
        `;
  
        // Update Map
        map.flyTo({
          center: [weatherData.coord.lon, weatherData.coord.lat],
          zoom: 10,
          essential: true
        });
  
        new mapboxgl.Marker()
          .setLngLat([weatherData.coord.lon, weatherData.coord.lat])
          .setPopup(new mapboxgl.Popup().setText(`Weather in ${weatherData.name}`))
          .addTo(map);
  
        // Clear additional sections
        newsDataContainer.innerHTML = '';
        musicRecommendation.innerHTML = '';
      } catch (error) {
        weatherDataContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
      }
    }
  
    // Event Listener for Button
    document.querySelector('button').addEventListener('click', getWeather);
  });
  