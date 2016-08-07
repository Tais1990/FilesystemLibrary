// основноой скрипт
// обработчики, навигатор 
//var C = "Yekaterinburg";
var C = "NewYork";
var Config =
{
    Timer : 0,
    City : C, // текущий город
    DefaultCity : C, //  город по умолчанию
    NumberCityFromTable : 0 // количество городов, которые надо в таблице показывать
}
var EventHandler =  // обработчик ссобытий
{
    EndSelectF : function(option) // конец запроса
    {
        switch (option.code)
        {
            case "SelectCity": // обработка для выпадающего списка
                var ArrayCity = [];
                for (var i = 0; i < option.data.length; i++)
                    ArrayCity.push({cityCode : option.data[i].cityCode, displayName : option.data[i].displayName});
                CreateSelectCity(ArrayCity);
            break; 
            case "SelectCityFromTable": // обработка для таблиц
                var ArrayCity = [];
                for (var i = 0; i < option.data.length; i++)
                    ArrayCity.push({cityCode : option.data[i].cityCode, cityName : option.data[i].cityName, countryName : option.data[i].countryName, displayName : option.data[i].displayName});
                CreateTableCity(ArrayCity);
                CreateTableCityFromGraph(ArrayCity);
            break; 
            case "None":// просто какой-то запрос
                alert("Был получен массив из базы данных. Количество элементов : " + option.data.length);
                for (var i = 0; i < option.data.length; i++)
                {
                    var Information = "";
                    for (var key in option.data[i])
                        Information += key + " : " + option.data[i][key]+ "\n";
                    if (Information.length >= 1)
                        Information.substring(0, Information.length - 1);
                    alert(Information);  
                }              
            break;
            case "ActualizationUniqueField": // для актуализации ключевого поля в таблицах
                AddUniqueField(option.data[0]);
            break;
        }        
    },
    EndInsertF : function(option) // конец вставки
    {
        switch (option.code)
        {             
            case "None": //какой-то обстрактной
                alert("Закончили запись в базу");
            break;
            case "IncertCity": // добавление города
                ShowAlert("Город с кодом " + option.uniqe + " был успешно добавлен в базу", 'OK', null, null);
                // перерисовывваем всю информацию
                InitSelectCity();
                InitTableCity();
            break;
        }        
    },
    EndUpdateF : function(option) // конец обновления
    {
        switch (option.code)
        {
            case "None":// какого-то абстрактного
                alert("Обновили все данные в базе");
            break;
            case "UpdateCityDisplayName": // обновление отображаемых названий городов
                if (option.result == -1)
                {
                    ShowAlertDialog("Данные измененны не были. Информация : " + option.message); //для теста. alert просто работает без сбоев
                }
                else
                {
                    ShowAlertDialog("Данные о годохах обновленны");
                    InitSelectCity();
                    InitTableCity(); // обновляем главным образом данные на второй странице
                }                    
            break;
        }      
    },
    EndDeleteF : function(option) // конец  удаления
    {
        switch (option.code)
        {
            case "None": // абстрактное
                alert("Удаленны данные из базы");
            break;
            case "DeleteCity":// удаление города
                if (option.result == -1)
                {
                    ShowAlertDialog("Данные удаленны не были. Информация : " + option.message); //для теста. alert просто работает без сбоев
                }
                else
                {
                    ShowAlertDialog("Данные о годохах удаленны");
                    InitSelectCity(); // обновляем данные в выпадающем списке
                    InitTableCity(); // обновляем данные в таблице после  удаления
                }                    
            break;
        }      
    }
}
function sign(x)
{
    if (x < 0)
        return -1;
    return 1;
}
var Navigator = // штука для работы тач пада
{
    NumberActivityPage : 0,
    Pages : ['pageone', 'pagesecond', 'pagethird', 'pagefourth'],

    touch_position : 0, // Координата нажатия
    tmp_move : 0,
    scrol : false,
    touch : function (event)
    {
        this.tmp_move = 0;
        this.touch_position = event.touches[0].pageX;            
    },
    leave : function (event) // отпескаем
    {
        if ( Math.abs(this.tmp_move) < 80)
        {            
            return false; 
        }
        var OldNumber = this.NumberActivityPage;
        //this.NumberActivityPage = (this.NumberActivityPage + this.Pages.length + sign(tmp_move)) % this.Pages.length; // по кругу
        // от края до края
        this.NumberActivityPage = this.NumberActivityPage + sign(this.tmp_move);
        switch (this.NumberActivityPage)
        {
            case -1:
                this.NumberActivityPage = 0;
            break;
            case this.Pages.length:
                 this.NumberActivityPage =  this.NumberActivityPage - 1 ;
            break;
        }
        this.actualization(OldNumber);
    },
    move : function(event) // как бы перетаскивание
    { 
//    event.preventDefault();  
        if (!this.scrol)
        {
            event.preventDefault();
        } 
        this.scrol = false;
     /* 
    //    event.preventDefault();
    var left=event.touches[0].pageX;
        var top=event.touches[0].pageY;
        // Переместить элемент
        var el=document.getElementById('button-add-city');
        el.style.top=top+'px';
        el.style.left=left+'px';*/
        this.tmp_move = this.touch_position - event.touches[0].pageX;        
    },
    scr : function(event)
    {
        this.scrol = true;
 //       alert('Начало в дочернем ' + this.scrol);
    },
    actualization : function(OldNumber) // показываем актуальную страницу
    {
        var Flag = OldNumber || 'none';
        if (OldNumber == 'none')
            for (var i = 0; i < this.Pages.length; i++)
                document.getElementById(this.Pages[i]).style.display = 'none';
        else
            document.getElementById(this.Pages[OldNumber]).style.display = 'none';
        document.getElementById(this.Pages[this.NumberActivityPage]).style.display = 'inline-block';
    }
}
function calculation()
{
    startTime(); // cтарт времени
    getWeather(); // заполнение погода. возможно стоит делать, чтобы погода тоже обновлялась, например раз в 5 минут
    timer(); // старт таймера
    observerable.addListener( EventHandler, "EndSelect", "EndSelectF"); // регистрируем обработчик событий связанных с окончанием действий в select // возможно стоит как-то под ругому организавать процесс переброски событий
    observerable.addListener( EventHandler, "EndInsert", "EndInsertF"); // регистрируем обработчик событий связанных с окончанием действий в select // возможно стоит как-то под ругому организавать процесс переброски событий
    observerable.addListener( EventHandler, "EndUpdate", "EndUpdateF");
    observerable.addListener( EventHandler, "EndDelete", "EndDeleteF");

    observerable.addListener( EventHandlerSQL, "EndUpdateOne", "EndUpdateOneRecord"); // вспомогательные штучки, дабы отслеживать каждую запись
    observerable.addListener( EventHandlerSQL, "EndDeleteOne", "EndDeleteOneRecord");

    InitSelectCity(); // заполняем выпадающий список городов
    ActualizationUniqueField("City"); // заполняем необходимые данные о таблице города, а точнее данные о том, какое поле является коючевым
    InitTableCity(); // заполняем таблицу с городами на второй странице и на третьей странице
}
/// Время 
function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
 
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('clock').innerHTML = h + ":" + m + ":" + s;
    t = setTimeout(function(){startTime()},500); // просим программу перезупустить функцию через некоторое время
}; 
function checkTime(i){
    if (i < 10)
    {
        i = "0" + i;
    }
    return i;
};
function timer()
{
    Config.Timer = Config.Timer + 1;
    document.getElementById('Timer').innerHTML= Config.Timer;
    t = setTimeout(function(){timer()},1000);
}
function nulltimer() 
{
    Config.Timer = 0;    
    InitSelectCity(); // обновление данных о городах. потом убрать
}
