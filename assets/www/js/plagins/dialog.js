// скрипт на простые диалоговые окна
// функции, которые смотрят наружу: 
// ShowAlert(textMessage, buttonName, CBFunctionB, CBFunctionA)
// ShowPromt(textMessage, buttonName, CBFunctionB, CBFunctionA)

var NumberButton = 0;
var FlagEdit = false;
function ShowCover() //развёртываем обложку
{ 
  var coverDiv = document.createElement('div');
  coverDiv.id = 'dialog-cover';
  document.body.appendChild(coverDiv);
  coverDiv.className = 'dialog-cover';
}
function HideCover() //прячем подложку
{
  document.body.removeChild(document.getElementById('dialog-cover'));
}
function CreateWindow()
{ 
  var css = document.createElement("LINK");
  css.rel = "stylesheet";
  css.href = "js/plagins/dialog.css";
  css.id = "style-dialog";
  document.getElementsByTagName("HEAD")[0].appendChild(css);
  
  var DivContener = document.createElement('div');
  DivContener.id  = 'dialog-form-container';
  document.body.appendChild(DivContener);
  DivContener.className = 'dialog-form-container';
  var FormDialog = document.createElement('form');
  FormDialog.id = 'dialog-form';
  DivContener.appendChild(FormDialog);
  FormDialog.className = 'dialog-form'
  var DivMessage = document.createElement('div');
  DivMessage.id  = 'dialog-message';
  FormDialog.appendChild(DivMessage); 
  DivMessage.className = 'dialog-message';

  if (FlagEdit)
  {
    var newitem = "<input type=\"text\" autofocus name=\"dialog-edit\" id=\"dialog-edit1\" size=\"20\">";
    newnode=document.createElement("center");
    newnode.innerHTML=newitem;
    newnode.id = 'dialog-edit';
    FormDialog.appendChild(newnode);
  }  
  for (var i = 0; i < NumberButton; i++)
  {
    var ButtonDialog = document.createElement('button');
    var id = 'dialog-button' + i;
    ButtonDialog.id  = id;
    FormDialog.appendChild(ButtonDialog);
  } 
}
function HideWindow()
{
  var DivContener = document.getElementById('dialog-form-container');
  var FormDialog  = document.getElementById('dialog-form');
  var DivMessage  = document.getElementById('dialog-message');
  
  if (FlagEdit)
  {
    var InputEdit   = document.getElementById('dialog-edit' ); 
    FormDialog.removeChild(InputEdit);
  }
  
  for (var i = 0; i < NumberButton; i++)
  {
    var id = 'dialog-button' + i;
    var ButtonDialog = document.getElementById(id);
    FormDialog.removeChild(ButtonDialog);
  }  
  FormDialog.removeChild(DivMessage);
  DivContener .removeChild(FormDialog);
  document.body.removeChild(DivContener);
  document.getElementsByTagName("HEAD")[0].removeChild(document.getElementById('style-dialog'));
}
function Complete() //  закрытие окошка целиком
{
  HideCover();    
  document.getElementById('dialog-form-container').style.display = 'none';
  document.onkeydown = null;
  HideWindow();
}
function CloseCallBack(CBFunctionB, CBFunctionA)
{
  return function()
    { // опасно, т.к. не контролируемо порядок выполнения // исправить и сделать через проброску собщений.
      CBFunctionB();
      Complete();
      CBFunctionA();
    }
}
function CreateUtilityAndName(textMessage, buttonName, CBFunctionB, CBFunctionA)
{
  document.getElementById('dialog-message').innerHTML = textMessage;
  for (var i = 0; i < NumberButton; i++)
  {
    var id = 'dialog-button' + i;
    var DB = document.getElementById(id);
    DB.onclick = CloseCallBack(CBFunctionB[i], CBFunctionA[i]);
    DB.className = 'dialog-button';
    DB.innerHTML = buttonName[i];
  } 
}
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
function ShowDialog(textMessage, buttonName, CBFunctionB, CBFunctionA)
{ 
  if (!(buttonName instanceof Array))
  {
    buttonName = [buttonName];
  }    
  NumberButton =  buttonName.length;
  CBFunctionB = NormalizationArrayFunction(CBFunctionB);
  CBFunctionA = NormalizationArrayFunction(CBFunctionA);
  CreateWindow();
  CreateUtilityAndName(textMessage, buttonName, CBFunctionB, CBFunctionA);
  ShowCover();
  document.getElementById('dialog-form-container').style.display = 'block';
}
function ShowAlert(textMessage, buttonName, CBFunctionB, CBFunctionA)
{
  FlagEdit = false;
  ShowDialog(textMessage, buttonName, CBFunctionB, CBFunctionA);
}
function GetEdit()
{
  if (FlagEdit)
  {
    return (document.getElementById('dialog-edit1').value);
  }    
  else
  {
    return ("Значение не опредленно");
  }    
}
function ShowPromt(textMessage, buttonName, CBFunctionB, CBFunctionA)
{
  FlagEdit = true;
  ShowDialog(textMessage, buttonName, CBFunctionB, CBFunctionA);
}
