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
	var DOM_LAYER_BODY_APPENDER = null;
	var DOM_LAYER_BODY_REMOVER= null;

	var ClassOf = {
		LDB : "experCSS_layerDom_body"
		, LDB_APPENDER : "append"
		, LDB_REMOVER : "remove"
		, LDL : "experCSS_layerDom_layer"
		, LDL_DIM : "dim"
		, LDL_CONTAINER : "container"
		, LDLC_CONTENT : "content"
		, LDLC_CLOSE_BTN : "closeBtn"
		, LDLC_PROGRESS : "progress"
		, LDLC_IFRAME : "framei"
	};

	var OpenType = {
		LAYER : 1
		, IFRAME : 2
		, AJAX : 3
	};

	var SizeType = {
		FULL : 1
		, CENTER : 2
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
	exports.openCount = 0;

	exports.init = function(){

		DOM_LAYER_BODY = document.createElement("div");
		DOM_LAYER_BODY_APPENDER = document.createElement("div");
		DOM_LAYER_BODY_REMOVER = document.createElement("div");

		DOM_LAYER_BODY.className = ClassOf.LDB;
		DOM_LAYER_BODY_APPENDER.className = ClassOf.LDB_APPENDER;
		DOM_LAYER_BODY_REMOVER.className = ClassOf.LDB_REMOVER;

		DOM_LAYER_BODY.appendChild(DOM_LAYER_BODY_REMOVER);
		DOM_LAYER_BODY.appendChild(DOM_LAYER_BODY_APPENDER);
		DOM_BODY.appendChild(DOM_LAYER_BODY);

		EXEventListener.add( window , "resize" , exports.resizeHandler );
		EXEventListener.add( exports , "closeEventTest" , exports.close );
		exports.resizeHandler();
	};

	exports.open = function(openType , targetString , optionData){
		var layerPopup = new exports.LayerPopup();
		layerPopup.init( openType , optionData);
		layerPopup.open( targetString );

		DOM_LAYER_BODY_APPENDER.appendChild( layerPopup.getLayer() );
		
		layerPopup.setHashIndex(exports.hashLayerPopupCount);
		exports.hashLayerPopup[exports.hashLayerPopupCount] = layerPopup;
		exports.hashLayerPopupCount += 1;
		exports.openCount += 1;
	};

	exports.close = function(evt){
		var layerPopup = evt.dataObject.layerPopup;
		var layer = layerPopup.getLayer();
		//AJAX 타입 = 삭제. 디스트로이
		//IFRAME 타입 = 삭제. 디스트로이
		//LAYER 타입 = 리무브 컨테이너에 담고 삭제, 디스트로이 달라야함.
		DOM_LAYER_BODY_APPENDER.removeChild( layer );
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
		exports.openCount -= 1;
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

			_this.DOM_LAYER.className = ClassOf.LDL;
			_this.DOM_DIM.className = ClassOf.LDL_DIM;
			_this.DOM_CONTAINER.className = ClassOf.LDL_CONTAINER;
			_this.DOM_CONTENT.className = ClassOf.LDLC_CONTENT;
			_this.DOM_PROGRESS.className = ClassOf.LDLC_PROGRESS;
			_this.DOM_CLOSE_BTN.className = ClassOf.LDLC_CLOSE_BTN;
			
			_this.DOM_LAYER.style.height = EXBrowser.scrollHeight("px");
			_this.DOM_CONTAINER.style.width = _optionDataWidth+"px";
			_this.DOM_CONTAINER.style.height = _optionDataHeight+"px";

			_this.DOM_CONTAINER.appendChild(_this.DOM_CONTENT);
			_this.DOM_CONTAINER.appendChild(_this.DOM_PROGRESS);
			_this.DOM_CONTAINER.appendChild(_this.DOM_CLOSE_BTN);
			_this.DOM_LAYER.appendChild( _this.DOM_DIM );
			_this.DOM_LAYER.appendChild( _this.DOM_CONTAINER );

			if(exports.openCount > 0){
				EXTween.to( _this.DOM_DIM , 0 , { opacity:0.15 });
			}else{
				EXTween.to( _this.DOM_DIM , 0 , { opacity:0.8 });
			}

			_this.resizeHandler( EXBrowser.screenWidth() , EXBrowser.screenHeight() , 0);
		};
		_this.open = function(targetString){
			//EX.debug("LayerPopup.open" , targetString);
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
				EXTween.to( _this.DOM_CLOSE_BTN , 0.3 , { autoOpacity:1 });

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
						_this.scrollView.delegateIFrame = _iframeContent;
						_this.scrollView.delegateWheelEventForIframe(_iframeContent);
					}
				} , 100);
			});
		};


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
			//EX.debug("LayerPopup.initIframeLoader" , targetString);
			_iframeContent = document.createElement("iframe");
			_iframeContent.scrolling = "no";
			_iframeContent.frameBorder = 0;
			_iframeContent.className = ClassOf.LDLC_IFRAME;

			_this.DOM_CONTENT.appendChild(_iframeContent);

			_iframeContent.onload = function(){
				_iframeContent.onload = null;
				var documentElement = _iframeContent.contentWindow.document.documentElement;
				_iframeContent.style.width = documentElement.scrollWidth + "px";
				_iframeContent.style.height = documentElement.scrollHeight + "px";
				_this.openComplete(1);
			}
			
			_iframeContent.src = targetString;
		};

		_this.initTextLoader = function(targetString){
			//EX.debug("LayerPopup.initTextLoader" , targetString);
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
			//EX.debug("LayerPopup.textLoaderHandler" , evt.type);
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
				var delegateIFrame = _this.scrollView.delegateIFrame;
				_this.scrollView.destroy();
				_this.scrollView = null;
				_this.scrollView = new EXScrollView();
				_this.scrollView.init( _this.DOM_CONTAINER , _this.DOM_CONTENT );
				if(delegateIFrame){
					_this.scrollView.delegateWheelEventForIframe(delegateIFrame);
					_this.scrollView.delegateIFrame = delegateIFrame;
				}
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