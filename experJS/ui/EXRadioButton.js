define(function(require , exports){
	
	var CssQuery = require("../vender/CssQuery");
	var EXElement = require("../utils/EXElement");
	var EXEventListener = require("../events/EXEventListener");
	var EXCustomEvent = require("../events/EXCustomEvent");

	var ClassOf = {
		RADIO_GROUP : "exUIKit_radioGroup"
		, ORIGINAL_ADD : "original"
		, DESIGN_RADIO : "radioBtn"
		, DESIGN_RADIO_VIEW : "radio"
		, DESIGN_RADIO_VIEW_CHECKED : "checked"
	};

	var EventModel = {};
	EventModel.RADIO_CHECKED = "EventModel.RADIO_CHECKED"; //designRadio 버튼을 클릭(checked) 했을때 dispatch 될 이벤트명.


	/**
	input type radio(이하 originalRadio) 버튼을 design 가능한 요소(이하 designRadio)로 변경(대체)합니다.
	originalRadio 의 기능을 designRadio 에 그대로 구현하며,
	originalRadio 와 designRadio 동작을 연동합니다.
	예를 들어 originalRadio 를 클릭해도 designRadio 가 클릭 처리 되어야 하며,
	designRadio 를 클릭해도 originalRadio 가 클릭 되도록 처리 됩니다.

	originalRadio 는 강제로 시각적 부분에서만 보이지 않도록 처리되므로,
	back-end 쪽에서는 기본 form 의 사용법 그대로 접근, 사용할 수 있습니다.

	@class hcap.ui.DesignRadioButton
	@public
	@constructor
	*/
	
	var _designRadioButtonArr = null;
	
	/**
	hcap.ui.DesignRadioButton 를 초기화 합니다.
	@method init
	@public
	*/
	exports.init = function(){
		_designRadioButtonArr = [];
		var radioButtonArr = CssQuery( "." + ClassOf.RADIO_GROUP );
		var len = radioButtonArr.length;
		var designRadioButton = null;
		var originalRadioButton = null;
		for(var i = 0; i < len ; i++){
			originalRadioButton = radioButtonArr[i];

			if(originalRadioButton.is_experCSS_designUI_radioGroup == true) continue; //ajax 중첩 호출. 테스트.

			designRadioButton = new RadioButton();
			designRadioButton.init( originalRadioButton );
			_designRadioButtonArr.push(designRadioButton);
		}
		EXEventListener.add( EventModel , EventModel.RADIO_CHECKED , publicEventHandler );
	}

	exports.destroy = function(){
		try{
			var len = _designRadioButtonArr.length;
			var designRadioButton = null;
			for(var i = 0; i < len ; i++){
				designRadioButton = _designRadioButtonArr.shift();
				if(designRadioButton != null){
					designRadioButton.destroy();
					designRadioButton = null;
				}
			}
			EXEventListener.remove( EventModel , EventModel.RADIO_CHECKED , publicEventHandler );
		}catch(e){
		}finally{
			_designRadioButtonArr = null;
		}
	}
	
	/**
	DesignRadioButton 의 전역 이벤트를 핸들링 합니다.
	@method publicEventHandler
	@private
	@param evt {EventVW.Event} 이벤트 객체.
	*/
	function publicEventHandler(evt){
		switch(evt.type){
			case EventModel.RADIO_CHECKED :
				// designRadio 의 click(checked) 이벤트시 designRadio 가 속한 group 의 radio 버튼을 uncheck 합니다.
				var eventData = evt.dataObject;
				radioGroupChecked( eventData.radio , eventData.radioName);
				break;
		}
	}
	
	/**
	DesignRadioButton group checked, unchecked 를 합니다.
	@method radioGroupChecked
	@private
	@param designRadio {DesignRadioButton} designRadio 객체.
	@param radioName {String} designRadio 의 group name.
	*/
	function radioGroupChecked( designRadio , radioName ){
		if(radioName == "") return;
		var len = _designRadioButtonArr.length;
		var designRadioButton = null;
		for(var i = 0; i < len ; i++){
			designRadioButton = _designRadioButtonArr[i];
			if(designRadioButton.getRadioName() == radioName  &&  designRadioButton != designRadio){
				designRadioButton.setDesignChecked(false);
			}
		}
	}












	/**
	RadioButton 객체.
	@class hcap.ui.DesignRadioButton.RadioButton
	@private
	@constructor
	*/
	function RadioButton(){
		var _this = document.createElement("span");
		var _originalRadioButton = null;
		var _radioButton = null;
		var _radioName = "";
		
		var _isDisabled = false;
		var _isChecked = false;

		/**
		해당 객체가 생성될때 참조한 originalRadio 의 group(name) 을 반환합니다.
		@method getRadioName
		@public
		@return {String} radio group name.
		*/
		_this.getRadioName = function(){
			return _radioName;
		}

		/**
		해당 객체를 초기화 합니다.
		originalRadio 한 개에 대응하는 designRadio 를 만들어 냅니다.
		@method init
		@public
		@param originalRadioButton {HTMLElement} 참조될 originalRadio.
		*/
		_this.init = function(originalRadioButton){
			_originalRadioButton = originalRadioButton;
			_originalRadioButton.is_experCSS_designUI_radioGroup = true;
			_isChecked = (_originalRadioButton.checked == true) ? true : false;

			_radioName = _originalRadioButton.name;
			_radioButton = document.createElement("span");


			EXElement.addClass(_this , ClassOf.DESIGN_RADIO );
			EXElement.addClass(_this , ClassOf.RADIO_GROUP );
			_radioButton.className = ClassOf.DESIGN_RADIO_VIEW;
			EXElement.addClass( _originalRadioButton , ClassOf.ORIGINAL_ADD);

			var parentNode = _originalRadioButton.parentNode;
			parentNode.replaceChild( _this , _originalRadioButton );
			parentNode.appendChild( _originalRadioButton );
			_this.appendChild(_radioButton);
			
			EXEventListener.add( _this , "click" , interactionDesignRadioBtnEventHandler );
			EXEventListener.add( _originalRadioButton , "click" , interactionOriginalRadioBtnEventHandler );
			//EXEventListener.add( _originalRadioButton , "DOMSubtreeModified" , interactionOriginalRadioBtnEventHandler );
			if(_originalRadioButton.addEventListener){
				EXEventListener.add( _originalRadioButton , "DOMSubtreeModified" , eventDomChange );
			}else if(_originalRadioButton.attachEvent){
				_originalRadioButton.attachEvent("onpropertychange" , eventDomChange);
			}

			_this.setDisabled(_originalRadioButton.disabled);
			if(_isChecked == true) _this.setDesignChecked(true);
		}

		/**
		designRadio 의 interaction 을 핸들링 합니다.
		click 시 실제 동작은 originalRadio 를 click 시킴으로써
		designRadio 와 originalRadio 의 click 시 일어나는 동작을 같은 동일하게 할 수 있도록 합니다.
		designRadio 의 click 이벤트는 실제로는 interactionOriginalRadioBtnEventHandler 메소드로 전이 되는것과 같습니다.

		@method interactionDesignRadioBtnEventHandler
		@private
		@param evt {EventVW.Event} 이벤트 객체.
		*/
		function interactionDesignRadioBtnEventHandler(evt){
			switch(evt.type){
				case "click" :
					if(_isDisabled == true) return;
					_originalRadioButton.click();
					break;
			}
		}
		
		/**
		originalRadio 의 interaction 을 핸들링 합니다.
		@method interactionOriginalRadioBtnEventHandler
		@private
		@param evt {EventVW.Event} 이벤트 객체.
		*/
		function interactionOriginalRadioBtnEventHandler(evt){
			switch(evt.type){
				case "click" :
					// originalRadio 의 click 이벤트를 핸들리하며, designRadio 가 속한 group 의 checked, unchecked 를 할 수 있도록 
					// EventModel.RADIO_CHECKED 이벤트를 dispatch 합니다.
					if(_isDisabled == true) return;
					if(_isChecked == true) return;
					_this.setDesignChecked(_originalRadioButton.checked);
					EXEventListener.dispatch( EventModel , new EXCustomEvent(EventModel.RADIO_CHECKED , { radio : _this , radioName : _radioName }) );
					break;

			}
		}
		/**
				case "DOMSubtreeModified" :
					//_originalRadioButton 의 disabled 와 같은 속성이 변경되거나 부여될 때 이벤트
					_this.setDisabled(_originalRadioButton.disabled);
					break;
		@method
		@private
		@param 
		*/
		function eventDomChange(evt){
			_this.setDisabled(_originalRadioButton.disabled);
		}

		/**
		designRadio 의 checked 기능.
		@method setDesignChecked
		@private
		@param check {boolean} checked 여부.
		@return {boolean}
		*/
		_this.setDesignChecked = function(check){
			if(check == true){
				EXElement.addClass( _radioButton , ClassOf.DESIGN_RADIO_VIEW_CHECKED);
			}else{
				EXElement.removeClass( _radioButton , ClassOf.DESIGN_RADIO_VIEW_CHECKED);
			}
			_isChecked = _originalRadioButton.checked;
			return _isChecked;
		}

		/**
		_originalRadioButton 를 disabled , enabled 처리를 합니다.
		@method setDisabled
		@public
		@param disable {boolean}
		*/
		_this.setDisabled = function(disable){
			if(disable == true){
				EXElement.addClass( _this , "disabled");
			}else{
				EXElement.removeClass( _this , "disabled");
			}
			_isDisabled = disable;
		}

		/**
		@method destroy
		@public
		*/
		_this.destroy = function(){
			try{
				EXEventListener.remove( _this , "click" , interactionDesignRadioBtnEventHandler );
				if(_originalRadioButton != null){
					_originalRadioButton.is_experCSS_designUI_radioGroup = false;
					EXEventListener.remove( _originalRadioButton , "click" , interactionOriginalRadioBtnEventHandler );
					//EXEventListener.add( _originalRadioButton , "DOMSubtreeModified" , interactionOriginalRadioBtnEventHandler );
					if(_originalRadioButton.addEventListener){
						EXEventListener.remove( _originalRadioButton , "DOMSubtreeModified" , eventDomChange );
					}else if(_originalRadioButton.attachEvent){
						_originalRadioButton.detachEvent("onpropertychange" , eventDomChange);
					}
					EXElement.removeClass( _originalRadioButton , ClassOf.ORIGINAL_ADD);
				}

				EXElement.removeClass(_this , ClassOf.DESIGN_RADIO );
				EXElement.removeClass(_this , ClassOf.RADIO_GROUP );
				var parentNode = _originalRadioButton.parentNode;
				parentNode.replaceChild( _originalRadioButton , _this );
				parentNode.removeChild(_this);
			}catch(e){
			}
		}
		return _this;
	} // end RadioButton
});