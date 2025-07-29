let input = document.getElementById("Input");
let WeatherCondition = document.getElementById("weatherCondition");
let CityName = document.getElementById("cityname");
let CountryName = document.getElementById("countryname");
let Degrees = document.getElementById("degrees");
let Type = document.getElementById("type");
let WeatherImage = document.getElementById("weatherImage");
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

window.onload = () => {
  getWeatherByLocation();
};

function get_input_field() {
  InputField.style.display = "flex";
}

function get_location_weather() {}

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
        });

        document.getElementById("day").textContent = now.toLocaleDateString(
          undefined,
          options
        );
        document.getElementById("time").textContent = time;

        try {
          // Fetch weather data
          let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=1cb6532aea3c298a830a71380eace21e`;
          let response = await fetch(url);
          let data = await response.json();
          console.log("Weather Data:", data);

          // Update UI with safe checks
          Degrees.textContent = (data.main?.temp ?? "N/A") + "°C";
          CityName.textContent = data.name ?? "N/A";
          // CountryName.textContent = data.sys?.country ?? "N/A";
          Humidity.textContent = (data.main?.humidity ?? "N/A") + "%";
          WindSpeed.textContent = (data.wind?.speed ?? "N/A") + " m/s";
          AirPressure.textContent = (data.main?.pressure ?? "N/A") + " hPa";
          Visibility.textContent = (data.visibility ?? "N/A") + " meters";

          // Background theme based on temperature
          let temp = data.main?.temp ?? 0;
          if (temp <= 20) {
            BackgroundVideo.src = "181916-867576005_tiny.mp4";
          } else if (temp > 20 && temp < 30) {
            BackgroundVideo.src = "istockphoto-454413422-640_adpp_is.mp4";
          } else {
            BackgroundVideo.src = "istockphoto-481953611-640_adpp_is.mp4";
          }

          // Fetch air quality data separately
          try {
            let airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=1cb6532aea3c298a830a71380eace21e`;
            let airResponse = await fetch(airUrl);
            let airData = await airResponse.json();
            console.log("Air Quality Data:", airData);

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
        }
      },
      (error) => {
        alert("Location access denied. Please enable location and refresh.");
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
