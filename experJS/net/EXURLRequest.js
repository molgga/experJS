define(function(require , exports){
	/**
	Browser에서 지원하는 XMLHttpRequest 를 생성합니다.
	@class EXURLRequest
	@constructor
	@extends XMLHttpRequest
	@return {XMLHttpRequest}
	 */
	var EXURLRequest = function(){
		 var _request = null;
		 try {  
			 _request = new XMLHttpRequest();
		}catch(e) { try {
			var msxmls = [];
			msxmls[0] = "Msxml2.XMLHTTP.5.0";
			msxmls[1] = "Msxml2.XMLHTTP.4.0";
			msxmls[2] = "Msxml2.XMLHTTP.3.0";
			msxmls[3] = "Msxml2.XMLHTTP";
			for (var i = 0; i < msxmls.length; i++) {
				_request = new ActiveXObject(msxmls[i]);
				if(_request != null || _request != undefined) break;
			}
		}catch(e) { try {
			_request = new ActiveXObject("Microsoft.XMLHTTP");
		}catch(e) { _request = null; }}}
		 return _request;
	};
	return EXURLRequest;
});