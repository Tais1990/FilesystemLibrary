//плагин для работы со внутренней базой данных

var ConfigDB = 
{
	UniqueCodeOfTable : [ ],
	NumberRecordFromUpdate : 0
}
var InformationFomUpdate = {};
var InformationFomDelete = {};
var EventHandlerSQL =  // обработчик ссобытий
{
    EndUpdateOneRecord : function(option)
    { 
    	var PeremennayU =   '"'+ option.code +'"';
    	InformationFomUpdate[PeremennayU] = InformationFomUpdate[PeremennayU] - 1;
    	if (InformationFomUpdate[PeremennayU] == 0)
    	{
    		delete InformationFomUpdate[PeremennayU]; // говорим, что данная задача на обновление данных закончена и можно запускать её заново
    		observerable.triggerEvent("EndUpdate", {code : option.code, result : 1, message : "Все данные успешно измененны"});     		
    	}    	
    },
    EndDeleteOneRecord : function(option)
    { 
    	var PeremennayD =   '"'+ option.code +'"';
    	InformationFomDelete[PeremennayD] = InformationFomDelete[PeremennayD] - 1;
    	if (InformationFomDelete[PeremennayD] == 0)
    	{
    		delete InformationFomDelete[PeremennayD]; // говорим, что данная задача на обновление данных закончена и можно запускать её заново
    		observerable.triggerEvent("EndDelete", {code : option.code, result : 1, message : "Все данные успешно измененны"});     		
    	}    	
    }
}

