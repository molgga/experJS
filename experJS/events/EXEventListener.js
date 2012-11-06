define(function(require , exports){
	var EXEvent = require("./EXEvent");
	/**
	@class EXEventListener
	@static
	*/

	var _coreQueue = {};
	var _coreQueueCnt = 0;

	var _touchStartX = 0;
	var _touchStartY = 0;
	var _touchEndX = 0;
	var _touchEndY = 0;
	var _touchMoveDistanceX = 0;
	var _touchMoveDistanceY = 0;
	var _touchMoved = false;
	var _isTouchAble = false;

	var _supportEvents = ["click" , "mouseover" , "mouseout" , "mousedown" , "mouseup" , "mousemove" , "mousewheel"
							, "load" , "unload" , "submit" , "change" , "focus" , "blur"
							, "keydown" , "keypress" , "keyup" 
							, "resize" , "scroll" 
							, "input"
							, "touchstart" , "touchend" , "touchmove" , "touchcancel"
							, "DOMSubtreeModified" , "DOMNodeInserted" , "DOMNodeRemoved" ];

	/**
	EXEvent 가 지원하는 event type 배열입니다. 
	<br/>Browser, device 에서 지원하는 System event가 추가될 시 해당 속성을 변경(추가)할 필요가 있습니다.
	<br/>
	<br/>예를 들어 touchstart 라는 System event가 발생하는 새로운 device에서 EventVW 를 사용할 경우, 
	<br/>EventVW.nativeEvent 배열의 요소에 "touchstart"가 없다면 EventVW.nativeEvent 에 "touchstart" 요소를 추가하여야 합니다.
	<br/>
	<br/>해당 속성은 IE와 NB의 System event type 을 통합하기 위해(IE의 경우 "onclick" , NB의 경우 "click"과 같이 사용하는 문제해결) 단순히 event type 을 나열한 배열입니다.

	@attribute nativeEvents
	@type {Array}
	*/
	exports.nativeEvents = _supportEvents;

	var _isFF = ((/Firefox/i.test(navigator.userAgent)) ? true : false);
	var _isIE = ((navigator.appName == "Microsoft Internet Explorer") ? true : false);
	var _ieVersion = function(){
		var ieVer = -1;
		if(_isIE == false) return ieVer;
		var ua = navigator.userAgent;
		var re  = /MSIE ([0-9]{1,}[\.0-9]{0,})/;
		if (re.exec(ua) != null) ieVer = parseFloat( RegExp.$1 );
		return ieVer;
	}();

	/**
	이벤트 리스닝을 추가합니다.
	@method add
	@static
	@param target {Object} 이벤트 리스닝을 하는 타겟.
	@param type {String} 이벤트 명.
	@param handler {Function} 이벤트 콜백 함수.
	@param [capture=false] {boolean} true 로 설정시 이벤트를 capture 한다.
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
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX.ready" , "callback");

				var testButton1 = document.getElementById("testButton1");
				EXEventListener.add(testButton1 , "click" , eventHandler);

				function eventHandler(evt){
					EX.debug("eventHandler" , evt.type);
					EX.debug("has listener : " , EXEventListener.has(testButton1 , "click" , eventHandler));
					EXEventListener.remove(testButton1 , "click" , eventHandler);
					EX.debug("has listener : " , EXEventListener.has(testButton1 , "click" , eventHandler));
				}
			});
		})();
		</script>

		</head>
		<body>
			<button id="testButton1">testButton1</button>
		</body>
		</html>
	@return {boolean} 이벤트 등록이 될 경우 true , 등록이 되지 않을 경우 false 를 반환합니다.
	 */
	exports.add = function(target , type , handler , capture){
		if(target === undefined || typeof(type) != "string" || handler.constructor != Function) return;
		capture = (capture == true) ? true : false;

		var isHas = exports.has(target , type , handler , capture);
		if(isHas == true) return false;

		if(isNativeEvent(type) == true){
			if(target.addEventListener){
				if(_isFF == true && type == "mousewheel") type = "DOMMouseScroll";
				target.addEventListener(type , overlapEventHandler , capture);
			}else if(target.attachEvent){
				target.attachEvent("on"+type , overlapEventHandler);
			}
		}

		var queue = {};
		queue.target = target;
		queue.type = type;
		queue.handler = handler;
		queue.capture = capture;
		_coreQueue[_coreQueueCnt] = queue;
		_coreQueueCnt++;
		return true;
	};

	/**
	지정된 객체에 이벤트 동일한 리스너가 바인딩 되어 있는지 확인 합니다.
	@method has
	@static
	@param target {Object} 이벤트 리스닝을 하는 타겟.
	@param type {String} 이벤트 명.
	@param handler {Function} 이벤트 콜백 함수.
	@param [capture=false] {boolean} true 로 설정시 이벤트를 capture 한다.
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
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX.ready" , "callback");

				var testButton1 = document.getElementById("testButton1");
				EXEventListener.add(testButton1 , "click" , eventHandler);

				function eventHandler(evt){
					EX.debug("eventHandler" , evt.type);
					EX.debug("has listener : " , EXEventListener.has(testButton1 , "click" , eventHandler));
					EXEventListener.remove(testButton1 , "click" , eventHandler);
					EX.debug("has listener : " , EXEventListener.has(testButton1 , "click" , eventHandler));
				}
			});
		})();
		</script>

		</head>
		<body>
			<button id="testButton1">testButton1</button>
		</body>
		</html>
	@return {boolean}
	 */
	exports.has = function(target , type , handler , capture){
		capture = (capture == true) ? true : false;
		var isHas = false;
		var bindQueue = null;
		var key = null;
		for(key in _coreQueue){
			bindQueue = _coreQueue[key];
			if(bindQueue.target == target){
				if(bindQueue.type == type && bindQueue.handler == handler && bindQueue.capture == capture){
					isHas = true;
					break;
				}
			}
		}
		return isHas;
	}

	/**
	이벤트 리스닝을 삭제합니다.
	<br/>add 에 등록되어 있는 모든 조건과 동일해야 삭제가 가능합니다.
	@method remove
	@static
	@param target {Object} 이벤트 리스닝을 하는 타겟.
	@param type {String} 이벤트 명.
	@param handler {Function} 이벤트 콜백 함수.
	@param [capture=false] {boolean} true 로 설정시 이벤트를 capture 한다.
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
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX.ready" , "callback");

				var testButton1 = document.getElementById("testButton1");
				EXEventListener.add(testButton1 , "click" , eventHandler);

				function eventHandler(evt){
					EX.debug("eventHandler" , evt.type);
					EX.debug("has listener : " , EXEventListener.has(testButton1 , "click" , eventHandler));
					EXEventListener.remove(testButton1 , "click" , eventHandler);
					EX.debug("has listener : " , EXEventListener.has(testButton1 , "click" , eventHandler));
				}
			});
		})();
		</script>

		</head>
		<body>
			<button id="testButton1">testButton1</button>
		</body>
		</html>
	@return {void}
	 */
	exports.remove = function(target , type , handler , capture){
		capture = (capture == true) ? true : false;
		if(isNativeEvent(type) == true){
			if(target.removeEventListener){
				var bindQueue = null;
				for(cnt in _coreQueue){
					bindQueue = _coreQueue[cnt];
					if(bindQueue.target == target && bindQueue.type == type && bindQueue.handler == handler && bindQueue.capture == capture){
						target.removeEventListener(type , overlapEventHandler , capture);
					}
				}
			}else if(target.detachEvent){
				target.detachEvent("on"+type , handler);
			}
		}
		
		var bindQueue = null;
		var cnt;
		for(cnt in _coreQueue){
			bindQueue = _coreQueue[cnt];
			if(null == target){
				if(bindQueue.type == type || type == "mousewheel" && bindQueue.type == "DOMMouseScroll"){
					if(bindQueue.handler == handler){
						deleteQueue(_coreQueue[cnt]);
						delete _coreQueue[cnt];
					}
				}
				continue;
			}
			if(bindQueue.type == type || type == "mousewheel" && bindQueue.type == "DOMMouseScroll"){
				if(bindQueue.handler == handler  && bindQueue.target == target  ||  bindQueue.target == null){
					deleteQueue(_coreQueue[cnt]);
					delete _coreQueue[cnt];
				}
			}
		}
		function deleteQueue(queue){
			var dt = null;
			for(dt in queue) delete queue[dt];
		}
		return true;
	};

	/**
	커스텀 이벤트를 dispatch 합니다.
	<br/>See also : EXCustomEvent
	@method dispatch
	@static
	@param target {Object} 이벤트 리스닝을 하는 타겟.
	@param evt 커스텀 이벤트 객체(EXCustomEvent)
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
			EX.include("events/EXCustomEvent");
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX.ready" , "callback");

				var dispatchEventType = "testEvent";
				var dispatchButton = document.getElementById("dispatchButton");
				var wrapper = document.getElementById("wrapper");
				EXEventListener.add(dispatchButton , "click" , eventHandler);
				EXEventListener.add(dispatchButton , dispatchEventType , catchedEventHandler);
				EXEventListener.add(wrapper , dispatchEventType , catchedEventHandler);
				EXEventListener.add(document , dispatchEventType , catchedEventHandler);

				function eventHandler(evt){
					EX.debug("eventHandler" , evt.type);
					EXEventListener.dispatch( evt.currentTarget , new EXCustomEvent(dispatchEventType, { passParam: 12}, true));
					//bubbling
					//EXEventListener.dispatch( evt.currentTarget , new EXCustomEvent(dispatchEventType, { passParam: 12}, true));
					
				}
				function catchedEventHandler(evt){
					EX.debug("catchedEventHandler" , evt.type);
					EX.debug(evt.dispatchTarget);
				}
			});
		})();
		</script>

		</head>
		<body>
		<div id="wrapper">
			<button id="dispatchButton">dispatchButton</button>
		</div>
		</body>
		</html>
	@return {void}
	 */
	exports.dispatch = function(target , evt){
		if(_isIE == false){
			evt = evt; 
		}else{
			evt = convertEventPropertyForIE(evt || window.event , evt);
		}
		var bindQueue = null;
		var cnt;
		if(target == null){
			for(cnt in _coreQueue){
				bindQueue = _coreQueue[cnt];
				if(bindQueue.type == evt.type){
					bindQueue.handler(evt);
				}
			}
		}else{
			var bubbleParent = bubblingEvent(target);
			var bubbleParentLength = bubbleParent.length;
			var parent = null;
			for(var b = 0 ; b < bubbleParentLength ; b++){
				parent = bubbleParent[b];
				for(cnt in _coreQueue){
					if(evt.cancelBubble == true) break;
					bindQueue = _coreQueue[cnt];
					if(bindQueue.type == evt.type && parent == bindQueue.target){
						evt.dispatchTarget = parent;
						bindQueue.handler(evt);
					}
				}
				if(evt.isBubble == false) break;
			}
			evt.stopPropagation();
		}
	};

	/**
	touch event 시 touch 관련 속성을 분석하여 event 객체에 바인딩합니다. (기본 touchstart, touchmove , touchend 이벤트를 사용하는 것과는 상관없습니다.)
	<br/>
	<br/><strong>touchMoveX</strong> : touchstart 부터 touchmove(touchend) 까지 X축의 움직인 거리를 반환합니다.
	<br/><strong>touchMoveY</strong> : touchstart 부터 touchmove(touchend) 까지 X축의 움직인 거리를 반환합니다.
	<br/><strong>touchDirectionX</strong> : touchend 시 X축 swipe 방향을 반환합니다. (-1: 오른쪽에서 왼쪽으로 swipe , 0: x축 움직임 없음으로 판단 , 1:왼쪽에서 오른쪽으로 swipe )
	<br/><strong>touchDirectionY</strong> : touchend 시 Y축 swipe 방향을 반환합니다. (-1: 아래쪽에서 위쪽으로 swipe , 0: y축 움직임 없음으로 판단 , 1:위쪽에서 아래쪽으로 swipe )
	<br/>
	@method setTouchAble
	@static
	@param bool {boolean} touch event 의 touch
	@return {void}
	 */
	exports.setTouchAble = function(bool){
		_isTouchAble = bool;
	};
	
	/**
	touchMoveX , touchMoveY , touchDirectionX , touchDirectionY 속성을 사용 가능한지 확인합니다.
	<br/>See also : setTouchAble
	@method isTouchAble
	@static
	@return {boolean}
	 */
	exports.isTouchAble = function(){
		return _isTouchAble;
	};

	/**
	touchDirectionX(x축 swipe 방향 판단)의 기준 거리를 지정합니다.
	<br/>See also : setTouchAble
	@method setTouchDistanceX
	@static
	@param distance {Number} 거리값
	@return {void}
	 */
	exports.setTouchDistanceX = function(distance){
		_touchMoveDistanceX = distance;
	};

	/**
	touchDirectionY(y축 swipe 방향 판단)의 기준 거리를 지정합니다.
	<br/>See also : setTouchAble
	@method setTouchDistanceY
	@static
	@param distance {Number} 거리값
	@return {void}
	 */
	exports.setTouchDistanceY = function(distance){
		_touchMoveDistanceY= distance;
	};

	function overlapEventHandler(evt){
		evt = new EXEvent(evt);

		var bindQueue = null;
		var cnt;
		var isCapture = false;
		if(evt.type == "mousewheel" || evt.type == "DOMMouseScroll"){
			var nativeDelta = evt.wheelDelta || evt.detail;
			if(_isFF == true) nativeDelta = nativeDelta*-1;
			var delta = (nativeDelta > 0) ? 3 : -3;
			evt.delta = delta;
		}

		if(evt.type == "mousedown"){
			evt.currentTarget.mousePositionX = evt.clientX;
			evt.currentTarget.mousePositionY = evt.clientY;
		}

		if(_isTouchAble == true){
			if(evt.type == "touchstart"){
				_touchStartX = evt.touches[0].clientX;
				_touchStartY = evt.touches[0].clientY;
				evt.touchMoveX = 0;
				evt.touchMoveY = 0;
				_touchMoved = false;
			}
			if(evt.type == "touchmove"){
				_touchEndX = evt.touches[0].clientX;
				_touchEndY = evt.touches[0].clientY;
				var moveX = (_touchEndX - _touchStartX);
				var moveY = (_touchEndY - _touchStartY);
				evt.touchMoveX = moveX;
				evt.touchMoveY = moveY;
				_touchMoved = true;
			}
			if(evt.type == "touchend"){
				if(_touchMoved == true){
					var touchX = 0;
					var touchY = 0;
					var mathX = (_touchEndX - _touchStartX);
					var mathY = (_touchEndY - _touchStartY);
					if(Math.abs(mathX) > _touchMoveDistanceX){
						touchX = (mathX > 0) ? 1 : -1;
					}
					if(Math.abs(mathY) > _touchMoveDistanceY){
						touchY = (mathY > 0) ? 1 : -1;
					}
					evt.touchDirectionX = touchX;
					evt.touchDirectionY = touchY;
					evt.touchMoveX = mathX;
					evt.touchMoveY = mathY;
					_touchMoved = false;
				}else{
					evt.touchDirectionX = 0;
					evt.touchDirectionY = 0;
				}
			}
		}

		if(_isIE == false){
			for(cnt in _coreQueue){
				bindQueue = _coreQueue[cnt];
				if(bindQueue.type == evt.type && evt.currentTarget == bindQueue.target){
					if(_isFF == true && evt.type == "DOMMouseScroll") evt.type = "mousewheel";
					bindQueue.handler(evt);
				}
			}
		}else{
			var bubbleParent = bubblingEvent(evt.currentTarget);
			var bubbleParentLength = bubbleParent.length;
			var parent = null;
			for(var b = 0 ; b < bubbleParentLength ; b++){
				parent = bubbleParent[b];
				for(cnt in _coreQueue){
					if(evt.cancelBubble == true) break;
					bindQueue = _coreQueue[cnt];
					if(bindQueue.type == evt.type && parent == bindQueue.target){
						evt.currentTarget = parent;
						bindQueue.handler(evt);
					}
				}
			}
			evt.stopPropagation();
		}

		if(evt.returnValue == false){
			return false;
		}
	};

	function isNativeEvent(type){
		var isNative = false;
		var i = 0;
		var len = _supportEvents.length;
		for( i = 0 ; i < len ; i++){
			if(type == _supportEvents[i]){
				isNative = true;
				break;
			}
		}
		return isNative;
	}

	function convertEventPropertyForIE(evt , customEvent){
		var cancelable = false;
		if(customEvent != undefined) cancelable = customEvent.isCancelable;
		if(cancelable == true){
			evt.stopPropagation = function(){ this.cancelBubble = true; };
		}else{
			evt.stopPropagation = function(){  };
		}
		evt.preventDefault = function(){ this.returnValue = false; }; // this.returnValue = false; };
		evt.currentTarget = (evt.srcElement != null || evt.srcElement != undefined) ? evt.srcElement : window;
		return evt;
	};

	function bubblingEvent(currentTarget){
		var bubbleTargets = [];
		bubbleTargets.push(currentTarget);
		if(currentTarget.parentNode) getBubble(currentTarget);
		function getBubble(childTarget){
			var parent = null;
			parent = childTarget.parentNode;
			if(parent != null || parent != undefined){
				bubbleTargets.push(parent);
				if(currentTarget.parentNode) getBubble(parent);
			}
		}
		return bubbleTargets;
	};

});