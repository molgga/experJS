define(function(require , exports){
	/**
	@class EXElement
	@static
	*/

	/**
	기존 클래스명은 유지한 상태로 parameter 로 전달되는 클래스명을 추가하며, 중복되는(이미 지정된) 클래스는 추가하지 않습니다.
	@method addClass
	@static
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<title></title>
		<script type="text/javascript" src="../../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.includeBegin("../../../experJS");
			EX.include("utils/EXElement");
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX.ready" , "callback");

				var btn = document.getElementById("btn");
				var box = document.getElementById("box");
				var count = 0;

				btn.onclick = function(){
					count++;
					if(count > 3) count = 0;
					switch(count){
						case 0 :
							box.className = "default";
							break;
						case 1 :
							EXElement.addClass(box , "type1");
							break;
						case 2 :
							EXElement.addClass(box , "type2");
							break;
						case 3 :
							EXElement.addClass(box , "type3");
							break;
					}
					EX.debug("box className : " , box.className);
				}
			});
		})();
		</script>

		<style type="text/css">
		#box { width:100px; height:100px; background-color:#ff0000; }
		#box.default { font-size:0.8em; font-weight:bold; color:#ffffff; background-color:#000000; }
		#box.type1 { color:#ffff00; }
		#box.type2 { background-color:#ff0000; }
		#box.type3 { font-size:1.2em; }
		</style>
		</head>
		<body>
		<button id="btn">addClass</button>
		<div id="box" class="default">test box</div>
		</body>
		</html>
	@param element {HTMLElement} 클래스 명을 추가할 HTMLElement 객체
	@param addName {String} 추가할 클래스명
	@return void
	 */
	exports.addClass = function( element , addName ){
		var tempClassName = element.className;
		var addReg = new RegExp("\\b"+addName+"\\b");
		if(addReg.test(tempClassName) == false){
			if(tempClassName != ""){
				tempClassName += " " + addName;
			}else{
				tempClassName = addName;
			}
			element.className = replaceNeedlessClassNameSyntax(tempClassName);
		}
	};

	/**
	parameter 로 전달되는 클래스명과 일치하는 클래스명이 있다면, 해당 클래스를 제거합니다.
	@method removeClass
	@static
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<title></title>
		<script type="text/javascript" src="../../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.includeBegin("../../../experJS");
			EX.include("utils/EXElement");
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX.ready" , "callback");

				var btn = document.getElementById("btn");
				var box = document.getElementById("box");
				var count = 0;

				btn.onclick = function(){
					count++;
					if(count > 3) count = 0;
					switch(count){
						case 0 :
							box.className = "default type1 type2 type3";
							break;
						case 1 :
							EXElement.removeClass(box , "type1");
							break;
						case 2 :
							EXElement.removeClass(box , "type2");
							break;
						case 3 :
							EXElement.removeClass(box , "type3");
							break;
					}
					EX.debug("box className : " , box.className);
				}
			});
		})();
		</script>

		<style type="text/css">
		#box { width:100px; height:100px; background-color:#ff0000; }
		#box.default { font-size:0.8em; font-weight:bold; color:#ffffff; background-color:#000000; }
		#box.type1 { color:#000000; }
		#box.type2 { background-color:#ff0000; }
		#box.type3 { font-size:1.2em; }
		</style>
		</head>
		<body>
		<button id="btn">addClass</button>
		<div id="box" class="default type1 type2 type3">test box</div>
		</body>
		</html>
	@param element {HTMLElement} 클래스 명을 제거할 HTMLElement 객체
	@param addName {String} 제거할 클래스명
	@return void
	 */
	exports.removeClass = function( element , removeName ){
		var tempClassName = element.className;
		var removeReg = new RegExp("\s?\\b" + removeName+"\\b");

		if(removeReg.test(tempClassName) == true){
			tempClassName = tempClassName.replace(removeReg , "");
			element.className = replaceNeedlessClassNameSyntax(tempClassName);
		}
	};

	/**
	styleProperty 에 지정된 style 명(css의 key)에 대한 value 값을 반환합니다.	
	@method getStyle
	@static
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<title></title>
		<script type="text/javascript" src="../../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.includeBegin("../../../experJS");
			EX.include("utils/EXElement");
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				var box = document.getElementById("box");
				EX.debug("getStyle background-color : " , EXElement.getStyle(box , "background-color") );
				EX.debug("getStyle border-top : " , EXElement.getStyle(box , "border-top") );
				EX.debug("getStyle border-top-width : " , EXElement.getStyle(box , "border-top-width") );
				EX.debug("getStyle border-top-color : " , EXElement.getStyle(box , "border-top-color") );
			});
		})();
		</script>

		<style type="text/css">
		#box { width:100px; height:100px; border:3px solid #000000; background-color:#ff0000; }
		</style>
		</head>
		<body>
		<div id="box" class="default">test box</div>
		</body>
		</html>
	@param element {HTMLElement} 클래스 명을 제거할 HTMLElement 객체
	@param styleProperty {String} 객체로 부터 얻어올 style 프로퍼티.(css명)
	@return {String}
	 */
	exports.getStyle = function(element , styleProperty){
		var styleValue = null;
		if(element.currentStyle){
			var tempStr = styleProperty;
			var regCase = /-/g;
			var splitStr = tempStr.split(regCase);
			var joinStr = splitStr[0];
			var len = splitStr.length;
			var separateStr = "";
			for(var i = 1 ; i < len ; i++){
				separateStr = splitStr[i];
				joinStr += separateStr.substring(0,1).toUpperCase() + separateStr.substring(1, separateStr.length);
			}
			styleValue = element.currentStyle[joinStr];
		}else{
			styleValue =document.defaultView.getComputedStyle(element , null).getPropertyValue(styleProperty);
		}
		
		return styleValue;
	};
	
	function replaceNeedlessClassNameSyntax(str){
		str = str.split(/\s+/).join(" ");
		if(/^\s.*/.test(str)) str = str.substring(1, str.length);
		if(/.*\s$/.test(str)) str = str.substring(0, str.length-1);
		return str;
	}
	
	/**
	HTMLElement 객체의 background-position을 설정합니다.
	@method setElementBackgroundPosition
	@static
	@param element {HTMLElement} background-position을 설정할 대상이 되는 객체.
	@param backgroundPosX {Number} background-position-x의 number/string value. example) 100, "100px", "100%", null
	@param backgroundPosY {Number} background-position-y의 number/string value. example) 100, "100px", "100%", null
	@return void
	 */
	exports.setBackgroundPosition = function(element, backgroundPosX, backgroundPosY) {
		var backgroundPosXParamStr = String(backgroundPosX);
		var backgroundPosYParamStr = String(backgroundPosY);
		var bgPosXValueStr;
		var bgPosYValueStr;
		var bgPosXUnitStr;
		var bgPosYUnitStr;
		var backgroundPositionArr = vw.utils.exports.getStyle(element, "background-position").split(" ");
		
		if(backgroundPosXParamStr != "null" && backgroundPosXParamStr != "undefined" && backgroundPosXParamStr != "") {
			if(backgroundPosXParamStr.indexOf("px") != -1) {
				bgPosXValueStr = backgroundPosXParamStr.split("px").join("") + "px";
				bgPosXUnitStr ="px";
			}
			if(backgroundPosXParamStr.indexOf("%") != -1) {
				bgPosXValueStr = backgroundPosXParamStr.split("%").join("") + "%";
				bgPosXUnitStr = "%";
			}
			if(!bgPosXUnitStr) bgPosXValueStr = backgroundPosXParamStr + "px";
		}else{
			bgPosXValueStr = backgroundPositionArr[0]; //don't input value
		}
		if(backgroundPosYParamStr != "null" && backgroundPosYParamStr != "undefined" && backgroundPosYParamStr != "") {
			if(backgroundPosYParamStr.indexOf("px") != -1) {
				bgPosYValueStr = backgroundPosYParamStr.split("px").join("") + "px";
				bgPosYUnitStr ="px";
			}
			if(backgroundPosYParamStr.indexOf("%") != -1) {
				bgPosYValueStr = backgroundPosYParamStr.split("%").join("") + "%";
				bgPosYUnitStr = "%";
			}
			if(!bgPosYUnitStr) bgPosYValueStr = backgroundPosYParamStr + "px";
		}else{
			bgPosYValueStr = backgroundPositionArr[1]; //don't input value
		}
		element.style.backgroundPosition = String(bgPosXValueStr + " " + bgPosYValueStr);
	};
	
	
	/**
	HTMLElement 객체 자신을 부모로 부터 제거합니다.
	@method removeMe
	@static
	@param element {HTMLElement} removeChild시킬 대상이 되는 객체.
	@return void
	*/ 
	exports.removeMe = function(element){
		if(element.parentNode) element.parentNode.removeChild(element);
	};
	
	/**
	HTMLElement 객체가 포함하는 모든 HTMLElement를 removeChild합니다.
	@method removeAllChildren
	@static
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<title></title>
		<script type="text/javascript" src="../../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.includeBegin("../../../experJS");
			EX.include("utils/EXElement");
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				var wrapper = document.getElementById("wrapper");
				var box = document.getElementById("box");
				EXElement.removeAllChildren(wrapper);
			});
		})();
		</script>

		<style type="text/css">
		#box { width:100px; height:100px; border:3px solid #000000; background-color:#ff0000; }
		</style>
		</head>
		<body>
		<div id="wrapper" style="padding:20px; background-color:#eeeeee;">
			<div id="box" class="default">test box</div>
			<div id="box" class="default">test box</div>
			<div id="box" class="default">test box</div>
			<div id="box" class="default">test box</div>
			<div id="box" class="default">test box</div>
		</div>
		</body>
		</html>
	@param element {HTMLElement} child HTMLElement를 removeChild시킬 대상이 되는 객체.
	@return {void}
	*/
	exports.removeAllChildren = function(element) {
		while(element.firstChild) element.removeChild(element.firstChild);
	};
	
	/**
	HTMLElement 객체의 모든 parentNode를 배열에 담아 반환합니다.
	@method getParentNodes
	@static
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<title></title>
		<script type="text/javascript" src="../../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.includeBegin("../../../experJS");
			EX.include("utils/EXElement");
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				var box = document.getElementById("box");
				EX.debug(EXElement.getParentNodes(box));
			});
		})();
		</script>

		<style type="text/css">
		#box { width:100px; height:100px; border:3px solid #000000; background-color:#ff0000; }
		</style>
		</head>
		<body>
		<div id="wrapper" style="padding:20px; background-color:#eeeeee;">
			<div id="wp1">
				<div id="wp2">
					<div id="wp3">
						<div id="box" class="default">test box</div>
					</div>
				</div>
			</div>
		</div>
		</body>
		</html>
	@param element {HTMLElement} parent node가 존재하는 객체
	@return {Array}
	*/
	exports.getParentNodes = function(element) {
		var parentNodeArr = [];
		accumulateParentNode(element);
		return parentNodeArr;
		
		function accumulateParentNode(element) {
			if(element.parentNode) {
				parentNodeArr.push(element.parentNode);
				accumulateParentNode(element.parentNode);
			}
		}
	};
	
	/**
	HTMLElement 객체의 document Global X 좌표를 반환합니다.
	@method getElementGlobalPositionX
	@static
	@param element {HTMLElement} 대상 객체
	@return {Number}
	*/
	exports.getElementGlobalPositionX = function(element) {
		var positionX = 0;
		while(element.offsetParent) {
			positionX += element.offsetLeft;
			element = element.offsetParent;
		}
		return positionX;
	};
	
	/**
	HTMLElement 객체의 document Global Y 좌표를 반환합니다.
	@method getElementGlobalPositionY
	@static
	@param element {HTMLElement} 대상 객체
	@return {Number}
	*/
	exports.getElementGlobalPositionY = function(element) {
		var positionY = 0;
		while(element.offsetParent) {
			positionY += element.offsetTop;
			element = element.offsetParent;
		}
		return positionY;
	};
	
	/**
	HTMLElement 객체의 parentNode 내부에서의 x 좌표를 반환합니다.(Javascript나 CSS로 style을 지정하지 않은 element의 x 위치를 얻어야 할 경우, 사용합니다.)
	@method getElementOffsetLeft
	@static
	@param element {HTMLElement} 대상 객체
	@return {Number}
	*/
	exports.getElementOffsetLeft = function(element) {
		return element.parentNode == element.offsetParent ? element.offsetLeft : exports.getElementGlobalPositionX(element) - exports.getElementGlobalPositionX(element.parentNode);
	};
	
	/**
	HTMLElement 객체의 parentNode 내부에서의 y 좌표를 반환합니다.(Javascript나 CSS로 style을 지정하지 않은 element의 y 위치를 얻어야 할 경우, 사용합니다.)
	@method getElementOffsetTop
	@static
	@param element {HTMLElement} 대상 객체
	@return {Number}
	*/
	exports.getElementOffsetTop = function(element) {
		return element.parentNode == element.offsetParent ? element.offsetTop : exports.getElementGlobalPositionY(element) - exports.getElementGlobalPositionY(element.parentNode);
	};

	/**
	파라미터로 주어진 html 코드의 최상위 HTMLElement 의 offset 사이즈 값을 반환합니다.
	@method getLoadedHtmlOffset
	@static
	@param loadedHTML {String} HTML Syntax. 해당 HTML 코드의 최상위 객체의 offset 사이즈를 반환합니다.
	@return {Object} { width: loadedHTML 가로사이즈 , height: loadedHTML 세로사이즈 }
	*/
	exports.getLoadedHtmlOffset = function(loadedHTML){
		var loadedWrapper = document.createElement("div");
		loadedWrapper.innerHTML = loadedHTML;
		loadedWrapper.style.position = "absolute";
		loadedWrapper.style.left = "-9999px";
		document.body.appendChild(loadedWrapper);
		var offsetW = loadedWrapper.offsetWidth;
		var offsetH = loadedWrapper.offsetHeight;
		document.body.removeChild(loadedWrapper);
		return { width : offsetW , height : offsetH };
	};
});