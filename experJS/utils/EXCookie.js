define(function(require , exports){

		
	function trim(str){
		var strReg = /(^\s*)|(\s*$)/gi;
		if(str) str = str.replace(strReg,"");
		return str;
	}
	/**
	Cookie 와 관련된 Utility를 갖는 객체입니다.
	@class EXCookie
	@static
	 */

	/**
	쿠키에 데이터를 씁니다.
	@method set
	@param key {String} 쿠키의 key
	@param value {String} 쿠키의 value
	@param expireSecond {integer} 쿠키의 파기 시간.(초 단위)
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
			EX.include("utils/EXCookie");
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX.ready" , "callback");

				EX.debug(EXCookie.getBoolean("a"));
				EXCookie.set("a" , "123" , 10);
				EX.debug(EXCookie.getBoolean("a"));
				EX.debug(EXCookie.getValue("a"));
				EX.debug(EXCookie.getCookieToObject("a"));
				EXCookie.remove("a" , "123" , 10);
				EX.debug(EXCookie.getBoolean("a"));
			});
		})();
		</script>
		</head>
		<body>
		</body>
		</html>
	@return {void}
	*/
	exports.set = function(key , value , expireSecond){
		var isSecond = (expireSecond != undefined && !isNaN(expireSecond)) ? true : false;
		var iceCookie = key+"="+value;
		iceCookie = iceCookie+"; path=/;";
		var getDate = new Date();
		if(isSecond == true) iceCookie = iceCookie + "; expires="+new Date(getDate.getTime() + expireSecond*1000).toGMTString();
		document.cookie = iceCookie;
	};
	
	/**
	쿠키의 지정된 key 에 대한 데이터를 찾아 value 를 반환합니다.
	@method getValue
	@param key {String} 쿠키의 key
	@return {String}
	*/
	exports.getValue = function(key){
		var oven = exports.getCookieToObject();
		var ovenKey;
		for(ovenKey in oven) if(trim(ovenKey) == key) return oven[ovenKey];
		return null;
	};
	
	/**
	쿠키의 지정된 key 에 대한 데이터가 있을 경우 true 없을 경우 false 를 반환합니다.
	@method getBoolean
	@param key {String} 쿠키의 key
	@return {boolean}
	*/
	exports.getBoolean = function(key){
		var oven = exports.getCookieToObject();
		var ovenKey;
		for(ovenKey in oven) if(trim(ovenKey) == key) return true;
		return false;
	};

	/**
	쿠키의 지정된 key 에 대한 데이터를 삭제 합니다. 
	@method remove
	@param key {String} 쿠키의 key
	@return {void}
	*/
	exports.remove = function(key){
		if(exports.getBoolean(key) == true) exports.set(key,"", -1);
	};

	/**
	쿠키에 지정된 모든 데이터를 찾아 Object 형태로 key&value 로 바인딩하여 반환합니다.
	@method getCookieToObject
	@return {Object}
	*/
	exports.getCookieToObject = function(){
		var obj = {};
		var allCookieArr = document.cookie.split(";");
		var allCookieArrLength = allCookieArr.length;
		var splitNameArr;
		var key = "";
		var value = "";
		for(var i = 0 ; i < allCookieArrLength ; i++ ){
			splitNameArr = allCookieArr[i].split("=");
			key = splitNameArr[0];
			value = splitNameArr[1];
			obj[key] = value;
		}
		return obj;
	};

	/**
	1분. 쿠키 데이터에서 사용하는 expire 를 지정할 때 사용합니다.
	@property TIME_1_MINUTE
	@static
	@final
	@default 60
	*/
	exports.TIME_1_MINUTE = 60;
	
	/**
	1시간. 쿠키 데이터에서 사용하는 expire 를 지정할 때 사용합니다.
	@property TIME_1_HOUR
	@static
	@final
	@default 3600
	*/
	exports.TIME_1_HOUR = 60*60;
	
	/**
	1일. 쿠키 데이터에서 사용하는 expire 를 지정할 때 사용합니다.
	@property TIME_1_DAY
	@static
	@final
	@default 86400
	*/
	exports.TIME_1_DAY = 60*60*24;
	
	/**
	1주일. 쿠키 데이터에서 사용하는 expire 를 지정할 때 사용합니다.
	@property TIME_1_WEEK
	@static
	@final
	@default 604800
	*/
	exports.TIME_1_WEEK = 60*60*24*7;
});