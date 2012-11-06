define(function(require, exports){
	var EXLoader				= require("../net/EXLoader");
	var EXTextLoader			= require("../net/EXTextLoader");
	var EXElement				= require("../utils/EXElement");
	var EXBrowser				= require("../utils/EXBrowser");
	var EXCustomEvent		= require("../events/EXCustomEvent");
	var EXTween				= require("../transitions/EXTween");
	var EXEasing				= require("../transitions/EXEasing");
	var CssQuery				= require("../vender/CssQuery");
	var EXScrollView			= require("../ui/EXScrollView");
	
	var DOM_WINDOW = window;
	var DOM_DOCUMENT = document;
	var DOM_BODY = document.body;
	
	var DOM_LAYER_BODY = null;
	var DOM_LAYER_BODY_OPENER = null;
	var DOM_LAYER_BODY_REMOVER= null;

	var OpenType = {
		LAYER : 1
		, IFRAME : 2
		, AJAX : 3
	};

	var SizeType = {
		FULL : 1
		, CENTER : 2
	};

	var ClassID = {
	};

	var Model = {};
	Model.getOpenType = function(openTypeString){
		var getType = 0;
		switch(openTypeString){
			case "LAYER" :
				getType = 1;
				break;
			case "IFRAME" :
				getType = 2;
				break;
			case "AJAX" :
				getType = 3;
				break;
		}
		return getType;
	};


	var _screenWidth = 0;
	var _screenHeight = 0;
	
	exports.hashLayerPopup = {};
	exports.hashLayerPopupCount = 0;
	exports.init = function(){

		DOM_LAYER_BODY = document.createElement("div");
		DOM_LAYER_BODY_OPENER = document.createElement("div");
		DOM_LAYER_BODY_REMOVER = document.createElement("div");

		DOM_LAYER_BODY.className = "";
		DOM_LAYER_BODY_OPENER.className = "";
		DOM_LAYER_BODY_REMOVER.className = "";

		DOM_LAYER_BODY_REMOVER.style.display = "none";
		DOM_LAYER_BODY_REMOVER.style.width = "0px";
		DOM_LAYER_BODY_REMOVER.style.height = "0px";
		DOM_LAYER_BODY_REMOVER.style.overflow = "hidden";

		DOM_LAYER_BODY.appendChild(DOM_LAYER_BODY_REMOVER);
		DOM_LAYER_BODY.appendChild(DOM_LAYER_BODY_OPENER);
		DOM_BODY.appendChild(DOM_LAYER_BODY);

		EXEventListener.add( window , "resize" , exports.resizeHandler );
		EXEventListener.add( exports , "closeEventTest" , exports.close );
		exports.resizeHandler();
	};

	exports.open = function(openType , targetString , optionData){
		var layerPopup = new exports.LayerPopup();
		layerPopup.init( openType , optionData);
		layerPopup.open( targetString );

		DOM_LAYER_BODY_OPENER.appendChild( layerPopup.getLayer() );
		
		layerPopup.setHashIndex(exports.hashLayerPopupCount);
		exports.hashLayerPopup[exports.hashLayerPopupCount] = layerPopup;
		exports.hashLayerPopupCount += 1;
	};

	exports.close = function(evt){
		var layerPopup = evt.dataObject.layerPopup;
		var layer = layerPopup.getLayer();
		//AJAX 타입 = 삭제. 디스트로이
		//IFRAME 타입 = 삭제. 디스트로이
		//LAYER 타입 = 리무브 컨테이너에 담고 삭제, 디스트로이 달라야함.
		DOM_LAYER_BODY_OPENER.removeChild( layer );
		switch(layerPopup.openType){
			case OpenType.LAYER :
				DOM_LAYER_BODY_REMOVER.appendChild( layer );
				break;
			case OpenType.IFRAME :

				break;
			case OpenType.AJAX :
				break;
		}
		var hashIndex = layerPopup.getHashIndex();
		delete exports.hashLayerPopup[hashIndex];
		layerPopup.close();
	};

	exports.closeAll = function(){
	};

	exports.resizeHandler = function(evt){
		_screenWidth = EXBrowser.screenWidth();
		_screenHeight = EXBrowser.screenHeight();

		var hashData = exports.hashLayerPopup;
		var hash = null;
		var layerPopup = null;
		for(hash in hashData){
			layerPopup = hashData[hash];
			layerPopup.resizeHandler(_screenWidth , _screenHeight);
		}
	};

	exports.destroy = function(){
	};

	exports.LayerPopup = function(){
		var _this = this;
		var _initOptionWidth = 0;
		var _initOptionHeight = 0;
		var _optionDataWidth = 0;
		var _optionDataHeight = 0;
		var _textLoader = null;
		var _iframeContent = null;

		var _hashIndex = -1;

		_this.DOM_LAYER = null;
		_this.DOM_DIM = null;
		_this.DOM_CONTAINER = null;
		_this.DOM_CONTENT = null;
		_this.DOM_CLOSE_BTN = null;
		_this.DOM_PROGRESS = null;

		_this.scrollView = null;

		_this.sizeType = 0;
		_this.openType = 0;
		_this.isOpen = false;

		_this.isOpenComplete = false;

		_this.init = function( openType , optionData ){
			_this.openType = Model.getOpenType( openType );
			_optionDataWidth = optionData.width;
			_optionDataHeight = optionData.height;
			_initOptionWidth = _optionDataWidth;
			_initOptionHeight = _optionDataHeight;

			_this.DOM_LAYER = document.createElement("div");
			_this.DOM_DIM = document.createElement("div");
			_this.DOM_CONTAINER = document.createElement("div");
			_this.DOM_CONTENT = document.createElement("div");
			_this.DOM_CLOSE_BTN = document.createElement("div");
			_this.DOM_PROGRESS = document.createElement("div");

			_this.DOM_LAYER.style.position = "absolute";
			_this.DOM_LAYER.style.top = 0;
			_this.DOM_LAYER.style.left = 0;
			_this.DOM_LAYER.style.width = "100%";
			_this.DOM_LAYER.style.height = EXBrowser.scrollHeight("px");

			_this.DOM_DIM.style.position = "absolute";
			_this.DOM_DIM.style.top = 0;
			_this.DOM_DIM.style.left = 0;
			_this.DOM_DIM.style.width = "100%";
			_this.DOM_DIM.style.height = "100%";
			_this.DOM_DIM.style.backgroundColor = "#000000";
			//_this.DOM_DIM.style.opacity = 0.5;

			_this.DOM_PROGRESS.style.position = "absolute";
			_this.DOM_PROGRESS.style.top = "50%";
			_this.DOM_PROGRESS.style.left = "50%";
			_this.DOM_PROGRESS.style.margin = "-25px 0 0 -25px";
			_this.DOM_PROGRESS.style.width = "50px";
			_this.DOM_PROGRESS.style.height = "50px";
			_this.DOM_PROGRESS.style.backgroundColor = "#222222";
			_this.DOM_PROGRESS.style.borderRadius = "10px";

			_this.DOM_CONTAINER.style.position = "absolute";
			_this.DOM_CONTAINER.style.top = 0;
			_this.DOM_CONTAINER.style.left = 0;
			_this.DOM_CONTAINER.style.width = _optionDataWidth+"px";
			_this.DOM_CONTAINER.style.height = _optionDataHeight+"px";
			_this.DOM_CONTAINER.style.overflow = "hidden";

			_this.DOM_CLOSE_BTN.style.position = "fixed";
			_this.DOM_CLOSE_BTN.style.top = 0;
			_this.DOM_CLOSE_BTN.style.right = 0;
			_this.DOM_CLOSE_BTN.style.width = "50px";
			_this.DOM_CLOSE_BTN.style.height = "50px";
			_this.DOM_CLOSE_BTN.style.backgroundColor = "#000000";
			_this.DOM_CLOSE_BTN.style.visibility = "hidden";

			//_this.DOM_CONTENT.style.width = "100%";
			//_this.DOM_CONTENT.style.height = "100%";
			_this.DOM_CONTENT.style.visibility = "hidden";

			_this.DOM_CONTAINER.appendChild(_this.DOM_CONTENT);
			_this.DOM_CONTAINER.appendChild(_this.DOM_PROGRESS);
			_this.DOM_CONTAINER.appendChild(_this.DOM_CLOSE_BTN);
			_this.DOM_LAYER.appendChild( _this.DOM_DIM );
			_this.DOM_LAYER.appendChild( _this.DOM_CONTAINER );

			EXTween.to( _this.DOM_DIM , 0 , { opacity:0.5 });

			_this.resizeHandler( EXBrowser.screenWidth() , EXBrowser.screenHeight() , 0);
		};
		_this.open = function(targetString){
			EX.debug("LayerPopup.open" , targetString);
			switch(_this.openType){
				case OpenType.AJAX :
					_this.initTextLoader(targetString);
					break;
				case OpenType.IFRAME :
					_this.initIframeLoader(targetString);
					break;
				case OpenType.LAYER :
					_this.initLayerLoader(targetString);
					break;
			}
			EXEventListener.add( _this.DOM_CLOSE_BTN , "click" , _this.closeButtonHandler );
		};

		_this.openComplete = function(delayed){
			EXTween.delayedCall(delayed , function(){
				switch(_this.openType){
					case OpenType.AJAX :
						_this.DOM_CONTAINER.style.overflowY = "hidden";
						break;
					case OpenType.IFRAME :
						_this.DOM_CONTAINER.style.overflow = "hidden";
						break;
					case OpenType.LAYER :
						_this.DOM_CONTAINER.style.overflowY = "hidden";
						break;
				}

				_this.DOM_CONTAINER.style.backgroundColor = "#ffffff";
				
				EXTween.to( _this.DOM_PROGRESS , 0.3 , { autoOpacity:0 });

				EXTween.to( _this.DOM_CLOSE_BTN , 0 , { autoOpacity:0 });
				EXTween.to( _this.DOM_CLOSE_BTN , 0.3 , { delay:0.6 , autoOpacity:1 });

				EXTween.to( _this.DOM_CONTENT , 0 , { autoOpacity:0 });
				EXTween.to( _this.DOM_CONTENT , 0.3 , { autoOpacity:1 });
				
				setTimeout(function(){
					if(_this.scrollView != null){
						_this.scrollView.destroy();
						_this.scrollView = null;
					}
					_this.scrollView = new EXScrollView();
					_this.scrollView.init( _this.DOM_CONTAINER , _this.DOM_CONTENT );

					if(_iframeContent != null){
						var documentElement = _iframeContent.contentWindow.document.documentElement;
						EXEventListener.remove( documentElement , "mousewheel" , _this.delegateScrollViewMouseWheel );
						EXEventListener.add( documentElement , "mousewheel" , _this.delegateScrollViewMouseWheel );
					}
				} , 100);
			});
		};

		_this.delegateScrollViewMouseWheel = function(evt){
			evt.preventDefault();
			_this.scrollView.calculateWhellScrolling(evt.delta);
		}


		_this.close = function(){
			EXEventListener.remove( _this.DOM_CLOSE_BTN , "click" , _this.closeButtonHandler );
			_this.destroy();
		};

		_this.closeButtonHandler = function(evt){
			switch(evt.type){
				case "click" :
					EXEventListener.dispatch( exports , new EXCustomEvent("closeEventTest" , { layerPopup: _this }) );
					break;
			}
		}

		_this.initLayerLoader = function(targetString){
			var layer = CssQuery.getSingle(targetString);
			_this.DOM_CONTENT.appendChild(layer);
			_this.openComplete(1);
		};


		_this.initIframeLoader = function(targetString){
			EX.debug("LayerPopup.initIframeLoader" , targetString);
			_iframeContent = document.createElement("iframe");
			_iframeContent.scrolling = "no";
			_iframeContent.frameBorder = 0;
			_iframeContent.style.border = "none";
			_iframeContent.style.padding = "0";
			_iframeContent.style.margin = "0";
			_iframeContent.style.width = "100%";
			_iframeContent.style.height = "100%";
			_this.DOM_CONTENT.appendChild(_iframeContent);

			_iframeContent.onload = function(){
				/*
				console.log(_iframeContent.contentWindow.document.body.clientHeight);
				console.log(_iframeContent.contentWindow.document.body.scrollHeight);
				console.log(_iframeContent.contentWindow.document.body.offsetHeight);
				console.log(_iframeContent.contentWindow.document.documentElement.clientHeight);
				console.log(_iframeContent.contentWindow.document.documentElement.offsetHeight);
				*/
				_iframeContent.onload = null;
				var documentElement = _iframeContent.contentWindow.document.documentElement;
				_iframeContent.style.width = documentElement.scrollWidth + "px";
				_iframeContent.style.height = documentElement.scrollHeight + "px";
				_this.openComplete(1);
			}
			
			_iframeContent.src = targetString;
		};

		_this.initTextLoader = function(targetString){
			EX.debug("LayerPopup.initTextLoader" , targetString);
			_this.destroyTextLoader();
			_textLoader = new EXTextLoader();
			_textLoader.init();
			EXEventListener.add( _textLoader , EXLoader.EVENT_START , _this.textLoaderHandler );
			EXEventListener.add( _textLoader , EXLoader.EVENT_PROGRESS , _this.textLoaderHandler );
			EXEventListener.add( _textLoader , EXLoader.EVENT_COMPLETE_ALL , _this.textLoaderHandler );
			EXEventListener.add( _textLoader , EXLoader.EVENT_ERROR , _this.textLoaderHandler );
			_textLoader.addURL( targetString , "htmlData");
			_textLoader.load();
		};

		_this.textLoaderHandler = function(evt){
			EX.debug("LayerPopup.textLoaderHandler" , evt.type);
			switch(evt.type){
				case EXLoader.EVENT_START :
					break;
				case EXLoader.EVENT_PROGRESS :
					break;
				case EXLoader.EVENT_COMPLETE_ALL :

					var innerElement = document.createElement("div");
					innerElement.innerHTML = evt.dataObject.htmlData;
					_this.DOM_CONTENT.appendChild(innerElement); 

					_this.openComplete(1);
					_this.destroyTextLoader();
					break;
				case EXLoader.EVENT_ERROR :
					_this.destroyTextLoader();
					break;
			}
		};

		_this.destroyTextLoader = function(){
			if(_textLoader == null) return;
			_textLoader.destroy();
			EXEventListener.remove( _textLoader , EXLoader.EVENT_START , _this.textLoaderHandler );
			EXEventListener.remove( _textLoader , EXLoader.EVENT_PROGRESS , _this.textLoaderHandler );
			EXEventListener.remove( _textLoader , EXLoader.EVENT_COMPLETE_ALL , _this.textLoaderHandler );
			EXEventListener.remove( _textLoader , EXLoader.EVENT_ERROR , _this.textLoaderHandler );
			_textLoader = null;
		};

		_this.resizeHandler = function( screenWidth , screenHeight , speed ){
			if(speed == undefined) speed = 0.3;

			var resizeScrollView = false;
			if(screenWidth < _optionDataWidth){
				_optionDataWidth = screenWidth;
				_this.DOM_CONTAINER.style.width = _optionDataWidth + "px";
			}
			if(_initOptionWidth > _optionDataWidth){
				_optionDataWidth = screenWidth;
				_this.DOM_CONTAINER.style.width = _optionDataWidth + "px";
			}
			if(screenHeight <_optionDataHeight){
				_optionDataHeight = screenHeight;
				_this.DOM_CONTAINER.style.height = _optionDataHeight + "px";
				resizeScrollView = true;
			}
			if(_initOptionHeight > _optionDataHeight){
				_optionDataHeight = screenHeight;
				_this.DOM_CONTAINER.style.height = _optionDataHeight + "px";
				resizeScrollView = true;
			}
			var targetLeft = (screenWidth - _optionDataWidth)/2;
			var targetTop = (screenHeight - _optionDataHeight)/2;
			EXTween.killTweensOf(_this.DOM_CONTAINER);
			EXTween.to(_this.DOM_CONTAINER , speed , { left: targetLeft , top: targetTop });

			var screenHeight = EXBrowser.screenHeight();
			var scrollHeight = EXBrowser.scrollHeight();

			if(screenHeight >= scrollHeight){
				_this.DOM_LAYER.style.height = "100%";
			}else{
				_this.DOM_LAYER.style.height = scrollHeight+"px";
			}

			if(resizeScrollView == true && _this.scrollView != null){
				console.log("scrollView");
				_this.scrollView.destroy();
				_this.scrollView = null;
				_this.scrollView = new EXScrollView();
				_this.scrollView.init( _this.DOM_CONTAINER , _this.DOM_CONTENT );
			}
		};
		
		_this.setHashIndex = function(hashIndex){
			if(_hashIndex != -1) return;
			_hashIndex = hashIndex;
		};
		_this.getHashIndex = function(){
			return _hashIndex;
		};

		_this.getLayer = function(){
			return _this.DOM_LAYER;
		};

		_this.destroy = function(){
		};
	};
});