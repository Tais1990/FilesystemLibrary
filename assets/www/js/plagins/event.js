// плашин для проброски сообщений
var observerable = {
 
  // Это свойство - объект, будет содержать свойства - имена событий, 
  // которые в свою очередь будут массивами содержащими ссылки
  // на callback функции подписчиков:
  listeners : {},
   
  // Добавить подписчика:
  // object: Object - объект-подписчик;
  // evt: String - событие для объекта - подписчика;
  // callback: String - callback имя функции, которая должна выполнится при
  //                    возникновении события. Должна быть методом подписчика.
  addListener : function(/* Object */object, /* String */evt, /* String */callback)
  {
  // Если событие фигурирует впервые:
    if ( !this.listeners.hasOwnProperty(evt) )
    {
      // Нужно создать для него свойство в объекте this.listeners
      // заодно сразу обозначим тип данных - массив:
      this.listeners[evt] = [];
    }   
    // Помещаем ссылку на метод объекта - подписчика в массив события:
    // Далее мы сможем запускать код по этой ссылке, даже не передавая
    // в метод сам оббъект.
    this.listeners[evt].push(object[callback]);
  },   
  // Удалить подписчика (аргументы такие же как и у addListener) 
  removeListener : function(/* Object */object, /* String */evt, /* String */callback)
  {
    // Проверяем есть ли вообще такое событие в наличии:
    if ( this.listeners.hasOwnProperty(evt) )
    {
      var i,length; 
      // Здесь просто проходим циклом по свойствам - событиям 
      for (i = 0, length = this.listeners[evt].length; i < length; i += 1)
      {
        // Сравниваем значения...
        if ( this.listeners[evt][i] === object[callback])
        {
          // Если совпало - удаляем элемент из массива:
          this.listeners[evt].splice(i, 1);       
        }        
      }       
    }    
  },   
  // Вызвать событие:
  // evt : String - имя события,
  // args : Mixed - аргументы, которые мы можем передать в 
  // callback функцию при её срабатывании:
  triggerEvent : function(/* String */evt, /* Mixed */args)
  {
    // Проверяем есть ли вообще такое событие в наличии:
    if ( this.listeners.hasOwnProperty(evt) )
    {                  
      var i,length;                     
      // Проходимся по всем подписчикам:
      for (i = 0, length = this.listeners[evt].length; i < length; i += 1)
      {
        // Вызываем их callback - функции, передавая им аргументы, если они есть:
        this.listeners[evt][i](args);
      }
    }                           
  }
};
// справочная информация для использования проброски сообщений
/*
var one = {
            callBackOne : function(e)
            {
                alert("EVE ONE: " + e.message);
            }   
        }; 
        var two = {
            callBackTwo : function(e)
            {
                alert("EVE TWO: " + e.message);
            }            
        }; 
        // Регистрируем наблюдателей для событий someEventForOne и someEventForTwo:
        observerable.addListener( one, "someEventForOne", "callBackOne");
        observerable.addListener( two, "someEventForTwo", "callBackTwo");

        // отписываемся
        observerable.removeListener(one, "someEventForOne", "callBackOne");
        // Теперь допустим, что то произошло и мы в коде вызвали события
        // someEventForOne и someEventForTwo, а заодно передаём 
        // какую нибудь полезную информацию :
        observerable.triggerEvent("someEventForOne", {message : "i am one event"});
        observerable.triggerEvent("someEventForTwo", {message : "i am two event"});
*/
//func ничего не должна возвращать но сбирает data MainFunction - самая простая



