const pageList = Array.from(document.querySelectorAll("main section"));

console.log(pageList);

const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");

const apiKey = "54a8c2c50353ff9cb32c1665aec61e11";

const weatherInfoSection = document.querySelector(".weather-info");
const searchCitySection = document.querySelector(".search-city");
const notFoundSection = document.querySelector(".not-found");

const countryTxt = weatherInfoSection.querySelector(".country-txt");
const tempTxt = weatherInfoSection.querySelector(".temp-txt");
const conditionTxt = weatherInfoSection.querySelector(".condition-txt");
const humidityValueTxt = weatherInfoSection.querySelector(
  ".humidity-value-txt"
);
const windValueTxt = weatherInfoSection.querySelector(".wind-value-txt");
const weatherSummaryImg = weatherInfoSection.querySelector(
  ".weather-summary-img"
);
const currentDateTxt = weatherInfoSection.querySelector(".current-date-txt");

const forecastItemsContainer = weatherInfoSection.querySelector(
  ".forecast-items-container"
);

searchBtn.addEventListener("click", () => {
  if (cityInput.value !== "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
  }
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && cityInput.value !== "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
  }
  // console.log(event); event will return a key of what we type,
  // even if we press enter 'Enter' will be stored in key (meant to use keyboard instead of mouse)
});

async function getFetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

  const response = await fetch(apiUrl);

  return response.json();
}

function getWeatherIcon(id) {
  if (id <= 232) {
    return "thunderstorm.svg";
  }
  if (id <= 321) {
    return "drizzle.svg";
  }
  if (id <= 531) {
    return "rain.svg";
  }
  if (id <= 622) {
    return "snow.svg";
  }
  if (id <= 781) {
    return "atmosphere.svg";
  }
  if (id <= 800) {
    return "clear.svg";
  } else return "clouds.svg";
} // ids got from openweathermap.org/weather-conditions (weather icons)

function getCurrentDate() {
  const currentDate = new Date();
  // console.log(currentDate);
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };

  return currentDate.toLocaleDateString("en-GB", options); // GB-Great Britain(United Kingdom)
}

async function updateWeatherInfo(city) {
  const weatherData = await getFetchData("weather", city);

  if (weatherData.cod !== 200) {
    showPages("notFound");
    return;
  }

  console.log(weatherData);

  const { name, main, weather, wind } = weatherData;

  const { temp, humidity } = main;

  const [{ id, main: weatherMain }] = weather;

  const { speed } = wind;

  countryTxt.textContent = name;
  tempTxt.textContent = Math.round(temp) + " °C";
  conditionTxt.textContent = weatherMain;
  humidityValueTxt.textContent = humidity + "%";
  windValueTxt.textContent = speed + " M/s";

  currentDateTxt.textContent = getCurrentDate();
  console.log(getCurrentDate());

  weatherSummaryImg.src = `images/${getWeatherIcon(id)}`;

  updateForecastsInfo(city);

  showPages("weatherInfo");
}

async function updateForecastsInfo(city) {
  const forecastsData = await getFetchData("forecast", city);
  // console.log(forecastsData);

  const timeTaken = "12:00:00"; // Forecast only for 12pm
  const todayDate = new Date().toISOString().split("T")[0];
  // console.log(todayDate);

  forecastItemsContainer.innerHTML = ``;
  forecastsData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      console.log(forecastWeather);
      updateForecastItems(forecastWeather);
    }
  });
}

function updateForecastItems(weatherData) {
  // console.log(weatherData);

  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;

  const dateTaken = new Date(date);
  const dateOption = {
    day: "2-digit",
    month: "short",
  };

  const dateResult = dateTaken.toLocaleDateString("en-GB", dateOption);

  const forecastItem = `
      <div class="forecast-item">
        <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
        <img
          src="images/${getWeatherIcon(id)}"
          alt=""
          class="forecast-item-img"
        />
        <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
      </div>
  `;
  forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItem);
}

function showPages(pageId = "weatherInfo") {
  pageList.forEach((pages) => {
    pages.style.display = pages.id === pageId ? "flex" : "none";
  });
}

showPages("searchCity");
