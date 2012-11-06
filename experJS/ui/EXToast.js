define(function(require, exports){
	var EXTween = require("../transitions/EXTween");
	var EXEasing = require("../transitions/EXEasing");
	
	/**
	@class EXToast
	@constructor
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
			EX.include("ui/EXToast");
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				var showToastBtn = document.getElementById("showToastBtn");
				var showMessage = document.getElementById("showMessage");

				showToastBtn.onclick = function(evt){
					EXToast.message( showMessage.value );
				}
			});
		})();
		</script>

		<style type="text/css">
		body { font-family:"돋움"; font-size:0.8em; }
		</style>

		</head>
		<body>
			<input id="showMessage" type="text" />
			<button id="showToastBtn">showToastBtn</button>
		</body>
		</html>
	*/
	var singletonAlternate = null;
	var previewMessage = "";

	var ClassOf = {
		ALTERNATE : "experCSS_toast_alternate"
	}
	
	/**
	EXToast 의 싱글톤 말풍선(view) 객체 입니다.
	@property singletonAlternate
	@type {HTMLElement}
	*/
	exports.singletonAlternate = singletonAlternate;
	
	/**
	EXToast 를 초기화 합니다.
	<br/>EXToast 는 문서 로드시 자체 init 합니다.
	@method init
	@return {void}
	*/
	exports.init = function(){
		exports.makeToolTip();
	};
	
	/**
	singletonAlternate 객체를 생성합니다.
	@method makeToolTip
	@return {void}
	*/
	exports.makeToolTip = function(){
		if(singletonAlternate == null){
			singletonAlternate = document.createElement("div");
			singletonAlternate.className = ClassOf.ALTERNATE;

			EXTween.killTweensOf(singletonAlternate);
			document.body.appendChild(singletonAlternate);
			EXTween.to( singletonAlternate , 0 , { autoOpacity:0 });
		}
	};
	
	/**
	EXToast 를 지정된 시간동안 노출합니다.
	@method message
	@param msg {String} 노출될 문자(열)
	@param showSecond {number} 노출될 지속 시간
	@return {void}
	*/
	exports.message = function( msg , showSecond ){
		if(msg == ""){
			return false;
		}
		if(previewMessage == msg){
			return false;
		}
		if(showSecond == undefined || showSecond.constructor != Number){
			showSecond = 2;
		}
		singletonAlternate.innerHTML = msg;
		previewMessage = msg;

		EXTween.killTweensOf(singletonAlternate);
		EXTween.to( singletonAlternate , 0 , { autoOpacity:0.01 });
		var offsetWidth = singletonAlternate.offsetWidth;
		var offsetHeight = singletonAlternate.offsetHeight;
		EXTween.to( singletonAlternate , 0 , { autoOpacity:0 , marginLeft: -offsetWidth/2 });
		EXTween.to( singletonAlternate , 0.5 , { autoOpacity:1 , ease:EXEasing.easeOutQuint});
		EXTween.to( singletonAlternate , 0.5 , { delay: showSecond , autoOpacity:0 , ease:EXEasing.easeOutQuint , onComplete:function(){
			singletonAlternate.innerHTML = "";
			previewMessage = null;
		}});
		
		return true;
	};

	exports.init();
});