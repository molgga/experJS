define(function(require , exports){
	var EXURLRequest = require("./EXURLRequest");
	var EXCustomEvent = require("../events/EXCustomEvent");

	var EXLoader = {};
	var isIE8Under = (function(){
		var ieVer = -1;
		var ua = navigator.userAgent;
		var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null) ieVer = parseFloat( RegExp.$1 );
		if(ieVer != -1 && ieVer <= 8){
			return true;
		}
		return false;
	})();

	var isFF = /Firefox/.test(navigator.userAgent);
	/**
	<strong>(beta)</strong> 데이터를 load 할 수 있는 객체입니다.
	<br/>데이터를 추가(addURL)하여 여러개의 데이터를 순차적으로 받는것을 지원합니다.
	<br/>예제는 XmlLoader , ImageLoader 객체에서 참고하시기 바랍니다.
	@class EXLoader
	@constructor
	@param [method="GET"] {String} HTTP Request 방식을 지정합니다. (GET || HEAD || POST || PUT || DELETE || OPTION || TRACE)
	@param [asynchronous=true] {boolean} 비동기(true), 동기(false) 통신 방식을 지정합니다.
	 */
	EXLoader = function(method , asynchronous){
		var _loader = this;
		if(method == undefined){
			_loader.method = "GET";
		}else{
			_loader.method = method;
		}
		
		_loader.asynchronous = (asynchronous == false) ? false : true;
		_loader.header = {};
		_loader.header["Content-type"] = "application/x-www-form-urlencoded";
		_loader.mimeType = "application/x-www-form-urlencoded";
	};
	
	/**
	cache 를 사용할지 여부를 지정합니다.
	@method setCache
	@param cache {boolean} cache 를 사용할지 여부를 지정합니다.
	 */
	EXLoader.prototype.setCache = function(cache){
		var _loader = this;
		if(cache == false){
			_loader.header["Cache-Control"] = "no-cache";
			_loader.header["Expire"] = new Date();
			_loader.header["Pragma"] = "no-cache";
		}
	}
	
	/**
	통신 방식을 지정합니다.
	@method setMethod
	@param method {String} HTTP Request 방식을 지정합니다. (GET || HEAD || POST || PUT || DELETE || OPTION || TRACE)
	 */
	EXLoader.prototype.setMethod = function(method){
		var _loader = this;
		if(method != undefined) _loader.method = method;
	}
	
	/**
	비동기, 동기 방식을 지정합니다.
	@method setAsynchronous
	@param asynchronous {boolean} {boolean} 비동기(true), 동기(false) 통신 방식을 지정합니다.
	 */
	EXLoader.prototype.setAsynchronous = function(asynchronous){
		var _loader = this;
		_loader.asynchronous = (asynchronous == false) ? false : true;
	}
	EXLoader.prototype._addURLData = null;
	EXLoader.prototype._responseData = null;
	EXLoader.prototype._loadTotal = null;
	EXLoader.prototype._loadCnt = null;
	EXLoader.prototype._urlRequest = null;

	/**
	Loader 객체를 초기화 합니다.
	@method init
	@return {void}
	*/
	EXLoader.prototype.init = function(){
		var _loader = this;
		_loader._addURLData = [];
		_loader._responseData = {};
		_loader._loadTotal = 0;
		_loader._loadCnt = 0;
		_loader._urlRequest = new EXURLRequest();

		//var progressInterval = null;
		var bytesTotal = 0;
		var bytesLoaded = 0;
		_loader._urlRequest.onreadystatechange = function(){
			switch(_loader._urlRequest.readyState){
				case 0: //초기화안됨 uninitialized
					break;
				case 1: //읽는중 load
					EXEventListener.dispatch( _loader , new EXCustomEvent(EXLoader.EVENT_START));
					break;
				case 2: //읽기완료 loaded
					if(isIE8Under == false) bytesTotal = _loader._urlRequest.getResponseHeader("Content-Length");
					break;
				case 3: //작업중 load progress
					//bytesLoaded
					//크롬, 사파리 : _loader._urlRequest.response 
					//크롬, 사파리, 파폭 : _loader._urlRequest.responseText
					//console.log(_loader._urlRequest.responseText.length);

					//bytesTotal
					//한번만 체크하면 됨.
					//console.log(_loader._urlRequest.getResponseHeader("Content-Length"));
					//console.log(_loader._urlRequest.responseText.length);
					
					var customEvent = new EXCustomEvent(EXLoader.EVENT_PROGRESS);

					if(isIE8Under == false){
						if(bytesTotal <= 0 ) bytesTotal = _loader._urlRequest.getResponseHeader("Content-Length");
						bytesLoaded = _loader._urlRequest.responseText.length;


						customEvent.bytesLoaded = bytesLoaded;
						customEvent.bytesTotal = bytesTotal;
						customEvent.bytesPercent = bytesLoaded/bytesTotal;
					}

					EXEventListener.dispatch( _loader , customEvent);
					break;

				case 4: //작업완료
					//clearInterval(progressInterval);
					//progressInterval = null;

					if(_loader._urlRequest.status == 200){
						_loader.stateComplete();
						
						var urlData = _loader._addURLData[_loader._loadCnt];
						var urlDataId = urlData.id;
						var responseData = {};
						responseData[urlDataId] = _loader._responseData[urlDataId];
						EXEventListener.dispatch( _loader , new EXCustomEvent(EXLoader.EVENT_COMPLETE , responseData));
						_loader._loadCnt++;
						if(_loader._loadCnt < _loader._loadTotal){
							_loader.load();
						}else{
							_loader.stateCompleteAll();
						}
					}else{
						EXEventListener.dispatch( _loader , new EXCustomEvent(EXLoader.EVENT_ERROR ));
					}
					break;
			}
		};
	};

	/**
	load 할 데이터의 URL과 id를 지정합니다.
	<br/>메소드 명에서 알 수 있듯 하나의 Loader 객체로 부터 여러개의 데이터를 추가하여 load 할 수 있습니다.
	<br/>id 는 Loader 객체로 부터 로드가 완료된 후 데이터를 전달 받기 위해 필요합니다.
	@method addURL
	@param url {String} 데이터 URL
	@param id {String} 데이터 id (데이터 id는 Loader 객체로 부터 데이터를 전달 받을 때 사용합니다.)
	@return {void}
	*/
	EXLoader.prototype.addURL= function(url , id){
		var _loader = this;
		_loader._addURLData.push({ id:id , url:url });
		_loader._loadTotal = _loader._addURLData.length;
	};

	/**
	XMLHttpRequest 를 통해 전달할 파라미터를 지정합니다.
	@method setParams
	@param paramsObj {Object} XMLHttpRequest 를 통해 전달할 파라미터
	@return {void}
	*/
	EXLoader.prototype.setParams = function(paramsObj){
		var _loader = this;
		if(paramsObj == undefined){
			_loader.params = null;
		}else{
			var pms = [];
			var key = null;
			var value = "";
			var whiteSpaceReg = /%20/g;
			for(key in paramsObj){
				value = paramsObj[key];
				pms.push(encodeURIComponent(key).replace(whiteSpaceReg , "+") + "=" + encodeURIComponent(value).replace(whiteSpaceReg , "+"));
			}
			_loader.params = pms.join("&");
		}
	};
	
	/**
	load 를 시작합니다.
	@method load
	@return {void}
	*/
	EXLoader.prototype.load = function(){
		var _loader = this;
		var _urlRequest = _loader._urlRequest;
		var method = _loader.method;
		var url = _loader._addURLData[_loader._loadCnt].url;
		var headers = _loader.header;
		var key;
		var asynchronous = _loader.asynchronous;
		if(method == "GET"){
			if(_loader.params != null){
				url = url + "?" + _loader.params;
			}
		}
		_urlRequest.open(method , url , asynchronous);
		for(key in headers){
			if(key == "Content-type"){
				_urlRequest.setRequestHeader( key , "application/x-www-form-urlencoded" );
			}else{
				_urlRequest.setRequestHeader( key , headers[key] );
			}
		}
		if(_urlRequest.overrideMimeType != undefined && _loader.mimeType != null){
			_urlRequest.overrideMimeType(_loader.mimeType);
		}
		if(method == "POST"){
			_urlRequest.send( _loader.params );
		}else{
			_urlRequest.send();
		}
	};

	EXLoader.prototype.stateLoad = function(){};
	EXLoader.prototype.stateLoaded = function(){};
	EXLoader.prototype.stateProgress = function(){};
	EXLoader.prototype.stateComplete = function(){};
	EXLoader.prototype.stateCompleteAll = function(){
		EXEventListener.dispatch( this , new EXCustomEvent(EXLoader.EVENT_COMPLETE_ALL , this._responseData ));
	};
	
	
	/**
	Loader 객체에서 사용된 모든 자원을 해제합니다.
	@method destroy
	@return {void}
	*/
	EXLoader.prototype.destroy = function(){
		var _loader = this;
		try{
			var i , key , len;
			if(_this._addURLData){
				len = _loader._addURLData.length;
				for(i  = 0 ; i < len ; i++){
					for(key in _loader._addURLData[i]) delete _loader._addURLData[i][key];
				}
				_loader._addURLData = null;
			}
			if(_loader._responseData){
				for(key in _loader._responseData) delete _loader._responseData[key];
			}
			if(_loader._urlRequest){
				_loader._urlRequest.abort();
				_loader._urlRequest = null;
			}
			_loader._loadTotal = null;
			_loader._loadCnt = null;
			_loader = null;
		}catch(e){
			//EXEventListener.dispatch( _loader , new EXCustomEvent(EXLoader.EVENT_ERROR , { error:e } ));
		}
	};



	/**
	Loader 객체의 load 가 시작되는 시점에 dispatch 합니다.
	@event Loader.EVENT_START
	*/
	EXLoader.EVENT_START = "EXLoader.EVENT_START";

	/**
	Loader 객체의 addURL 을 통해 추가된 개별 데이터를 로드 완료되는 시점에 dispatch 합니다.
	@event Loader.EVENT_COMPLETE
	*/
	EXLoader.EVENT_COMPLETE = "EXLoader.EVENT_COMPLETE";

	/**
	비동기 통신방식으로 생성된 Loader 객체의 데이터 progress 시점에 dispatch 합니다.
	<br/>loadedByte 등은 지원하지 않습니다.
	@event Loader.EVENT_PROGRESS
	*/
	EXLoader.EVENT_PROGRESS = "EXLoader.EVENT_PROGRESS";

	/**
	Loader 객체의 addURL 을 통해 추가된 모든 데이터를 로드 완료되는 시점에 dispatch 합니다.
	@event Loader.EVENT_COMPLETE_ALL
	*/
	EXLoader.EVENT_COMPLETE_ALL = "EXLoader.EVENT_COMPLETE_ALL";

	/**
	Loader 객체에서 error 가 발생하는 시점에 dispatch 합니다.
	@event Loader.EVENT_ERROR
	*/
	EXLoader.EVENT_ERROR = "EXLoader.EVENT_ERROR";
	
	return EXLoader;
});