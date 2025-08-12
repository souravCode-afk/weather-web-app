const cityInput = document.querySelector(".input");
const searchBtn = document.querySelector(".search-btn");
const apiKey = '76bfed226c3af107ec43b2a1877998bd';

searchBtn.addEventListener('click', async () => {
    if (cityInput.value.trim() !== '') {
        const currentData = await getCurrentWeather(cityInput.value);
        if (currentData.cod != 200) {
            alert('Invalid City Name');
        } else {
            updateCurrentWeatherUI(currentData);
            await updateForecastUI(cityInput.value);
        }
        cityInput.value = '';
    }
});

cityInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter' && cityInput.value.trim() !== '') {
        const currentData = await getCurrentWeather(cityInput.value);
        if (currentData.cod != 200) {
            alert('Invalid City Name');
        } else {
            updateCurrentWeatherUI(currentData);
            await updateForecastUI(cityInput.value);
        }
        cityInput.value = '';
    }
});

async function getCurrentWeather(cityName) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    return response.json();
}

async function getForecast(cityName) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    return response.json();
}

function updateCurrentWeatherUI(data) {
    document.querySelector(".place").textContent = data.name;
    document.querySelector(".showTemp").innerHTML = `${Math.round(data.main.temp)}&deg;C`;
    document.querySelector(".info").textContent = data.weather[0].description;
}

async function updateForecastUI(cityName) {
    const forecastData = await getForecast(cityName);
    if (forecastData.cod != "200") {
        alert("Forecast data unavailable");
        return;
    }
    const timeBlocks = document.querySelectorAll(".tempBlock");

    for (let i = 0; i < timeBlocks.length; i++) {
        const forecast = forecastData.list[i]; 
        const date = new Date(forecast.dt * 1000);
        const hour = date.getHours();
        let formattedTime = '';
        if(i === 2) {
          formattedTime = "Now"; 
        } else if(hour === 0) {
          formattedTime = "12 AM";
        } else if(hour < 12) {
          formattedTime = `${hour} AM`;
        } else {
          formattedTime = `${hour - 12} PM`;
        }

        timeBlocks[i].querySelector(".blockTime").textContent = formattedTime;
        timeBlocks[i].querySelector(".tempBlockTemperature").innerHTML = `${Math.round(forecast.main.temp)}&deg;C`;
    }
}
