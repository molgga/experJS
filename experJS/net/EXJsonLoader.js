define(function(require , exports){
	var EXLoader = require("./EXLoader");
	/**
	(EXLoader 를 상속 받습니다.)
	<br/>XML, TEXT 데이터를 load 할 수 있는 객체입니다.
	@class EXJsonLoader
	@constructor
	@param [method="GET"] {String} HTTP Request 를 지정합니다.
	@param [asynchronous=true] {boolean} 비동기(true), 동기(false) 통신 방식을 지정합니다.
	@extends EXLoader
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<title></title>
		<script type="text/javascript" src="../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.includeBegin("../../experJS");
			EX.include("events/EXEventListener");
			EX.include("net/EXLoader");
			EX.include("net/EXJsonLoader");
			EX.includeEnd();

			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				
				var _loaderTester = null;
				_loaderTester = new LoaderTester();
				_loaderTester.init();

				function LoaderTester(){
					var _this = this;
					var _jsonLoader = null;
					_this.init = function(){
						loaderInitialize();
					};
					_this.destroy = function(){
					};
					function loaderInitialize(){
						loaderDestroy();
						_jsonLoader = new EXJsonLoader();
						_jsonLoader.init();
						EXEventListener.add( _jsonLoader , EXLoader.EVENT_START , loaderHandler );
						EXEventListener.add( _jsonLoader , EXLoader.EVENT_PROGRESS , loaderHandler );
						EXEventListener.add( _jsonLoader , EXLoader.EVENT_COMPLETE , loaderHandler  );
						EXEventListener.add( _jsonLoader , EXLoader.EVENT_COMPLETE_ALL , loaderHandler );
						EXEventListener.add( _jsonLoader , EXLoader.EVENT_ERROR , loaderHandler );
						_jsonLoader.addURL("../../data/json/sample1.json" , "sampleJson1");
						_jsonLoader.load();
					}
					function loaderHandler(evt){
						EX.debug("loaderHandler" , evt.type);
						switch(evt.type){
							case EXLoader.EVENT_START :
								break;
							case EXLoader.EVENT_PROGRESS :
								break;
							case EXLoader.EVENT_COMPLETE :
								break;
							case EXLoader.EVENT_COMPLETE_ALL :
								EX.debug( evt.dataObject.sampleJson1);
								break;
							case EXLoader.EVENT_ERROR :
								break;
						}
					}
					function loaderDestroy(){
					}
				}
			});
		})();
		</script>

		</head>
		<body>
		</body>
		</html>
	*/
	var EXJsonLoader = function(method , asynchronous){
		var _loader = this;
		_loader.setMethod(method);
		_loader.setAsynchronous(asynchronous);
		_loader.header["Content-type"] = "text/plain";
		_loader.mimeType = "text/plain";
	};
	EXJsonLoader.prototype = new EXLoader();
	EXJsonLoader.prototype.constructor = EXJsonLoader;

	/**
	<strong>override</strong>
	@method stateComplete
	@return {void}
	*/
	EXJsonLoader.prototype.stateComplete = function(){
		var urlData = this._addURLData[this._loadCnt];
		var responseData = this._urlRequest.responseText;
		if(typeof(JSON) != "undefined"){
			responseData = JSON.parse(responseData);
		}else{
			responseData = eval("("+responseData+")");
		}
		this._responseData[urlData.id] = responseData;
	};
	return EXJsonLoader;
});