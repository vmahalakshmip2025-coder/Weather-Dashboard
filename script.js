const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");

const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");

const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

const loading = document.getElementById("loading");
const error = document.getElementById("error");


async function searchWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        error.textContent = "Please enter a city name.";
        return;
    }

    error.textContent = "";
    loading.style.display = "block";

    try {

        // STEP 1: Find city coordinates

        const locationResponse = await fetch(
            "https://geocoding-api.open-meteo.com/v1/search?name=" +
            encodeURIComponent(city) +
            "&count=1&language=en&format=json"
        );

        if (!locationResponse.ok) {
            throw new Error("Unable to find the city.");
        }

        const locationData = await locationResponse.json();

        if (!locationData.results) {
            throw new Error("City not found.");
        }

        const location = locationData.results[0];


        // STEP 2: Get weather using latitude and longitude

        const weatherResponse = await fetch(
            "https://api.open-meteo.com/v1/forecast" +
            "?latitude=" + location.latitude +
            "&longitude=" + location.longitude +
            "&current=temperature_2m,relative_humidity_2m,wind_speed_10m" +
            "&timezone=auto"
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to get weather data.");
        }

        const weatherData = await weatherResponse.json();


        // STEP 3: Display data

        cityName.textContent = location.name;

        countryName.textContent = location.country;

        temperature.textContent =
            weatherData.current.temperature_2m + " °C";

        humidity.textContent =
            weatherData.current.relative_humidity_2m + " %";

        windSpeed.textContent =
            weatherData.current.wind_speed_10m + " km/h";

    }

    catch (err) {

        error.textContent = err.message;

        cityName.textContent = "City";
        countryName.textContent = "Country";

        temperature.textContent = "-- °C";
        humidity.textContent = "-- %";
        windSpeed.textContent = "-- km/h";

    }

    finally {

        loading.style.display = "none";

    }
}


searchButton.addEventListener("click", searchWeather);


cityInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        searchWeather();
    }

});