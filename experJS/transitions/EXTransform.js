define(function(require , exports){
	/**
	@class EXTransform
	@static
	*/
	var EXTransform = exports;

	var DEBUG_FILTER_EXECUTE = "EXECUTE";
	var DEBUG_FILTER_EVENT = "EVENT  ";
	var DEBUG_FILTER_KILL = "KILL   ";
	var DEBUG_FILTER_LOG = "LOG    ";
	var DEBUG_FILTER_ERROR = "ERROR  ";

	var _isFF = /Firefox/.test(navigator.userAgent);
	var _isOpera = /Opera/.test(navigator.userAgent);

	var _IS_IE = (navigator.appName == "Microsoft Internet Explorer") ? true : false;
	var _IE_VERSION = (function(){
		var ieVer = -1;
		var ua = navigator.userAgent;
		var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null) ieVer = parseFloat( RegExp.$1 );
		return ieVer;
	})();
	var _isIE9Over = (function(){
		if(_IS_IE == false) return null;
		if(_IE_VERSION >= 9) return true;
		return false;
	})();

	var _isIE9Under = (function(){
		if(_IS_IE == false) return null;
		if(_IE_VERSION < 9) return true;
		return false;
	})();

	var _isWebkit = (function(){
		var webkit = false;
		if(/WebKit/.test(navigator.userAgent) || /Chrome/.test(navigator.userAgent) || /Safari/.test(navigator.userAgent)) webkit = true;
		return webkit;
	})();

	var _debugMode = false;
	var _debugConsole = function(filter , msg){
		if(_debugMode == false) return;
		console.log(filter + " : " + msg);
	};
	

	var _coreStack = {};
	var _coreStackKey = 0;
	var _coreEventCompleteStack = "coreStackCompleteEvent";

	var _eventCore = {};
	var _eventCoreProperty = { onComplete:1 , onCompleteParams:1 };
	
	var _transformProperty = {};
	if(_isWebkit){
		_transformProperty.property = "-webkit-transition";
		_transformProperty.propertySet = "-webkit-transform";
		_transformProperty.duration = "-webkit-transition-duration";
		_transformProperty.timing = "-webkit-transition-timing-function";
		_transformProperty.style = "-webkit-transform-style";
		_transformProperty.origin = "-webkit-transform-origin";
		_eventCore.complete = "webkitTransitionEnd";
	}else if(_isFF){
		_transformProperty.property = "MozTransition";
		_transformProperty.propertySet = "MozTransform";
		_transformProperty.duration = "MozTransitionDuration";
		_transformProperty.timing = "MozTransitionTimingFunction";
		_transformProperty.style = "MozTransformStyle";
		_transformProperty.origin = "MozTransformOrigin";
		_eventCore.complete = "transitionend";
	}else if(_isOpera){
		_transformProperty.property = "-o-transition";
		_transformProperty.propertySet = "-o-transform";
		_transformProperty.duration = "-o-transition-duration";
		_transformProperty.timing = "-o-transition-timing-function";
		_transformProperty.style = "-o-transform-style";
		_transformProperty.origin = "-o-transform-style";
		_eventCore.complete = "oTransitionEnd";
	}else if(_isIE9Over){
		_transformProperty.property = "-ms-transition";
		_transformProperty.propertySet = "-ms-transform";
		_transformProperty.duration = "-ms-transition-duration";
		_transformProperty.timing = "-ms-transition-timing-function";
		_transformProperty.style = "-ms-transform-style";
		_transformProperty.origin = "-ms-transform-style";
		_eventCore.complete = "msTransitionEnd";
	}
	
	/*
	var temp_transformPropertySet = _transformProperty.propertySet;
	EXTransform.setTransformProperty = function(val){
		_debugConsole( DEBUG_FILTER_EXECUTE , "setTransformProperty - { " + val + "}");
		if(val == undefined || val == null){
			_transformProperty.propertySet = temp_transformPropertySet;
		}else{
			_transformProperty.propertySet = val;
		}
	};
	*/

	/*
	지정된 tweenObject 에 속성 부여를 합니다.
	@method setTransform
	@static
	@param tweenObject {HTMLElement} 속성을 부여할 객체.
	@param propertyObject {Object} 속성 집합.
	@return {EXTransform}
	*/

	/**
	지정된 tweenObject 에 중심점을 변경합니다.
	@method origin
	@static
	@param tweenObject {HTMLElement} 속성을 부여할 객체.
	@param xAxis {String || Number} X축 좌표.
	@param yAxis {String || Number} Y축 좌표.
	@param zAxis {String || Number} Z축 좌표.
	@return {void}
	*/
	EXTransform.origin = function(tweenObject , xAxis , yAxis , zAxis){
		_debugConsole( DEBUG_FILTER_EXECUTE , "origin");
		xAxis = xAxis || "50%";
		yAxis = yAxis || "50%";
		zAxis = zAxis || "0px";
		tweenObject.style[_transformProperty.origin] = xAxis+" "+yAxis+" "+zAxis;
	}
	EXTransform.perspective = function(tweenObject , perspective){
		_debugConsole( DEBUG_FILTER_EXECUTE , "perspactive");
		tweenObject.style[_transformProperty.propertySet] = perspective;
	}

	/**
	<strong>(beta)</strong> CSS3 속성중 transition(transform) 과 관련된 속성을 사용하기 위한 tweener 입니다.
	<br/>
	@method to
	@static
	@param tweenObject {HTMLElement} tween target object.
	@param speed {Nubmber} tween speed.
	@param tweenProperty {Object} Style property of HTMLElement and number property of Object.
		<div>
			<h6 style="color:#66bbcc;">[[ Support property ]]</h6>
			<strong>css3 property of HTMLElement</strong>
			<ul>
				<li>translate3d , translate , translateX , translateY</li>
				<li>rotate , rotateX , rotateY</li>
				<li>skew , skewX , skewY</li>
				<li>scale , scaleX , scaleY</li>
				<li>matrix</li>
			</ul>
			<strong>Supporting special property</strong>
			<ul>
				<li>delay : {Number} tween 을 시작전 대기 시간을 지정합니다.</li>
				<li>ease : {Function} tween 의 transform-timing-function 방식을 지정합니다. EXTransform.timing.* 을 참고하세요.</li>
				<li>onComplete : {Function} tween 이 완료되는 시점에 호출될 콜백 함수를 지정합니다.</li>
				<li>onCompleteParams : {Array} onComplete 에 지정된 콜백 함수에 전달할 파라미터를 배열 형태로 지정합니다.</li>
			</ul>
		</div>
	
	@return {void}
	*/
	EXTransform.to = function(tweenObject , duration , transformProperty){
		if(_isIE9Under == true) return;
		tweenObject.style[_transformProperty.style] = "preserve-3d"
		_debugConsole( DEBUG_FILTER_EXECUTE , "queue key index("+_coreStackKey+") initialize");

		var setProp = _transformProperty.propertySet;
		if(_isFF){
			tweenObject.style[_transformProperty.property] = "-moz-transform" + " " + duration +"s";
		}else{
			tweenObject.style[_transformProperty.property] = setProp;
			tweenObject.style[_transformProperty.duration] = duration +"s";
		}
		if(transformProperty.timing != undefined){
			tweenObject.style[_transformProperty.timing] = transformProperty.timing;
			delete transformProperty.timing;
		}

		var delayNum = 0;
		if(transformProperty.delay != undefined){
			delayNum = transformProperty.delay*1000;
			if(delayNum < 0) delayNum = 0;
			delete transformProperty.delay;
		}
		
		var csKey = _coreStackKey;
		tweenObject["coreStackCompleteEvent"+ csKey] = null;
		_coreStack[_coreStackKey] = {
			tweenObject : tweenObject
			, transformProperty : transformProperty
			, eventProperty : (function(){
				var eventProp = {};
				var prop = null;
				var isNeedEvent = false;
				for(prop in transformProperty){
					if(_eventCoreProperty[prop] != undefined){
						isNeedEvent = true;
						eventProp[prop] = transformProperty[prop];
						delete transformProperty[prop];
					}
				}
				return (isNeedEvent == true) ? eventProp : null;
			})()
			, initTimer : setTimeout(function(){
				initTransform(tweenObject , duration , transformProperty , csKey);
			} , delayNum)
		}
		_coreStackKey++;
	};
	//end EXTransform.transform

	function initTransform(tweenObject , duration , transformProperty , csKey){	
		if(_isIE9Under == true) return;
		_debugConsole( DEBUG_FILTER_EXECUTE , "queue key index("+csKey+") start");

		clearTimeout(_coreStack[csKey].initTimer);
		delete _coreStack[csKey].initTimer;

		var p = "";
		var caseValue = "";
		var transformValue = null;
		for(p in transformProperty){
			transformValue = transformProperty[p];
			caseValue = parsePropertyCase(p , transformValue);
			if(caseValue == null){
				tweenObject.style[p] = transformValue;
				continue;
			}
			addPropertyCase(tweenObject , caseValue , p);
		}
		tweenObject[ _coreEventCompleteStack + csKey] = function(evt){
			completeTransform(evt , csKey);
		}
		tweenObject.addEventListener(_eventCore.complete , tweenObject[ _coreEventCompleteStack + csKey] , false);
	}
	//end initTransform

	function completeTransform(evt , csKey){
		if(_isIE9Under == true) return;
		var tweenObject = evt.currentTarget;
		var eventProperty = _coreStack[csKey].eventProperty;
		tweenObject.removeEventListener(_eventCore.complete , tweenObject[_coreEventCompleteStack + csKey] , false);
		if(eventProperty != null && eventProperty.onComplete != undefined){
			_eventDispatcher(eventProperty.onComplete , eventProperty.onCompleteParams);
			delete eventProperty.onComplete;
			delete eventProperty.onCompleteParams;
		}
		deleteCoreStackToKey(csKey);
	}
	//end completeTransform

	function deleteCoreStackToKey(csKey){
		try{
			var stack = _coreStack[csKey];
			var transformProperty = stack.transformProperty;
			var eventProperty = stack.eventProperty;
			var prop = null;
			
			if(stack.initTimer != undefined || stack.initTimer != null) clearTimeout(stack.initTimer);
			for(prop in transformProperty){
				//_debugConsole(DEBUG_FILTER_KILL , "queue key index("+ csKey +") Kill tween transform property data in garbage : " + propertyKey);
				_debugConsole(DEBUG_FILTER_KILL , "queue key index("+ csKey +") Kill tween transform property data : " + prop);
				delete transformProperty[prop];
			}
			delete stack.transformProperty;
			transformProperty = null;
			for(prop in eventProperty){
				_debugConsole(DEBUG_FILTER_KILL , "queue key index("+ csKey +") Kill tween transform event data : " + prop);
				delete eventProperty[prop];
			}
			delete stack.eventProperty;
			eventProperty = null;
			for(prop in stack){
				_debugConsole(DEBUG_FILTER_KILL , "queue key index("+ csKey +") Kill tween transform data : " + prop);
				delete stack[prop];
			}
		}catch(e){
			_debugConsole(DEBUG_FILTER_ERROR , "deleteCoreStackToKey - " + e);
		}finally{
			stack = null;
		}
	}
	//end deleteCoreStackToKey

	/**
	EXTransform.transform 에 등록된 모든 tween 을 중지, 제거 합니다.
	@method killTransformAll
	@static
	@return {void}
	*/
	EXTransform.killTransformAll = function(){
		_debugConsole( DEBUG_FILTER_KILL , "killTransformAll");
		var key;
		for(key in _coreStack) deleteCoreStackToKey(key);
	}
	//end EXTransform.killTransformAll
	
	/**
	EXTransform.transform 에 등록된 모든 tween 을 중지, 제거 합니다.
	@method killTransformsOf
	@static
	@param tweenObject {HTMLElement} tween 을 중지, 제거할 객체.
	@return {void}
	*/
	EXTransform.killTransformsOf = function(tweenObject){
		_debugConsole( DEBUG_FILTER_KILL , "killTransformsOf");
		var key;
		for(key in _coreStack){
			if(tweenObject == _coreStack[key].tweenObject) deleteCoreStackToKey(key);
		}
	}
	//end EXTransform.killTransformsOf

	function addPropertyCase(tweenObject , val , regProp){
		var transProp = _transformProperty.propertySet;
		var prevTransform = tweenObject.style[transProp] + " ";
		var regToDelete = new RegExp("\\b"+ regProp +"\\(?\\S*\\)?");
		if(regToDelete.test(prevTransform)){
			var startIndex = prevTransform.indexOf(regProp);
			var lastIndex = prevTransform.indexOf(")" , startIndex+1);
			var extraction = prevTransform.substring(startIndex , lastIndex+1);
			prevTransform = prevTransform.replace(extraction , "");
		}
		if(prevTransform == "undefined ") prevTransform = "";
		//console.log(prevTransform + val);
		tweenObject.style[transProp] = prevTransform + val;
	};
	//end addPropertyCase

	function parsePropertyCase(key , val){
		if(val == undefined) return;
		var extend = "";
		var valueProp = "";
		switch(key){
			case "translate3d" : case "perspective" : case "translate" : case "translateX" : case "translateY" : case "translateZ" : 
				extend = "px";
				break;
			case "rotate" : case "rotateX" : case "rotateY" :  case "skew" : case "skewX" : case "skewY" : 
				extend = "deg";
				break;
			case "scale" : case "scaleX" : case "scaleY" :
				extend = "";
				break;
		}
		valueProp = key + "(";
		if(val.length){
			var len = val.length;
			var value = null;
			for(var i = 0 ; i < len ; i++){
				value = val[i];
				if(typeof(value) != "string"){
					value = value + extend;
				}
				if(i != 0){
					valueProp = valueProp + "," + value;
				}else{
					valueProp = valueProp + value;
				}
			}
			valueProp = valueProp + ")";
		}else{
			valueProp = key + "(" + val + extend + ")";
		}
		return valueProp;
	}
	//end parsePropertyCase
	

	var _eventDispatcher = function( func , argsArray){
		try{
			if(argsArray){
				var requireParamLength = func.length;
				var registerParamLength = argsArray.length;
				if(requireParamLength == registerParamLength){
					func.apply( null , argsArray);
				}else{
					if(requireParamLength > registerParamLength){
						_debugConsole(DEBUG_FILTER_ERROR , "_eventDispatcher 요구되는 paramiter의 개수 보다 등록된 paramiter의 개수가 적습니다.");
					}else{
						_debugConsole(DEBUG_FILTER_ERROR , "_eventDispatcher 요구되는 paramiter의 개수 보다 등록된 paramiter의 개수가 많습니다.");
					}
				}
			}else{
				func();
			}
		}catch(e){
			_debugConsole(DEBUG_FILTER_ERROR , "_eventDispatcher " + e);
		}finally{
			var funcName = (func.name == "") ? "Anonymous function" : func.name;
			_debugConsole( DEBUG_FILTER_EVENT , "event dispatched { functionName : " + ((func.name == "") ? "Anonymous" : func.name) +" }");
		}
	};
	//end method : _eventDispatcher

	return EXTransform;
});

