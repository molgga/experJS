define(function(require , exports){
	var EXToast = require("./EXToast");
	var EXEventListener = require("../events/EXEventListener");
	var CssQuery = require("../vender/CssQuery");

	/**
	HTML input 객체의 type 별 검수를 합니다.
	@class EXValidator
	@constructor
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<title></title>
		<script type="text/javascript" src="../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.includeBegin("../experJS");
			EX.include("ui/EXValidator");
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				var messageChange = true;
				if(messageChange == true){
					EXValidator.message.ENG_ONLY							= "영문 <span class=\"exValidateA\">입력만 가능합니다.</span>";
					EXValidator.message.ENG_LOW_ONLY				= "영문 소문자 <span class=\"exValidateA\">입력만 가능합니다.</span>";
					EXValidator.message.ENG_UPER_ONLY				= "영문 대문자 <span class=\"exValidateA\">입력만 가능합니다.</span>";
					EXValidator.message.NUM_ONLY							= "숫자 <span class=\"exValidateA\">입력만 가능합니다.</span>";
					EXValidator.message.ENG_NUM_ONLY				= "영문 또는 숫자 <span class=\"exValidateA\">입력만 가능합니다.</span>";
					EXValidator.message.ENG_LOW_NUM_ONLY		= "영문 소문자 또는 숫자 <span class=\"exValidateA\">입력만 가능합니다.</span>";
					EXValidator.message.ENG_UPER_NUM_ONLY		= "영문 대문자 또는 숫자 <span class=\"exValidateA\">입력만 가능합니다.</span>";
				}
				EXValidator.initInputType();
			});
		})();
		</script>

		<style type="text/css">
		body { font-family:"돋움"; font-size:0.8em; }
		.exValidateA { color:#bbbbbb; }
		</style>

		</head>
		<body>
			<div>
				<br/><input data-experJS="inputType:eng" type="text" /> <span>eng</span>
				<br/><input data-experJS="inputType:engLow" type="text" /> <span>engLow</span>
				<br/><input data-experJS="inputType:engUper" type="text" /> <span>engUper</span>
				<br/><input data-experJS="inputType:eng,num" type="text" /> <span>eng,num</span>
				<br/><input data-experJS="inputType:engLow,num" type="text" /> <span>engLow,num</span>
				<br/><input data-experJS="inputType:engUper,num" type="text" /> <span>engUper,num</span>
				<br/><input data-experJS="inputType:num" type="text" /> <span>num</span>
			</div>
		</body>
		</html>
	*/

	var DataOf = {
		EXPER_JS  : "data-experJS"
	};

	var PRVENT_CODES = [8,9,13,16,17,20,37,39,46,229];
	
	/**
	EXValidator 의 inputType 별 분류명.
	@property inputTypeOf
	@type {Object}
	*/
	exports.inputTypeOf = {
		ENG_ONLY							: "ENG_ONLY"
		, ENG_LOW_ONLY				: "ENG_LOW_ONLY"
		, ENG_UPER_ONLY				: "ENG_UPER_ONLY"
		, NUM_ONLY							: "NUM_ONLY"
		, ENG_NUM_ONLY					: "ENG_NUM_ONLY"
		, ENG_LOW_NUM_ONLY		: "ENG_LOW_NUM_ONLY"
		, ENG_UPER_NUM_ONLY		: "ENG_UPER_NUM_ONLY"
	};

	/**
	EXValidator 의 inputType 별 정규식 패턴.
	@property inputPattern
	@type {Object}
	*/
	exports.inputPattern = {
		ENG_ONLY							: /^[a-zA-Z]$/
		, ENG_LOW_ONLY				: /^[a-z]$/
		, ENG_UPER_ONLY				: /^[A-Z]$/
		, NUM_ONLY							: /^[0-9]$/
		, ENG_NUM_ONLY					: /^[a-zA-Z0-9]$/
		, ENG_LOW_NUM_ONLY		: /^[a-z0-9]$/
		, ENG_UPER_NUM_ONLY		: /^[A-Z0-9]$/
	};
		
	/**
	EXValidator 를 통과하지 못했을때 inputType 별 노출 메시지.
	@property message
	@type {Object}
	*/
	exports.message = {
		ENG_ONLY							: "영문 입력만 가능합니다."
		, ENG_LOW_ONLY				: "영문 소문자 입력만 가능합니다."
		, ENG_UPER_ONLY				: "영문 대문자 입력만 가능합니다."
		, NUM_ONLY							: "숫자 입력만 가능합니다." 
		, ENG_NUM_ONLY					: "영문 또는 숫자 입력만 가능합니다."
		, ENG_LOW_NUM_ONLY		: "영문 소문자 또는 숫자 입력만 가능합니다."
		, ENG_UPER_NUM_ONLY		: "영문 대문자 또는 숫자 입력만 가능합니다."
	};
	
	/**
	EXValidator 의 inputType 체크를 시작합니다.
	@method initInputType
	@return {void}
	*/
	exports.initInputType = function(){
		var inputs = CssQuery("input[type=text]");
		var len = inputs.length;
		var input = null;
		var inputTypeParse = null;
		for(var i = 0; i < len ; i +=1 ){
			input = inputs[i];
			inputTypeParse = exports.getInputTypeParse( input )
			input.experjsInputTypePattern = inputTypeParse.pattern;
			input.experjsInputTypeOf = inputTypeParse.typeOf;
			EXEventListener.add( input , "keydown" , exports.inputTypeCheckHandler);
			EXEventListener.add( input , "keypress" , exports.inputTypeCheckHandler);
		}
	};

	/**
	inputType 의 이벤트 체크 핸들러.
	@method inputTypeCheckHandler
	@param evt {EXEvent}
	@return {void}
	*/
	exports.inputTypeCheckHandler = function(evt){
		var target = evt.currentTarget;
		var pattern = target.experjsInputTypePattern;
		var typeOf = target.experjsInputTypeOf;
		var keyCode;
		var codeChar;
		switch(evt.type){
			case "keypress" :
				keyCode = evt.charCode;
				codeChar = String.fromCharCode(keyCode);
				if(pattern.test(codeChar) == false){
					evt.preventDefault();
					exports.alternative( typeOf );
				}
				break;
			case "keydown" :
				keyCode = evt.keyCode;
				codeChar = String.fromCharCode(keyCode);
				if(pattern.test(codeChar) == false){
					if(keyCode <= 65 && keyCode >= 97){
						if( exports.isPreventCode(keyCode) == false){
							evt.preventDefault();
							if( keyCode == 229){
								evt.preventDefault();
								exports.alternative( typeOf );
							}
						}
					}
				}
				break;
		}
	};

	/**
	검수시 무시 되어야할 code 와 keyCode 를 비교하여 boolean 값을 반환합니다.
	@method isPreventCode
	@param code {integer} 검수시 무시되어야 할 keyCode 배열
	@return {boolean}
	*/
	exports.isPreventCode = function(code){
		var isPrevent = false;
		var len = PRVENT_CODES.length;
		for(var i = 0 ; i < len ; i +=1 ){
			if(PRVENT_CODES[i] == code){
				isPrevent = true;
				break;
			}
		}
		return isPrevent;
	};

	/**
	지정된 typeOf 값의 message 를 EXToast 를 통해 노출합니다.
	@method alternative
	@param typeOf {String} EXToast 로 노출될 메세지 type
	@return {void}
	*/
	exports.alternative = function(typeOf){
		EXToast.message( exports.message[typeOf] );
	};

	/**
	지정된 target 객체의 속성을 분석하여 pattern, typeOf 프로퍼티를 할당합니다.
	@method getInputTypeParse
	@param target {HTMLElement} 속성을 분석할 객체.
	@return {void}
	*/
	exports.getInputTypeParse = function( target ){
		var getInputType = target.getAttribute( DataOf.EXPER_JS );
		if(getInputType == null){
			return false;
		}
		var getType = getInputType.split(":")[1];
		var pattern = null;
		var typeOf = null;

		var hasNum = exports.hasType( target , ["num"] );
		if(hasNum == true){
			if( exports.hasType( target , ["eng"]) ){
				pattern = exports.inputPattern.ENG_NUM_ONLY;
				typeOf = exports.inputTypeOf.ENG_NUM_ONLY;
			}else if( exports.hasType( target , ["engUper"]) ){
				pattern = exports.inputPattern.ENG_UPER_NUM_ONLY;
				typeOf = exports.inputTypeOf.ENG_UPER_NUM_ONLY;
			}else if( exports.hasType( target , ["engLow"]) ){
				pattern = exports.inputPattern.ENG_LOW_NUM_ONLY;
				typeOf = exports.inputTypeOf.ENG_LOW_NUM_ONLY;
			}else{
				pattern = exports.inputPattern.NUM_ONLY;
				typeOf = exports.inputTypeOf.NUM_ONLY;
			}
		}else{
			if( exports.hasType( target , ["eng"]) ){
				pattern = exports.inputPattern.ENG_ONLY;
				typeOf = exports.inputTypeOf.ENG_ONLY;
			}else if( exports.hasType( target , ["engUper"]) ){
				pattern = exports.inputPattern.ENG_UPER_ONLY;
				typeOf = exports.inputTypeOf.ENG_UPER_ONLY;
			}else if( exports.hasType( target , ["engLow"]) ){
				pattern = exports.inputPattern.ENG_LOW_ONLY;
				typeOf = exports.inputTypeOf.ENG_LOW_ONLY;
			}
		}
		return { pattern: pattern , typeOf: typeOf };
	};

	/**
	지정된 target 객체에 types 속성이 할당되어 있는지 확인하여 boolean 값으로 반환합니다.	
	@method hasType
	@param target {HTMLElement} 분석 대상이 될 객체
	@param types {String} 분석될 속성 값 배열
	@return {void}
	*/
	exports.hasType = function( target , types){
		var getInputType = target.getAttribute( DataOf.EXPER_JS );
		var getTypes = getInputType.split(":")[1].split(",");
		var len = getTypes.length;
		var has = false;
		var typeLen = types.length;
		var k = 0;
		for(var i = 0 ; i < len ; i++){
			for( k = 0 ; k < typeLen ; k++){
				if(getTypes[i] == types[k]){
					has = true;
					break;
				}
			}
		}
		return has;
	};
	
	/**
	지정된 target 객체에 types 속성이 할당되어있지 않은지 확인하여 boolean 값으로 반환합니다.	
	@method notHasType
	@param target {HTMLElement} 분석 대상이 될 객체
	@param types {String} 분석될 속성 값 배열
	@return {void}
	*/
	exports.notHasType = function( target , types){
		var getInputType = target.getAttribute( DataOf.EXPER_JS );
		var getTypes = getInputType.split(":")[1].split(",");
		var len = getTypes.length;
		var has = true;
		var typeLen = types.length;
		var k = 0;
		for(var i = 0 ; i < len ; i++){
			for( k = 0 ; k < typeLen ; k++){
				if(getTypes[i] == types[k]){
					has = false;
					break;
				}
			}
		}
		return has;
	};
});