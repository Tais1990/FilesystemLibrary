// самый простой вариант написания транзакции
// существенно: работа со строками и работа с функциями

function TransactionSimple(MainFunction, VariableValues, SuccessFunction, ErrorFunction)
{
  var ErrorCode;
  if (ErrorFunction == undefined)
  {
    ErrorCode = "alert(\"Error of Transaction\");"
  }
  else
  {
    ErrorCode = ErrorFunction.name + "();";
  }  
  function Arguments(CoreCode)
  {
    var n1 = CoreCode.indexOf('(') + 1;
    var n2 = CoreCode.indexOf(')');
    var result = CoreCode.substring(n1, n2);
    return result;
  }
  function Cod(CodeCode)
  {
    var n1 = CodeCode.indexOf('{', CodeCode.indexOf(')')) + 1;
    var n2 = CodeCode.lastIndexOf('}');
    var result = CodeCode.substring(n1, n2);
    return result;
  }
  var NewCod = "try { var data; " + Cod(MainFunction.toString()) + " " + SuccessFunction.name + "(data); } catch (err) { "+ ErrorCode +"}";
  alert(NewCod);
  var FunctionTransaction = new Function(Arguments(MainFunction.toString()), NewCod);
  FunctionTransaction(VariableValues);
};
