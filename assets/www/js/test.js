// тесстовый скрипт для проверки работоспособности плагина работы с базой данных и всего что только можно


// окно тестирование работаспособности плагина взаимодействия во внутренней базой данных
function DB()
{
    ShowTestWindow();
}
function ShowTestWindow()
{
	var Test = new DialogWindow(false,
    '',
    ['Создание таблицы', 'Удаление данных из таблицы', 'Удаление таблицы',
     'Выводим данные о таблицых', 'Показываем информацию о всех городах', 
     'Выводим данные о городе по id', 'Просмотреть какое поле  id',
     'Добавление одной записи', 'Заполняем. файла',
     'Обновление данных'],
    [
    	function(){
    		Test.close();
    		CreateTable('City', ["cityCode", "cityName", "countryName", "displayName"], "cityCode"); // создание необходимой нам таблицы
    		Test.open();
    	},
    	function(){
    		Test.close();
    		DeleteTable('City'); // чистка таблицы
    		Test.open();
    	},
    	function(){
    		Test.close();
    		DropTable('City'); // удаление таблицы
    		Test.open();
    	},
    	function(){
    		Test.close();
    		SelectDBWithCondition("sqlite_master", ["name", "sql", "type"], {type: "table"}); // вывеси информацию о всех таблицах
    		Test.open();
    	},
    	function(){
    		Test.close();
    		SelectDB("City", ["cityCode", "displayName"]); // показать информацию о всех городах
    		Test.open();
    	},
    	function(){
    		Test.close();
    		SelectDBFromID("City", ["cityCode", "displayName"], "Yekaterinburg"); // выбрать город по id UniqueCod - заносим из диалогового окна
    		Test.open();
    	},
    	function(){
    		Test.close();
    		alert(ReturnUniqueField("City")); // нормально работает
    		Test.open();
    	},
    	function(){
    		Test.close();
    		InsertIntoTableOne('City',
    			{cityCode : "Yekaterinburg",
    			displayName: "Екатеринбург"}, 
    			"IncertCity",
    			"Город с идентификатором : $ уже добавлен в базу. Выберите другой город");
    		t = setTimeout(Test.open(), 5000);
    	},
    	function(){
    		Test.close();
    		InsertIntoTableFromFile('City', "heap/city.json", "IncertCity", "Город с идентификатором : $ уже добавлен в базу. Выберите другой город");
    		Test.open();
    	},
        function(){
            Test.close();
            UpdateTableFromID('City', {displayName : "РОДИНА"}, "Yekaterinburg");
            Test.open();
        }
    ]);  
    Test.open();
}
function updateAuthenticationStatus(err, client)
{
    alert('updateAuthenticationStatus');
    // If the user is not authenticated, show the authentication modal
    if (!client.isAuthenticated())
    {
        alert('123');
    }
    else 
    {
        alert('321');
    }
}
var client;
function auth_callback (error)
{
    alert('auth_callback');
    if (error)
    {
       alert('Authentication error: ' + error);
       return;
    }
    if (client.isAuthenticated())
    {
        alert('авторизовались');
            
    } 
    else
    {
       alert('не авторизовались');
    }
}
function callbak(error)
{
    alert('внутри колбека')
}


function test_()
{
    alert("Тестируем дропюокс");
   /* 
    var client = new Dropbox.Client({ key: 'c2n5ua4texfat5g' });
    client.authDriver(new Dropbox.AuthDriver.Popup({receiverUrl: window.location.origin + '/oauth_receiver.html'}));
    // Check to see if we're authenticated already.
    client.authenticate({ interactive: false }, updateAuthenticationStatus);
    */
    
    
    var client = new Dropbox.Client({ key: 'c2n5ua4texfat5g',
    secret: "kra5rwnblwg00qs" });
    client.authDriver(new Dropbox.AuthDriver.Cordova());
    
    /*client.authenticate(function () {
    client.writeFile('hello.txt', 'Hello, World!', function () {
        alert('File written!');
    });
    });
*/
    client.authenticate(callbak);

//client.authenticate(auth_callback);

//    alert('rкак бы конец')
}
function errorHandler(e)
{
    console.log('Error: ' + e.name + ' ' + e.message);
    alert('Error: ' + e.name + ' ' + e.message);
}

function CreateFullFile()
{
    alert('Началось сохдание файла')
    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    alert('Началось сохдание файла_')
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onInitFs, errorHandler);
    function onInitFs(fileSystem)
    {
        alert('Началось сохдание файла123')
        fs.root.getFile('log.txt', {create: true},
            function(fileEntry)
            {
                alert('После создания файла');
                fileEntry.createWriter(
                    function(fileWriter)
                    {
                        fileWriter.onwriteend = function(e)
                        {
                            alert('Write completed.');
                            ReadFile();
                        };
                        fileWriter.onerror = function(e)
                        {
                            alert('Write failed: ' + e.toString());
                        };
                        var bb = new Blob(['Текст внутри файла'], {type: 'text/plain'});
                        //bb.append('Ipsum Lorem');
                        fileWriter.write(bb);
                    }, errorHandler);
            }, errorHandler);
    }
}

function f1()
{
    alert('f1');
}
function f2()
{
    alert('f2');
}

function test()
{
    if (window.File && window.FileReader && window.FileList && window.Blob)
    {
        alert('Работа с файлами возможна')
        document.addEventListener("deviceready", function() { 
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, f1, f2);
}, false);

    }
    else
    {
        alert('Приносим свои изменения. Работа с файлами невозможно');
    }
}

function ReadFile()
{
    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(window.TEMPORARY, 5*1024*1024, onInitFs, errorHandler);
    function onInitFs(fs)
    {
        fs.root.getFile('log.txt', {},
            function(fileEntry)
            {
                fileEntry.file(function(file)
                {
                    var reader = new FileReader();
                    reader.onloadend = function(e)
                    {
                       alert(this.result);
                    };
                    reader.readAsText(file);
                }, errorHandler);
            }, errorHandler);
    }   
}
