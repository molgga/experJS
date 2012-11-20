define(function( require , exports){
	var CssQuery = require("../vender/CssQuery");
	
	var ClassOf = {
		FAKE_FILE : ".exUIKit_fileButton"
		, FAKE_INPUT_TEXT : ".fileText"
		, FAKE_INPUT_BUTTON : ".fileButton"
		, ORIGINAL_INPUT_FILE : ".fileOriginal"
	}

	var _designFileButtonArr = null;

	exports.init = function(){
		_designFileButtonArr = [];
		var files = CssQuery( ClassOf.FAKE_FILE );
		var len = files.length;
		var deisignInputFile = null;
		for(var i = 0 ; i < len ; i += 1){
			deisignInputFile = new DesignInputFile();
			deisignInputFile.init(files[i]);
			_designFileButtonArr.push(deisignInputFile);
		}
	};

	function DesignInputFile(){
		var _this = this;
		_this.inputText = null;
		_this.inputButton = null;
		_this.originalFile = null;
		_this.init = function(parent){
			_this.inputText = CssQuery.getSingle( ClassOf.FAKE_INPUT_TEXT , parent);
			_this.inputButton = CssQuery.getSingle( ClassOf.FAKE_INPUT_BUTTON , parent);
			_this.originalFile = CssQuery.getSingle( ClassOf.ORIGINAL_INPUT_FILE , parent);
			_this.originalFile.onchange = intractionOriginalFileChange;
		}
		function intractionOriginalFileChange(evt){
			console.log(1);
			_this.inputText.value = _this.originalFile.value;
		}
	}

	exports.destroy = function(){
	};
});