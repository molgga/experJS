define(function(require , exports){
	var _isIE = ((navigator.appName == "Microsoft Internet Explorer") ? true : false);

	/**
	native 이벤트 객체를 EXEvent 에 맞게 가공합니다.
	@class EXEvent
	@constructor
	@param evt {Event || EventObject} 이벤트 객체.
	*/
	var EXEvent = function(evt){
		var p;
		for(p in evt){ this[p] = evt[p]; }

		/**
		mouse wheel 의 delta 값을 반환합니다.
		@property delta
		@type {Integer}
		@example
			<!DOCTYPE html>
			<html>
			<head>
			<style type="text/css">
				html , body { padding:0; margin:0; }
				#testBox1 { position:absolute; width:200px; height:200px; border:0px solid #000000; background-color:#ffff00; }
			</style>
			<script type="text/javascript" src="../../vw/events/EventVW_0.9.0.js"></script>
			</head>
			<body>
				<div id="testBox1">Mouse Wheel</div>
			</body>
			<script type="text/javascript">
			(function(){
				var testBox1 = document.getElementById("testBox1");
				
				EventVW.addListener( testBox1 , "mousewheel" , wheelEventHandler);
				function wheelEventHandler(evt){
					alert(evt.delta);
				}
			})();
			</script>
			</html>
		*/
		this.delta = 0;
		
		/**
		touchstart 부터 touchmove(touchend) 까지 X축의 움직인 거리를 반환합니다. 
		<br/>(See also : EventVW.setTouchAble)
		@property touchMoveX
		@type {Integer}
		*/
		this.touchMoveX = 0;
		
		/**
		touchstart 부터 touchmove(touchend) 까지 Y축의 움직인 거리를 반환합니다. 
		<br/>(See also : EventVW.setTouchAble)
		@property touchMoveY
		@type {Integer}
		*/
		this.touchMoveY = 0;
		
		/**
		touchend 시 X축 swipe 방향을 반환합니다. (-1: 오른쪽에서 왼쪽으로 swipe , 0: x축 움직임 없음으로 판단 , 1:왼쪽에서 오른쪽으로 swipe ) 
		<br/>(See also : EventVW.setTouchAble , EventVW.setTouchDistanceX)
		@property touchDirectionX
		@type {Integer}
		*/
		this.touchDirectionX = 0;
		
		/**
		touchend 시 Y축 swipe 방향을 반환합니다. (-1: 아래쪽에서 위쪽으로 swipe , 0: y축 움직임 없음으로 판단 , 1:위쪽에서 아래쪽으로 swipe ) 
		<br/>(See also : EventVW.setTouchAble , EventVW.setTouchDistanceY)
		@property touchDirectionY
		@type {Integer}
		*/
		this.touchDirectionY = 0;
		if(_isIE == true && !evt.currentTarget){
			this.currentTarget = evt.srcElement || window;
		}
		
		/**
		이벤트 전파를 정지합니다.
		@method stopPropagation
		@type {Function}
		@example
			<!DOCTYPE html>
			<html>
			<head>
			<style type="text/css">
				html , body { padding:0; margin:0; }
				.box { position:absolute; top:80px; left:50px; width:400px; height:200px; color:#ffffff; }
				#box1 { background-color:#ff0000; }
				#box2 { background-color:#83b535; }
				#box3 { background-color:#0000ff; }
				#box4 { background-color:#ab6ed2; }
			</style>
			<script type="text/javascript" src="../../vw/events/EventVW_0.9.0.js"></script>
			</head>
			<body>
				<button id="btnDispatch" style="padding:5px; font-weight:800;">dispatchEvent!!</button>
				
				<button onclick="example.toggleStopPropagation()" style="padding:5px; font-weight:800;">toggleStopPropagation</button>

				<div id="box1" class="box">grandfather box1
					<div id="box2" class="box">father box2
						<div id="box3" class="box">me box3
							<div id="box4" class="box">sun box4</div>
						</div>
					</div>
				</div>
				
			<script type="text/javascript">
			var example = {};
			(function(){
				var TEST_CUSTOM_EVENT = "TEST_CUSTOM_EVENT";

				var isStopPropagation = false;

				var boxArr = [];
				var box = null;
				for(var i = 0 ; i < 4 ; i++){
					box = document.getElementById("box"+(i+1));
					EventVW.addListener(box , TEST_CUSTOM_EVENT , eventHandler);
					boxArr.push(box);
				}
				
				var btnDispatch = document.getElementById("btnDispatch");
				EventVW.addListener( btnDispatch , "click" , function(evt){
					EventVW.dispatchEvent(boxArr[3] , new EventVW.CustomEvent(TEST_CUSTOM_EVENT ));
				});

				function eventHandler(evt){
					switch(evt.type){
						case TEST_CUSTOM_EVENT :
							if(evt.dispatchTarget) alert(evt.dispatchTarget.id);
							if(isStopPropagation == true) evt.stopPropagation(); // 이벤트 전파 정지
							break;
					}
				}

				example.toggleStopPropagation = function(){
					isStopPropagation = !isStopPropagation;
					alert("stopPropagation : " + isStopPropagation);
				}
				example.toggleStopPropagation();
			})();
			</script>
			</body>
			</html>
		@return {void}
		*/
		//if( !this.stopPropagation ) this.stopPropagation = function(){ this.cancelBubble = true; };
		this.stopPropagation = function(){ 
			if(evt.stopPropagation) evt.stopPropagation();
			this.cancelBubble = true; 
		};

		/**
		기본 event 동작을 막습니다.
		@method preventDefault
		@type {Function}
		@example
			<!DOCTYPE html>
			<html>
			<head>
			<style type="text/css">
				html , body { padding:0; margin:0; }
				.box { position:absolute; top:50px; left:50px; width:400px; height:200px; color:#ffffff; }
				#box1 { background-color:#ff0000; }
				#box2 { background-color:#83b535; }
				#box3 { background-color:#0000ff; }
				#box4 { background-color:#ab6ed2; }
			</style>
			<script type="text/javascript" src="../../vw/events/EventVW_0.9.0.js"></script>
			</head>
			<body>
				<br/><br/>
				<a id="btn" href="http://js.v-w.kr" target="_blank"><strong>LINK CLICK!!</strong></a>
				<br/><br/>
				<button onclick="example.togglePreventDefault()">togglePreventDefault</button>
				
			<script type="text/javascript">
			var example = {};
			(function(){
				var btn = document.getElementById("btn");
				var isPreventDefault = false;

				EventVW.addListener(btn , "click" , function(evt){
					if(isPreventDefault == true) evt.preventDefault(); // 기본 event 속성을 막습니다.
				});
				
				example.togglePreventDefault = function(evt){
					isPreventDefault = !isPreventDefault;
					alert("event preventDefault : " + isPreventDefault);
				}
				example.togglePreventDefault();
			})();
			</script>
			</body>
			</html>
		@return {void}
		*/
		this.preventDefault = function(){ 
			if(evt.preventDefault) evt.preventDefault();
			this.returnValue = false; 
		};


		/**
		loader 와 관련된 로드된 byte 값.
		@property bytesLoaded
		@default null
		@type {Integer}
		*/
		this.bytesLoaded = 0;

		/**
		loader 와 관련된 로드될 byte 의 총 값.
		@property bytesTotal
		@default null
		@type {Integer}
		*/
		this.bytesTotal = 0;

		/**
		loader 와 관련하여 총 로드될 byte 값과 로드된 byte 값의 percentage 값.[0~1]
		@property bytesPercent
		@default null
		@type {Number}
		*/
		this.bytesPercent = 0;
	}

	return EXEvent;
});