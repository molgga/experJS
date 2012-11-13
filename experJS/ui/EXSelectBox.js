define(function(require , exports){
	var CssQuery = require("../vender/CssQuery");
	var EXElement = require("../utils/EXElement");
	var EXTimer = require("../utils/EXTimer");
	var EXEventListener = require("../events/EXEventListener");
	var EXCustomEvent = require("../events/EXCustomEvent");
	var EXScrollView = require("../ui/EXScrollView");

	var Model = {
		PADDING_RIGHT_WIDTH : 20 // designSelectBox가 originalSelectBox 를 영역을 참조할 때 추가할 우측 여백(padding).
		, OPTION_GROUP_OVERFLOW_HEIGHT : 100 // designSelectBox 의 optionGroup 이 scroll 되어야할 때 지정되는 높이.
		, OPTION_ITEM_BASE_HEIGHT : 31 // designSelectBox 의 option 의 기본 높이.
		, currentOpenSelectBox : null // 현재 열려있는 designSelectBox.
	};

	var ClassOf = {
		SELECTBOX						: "exUIKit_selectBox" // originalSelectBox 에 부여된 css class명. 해당 css class명이 부여된 객체를 찾아 designSelectBox 로 변경합니다.
		, SELECTBOX_ORIGINAL	: "original" // originalSelectBox 에 추가될 css class명.
		, SELECTBOX_DESIGN		: "selectBox" // designSelectBox 에 부여될 css class명.
		, SELECTION						: "selection" // originalSelectBox 에 추가될 css class명.
		, OPTION_GROUP				: "optionGroup" // designSelectBox의 optionGroup 역할을 element 에 부여될 css class명.
		, OPTION							: "option" // designSelectBox 의 option 역할을 하는 element 에 부여될 css class명.
		, OPTION_SELECTED		: "selected" // CLS_NAME_SELECTBOX_DESIGN_OPTION_ITEM 에 해당하는 element 에 checked 될 때 추가될 css class명.
	}

	var EventModel = {};
	EventModel.OPTION_SELECTED = "EventModel.OPTION_SELECTED"; // designSelectBox 의 option 을 select 했을때 dispatch 되는 이벤트명.
	EventModel.OPEN_SELECTBOX = "EventModel.OPEN_SELECTBOX"; // designSelectBox 가 open 되어야 할 때 dispatch 되는 이벤트명.
	EventModel.CLOSE_SELECTBOX = "EventModel.CLOSE_SELECTBOX"; // designSelectBox 가 close 되어야 할 때 dispatch 되는 이벤트명.

	var _designSelectBoxArr = null;

	/**
	Component select 와 1:1로 대응하는 Design select 를 생성합니다. 
	@class EXSelectBox
	@static
	*/

		
	/**
	EXSelectBox 객체를 초기화 합니다.
	@method init
	@public
	@param originalSelectClassName {String} exper 에서 제공하고 파싱하는 클래스가 아닌 직접 지정 가능한 className
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title></title>
		<link type="text/css" rel="stylesheet" href="../../experCSS/exper.css" />
		<script type="text/javascript" src="../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.includeBegin("../../experJS");
			EX.include("ui/EXSelectBox");
			EX.includeEnd();
			EX.ready(function(){

				EXSelectBox.init(); // EXSelectBox initialize

			});
		})();
		</script>

		<!--Test - original visible //-->
		<style>
		select.exUIKit_selectBox { visibility:visible; position:static; left:0; }
		</style>

		</head>
		<body>
			<select id="testSelectBox1" name="selectBox1" class="exUIKit_selectBox">
				<option>가</option>
				<option>나나</option>
				<option>다다다</option>
				<option>안녕하세요</option>
				<option>이윤석 입니다.</option>
			</select>
			<select id="testSelectBox2" name="selectBox2" class="exUIKit_selectBox">
				<option>AA</option>
				<option>BBBB</option>
				<option>CCCCCC</option>
				<option>Hello javascript</option>
				<option>molgga</option>
			</select>
			<select id="testSelectBox3" name="selectBox3" class="exUIKit_selectBox">
				<option>123</option>
				<option>456</option>
				<option selected="selected">7890</option>
			</select>
			<select id="testSelectBox4" name="selectBox4" class="exUIKit_selectBox" disabled="disabled">
				<option>11111111</option>
				<option>22222222</option>
				<option>3</option>
				<option>4</option>
				<option>5</option>
				<option>6</option>
				<option>7</option>
			</select>
		</body>
		</html>
	*/
	exports.init = function(originalSelectClassName){
		if(window.EXEventListener != undefined){
			EXEventListener = window.EXEventListener;
		}
		if(originalSelectClassName != undefined){
			ClassOf.SELECTBOX = originalSelectClassName;
		}
		_designSelectBoxArr = [];
		var selectArr = CssQuery("." + ClassOf.SELECTBOX);
		var len = selectArr.length;
		var selectBox = null;
		var originalSelectBox = null;
		for(var i = 0 ; i < len ; i++){
			originalSelectBox = selectArr[i];
			if(originalSelectBox.is_exUIKit_selectBox == true) continue; //ajax 중첩 호출. 테스트.

			selectBox = new exports.SelectBox();
			selectBox.init( originalSelectBox );
			_designSelectBoxArr.push(selectBox);
		}

		EXEventListener.add( EventModel , EventModel.OPEN_SELECTBOX , publicEventHandler);
		EXEventListener.add( EventModel , EventModel.CLOSE_SELECTBOX , publicEventHandler);
	};
	
	/**
	지정된 select 객체를 다시 생성합니다.
	@method remake
	@public
	@param originalSelectBox {HTMLSelectElement} 다시 생성할 select 객체
	*/
	exports.remake = function(originalSelectBox){
		var len = _designSelectBoxArr.length;
		var selectBox = null;
		var remakeSelectBox = null;
		for(var i = 0 ; i < len ; i++){
			selectBox = _designSelectBoxArr[i];
			if(selectBox.getOriginalSelectBox() == originalSelectBox){
				if(Model.currentOpenSelectBox == originalSelectBox){
					Model.currentOpenSelectBox = null;
				}
				selectBox.destroy();
				selectBox = null;
				_designSelectBoxArr.splice(i,1);
				remakeSelectBox = new exports.SelectBox();
				remakeSelectBox.init( originalSelectBox );
				_designSelectBoxArr.push(remakeSelectBox);
				break;
			}
		}
	};
	
	/**
	Design Component 로 생성된 객체(들)를 배열 형태로 반환합니다.
	@method getList
	@public
	@return {Array}
	*/
	exports.getList = function(){
		return _designSelectBoxArr;
	};
	/**
	Design Component 로 생성된 객체(들)의 총 갯수를 반환합니다.
	@method getLength
	@public
	@return {integer}
	*/
	exports.getLength = function(){
		return _designSelectBoxArr.length;
	};

	/**
	EXSelectBox 객체의 자원을 모두 해제하고 파기 합니다.
	@method destroy
	@public
	*/
	exports.destroy = function(){
		try{
			//EX.debug("destroy EXSelectBox");
			Model.currentOpenSelectBox = null;
			var len = _designSelectBoxArr.length;
			var selectBox = null;
			var originalSelectBox = null;
			for(var i = 0 ; i < len ; i++){
				selectBox = _designSelectBoxArr.shift();
				if(selectBox != null){
					selectBox.destroy();
					selectBox = null;
				}
			}
			
			EXEventListener.remove( EventModel , EventModel.OPEN_SELECTBOX , publicEventHandler);
			EXEventListener.remove( EventModel , EventModel.CLOSE_SELECTBOX , publicEventHandler);
		}catch(e){
			//EX.debug("destroy EXSelectBox " + e);
		}
	};
	
	/**
	designSelectBox 에서 일어나는 전역 이벤틀 핸들링 합니다.
	@method publicEventHandler
	@private
	@param evt {EXEvent} Event 객체.
	*/
	function publicEventHandler(evt){
		//EX.debug("EXSelectBox publicEventHandler " + evt.type);
		switch(evt.type){
			case EventModel.OPEN_SELECTBOX :
				// selectBox 를 열어야 할때 dispatch 되는 이벤트를 dispatch 하는 designSelectBox 가 자신을 참조값으로 보냅니다.
				
				if(Model.currentOpenSelectBox != null){
					Model.currentOpenSelectBox.setOpen(false);
					EXEventListener.remove( document , "mousedown" , documentEventHandler);
					Model.currentOpenSelectBox = null;
				}
				Model.currentOpenSelectBox = evt.dataObject.selectBox; // designSelectBox 가 자신을 참조값으로 보냅니다.
				Model.currentOpenSelectBox.setOpen(true);

				//setTimeout(function(){
					//EXEventListener.add( document , "mousedown" , documentEventHandler);
				//} , 1);
				break;

			case EventModel.CLOSE_SELECTBOX :
				//EXEventListener.remove( document , "mousedown" , documentEventHandler);
				var selectBox = evt.dataObject.selectBox;
				selectBox.setOpen(false);
				Model.currentOpenSelectBox = null;
				break;
		}
	}

	/**
	@method documentEventHandler
	@private
	@param evt {EXEvent} Event 객체.
	*/
	function documentEventHandler(evt){
		//EX.debug("EXSelectBox documentEventHandler " + evt.type);
		EXEventListener.remove( document , "mousedown" , documentEventHandler);
		if(Model.currentOpenSelectBox != null){
			Model.currentOpenSelectBox.setOpen(false);
			Model.currentOpenSelectBox = null;
		}
	}

	/**
	@class EXSelectBox.SelectBox
	@private
	@constructor
	*/
	exports.SelectBox = function(){
		var _this = document.createElement("span");
		var _originalSelectBox = null;
		var _selectFocusBox = null;

		var _optionScrollView = null;
		var _selectOptionGroupContainer = null; 
		var _selectOptionScrollView = null;
		var _selectOptionGroup = null;

		var _autoCloseTimer = null;
		
		var _initiSelection = false;
		var _isDisabled = false;

		/**
		해당 객체를 초기화 합니다.
		@method init
		@public
		@param originalSelectBox {HTMLElement} 해당 객체에서 참조(1:1 대응)할 originalSelectBox 객체.
		*/
		_this.init = function(originalSelectBox){
			//EX.debug("SelectBox init");
			_originalSelectBox = originalSelectBox;
			_originalSelectBox.is_exUIKit_selectBox = true;
			_selectFocusBox = document.createElement("span");
			_selectFocusBox.className = ClassOf.SELECTION;
			EXElement.addClass( _this , ClassOf.SELECTBOX );
			EXElement.addClass( _this , ClassOf.SELECTBOX_DESIGN );

			_selectOptionGroupContainer = document.createElement("div");
			_selectOptionGroupContainer.className = "optionContainer";
			_selectOptionScrollView = document.createElement("div");
			_selectOptionScrollView.className = "optionScrollView";
			_selectOptionGroup = new exports.SelectBoxOptionGroup();
			_selectOptionGroup.init(_originalSelectBox);
			
			var originOffsetWidthPixel = _originalSelectBox.offsetWidth + Model.PADDING_RIGHT_WIDTH + "px";
			var originOffsetHeightPixel = _originalSelectBox.offsetHeight + "px";
			_this.style.width =  originOffsetWidthPixel;
			_this.style.height = originOffsetHeightPixel;
			_selectFocusBox.style.width = originOffsetWidthPixel;
			_selectFocusBox.style.height = originOffsetHeightPixel;
			if(_originalSelectBox.style.lineHeight != ""){
				_this.style.lineHeight = _originalSelectBox.style.lineHeight;
			}else{
				_this.style.lineHeight = originOffsetHeightPixel;
			}
			//if(parseInt(originOffsetHeightPixel) < Model.OPTION_ITEM_BASE_HEIGHT){
				//_selectOptionGroup.style.lineHeight = Model.OPTION_ITEM_BASE_HEIGHT + "px";
			//}
			_selectOptionGroupContainer.style.top = originOffsetHeightPixel;
			_selectOptionGroupContainer.style.width = originOffsetWidthPixel;
			//if(_selectOptionGroup.getOptions().length > 4) _selectOptionGroup.style.height = Model.OPTION_GROUP_OVERFLOW_HEIGHT + "px";


			EXElement.addClass( _originalSelectBox , ClassOf.SELECTBOX_ORIGINAL );

			_selectOptionGroupContainer.style.visibility = "hidden";

			var parentNode = _originalSelectBox.parentNode;
			_selectOptionGroupContainer.appendChild(_selectOptionScrollView);
			_selectOptionScrollView.appendChild(_selectOptionGroup);
			_this.appendChild(_selectOptionGroupContainer);
			_this.appendChild(_selectFocusBox);
			parentNode.replaceChild( _this , _originalSelectBox );
			parentNode.appendChild(_originalSelectBox);

			_optionScrollView = new EXScrollView();
			_optionScrollView.init( _selectOptionScrollView , _selectOptionGroup);
			
			_selectOptionGroupContainer.style.visibility = "visible";
			_selectOptionGroupContainer.style.display = "none";

			_this.setDisabled(_originalSelectBox.disabled);

			//EXEventListener.add( _this , "mousedown" , interactionEXSelectBoxEventHandler , true);
			EXEventListener.add( _selectFocusBox , "mousedown" , interactionEXSelectBoxEventHandler);
			EXEventListener.add( _this , "mouseover" , interactionEXSelectBoxEventHandler);
			EXEventListener.add( _this , "mouseout" , interactionEXSelectBoxEventHandler);
			EXEventListener.add( _originalSelectBox , "change" , interactionOriginalEventHandler);
			if(_originalSelectBox.addEventListener){
				EXEventListener.add( _originalSelectBox , "DOMSubtreeModified" , domChangeEventHandler);
			}else if(_originalSelectBox.attachEvent){
				_originalSelectBox.attachEvent( "onpropertychange" , domChangeEventHandler);
			}
			EXEventListener.add( _selectOptionGroup , EventModel.OPTION_SELECTED , interactionSelectOptionGroupEventHandler);

			_autoCloseTimer = new EXTimer(800 , 1);
			_autoCloseTimer.addListener( EXTimer.EVENT_TIMER , autoCloseTimerEventHandler );
			optionSelectByIndex(_originalSelectBox.selectedIndex , true);
		}

		function autoCloseTimerEventHandler(){
			//EX.debug("SelectBox autoCloseTimerEventHandler");
			EXEventListener.dispatch( EventModel , new EXCustomEvent( EventModel.CLOSE_SELECTBOX , { selectBox : _this } ));
		}
		
		/**
		designSelectBox 의 optionGroup 을 열거나 닫습니다.
		@method setOpen
		@public
		@param open {boolean}
		*/
		_this.setOpen = function(open){
			//EX.debug("SelectBox setOpen");
			if(open == true){
				EXElement.addClass(_this , "open");
				//EXElement.addClass(_selectFocusBox , "open");
				_selectOptionGroup.setOpen(true);
			}else{
				EXElement.removeClass(_this , "open");
				//EXElement.removeClass(_selectFocusBox , "open");
				_selectOptionGroup.setOpen(false);
			}
		}

		/**
		designSelectBox 를 disabled , enabled 처리를 합니다.
		@method setDisabled
		@public
		@param disable {boolean}
		*/
		_this.setDisabled = function(disable){
			//EX.debug("SelectBox setDisabled");
			if(disable == true){
				EXElement.addClass( _this , "disabled");
			}else{
				EXElement.removeClass( _this , "disabled");
			}
			_isDisabled = disable;
		}

		/**
		designSelectBox 의 interaction 을 핸들링 합니다.
		@method interactionSelectOptionGroupEventHandler
		@private
		@param evt {EXEvent} Event 객체.
		*/
		function interactionSelectOptionGroupEventHandler(evt){
			//EX.debug("SelectBox interactionSelectOptionGroupEventHandler" , evt.type);
			switch(evt.type){
				case EventModel.OPTION_SELECTED :
					optionSelectByIndex(evt.dataObject.index);
					break;
			}
		}
		
		/**
		designSelectBox 의 interaction 을 핸들링 합니다.
		@method interactionEXSelectBoxEventHandler
		@private
		@param evt {EXEvent} Event 객체.
		*/
		function interactionEXSelectBoxEventHandler(evt){
			//EX.debug("SelectBox interactionEXSelectBoxEventHandler " , evt.type);
			switch(evt.type){
				case "mouseover" :
					_autoCloseTimer.stop();
					break;
				case "mouseout" :
					_autoCloseTimer.start();
					break;
				case "mousedown" : 
					if(_isDisabled == true) return;
					evt.preventDefault();
					var isOpen = _selectOptionGroup.isOpen();
					if(isOpen == false){ // optionGroup 가 닫힌 상태일때 EventModel.OPEN_SELECTBOX 이벤트를 dispatch 하여 자신(optionGroup) open 요청.
						EXEventListener.dispatch( EventModel , new EXCustomEvent( EventModel.OPEN_SELECTBOX , { selectBox : _this } ));
					}else{ // optionGroup 가 닫힌 상태일때 EventModel.CLOSE_SELECTBOX 이벤트를 dispatch 하여 자신(optionGroup) close 요청.
						EXEventListener.dispatch( EventModel , new EXCustomEvent( EventModel.CLOSE_SELECTBOX , { selectBox : _this } ));
					}
					break;
			}
		}
		
		/**
		originalSelectBox 의 interaction 을 핸들링 합니다.
		@method interactionOriginalEventHandler
		@private
		@param evt {EXEvent} Event 객체.
		*/
		function interactionOriginalEventHandler(evt){
			//EX.debug("SelectBox interactionOriginalEventHandler" , evt.type);
			switch(evt.type){
				case "change" :
					var optionText = _selectOptionGroup.optionSelectByIndex(_originalSelectBox.selectedIndex);
					_selectFocusBox.innerHTML = optionText;
					break;
			}
		}

		function domChangeEventHandler(evt){
			_this.setDisabled(_originalSelectBox.disabled);
		}

		/**
		originalSelectBox 와 designSelectBox 의 selected 처리를 합니다.
		@method optionSelectByIndex
		@private
		@param index {integer} selected 처리할 option 의 index.
		@param initial {boolean} 최초 실행인지를 판단.
		*/
		function optionSelectByIndex(index , initial){
			//EX.debug("SelectBox optionSelectByIndex");
			if(_originalSelectBox.selectedIndex == index && initial != true) return;

			if(_initiSelection == false){
				_initiSelection = true;
				var optionText = _selectOptionGroup.optionSelectByIndex(_originalSelectBox.selectedIndex);
				_selectFocusBox.innerHTML = optionText;
				return;
			}

			_originalSelectBox.options[index].selected = "selected";
			if(_originalSelectBox.onchange) _originalSelectBox.onchange();
			EXEventListener.dispatch( _originalSelectBox , new EXCustomEvent("change"));
			EXEventListener.dispatch( EventModel , new EXCustomEvent( EventModel.CLOSE_SELECTBOX , { selectBox : _this } ));
		}

		_this.getOriginalSelectBox = function(){
			//EX.debug("SelectBox getOriginalSelectBox");
			return _originalSelectBox;
		};

		_this.destroy = function(){
			try{
				//EX.debug("destroy SelectBox");
				if(_autoCloseTimer != null){
					_autoCloseTimer.removeListener( EXTimer.EVENT_TIMER , autoCloseTimerEventHandler );
					_autoCloseTimer.stop();
					_autoCloseTimer.destroy();
					_autoCloseTimer = null;
				}
			
				if(_selectOptionGroup != null){
					EXEventListener.remove( _selectOptionGroup , EventModel.OPTION_SELECTED , interactionSelectOptionGroupEventHandler);
					_selectOptionGroup.destroy();
					_selectOptionGroup = null;
				}
				_this.setDisabled(_originalSelectBox.disabled);
				if(_originalSelectBox != null){
					_originalSelectBox.is_exUIKit_selectBox = false;
					EXElement.removeClass( _originalSelectBox , ClassOf.SELECTBOX_ORIGINAL );
					EXEventListener.remove( _originalSelectBox , "change" , interactionOriginalEventHandler);
					if(_originalSelectBox.addEventListener){
						EXEventListener.remove( _originalSelectBox , "DOMSubtreeModified" , domChangeEventHandler);
					}else if(_originalSelectBox.attachEvent){
						_originalSelectBox.detachEvent("DOMSubtreeModified" , domChangeEventHandler);
					}
					var parentNode = _originalSelectBox.parentNode;
					parentNode.replaceChild( _originalSelectBox , _this );
					//parentNode.removeChild(_this);
				}

				EXEventListener.remove( _this , "mousedown" , interactionEXSelectBoxEventHandler , true);
			}catch(e){
				//EX.debug("destroy SelectBox " + e);
			}
		};


		return _this;
	} // end SelectBox

	/**
	originalSelectBox 의 optionGroup 역할을 하는 객체.
	실제로는 originalSelectBox 에 group 태그는 존재하지 않지만,
	option 의 scroll , open , close 등의 group 기능이 요구됨에 따라 정의된 객체입니다.
	@class EXSelectBox.SelectBoxOptionGroup
	@private
	@constructor
	*/
	exports.SelectBoxOptionGroup = function(){
		var _this = document.createElement("ul");
		var _isOpen = false;
		var _currentSelectOption = null;
		var _optionArr = null;

		/**
		해당 객체를 초기화 합니다.
		@method init
		@public
		@param originalSelectBox {HTMLElement} 해당 객체에서 참조할 originalSelectBox.
		*/
		_this.init = function(originalSelectBox){
			//EX.debug("SelectBoxOptionGroup init");
			_optionArr = [];
			_this.className = ClassOf.OPTION_GROUP;
			var optionArr = originalSelectBox.options;
			var len = optionArr.length;
			var optionObj = null;
			var selectOption = null;
			for(var i = 0 ; i < len ; i++){
				optionObj = optionArr[i];
				selectOption = new exports.SelectBoxOption();
				selectOption.init(optionObj);
				
				_this.appendChild(selectOption);
				_optionArr.push(selectOption);
				EXEventListener.add( selectOption , "mousedown" , interactionOptionEventHandler);
			}
			EXEventListener.add( _this , "scroll" , interactionOptionGroupEventHandler);
		}

		/**
		optionGroup 에 속한 options 을 배열 형태로 반환합니다.
		@method getOptionByIndex
		@public
		@return {Array}
		*/
		_this.getOptions = function(){ return _optionArr; }

		/**
		optionGroup 에 속한 options 중 지정된 index 에 해당하는 option 객체를 반환합니다.
		@method getOptionByIndex
		@public
		@param index {integer} 반환 받을 option 객체의 index.
		@return {SelectBoxOption}
		*/
		_this.getOptionByIndex = function(index){ return _optionArr[index]; }

		/**
		optionGroup 에 속한 options 중 지정된 selectIndex 를 selected 처리하고,
		이전 selected 상태였던 option 객체를 unselected 처리 합니다.
		@method optionSelectByIndex
		@public
		@return {String} selected 된 SelectBoxOption 객체의 value 속성값을 반환합니다.
		*/
		_this.optionSelectByIndex = function(selectIndex){
			//EX.debug("SelectBoxOptionGroup optionSelectByIndex");
			if(_currentSelectOption != null){
				_currentSelectOption.setSelected(false);
			}
			_currentSelectOption = _optionArr[selectIndex];
			if(_currentSelectOption != null){
				_currentSelectOption.setSelected(true)
				return _currentSelectOption.getText();
			}
			return null;
		}

		/**
		optionGroup 의 열림 상태를 반환합니다.
		@method isOpen
		@public
		@return {boolean}
		*/
		_this.isOpen = function(){ return _isOpen; }

		/**
		optionGroup 을 열거나 닫습니다. css class 를 부여하거나 제거하여 view 처리를 변경합니다.
		@method setOpen
		@public
		@param open {boolean}
		@return {boolean}
		*/
		_this.setOpen = function(open){
			//EX.debug("SelectBoxOptionGroup setOpen");
			if(open == true){
				//EXElement.addClass( _this , "open");
			}else{
				//EXElement.removeClass( _this , "open");
			}
			_isOpen = open;
			return _isOpen;
		}
		
		/**
		해당 객체의 interaction 이벤트를 핸들링 합니다.
		@method interactionOptionGroupEventHandler
		@private
		@param evt {EXEvent} Event 객체.
		*/
		function interactionOptionGroupEventHandler(evt){
			//EX.debug("SelectBoxOptionGroup interactionOptionGroupEventHandler" , evt.type);
			switch(evt.type){
				case "scroll" :
					//optionGroup 의 scroll(touchmove에 의해 일어나는) 시 event 가 버블링 되게 되면, document 와 같이 상위 scroll able 객체가 scroll 되게 됩니다. 이를 해결 합니다.
					evt.preventDefault(); // 이벤트 기본 동작 무시.
					evt.stopPropagation(); // 이벤트 전파 중지.
					break;
			}
		}
		
		/**
		optionGroup 에 속한 option 객체의 interaction 이벤트를 핸들링 합니다.
		@method interactionOptionEventHandler
		@private
		@param evt {EXEvent} Event 객체.
		*/
		function interactionOptionEventHandler(evt){
			//EX.debug("SelectBoxOptionGroup interactionOptionEventHandler" , evt.type);
			var optionObj = evt.currentTarget;
			switch(evt.type){
				case "mousedown" :
					// option 이 select 될 때 상위 객체에서 제어 가능하도록 EventModel.OPTION_SELECTED 이벤트를 dispatch 합니다.
					EXEventListener.dispatch( _this , new EXCustomEvent( EventModel.OPTION_SELECTED , { index: optionObj.getIndex() }));
					break;
			}
		}

		_this.destroy = function(){
			try{
				//EX.debug("destroy SelectBoxOptionGroup");
				var len = _optionArr.length;
				var selectOption = null;
				for(var i = 0 ; i < len ; i++){
					selectOption = _optionArr.shift();
					if(_optionArr != null){
						EXEventListener.remove( selectOption , "mousedown" , interactionOptionEventHandler);
						selectOption.destroy();
						selectOption = null;
					}
				}
				_currentSelectOption = null;
				EXEventListener.remove( _this , "scroll" , interactionOptionGroupEventHandler);
			}catch(e){
				//EX.debug("destroy SelectBoxOptionGroup " + e);
			}
		}

		return _this;
	} // end SelectBoxOptionGroup
	
	/**
	originalSelectBox 의 option 역할을 하는 객체.
	@class EXSelectBox.SelectBoxOption
	@private
	@constructor
	*/
	exports.SelectBoxOption = function(){
		var _this = document.createElement("li");
		var _isSelected = false;
		var _value = "";
		var _innerText = "";
		var _index = -1;

		/**
		해당 객체를 초기화 합니다.
		optionObj 객체를 부여 받아 필요한 속성을 담습니다.
		@method init
		@public
		@param optionObj {HTMLElement} originalSelectBox 에서 해당 객체가 생성될때 참조(1:1로 대응)할 option 객체.
		*/
		_this.init = function(optionObj){
			//EX.debug("SelectBoxOption init");
			_this.className = ClassOf.OPTION;
			_value = optionObj.value;
			_index = optionObj.index;
			_innerText = optionObj.text;
			_this.innerHTML = _innerText
			_this.index = _index;
		}
		
		/**
		option 생성시 originalSelectBox 의 option 중 해당 객체가 대응하는 option 의 value 를 반환합니다.
		@method getValue
		@public
		@return {String} option 의 value 값을 반환.
		*/
		_this.getValue = function(){
			return _value;
		}

		/**
		option 생성시 originalSelectBox 의 option 중 해당 객체가 대응하는 option 의 index 를 반환합니다.
		@method getIndex
		@public
		@return {integer} option 의 selectIndex 값을 반환.
		*/
		_this.getIndex = function(){
			return _index;
		}

		/**
		option 생성시 originalSelectBox 의 option 중 해당 객체가 대응하는 option 의 text 를 반환합니다.
		@method getText
		@public
		@return {String} option 의 text 값을 반환.
		*/
		_this.getText = function(){
			return _innerText;
		}

		/**
		option 의 selected 기능.
		@method setSelected
		@public
		@param select {boolean} checked , unchecked
		@return {boolean} checked 여부를 반환.
		*/
		_this.setSelected = function(select){
			//EX.debug("SelectBoxOption setSelected");
			if(select == true){
				EXElement.addClass(_this , ClassOf.OPTION_SELECTED);
			}else{
				EXElement.removeClass(_this , ClassOf.OPTION_SELECTED);
			}
			_isSelected = select;
			return _isSelected;
		}

		_this.destroy = function(){
			try{
				//EX.debug("destroy SelectBoxOption");
			}catch(e){
				//EX.debug("destroy SelectBoxOption " + e);
			}
		}

		return _this;
	} // end SelectBoxOption
});