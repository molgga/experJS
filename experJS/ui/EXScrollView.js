define(function(require, exports){
	var EXEventListener = require("../events/EXEventListener");
	var EXCustomEvent = require("../events/EXCustomEvent");
	var EXTween = require("../transitions/EXTween");
	var EXBrowser = require("../utils/EXBrowser");
	
	var EVENT_BAR_SCROLLING = "EXScrollView.EVENT_BAR_SCROLLING";

	var ClassOf = {
		UI_BAR_CONTAINER : "experCSS_scrollView_uiBarContainer"
		, UI_BAR : "experCSS_scrollView_uiBar"
	}
	
	/**
	@class EXScrollView
	@constructor
	@example
	*/
	var EXScrollView = function(){
		var _this = this;

		var _scrollContainer = null;
		var _scrollContent = null;

		var _maxScrollY = 0;

		var _scrollTargetY = 0;

		var _wheelSpace = 200;

		var _isScrolling = false;
		var _scrollInterval = null;

		/**
		@property uiScrollBar
		@type {EXScrollView.UI_Bar}
		*/
		_this.uiScrollBar = null;

		/**
		@method init
		@param scrollContainer {HTMLElement}
		@param scrollContent {HTMLElement}
		@return {void}
		*/
		_this.init = function( scrollContainer , scrollContent ){
			EX.debug("EXScrollView" , "init");
			if(EXEventListener.isTouchAble() == false) EXEventListener.setTouchAble(true);

			_scrollContainer = scrollContainer;
			_scrollContent = scrollContent;
			_maxScrollY = _scrollContainer.offsetHeight - _scrollContent.offsetHeight;
			_scrollContainer.style.position = "relative";

			_wheelSpace = Math.floor((_scrollContainer.offsetHeight)/3);

			var parseScrollY = parseFloat(_scrollContent.style.top);
			_scrollContent.style.position = "absolute";
			_scrollContent.style.top = "0px";
			_scrollContent.style.left = "0px";

			_this.uiScrollBar = new EXScrollView.UI_Bar();
			_this.uiScrollBar.init( _scrollContainer , _maxScrollY);

			_scrollContainer.appendChild(_this.uiScrollBar.getBar());
			_scrollContainer.appendChild(_this.uiScrollBar.getBarContainer());
			EXTween.to( _this.uiScrollBar.getBar() , 0 , { autoOpacity:0 });

			EXEventListener.add( _scrollContainer , "touchstart" , scrollContainerEventHandler);
			EXEventListener.add( _scrollContainer , "touchend" , scrollContainerEventHandler);
			EXEventListener.add( _scrollContainer , "mousewheel" , scrollContainerEventHandler );
			EXEventListener.add( _scrollContainer , EVENT_BAR_SCROLLING , scrollContainerEventHandler );

			if(parseScrollY == 0 || isNaN(parseScrollY)){
			}else{
				_scrollTargetY = parseScrollY;
				_scrollContent.style.top = _scrollTargetY + "px";
				_this.uiScrollBar.setScrollPercent(_scrollTargetY/_maxScrollY);
				_this.calculateScrollingY(0);
			}

			_this.setScrollInterval(true);
			_this.uiScrollBar.show(false);
		};

		function scrollContainerEventHandler(evt){
			//EX.debug("scrollContainerEventHandler" , evt.type);
			switch(evt.type){
				case "touchstart" :
					EXBrowser.setDragSelectAble(false);
					EXEventListener.add( _scrollContainer , "touchmove" , scrollContainerEventHandler);
					EXEventListener.add( document , "touchmove" , scrollContainerEventHandler);
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
					break;

				case "mousewheel" :
					evt.preventDefault();
					_this.calculateWhellScrolling(evt.delta);
					break;

				case EVENT_BAR_SCROLLING :
					var movePercent = evt.dataObject.movePercent;
					var moveCalculate = _maxScrollY*movePercent-parseFloat( _scrollContent.style.top );
					_this.calculateScrollingY(moveCalculate);
					break;
			}
		};

		/**
		@method calculateWhellScrolling
		@param delta {integer}
		@return {void}
		*/
		_this.calculateWhellScrolling = function(delta){
			if(delta > 0){
				_this.calculateScrollingY(_wheelSpace);
			}else{
				_this.calculateScrollingY(-_wheelSpace);
			}
		};

		_this.setPositionY = function(positionY){
			_scrollTargetY = positionY;
		};

		/**
		@method calculateScrollingY
		@param calculate {number}
		@return {void}
		*/
		_this.calculateScrollingY = function(calculate){
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
			_this.uiScrollBar.show(true);
		};

		/**
		@method smoothScrollIntervaling
		@return {void}
		*/
		_this.smoothScrollIntervaling = function(){
			var targetY = parseFloat( _scrollContent.style.top );
			if(_scrollTargetY != targetY){
				targetY += 0.1*(Math.ceil(_scrollTargetY - targetY));
				if(Math.abs(_scrollTargetY - targetY) < 1){
					targetY = _scrollTargetY;
					_this.uiScrollBar.show(false);
				}
				_scrollContent.style.top = targetY + "px";
				_this.uiScrollBar.setScrollPercent(targetY/_maxScrollY);
			}
		}

		/**
		@method setScrollInterval
		@param bool {boolean}
		@return {void}
		*/
		_this.setScrollInterval = function(bool){
			if(bool == true){
				if(_scrollInterval != null){
					clearInterval(_scrollInterval);
					_scrollInterval = null;
				}
				_scrollInterval = setInterval(_this.smoothScrollIntervaling , 20);
				_this.uiScrollBar.show(true);
			}else{
				clearInterval(_scrollInterval);
				_scrollInterval = null;
				_this.uiScrollBar.show(false);
			}
		}

		/**
		@method destroy
		@return {void}
		*/
		_this.destroy = function(){
			EX.debug("EXScrollView" , "destroy");
			try{
				_this.setScrollInterval(false);
				EXEventListener.remove( document , "touchmove" , scrollContainerEventHandler);
				if(_scrollContainer != null){
					EXEventListener.remove( _scrollContainer , "touchstart" , scrollContainerEventHandler);
					EXEventListener.remove( _scrollContainer , "touchmove" , scrollContainerEventHandler);
					EXEventListener.remove( _scrollContainer , "touchend" , scrollContainerEventHandler);
					EXEventListener.remove( _scrollContainer , "mousewheel" , scrollContainerEventHandler );
					EXEventListener.remove( _scrollContainer , EVENT_BAR_SCROLLING , scrollContainerEventHandler );
					_scrollContainer.removeChild(_this.uiScrollBar.getBar());
					_scrollContainer.removeChild(_this.uiScrollBar.getBarContainer());
					_scrollContainer = null;
				}
				if(_this.uiScrollBar != null){
					_this.uiScrollBar.destroy();
					_this.uiScrollBar = null;
				}
			}catch(e){
				EX.debug("EXScrollView" , "destroy" , e);
			}
		};
	};
	
	/**
	@class EXScrollView.UI_Bar
	@constructor
	*/
	EXScrollView.UI_Bar = function(){
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
		@method init
		@param scrollContainer {HTMLElement}
		@param maxY {number}
		@return {void}
		*/
		_scrollBar.init = function(scrollContainer , maxY ){
			_scrollContainer = scrollContainer;
			_scrollContainerOffsetHeight = _scrollContainer.offsetHeight;
			_uiBarHeight = Math.floor( _scrollContainerOffsetHeight * Math.abs(_scrollContainerOffsetHeight/(_scrollContainerOffsetHeight-maxY)));
			_maxScrollY = _scrollContainerOffsetHeight - _uiBarHeight - 10;

			_uiBarContainer = document.createElement("div");
			_uiBarContainer.className = ClassOf.UI_BAR_CONTAINER;//"experCSS_scrollView_uiBarContainer";
			_uiBarContainer.style.height = _scrollContainerOffsetHeight+"px";

			_uiBar = document.createElement("div");
			_uiBar.className = ClassOf.UI_BAR;//"experCSS_scrollView_uiBar";
			_uiBar.style.height = _uiBarHeight +"px";

			EXEventListener.add( _uiBarContainer , "mouseup" , barContainerMouseHandler);
			EXEventListener.add( _uiBarContainer , "mousedown" , barContainerMouseHandler);
			EXEventListener.add( _uiBarContainer , "mouseover" , barContainerMouseHandler);
			EXEventListener.add( _uiBarContainer , "mouseout" , barContainerMouseHandler);
		};

		function barContainerMouseHandler(evt){
			switch(evt.type){
				case "mouseover" :
					/*
					_scrollBar.isMouseOver = true;
					_ableShow = false;
					_isShow = true;
					EXTween.to( _uiBar , 0.3 , { autoOpacity:1 });
					*/
					break;
				case "mouseout" :
					/*
					_scrollBar.isMouseOver = false;
					if(_scrollBar.isMouseDown == false){
						_ableShow = true;
						_isShow = false;
						EXTween.to( _uiBar , 0.3 , { autoOpacity:0.2 });
					}
					*/
					break;
				case "mouseup" :
					EXEventListener.remove( _scrollContainer , "mouseup" , barContainerMouseHandler);
					EXEventListener.remove( _uiBarContainer , "mousemove" , barContainerMouseHandler);
					EXEventListener.remove( document , "mouseup" , barContainerMouseHandler);
					EXEventListener.remove( document , "mousemove" , barContainerMouseHandler);
					EXBrowser.setDragSelectAble(true);
					/*
					_scrollBar.isMouseDown = false;
					if(_scrollBar.isMouseOver == false){
						_ableShow = true;
						_isShow = false;
						EXTween.to( _uiBar , 0.3 , { autoOpacity:0 });
					}
					*/

					break;
				case "mousedown" :
					_scrollBar.isMouseDown = true;
					_scrollingClientY = evt.clientY;
					_scrollingClinetPercentY = _scrollingPositionY/_maxScrollY;
					EXBrowser.setDragSelectAble(false);
					EXEventListener.add( _scrollContainer , "mouseup" , barContainerMouseHandler);
					EXEventListener.add( document , "mouseup" , barContainerMouseHandler);
					EXEventListener.add( document , "mousemove" , barContainerMouseHandler);
					break;
				case "mousemove" :
					var movePercent = (evt.clientY - _scrollingClientY)/_maxScrollY + _scrollingClinetPercentY;
					if(movePercent < 0) movePercent = 0;
					if(movePercent > 1) movePercent = 1;
					EXEventListener.dispatch( _scrollContainer , new EXCustomEvent(EVENT_BAR_SCROLLING , {movePercent : movePercent}) );

					break;
			}
		};

		/**
		@method requestScrollPercent
		@param layerY {integer}
		@return {void}
		*/
		_scrollBar.requestScrollPercent = function(layerY){
			var movePercent = (layerY-_uiBarHeight/2)/(_scrollContainerOffsetHeight-_uiBarHeight);
			if(movePercent < 0) movePercent = 0;
			if(movePercent > 1) movePercent = 1;
			EXEventListener.dispatch( _scrollContainer , new EXCustomEvent( EVENT_BAR_SCROLLING , { movePercent: movePercent }));
		}

		/**
		@method setScrollPercent
		@param percent {number}
		@return {void}
		*/
		_scrollBar.setScrollPercent = function(percent){
			var targetY = Math.floor(percent*_maxScrollY);
			_uiBar.style.top = targetY+"px";
		};

		/**
		@method show
		@param bool {boolean}
		@return {void}
		*/
		_scrollBar.show = function(bool){
			if(_isShow == bool) return;
			if(_ableShow == false) return;
			if(bool == true){
				EXTween.to( _uiBar , 0.3 , { autoOpacity:1 });
			}else{
				EXTween.to( _uiBar , 0.3 , { autoOpacity:0.2 });
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
		@method destroy
		@return {void}
		*/
		_scrollBar.destroy = function(){
			try{
				EXEventListener.remove( document , "mouseup" , barContainerMouseHandler);
				EXEventListener.remove( document , "mousemove" , barContainerMouseHandler);
				if(_uiBarContainer != null){
					EXEventListener.remove( _uiBarContainer , "mouseup" , barContainerMouseHandler);
					EXEventListener.remove( _uiBarContainer , "mousedown" , barContainerMouseHandler);
					EXEventListener.remove( _uiBarContainer , "mouseover" , barContainerMouseHandler);
					EXEventListener.remove( _uiBarContainer , "mouseout" , barContainerMouseHandler);
					_uiBarContainer = null;
				}
				if(_scrollContainer != null){
					EXEventListener.remove( _scrollContainer , "touchstart" , scrollContainerEventHandler);
					EXEventListener.remove( _scrollContainer , "touchmove" , scrollContainerEventHandler);
					EXEventListener.remove( _scrollContainer , "touchend" , scrollContainerEventHandler);
					EXEventListener.remove( _scrollContainer , "mousewheel" , scrollContainerEventHandler );
					EXEventListener.remove( _scrollContainer , EVENT_BAR_SCROLLING , scrollContainerEventHandler );
				}
				if(_uiBar != null){
					_uiBar = null;
				}
			}catch(e){
				EX.debug("EXScrollView.UI_Bar" , "destroy" , e);
			}
		};
		return _scrollBar;
	}

	return EXScrollView;
});