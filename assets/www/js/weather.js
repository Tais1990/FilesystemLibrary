// погода
function getWeather()
{
    var url = "http://api.openweathermap.org/data/2.5/weather?q="+Config.City+"&units=metric&lang=ru&APPID=790eca719bfa75e4f84acc89bcc76d3b";
    $.ajax({
        url:url,
        type: 'GET',
        dataType: "jsonp",
        contentType: "application/json ",
        success: function(data){ setWeather(data);},
        error: function(){alert("Ошибка при получении погоды!")}
    });
};
function setWeather(data)
{
    var path = "css/weather-icons/";
    var icon = "";
    document.getElementById('temp').innerHTML = data.main.temp + " C°";
    document.getElementById('humidity').innerHTML = data.main.humidity + "%";
    document.getElementById('wind_speed').innerHTML = data.wind.speed + " м/с";
    document.getElementById('clouds').innerHTML = data.clouds.all + " %";
    document.getElementById('city_name').innerHTML = data.name;
 
    var icon_id = data.weather[0].icon;
 
    switch(icon_id){
        case("11d"): icon = "storm"; break;
        case("09d"): icon = "heavy"; break;
        case("10d"): icon = "heavy"; break;
        case("13d"): icon = "snow";  break;
        case("50d"): icon = "heavy"; break;
        case("01d"): icon = "sunny"; break;
        case("03d"): icon = "heavy"; break;
        case("04d"): icon = "heavy"; break;
        //for night weather
        case("11n"): icon = "storm"; break;
        case("09n"): icon = "heavy"; break;
        case("10n"): icon = "heavy"; break;
        case("13n"): icon = "snow";  break;
        case("50n"): icon = "heavy"; break;
        case("01n"): icon = "sunny"; break;
        case("03n"): icon = "heavy"; break;
        case("04n"): icon = "heavy"; break;
    }
    $('#weather-icon').css({"background": "url("+path+icon+".png) no-repeat center"});
};

