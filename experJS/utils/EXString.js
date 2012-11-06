define(function(require , exports){
	/**
	@class EXString
	@static
	*/
	/**
	문자열의 공백을 모두 제거합니다.
	@method removeWhiteSpace
	@static
	@param str {String} 제거할 문자열.
	@return {String}
	*/
	exports.removeWhiteSpace = function(str){
		var strReg = /\s+/g;
		if(str) str = str.replace(strReg , "");
		return str;
	};

	/**
	문자열의 좌,우 공백을 제거합니다.
	@method trim
	@static
	@param str {String} 좌,우 공백을 제거할 문자열.
	@return {String}
	*/
	exports.trim = function(str){
		var strReg = /(^\s*)|(\s*$)/gi;
		if(str) str = str.replace(strReg,"");
		return str;
	};

	/**
	문자열의 좌측 공백을 제거합니다.
	@method leftTrim
	@static
	@param str {String} 좌측 공백을 제거할 문자열.
	@return {String}
	*/
	exports.leftTrim = function(str){
		while(str.substring(0,1) == " "){
			str = str.substring(1);
		}
		return str;
	};

	/**
	문자열의 우측 공백을 제거합니다.
	@method rightTrim
	@static
	@param str {String} 우측 공백을 제거할 문자열.
	@return {String}
	*/
	exports.rightTrim = function(str){
		var len = str.length;
		while((str.substring(len-1,len)==" ")){
			str = str.substring(0, len-1);
			len = str.length;
		}
		return str;
	};

	/**
	parameter 의 str 에 지정된 문자열을 대상으로 find 문자(열)을 rpl 문자(열)로 모두 변경합니다.
	@method replaceAll
	@static
	@param str {String} 변경 대상이 될 문자열.
	@param find {String} 변경할 문자(열).
	@param rpl {String} 변경될 문자(열).
	@return {String}
	*/
	exports.replaceAll = function(str , find , rpl){
		return str.split(find).join(rpl);
	};
	
	/**
	문자열의 태그가 포함되어 있을시 태그에 해당하는 문자열을 제거합니다.
	@method removeTag
	@static
	@param tagString {String} 태그를 제거할 문자열.
	@param [trim = false] {boolean} 변경 중 양쪽 공백 제거.
	@param [removeTab = false] {boolean} 변경 중 탭(\t) 문자 제거.
	@return {String}
	*/
	exports.removeTag = function(tagString , trim , removeTab){
		var replaceText = tagString.replace(/(<([^>]+)>)/ig, "");
		if(trim == true) replaceText = exports.trim(replaceText);
		if(removeTab == true) replaceText = exports.replaceAll(replaceText,"\t","");
		return replaceText;
	};

	
	/**
	문자열의 태그가 포함되어 있을시 태그에 해당하는 문자열을 제거합니다.
	@method replaceTypeToPrice
	@static
	@param number {number} 변경할 대상이 되는 숫자.
	@param [addStr = ","] {String} 구분자 문자.
	@return {String}
	*/
	exports.replaceTypeToPrice = function(number, addStr){
		if(addStr == undefined) addStr = ",";
		if(typeof(number) == "number"){
			var price = number.toString().split(".");
			var isDemicalPoint = false;
			if(price.length > 1){
				isDemicalPoint = true;
			}
			var arr = price[0].toString().split(""); 
			var tlen = arr.length; 
			var clen = Math.ceil(tlen / 3);
			var i;
			for (i=1; i<clen; i++) arr.splice(tlen - i * 3, 0, addStr);
			
			var resultValue = arr.join("");
			if(isDemicalPoint == true){
				resultValue = resultValue +"."+ price[1];
			}
			return resultValue;
		}else{
			return "isNaN"; 
		}
	};

	/**
	지정된 문자열의 첫 글자를 대문자로 변경하여 반환합니다.
	@method toUpperCaseHead
	@param str {String}
	@return {String}
	*/
	exports.toUpperCaseHead = function(str){
		var head = str.substring(0,1).toUpperCase();
		var tail = str.substring(1,str.length);
		return head + tail;
	}

	/**
	문자열의 문자를 구분으로 분할하여 배열로 반환합니다.
	@method convertCharToArray
	@param str {String} 원본 문자열.
	@return {Array}
	*/
	exports.convertCharToArray = function(str){
		var arr = [];
		var len = str.length;
		for(var i = 0 ; i < len ; i++){
			arr.push(str.substring(i,i+1));
		}
		return arr;
	}

	/**
	문자열의 단어를 구분으로 분할하여 배열로 반환합니다.
	@method convertWordToArray
	@param str {String} 원본 문자열.
	@return {Array}
	*/
	exports.convertWordToArray = function(str){
		var strReg = /\s*\S*/g;
		var regSer = strReg.exec(str)[0];
		var regArr = [];
		while(regSer){
			if(regSer == "") break;
			regArr.push(regSer);
			regSer = exports.trim(strReg.exec(str)[0]);
		}
		return regArr;
	}

	/**
	문자열을 지정된 인덱스에 삽입합니다.
	@method insert
	@param str {String} 원본 문자열.
	@param addStr {integer} 삽입할 문자열.
	@param [index=0] {integer} addStr을 삽입할 인덱스.
	@return {String}
	*/
	exports.insert = function(str , addStr , index){
		var head = null;
		var tail = null;
		if(index != undefined){
			head = str.substring(0, index);
			tail = str.substring(index , str.length);
		}else{
			head = "";
			tail = str;
		}
		return head+addStr+tail;
	}

	/**
	문자열을 지정된 인덱스만큼 제거합니다.
	@method remove
	@param str {String} 원본 문자열.
	@param indexStart {integer} 제거할 시작 인덱스.
	@param indexEnd {integer} 제거할 마지막 인덱스.(시작 인덱스의 상대적)
	@return {String}
	*/
	exports.remove = function(str , indexStart , indexEnd){
		var head = null;
		var tail = null;
		head = str.substring(0 , indexStart);
		tail = str.substring(indexStart+indexEnd , str.length);
		return head + tail;
	}

	/**
	문자열을 지정된 숫자만큼 잘라내어 반환합니다.
	@method abbreviate
	@param str {String} 잘라낼 문자열.
	@param maxLength {integer} 잘라낼 최대 길이.
	@return {String}
	*/
	exports.abbreviate = function(str , maxLength){
		return str.substring(0, maxLength);
	}
	
	/**
	str 문자열에 포함되는 문자(열)이 모두 포함이 되는지 검사합니다.
	@method containsHas
	@param str {String} 검사할 문자열.
	@param aguments {...String} 포함이 되는지 검사할 문자열.
	@return {boolean}
	*/
	exports.containsHas = function(str){
		var isContain = false;
		var len = arguments.length;
		if(len > 1){
			var reg = null;
			for(var i = 1 ; i < len ; i++){
				reg = new RegExp(arguments[i]);
				if(reg.test(str) == false){
					isContain = false;
					break;
				}else{
					isContain = true;
				}
			}
		}else{
			isContain = false;
		}
		return isContain;
	}

	/**
	str 문자열에 포함되는 문자(열)이 하나라도 포함이 되는지 검사합니다.
	@method containsAny
	@param str {String} 검사할 문자열.
	@param aguments {...String} 포함이 되는지 검사할 문자열.
	@return {boolean}
	*/
	exports.containsAny = function(str){
		var isContain = false;
		var len = arguments.length;
		if(len > 1){
			var reg = null;
			for(var i = 1 ; i < len ; i++){
				reg = new RegExp(arguments[i]);
				if(reg.test(str) == true){
					isContain = true;
					break;
				}
			}
		}else{
			isContain = false;
		}
		return isContain;
	}
	
	/**
	대문자는 소문자로 소문자는 대문자로 변경합니다.
	@method swapCase
	@param str {String} 변경할 문자열.
	@return {String}
	*/
	exports.swapCase = function(str){
		var charArr = exports.convertCharToArray(str);
		var len = charArr.length;
		var charCode = 0;
		var concat = "";
		for(var i = 0 ; i < len ; i++){
			charCode = charArr[i].charCodeAt();
			if(65 <= charCode&& charCode <= 90){
				concat = concat + String.fromCharCode(charCode+32);
			}else if(97 <= charCode&& charCode <= 122){
				concat = concat + String.fromCharCode(charCode-32);
			}else{
				concat = concat + charArr[i];
			}
		}
		return concat;
	}

	/**
	문자 타입이 숫자인지 확인합니다.
	@method checkCharNum
	@param character {String} 검사할 문자.
	@return {boolean}
	*/
	exports.checkCharNum = function(character){
		var pattern = /^[0-9]$/;
		return pattern.test(character);
	}

	/**
	문자 타입이 영문인지 확인합니다.
	@method checkCharEng
	@param character {String} 검사할 문자.
	@return {boolean}
	*/
	exports.checkCharEng = function(character){
		var pattern = /^[a-zA-Z]$/;
		return pattern.test(character);
	}
	
	/**
	문자 타입이 영문 or 숫자인지 확인합니다.
	@method checkCharNumEng
	@param character {String} 검사할 문자.
	@return {boolean}
	*/
	exports.checkCharNumEng = function(character){
		var pattern = /^[a-zA-Z0-9]$/;
		return pattern.test(character);
	}

	/**
	문자열이 숫자만 포함하는지 확인합니다.
	@method checkStringNum
	@param str {String} 검사할 문자열.
	@return {boolean}
	*/
	exports.checkStringNum = function(str){
		var pattern = /^[0-9]*$/;
		return pattern.test(str);
	}

	/**
	문자열이 영문만 포함하는지 확인합니다.
	@method checkStringEng
	@param str {String} 검사할 문자열.
	@return {boolean}
	*/
	exports.checkStringEng = function(str){
		var pattern = /^[a-zA-Z]*$/;
		return pattern.test(str);
	}

	/**
	문자열이 영문 or 숫자만 포함하는지 확인합니다.
	@method checkStringNumEng
	@param str {String} 검사할 문자열.
	@return {boolean}
	*/
	exports.checkStringNumEng = function(str){
		var pattern = /^[a-zA-Z0-9]*$/;
		return pattern.test(str);
	}

	exports.checkStringByte = function(str){
	}

	/**
	json 형식의 문자열을 json 데이터로 변환합니다.
	@method toJson
	@param jsonString {String} json 형태로 변환할 문자열.
	@return {JSON}
	*/
	exports.toJson = function(jsonString){
		if(typeof(JSON) != undefined){
			return JSON.parse(jsonString);
		}else{
			return eval("("+ jsonString +")");
		}
	}


	/**
	메일 주소를 검사하여 메일주소가 유효한지 검사합니다.
	<br/>(메일의 수신 여부를 검사하는게 아니라 메일 주소형식을 검사합니다!)
	@method isEmail
	@static
	@param mailString {String} 메일 형식을 검사할 문자열.
	@return {boolean}
	*/
	exports.isEmail = function(mailString){
		var regExp = /^(\w|_|-)+(\w|_|-)*\@{1}(\w|_|-)+(\w|_|-)*(\.{1}\w+\w*)+$/;
		return regExp.test(mailString);
	};

	/**
	단순히 검사할 문자열에 anchor(#)이 있는지 확인합니다.
	@method hasAnchor
	@static
	@param str {String} anchor(#) 문자가 있는지 검사할 문자열.
	@return {boolan}
	*/
	exports.hasAnchor = function(str){
		var regAnchor = /\b#.*\b/;
		return regAnchor.test(str);
	};

	/**
	문자열의 anchor(#)를 추출하여 반환합니다.
	@method getAnchor
	@static
	@param str {String} anchor(#)를 반환 받을 문자열.
	@return {String}
	*/
	exports.getAnchor = function(str){
		var parseAnchor = null;
		var regAnchor = /\b#.*\b/;
		var regParams = /(?=\/|\?)/;
		var regAnchorStr = regAnchor.exec(str);
		if(regAnchorStr != null){
			parseAnchor = regAnchorStr[0];
		}
		return parseAnchor;
	};

	/**
	문장 내에 기본 영문자와 숫자, 기본 심볼 문자만이 존재하는지의 여부를 반환합니다.
	<br/>허용되는 문자: !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~
	@method getFlagEnglishStr
	@static
	@param str {String} 검사할 문자열
	@return {String}
	*/
	exports.getFlagEnglishStr = function(str) {
		var flag = true;
		var splitArr = str.split("");
		var strArr = [];
		var _str;
		var unicode;
		for(var i=0, max=splitArr.length; i<max; ++i) {
			_str = splitArr[i];
			unicode = _str.charCodeAt();
			if(unicode < 32 || unicode > 126) { // !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~
				flag = false;
				break;
			} 
		}
		return flag;
	};

	/**
	String의 length가 특정한 숫자보다 길 경우, String을 특정한 숫자까지만 표기합니다. String의 마지막 글자 이후 cutAddStr String의 추가가 가능합니다.
	@method cutStrByIndex
	@static
	@param str {String} 검사할 문자열
	@param cutStringIndex {integer} 표기할 글자 수
	@param cutAddStr {String} 추가할 문자열
	@return {String}
	*/
	exports.cutStrByIndex = function(str, cutStringIndex, cutAddStr) {
		var tempStr = str;
		if (str.length > cutStringIndex) tempStr = str.substr(0, cutStringIndex) + cutAddStr;
		return tempStr;
	};




	var INITIAL_JAMO_KOR = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
	var MEDIAL_JAMO_KOR = ["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"];
	var FINAL_JAMO_KOR = [" ","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
	
	/**
	문장 내의 각 한글 character를 초,성,성으로 분해하여 담은 Array(character가 한글이 아닐 경우에는 Array에 바로 담습니다)들을 별도의 Array에 순차적으로 담아 2차원 배열(Array) 형태로 반환합니다.
	@method breakSetenceStr
	@static
	@param str {String} 분리할 문자열
	@return {String}
	*/
	exports.breakSetenceStr = function(str) {
		var splitArr = str.split("");
		var strArr = [];
		var _str;
		for(var i=0, max=splitArr.length; i<max; ++i) {
			_str = splitArr[i];
			strArr.push(exports.breakCharacterStr(_str));
		}
		return strArr;
	};
	
	/**
	한글 character를 초,중,종성으로 분해하여 Array에 담아 반환(character가 한글이 아닐 경우 Array에 담아 단순 반환) 합니다.
	@method breakCharacterStr
	@static
	@param oneCharacterStr {String} 분리할 문자.
	@return {String}
	*/
	exports.breakCharacterStr = function(oneCharacterStr) {
		var valueArr = [];
		var unicode = oneCharacterStr.charCodeAt();
		var initialValue; //Initial Jamo Number
		var MedialValue; //Initial Jamo Number + Medial Jamo Number

		if(unicode >= 44032 && unicode <= 55203) { //hangul (Unicode 44032 ~ 55203) 
			initialValue = Math.floor((unicode - 44032) / 588); //Initial Jamo index
			valueArr.push(String(INITIAL_JAMO_KOR[initialValue]));
			
			var initialJamoUnicode = initialValue * 588 + 44032; // Initial Jamo + ㅏ(Medial Jamo[0]) + no Final Jamo
			MedialValue = Math.floor( (unicode - initialJamoUnicode) / 28 ) * 28 + initialJamoUnicode;
			
			var medialJamoUnicodeIndex = Math.floor( (unicode - initialJamoUnicode) / 28 );
			
			//ㅘ, ㅙ, ㅚ (9, 10, 11) -> add ㅗ (8)
			if(medialJamoUnicodeIndex >= 9 && medialJamoUnicodeIndex <= 11) valueArr.push(String.fromCharCode(initialJamoUnicode + 8 * 28)); //valueArr.push(MEDIAL_JAMO_KOR[8]);
			
			//ㅝ, ㅞ, ㅟ (14, 15, 16) -> add ㅜ(13)
			if(medialJamoUnicodeIndex >= 14 && medialJamoUnicodeIndex <= 16) valueArr.push(String.fromCharCode(initialJamoUnicode + 13 * 28));//valueArr.push(MEDIAL_JAMO_KOR[13]);
			
			//ㅢ (19) -> add ㅡ(18)
			if(medialJamoUnicodeIndex == 19) valueArr.push(String.fromCharCode(initialJamoUnicode + 18 * 28)); //valueArr.push(MEDIAL_JAMO_KOR[18]);
			
			valueArr.push(String.fromCharCode(MedialValue));
			
			//add Final Jamo
			var finalJamoUnicodeIndex = unicode - MedialValue; //int
			if(finalJamoUnicodeIndex != 0) {
				//ㄲ, ㄳ (2, 3) -> add ㄱ(1)
				if(finalJamoUnicodeIndex >= 2 && finalJamoUnicodeIndex <= 3) valueArr.push(String.fromCharCode(MedialValue + 1));
				
				//ㄵ, ㄶ(5, 6) -> add ㄴ(4)
				if(finalJamoUnicodeIndex >= 5 && finalJamoUnicodeIndex <= 6) valueArr.push(String.fromCharCode(MedialValue + 4));
				
				//ㄺ, ㄻ, ㄼ, ㄽ, ㄾ, ㄿ, ㅀ (9, 10, 11, 12, 13, 14, 15) -> add ㄹ(8)
				if(finalJamoUnicodeIndex >= 9 && finalJamoUnicodeIndex <= 15) valueArr.push(String.fromCharCode(MedialValue + 8));
				
				//ㅄ (18) -> add ㅂ(17)
				if(finalJamoUnicodeIndex == 18) valueArr.push(String.fromCharCode(MedialValue + 17));

				//ㅆ (20) -> add ㅅ(19)
				if(finalJamoUnicodeIndex == 20) valueArr.push(String.fromCharCode(MedialValue + 19));
				
				valueArr.push(oneCharacterStr);
			}
		}else if(unicode >= 32 && unicode <= 126) { // !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~
			if(unicode == 32){ //" "
				valueArr.push(" ");
			}else if(unicode == 92){ //\
				valueArr.push(String.fromCharCode(unicode));
			}else{
				valueArr.push(String.fromCharCode(unicode));
			}
		}else{
			valueArr.push(String.fromCharCode(unicode));
		}
		return valueArr;
	};
});