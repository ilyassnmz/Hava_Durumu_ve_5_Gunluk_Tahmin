const apikey = '74d5db86d1bc7b7f9917c66839e50cad';
const form = document.getElementById('form');
const city = document.getElementById('city');
const weatherDiv = document.getElementById('weather');
const iconDiv = document.getElementById('icon');
const temperatureDiv = document.getElementById('temperature');
const descriptionDiv = document.getElementById('description');
const detailsDiv = document.getElementById('details');
const forecastDiv = document.getElementById('forecast');
const body = document.body;

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const cityValue = city.value;
  getWeather(cityValue);
  getForecast(cityValue);
});

function setBackground(weatherMain) {
  let bg;
  switch (weatherMain.toLowerCase()) {
    case 'clear':
      bg = 'linear-gradient(to right, #fceabb, #f8b500)';
      break;
    case 'clouds':
      bg = 'linear-gradient(to right, #bdc3c7, #2c3e50)';
      break;
    case 'rain':
    case 'drizzle':
      bg = 'linear-gradient(to right, #4b79a1, #283e51)';
      break;
    case 'thunderstorm':
      bg = 'linear-gradient(to right, #1f1c2c, #928dab)';
      break;
    case 'snow':
      bg = 'linear-gradient(to right, #e6dada, #274046)';
      break;
    default:
      bg = 'linear-gradient(to right, #74ebd5, #acb6e5)';
  }
  body.style.background = bg;
}

async function getWeather(cityValue) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${apikey}&units=metric&lang=tr`
    );
    const data = await response.json();

    const temparature = Math.round(data.main.temp);
    const icon = data.weather[0].icon;
    const description = data.weather[0].description;
    const main = data.weather[0].main;

    const details = [
      `Hissedilen: ${Math.round(data.main.feels_like)}°C`,
      `Nem Oranı: ${data.main.humidity}%`,
      `Rüzgar: ${data.wind.speed} m/s`,
    ];

    iconDiv.innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">`;
    temperatureDiv.textContent = `${temparature}°C`;
    descriptionDiv.textContent = description;
    detailsDiv.innerHTML = details.map((d) => `<div>${d}</div>`).join('');

    setBackground(main);
  } catch (error) {
    iconDiv.innerHTML = '';
    temperatureDiv.textContent = '';
    descriptionDiv.textContent = 'Lütfen geçerli bir şehir giriniz';
    detailsDiv.innerHTML = '';
    forecastDiv.innerHTML = '';
    body.style.background = 'linear-gradient(to right, #74ebd5, #acb6e5)';
  }
}

async function getForecast(cityValue) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityValue}&appid=${apikey}&units=metric&lang=tr`
    );
    const data = await response.json();

    const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 5);

    forecastDiv.innerHTML = dailyForecasts.map(day => {
      const date = new Date(day.dt_txt);
      const dayName = date.toLocaleDateString('tr-TR', { weekday: 'long' });
      const temp = Math.round(day.main.temp);
      const icon = day.weather[0].icon;
      const desc = day.weather[0].description;

      return `
        <div class="forecast-day">
          <div><strong>${dayName}</strong></div>
          <img src="http://openweathermap.org/img/wn/${icon}.png" alt="icon">
          <div>${temp}°C</div>
          <div style="font-size: 0.9rem">${desc}</div>
        </div>
      `;
    }).join('');
  } catch (error) {
    forecastDiv.innerHTML = '';
  }
}
