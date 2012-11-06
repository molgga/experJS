define(function(require , exports){
	var EXLoader = require("./EXLoader");
	/**
	(EXLoader를 상속 받습니다.)
	<br/>XML, TEXT 데이터를 load 할 수 있는 객체입니다.
	@class EXTextLoader
	@constructor
	@param [method="GET"] {String} HTTP Request 를 지정합니다.
	@param [asynchronous=true] {boolean} 비동기(true), 동기(false) 통신 방식을 지정합니다.
	@extends Loader
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<title></title>
		<link rel="stylesheet" type="text/css" href=""/>
		<script type="text/javascript" src="../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.includeBegin("../../experJS");
			EX.include("events/EXEventListener");
			EX.include("net/EXLoader");
			EX.include("net/EXTextLoader");
			EX.include("transitions/EXTween");
			EX.include("transitions/EXEasing");
			EX.include("utils/EXElement");
			EX.includeEnd();

			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				var _loaderTester = null;
				_loaderTester = new LoaderTester();
				_loaderTester.init();

				function LoaderTester(){
					var _this = this;
					var _textLoader = null;
					_this.init = function(){
						loaderInitialize();
					};
					_this.destroy = function(){
					};
					function loaderInitialize(){
						loaderDestroy();
						_textLoader = new EXTextLoader();
						_textLoader.init();
						EXEventListener.add( _textLoader , EXLoader.EVENT_START , loaderHandler );
						EXEventListener.add( _textLoader , EXLoader.EVENT_PROGRESS , loaderHandler );
						EXEventListener.add( _textLoader , EXLoader.EVENT_COMPLETE , loaderHandler  );
						EXEventListener.add( _textLoader , EXLoader.EVENT_COMPLETE_ALL , loaderHandler );
						EXEventListener.add( _textLoader , EXLoader.EVENT_ERROR , loaderHandler );
						_textLoader.addURL("../../data/html/div1.html" , "div1");
						_textLoader.load();
					}
					function loaderHandler(evt){
						EX.debug("loaderHandler" , evt.type);
						switch(evt.type){
							case EXLoader.EVENT_START :
								break;
							case EXLoader.EVENT_PROGRESS :
								break;
							case EXLoader.EVENT_COMPLETE :
								break;
							case EXLoader.EVENT_COMPLETE_ALL :
								var loadedHTML = evt.dataObject.div1;
								var offset = EXElement.getLoadedHtmlOffset(loadedHTML);
								var box1 = document.getElementById("box1");
								box1.innerHTML = loadedHTML;
								EXTween.to( box1 , 1 , { width: offset.width , height: offset.height , ease:EXEasing.easeOutQuart });

								var sampleIframe = document.getElementById("sampleIframe");
								sampleIframe.style.border = "1px solid #ff0000";
								sampleIframe.onload = function(){
									console.log(sampleIframe.offsetWidth);
									console.log(sampleIframe.offsetHeight);
									var child = sampleIframe.contentWindow.document.body.children[0];
									console.log(child.offsetWidth);
									console.log(child.offsetHeight);
								}
								sampleIframe.src = "../../index.html";
								break;
							case EXLoader.EVENT_ERROR :
								break;
						}
					}
					function loaderDestroy(){
					}
				}
			});
		})();
		</script>

		</head>
		<body>
		<div id="box1" style="width:0px; height:0px; overflow:hidden;">
		</div>
		<iframe id="sampleIframe" src="" style="padding:0; margin:0; border:none"></iframe>
		</body>
		</html>
	*/
	var EXTextLoader = function(method , asynchronous){
		var _loader = this;
		_loader.setMethod(method);
		_loader.setAsynchronous(asynchronous);
		_loader.header["Content-type"] = "text/plain";
		_loader.mimeType = "text/plain";
	};
	EXTextLoader.prototype = new EXLoader();
	EXTextLoader.prototype.constructor = EXTextLoader;

	/**
	<strong>override</strong>
	@method stateComplete
	@return {void}
	*/
	EXTextLoader.prototype.stateComplete = function(){
		var urlData = this._addURLData[this._loadCnt];
		this._responseData[urlData.id] = this._urlRequest.responseText;
	};
	return EXTextLoader;
});