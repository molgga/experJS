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
	Component checkbox 와 1:1로 대응하는 Design checkbox 를 생성합니다. 
	@class EXCheckBox
	@static
	*/
		
	/**
	EXCheckBox 를 초기화 합니다.
	@method init
	@param originalCheckBoxClassName {String} exper 에서 제공하고 파싱하는 클래스가 아닌 직접 지정 가능한 className
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
			EX.include("events/EXEventListener");
			EX.include("ui/EXCheckBox");
			EX.includeEnd();
			EX.ready(function(){
				
				EXCheckBox.init();
				
			});
		})();
		</script>

		<!--Test - original visible //-->
		<style type="text/css">
		.exUIKit_checkBox.original { position:static; left:auto; visibility:visible; }
		</style>

		</head>
		<body>
			<div>
				<input id="check1" class="exUIKit_checkBox" disabled="disabled" type="checkbox" />
				<label for="check1">checkBox1</label>
			</div>
			<div>
				<input id="check2" class="exUIKit_checkBox" type="checkbox" />
				<label for="check2">checkBox2</label>
			</div>
			<div>
				<input id="check3" class="exUIKit_checkBox" type="checkbox" />
				<label for="check3">checkBox3</label>
			</div>
		</body>
		</html>
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

			designCheckBox = new exports.CheckBox();
			designCheckBox.init(orignCheckBox);
			_designCheckBoxArr.push(designCheckBox);
		}
	}

	/**
	지정된 checkbox 객체를 다시 생성합니다.
	@method remake
	@public
	@param originalCheckBox {HTMLInputElement} 다시 생성할 checkbox 객체
	*/
	exports.remake = function(originalCheckBox){
		var len = _designCheckBoxArr.length;
		var designCheckBox = null;
		var remakeCheckBox = null;
		for(var i = 0 ; i < len ; i++){
			designCheckBox = _designCheckBoxArr[i];
			if(designCheckBox.getOriginalCheckBox() == originalCheckBox){
				designCheckBox.destroy();
				designCheckBox = null;
				_designCheckBoxArr.splice(i,1);
				remakeCheckBox = new exports.CheckBox();
				remakeCheckBox.init( originalCheckBox );
				_designCheckBoxArr.push(remakeCheckBox);
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
		return _designCheckBoxArr;
	};

	/**
	Design Component 로 생성된 객체(들)의 총 갯수를 반환합니다.
	@method getLength
	@public
	@return {integer}
	*/
	exports.getLength = function(){
		return _designCheckBoxArr.length;
	};

	/**
	EXCheckBox 객체를 파기합니다.
	@method destroy
	@public
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
	EXCheckBox.CheckBox 객체
	originalCheckBox 한 개에 대응하는 designCheckBox 를 만들어 냅니다.
	@class EXCheckBox.CheckBox
	@private
	@constructor
	*/
	exports.CheckBox = function(){
		var _this = document.createElement("span");
		var _originalCheckBox = null;
		var _checkedBox = null;

		var _isDisabled = false;
		var _isChecked = false;
		
		/**
		EXCheckBox 에 의해 생성된(참조한) checkbox의 originalCheckBox 를 반환합니다.
		@method getOriginalCheckBox
		@public
		@return {HTMLInputElement} originalCheckBox 를 반환합니다.
		*/
		_this.getOriginalCheckBox = function(){
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

			EXEventListener.add( _this , "click" , interactionEXCheckBoxEventHandler);
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
		@method interactionEXCheckBoxEventHandler
		@private
		@param evt {EXEvent} 이벤트 객체.
		*/
		function interactionEXCheckBoxEventHandler(evt){
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
		@param evt {EXEvent} 이벤트 객체.
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
				EXEventListener.remove( _this , "click" , interactionEXCheckBoxEventHandler);
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