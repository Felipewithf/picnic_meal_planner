document.addEventListener("DOMContentLoaded", function () {
  var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  var tabs = document.querySelectorAll(".tabs");
  M.Tabs.init(tabs);

  currentDayIndex = "";
  dayCounter = 0;

  days.forEach(element => {
    if (dayjs().format("ddd") === element) {
      currentDayIndex = dayCounter;
    }
    dayCounter++;
  });


  var cityInput = document.getElementById("city-input");
  var searchBtn = document.getElementById("search-btn");

  searchBtn.addEventListener("click", function () {
    var user_input = cityInput.value;

    // for (var i = 0; i < days.length; i++) {
    //   var day = days[i];
    //   var tabContent = document.querySelector("#day" + (i + 1));
    //   tabContent.innerHTML = ""; // Clear existing content

    //   // Get weather conditions
    //   fetchWeatherConditions(day, tabContent, user_input);
    // }

    fetchWeatherConditions(user_input);

  });

  function fetchWeatherConditions(city) {
    // Weatherbit API request
    var weatherbitAPIKey = "1f39b117c040433c963f2301875dd3d8";
    var weatherbitEndpoint = "https://api.weatherbit.io/v2.0/forecast/daily/";

    var weatherbitParams = {
      key: weatherbitAPIKey,
      city: city,
    };

    fetch(weatherbitEndpoint + "?" + new URLSearchParams(weatherbitParams))
      .then((response) => response.json())
      .then((data) => {
        
        
        var calendarIndex = currentDayIndex;
        for (let index = 0; index < 7; index++) {
          

          console.log(calendarIndex);
          //remove old
        $(`#day${calendarIndex+1}`).empty();
        $(`#temp${calendarIndex+1}`).text("");

        // Create weather icon element
        var weatherIconElement = document.createElement("img");
        weatherIconElement.classList.add("smallImg");
        weatherIconElement.setAttribute("src", `https://cdn.weatherbit.io/static/img/icons/${data.data[index].weather.icon}.png`);
        
          // Append elements
        $(`#day${calendarIndex+1}`).append(weatherIconElement);
        $(`#temp${calendarIndex+1}`).text(data.data[index].temp);


          calendarIndex = calendarIndex + 1;

          if (calendarIndex > 6) {
            calendarIndex = 0;
          }
        }

        

      })
      .catch((error) => console.log(error));
  }
});
