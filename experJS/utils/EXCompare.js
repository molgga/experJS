define(function(require , exports){
	/**
	@class EXCompare
	@static
	*/
	/**
	해당 객체가 사용 가능한 객체(null,undefined 외) 인지 확인합니다. 
	@method isAble
	@static
	@param compare {Object} 확인 대상이 될 객체.
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<title></title>
		<script type="text/javascript" src="../../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.includeBegin("../../../experJS");
			EX.include("utils/EXCompare");
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				
				var compare;
				EX.debug( "isAble : " , EXCompare.isAble(compare) );
				compare = null;
				EX.debug( "isAble : " , EXCompare.isAble(compare) );
			});
		})();
		</script>
		</head>
		<body>
		</body>
		</html>
	@return {boolean}
	*/
	exports.isAble = function(compare){
		var is = true;
		if(compare == null || compare == undefined) is = false;
		return is;
	};

	/**
	해당 객체의 타입이 Array 인지 확인합니다.
	@method isArray
	@static
	@param compare {Object} 확인 대상이 될 객체.
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<title></title>
		<script type="text/javascript" src="../../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.includeBegin("../../../experJS");
			EX.include("utils/EXCompare");
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				
				var compare;
				EX.debug( "isArray : " , EXCompare.isArray(compare) );
				compare = [1,2,3];
				EX.debug( "isArray : " , EXCompare.isArray(compare) );
			});
		})();
		</script>
		</head>
		<body>
		</body>
		</html>
	@return {boolean}
	*/
	exports.isArray = function(compare){
		if(EXCompare.isAble(compare) == false) return false;
		return (compare.constructor == Array);
	};

	/**
	해당 객체의 타입이 Function 인지 확인합니다.
	@method isFunction
	@static
	@param compare {Object} 확인 대상이 될 객체.
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<title></title>
		<script type="text/javascript" src="../../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.includeBegin("../../../experJS");
			EX.include("utils/EXCompare");
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				
				var compare;
				EX.debug( "isFunction : " , EXCompare.isFunction(compare) );
				compare = function(){};
				EX.debug( "isFunction : " , EXCompare.isFunction(compare) );
			});
		})();
		</script>
		</head>
		<body>
		</body>
		</html>
	@return {boolean}
	*/
	exports.isFunction = function(compare){
		if(exports.isAble(compare) == false) return false;
		return (compare.constructor == Function);
	};

	/**
	해당 객체의 타입이 String 인지 확인합니다.
	@method isString
	@static
	@param compare {Object} 확인 대상이 될 객체.
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<title></title>
		<script type="text/javascript" src="../../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.includeBegin("../../../experJS");
			EX.include("utils/EXCompare");
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				
				var compare;
				EX.debug( "isString : " , EXCompare.isString(compare) );
				compare = "123";
				EX.debug( "isString : " , EXCompare.isString(compare) );
			});
		})();
		</script>
		</head>
		<body>
		</body>
		</html>
	@return {boolean}
	*/
	exports.isString = function(compare){
		if(exports.isAble(compare) == false) return false;
		return (compare.constructor == String);
	};

	/**
	해당 객체의 타입이 Number 인지 확인합니다.
	@method isNumber
	@static
	@param compare {Object} 확인 대상이 될 객체.
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<title></title>
		<script type="text/javascript" src="../../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.includeBegin("../../../experJS");
			EX.include("utils/EXCompare");
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				
				var compare;
				EX.debug( "isNumber : " , EXCompare.isNumber(compare) );
				compare = 123;
				EX.debug( "isNumber : " , EXCompare.isNumber(compare) );
			});
		})();
		</script>
		</head>
		<body>
		</body>
		</html>
	@return {boolean}
	*/
	exports.isNumber = function(compare){
		if(exports.isAble(compare) == false) return false;
		return (compare.constructor == Number);
	};

	/**
	해당 객체의 타입이 Object 인지 확인합니다.
	@method isObject
	@static
	@param compare {Object} 확인 대상이 될 객체.
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<title></title>
		<script type="text/javascript" src="../../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.includeBegin("../../../experJS");
			EX.include("utils/EXCompare");
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				
				var compare;
				EX.debug( "isObject : " , EXCompare.isObject(compare) );
				compare = { a: 1, b: 2 };
				EX.debug( "isObject : " , EXCompare.isObject(compare) );
			});
		})();
		</script>
		</head>
		<body>
		</body>
		</html>
	@return {boolean}
	*/
	exports.isObject = function(compare){
		if(exports.isAble(compare) == false) return false;
		return (compare.constructor == Object);
	};
});