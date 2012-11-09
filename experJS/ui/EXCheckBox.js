define(function(require , exports){
	var CssQuery = require("../vender/CssQuery");
	var EXElement = require("../utils/EXElement");
	var EXEventListener = require("../events/EXEventListener");

	var ClassOf = {
		CHECKBOX : "exUIKit_checkBox"
		, ORIGINAL_CHECKBOX_ADD : "original"
		, DESIGN_CHECKBOX : "checkBtn"
		, DESIGN_CHECKBOX_VIEW : "checkBox"
		, DESIGN_CHECKBOX_VIEW_CHECKED : "checked"
		, DESIGN_CHECKBOX_VIEW_DISABLED : "disabled"
	};

	var _designCheckBoxArr = null;
		
	/**
	DeisgnCheckBox 를 초기화 합니다.
	@method init
	@param originalCheckBoxClassName {String}
	*/
	exports.init = function(originalCheckBoxClassName){
		if(window.EXEventListener != undefined){
			EXEventListener = window.EXEventListener;
		}
		if(originalCheckBoxClassName != undefined){
			ClassOf.CHECKBOX = originalCheckBoxClassName;
		}
		_designCheckBoxArr = [];
		var checkBoxArr = CssQuery( "." + ClassOf.CHECKBOX );
		var len = checkBoxArr.length;
		var designCheckBox = null;
		var orignCheckBox = null;
		for(var i = 0 ; i < len ; i++){
			orignCheckBox = checkBoxArr[i];

			if(orignCheckBox.is_experCSS_designUI_checkBox == true) continue; //ajax 중첩 호출. 테스트.

			designCheckBox = new CheckBox();
			designCheckBox.init(orignCheckBox);
			_designCheckBoxArr.push(designCheckBox);
		}
	}

	/**
	@method destroy
	*/
	exports.destroy = function(){
		try{
			var len = _designCheckBoxArr.length;
			var designCheckBox = null;
			for(var i = 0 ; i < len ; i++){
				designCheckBox = _designCheckBoxArr.shift();
				if(designCheckBox != null){
					designCheckBox.destroy();
					designCheckBox = null;
				}
			}
		}catch(e){
		}finally{
			_designCheckBoxArr = null;
		}
	}


	/**
	CheckBox 를 생성합니다.
	originalCheckBox 한 개에 대응하는 designCheckBox 를 만들어 냅니다.
	@class hcap.ui.DesignCheckBox.CheckBox
	@private
	@constructor
	*/
	function CheckBox(){
		var _this = document.createElement("span");
		var _originalCheckBox = null;
		var _checkedBox = null;

		var _isDisabled = false;
		var _isChecked = false;
		
		/**
		designCheckBox 에서 대응하는(참조한) originalCheckBox 를 반환합니다.
		@method getOriginal
		@public
		@return {HTMLElement} originalCheckBox 를 반환합니다.
		*/
		_this.getOriginal = function(){
			return _originalCheckBox;
		}
		
		/**
		해당 객체를 초기화 합니다.
		@method init
		@public
		@param originalCheckBox {HTMLElement} 참조할 originalCheckBox.
		*/
		_this.init = function(originalCheckBox){
			_originalCheckBox = originalCheckBox;
			_originalCheckBox.is_experCSS_designUI_checkBox = true;
			_isChecked = (_originalCheckBox.checked == true) ? true : false;
			_checkedBox = document.createElement("span");
			
			//_this.className = ClassOf.DESIGN_CHECKBOX;
			EXElement.addClass(_this , ClassOf.CHECKBOX);
			EXElement.addClass(_this , ClassOf.DESIGN_CHECKBOX);
			_checkedBox.className = ClassOf.DESIGN_CHECKBOX_VIEW;
			EXElement.addClass(_originalCheckBox , ClassOf.ORIGINAL_CHECKBOX_ADD);

			_this.appendChild(_checkedBox);
			var parentNode = _originalCheckBox.parentNode;
			parentNode.replaceChild( _this , _originalCheckBox );
			parentNode.appendChild( _originalCheckBox );

			EXEventListener.add( _this , "click" , interactionDeisgnCheckBoxEventHandler);
			EXEventListener.add( _originalCheckBox , "click" , interactionOriginalCheckBoxEventHandler);
			if(_originalCheckBox.addEventListener){
				EXEventListener.add( _originalCheckBox , "DOMSubtreeModified" , eventDomChange );
			}else if(_originalCheckBox.attachEvent){
				_originalCheckBox.attachEvent("onpropertychange" , eventDomChange);
			}

			_this.setDisabled(_originalCheckBox.disabled);
			if(_isChecked == true) _this.setDesignChecked(true);
		}

		/**
		designCheckBox 의 checked 기능.
		@method setDesignChecked
		@public
		@param check {boolean} check , uncheck 에 따라 css 클래스를 부여하여 view 처리를 합니다.
		*/
		_this.setDesignChecked = function(check){
			if(check == true){
				EXElement.addClass( _checkedBox , ClassOf.DESIGN_CHECKBOX_VIEW_CHECKED);
			}else{
				EXElement.removeClass( _checkedBox , ClassOf.DESIGN_CHECKBOX_VIEW_CHECKED);
			}
		}

		/**
		designCheckBox 의 interaction 을 핸들링 합니다.
		click 시 실제 동작은 originalCheckBox 를 click 시킴으로써
		designCheckBox 와 originalCheckBox 의 click 시 일어나는 동작을 같은 동일하게 할 수 있도록 합니다.
		designCheckBox 의 click 이벤트는 실제로는 interactionOriginalCheckBoxEventHandler 메소드로 전이 되는것과 같습니다.
		@method interactionDeisgnCheckBoxEventHandler
		@private
		@param evt {EventVW.Event} 이벤트 객체.
		*/
		function interactionDeisgnCheckBoxEventHandler(evt){
			switch(evt.type){
				case "click" :
					_originalCheckBox.click();
					break;
			}
		}

		/**
		originalCheckBox 의 interaction 을 핸들링 합니다.
		@method interactionOriginalCheckBoxEventHandler
		@private
		@param evt {EventVW.Event} 이벤트 객체.
		*/
		function interactionOriginalCheckBoxEventHandler(evt){
			switch(evt.type){
				case "click" :
					setToggleChecked();
					break;
			}
		}
		/**
				case "DOMSubtreeModified" :
					//_originalCheckBox 의 disabled 와 같은 속성이 변경되거나 부여될 때 이벤트
					break;
		@method
		@private
		@param 
		*/
		function eventDomChange(evt){
			_this.setDisabled( _originalCheckBox.disabled );
		}

		/**
		_originalCheckBox 를 disabled , enabled 처리를 합니다.
		@method setDisabled
		@public
		@param value {boolean}
		*/
		_this.setDisabled = function(value){
			if(value == true){
				EXElement.addClass( _this , ClassOf.DESIGN_CHECKBOX_VIEW_DISABLED );
			}else{
				EXElement.removeClass( _this , ClassOf.DESIGN_CHECKBOX_VIEW_DISABLED  );
			}
			_isDisabled = value;
		}
		/**
		_originalCheckBox 를 checked 처리를 합니다.
		@method setChecked
		@public
		@param value {boolean}
		*/
		_this.setChecked = function(value){
			if(value == true){
				EXElement.addClass( _checkedBox , ClassOf.DESIGN_CHECKBOX_VIEW_CHECKED );
			}else{
				EXElement.removeClass( _checkedBox , ClassOf.DESIGN_CHECKBOX_VIEW_CHECKED );
			}
			_isChecked = value;
		}

		/**
		designCheckBox 와 originalCheckBox 의 checked 상태를 변경합니다.
		@method setToggleChecked
		@private
		@return {boolean}
		*/
		function setToggleChecked(){
			if(_isChecked == false){
				EXElement.addClass( _checkedBox , ClassOf.DESIGN_CHECKBOX_VIEW_CHECKED);
			}else{
				EXElement.removeClass( _checkedBox , ClassOf.DESIGN_CHECKBOX_VIEW_CHECKED);
			}
			_isChecked = !_isChecked;
			_originalCheckBox.checked = _isChecked;
			return _isChecked;
		}

		/**
		@method destroy
		@public
		*/
		_this.destroy = function(){
			try{
				EXEventListener.remove( _this , "click" , interactionDeisgnCheckBoxEventHandler);
				if(_originalCheckBox != null){
					EXEventListener.remove( _originalCheckBox , "click" , interactionOriginalCheckBoxEventHandler);
					if(_originalCheckBox.addEventListener){
						EXEventListener.remove( _originalCheckBox , "DOMSubtreeModified" , eventDomChange );
					}else if(_originalCheckBox.attachEvent){
						_originalCheckBox.detachEvent("onpropertychange" , eventDomChange);
					}
					_originalCheckBox.is_experCSS_designUI_checkBox = false;
					EXElement.removeClass(_originalCheckBox , ClassOf.ORIGINAL_CHECKBOX_ADD);
				}

				//_this.className = ClassOf.DESIGN_CHECKBOX;
				EXElement.removeClass(_this , ClassOf.CHECKBOX);
				EXElement.removeClass(_this , ClassOf.DESIGN_CHECKBOX);

				var parentNode = _originalCheckBox.parentNode;
				parentNode.replaceChild( _originalCheckBox , _this);
				//parentNode.removeChild( _this );
			}catch(e){
			}
		}
		return _this;
	} // end CheckBox
});