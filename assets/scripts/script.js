document.addEventListener("DOMContentLoaded", function () {
  var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  var tabs = document.querySelectorAll(".tabs");
  M.Tabs.init(tabs);

  var cityInput = document.getElementById("city-input");
  var searchBtn = document.getElementById("search-btn");

  searchBtn.addEventListener("click", function () {
    var user_input = cityInput.value;

    for (var i = 0; i < days.length; i++) {
      var day = days[i];
      var tabContent = document.querySelector("#day" + (i + 1));
      tabContent.innerHTML = ""; // Clear existing content

      // Get weather conditions
      fetchWeatherConditions(day, tabContent, user_input);
    }
  });

  function fetchWeatherConditions(day, tabContent, city) {
    // Weatherbit API request
    var weatherbitAPIKey = "1f39b117c040433c963f2301875dd3d8";
    var weatherbitEndpoint = "https://api.weatherbit.io/v2.0/current";

    var weatherbitParams = {
      key: weatherbitAPIKey,
      city: city,
    };

    fetch(weatherbitEndpoint + "?" + new URLSearchParams(weatherbitParams))
      .then((response) => response.json())
      .then((data) => {
        var weatherCode = data.data[0].weather.code;

        // Create weather icon element
        var weatherIconElement = document.createElement("i");
        weatherIconElement.classList.add("wi", "weather-icon");

        // Set weather icon based on weather code
        switch (weatherCode) {
          case 200:
          case 201:
          case 202:
          case 230:
          case 231:
          case 232:
            weatherIconElement.classList.add("wi-thunderstorm");
            break;
          case 300:
          case 301:
          case 302:
          case 500:
          case 501:
          case 502:
          case 511:
          case 520:
          case 521:
          case 522:
          case 531:
            weatherIconElement.classList.add("wi-rain");
            break;
          case 600:
          case 601:
          case 602:
          case 610:
          case 611:
          case 612:
          case 621:
          case 622:
            weatherIconElement.classList.add("wi-snow");
            break;
          case 701:
          case 711:
          case 721:
          case 731:
          case 741:
          case 751:
          case 761:
          case 762:
          case 771:
          case 781:
            weatherIconElement.classList.add("wi-fog");
            break;
          case 800:
            weatherIconElement.classList.add("wi-day-sunny");
            break;
          case 801:
          case 802:
          case 803:
          case 804:
            weatherIconElement.classList.add("wi-cloudy");
            break;
          default:
            weatherIconElement.classList.add("wi-na");
            break;
        }

        // Append weather icon to tab content
        tabContent.appendChild(weatherIconElement);
      })
      .catch((error) => console.log(error));
  }
});
