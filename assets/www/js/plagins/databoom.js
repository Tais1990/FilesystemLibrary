var boom =
{
	CityName : [],
	TempTable : [],
	ResultTemp : []
}
var google;
var flag = false;
function showError(msg) // сообщение об ошибке 
{
	alert('ошибка при работе с сетевой базой данных : ' + msg);
} 
function ConvertDate(date)
{
	return(
		('0' + date.getDate()).slice(-2) + '.'+
		('0' + (date.getMonth() + 1)).slice(-2));
}
function drawChart()
{
//	alert('test');
	var data = google.visualization.arrayToDataTable(boom.ResultTemp);
	var options =
	{
		title: 'Температурный график',
		curveType: 'function',
		legend: { position: 'bottom' }
	};
	var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
	chart.draw(data, options);
}
function newDraw()
{
	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawChart);		
}	
function ReadInformationFtomGraph1(ArrayCity, DateStart, DateEnd) // считываем информацию из датабума о температуре
{
	var db = databoom("https://t258.databoom.space", "b258");
	db.login("default", "Dtyz2006").done(ReadTempFromBD);
	function ReadTempFromBD()
	{
		var s = "(date le " + JSON.stringify(DateEnd)+ ") and (date ge " + JSON.stringify(DateStart) +")"
		db.load('Temperatura', { filter: s, orderby: "date" }).done(WriteResultTable).fail(showError);
	}
	function WriteResultTable(data) // если удалось всё считать - записываем 
	{
		boom.ResultTemp = [];
		var Title = [];
		var City = [];
		Title.push('Дата');
		for (var i = 0; i < ArrayCity.length; i++)
		{
			Title.push(ArrayCity[i].name);
			City.push(ArrayCity[i].iddataboom);
		}
		boom.ResultTemp.push(Title);
		var T = {};
		for (var i = 0; i < data.length; i++)
		{
			var s = '{ "cityID" : "' +  data[i].cityID + '", "date" : "' + data[i].date + '", "temp" : ' + data[i].temp + '}';		
			boom.TempTable.push(JSON.parse(s));
			var D = new Date(data[i].date);
			if (T[ConvertDate(D)] == null)
				T[ConvertDate(D)] = {"date" : ConvertDate(D)};
			var s = JSON.stringify(T[ConvertDate(D)]);
			s = s.replace("}", ",");
			s = s + ' "' + data[i].cityID + '" : '+  data[i].temp + '}'
			T[ConvertDate(D)] = JSON.parse(s);
		}
		for (var key in T)
		{
			var Obj = T[key];
			var Arra = [];
			Arra.push(Obj.date); // заполняем значение даты
			for (var i = 0; i < City.length; i++)
			{
				if (Obj[City[i]] == null)
					Arra[i+1] = 0;
				else
					Arra[i+1] = Obj[City[i]] 
			}
			boom.ResultTemp.push(Arra);
		}
		if (!flag)
		{
			newDraw(); // отрисовка
			flag = true;
		}
		else
		{
			drawChart();
		}
	}
}
function synchronize() // прорабатываем нажатие синхрогнизировать, считываем данные о том, для каких городов 
{	
	// считываем данные о том, для каких городов нам надо посторить графики и за какой промежуток времени
	var ArrayCity = [];
	var DateStart;
	var DateEnd;
	var db = databoom("https://t258.databoom.space", "b258");
	db.login("default", "Dtyz2006").done(ReadIDCity);
	var counter = Config.NumberCity;	
	// считываем данные о том, для каких городов надо построить график	
	function ReadIDCity() // считываем, для каких городов надо посторить график
	{
		var CodeDisplayName = {};
		DateStart = new Date (document.getElementById('begin-date').value);
		DateEnd = new Date (document.getElementById('end-date').value);
		for (var i = 0; i < Config.NumberCity; i++)
		{
 			var Checkbox = document.getElementById('TableCheckboxG'+i); 
    		if (Checkbox.checked) // город действительно помечас на отрисовку
    		{
    			var DisplayName = document.getElementById('TableEditG'+i).getAttribute("name");
    			var CodeName = Checkbox.name;
    			CodeDisplayName[CodeName] = DisplayName;
    			var Condition = "code eq '" + CodeName + '"';
				db.load('City', {filter: Condition}).done(
					function(data)
					{
						if (data.length == 1) // ма нашли ту запись которая нам нужна ну и на всякий случай говори, что нам нужна только она
							ArrayCity.push({code :  data[0].code, name :   CodeDisplayName[data[0].code], iddataboom : data[0].id});
						Check();	// не хочу писать обработчие кобытий
					})
					.fail(showError);     			
			}
			else
				Check();			  
		}		
	}
	function Check() // заместо обработчика событий
	{
		counter--;
		if(counter == 0)
			ReadInformationFtomGraph1(ArrayCity, DateStart, DateEnd); // начали читать  данные из датабума
	}
}
function InsertCityDataBoom(CodeCity) // вставка в датабум данных о городе, прои добавлении города во внутенюю базу данных
{
	var db = databoom("https://t258.databoom.space", "b258");
	db.login("default", "Dtyz2006").done(CheckCode);
	function CheckCode()
	{
		var Condition = "code eq '" + CodeCity + '"';
		db.load('City', {filter: Condition}).done(
			function(data)
			{
				if (data.length == 0) // нету ещё записи с этим кодом
					db.save('City', {code : CodeCity}); // добавляем данные о новом городе в датабум				
			})
		.fail(showError);
	}
}