function FieldNameToString(NameField)
{
	var col = ""; 
	if (NameField instanceof Array)
	{
		for (var i = 0; i < NameField.length; i++)
		{
			col += NameField[i] + ", ";
		}
		if (col.length < 2)
		{
			col = "id unique";
		}
		else
		{
			col = col.substring(0, col.length - 2);
		}		
	}
	else
	{
		col = NameField;
	}
	return col;
}
function FieldNameToArray(NameField)
{
	if (!(NameField instanceof Array))
	{
		NameField = [NameField];
	}
	return NameField;
}
function ConstructCondition(Condition) //конструктор условий по массиву, который возвращает строку
{
	var StringCondition = "";
	if (Condition != null)	
	{
		StringCondition = " where ";
		for (var key in Condition)
		{
			var value = Condition[key];
			if ((typeof value) != "number")
        	{        			
        		value = '"' + value + '"';
        	}
			StringCondition += key + ' = ' + value + " and ";
		}
		StringCondition = StringCondition.substring(0, StringCondition.length - 5);		
	}
	return StringCondition;
}
function CreateTable(TableName, NameField, NameUniqueField) // создание таблицы
{
	NameUniqueField = NameUniqueField || NameField[0];
	var StringIndex	= "";
	function create(tx)
	{
		tx.executeSql('DROP TABLE IF EXISTS ' + TableName);
		tx.executeSql('CREATE TABLE IF NOT EXISTS ' +  TableName + ' ( ' + FielName +' )'); 
		tx.executeSql(StringIndex);
	}
	var FielName = FieldNameToString(NameField);
	var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
	var falg = true;
	for (var i = 0; falg && (i < NameField.length) ; i++)
		flag = (NameField[i] == NameUniqueField)
	if (falg) 
		NameUniqueField = NameField[0];
	StringIndex	= 'CREATE UNIQUE INDEX ' + 'INDEX_' + TableName + '_' + NameUniqueField + ' ON ' + TableName + ' ( ' + NameUniqueField + ' );'
	db.transaction(create, MessageOfErrorOfDB);
}
function DeleteTable(TableName) // удаление данных их таблицы
{
	var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
	db.transaction(deleteT, MessageOfErrorOfDB);
	function deleteT (tx)
	{
		tx.executeSql('DELETE FROM ' + TableName);
	}
}
function DropTable(TableName) // удаление таблицы из базы
{
	var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
	db.transaction(deleteT, MessageOfErrorOfDB);
	function deleteT (tx)
	{
		tx.executeSql('DROP TABLE IF EXISTS ' + TableName);
	}
}
function MessageOfErrorOfDB(err) // проброска сообщения об ошибки
{	
	alert("Error processing SQL: " + err.code + " " + err.message);
}
function SelectDB_(TableName, NameField, StringCondition, Code) // выборка из базы с условием (самый низкий уровень)
{
	Code = Code || "None";
	var ResultArray = [];
    NameField = FieldNameToArray(NameField);
	var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
    db.transaction(ReadDataFromDB, MessageOfErrorOfDB);    
	function ReadDataFromDB(tx)
    {
		tx.executeSql('SELECT * FROM ' + TableName + StringCondition, [], ParserDataFromBD, MessageOfErrorOfDB);    
    }
	function ParserDataFromBD(tx, results)
    {
        var len = results.rows.length;
        var NumberField = NameField.length;
        for (var i = 0; i < len; i++)
        {
        	var s = '{';
        	for (var j = 0; j < NumberField; j++)
        	{
        		var value = results.rows.item(i)[NameField[j]];
        		if ((typeof value) != "number")
        		{        			
        			value = '"' + value + '"';
        		}
        		s+= '"' + NameField[j] + '" : ' + value + ', '
        	}        	
        	if (s.length > 2)
        	{
        		s = s.substring(0, s.length - 2)
        	}
        	s += '}';
        	var Obj = JSON.parse(s);
        	ResultArray.push(Obj);
        }
        observerable.triggerEvent("EndSelect", {code : Code, data : ResultArray});     
    } 
}
function SelectDBWithCondition(TableName, NameField, Condition, Code) // пока по умолчанию везде стоит операнд И .. выборка с условием
{
	var StringCondition = ConstructCondition(Condition);
	SelectDB_(TableName, NameField, StringCondition, Code);
}
function SelectDB(TableName, NameField, Code) // выборка без условия
{
	SelectDB_(TableName, NameField, "", Code);	
}
function SelectDBFromID(TableName, NameField, UniqueCod, Code)  // выборка по уникальному идентификатору
{
	if ((typeof UniqueCod) != "number")
    {        			
    	UniqueCod = '"' + UniqueCod + '"';
    }
    var s = "{ \"" + ReturnUniqueField(TableName) + "\" : " + UniqueCod + " }";
	SelectDBWithCondition(TableName, NameField, JSON.parse(s), Code);
}
function ActualizationUniqueField(TableName) // актуализация данных о ключевом поле
{
	SelectDBWithCondition("sqlite_master", ["name", "tbl_name"], {type: "index", tbl_name:TableName}, "ActualizationUniqueField");
}
function AddUniqueField(obj) // добавление данных об уникальном поле в конфиг
{
	var result = obj.name.substring(('INDEX_' + obj.tbl_name + '_').length);
    ConfigDB.UniqueCodeOfTable.push({table: obj.tbl_name, code: result});
}
function ReturnUniqueField(TableName) // возвращаем уникальный идентификатор
{
	var flag = true;
	for (var i = 0; flag && i < ConfigDB.UniqueCodeOfTable.length; i++)
	  	if (ConfigDB.UniqueCodeOfTable[i].table == TableName)
  			return ConfigDB.UniqueCodeOfTable[i].code
  	alert("Для таблицы " + TableName + " не найдело уникального поля");
  	return null;
}
function InsertIntoTable_(TableName, ValueField, Code, ErrMesage) // вставка данных (самый низкий уровень)
{
	Code = Code || "None";
	ErrMesage = ErrMesage || "Запись с уникальным индексом: $ уже существует";
	var UniqueCad = ReturnUniqueField(TableName);
	var UniqueValue = "";
	if (ValueField == null)
		Success();
	function Insert(tx)
	{		
		var NameField = "";
		var ValFields = ""; 			
		for (var key in ValueField)
		{
			var value = ValueField[key];
			if (key == UniqueCad)
				UniqueValue = value;
			if ((typeof value) != "number")
        		value = '"' + value + '"';
        	NameField += key + ", ";
        	ValFields += value + ", "; 
 		}
 		if (NameField.length >= 2)
 			NameField = NameField.substring(0, NameField.length - 2);
 		if (ValFields.length >= 2)
 			ValFields = ValFields.substring(0, ValFields.length - 2);	
 		var s = "INSERT INTO " + TableName + " ( " + NameField + " ) VALUES ( " + ValFields + " ) ";
 		tx.executeSql(s);		
	}
	function ErrorInIncert(err)
	{
		if (err.code == 6)
		{
			ErrMesage = ErrMesage.replace("$", UniqueValue);
			ShowAlert(ErrMesage, 'OK', null,null);
		}
		else
		{
			alert("Произошла ошибка при записи в базу : " + err.code + " " + err.message);
		}		
	}
	function Success()
	{
		observerable.triggerEvent("EndInsert", {code : Code, uniqe : UniqueValue});   
	}
	var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
	db.transaction(Insert, ErrorInIncert, Success);	
}
function InsertIntoTableOne(TableName, ValueField, Code, ErrMesage) // вставка одной записи в таблицу
{
	InsertIntoTable_(TableName, ValueField, Code, ErrMesage);
}
function InsertIntoTableArray(TableName, Array_, Code, ErrMesage) // вставка массива в таблицу
{
	for (var i = 0; i < Array_.length; i++)
		InsertIntoTable_(TableName, Array_[i], Code, ErrMesage)
}
function InsertIntoTableFromFile(TableName, FileName, Code, ErrMesage) // вставка данных из файла
{	
	$.getJSON(FileName)
		.success(function(data) { InsertIntoTableArray(TableName, data.array, Code, ErrMesage)})
		.error(function() { alert("Не смогли прочитать данные из файла"); });
}
function UpdateTable_(TableName, ValueField, StringCondition, Code) // обновление таблицы (самй низкий уровень)
{
	Code = Code || "None";
	if (ValueField == null)
		Success();
	function Update(tx)
	{		
		var set = "";
		for (var key in ValueField)
		{
			var value = ValueField[key];			
			if ((typeof value) != "number")
        		value = '"' + value + '"';
        	set += key + ' = ' + value  + ", ";        	
 		}
 		if (set.length >= 2)
 			set = set.substring(0, set.length - 2);
 		
 		var s = "UPDATE " + TableName + " SET " + set + StringCondition;
 		tx.executeSql(s);		
	}
	function ErrorInUpdate(err)
	{
		alert("Произошла ошибка при обновлении данных в базе : " + err.code + " " + err.message);		
	}
	function Success() // удачно внесли все изменения и соответственно пробрасываем сообщение
	{
		observerable.triggerEvent("EndUpdateOne", {code : Code});   
	}
	var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
	db.transaction(Update, ErrorInUpdate, Success);
}
function UpdateTableCondition(TableName, ValueField, Condition, Code) // обновление таблицы с сусловием
{
	var StringCondition = ConstructCondition(Condition);
	UpdateTable_(TableName, ValueField, StringCondition, Code);
}
function UpdateTableFromID(TableName, ValueField, UniqueCodValue, Code) //обновление записи по уникальному индентификкатору
{
	var UniqueCod = ReturnUniqueField(TableName);
	if ((typeof UniqueCodValue) != "number")
    {        			
    	UniqueCodValue = '"' + UniqueCodValue + '"';
    }
    var s = "{ \"" + UniqueCod + "\" : " + UniqueCodValue + " }";
	UpdateTableCondition(TableName, ValueField, JSON.parse(s), Code);
}
function UpdateTableArray (TableName, Array_, Code) // обновление таблицы массивом
{
	var UniqueCod = ReturnUniqueField(TableName);
	if (Array_.length == 0)
	{
		alert("Ни одна запись не была измененна");
		observerable.triggerEvent("EndUpdate", {code : Code, result : -1, message : "Нет данных для измененния"}); 
	}
	else
	{
		var PeremennayU = '"'+ Code+ '"';		
		if (PeremennayU in InformationFomUpdate)
		{	
			observerable.triggerEvent("EndUpdate", {code : Code, result : -1, message : "В данный момент система занята аналогичной задачей. Второй раз задача запущенная не будет"}); 
		}
		else
		{
			InformationFomUpdate[PeremennayU] = Array_.length;
			for (var i = 0; i < Array_.length; i++)
			{
				var UniqueCodValue = '';
				var s = '{ ';
				var Obj =  Array_[i];
				for (var key in Obj)
				{
					if (key == UniqueCod)
						UniqueCodValue = Obj[key];
					else
						s += '"' + key + '" : "' +  Obj[key] + '", ' 
				}
				if (s.length > 2)
					s = s.substring(0, s.length - 2);
				s += '}';
				if (UniqueCodValue == '')
					alert('Идентификатор города не определён. Изменение данных невозможно');
				else
					UpdateTableFromID(TableName, JSON.parse(s), UniqueCodValue, Code);
			}
		}  
	}
}
function DeleteTable_(TableName, StringCondition, Code) // удаление данных из таблицы (самый ни зкий уровень)
{
	Code = Code || "None";
	function Delete(tx)
	{	
 		var s = "DELETE FROM " + TableName + StringCondition;
 		tx.executeSql(s);		
	}
	function ErrorInDelete(err)
	{
		alert("Произошла ошибка при удалении данных в базе : " + err.code + " " + err.message);		
	}
	function Success() // удачно внесли все изменения и соответственно пробрасываем сообщение
	{
		observerable.triggerEvent("EndDeleteOne", {code : Code});   
	}
	var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
	db.transaction(Delete, ErrorInDelete, Success);
}
function DeleteTableCondition(TableName, Condition, Code) // удаление данных из таблицы с условием
{
	var StringCondition = ConstructCondition(Condition);
	DeleteTable_(TableName, StringCondition, Code);
}
function DeleteTableFromID(TableName, UniqueCodValue, Code) // удаление данных по идентификатору
{
	var UniqueCod = ReturnUniqueField(TableName);
	if ((typeof UniqueCodValue) != "number")
    {        			
    	UniqueCodValue = '"' + UniqueCodValue + '"';
    }
    var s = "{ \"" + UniqueCod + "\" : " + UniqueCodValue + " }";
	DeleteTableCondition(TableName, JSON.parse(s), Code);
}
function DeleteTableArray (TableName, Array_, Code) /*Array_ содержат только id*/ // удаление данных по id скопом
{
	var UniqueCod = ReturnUniqueField(TableName);
	if (Array_.length == 0)
	{
		alert("Ни одна запись не была удалена");
		observerable.triggerEvent("EndDelete", {code : Code, result : -1, message : "Нет данных для удаления"}); 
	}
	else
	{
		var PeremennayD = '"'+ Code+ '"';		
		if (PeremennayD in InformationFomDelete)
		{	
			observerable.triggerEvent("EndDelete", {code : Code, result : -1, message : "В данный момент система занята аналогичной задачей. Второй раз задача запущенная не будет"}); 
		}
		else
		{
			InformationFomDelete[PeremennayD] = Array_.length;
			for (var i = 0; i < Array_.length; i++)
			{
				DeleteTableFromID(TableName, Array_[i], Code);
			}
		}  
	}
}