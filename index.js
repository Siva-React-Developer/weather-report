let input = document.getElementById("Input");
let WeatherCondition = document.getElementById("condition");
let CityName = document.getElementById("cityname");
let Degrees = document.getElementById("degrees");
let Type = document.getElementById("type");
let Day = document.getElementById("day");
let Time = document.getElementById("time");
let BackgroundVideo = document.getElementById("backgroundVideo");
let InputField = document.getElementById("input-field");
let HideCity = document.getElementById("search-field");
let IndicationMark = document.getElementById("indicate");

let Humidity = document.getElementById("humidity");
let WindSpeed = document.getElementById("windSpeed");
let AirPressure = document.getElementById("airPressure");
let Visibility = document.getElementById("visibility");
let AirQuality1 = document.getElementById("air-qual-condition1");
let AirQuality2 = document.getElementById("air-qual-condition2");
let AirMessege = document.getElementById("messege");

function get_input_field() {
  InputField.style.display = "flex";
}

const input_field = document.getElementById("Input");
input_field.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    get_location_weather(); // Call your function
    input.value = "";
  }
});

async function fetching_weather(all_urls, air_quality_url) {
  try {
    // Fetch weather data
    let url = all_urls;
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    let data = await response.json();
    // console.log("Weather Data:", data);

    // Update UI with safe checks
    Degrees.textContent = (data.main?.temp ?? "N/A") + "°C";
    CityName.textContent = data.name ?? "N/A";
    WeatherCondition.textContent = data.weather?.[0]?.description ?? "N/A";
    // CountryName.textContent = data.sys?.country ?? "N/A";
    Humidity.textContent = (data.main?.humidity ?? "N/A") + "%";
    WindSpeed.textContent = (data.wind?.speed ?? "N/A") + " m/s";
    AirPressure.textContent = (data.main?.pressure ?? "N/A") + " hPa";
    Visibility.textContent = (data.visibility ?? "N/A") + " meters";

    // Background theme based on temperature
    let temp = data.main?.temp ?? 0;
    if (temp <= 20) {
      BackgroundVideo.src = "rainy.mp4";
    } else if (temp > 20 && temp <= 25) {
      BackgroundVideo.src = "little_bit_rainy.mp4";
    } else if (temp > 25 && temp <= 30) {
      BackgroundVideo.src = "normal_cloudy.mp4";
    } else {
      BackgroundVideo.src = "sunlight.mp4";
      document.getElementById("gps-icon").src = "gps.png";
      document.getElementById("gps-icon").style.height = "25px";
      document.getElementById("gps-icon").style.width = "25px";
      document.getElementById("gps-icon").style.marginTop = "5px";
      CityName.style.color = "black";
      Degrees.style.color = "black";
      AirQuality1.style.color = "black";
      document.getElementById("condition").style.color = "black";
      document.getElementById("air-quality").style.color = "black";
      input.classList.add("placeholder-black");
      Day.style.color = "black";
      Time.style.color = "black";
      // input.classList.add("placeholder-gray");
      if (window.matchMedia("(max-width: 440px)").matches) {
        document.getElementById("gps-icon").style.height = "17px";
        document.getElementById("gps-icon").style.width = "17px";
        document.getElementById("gps-icon").style.marginTop = "3px";
      }
    }

    // Fetch air quality data separately
    try {
      let airUrl = air_quality_url;
      let airResponse = await fetch(airUrl);
      let airData = await airResponse.json();
      // console.log("Air Quality Data:", airData);

      let aqi = airData.list?.[0]?.main?.aqi;
      let aqiText = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
      AirQuality1.textContent = aqi ? aqiText[aqi - 1] : "N/A";
      AirQuality2.textContent = aqi ? aqiText[aqi - 1] : "N/A";
      if (aqi === 1) {
        AirMessege.textContent = "Air quality is good.";
        IndicationMark.style.transform = "translateX(20px)";
      } else if (aqi === 2) {
        AirMessege.textContent = "Air quality is fair.";
        IndicationMark.style.transform = "translateX(40px)";
      } else if (aqi === 3) {
        AirMessege.textContent = "Air quality is moderate.";
        IndicationMark.style.transform = "translateX(60px)";
      } else if (aqi === 4) {
        AirMessege.textContent = "Air quality is poor.";
        IndicationMark.style.transform = "translateX(80px)";
      }
    } catch (airErr) {
      console.warn("Failed to fetch air quality data:", airErr);
      AirQuality1.textContent = "Air Quality: N/A";
      AirQuality2.textContent = "Air Quality: N/A";
    }
  } catch (error) {
    console.error("Main weather fetch failed:", error);
    alert("Failed to fetch weather for your location.");
    location.reload();
  }
}

window.onload = () => {
  getWeatherByLocation();
};

async function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        let now = new Date();
        let options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        let time = now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        Day.textContent = now.toLocaleDateString(undefined, options);
        Time.textContent = time;
        let curr_pos_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=1cb6532aea3c298a830a71380eace21e`;
        let curr_air_quality_url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=1cb6532aea3c298a830a71380eace21e`;
        fetching_weather(curr_pos_url, curr_air_quality_url);
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
    location.reload();
  }
}

async function get_location_weather() {
  if (input.value.trim() === "") {
    alert("Please enter a city name.");
  } else {
    try {
      let city = input.value.trim();
      let curr_pos_url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=1cb6532aea3c298a830a71380eace21e`;
      const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=1cb6532aea3c298a830a71380eace21e`;
      const geoRes = await fetch(geoURL);
      const geoData = await geoRes.json();
      // console.log(geoData);
      if (geoData.length === 0) {
        alert("City not found");
        return;
      }
      const lat = geoData[0].lat;
      const lon = geoData[0].lon;
      let curr_air_quality_url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=1cb6532aea3c298a830a71380eace21e`;
      fetching_weather(curr_pos_url, curr_air_quality_url);
    } catch {
      alert("Failed to fetch weather data. Please check the city name.");
      location.reload();
    }
  }
}
