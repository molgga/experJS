define(function(require , exports){
	var EXEvent = require("./EXEvent");
	/**
	커스텀 이벤트(CustomEvent) 객체.
	<br/>EXEvent 를 상속 받습니다.
	@class EXCustomEvent
	@constructor
	@param type {String} 이벤트 명. 
	@param data {Object} 이벤트 객체를 통해 전달할 Object.
	@param [bubble=false] {boolean} bubbling 여부.
	@param [cancelable=true] {boolean} stopPropagation 가능 여부.
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


			var dispatchEventType = "testEvent";
			var dispatchEventObject = {};
			EX.ready(function(){
				EXEventListener.add( dispatchEventObject , dispatchEventType , function(evt){
					EX.debug("dispatchEventObject" , evt.type);
				});
			});

			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				var dispatchButton = document.getElementById("dispatchButton");
				EXEventListener.add(dispatchButton , "click" , eventHandler);
				function eventHandler(evt){
					EX.debug("eventHandler" , evt.type);
					EXEventListener.dispatch( dispatchEventObject , new EXCustomEvent(dispatchEventType, { passParam: 12}, true));
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
	*/
	var EXCustomEvent = function(type , data , bubble , cancelable){
		bubble = (bubble == true) ? true : false;
		cancelable = (cancelable == false) ? false : true;
		data = (data) ? data : null;

		var eventObj = null;
		if(document.createEvent){ // NB
			eventObj = document.createEvent("Event");
			eventObj.initEvent(type, bubble , cancelable);
		}else{ // IE
			eventObj = document.createEventObject();
			eventObj.type = type;
		}
		var exEvent = new EXEvent(eventObj);
		var p;
		for(p in exEvent){ this[p] = exEvent[p]; }

		/**
		event 객체의 bubbling 을 제어하는 속성입니다.
		@property isBubble
		@type {boolean}
		*/
		this.isBubble = bubble;
		
		/**
		event 객체의 stopPropagation (이벤트 전파 중지) 를 제어하는 속성입니다.
		@property isCancelable
		@type {boolean}
		*/
		this.isCancelable = cancelable;

		/**
		CustomEvent 를 dispatchEvent 를 통해 전달시 데이터를 전달할 수 있는 Object 타입의 데이터 묶음 입니다.
		@property dataObject
		@type {Object}
		*/
		this.dataObject = data;

		if(cancelable == true){
			this.stopPropagation = function(){  this.cancelBubble = true; };
		}else{
			this.stopPropagation = function(){};
		}
		try{
			this.currentTarget = null;
		}catch(e){}finally{}
	};
	return EXCustomEvent;
});