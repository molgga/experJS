define(function(require, exports){
	var EXEventListener = require("../events/EXEventListener");
	var EXTween = require("../transitions/EXTween");
	var EXEasing = require("../transitions/EXEasing");
	var EXElement = require("../utils/EXElement");
	
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
	var defaultSecond = 3;

	var ClassOf = {
		ALTERNATE : "exUIKit_toast"
		, TYPE_ERROR : "error"
		, TYPE_SUCCESS : "success"
	}

	exports.TypeOf = {
		SUCCESS : "success"
		, ERROR : "error"
		, WARNING : "warning"
	}
	
	/**
	EXToast 의 싱글톤 말풍선(view) 객체 입니다.
	@property singletonAlternate
	@type {HTMLElement}
	*/
	exports.singletonAlternate = singletonAlternate;

	exports.setDefaultSecond = function(sec){
		defaultSecond = sec;
	};
	
	/**
	EXToast 를 초기화 합니다.
	<br/>EXToast 는 문서 로드시 자체 init 합니다.
	@method init
	@return {void}
	*/
	exports.init = function(){
		if(window.EXEventListener != undefined){
			EXEventListener = window.EXEventListener;
		}
		singletonAlternate = document.createElement("div");
		singletonAlternate.className = ClassOf.ALTERNATE;

		EXTween.killTweensOf(singletonAlternate);
		document.body.appendChild(singletonAlternate);
		EXTween.to( singletonAlternate , 0 , { autoOpacity:0 });

		EXEventListener.add( singletonAlternate , "mouseover" , interactionAlternativeHandler);
		EXEventListener.add( singletonAlternate , "mouseout" , interactionAlternativeHandler);
	};
	
	
	/**
	EXToast 를 지정된 시간동안 노출합니다.
	@method message
	@param text {String} 노출될 문자(열)
	@param showSecond {number} 노출될 지속 시간
	@return {void}
	*/
	exports.message = function( text , option ){
		if(text == ""){
			return false;
		}
		//if(previewMessage == msg){
			//return false;
		//}
		var textMessage = text;

		singletonAlternate.className = ClassOf.ALTERNATE;

		var second = defaultSecond;
		if(option != undefined){
			if(option.second != undefined){
				second = option.second;
			}
			if(option.type != undefined){
				EXElement.addClass(singletonAlternate , option.type);
				textMessage = exports.designOfType(option.type) + textMessage;
			}
		}

		singletonAlternate.innerHTML = textMessage;

		EXTween.killTweensOf(singletonAlternate);
		EXTween.to( singletonAlternate , 0 , { autoOpacity:0.01 });
		var offsetWidth = singletonAlternate.offsetWidth;
		var offsetHeight = singletonAlternate.offsetHeight;
		EXTween.to( singletonAlternate , 0 , { autoOpacity:0 , marginLeft: -offsetWidth/2 });
		EXTween.to( singletonAlternate , 0.5 , { autoOpacity:1 , ease:EXEasing.easeOutQuint});
		EXTween.to( singletonAlternate , 0.5 , { delay: second , autoOpacity:0 });
		
		return true;
	};

	exports.designOfType= function(type){
		var headTitle = "";
		switch(type){
			case exports.TypeOf.SUCCESS : 
				headTitle = "<strong class='head_title'>Success</strong> ";
				break;
			case exports.TypeOf.WARNING : 
				headTitle = "<strong class='head_title'>Warning</strong> ";
				break;
			case exports.TypeOf.ERROR : 
				headTitle = "<strong class='head_title'>Error</strong> ";
				break;
		}
		return headTitle;
	}

	function interactionAlternativeHandler(evt){
		switch(evt.type){
			case "mouseover" :
				EXTween.killTweensOf(singletonAlternate);
				EXTween.to( singletonAlternate , 0.5 , { autoOpacity:1 });
				break;
			case "mouseout" :
				EXTween.killTweensOf(singletonAlternate);
		EXTween.to( singletonAlternate , 0.5 , { delay:0.5, autoOpacity:0 });
				break;
		}
	}

	exports.init();
});