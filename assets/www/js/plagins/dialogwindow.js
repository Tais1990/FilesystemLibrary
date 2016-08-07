// скрипт работы с диалоговыми формами. хитрые диалоговые окна, умные.
// Функции, которые смотрят наружу
// ShowAlertDialog(Message)
// ShowConfDialog (Message, CallBack)

// очередь диалоговых окон на открытие
var QueueModalWindow = 
{
	Queue : [], // массив окошек
	first : 0, // индекс первого элемента
	last  : 0, // индекс последнего элемента
	currentW : null, // текущее окошко
	flag : false, // идёт процесс обработки окон
	push : function(object) // добавляем элемент в конец очереди
	{
		this.Queue[this.last] = object;
		this.last = this.last + 1;
	},
	pop : function() // считываем следующий элемент из массива окошек
	{
		var a = null;
		if (this.first < this.last)
		{
			a = this.Queue[this.first];
			delete this.Queue[this.first];
			this.first = this.first + 1;
		}		
		return a;	
	}
}
function ShowAlertDialog(Message)
{
	var A = new DialogWindow(false, Message, 'OK', function(){A.close()});
	A.open();
}
function ShowConfDialog(Message, CallBack)
{
	var A = new DialogWindow(false, Message, ['OK', 'Отмена'], [function(){A.close(); CallBack()}, function(){A.close()}]);
	A.open();
}
function DialogWindow(FlagPromt, Message, NameButton, FubctionButtonClick) // конструктор
{
	this.name = 'Диологовое окно';
	this.label = { name: 'Текстовое поле', text : Message, id : 'dialog-message'};
	this.edit = {
		name: 'Поле для ввода текста',
		text : 'значение по умолчанию',
		id : 'dialog-edit',
		idW : 'dialog-editW',
		isVisible : FlagPromt}; 
	this.buttons = [];
	this.parent = null;	
	var current = this;

	this.open = function()
	{
		if (QueueModalWindow.flag)
		{
			QueueModalWindow.push(this); // поставили элемент в очередь на открытие
		}
		else
		{
			QueueModalWindow.flag = true; // запустили цикл обработки окошек
			this.openReal(); // раз нет ни одного открытого окшка, то бишь процесс не запущен. значит можно взять и открыть реально окошко
		}		
	};
	this.close = function()
	{
		if (this.edit.isVisible)
			this.edit.text = document.getElementById(this.edit.id).value;
		if (QueueModalWindow.currentW == this)
		{
			this.closeReal();
		}
	};
	this.openReal = function()
	{
		CreateWindowW();
		CreateUtilityAndName();		
		ShowCover();
  		document.getElementById('dialog-form-container').style.display = 'block';
  		QueueModalWindow.currentW = this;

	};
	this.closeReal = function()
	{
		HideCoverW();    
		document.getElementById('dialog-form-container').style.display = 'none';
		document.onkeydown = null;
		HideWindowW();
		var a = QueueModalWindow.pop(); // считываем следующее окошко 
		if (a != null) // есть следующее окошко в очереди на отображение
		{
			QueueModalWindow.currentW = a;
			a.openReal();
		}
		else // нету следующего окошка на отображение
		{
			QueueModalWindow.flag = false;
			QueueModalWindow.first = 0;
			QueueModalWindow.last = 0;
		}

	};
	

	if (!(NameButton instanceof Array))
  	{
    	NameButton = [NameButton];
  	}  
	var NumberButton = NameButton.length;	
	FubctionButtonClick = NormalizationArrayFunction(FubctionButtonClick);
	for (var i = 0; i < NumberButton; i++)
	{
		var idElenentWindow = 'dialog-button' + i;
	   	var Obj = {name: NameButton[i], id : idElenentWindow, callbackFunction : FubctionButtonClick[i]};
	   	this.buttons.push(Obj);
	}	

// рабочие внутренние функции
	function NormalizationArrayFunction(ArrayFunctions)
	{
		var NewArray = new Array(NumberButton);
		if (ArrayFunctions == null)
		{
			for (var i = 0; i < NumberButton; i++)
			{
				NewArray[i] = function(){};
			}
		}
		else
		{
	    	if (!(ArrayFunctions instanceof Array))
	    	{
	    		if (NumberButton == 1)
	    		{
	    			NewArray[0] = ArrayFunctions;
	      		}
	      		else
	      		{
	        		NewArray[0] = ArrayFunctions;
	        		for(var i = 1; i < NumberButton; i++)
	        		{
	          			NewArray[i] = function(){};
	        		}
	      		}
	    	}
	    	else // массив 
	    	{
	      		var i = 0;
	      		for(; (i < NumberButton) && (i < ArrayFunctions.length); i++)
	      		{
	        		if (ArrayFunctions[i] == null)
	        		{
	          			NewArray[i] = function(){};
	        		}
	        		else
	        		{
	          			NewArray[i] = ArrayFunctions[i];
	        		}
	      		}
	      		for(;i < NumberButton; i++)
	      		{
	        		NewArray[i] = function(){};
	      		}
	    	}
	  	}
	  	return NewArray;
	}
	function ShowCoverW() //развёртываем обложку
	{ 
  		var coverDiv = document.createElement('div');
  		coverDiv.id = 'dialog-cover';
  		coverDiv.className = 'dialog-cover';
  		document.body.appendChild(coverDiv);
	}
	function HideCoverW() //прячем подложку
	{
  		document.body.removeChild(document.getElementById('dialog-cover'));
	}
	function CreateWindowW()
	{ 
		// подключаем стилевые таблицы для диалогов		
		var css = document.createElement("LINK");
  		css.rel = "stylesheet";
  		css.href = "js/plagins/dialog.css";
  		css.id = "style-dialog";
  		document.getElementsByTagName("HEAD")[0].appendChild(css);
  
  		var DivContener = document.createElement('div');
  		DivContener.id  = 'dialog-form-container';
  		DivContener.className  = 'dialog-form-container';
		document.body.appendChild(DivContener);
		var FormDialog = document.createElement('form');
		FormDialog.id = 'dialog-form';
		FormDialog.className = 'dialog-form';
		DivContener.appendChild(FormDialog);   	

    	var DivMessage = document.createElement('div'); 
		DivMessage.id  = current.label.id;
		DivMessage.className  = 'dialog-message';
		FormDialog.appendChild(DivMessage);

		if (current.edit.isVisible)
		{
    		var newitem = "<input type=\"text\" autofocus size=\"20\" id=\"" + current.edit.id + "\" >";
    		newnode=document.createElement("center");
    		newnode.innerHTML=newitem;
    		newnode.id = current.edit.idW;
    		FormDialog.appendChild(newnode);
  		}  

		for (var i = 0; i < NumberButton; i++)
		{
			var BElenentWindow = document.createElement('button');
	    	var idElenentWindow = current.buttons[i].id
	    	BElenentWindow.id  = idElenentWindow;
	    	FormDialog.appendChild(BElenentWindow);
		}
	}
	function CreateUtilityAndName()
	{
		document.getElementById(current.label.id).innerHTML = current.label.text;			
		for(var i = 0; i < current.buttons.length; i++)
		{
			var idElenentWindow = current.buttons[i].id;
			var BElenentWindow = document.getElementById(idElenentWindow);
			BElenentWindow.className = 'dialog-button';
			BElenentWindow.onclick = current.buttons[i].callbackFunction;
			BElenentWindow.innerHTML = current.buttons[i].name;
		}
	}
	function HideWindowW()
	{
		var DivContener = document.getElementById('dialog-form-container');
		var FormDialog  = document.getElementById('dialog-form');
		
		var DivMessage  = document.getElementById(current.label.id);
		FormDialog.removeChild(DivMessage);
		for(var i = 0; i < current.buttons.length; i++)
		{
			var idElenentWindow = current.buttons[i].id;
			var BElenentWindow = document.getElementById(idElenentWindow);
			FormDialog.removeChild(BElenentWindow);
		}
		if (current.edit.isVisible)
  		{
    		var InputEdit = document.getElementById(current.edit.idW); 
    		FormDialog.removeChild(InputEdit);
  		}

		DivContener .removeChild(FormDialog);
		document.body.removeChild(DivContener);

		document.getElementsByTagName("HEAD")[0].removeChild(document.getElementById('style-dialog'));
	}
}
