define(function(require , exports){
	/**
	HTMLElement, Numeric properties 의 tweening 을 위한 Tweener 입니다.
	<br/>사용법은 Flash ActionScript 로 유명한 <a href="http://www.greensock.com" target="_blank">greensock</a>의 TweenMax 와 거의 흡사합니다.
	<br/>(단, 비슷한건 Flash ActionScript 에서 사용하던 방식과 method name 정도 입니다.)
	<br/>
	<br/>모션 스크립트를 위해선 <strong>to</strong> 메소드를 먼저 보시는 것을 권장합니다.
	<br/>
	@class EXTween
	@static
	 */
	var EXTween = exports;
	var DEBUG_FILTER_EXECUTE = "EXECUTE";
	var DEBUG_FILTER_EVENT = "EVENT  ";
	var DEBUG_FILTER_KILL = "KILL   ";
	var DEBUG_FILTER_LOG = "LOG    ";
	var DEBUG_FILTER_ERROR = "ERROR  ";
	
	var _coreQueue = {};
	var _coreQueueCnt = 0;
	
	var _IS_IE = (navigator.appName == "Microsoft Internet Explorer") ? true : false;
	var _IS_FF = (/Firefox/i.test(navigator.userAgent)) ? true : false;
	var _IE_VERSION = (function(){
		var ieVer = -1;
		var ua = navigator.userAgent;
		var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null) ieVer = parseFloat( RegExp.$1 );
		return ieVer;
	})();
	
	var _globalIntervalRate = 15;//12;
	var _globalIntervalSpeed = 1.5;//1;
	var _debugMode = false;
	var _defaultEase = function (x, t, b, c, d) { return -c *(t/=d)*(t-2) + b; };

	var _debugConsole = function(filter , msg){
		if(_debugMode == false) return;
		//console.log(filter + " : " + msg);
		EX.debug(filter ,":" ,msg);
	};
	
	var _getPropertyTypeToPixel = ["width" , "height" , "left" , "top" , "right" , "bottom" 
				, "marginTop" , "marginBottom" , "marginLeft" , "marginRight" , "paddingTop" , "paddingBottom" , "paddingLeft" , "paddingRight"
				, "borderTopWidth" ,"borderBottomWidth" ,"borderLeftWidth" , "borderRightWidth" 
				, "fontWeight" , "fontSize"
				, "backgroundPositionX" , "backgroundPositionY"];
	
	var _getPropertyTypeToColor = ["color" , "backgroundColor" , "borderTopColor" , "borderBottomColor" , "borderLeftColor" , "borderRightColor"];

	var _isOpacityBlockIE8Under = false;
	EXTween.setOpacityBlockIE8Under = function(val){
		_isOpacityBlockIE8Under = val;
	};

	/**
	EXTween 의 일련의 동작을 console.log 를 통해 출력합니다.
	@method setDebugMode
	@static
	@param bool {boolean} debug mode setting
	@default false
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<style type="text/css">
			#testBox1 { width:100px; height:100px; background-color:#ff0000; }
		</style>
		<script type="text/javascript" src="../../vw/transitions/EXTween_1.0.0.js"></script>
		</head>
		<body>
			<div id="testBox1"></div>
		</body>
		<script type="text/javascript">
		(function(){
			var testBox1 = document.getElementById("testBox1");
			EXTween.setDebugMode(true); // console.log 로 EXTween 동작을 출력합니다.
			EXTween.to(testBox1 , 1 , { width:400 });
			EXTween.to(testBox1 , 1 , { delay:1 , height:300 , backgroundColor:0xffff00 });
			EXTween.to(testBox1 , 1 , { delay:2 , width:100 , height:100 , onUpdate:tweenUpdate1 });
			EXTween.to(testBox1 , 1 , { delay:2.5 , width:40 , height:20 , backgroundColor:0xcccccc ,  onComplete:tweenComplete1 });

			function tweenUpdate1(){
				testBox1.innerHTML = Math.ceil(testBox1.offsetWidth);
			}
			function tweenComplete1(){
				console.log("tweenComplete1");
			}
		})();
		</script>
		</html>
	@return {void}
	 */
	EXTween.setDebugMode = function(bool){
		if(console == undefined || console == null && console.log == undefined) bool = false;
		_debugMode = bool;
	};
	
	/**
	EXTween 의 전체 tween rendering speed 를 지정합니다.
	<br/>기본값은 12 이며, 지정되는 값이 커질수록 rendering 속도가 늦어지게 됩니다.
	@method setGlobalIntervalRender
	@static
	@param val {Integer} set tweening render speed.
	@default 12
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<style type="text/css">
			#testBox1 { width:100px; height:100px; background-color:#ff0000; }
		</style>
		<script type="text/javascript" src="../../vw/transitions/EXTween_1.0.0.js"></script>
		</head>
		<body>
			<div id="testBox1"></div>
		</body>
		<script type="text/javascript">
		(function(){
			var testBox1 = document.getElementById("testBox1");
			EXTween.setGlobalIntervalRender(36); // default 12 - if you increase value then slowly render tween.
			EXTween.to(testBox1 , 1 , { width:400 });
		})();
		</script>
		</html>
	@return {void}
	 */
	EXTween.setGlobalIntervalRender = function(val){
		if(val < 1) val = 1;
		_globalIntervalRate = val;
	};
	
	/**
	EXTween 의 전체 tween interval speed 를 지정합니다.
	<br/>기본값은 1이며, 지정되는 값이 커질수록 interval 횟수가 늘어납니다.(계산을 더 상세하게 합니다.)
	@method setGlobalInterval
	@static
	@param val {Number} set tweening interval speed.
	@default 1
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<script type="text/javascript" src="../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.includeBegin("../../experJS");
			EX.include("transitions/EXTween");
			EX.includeEnd();
			EX.ready(function(){
				var testBox1 = document.getElementById("testBox1");
				EXTween.setGlobalInterval(0.1); // default 1 - if you increase value then slowly render tween.
				EXTween.to(testBox1 , 1 , { width:400 });
			});
		})();
		</script>
		<style type="text/css">
			#testBox1 { width:100px; height:100px; background-color:#ff0000; }
		</style>
		</head>
		<body>
			<div id="testBox1"></div>
		</body>
		</html>
	@return {void}
	 */
	EXTween.setGlobalInterval = function(val){
		if(val < 0) val = 1;
		_globalIntervalSpeed = val;
	};
	
	/**
	EXTween 의 기본 ease 속성을 지정합니다.
	<br/>기본값은 EXEasing.easeOutQuad 이며, EXEasing 에서 지원하는 함수를 지정 가능합니다.
	@method setDefaultEasing
	@static
	@param easing {Function} EXEasing easing function.
	@default EXEasing.easeOutQuad
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<script type="text/javascript" src="../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.includeBegin("../../experJS");
			EX.include("transitions/EXTween");
			EX.include("transitions/EXEasing");
			EX.includeEnd();
			EX.ready(function(){
				var testBox1 = document.getElementById("testBox1");
				EXTween.setDefaultEasing( EXEasing.easeInOutBack ); // default EXTween.easing.easeOutQuad
				EXTween.to(testBox1 , 1 , { width:400 });
			});
		})();
		</script>
		<style type="text/css">
			#testBox1 { width:100px; height:100px; background-color:#ff0000; }
		</style>
		</head>
		<body>
			<div id="testBox1"></div>
		</body>
		</html>
	@return {void}
	 */
	EXTween.setDefaultEasing = function(easing){
		_defaultEase = easing;
	};
	
	/**
	EXTween 에서 주로 사용하게 되는 method로 Tween 을 사용합니다.
	<br/>지원 속성과 예제를 참고하시기 바랍니다.
	@method to
	@static
	@param tweenObject {HTMLElement | Object} tween target object.
	@param speed {Nubmber} tween speed.
	@param tweenProperty {Object} Style property of HTMLElement and number property of Object.
		<div>
			<h6 style="color:#66bbcc;">[[ Support property ]]</h6>
			<strong>style property of HTMLElement</strong>
			<ul>
				<li>top , left , right , bottom</li>
				<li>width , height</li>
				<li>marginTop , marginBottom , marginLeft , marginRight</li>
				<li>fontSize , fontWeight , color</li>
				<li>paddingTop , paddingBottom , paddingLeft , paddingRight</li>
				<li>backgroundColor , backgroundPositionX , backgroundPositionY</li>
				<li>borderTopWidth , borderBottomWidth , borderLeftWidth , borderRightWidth</li>
				<li>borderTopColor , borderBottomColor , borderLeftColor , borderRightColor</li>
				<li>opacity</li>
			</ul>
			<strong>Javascript property of HTMLElement</strong>
			<ul>
				<li>scrollTop , scrollLeft</li>
			</ul>
			<strong>number type property of Object</strong>
			<ul>
				<li>Anything property. But only data type to number.</li>
			</ul>
			<strong>Supporting special property</strong>
			<ul>
				<li>delay : {Number} tween 을 시작전 대기 시간을 지정합니다.</li>
				<li>ease : {Function} tween 의 easing 방식을 지정합니다. EXEasing.* 을 참고하세요.</li>
				<li>toInt : {boolean} 소수점 계산을 무시하고 정수 계산합니다.</li>
				<li>autoOpacity : {Number} opacity 가 0 에 도달할 경우 자동으로 visibility,display 속성을 hidden 합니다. 또는 visibility,display 속성이 hidden 상태일 때 opacity 가 0 보다 크게 tween 될 경우 자동으로 visible 처리합니다.</li>
				<li>onInit : {Function} tween 이 초기화 될때 호출 되는 콜백 함수를 지정합니다.(delay 속성에 지정된 대기 시간이 적용 되지 않습니다.)</li>
				<li>onInitParams : {Array} onInit 에 지정된 콜백 함수에 전달할 파라미터를 배열 형태로 지정합니다.</li>
				<li>onStart : {Function} tween 이 시작될때 호출 되는 콜백 함수를 지정합니다.(delay 속성에 지정된 대기 시간이 적용 됩니다.)</li>
				<li>onStartParams : {Array} onStart 에 지정된 콜백 함수에 전달할 파라미터를 배열 형태로 지정합니다.</li>
				<li>onUpdate : {Function} tweening 이 일어나는 동안 계속해서 호출될 콜백 함수를 지정합니다.</li>
				<li>onUpdateParams : {Array} onUpdate 에 지정된 콜백 함수에 전달할 파라미터를 배열 형태로 지정합니다.</li>
				<li>onComplete : {Function} tween 이 완료되는 시점에 호출될 콜백 함수를 지정합니다.</li>
				<li>onCompleteParams : {Array} onComplete 에 지정된 콜백 함수에 전달할 파라미터를 배열 형태로 지정합니다.</li>
			</ul>
		</div>
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<script type="text/javascript" src="../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.includeBegin("../../experJS");
			EX.include("transitions/EXTween");
			EX.include("transitions/EXEasing");
			EX.includeEnd();
			EX.ready(function(){
				var testBox1 = document.getElementById("testBox1");

				EXTween.setDebugMode(true); // debug console.log

				EXTween.to( testBox1 , 1 , { opacity:0.3 , width:300 , height:300 , ease:EXEasing.easeOutQuint });
				EXTween.to( testBox1 , 1 , { delay:1 , width:50 , height:50 , ease:EXEasing.easeInOutBack});
				EXTween.to( testBox1 , 1 , { delay:2.5 , top:200 , ease:EXEasing.easeOutBounce });
				EXTween.to( testBox1 , 1 , { delay:4 , left:200 , ease:EXEasing.easeOutBack });
				EXTween.to( testBox1 , 0.8 , { delay:5 , width:100 , height:300 , top:100 , ease:EXEasing.easeOutExpo });
				EXTween.to( testBox1 , 0.5 , { delay:6 , backgroundColor:0xffff00 });
				EXTween.to( testBox1 , 0.5 , { delay:7 , opacity:1 , backgroundColor:0xeeeeee });

				EXTween.delayedCall(8 , delayedComplete2);
				EXTween.delayedCall(12 , delayedComplete3);
				EXTween.delayedCall(20 , delayedComplete4);

				function delayedComplete2(){
					EXTween.to( testBox1 , 0.5 , { borderLeftWidth:10 , borderRightWidth:10 });
					EXTween.to( testBox1 , 0.5 , { delay:1 , borderTopWidth:10 , borderBottomWidth:10 });
					EXTween.to( testBox1 , 0.5 , { delay:2 , borderLeftColor:0xff0000 , borderRightColor:0x00cc00 });
					EXTween.to( testBox1 , 0.5 , { delay:3 , borderLeftWidth:0 , borderRightWidth:0 , borderTopWidth:0 , borderBottomWidth:0 });
				}

				function delayedComplete3(){
					EXTween.to( testBox1 , 0.5 , { width:400 , height:80 , left:10 , top:10 });

					var numObject = new NumberObject();
					EXTween.to( numObject , 1.5 , { delay:1 , x:1000 , onUpdate:function(){
							testBox1.innerHTML = "<strong> number </strong>tween X : " + numObject.x;
						}, ease:EXEasing.easeOutExpo });
						
					EXTween.to( numObject , 1.5 , { delay:4 , y:-2000 , toInt:true 
						, onUpdate:function(){
							testBox1.innerHTML = "<strong> integer </strong>tween Y : " + numObject.y;
						}
						, onComplete:function( param1 , param2 ){
							testBox1.innerHTML = param1 + " - " + param2 + "!!";
						}
						, onCompleteParams: ["tween" , "complete"]
						, ease:EXEasing.easeInOutQuint });

					function NumberObject(){
						var numObj = {};
						numObj.x = 0;
						numObj.y = 2000;
						return numObj
					}
				}

				function delayedComplete4(){
					EXTween.to( testBox1 , 0.5 , { fontSize:40 , ease:EXEasing.easeOutQuart });
					EXTween.to( testBox1 , 0.5 , { delay:1 , color:0xff0000 , ease:EXEasing.easeOutQuart });
					EXTween.to( testBox1 , 0.5 , { delay:2 , fontSize:12 , color:0x000000 , ease:EXEasing.easeOutQuart });
					EXTween.to( testBox1 , 0.5 , { delay:3 , paddingTop:20 });
					EXTween.to( testBox1 , 0.5 , { delay:4 , paddingLeft:20 , onComplete:function(){
						testBox1.style.background = "#bbbbbb url(../../data/img/visual_cat.gif) 0 0 no-repeat";
						alert("background-position");
					}});
					
					EXTween.to( testBox1 , 0.5 , { delay:6 , backgroundPositionX:50 , ease:EXEasing.easeOutQuint });
					EXTween.to( testBox1 , 0.5 , { delay:7 , backgroundPositionX:-100 , ease:EXEasing.easeOutQuint });
					EXTween.to( testBox1 , 0.5 , { delay:8 , backgroundPositionY:30 , ease:EXEasing.easeOutQuint });
					EXTween.to( testBox1 , 0.5 , { delay:9 , backgroundPositionY:-100 , ease:EXEasing.easeOutQuint });
					EXTween.to( testBox1 , 0.5 , { delay:10 , autoOpacity:0 , onComplete:function(){
						alert("Hello EXTween ~ :)");
					}});
				}
			});
		})();
		</script>
		<style type="text/css">
			html , body { padding:0; margin:0; }
			.bgBox { position:absolute; width:300px; height:300px; background-color:#00ff00; }
			.bgBox.sm1 { top:230px; left:120px; }
			.bgBox.sm2 { top:110px; left:320px; height:100px; background-color:#0000ff; }
			#testBox1 { position:absolute; width:100px; height:100px; border:0px solid #000000; background-color:#ff0000; }
		</style>
		</head>
		<body>
			<div class="bgBox sm1"></div>
			<div class="bgBox sm2"></div>
			<div id="testBox1"></div>
		</body>
		</html>
	@return {void}
	 */
	EXTween.to = function(tweenObject , speed , tweenProperty){
		var delay = 0;
		if(tweenProperty.delay) delay = tweenProperty.delay;
		initTween(tweenObject , speed , tweenProperty);

		function initTween(tweenObject , speed , tweenProperty){
			_debugConsole( DEBUG_FILTER_EXECUTE , "queue key index("+_coreQueueCnt+") initialize");
			if(tweenProperty.onInit){
				_eventDispatcher(tweenProperty.onInit , tweenProperty.onInitParams);
				delete tweenProperty.onInit;
				delete tweenProperty.onInitParams;
			}
			if(_IS_IE == true && _IE_VERSION <= 8 && _isOpacityBlockIE8Under == true){
				delete tweenProperty.opacity;
				delete tweenProperty.autoOpacity;
			}
			var queueKey = _coreQueueCnt;
			_coreQueueCnt++;
			
			if(typeof(speed) == "number"){
				if(speed < 0) speed = 0;
			}else{
				speed = 1;
			}
			
			if(!tweenProperty.ease) tweenProperty.ease = _defaultEase;
			
			var tweenCore = {};
			if(tweenProperty.autoOpacity != undefined){
				tweenProperty.opacity = tweenProperty.autoOpacity;
				tweenCore.opacityAuto = true;
				delete tweenProperty.autoOpacity;
			}
			tweenCore.tweenObject = tweenObject;
			tweenCore.delay = 0;
			tweenCore.speed = 100*speed;
			if(tweenCore.speed <= 0) tweenCore.speed = 1; //speed 가 0일 경우 1로 하는 이유는 단 한번이라도 실행이 되어야 프로퍼티값을 대입해 줄 수 있기 때문이다.
			tweenCore.speedCnt = 0;
			tweenCore.tweenInitProperty = {};
			tweenCore.tweenProperty = {};
			tweenCore.toInt = false;
			tweenCore.enterFrame = null; // setInterval;
			_coreQueue[queueKey] = tweenCore;
			
			var coreProperty = ["delay","delayTimer" , "isDelayedCall" , "delayedCallFunc" ,"ease" , "toInt" ,"onComplete","onCompleteParams","onUpdate","onUpdateParams"];
			var coreProp = "";
			for(var i = 0 ; i < coreProperty.length ; i++){
				coreProp = coreProperty[i];
				if(tweenProperty[coreProp] != undefined){
					tweenCore[coreProp] = tweenProperty[coreProp];
					delete tweenProperty[coreProp];
				}
			}

			//IE 에 의해 아래 주석으로 처리한 방법은 사용하지 못한다.
			//tweenCore.delayTimer = setTimeout(delayCompleteTween , delay*1000  , EXTween.core._queueCnt);
			if(delay > 0){
				var delayedFunc = function(){ delayCompleteTween(queueKey); };
				tweenCore.delayTimer = setTimeout( delayedFunc , delay*1000);
			}else if(delay <= 0){
				delayCompleteTween(queueKey);
			}
		}
		//end method : initTween 
		

		function delayCompleteTween(queueCnt){
			_debugConsole( DEBUG_FILTER_EXECUTE , "queue key index("+ queueCnt +") start");
			var tweenCore = _coreQueue[queueCnt];
			tweenCore.uniqueQueueKey = queueCnt;
			
			if(tweenProperty.onStart){
				_eventDispatcher(tweenProperty.onStart , tweenProperty.onStartParams);
				delete tweenProperty.onStart;
				delete tweenProperty.onStartParams;
			}
			var property;
			var parseProperty;
			for(property in tweenProperty){
				parseProperty = propertyParser( tweenObject , property);//EXTween.utils.propertyParser(property);
				if(parseProperty.key == "" || parseProperty.key == undefined) continue;

				var initValue;
				if(parseProperty.type == "px" || parseProperty.type == ""){
					initValue = getExternalTypeToProperty( tweenObject , parseProperty.key , parseProperty.defaultValue , true);// EXTween.utils.Util.getExternalTypeToProperty( tweenObject , parseProperty.key , parseProperty.defaultValue , true);
					tweenCore.tweenProperty[parseProperty.key] = tweenProperty[property];
					tweenCore.tweenInitProperty[parseProperty.key] = initValue;
				}else if(parseProperty.type == "color"){
					initValue = getExternalTypeToProperty( tweenObject , parseProperty.key , parseProperty.defaultValue , false);//EXTween.utils.Util.getExternalTypeToProperty( tweenObject , parseProperty.key , parseProperty.defaultValue , false);

					if(_IS_IE == true){
						var propertyString;
						propertyString = (parseProperty.owner == "") ? tweenObject[property] : getExternalTypeToProperty( tweenObject , parseProperty.key , parseProperty.defaultValue , false);
						tweenCore.tweenInitProperty[property] = "0x"+propertyString.substring(1, initValue.length);
					}else{
						var colorValue = (parseProperty.owner == "") ? tweenObject[property] : getExternalTypeToProperty( tweenObject , parseProperty.key , parseProperty.defaultValue , false);
						tweenCore.tweenInitProperty[property] = colorConvertRGBStringToHex(initValue);//EXTween.utils.ColorUtil.colorConvertRGBStringToHex(initValue);
					}
					tweenCore.tweenProperty[property] = tweenProperty[property];
				}
			}
			if(tweenCore.speed > 1){
				killPreviousQueueProperty(tweenCore);
				_coreQueue[queueCnt].enterFrame = setInterval(function(){
					executeTween(queueCnt);
				} , _globalIntervalRate );
			}else if(tweenCore.speed <= 1){
				executeTween(queueCnt);
			}
		}
		//end method : delayCompleteTween
	};
	//end method : to 

	

	function executeTween(queue){
		var tweenCore = _coreQueue[queue];
		
		if(tweenCore == undefined) return;
		var tweenObject = tweenCore.tweenObject;
		if(tweenObject == undefined) return;
		var property = tweenCore.tweenProperty;
		var initProperty = tweenCore.tweenInitProperty;
		var tweenCoreSpeed = tweenCore.speed;
		var tweenCoreSpeedCnt = tweenCore.speedCnt;
		var allTweenComplete = true;
		
		var toInt = tweenCore.toInt;
		var propertyKey;
		var isColorTween = false;
		var change;
		var targetValue;
		
		var parseProperty;
		var propType;
		var propOwner;

		for(propertyKey in property){
			parseProperty = propertyParser( tweenObject , propertyKey);//EXTween.utils.propertyParser(propertyKey);

			propType = parseProperty.type;
			propOwner = parseProperty.owner;

			//컬러값 tweening
			if(propType == "color"){
				isColorTween = true;
				var convertColor;// = EXTween.utils.ColorUtil.colorConvertToHtmlHex(property[propertyKey] , initProperty[propertyKey] , core );
				var htmlColor;// = "#" + EXTween.utils.ColorUtil.convertColorStringBySixLength(convertColor);
				if(tweenCoreSpeed == 1){
					htmlColor = "#" + convertColorStringBySixLength(property[propertyKey]);//EXTween.utils.ColorUtil.convertColorStringBySixLength(property[propertyKey]);
				}else{
					convertColor = colorConvertToHtmlHex(property[propertyKey] , initProperty[propertyKey] , tweenCore );//EXTween.utils.ColorUtil.colorConvertToHtmlHex(property[propertyKey] , initProperty[propertyKey] , core );
					htmlColor = "#" + convertColorStringBySixLength(convertColor);//EXTween.utils.ColorUtil.convertColorStringBySixLength(convertColor);
				}
				if(propOwner == ""){
					tweenObject[propertyKey] = htmlColor;
				}else{
					tweenObject[propOwner][propertyKey] = htmlColor;
				}
			//propertyKey.type 을 이용 px, 또는 "" 일 경우
			}else{
				if(tweenCoreSpeed == 1){
					targetValue = property[propertyKey];
				}else{
					change = property[propertyKey] - initProperty[propertyKey];
					targetValue = tweenCore.ease(0 , tweenCoreSpeedCnt , 0 , change , tweenCoreSpeed) + initProperty[propertyKey];
				}
				
				if(propertyKey == "opacity"){
					//tweenProperty 는 to 함수에서 받는 parameter
					if(tweenCore.opacityAuto == true && tweenObject.style.visibility == "hidden"){
						if(targetValue > 0){
							tweenObject.style.visibility = "visible";
							tweenObject.style.display = "block";
						}
					}
					if(_IS_IE == true && _IE_VERSION <= 8){
						tweenObject.style.filter = "alpha(opacity="+ Math.floor(targetValue*100) +")";
						//tweenObject.style["-ms-filter"] = "alpha(opacity="+ Math.floor(targetValue*100) +")";
					}else{
						if(tweenCoreSpeed == 1){
							targetValue = property[propertyKey];
						}else{
							change = property[propertyKey] - initProperty[propertyKey];
							targetValue = tweenCore.ease(0 , tweenCoreSpeedCnt , 0 , change , tweenCoreSpeed) + initProperty[propertyKey];
						}
					}
				}
				
				if(propOwner == ""){
					tweenObject[propertyKey] = (toInt == true) ? Math.floor(targetValue) : (targetValue+ propType);
				}else{
					if(_IS_FF == true && (propertyKey == "backgroundPositionX" || propertyKey == "backgroundPositionY") ){
						tweenObject[propOwner]["backgroundPosition"] = setFireFoxBackgroundPosition(tweenObject , propertyKey , targetValue);
					}else{
						tweenObject[propOwner][propertyKey] = (toInt == true) ? Math.floor(targetValue)+propType : (targetValue+ propType);
					}
				}
			}
			if(tweenCore.onUpdate != undefined) _eventDispatcher(tweenCore.onUpdate , tweenCore.onUpdateParams); // core.onUpdate(core.onUpdateParams);
			if(tweenCoreSpeedCnt >= tweenCoreSpeed){
				if(isColorTween == false){
					if(propOwner == ""){
						tweenObject[propertyKey] = (property[propertyKey] + propType).toString();
					}else{
						tweenObject[propOwner][propertyKey] = (property[propertyKey] + propType).toString();
					}
				}
//				if(core.onComplete != undefined) _eventDispatcher(core.onComplete , core.onCompleteParams);
				delete property[propertyKey];
				continue;
			}
			allTweenComplete = false;
		}

		if(allTweenComplete == true || tweenCoreSpeed == 1){
			//tweenProperty 는 to 함수에서 받는 parameter
			if(tweenCore.opacityAuto == true || tweenCore.opacityAuto != undefined){
				var opacityValue = getOpacityValueToNumber(tweenObject);//EXTween.utils.Util.getOpacityValueToNumber(tweenObject);
				if(opacityValue <= 0){
					tweenObject.style.visibility = "hidden";
					tweenObject.style.display = "none";
					delete tweenCore.opacityAuto;
				}
			}
			if(tweenCore.onComplete != undefined){
				_eventDispatcher(tweenCore.onComplete , tweenCore.onCompleteParams);
				delete tweenCore.onComplete;
				delete tweenCore.onCompleteParams;
			}
			killTweenDeleteData(queue);
			delete property;
			delete initProperty;
			delete tweenCore;
			return;
		}else{
			tweenCore.speedCnt += _globalIntervalSpeed;
		}
	}
	//end method : excuteTween

	
	function killPreviousQueueProperty(core){
		try{
			var tweenTargetDisplayObject = core.tweenObject;
			var tweenTargetProperty = core.tweenProperty;
			var queue;
			var compareCore;
			for(queue in _coreQueue ){
				compareCore = _coreQueue[queue];
				if(compareCore.tweenObject != tweenTargetDisplayObject) continue;
				if(compareCore.uniqueQueueKey != undefined && compareCore.uniqueQueueKey != core.uniqueQueueKey){
					var propertyKey;
					for(propertyKey in tweenTargetProperty){
						if(compareCore.tweenProperty[propertyKey] != undefined){
							delete compareCore.tweenProperty[propertyKey];
							_debugConsole( DEBUG_FILTER_KILL , "queue key index("+ queue +") Kill previous tween property in same element : " + propertyKey);
						}
					}
					if(compareCore.onStart != undefined) delete compareCore.onStart;
					if(compareCore.onComplete != undefined) delete compareCore.onComplete;
				}
			}
		}catch(e){
			_debugConsole( DEBUG_FILTER_ERROR , e);
		}finally{
		}
	};
	//end method : killPreviousQueueProperty


	function colorConvertToHtmlHex(targetColor , initColor , core){
		var targetHexColor = Math.floor(targetColor);
		var rColor = targetHexColor >> 16;
		var gbColor = targetHexColor-(rColor << 16);
		var gColor = gbColor >> 8;
		var bColor = gbColor - (gColor << 8);
		
		var initHexColor = Math.floor(initColor);
		var rInitColor   = initHexColor >> 16;
		var gbInitColor = initHexColor-(rInitColor << 16);
		var gInitColor   = gbInitColor >> 8;
		var bInitColor   = gbInitColor - (gInitColor << 8);
		
		var changeR = rColor - rInitColor;
		var changeG = gColor - gInitColor;
		var changeB = bColor - bInitColor;

		rColor = core.ease(0 , core.speedCnt , 0 , changeR , core.speed) + rInitColor;
		gColor = core.ease(0 , core.speedCnt , 0 , changeG , core.speed) + gInitColor;
		bColor = core.ease(0 , core.speedCnt , 0 , changeB , core.speed) + bInitColor;
		
		return Math.ceil((rColor << 16) + (gColor << 8) + bColor);
	};
	//end method : colorConvertToHtmlHex

	// 컬러 속성(style)이 rgb(255 , 255 ,255) 와 같이 달려오는 값을 변환한다. hex 값으로 변환한다.
	function colorConvertRGBStringToHex(rgb){
		rgb = rgb.replace(/^rgba\((0),+\s(0),+\s(0),+\s(0)(\s)?(\))/ , "rgb(255, 255, 255)");//rgb.replace(/^rgba\((\d+),+\s/ , "rgb(");
		rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
		function hex(x) {
			return ("0" + parseInt(x).toString(16)).slice(-2);
		}
		return "0x" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	};
	//end method : colorConvertRGBStringToHex
	
	function convertColorStringBySixLength(hexColor){
		var rColor = hexColor >> 16;
		var gbColor = hexColor-(rColor << 16);
		var gColor = gbColor >> 8;
		var bColor = gbColor - (gColor << 8);

		var rColorString = (rColor < 16) ? convertColorString(rColor) : rColor.toString(16);
		var gColorString = (gColor < 16) ? convertColorString(gColor) : gColor.toString(16);
		var bColorString = (bColor < 16) ? convertColorString(bColor) : bColor.toString(16);
		return rColorString + gColorString + bColorString; //colorString;
	};
	//end method : convertColorStringBySixLength

	function convertColorString(hexColor){
		var convertString = hexColor.toString(16);
		var stringLength = convertString.length;
		switch(stringLength){
			case 0:
				convertString = "00";
				break;
			case 1:
				convertString = "0"+convertString;
				break;
		}
		return convertString;
	};
	//end method : convertColorString
	
/*
	function getPropertyTypeToPixel(){
		return ["width" , "height" , "left" , "top" , "right" , "bottom" 
				, "marginTop" , "marginBottom" , "marginLeft" , "marginRight" , "paddingTop" , "paddingBottom" , "paddingLeft" , "paddingRight"
				, "borderTopWidth" ,"borderBottomWidth" ,"borderLeftWidth" , "borderRightWidth" 
				, "fontWeight" , "fontSize"
				, "backgroundPositionX" , "backgroundPositionY"];
	};
	//end method : getPropertyTypeToPixel

	function getPropertyTypeToColor(){
		return ["color" , "backgroundColor" , "borderTopColor" , "borderBottomColor" , "borderLeftColor" , "borderRightColor"];
	};
*/
	//end method : getPropertyTypeToColor

	function getExternalTypeToProperty(tweenObject , propertyName , defaultValue , isInteger){
		isInteger = (isInteger == false) ? false : true;
		var checkValue = "";
		var propertyCheckName = propertyName;
		
		if(_IE_VERSION == 6 && tweenObject.style != undefined && tweenObject.style[propertyName] != ""){
			checkValue = tweenObject.style[propertyName];
			if(isInteger == true) checkValue = (isNaN(parseFloat(checkValue))) ? defaultValue : parseFloat(checkValue);
			return checkValue;
		}
		
		var regExpHtmlElement = /(HTML).*Element/;
		var isHtmlElement = (tweenObject.nodeType == 1) ? true : false;
		if(isHtmlElement == false){
			checkValue = tweenObject[propertyName];
			if(isInteger == true) checkValue = (isNaN(parseFloat(checkValue))) ? defaultValue : parseFloat(checkValue);
		}else{
			if(_IS_IE == false){
				switch(propertyName){
					case "backgroundColor": propertyCheckName = "background-color"; break;
					case "backgroundPositionX": propertyCheckName = "background-position-x"; break;
					case "backgroundPositionY": propertyCheckName = "background-position-y"; break;
					case "fontColor": propertyCheckName = "color"; break;
					case "fontSize": propertyCheckName = "font-size"; break;
					
					case "marginTop": propertyCheckName = "margin-top"; break;
					case "marginBottom": propertyCheckName = "margin-bottom"; break;
					case "marginLeft": propertyCheckName = "margin-left"; break;
					case "marginRight": propertyCheckName = "margin-right"; break;
					
					case "paddingTop": propertyCheckName = "padding-top"; break;
					case "paddingBottom": propertyCheckName = "padding-bottom"; break;
					case "paddingLeft": propertyCheckName = "padding-left"; break;
					case "paddingRight": propertyCheckName = "padding-right"; break;

					case "borderTopWidth": propertyCheckName = "border-top-width"; break;
					case "borderBottomWidth": propertyCheckName = "border-bottom-width"; break;
					case "borderLeftWidth": propertyCheckName = "border-left-width"; break;
					case "borderRightWidth": propertyCheckName = "border-right-width"; break;

					case "borderTopColor": propertyCheckName = "border-top-color"; break;
					case "borderBottomColor": propertyCheckName = "border-bottom-color"; break;
					case "borderLeftColor": propertyCheckName = "border-left-color"; break;
					case "borderRightColor": propertyCheckName = "border-right-color"; break;

					case "fontWeight": propertyCheckName = "font-weight"; break;
				}
				
				var computedStyle = document.defaultView.getComputedStyle(tweenObject , null);
				if(propertyCheckName == "background-position-x" || propertyCheckName == "background-position-y"){
					if(_IS_FF == true){
						checkValue = getFireFoxBackgroundPosition(tweenObject , propertyCheckName);
					}else{
						if(computedStyle != null){
							checkValue = computedStyle.getPropertyValue(propertyCheckName);
						}
					}
				}else if(propertyName == "scrollTop" || propertyName == "scrollLeft"){
					checkValue = tweenObject[propertyName];
				}else{
					if(computedStyle != null){
						checkValue = computedStyle.getPropertyValue(propertyCheckName);
					}
				}
			}else{
				var ieFeature = false;
				switch(propertyName){
					case "top":
						propertyCheckName = "offsetTop";
						ieFeature = true;
						break;
					case "left":
						propertyCheckName = "offsetLeft";
						ieFeature = true;
						break;
					case "width":
						propertyCheckName = "offsetWidth";
						ieFeature = true;
						break;
					case "height":
						propertyCheckName = "offsetHeight";
						ieFeature = true;
						break;
					case "scrollTop":
						propertyCheckName = "scrollTop";
						ieFeature = true;
						break;
					case "scrollLeft":
						propertyCheckName = "scrollLeft";
						ieFeature = true;
						break;
				}
				if(ieFeature == false){
					checkValue = tweenObject.currentStyle[propertyCheckName];
				}else{
					checkValue = tweenObject[propertyCheckName];
					if(propertyCheckName == "offsetWidth"){
						var borderLeftWidth = parseInt(tweenObject.currentStyle["border-left-width"]);
						var borderRightWidth = parseInt(tweenObject.currentStyle["border-right-width"]);
						borderLeftWidth = (isNaN(borderLeftWidth) || borderLeftWidth <= 0 ) ? 0 : borderLeftWidth;
						borderRightWidth = (isNaN(borderRightWidth) || borderRightWidth <= 0 ) ? 0 : borderRightWidth;
						checkValue = checkValue - borderLeftWidth - borderRightWidth;
					}else if(propertyCheckName == "offsetHeight"){
						var borderTopWidth = parseInt(tweenObject.currentStyle["border-top-width"]);
						var borderBottomWidth = parseInt(tweenObject.currentStyle["border-bottom-width"]);
						borderTopWidth = (isNaN(borderTopWidth) || borderTopWidth <= 0 ) ? 0 : borderTopWidth;
						borderBottomWidth = (isNaN(borderBottomWidth) || borderBottomWidth <= 0 ) ? 0 : borderBottomWidth;
						checkValue = checkValue - borderTopWidth - borderBottomWidth;
					}
				}
			}
			if(isInteger == true) checkValue = (isNaN(parseFloat(checkValue))) ? defaultValue : parseFloat(checkValue);
		}
		return checkValue;
	};
	//end method : getExternalTypeToProperty
	

	function getFireFoxBackgroundPosition(tweenObject , position){
		var isX = (position.split("-")[2] == "x") ? true : false;
		var computedStyle = document.defaultView.getComputedStyle(tweenObject , null);
		if(computedStyle == null) return;
		var checkPosition = document.defaultView.getComputedStyle(tweenObject , null).getPropertyValue("background-position").split(" ");
		var returnValue = 0;
		returnValue = (isX == true) ? checkPosition[0] : checkPosition[1];
		returnValue = parseInt(returnValue);
		return returnValue;
	}
	//end method : getFireFoxBackgroundPosition

	function setFireFoxBackgroundPosition(tweenObject , position , value){
		var isX = (position.substring(position.length-1 , position.length) == "X") ? true : false;
		var sidePosition = (isX == false) ? "background-position-x" : "background-position-y";
		var sideValue = getFireFoxBackgroundPosition(tweenObject , sidePosition);
		var returnString = "";
		if(isX == true){
			returnString = value +"px " + sideValue+"px";
		}else{
			returnString = sideValue +"px " + value+"px";
		}
		return returnString;
	}
	//end method : setFireFoxBackgroundPosition
	
	function getOpacityValueToNumber(tweenObject){
		var opacityValue = 0;
		if(_IS_IE == true && _IE_VERSION <= 8){
			var regExpAlpha = /alpha\(opacity\=/;
			var alphaReg = regExpAlpha.exec(tweenObject.style.filter);
			if(alphaReg != null){
				var alphaRegNum = /\d+/;
				var ieOpacity = alphaRegNum.exec(tweenObject.style.filter);
				opacityValue = ieOpacity/100;
			}
		}else{
			opacityValue = tweenObject.style.opacity;
		}
		return opacityValue;
	};
	//end method : getOpacityValueToNumber


	function propertyParser(tweenObject , propertyKey ){
		var parser = {};
		parser.key = "";
		parser.owner = "";
		parser.type = ""; //color , px ,
		parser.defaultValue = 0;

		if(propertyKey == "opacity"){
			parser.owner = "style";
			parser.key = "opacity";
			parser.defaultValue = 1;
		}else{
			var isPixel = false;
			var isColor = false;
			//var pixelProperty = _getPropertyTypeToPixel();//EXTween.utils.Util.getPropertyTypeToPixel();
			var i = 0;
			for( i = 0 ; i < _getPropertyTypeToPixel.length ; i++){
				if(propertyKey == _getPropertyTypeToPixel[i]){
					parser.key = _getPropertyTypeToPixel[i];
					parser.type = "px";
					parser.owner = "style";
					parser.defaultValue = 0;
					isPixel = true;
					break;
				}
			}
			if(isPixel == false){
				//var colorProperty = _getPropertyTypeToColor();//EXTween.utils.Util.getPropertyTypeToColor();
												
				for( i = 0 ; i < _getPropertyTypeToColor.length ; i++){
					if(propertyKey == _getPropertyTypeToColor[i]){
						parser.key = _getPropertyTypeToColor[i];
						parser.type = "color";
						parser.owner = "style";
						isColorl = true;
						break;
					}
				}
			}
			if(isPixel == false && isColor == false){
				parser.key = propertyKey;
			}
		}
		
		if(parser.owner != ""){
			if(_IE_VERSION == 6 && tweenObject.style != undefined && tweenObject.style[parser.key] != ""){
				return parser;
			}
			var regExpHtmlElement = /(HTML).*Element/;
			var isHtmlElement = (tweenObject.nodeType == 1) ? true : false;// = regExpHtmlElement.test(tweenObject.constructor);
			if(isHtmlElement == false){
				parser.owner = "";
				parser.type = "";
			}
		}
		return parser;
	};
	//end method : propertyParser
	
	
	
	
	
	
	
	/**
	setTimeout 을 좀 더 쉽게 사용할 수 있능 기능을 제공합니다.
	@method delayedCall
	@static
	@param delayNum {Number} wait in the value to callback.
	@param callback {Function} A function that should be called when the the callback has delay completed.
	@param params {Array} pass the callback function.
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<script type="text/javascript" src="../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.includeBegin("../../experJS");
			EX.include("transitions/EXTween");
			EX.include("transitions/EXEasing");
			EX.includeEnd();
			EX.ready(function(){
				var testBox1 = document.getElementById("testBox1");
				EXTween.setDebugMode(true); // debug console.log
				EXTween.delayedCall(1 , function(){
					alert("delayedCall 1");
				});
				EXTween.delayedCall(2 , testFunc1);
				EXTween.delayedCall(3 , testFunc2 , ["Hello" , "EXTween"]);

				function testFunc1(){
					alert("delayedCall 2");
				}
				function testFunc2(param1 , param2){
					alert(param1 + " " + param2);
				}
			});
		})();
		</script>
		<style type="text/css">
			html , body { padding:0; margin:0; }
		</style>
		</head>
		<body>
		</body>
		</html>
	@return {void}
	 */
	EXTween.delayedCall = function(delayNum , callback , params){
		var queue = _coreQueueCnt;
		_coreQueueCnt++;
		var delayedFunc = function(){delayCompleteTween(queue , callback , params);};
		var tweenCore = {};
		tweenCore.delayTimer = setTimeout( delayedFunc , delayNum*1000);
		tweenCore.isDelayedCall = true;
		tweenCore.delayedCallFunc = callback;
		
		_coreQueue[queue] = tweenCore;
		
		function delayCompleteTween(refQueue , refFunc , refParams){
			_debugConsole( DEBUG_FILTER_EXECUTE , "delayedCall { delay : " + delayNum*1000 + " , functionName : " + ((refFunc.name == "") ? "Anonymous" : refFunc.name) +" }");
			_eventDispatcher( refFunc , refParams);
			killTweenDeleteData(refQueue);
		}
	};
	//end method : EXTween.delayedCal





	/**
	EXTween.delayedCall 에 등록되고 대기중인 함수를 제거합니다.
	<br/>(등록된 함수와 제거될 함수는 동일해야 합니다.)
	@method killDelayedCalls
	@static
	@param func {Function} EXTween.delayedCall 에 등록된 함수.
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<script type="text/javascript" src="../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.includeBegin("../../experJS");
			EX.include("transitions/EXTween");
			EX.include("transitions/EXEasing");
			EX.includeEnd();
			EX.ready(function(){
				EXTween.setDebugMode(true); // debug console.log

				function testFunc1(){
					alert("delayedCall 2");
				}

				function testFunc2(param1 , param2){
					alert(param1 + " " + param2);
				}
				
				var exm = {};
				exm.testFunc = function(){
					alert("called??");
				}

				//There is no way to kill the anonymous function.
				EXTween.delayedCall(1 , function(){
					alert("delayedCall 1");
				});

				EXTween.delayedCall(2 , testFunc1);
				EXTween.delayedCall(3 , testFunc2 , ["Hello" , "EXTween"]);
				EXTween.delayedCall(4 , exm.testFunc);

				EXTween.killDelayedCalls(testFunc1); // kill
				EXTween.killDelayedCalls(exm.testFunc); // kill
			});
		})();
		</script>
		<style type="text/css">
			html , body { padding:0; margin:0; }
		</style>
		</head>
		<body>
		</body>
		</html>
	@return {void}
	 */
	EXTween.killDelayedCalls = function(func){
		_debugConsole( DEBUG_FILTER_KILL , "killDelayedCalls - { functionName : " + ((func.name == "") ? "Anonymous" : func.name) +" }");
		var queue;
		var coreCueue = _coreQueue;
		for(queue in coreCueue){
			if(coreCueue[queue].isDelayedCall == true && coreCueue[queue].delayedCallFunc == func) killTweenDeleteData(queue);
		}
	};
	//end method : EXTween.killDelayedCalls




	/**
	지정된 Object 의 EXTween.to 에 등록되고 대기중인 객체의 EXTween 동작을 모두 제거합니다.
	@method killTweensOf
	@static
	@param tweenObject {Object} EXTween.to 에 지정된 Object.
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<script type="text/javascript" src="../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.includeBegin("../../experJS");
			EX.include("transitions/EXTween");
			EX.include("transitions/EXEasing");
			EX.includeEnd();
			EX.ready(function(){
				var testBox1 = document.getElementById("testBox1");

				EXTween.setDebugMode(true); // debug console.log

				EXTween.to( testBox1 , 10 , { width:500 });
				EXTween.to( testBox1 , 6 , { height:400 });
				EXTween.to( testBox1 , 4 , { backgroundColor:0xffff00 });
				EXTween.delayedCall(2 , tweenKill );
				function tweenKill(){
					EXTween.killTweensOf(testBox1);
				}
			});
		})();
		</script>
		<style type="text/css">
			html , body { padding:0; margin:0; }
			#testBox1 { position:absolute; width:100px; height:100px; border:0px solid #000000; background-color:#ff0000; }
		</style>
		</head>
		<body>
			<div id="testBox1"></div>
		</body>
		</html>
	@return {void}
	 */
	EXTween.killTweensOf = function(tweenObject){
		_debugConsole( DEBUG_FILTER_KILL , "killTweensOf");
		var queue;
		var coreCueue = _coreQueue;
		for(queue in coreCueue){
			if(coreCueue[queue].tweenObject == tweenObject) killTweenDeleteData(queue);
		}
	};
	//end method : EXTween.killTweensOf




	/**
	EXTween 의 등록된(to, deleayedCall) 모든 tweening 동작을 제거합니다.
	@method killAll
	@static
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<script type="text/javascript" src="../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.includeBegin("../../experJS");
			EX.include("transitions/EXTween");
			EX.include("transitions/EXEasing");
			EX.includeEnd();
			EX.ready(function(){
				var testBox1 = document.getElementById("testBox1");
				var testBox2 = document.getElementById("testBox2");
				var testBox3 = document.getElementById("testBox3");

				EXTween.setDebugMode(true); // debug console.log

				EXTween.to( testBox1 , 10 , { width:500 });
				EXTween.to( testBox1 , 6 , { height:400 });
				EXTween.to( testBox1 , 4 , { backgroundColor:0xffff00 });
				
				EXTween.to( testBox2 , 2.5 , { width:200 , onUpdate:function(){
					testBox2.innerHTML = "width : " + Math.ceil(testBox2.offsetWidth);
				}});
				EXTween.to( testBox2 , 2.5 , { height:10 });
				EXTween.to( testBox2 , 1.5 , { backgroundColor:0x000000 });
				
				EXTween.to( testBox3 , 1 , { delay:1 , width:10 });
				EXTween.to( testBox3 , 1 , { delay:2 , height:10 });
				EXTween.to( testBox3 , 1 , { delay:3 , backgroundColor:0x000000 });

				EXTween.delayedCall(3 , function(){
					alert("delayedCall");
				});

				EXTween.delayedCall(1 , function(){
					EXTween.killAll(); // all kill!!!
				});
			});
		})();
		</script>
		<style type="text/css">
			html , body { padding:0; margin:0; }
			.box { position:absolute; width:100px; height:100px; color:#ffffff; }
			#testBox1 { background-color:#ff0000; }
			#testBox2 { top:100px; left:400px; background-color:#00ff00; }
			#testBox3 { top:300px; left:200px; background-color:#0000ff; }
		</style>
		</head>
		<body>
			<div id="testBox1" class="box"></div>
			<div id="testBox2" class="box"></div>
			<div id="testBox3" class="box"></div>
		</body>
		</html>
	@return {void}
	 */
	EXTween.killAll = function(){
		_debugConsole( DEBUG_FILTER_KILL , "killAll");
		var queue;
		var killTargetCore;
		for( queue in _coreQueue){
			killTweenDeleteData(queue);
		}
	};
	//end method : EXTween.killAll





	var killTweenDeleteData = function(queue){
		try{
			var killTargetCore = _coreQueue[queue];
			if(killTargetCore){
				var propertyKey;
				if(killTargetCore.enterFrame != null || killTargetCore.enterFrame != undefined){
					clearInterval(killTargetCore.enterFrame);
					delete killTargetCore.enterFrame;
				}
				if(killTargetCore.delayTimer != null || killTargetCore.delayTimer != undefined){
					clearTimeout(killTargetCore.delayTimer);
					delete killTargetCore.delayTimer;
				}
				if(killTargetCore.tweenProperty != null || killTargetCore.tweenProperty != undefined){
					for(propertyKey in killTargetCore.tweenProperty){
						_debugConsole(DEBUG_FILTER_KILL , "queue key index("+ queue +") Kill tween property data in garbage : " + propertyKey);
						delete killTargetCore.tweenProperty[propertyKey];
					}
				}
				if(killTargetCore.tweenInitProperty != null || killTargetCore.tweenInitProperty != undefined){
					for(propertyKey in killTargetCore.tweenInitProperty){
						_debugConsole(DEBUG_FILTER_KILL , "queue key index("+ queue +") Kill tween property data : " + propertyKey);
						delete killTargetCore.tweenInitProperty[propertyKey];
					}
				}
				for(propertyKey in killTargetCore){
					delete killTargetCore[propertyKey];
				}
			}
		}catch(e){
		}finally{
			delete _coreQueue[queue];
		}
	};
	//end method : killTweenDeleteData





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

	return EXTween;
});