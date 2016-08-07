//скрипт для работы с городами
// всё глядит наружу
function ChangeCity(NameCity) // меняем город, для которого необходимо показывать погоду
{
    Config.City = NameCity;
    getWeather();
}
function InitSelectCity()  //запрос списка городов, для выпадающего списка
{
  SelectDB("City", ["cityCode", "displayName"], "SelectCity");  
}
function CreateSelectCity(CityArray) //создаём выпадающий список городов
{  
  var text = "";
  var flag = true; // необходимо совершать проверку, ещё не нашли
  if (CityArray.length != 0)
  {
    for (var i = 0; i < CityArray.length; i++)
    {  
      text += "<option ";
      if (flag && (CityArray[i].cityCode == Config.DefaultCity))
      {
        text += "selected ";
        flag = false;
      }      
      text += "value=\"" + CityArray[i].cityCode + "\">" + CityArray[i].displayName + "</option>";
    }
    if (flag) // среди загруженных данных нет той, которая считается default
    {
      text += "<option selected value=\""+Config.DefaultCity+"\">"+Config.DefaultCity+"</option>"; // если нет вообще никакой записи
    }
  }
  else
  {
     text = "<option selected value=\""+Config.DefaultCity+"\">"+Config.DefaultCity+"</option>"; // если нет вообще никакой записи
  }  
  document.getElementById('NameCity').innerHTML = text;
}
function AddCity() // отрабатывает нажатие кнопки, добавить город
{
  var Alert;
  var PromtDisplayName;
  var City = {cityCode : '', cityName : '', countryName : '', displayName : ''};
  var Promt = new DialogWindow(true,
    'Введите код города',
    ['ok', 'отмена'],
    [ClickOKInPromt, function(){Promt.close()}]);  // инициализируем окошко 
  Promt.open();

  function ClickOKInPromt() // нажали на промт ок
  {
    Promt.close();
    if ((Promt.edit.text != null) && (Promt.edit.text != ''))
    {
      CityUrl(Promt.edit.text); // отправляем запрос на сайт
    }
  }
  function CheckCity(Result) // проверяем знает ли сайт с погодой о таком городе
  {
    if (Result == "error")
      Alert = new DialogWindow(false, 'Данного города не существует.<br>Выберите пожалуйста другой код', 'ok', ReturnLater);
    else 
      Alert = new DialogWindow(false, 'Найденные данные:<br>' + Result + '<br>Сохранить данные?', ['OK', 'Отмена'], [FindAndOk, ReturnLater])
    Alert.parent = Promt;
    Alert.open();
  }
  function CityUrl(NameCity) // обращение к сайту, дабы понять, знает он о таком городе или нет
  {
    var url = "http://api.openweathermap.org/data/2.5/weather?q="+NameCity+"&units=metric&lang=ru&APPID=790eca719bfa75e4f84acc89bcc76d3b";
    $.ajax({
        url:url,
        type: 'GET',
        dataType: "jsonp",
        contentType: "application/json ",
        success: function(data) {
            City.cityCode = NameCity;
            City.cityName = data.name;
            City.countryName = data.sys.country;   
            CheckCity(data.name + ', ' + data.sys.country)},
        error: function(){CheckCity("error")}
    });
  }
  function AddInformation() // добавляем таки город в базу данных
  {
    PromtDisplayName.close();
    City.displayName = PromtDisplayName.edit.text;
    InsertIntoTableOne('City', City, "IncertCity", "Город с идентификатором : $ уже добавлен в базу. Выберите другой город");
    InsertCityDataBoom(City.cityCode);
  }
  function FindAndOk() // смогли найти город и нажали на ок
  {
    Alert.close();
    PromtDisplayName = new DialogWindow(true, 'Введите, пожалуйста, отображаемое название города', 'OK', AddInformation);
    PromtDisplayName.parent = Alert;
    PromtDisplayName.open();
  }
  function ReturnLater() // возвращаемся назад а промт, т.к. соответствующего города не существует
  {
    Alert.close();
    Alert.parent.open();
  }
}
function InitTableCity() // запрос городов для таблиц но второй и третьей странице
{
  SelectDB("City", ["cityCode", "cityName", "countryName", "displayName"], "SelectCityFromTable");  // считываем необходимые данные. всё осатльное будет дальше делать
}
function CreateTableCity(CityArray) // создаём таблицу городов на второй странице
{
  var text = "<tr><td><B>X</B></td> <td><B>Город, страна</B></td> <td><B>Название</B></td> </tr>";
  Config.NumberCity = CityArray.length
  for (var i = 0; i < CityArray.length; i++)
  {
    text += '<tr> <td><input type="checkbox"  id = TableCheckbox' + i+ ' name = "' + CityArray[i].cityCode + '"</td><td>' +  CityArray[i].cityName + ', ' + CityArray[i].countryName + 
    '</td> <td><input type="text" size="15" id="TableEdit' + i + '" name = "' + CityArray[i].cityCode + '" value = "' + CityArray[i].displayName + '"> </td> </tr>'; 
  }
  document.getElementById('table-city').innerHTML = text;
}
function CreateTableCityFromGraph(CityArray) // создаём таблицу городов для третей страницы
{
  var text = "<tr><td><B>X</B></td> <td><B>Город</B></td> </tr>";
  Config.NumberCity = CityArray.length
  for (var i = 0; i < CityArray.length; i++)
  {
    text += '<tr> <td><input type="checkbox"  id = TableCheckboxG' + i+ ' name = "' + CityArray[i].cityCode + 
    '"</td> <td><div id="TableEditG' + i + '" name = "' + CityArray[i].displayName + '" >' + CityArray[i].displayName + ' </td> </tr>'; 
  }
  document.getElementById('table-city-graph').innerHTML = text;
}
function UpdateTableCity() // отрабатываем нажатие кнопки сохранить данные
{
  var Ar = [];
  var Obj;
  for (var i = 0; i < Config.NumberCity; i++)
  {
    var Edit = document.getElementById('TableEdit'+i);
    Obj = { cityCode : Edit.name, displayName : Edit.value};
    Ar.push(Obj);    
  }
  ShowConfDialog('Вы уверенны, что хотите обновить все записи', function(){UpdateTableArray ('City', Ar, 'UpdateCityDisplayName')});
}
function DefualtTableCity() // отрабатываем нажатие кнопки по умолчанию
{
  InitTableCity();
}
function DeleteTableCity() // обрабатываем нажатие кнопки удалить для городов
{
  var Ar = [];
  for (var i = 0; i < Config.NumberCity; i++)
  {
    var Checkbox = document.getElementById('TableCheckbox'+i);
    if (Checkbox.checked)
    {
      Ar.push(Checkbox.name);
    }  
  }
  ShowConfDialog('Вы уверенны, что хотите удалить выделенные записи', function(){DeleteTableArray('City', Ar, 'DeleteCity')});  
}