define(function(require, exports){
	
	var EXEventListener = (EXEventListener == undefined) ? require("../../experJS/events/EXEventListener") : EXEventListener;
	var EXCustomEvent = (EXCustomEvent == undefined) ? require("../../experJS/events/EXCustomEvent") : EXCustomEvent;
	var EXElement = (EXElement == undefined) ? require("../../experJS/utils/EXElement") : EXElement;
	var EXBrowser = (EXBrowser == undefined) ? require("../../experJS/utils/EXBrowser") : EXBrowser;
	var EXTween = (EXTween == undefined) ? require("../../experJS/transitions/EXTween") : EXTween;

	var EVENT_BAR_SCROLLING = "ScrollViewY.EVENT_BAR_SCROLLING";

	/*
	css/experCSS/exper.css
	에 지정된 공통 타입 UI 등을 생성, query 하기 위한 class || id 명 입니다.
	*/
	var ClassOf = {
		UI_BAR_CONTAINER : "experCSS_scrollView_uiBarContainer"
		, UI_BAR_CONTAINER_DISABLE : "disable"
		, UI_BAR_CONTAINER_NEEDLESS : "needless"
		, UI_BAR : "experCSS_scrollView_uiBar"
		, UI_BAR_ACTIVATE : "activate"
		, UI_ARROW_UP : "arrow up"
		, UI_ARROW_DOWN : "arrow down"
	}

	var _isIE9 = false;
	
	/**
	@class ScrollViewY
	@constructor
	*/
	var ScrollViewY = function(){
		var _this = this;

		var SMOOTH_SCROLLING = 0.2;
		var WHEEL_SPACE = 0;

		var _scrollContainer = null;
		var _scrollContent = null;

		var _maxScrollY = 0;

		var _scrollTargetY = 0;

		var _isScrolling = false;
		var _scrollInterval = null;

		var _delegateWheelObject = null;

		/**
		@property uiScrollBar
		@type {ScrollViewY.UI_Bar}
		*/
		_this.uiScrollBar = null;

		/**
		ScrollViewY 인스턴스를 초기화 합니다.
		@method init
		@param scrollContainer {HTMLElement}
		@param scrollContent {HTMLElement}
		@return {void}
		*/
		_this.init = function( scrollContainer , scrollContent ){
			//EX.debug("ScrollViewY" , "init");
			if(EXEventListener.isTouchAble() == false) EXEventListener.setTouchAble(true);
			_scrollContainer = scrollContainer;
			_scrollContent = scrollContent;
			_isIE9 = EXBrowser.isIE9;

			_maxScrollY = _scrollContainer.offsetHeight - _scrollContent.offsetHeight;
			_scrollContainer.style.position = "relative";

			WHEEL_SPACE = Math.floor((_scrollContainer.offsetHeight)/3);

			var parseScrollY = parseFloat(_scrollContent.style.top);
			_scrollContent.style.position = "absolute";
			_scrollContent.style.top = "0px";
			_scrollContent.style.left = "0px";

			_this.uiScrollBar = new ScrollViewY.UI_Bar();
			_this.uiScrollBar.init( _scrollContainer , _maxScrollY);

			_scrollContainer.appendChild(_this.uiScrollBar.getBarContainer());

			if(parseScrollY == 0 || isNaN(parseScrollY)){
			}else{
				_scrollTargetY = parseScrollY;
				_scrollContent.style.top = _scrollTargetY + "px";
				_this.uiScrollBar.setScrollPercent(_scrollTargetY/_maxScrollY);
				_this.calculateScrollingY(0);
			}

			if(_maxScrollY < 0){
				EXEventListener.add( _scrollContainer , "touchstart" , scrollContainerEventHandler);
				EXEventListener.add( _scrollContainer , "touchend" , scrollContainerEventHandler);
				EXEventListener.add( _scrollContainer , "mousewheel" , scrollContainerEventHandler );
				EXEventListener.add( _scrollContainer , EVENT_BAR_SCROLLING , scrollContainerEventHandler );
			}

			//EXEventListener.add( window , "keydown" , function(evt){
				//console.log(evt.shiftKey)
			//});

			_this.setScrollInterval(true);
			_this.uiScrollBar.show(false);
		};

		function scrollContainerEventHandler(evt){
			//EX.debug("ScrollViewY scrollContainerEventHandler" , evt.type);
			switch(evt.type){
				case "touchstart" :
					EXBrowser.setDragSelectAble(false);
					EXEventListener.add( _scrollContainer , "touchmove" , scrollContainerEventHandler);
					EXEventListener.add( document , "touchmove" , scrollContainerEventHandler);
					if(_delegateWheelObject != null){
						EXEventListener.add( _delegateWheelObject , "touchmove" , scrollContainerEventHandler );
					}
					break;

				case "touchmove" :
					if(_this.uiScrollBar.isMouseDown == false){
						evt.preventDefault();
						_this.calculateScrollingY(evt.touchMoveY*2);
					}
					break;

				case "touchend" :
					EXBrowser.setDragSelectAble(true);
					EXEventListener.remove( _scrollContainer , "touchmove" , scrollContainerEventHandler);
					EXEventListener.remove( document , "touchmove" , scrollContainerEventHandler);
					if(_delegateWheelObject != null){
						EXEventListener.remove( _delegateWheelObject , "touchmove" , scrollContainerEventHandler );
					}
					break;

				case "mousewheel" :
					evt.preventDefault();
					if(_isIE9 == false){
						_this.calculateWheelScrolling(evt.delta , evt.shiftKey , evt.altKey);
					}else{
						_this.calculateWheelScrolling(evt.wheelDelta , evt.shiftKey , evt.altKey);
					}
					break;

				case EVENT_BAR_SCROLLING :
					var movePercent = evt.dataObject.movePercent;
					var moveCalculate = _maxScrollY*movePercent-parseFloat( _scrollContent.style.top );
					_this.calculateScrollingY(moveCalculate , false);
					break;
			}
		};

		/**
		iframe 과 같이 한 화면에 다른 문서의 scroll 을 제어해야 할 경우 wheel 이벤트의 delegate 를 지정하여 이벤트를 ScrollViewY 와 연결합니다.
		@method delegateWheelEvent
		@param delegateWheelObject {DOM}
		@return {void}
		*/
		_this.delegateWheelEvent = function(delegateWheelObject){
			//EX.debug("ScrollViewY delegateWheelEvent");
			if(_delegateWheelObject != null){
				EXEventListener.remove( delegateWheelObject , "mousewheel" , scrollContainerEventHandler );
				EXEventListener.remove( _delegateWheelObject , "touchstart" , scrollContainerEventHandler );
				EXEventListener.remove( _delegateWheelObject , "touchend" , scrollContainerEventHandler );
				_delegateWheelObject = null;
			}
			_delegateWheelObject = delegateWheelObject;
			if(_isIE9 == false){
				EXEventListener.add( _delegateWheelObject , "mousewheel" , scrollContainerEventHandler );
				EXEventListener.add( _delegateWheelObject , "touchstart" , scrollContainerEventHandler );
				EXEventListener.add( _delegateWheelObject , "touchend" , scrollContainerEventHandler );
			}else{
				_delegateWheelObject.onmousewheel = scrollContainerEventHandler;
			}
		};

		/**
		delegate 가 iframe 일 경우 크로스 브라우징 처리를 ScrollViewY 클래스 내부에서 해줍니다.
		@method delegateWheelEventForIframe
		@param iframe {DOM}
		@return {void}
		*/
		var _delegateIframe = null;
		_this.delegateWheelEventForIframe = function(iframe){
			//EX.debug("ScrollViewY delegateWheelEventForIframe");
			_delegateIframe = iframe;
			var delegate = null;
			var delegateDocument = null;

			if(iframe.contentDocument){
				delegateDocument = iframe.contentDocument;
				delegate = delegateDocument.body;
			}else if(iframe.contentWindow){
				delegateDocument = iframe.contentWindow.document;
				delegate = delegateDocument.body;
			}
			_this.delegateWheelEvent(delegate);
			_this.uiScrollBar.setDelegateDocument(delegateDocument);
		};


		/**
		mouse wheel 이벤트의 delta 값을 이용해 스크롤 합니다.
		@method calculateWheelScrolling
		@param delta {integer}
		@return {void}
		*/
		_this.calculateWheelScrolling = function(delta , booster , maxScroll){
			//EX.debug("ScrollViewY calculateWheelScrolling");
			var scroll = WHEEL_SPACE;
			if(delta < 0){
				scroll = -WHEEL_SPACE;
			}
			if(booster == true){
				scroll = scroll*5;
				if(maxScroll == true){
					scroll = scroll*10000;
				}
			}
			_this.calculateScrollingY(scroll);
		};

		_this.setPositionY = function(positionY){
			_scrollTargetY = positionY;
		};

		/**
		지정된 값 만큼 스크롤 합니다.
		@method calculateScrollingY
		@param calculate {number}
		@return {void}
		*/
		_this.calculateScrollingY = function(calculate , smooth){
			//EX.debug("ScrollViewY calculateScrollingY");
			var currentPositionTop = parseFloat( _scrollContent.style.top );
			var targetPositionTop = currentPositionTop + calculate;
			if(targetPositionTop >= _maxScrollY && targetPositionTop <= 0){
				_scrollTargetY = targetPositionTop;
			}else{
				if(targetPositionTop < _maxScrollY){
					_scrollTargetY = _maxScrollY;
				}
				if(targetPositionTop > 0){
					_scrollTargetY = 0;
				}
			}
			if(smooth == false){
				_scrollContent.style.top = _scrollTargetY + "px";
				_this.uiScrollBar.setScrollPercent(_scrollTargetY/_maxScrollY);
			}else{
				_this.setScrollInterval(true);
			}
			//_this.uiScrollBar.show(true);
		};

		/**
		스크롤을 부드럽고 자연스럽게 연출하기 위한 메소드 입니다.
		@method smoothScrollIntervaling
		@return {void}
		*/
		_this.smoothScrollIntervaling = function(){
			//EX.debug("ScrollViewY smoothScrollIntervaling");
			//console.log(_this.uiScrollBar);
			var targetY = parseFloat( _scrollContent.style.top );
			if(_scrollTargetY != targetY){
				//targetY += 0.1*(Math.ceil(_scrollTargetY - targetY));
				targetY += SMOOTH_SCROLLING*(Math.ceil(_scrollTargetY - targetY));
				if(Math.abs(_scrollTargetY - targetY) < 1){
					targetY = _scrollTargetY;
					//_this.uiScrollBar.show(false);
				}
				_scrollContent.style.top = targetY + "px";
				_this.uiScrollBar.setScrollPercent(targetY/_maxScrollY);
			}else{
				_this.setScrollInterval(false);
			}
		}

		/**
		스크롤을 부드럽고 자연스럽게 연출하기 위해 사용되는 interval 을 중지, 시작 제어를 합니다.
		@method setScrollInterval
		@param bool {boolean}
		@return {void}
		*/
		_this.setScrollInterval = function(bool){
			//EX.debug("ScrollViewY setScrollInterval");
			if(bool == true){
				if(_scrollInterval != null){
					clearInterval(_scrollInterval);
					_scrollInterval = null;
				}
				_scrollInterval = setInterval(_this.smoothScrollIntervaling , 20);
				//_this.uiScrollBar.show(true);
			}else{
				clearInterval(_scrollInterval);
				_scrollInterval = null;
				//_this.uiScrollBar.show(false);
			}
		}

		/**
		ScrollViewY 인스턴스를 파기 합니다.
		@method destroy
		@return {void}
		*/
		_this.destroy = function(){
			//EX.debug("ScrollViewY" , "destroy");
			try{
				//_this.setScrollInterval(false);

				EXEventListener.remove( document , "touchmove" , scrollContainerEventHandler);
				if(_scrollInterval != null){
					clearInterval(_scrollInterval);
					_scrollInterval = null;
				}

				if(_delegateWheelObject != null){
					if(_isIE9 == false){
						EXEventListener.remove( _delegateWheelObject , "mousewheel" , scrollContainerEventHandler );
						EXEventListener.remove( _delegateWheelObject , "touchstart" , scrollContainerEventHandler );
						EXEventListener.remove( _delegateWheelObject , "touchend" , scrollContainerEventHandler );
					}else{
						_delegateWheelObject.onmousewheel = null;
					}
					_delegateWheelObject = null;
				}
				if(_scrollContainer != null){
					EXEventListener.remove( _scrollContainer , "touchstart" , scrollContainerEventHandler);
					EXEventListener.remove( _scrollContainer , "touchmove" , scrollContainerEventHandler);
					EXEventListener.remove( _scrollContainer , "touchend" , scrollContainerEventHandler);
					EXEventListener.remove( _scrollContainer , "mousewheel" , scrollContainerEventHandler );
					EXEventListener.remove( _scrollContainer , EVENT_BAR_SCROLLING , scrollContainerEventHandler );
					_scrollContainer.removeChild(_this.uiScrollBar.getBarContainer());
					_scrollContainer = null;
				}
				if(_this.uiScrollBar != null){
					_this.uiScrollBar.destroy();
					_this.uiScrollBar = null;
				}
			}catch(e){
				EX.debug("######## ScrollViewY" , "destroy" , e);
			}
		};
	};
	
	/**
	ScrollViewY 에 사용되는 스크롤 Bar UI
	@class ScrollViewY.UI_Bar
	@constructor
	*/
	ScrollViewY.UI_Bar = function(){
		var _scrollBar = this;
		var _uiBarContainer = null;
		var _uiBar = null;
		var _isShow = false;
		var _ableShow = true;
		var _scrollContainer = 0;
		var _scrollContainerOffsetHeight = 0;
		var _uiBarHeight = 0;
		
		var _maxScrollY = 0;
		var _scrollingClientY = 0;
		var _scrollingPositionY = 0;
		var _scrollingClinetPercentY = 0;

		var _uiArrowUp = null;
		var _uiArrowDown = null;

		var _currentScrollPercentY = 0;

		var _delegateDocument = null;

		/**
		@property isMouseDown
		@type {boolean}
		@default false
		*/
		_scrollBar.isMouseDown = false;
		
		/**
		@property isMouseOver
		@type {boolean}
		@default false
		*/
		_scrollBar.isMouseOver = false;

		/**
		ScrollViewY.UI_Bar 인스턴스를 초기화 합니다.
		@method init
		@param scrollContainer {HTMLElement}
		@param maxY {number}
		@return {void}
		*/
		_scrollBar.init = function(scrollContainer , maxY ){
			//EX.debug("ScrollViewY.UI_Bar" , "init");
			_scrollContainer = scrollContainer;

			_uiBarContainer = document.createElement("div");
			_uiBar = document.createElement("div");
			_uiArrowUp = document.createElement("div");
			_uiArrowDown = document.createElement("div");

			_uiBarContainer.className = ClassOf.UI_BAR_CONTAINER;//"experCSS_scrollView_uiBarContainer";
			_uiBar.className = ClassOf.UI_BAR;//"experCSS_scrollView_uiBar";
			_uiArrowUp.className = ClassOf.UI_ARROW_UP;//"arrow up";
			_uiArrowDown.className = ClassOf.UI_ARROW_DOWN;//"arrow down";

			_uiBarContainer.appendChild(_uiArrowDown);
			_uiBarContainer.appendChild(_uiArrowUp);
			_uiBarContainer.appendChild(_uiBar);
			
			_scrollContainerOffsetHeight = _scrollContainer.offsetHeight;
			_uiBarHeight = Math.floor( _scrollContainerOffsetHeight * Math.abs(_scrollContainerOffsetHeight/(_scrollContainerOffsetHeight-maxY)));
			if(_uiBarHeight < 20 ) _uiBarHeight = 20;
			_maxScrollY = (_scrollContainerOffsetHeight - _uiBarHeight);// - 0;

			try{
				_uiBarContainer.style.height = _scrollContainerOffsetHeight+"px";
				_uiBar.style.height = _uiBarHeight +"px";
			}catch(e){
			}
			
			if(_maxScrollY <= 0 ){
				EXElement.addClass( _uiBarContainer , ClassOf.UI_BAR_CONTAINER_NEEDLESS );
			}else{
				EXEventListener.add( _uiBar , "mouseup" , interactionBarMouseEventHandler);
				EXEventListener.add( _uiBar , "mousedown" , interactionBarMouseEventHandler);

				EXEventListener.add( _uiArrowUp , "mousedown" , interactionArrowMouseEventHandler);
				EXEventListener.add( _uiArrowUp , "mouseup" , interactionArrowMouseEventHandler);
				EXEventListener.add( _uiArrowDown , "mousedown" , interactionArrowMouseEventHandler);
				EXEventListener.add( _uiArrowDown , "mouseup" , interactionArrowMouseEventHandler);
				
				EXEventListener.add( _uiBarContainer , "mousedown" , interactionContainerMouseEventHandler);
			}
		};

		function interactionContainerMouseEventHandler(evt){
			//EX.debug("ScrollViewY.UI_Bar" , "interactionContainerMouseEventHandler");
			if(_scrollBar.isMouseDown == false){
				var half = _scrollContainerOffsetHeight - _uiBarHeight;
				var mouseY = evt.pageY - EXElement.getElementGlobalPositionY(_uiBarContainer);
				var fixPercent = (mouseY - _uiBarHeight/2)/half;
				_scrollBar.requestScrollPercent(fixPercent);
			}
		}

		function interactionArrowMouseEventHandler(evt){
			//EX.debug("ScrollViewY.UI_Bar" , "interactionArrowMouseEventHandler");
			var arrow = evt.currentTarget;
			switch(evt.type){
				case "mousedown" :
					_scrollBar.isMouseDown = true;
					if(arrow == _uiArrowUp){
						_scrollBar.requestScrollPercent( _currentScrollPercentY - 0.2 );
					}else if(arrow == _uiArrowDown){
						_scrollBar.requestScrollPercent( _currentScrollPercentY + 0.2 );
					}
					EXTween.killTweensOf(arrow);
					EXTween.to(arrow , 0 , { backgroundColor:0xeeeeee });
					EXTween.to(arrow , 0 , { delay:0.1 , backgroundColor:0xffffff  });
					break;
				case "mouseup" :
					_scrollBar.isMouseDown = false;
					break;
			}
		}

		function interactionBarMouseEventHandler(evt){
			EX.debug("ScrollViewY.UI_Bar" , "interactionBarMouseEventHandler" , evt.type);
			switch(evt.type){
				case "mouseup" :
					EXElement.removeClass(_uiBar , ClassOf.UI_BAR_ACTIVATE );
					_scrollBar.isMouseDown = false;
					EXEventListener.remove( _scrollContainer , "mouseup" , interactionBarMouseEventHandler);
					EXEventListener.remove( _uiBarContainer , "mousemove" , interactionBarMouseEventHandler);
					EXEventListener.remove( document , "mouseup" , interactionBarMouseEventHandler);
					EXEventListener.remove( document , "mousemove" , interactionBarMouseEventHandler);
					if(_delegateDocument != null){
						EXEventListener.remove( _delegateDocument , "mouseup" , interactionBarMouseEventHandler);
					}
					EXBrowser.setDragSelectAble(true);
					break;
				case "mousedown" :
					EXElement.addClass(_uiBar , ClassOf.UI_BAR_ACTIVATE );
					_scrollBar.isMouseDown = true;
					_scrollingClientY = evt.clientY;
					_scrollingClinetPercentY = _scrollingPositionY/_maxScrollY;
					EXEventListener.add( _scrollContainer , "mouseup" , interactionBarMouseEventHandler);
					EXEventListener.add( document , "mouseup" , interactionBarMouseEventHandler);
					EXEventListener.add( document , "mousemove" , interactionBarMouseEventHandler);
					if(_delegateDocument != null){
						EXEventListener.add( _delegateDocument , "mouseup" , interactionBarMouseEventHandler);
					}
					EXBrowser.setDragSelectAble(false);
					break;
				case "mousemove" :
					var movePercent = (evt.clientY - _scrollingClientY)/_maxScrollY + _scrollingClinetPercentY;
					_scrollBar.requestScrollPercent(movePercent);
					break;
			}
		};
		/**
		@method setDelegateDocument
		@param delegate
		@return {void}
		*/
		_scrollBar.setDelegateDocument = function(delegate){
			_delegateDocument = delegate;
		}

		/**
		ScrollViewY 에 움직여야 할 scroll 값을 요청합니다.
		@method requestScrollPercent
		@param movePercent {integer}
		@return {void}
		*/
		_scrollBar.requestScrollPercent = function(movePercent){
			//EX.debug("ScrollViewY.UI_Bar" , "requestScrollPercent");
			//var movePercent = (layerY-_uiBarHeight/2)/(_scrollContainerOffsetHeight-_uiBarHeight);
			if(movePercent < 0) movePercent = 0;
			if(movePercent > 1) movePercent = 1;
			EXEventListener.dispatch( _scrollContainer , new EXCustomEvent( EVENT_BAR_SCROLLING , { movePercent: movePercent }));
		}

		/**
		ScrollViewY 에 의해 움직여야할 percent 값을 지정 받습니다.
		@method setScrollPercent
		@param percent {number}
		@return {void}
		*/
		_scrollBar.setScrollPercent = function(percent){
			//EX.debug("ScrollViewY.UI_Bar" , "setScrollPercent");
			var targetY = Math.floor(percent*_maxScrollY);
			_uiBar.style.top = targetY+"px";
			//console.log(_uiBar.style.top);
			_scrollingPositionY = targetY;
			_currentScrollPercentY = percent;
		};

		/**
		UI Bar 를 visible , hidden 합니다.
		@method show
		@param bool {boolean}
		@return {void}
		*/
		_scrollBar.show = function(bool){
			if(_isShow == bool) return;
			if(_ableShow == false) return;
			if(bool == true){
				//EXTween.to( _uiBar , 0.3 , { autoOpacity:1 });
			}else{
				//EXTween.to( _uiBar , 0.3 , { autoOpacity:0.2 });
			}
			_isShow = bool;
		};

		/**
		@method getBarContainer
		@return {HTMLElement}
		*/
		_scrollBar.getBarContainer = function(){
			return _uiBarContainer;
		};

		/**
		@method getBar
		@return {HTMLElement}
		*/
		_scrollBar.getBar = function(){
			return _uiBar;
		};

		/**
		UI Bar 를 파기 합니다.
		@method destroy
		@return {void}
		*/
		_scrollBar.destroy = function(){
			try{
				EXEventListener.remove( document , "mouseup" , interactionBarMouseEventHandler);
				EXEventListener.remove( document , "mousemove" , interactionBarMouseEventHandler);
				if(_uiBar != null){
					EXEventListener.remove( _uiBar , "mouseup" , interactionBarMouseEventHandler);
					EXEventListener.remove( _uiBar , "mousedown" , interactionBarMouseEventHandler);
					EXEventListener.remove( _uiBar , "mouseover" , interactionBarMouseEventHandler);
					EXEventListener.remove( _uiBar , "mouseout" , interactionBarMouseEventHandler);
					_uiBar = null;
				}
				if(_scrollContainer != null){
					EXEventListener.remove( _scrollContainer , "mouseup" , interactionBarMouseEventHandler);
					/*
					EXEventListener.remove( _scrollContainer , "touchstart" , scrollContainerEventHandler);
					EXEventListener.remove( _scrollContainer , "touchmove" , scrollContainerEventHandler);
					EXEventListener.remove( _scrollContainer , "touchend" , scrollContainerEventHandler);
					EXEventListener.remove( _scrollContainer , "mousewheel" , scrollContainerEventHandler );
					EXEventListener.remove( _scrollContainer , EVENT_BAR_SCROLLING , scrollContainerEventHandler );
					*/
					_scrollContainer = null;
				}
				if(_delegateDocument != null){
					EXEventListener.remove( _delegateDocument , "mouseup" , interactionBarMouseEventHandler);
					_delegateDocument = null;
				}
				if(_uiBarContainer != null){
					EXEventListener.remove( _uiBarContainer , "mousedown" , interactionContainerMouseEventHandler);
					_uiBarContainer = null;
				}
				if(_uiArrowUp != null){
					EXEventListener.remove( _uiArrowUp , "mousedown" , interactionArrowMouseEventHandler);
					EXEventListener.remove( _uiArrowUp , "mouseup" , interactionArrowMouseEventHandler);
					_uiArrowUp = null;
				}
				if(_uiArrowDown != null){
					EXEventListener.remove( _uiArrowDown , "mousedown" , interactionArrowMouseEventHandler);
					EXEventListener.remove( _uiArrowDown , "mouseup" , interactionArrowMouseEventHandler);
					_uiArrowDown = null;
				}
			}catch(e){
				EX.debug("ScrollViewY.UI_Bar" , "destroy" , e);
			}
		};
		return _scrollBar;
	}

	return ScrollViewY;
});