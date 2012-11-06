define(function(require , exports){

	/**
	@class EXBrowser
	@static
	*/
	var SCROLL_TARGET = null;
	var USER_AGENT = navigator.userAgent;

	var returnValueExtendType = function(ext){
		return (ext != undefined) ? ext : 0;
	};

	/**
	해당 Browser 가 microsoft 의 Internet Explorer 계열인지 확인합니다.
	@property isIE
	@type boolean
	*/
	exports.isIE = (function() {  return /MSIE/.test(USER_AGENT); })();
		
	/**
	해당 Browser 가 microsoft 의 Internet Explorer(이하 IE) 계열일 경우 version 의 숫자를 반환합니다.
	<br/>(IE 계열이 아닐 경우 -1 을 반환합니다.)
	@property ieVersion
	@type integer
	*/
	exports.ieVersion  = (function(){
		var ieVer = -1;
		var ua = USER_AGENT;
		var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null) ieVer = parseFloat( RegExp.$1 );
		return ieVer;
	})();
		
	/**
	해당 Browser 가 microsoft 의 Internet Explorer 6 인지 확인합니다.
	@property isIE6
	@type boolean
	*/
	exports.isIE6 = (function() { 
		if(/MSIE 8/.test(USER_AGENT) == true) return false;
		if(/MSIE 7/.test(USER_AGENT) == true) return false; 
		return /MSIE 6/.test(USER_AGENT); 
	})();
		
	/**
	해당 Browser 가 microsoft 의 Internet Explorer 7 인지 확인합니다.
	@property isIE7
	@type boolean
	*/
	exports.isIE7 = (function() { return /MSIE 7/.test(USER_AGENT); })();
		
	/**
	해당 Browser 가 microsoft 의 Internet Explorer 8 인지 확인합니다.
	@property isIE8
	@type boolean
	*/
	exports.isIE8 = (function() { return /MSIE 8/.test(USER_AGENT); })();
	
	/**
	해당 Browser 가 microsoft 의 Internet Explorer 9 인지 확인합니다.
	@property isIE9
	@type boolean
	*/
	exports.isIE9 = (function() { return /MSIE 9/.test(USER_AGENT); })();

	/**
	해당 Browser 가 FireFox 인지 확인합니다.
	@property isFireFox
	@type boolean
	*/
	exports.isFireFox = (function() { return /Firefox/.test(USER_AGENT); })();
	
	/**
	해당 Browser 가 Safari 인지 확인합니다.
	@property isSafari
	@type boolean
	*/
	exports.isSafari = (function() { var agent = USER_AGENT;var isWebkit = /Apple.*Safari/.test(agent); if(/.*Chrome.*/.test(agent)){ isWebkit = false; } return isWebkit; })();
	
	/**
	해당 Browser 가 Opera 인지 확인합니다.
	@property isOpera
	@type boolean
	*/
	exports.isOpera = (function() { return /Opera/.test(USER_AGENT); })();
	
	/**
	해당 Browser 가 Chrome 인지 확인합니다.
	@property isChrome
	@type boolean
	*/
	exports.isChrome = (function() {  return /Chrome/.test(USER_AGENT); })();
	
	/**
	해당 Browser 가 Mobile Safari 인지 확인합니다.
	@property isMobileSafari
	@type boolean
	*/
	exports.isMobileSafari = (function() { return /Apple.*Mobile.*Safari/.test(USER_AGENT); })();
	
	/**
	해당 Browser 가 Android 인지 확인합니다.
	@property isAndroid
	@type boolean
	*/
	exports.isAndroid = (function() { return /.*Android.*/.test(USER_AGENT); })();
	
	/**
	해당 Browser 가 Mobile 인지 확인합니다.
	@property isMobile
	@type boolean
	*/
	exports.isMobile = (function() { return /.*Mobile.*/.test(USER_AGENT); })();
	
	/**
	해당 Browser 가 Apple 사의 iPad 인지 확인합니다.
	@property isIPad
	@type boolean
	*/
	exports.isIPad = (function() { return /.*iPad.*/.test(USER_AGENT); })();
	
	/**
	해당 Browser 가 Apple 사의 iPhone 인지 확인합니다.
	@property isIPhone
	@type boolean
	*/
	exports.isIPhone = (function() { return /.*iPhone.*/.test(USER_AGENT); })();
	
	/**
	해당 Browser 가 Apple 사의 iPod 인지 확인합니다.
	@property isIPod
	@type boolean
	*/
	exports.isIPod = (function() { return /.*iPod.*/.test(USER_AGENT); })();
		
	/**
	해당 통신 프로토콜이 secure socket 인지 확인합니다.
	@property isHTTPS
	@type boolean
	*/
	exports.isHTTPS = (function() { return window.location.href.toLowerCase().indexOf('https') === 0; })();

	/**
	window screenTop 의 값을 반환합니다.(브라우져의 y 좌표)
	@method screenTop
	@static
	@param [ext=""] {String} 반환될 값에 지정된 타입을 붙여 반환합니다. 예를 들어 반환값이 1024 일 때 "px" 이라는 문자열을 보낼경우 반환값은 1024 가 아닌 "1024px" 로 반환합니다.
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
			EX.include("utils/EXBrowser");
			EX.includeEnd();

			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				EX.debug("screenTop : ", EXBrowser.screenTop());
				EX.debug("screenTop : ", EXBrowser.screenTop("px"));
			});
		})();
		</script>
		</head>
		<body>
		</body>
		</html>
	@return {Number || String}
	*/
	exports.screenTop = function(ext){
		var scY = 0;
		if(window.screenTop){
			scY = window.screenTop;
		}else if(window.screenY){
			scY = window.screenY;
		}
		return scY + returnValueExtendType(ext);
	};

	/**
	window screenLeft 의 값을 반환합니다.(브라우져의 x 좌표)
	@method screenLeft
	@static
	@param [ext=""] {String} 반환될 값에 지정된 타입을 붙여 반환합니다. 예를 들어 반환값이 1024 일 때 "px" 이라는 문자열을 보낼경우 반환값은 1024 가 아닌 "1024px" 로 반환합니다.
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
			EX.include("utils/EXBrowser");
			EX.includeEnd();

			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				EX.debug("screenLeft : ", EXBrowser.screenLeft());
				EX.debug("screenLeft : ", EXBrowser.screenLeft("px"));
			});
		})();
		</script>
		</head>
		<body>
		</body>
		</html>
	@return {Number || String}
	*/
	exports.screenLeft = function(ext){
		var scX = 0;
		if(window.screenLeft){
			scX = window.screenLeft;
		}else if(window.screenX){
			scX = window.screenX;
		}
		return scX + returnValueExtendType(ext);
	};


	/**
	문서의 scroll 된 top 위치값을 반환합니다.
	@method scrollTop
	@static
	@param [ext=""] {String} 반환될 값에 지정된 타입을 붙여 반환합니다. 예를 들어 반환값이 1024 일 때 "px" 이라는 문자열을 보낼경우 반환값은 1024 가 아닌 "1024px" 로 반환합니다.
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
			EX.include("utils/EXBrowser");
			EX.includeEnd();

			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				EX.debug("scrollTop : ", EXBrowser.scrollTop());
				EX.debug("scrollTop : ", EXBrowser.scrollTop("px"));
			});
		})();
		</script>
		</head>
		<body>
		</body>
		</html>
	@retrun {Number || String}
	*/
	exports.scrollTop = function(ext){
		return SCROLL_TARGET.scrollTop + returnValueExtendType(ext);
	};
	
	/**
	문서의 scroll 된 left 위치값을 반환합니다.
	@method scrollLeft
	@static
	@param [ext=""] {String} 반환될 값에 지정된 타입을 붙여 반환합니다. 예를 들어 반환값이 1024 일 때 "px" 이라는 문자열을 보낼경우 반환값은 1024 가 아닌 "1024px" 로 반환합니다.
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
			EX.include("utils/EXBrowser");
			EX.includeEnd();

			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				EX.debug("scrollLeft : ", EXBrowser.scrollLeft());
				EX.debug("scrollLeft : ", EXBrowser.scrollLeft("px"));
			});
		})();
		</script>
		</head>
		<body>
		</body>
		</html>
	@retrun {Number || String}
	*/
	exports.scrollLeft = function(ext){
		return SCROLL_TARGET.scrollLeft + returnValueExtendType(ext);
	};
	

	/**
	문서의 width size를 반환합니다.
	@method scrollWidth
	@static
	@param [ext=""] {String} 반환될 값에 지정된 타입을 붙여 반환합니다. 예를 들어 반환값이 1024 일 때 "px" 이라는 문자열을 보낼경우 반환값은 1024 가 아닌 "1024px" 로 반환합니다.
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title></title>
		<script type="text/javascript" src="../../experJS/experJS.js"></script>
		<script type="text/javascript">
			EX.includeBegin("../../experJS");
			EX.include("utils/exports");
			EX.includeEnd();

			EX.ready(function(){
				EX.debug("scrollWidth :" , exports.scrollWidth());
				EX.debug("scrollWidth :" , exports.scrollWidth("px"));
			});
		</script>
		</head>
		<body>
		<div style="width:2000px; height:3000px;"></div>
		</body>
		</html>
	@return {Number || String}
	*/
	exports.scrollWidth = function(ext){
		return SCROLL_TARGET.scrollWidth + returnValueExtendType(ext);
	}

	/**
	문서의 height size를 반환합니다.
	@method scrollHeight
	@static
	@param [ext=""] {String} 반환될 값에 지정된 타입을 붙여 반환합니다. 예를 들어 반환값이 1024 일 때 "px" 이라는 문자열을 보낼경우 반환값은 1024 가 아닌 "1024px" 로 반환합니다.
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
			EX.include("utils/EXBrowser");
			EX.includeEnd();

			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				EX.debug("scrollHeight : ", EXBrowser.scrollHeight());
				EX.debug("scrollHeight : ", EXBrowser.scrollHeight("px"));
			});
		})();
		</script>

		</head>
		<body>
		</body>
		</html>
	@retrun {Number || String}
	*/
	exports.scrollHeight = function(ext){
		return SCROLL_TARGET.scrollHeight + returnValueExtendType(ext);
	};

	/**
	문서의 screenWidth 의 값을 반환합니다.
	@method screenWidth
	@static
	@param [ext=""] {String} 반환될 값에 지정된 타입을 붙여 반환합니다. 예를 들어 반환값이 1024 일 때 "px" 이라는 문자열을 보낼경우 반환값은 1024 가 아닌 "1024px" 로 반환합니다.
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
			EX.include("utils/EXBrowser");
			EX.includeEnd();

			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				EX.debug("screenWidth : ", EXBrowser.screenWidth());
				EX.debug("screenWidth : ", EXBrowser.screenWidth("px"));
				EX.debug("scrollWidth : ", EXBrowser.scrollWidth());
				EX.debug("scrollWidth : ", EXBrowser.scrollWidth("px"));
			});
		})();
		</script>
		</head>
		<body>
		<div style="width:3000px; height:3000px; background-color:#ffff00;"></div>
		</body>
		</html>
	@return {Number || String}
	*/
	exports.screenWidth = function(ext){
		var scW = 0;
		if(window.innerWidth){
			scW = window.innerWidth;
		}else if(document.documentElement && document.documentElement.clientWidth){
			scW = document.documentElement.clientWidth;
		}
		return scW + returnValueExtendType(ext);
	};

	/**
	문서의 screenHeight 의 값을 반환합니다.
	@method screenHeight
	@static
	@param [ext=""] {String} 반환될 값에 지정된 타입을 붙여 반환합니다. 예를 들어 반환값이 1024 일 때 "px" 이라는 문자열을 보낼경우 반환값은 1024 가 아닌 "1024px" 로 반환합니다.
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
			EX.include("utils/EXBrowser");
			EX.includeEnd();

			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				EX.debug("screenHeight : ", EXBrowser.screenHeight());
				EX.debug("screenHeight : ", EXBrowser.screenHeight("px"));
				EX.debug("scrollHeight : ", EXBrowser.scrollHeight());
				EX.debug("scrollHeight : ", EXBrowser.scrollHeight("px"));
			});
		})();
		</script>
		</head>
		<body>
		<div style="width:3000px; height:3000px; background-color:#ffff00;"></div>
		</body>
		</html>
	@return {Number || String}
	*/
	exports.screenHeight = function(ext){
		var scH = 0;
		if(window.innerHeight){
			scH = window.innerHeight;
		}else if(document.documentElement && document.documentElement.clientHeight){
			scH = document.documentElement.clientHeight;
		}
		return scH + returnValueExtendType(ext);
	};

	/**
	HTML 문서 자체의 스크롤 핸들링을 담당하고 있는 객체를 반환합니다.
	@method getScrollTarget
	@static
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<script type="text/javascript" src="../../vw/utils/VWUtils_1.0.0.js"></script>
		<style type="text/css">
		.box {}
		.box li { margin:10px; height:500px; background-color:#cccccc; }
		</style>
		</head>
		<body>
		<div class="box">
			<ul>
			<li>1</li>
			<li>2</li>
			<li>3</li>
			</ul>
		</div>
		</body>
		<script type="text/javascript">
		(function(){
			var scrollTarget = exports.getScrollTarget();
			var cnt = 0;
			var interval = setInterval(function(){
				scrollTarget.scrollTop = cnt;
				cnt += 5;
				if(cnt >= 200) clearInterval(interval);
			} , 10);
			
		})();
		</script>
		</html>
	@return {Document || HTMLElement}
	*/
	exports.getScrollTarget = function(){
		var scrollTarget = null;
		if(exports.isFireFox == true || exports.isIE == true){
			scrollTarget = document.documentElement;
		}else{
			scrollTarget = document.body;
		}
		return scrollTarget;
	};

	/**
	해당 문서의 최상위 Document 를 반환합니다.
	@method getSuperDocument
	@static
	@return {Document}
	*/
	exports.getSuperDocument = function(){
		return reflexiveSearchParent(window).document;
	};
	function reflexiveSearchParent(target){
		if(target.document != target.parent.document) target = reflexiveSearchParent(target.parent);
		return target;
	}

	/**
	문서의 drag, select (반전)기능을 제어합니다.
	@method setDragSelectAble
	@static
	@param able {boolean} false 일 경우 dragstart,selectstart,userSelect 등을 block 합니다. 브라우져 기본 상태는 true 로 set 할때와 같다.
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
			EX.include("utils/EXBrowser");
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				var btn = document.getElementById("btn");
				var toggle = false;
				btn.onclick = function(){
					EXBrowser.setDragSelectAble(toggle);
					toggle = !toggle;
				};
			});
		})();
		</script>
		</head>
		<body>
		<button id="btn">set drag&select toggle</button>
		<div>
			<br/>drag drag drag drag drag
			<br/>drag drag drag drag drag
			<br/>drag drag drag drag drag
		</div>
		</body>
		</html>
	@return {Document}
	*/
	exports.setDragSelectAble = function(able){
		if(able == false){
			document.ondragstart = function(){ return false; };
			document.onselectstart  = function(){ return false; };
			if(document.body.style.MozUserSelect != undefined ) document.body.style.MozUserSelect = "none";
		}else if(able == true){
			document.ondragstart = null;
			document.onselectstart  = null;
			if(document.body.style.MozUserSelect != undefined ) document.body.style.MozUserSelect = "auto";
		}
	};

	/**
	해당 페이지의 URL 을 반환합니다.
	@method getLocation
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
			EX.include("utils/EXBrowser");
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				EX.debug("getLocation :" , EXBrowser.getLocation());
				EX.debug("getLocation :" , EXBrowser.getLocation(false));
			});
		})();
		</script>
		</head>
		<body>
		</body>
		</html>
	@return {String}
	*/
	exports.getLocation = function(absolute){
		var path;
		if(absolute == false){
			path = unescape(document.location.pathname);
		}else{
			path = unescape(document.location.href);
		}
		return path;
	};

	/**
	해당 페이지의 GET 형태의 parameter 를 반환합니다. URL 을 이용한 파싱이기 때문에 GET 방식외 전달 방식은 반환되지 않습니다.
	@method getLocationParams
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
			EX.include("utils/EXBrowser");
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				var params = EXBrowser.getLocationParams();
				var key = null;
				for( key in params ){
					EX.debug("getLocationParams " , key+" :" , params[key] );
				}
			});
		})();
		</script>
		</head>
		<body>
			<button onclick="window.location=window.location+'?a=1&b=2&c=3'">test</button>
		</body>
		</html>
	@return {Object}
	*/
	exports.getLocationParams = function(){
		var loc = unescape(document.location.href);
		var searchIndex = loc.indexOf("?");
		var queryObject = {};
		if(searchIndex == -1){
			queryObject = null;
		}else{
			var querys = loc.slice(searchIndex+1 , document.location.length).split("&");
			var param = [];
			var len = querys.length;
			var i = 0;
			for(i = 0 ; i < len ; i++){
				param = querys[i].split("=");
				queryObject[param[0]] = param[1];
			}
		}
		return queryObject;
	};

	/**
	해당 페이지의 URL 중 anchor(#) 값을 추출해 반환합니다.
	@method getLocationAnchor
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
			EX.include("utils/EXBrowser");
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				var anchor = EXBrowser.getLocationAnchor();
				EX.debug("getLocationAnchor : ", anchor);

			});
		})();
		</script>
		</head>
		<body>
			<button onclick="window.location.replace(window.location+'#abc'); window.location.reload(true)">test</button>
		</body>
		</html>
	@return {String}
	*/
	exports.getLocationAnchor = function(){
		var loc = unescape(document.location.href);
		var anchorSplit = loc.indexOf("#");
		if(anchorSplit == -1) return;
		return loc.substring(anchorSplit+1 , loc.length);
	};

	/**
	해당 페이지 URL 의 anchor(#)를 바꿉니다.
	@method switchLocationAnchor
	@static
	@param switchAnchor {String} 기존 URL 에서 바꾸거나 적용할 anchor(문자열).
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
			EX.include("utils/EXBrowser");
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				EXBrowser.switchLocationAnchor("experjs");
			});
		})();
		</script>
		</head>
		<body>
		</body>
		</html>
	@return {void}
	*/
	exports.switchLocationAnchor = function(switchAnchor){
		var loc = unescape(document.location.href);
		var anchorSplit = loc.indexOf("#");
		if(anchorSplit == -1) anchorSplit = loc.length;
		var anchorBefore = loc.substring(0 , anchorSplit);
		document.location.href = anchorBefore + "#" +switchAnchor;
	};

	/**
	parameter fileURLStr 을 문자열로 전달받고, 해당 문자열의 파일 확장자를 반환합니다.
	@method getFileExtension
	@static
	@param fileURLStr {String} 파일 확장자를 추출할 대상이 되는 문자열.
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
			EX.include("utils/EXBrowser");
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				EX.debug( EXBrowser.getFileExtension(EXBrowser.getLocation()) );
			});
		})();
		</script>
		</head>
		<body>
		</body>
		</html>
	@return {void}
	*/
	exports.getFileExtension = function(fileURLStr) {
		var searchStr = fileURLStr.indexOf("?") > -1 ? fileURLStr.substring(0, fileURLStr.indexOf("?")) : fileURLStr;
		var finalPartStr = searchStr.substring(searchStr.lastIndexOf("/"));
		var fileExtensionStr = finalPartStr.substring(finalPartStr.lastIndexOf(".") + 1).toLowerCase();
		return fileExtensionStr;
	};
	
	SCROLL_TARGET = exports.getScrollTarget();
});