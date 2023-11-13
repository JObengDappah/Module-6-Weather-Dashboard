// Define constants and variables
const apiKey = 'bd42e8a35e09f2d285c187bf7876576b'; // API key for OpenWeatherMap
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherSection = document.getElementById('current-weather');
const forecastSection = document.getElementById('forecast');
const searchHistory = document.getElementById('search-history');

// Function to fetch weather data from the API
function fetchWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  // Fetch current weather data
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Extract relevant data from the API response
      const cityName = data.name;
      const date = new Date(data.dt * 1000); 
      // Convert timestamp to date
      const iconCode = data.weather[0].icon;
      const temperature = data.main.temp;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;

      // Update the current weather section in the DOM
      currentWeatherSection.innerHTML = `
        <h2>Current Weather</h2>
        <div id="city-name">${cityName}</div>
        <div id="date">${date.toDateString()}</div>
        <img id="weather-icon" src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
        <div id="temperature">${temperature}°C</div>
        <div id="humidity">Humidity: ${humidity}%</div>
        <div id="wind-speed">Wind Speed: ${windSpeed} m/s</div>
      `;
    })
    .catch((error) => {
      console.error('Error fetching current weather data:', error);
    });

  // Fetch 5-day forecast data
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

fetch(forecastUrl)
  .then((response) => response.json())
  .then((data) => {
    // Extract relevant forecast data for the next 5 days
    const forecastItems = {};
    
    data.list.forEach((item) => {
      const forecastDate = new Date(item.dt * 1000);
      const dateKey = forecastDate.toDateString();
      
      // Store the forecast data for each date
      if (!forecastItems[dateKey]) {
        forecastItems[dateKey] = {
          date: forecastDate,
          iconCode: item.weather[0].icon,
          temperature: item.main.temp,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
        };
      }
    });

    // Update the forecast section in the DOM
    forecastSection.innerHTML = `
      <h2>5-Day Forecast</h2>
      ${Object.values(forecastItems).map((forecastItem) => {
        return `
          <div class="forecast-item">
            <div class="date">${forecastItem.date.toDateString()}</div>
            <img class="weather-icon" src="https://openweathermap.org/img/wn/${forecastItem.iconCode}.png" alt="Weather Icon">
            <div class="temperature">${forecastItem.temperature}°C</div>
            <div class="humidity">Humidity: ${forecastItem.humidity}%</div>
            <div class="wind-speed">Wind Speed: ${forecastItem.windSpeed} m/s</div>
          </div>
        `;
      }).join('')}
    `;
  })
  .catch((error) => {
    console.error('Error fetching 5-day forecast data:', error);
  });
}


// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault();
  const city = cityInput.value.trim();

  if (city) {
    // Call the fetchWeatherData function with the user's input
    fetchWeatherData(city);

    // Add the city to the search history
    const searchHistoryItem = document.createElement('li');
    searchHistoryItem.textContent = city;
    searchHistoryItem.classList.add('search-history-item'); // Add a class for styling
    searchHistory.appendChild(searchHistoryItem);

    // Clear the input field
    cityInput.value = '';

     // Add a click event listener to the search history item
     searchHistoryItem.addEventListener('click', () => {
        fetchWeatherData(city); // Fetch weather data for the clicked city
      });
  }
}

// Event listener for form submission
searchForm.addEventListener('submit', handleFormSubmit);
