define(function(require, exports){
	var CssQuery = (function() {
		var sVersion = '3.0';
		var debugOption = { repeat : 1 };
		var UID = 1;
		
		var cost = 0;
		var validUID = {};
		
		var bSupportByClassName = document.getElementsByClassName ? true : false;
		var safeHTML = false;
		
		var getUID4HTML = function(oEl) {
			
			var nUID = safeHTML ? (oEl._cssquery_UID && oEl._cssquery_UID[0]) : oEl._cssquery_UID;
			if (nUID && validUID[nUID] == oEl) return nUID;
			
			nUID = UID++;
			oEl._cssquery_UID = safeHTML ? [ nUID ] : nUID;
			
			validUID[nUID] = oEl;
			return nUID;

		};
		
		var getUID4XML = function(oEl) {
			
			var oAttr = oEl.getAttribute('_cssquery_UID');
			var nUID = safeHTML ? (oAttr && oAttr[0]) : oAttr;
			
			if (!nUID) {
				nUID = UID++;
				oEl.setAttribute('_cssquery_UID', safeHTML ? [ nUID ] : nUID);
			}
			
			return nUID;
			
		};
		
		var getUID = getUID4HTML;
		
		var uniqid = function(sPrefix) {
			return (sPrefix || '') + new Date().getTime() + parseInt(Math.random() * 100000000,10);
		};
		
		function getElementsByClass(searchClass,node,tag) {
			var classElements = new Array();
			if ( node == null )
					node = document;
			if ( tag == null )
					tag = '*';
			var els = node.getElementsByTagName(tag);
			var elsLen = els.length;
			var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
			for (i = 0, j = 0; i < elsLen; i++) {
					if ( pattern.test(els[i].className) ) {
							classElements[j] = els[i];
							j++;
					}
			}
			return classElements;
		}

		var getChilds_dontShrink = function(oEl, sTagName, sClassName) {
			if (bSupportByClassName && sClassName) {
				if(oEl.getElementsByClassName)
					return oEl.getElementsByClassName(sClassName);
				if(oEl.querySelectorAll)
					return oEl.querySelectorAll(sClassName);
				return getElementsByClass(sClassName, oEl, sTagName);
			}else if (sTagName == '*') {
				return oEl.all || oEl.getElementsByTagName(sTagName);
			}
			return oEl.getElementsByTagName(sTagName);
		};

		var clearKeys = function() {
			 backupKeys._keys = {};
		};
		
		var oDocument_dontShrink = document;
		
		var bXMLDocument = false;
		
		/*
		 
	따옴표, [] 등 파싱에 문제가 될 수 있는 부분 replace 시켜놓기
	  
		 */
		var backupKeys = function(sQuery) {
			
			var oKeys = backupKeys._keys;
			
			/*
			 
	작은 따옴표 걷어내기
	  
			 */
			sQuery = sQuery.replace(/'(\\'|[^'])*'/g, function(sAll) {
				var uid = uniqid('QUOT');
				oKeys[uid] = sAll;
				return uid;
			});
			
			/*
			 
	큰 따옴표 걷어내기
	  
			 */
			sQuery = sQuery.replace(/"(\\"|[^"])*"/g, function(sAll) {
				var uid = uniqid('QUOT');
				oKeys[uid] = sAll;
				return uid;
			});
			
			/*
			 
	[ ] 형태 걷어내기
	  
			 */
			sQuery = sQuery.replace(/\[(.*?)\]/g, function(sAll, sBody) {
				if (sBody.indexOf('ATTR') == 0) return sAll;
				var uid = '[' + uniqid('ATTR') + ']';
				oKeys[uid] = sAll;
				return uid;
			});
		
			/*
			
	( ) 형태 걷어내기
	  
			 */
			var bChanged;
			
			do {
				
				bChanged = false;
			
				sQuery = sQuery.replace(/\(((\\\)|[^)|^(])*)\)/g, function(sAll, sBody) {
					if (sBody.indexOf('BRCE') == 0) return sAll;
					var uid = '_' + uniqid('BRCE');
					oKeys[uid] = sAll;
					bChanged = true;
					return uid;
				});
			
			} while(bChanged);
		
			return sQuery;
			
		};
		
		/*
		 
	replace 시켜놓은 부분 복구하기
	  
		 */
		var restoreKeys = function(sQuery, bOnlyAttrBrace) {
			
			var oKeys = backupKeys._keys;
		
			var bChanged;
			var rRegex = bOnlyAttrBrace ? /(\[ATTR[0-9]+\])/g : /(QUOT[0-9]+|\[ATTR[0-9]+\])/g;
			
			do {
				
				bChanged = false;
		
				sQuery = sQuery.replace(rRegex, function(sKey) {
					
					if (oKeys[sKey]) {
						bChanged = true;
						return oKeys[sKey];
					}
					
					return sKey;
		
				});
			
			} while(bChanged);
			
			/*
			
	( ) 는 한꺼풀만 벗겨내기
	  
			 */
			sQuery = sQuery.replace(/_BRCE[0-9]+/g, function(sKey) {
				return oKeys[sKey] ? oKeys[sKey] : sKey;
			});
			
			return sQuery;
			
		};
		
		/*
		 
	replace 시켜놓은 문자열에서 Quot 을 제외하고 리턴
	  
		 */
		var restoreString = function(sKey) {
			
			var oKeys = backupKeys._keys;
			var sOrg = oKeys[sKey];
			
			if (!sOrg) return sKey;
			return eval(sOrg);
			
		};
		
		var wrapQuot = function(sStr) {
			return '"' + sStr.replace(/"/g, '\\"') + '"';
		};
		
		var getStyleKey = function(sKey) {

			if (/^@/.test(sKey)) return sKey.substr(1);
			return null;
			
		};
		
		var getCSS = function(oEl, sKey) {
			
			if (oEl.currentStyle) {
				
				if (sKey == "float") sKey = "styleFloat";
				return oEl.currentStyle[sKey] || oEl.style[sKey];
				
			} else if (window.getComputedStyle) {
				
				return oDocument_dontShrink.defaultView.getComputedStyle(oEl, null).getPropertyValue(sKey.replace(/([A-Z])/g,"-$1").toLowerCase()) || oEl.style[sKey];
				
			}

			if (sKey == "float" && /MSIE/.test(window.navigator.userAgent)) sKey = "styleFloat";
			return oEl.style[sKey];
			
		};

		var oCamels = {
			'accesskey' : 'accessKey',
			'cellspacing' : 'cellSpacing',
			'cellpadding' : 'cellPadding',
			'class' : 'className',
			'colspan' : 'colSpan',
			'for' : 'htmlFor',
			'maxlength' : 'maxLength',
			'readonly' : 'readOnly',
			'rowspan' : 'rowSpan',
			'tabindex' : 'tabIndex',
			'valign' : 'vAlign'
		};

		var getDefineCode = function(sKey) {
			
			var sVal;
			var sStyleKey;

			if (bXMLDocument) {
				
				sVal = 'oEl.getAttribute("' + sKey + '",2)';
			
			} else {
			
				if (sStyleKey = getStyleKey(sKey)) {
					
					sKey = '$$' + sStyleKey;
					sVal = 'getCSS(oEl, "' + sStyleKey + '")';
					
				} else {
					
					switch (sKey) {
					case 'checked':
						sVal = 'oEl.checked + ""';
						break;
						
					case 'disabled':
						sVal = 'oEl.disabled + ""';
						break;
						
					case 'enabled':
						sVal = '!oEl.disabled + ""';
						break;
						
					case 'readonly':
						sVal = 'oEl.readOnly + ""';
						break;
						
					case 'selected':
						sVal = 'oEl.selected + ""';
						break;
						
					default:
						if (oCamels[sKey]) {
							sVal = 'oEl.' + oCamels[sKey];
						} else {
							sVal = 'oEl.getAttribute("' + sKey + '",2)';
						} 
					}
					
				}
				
			}
				
			return '_' + sKey + ' = ' + sVal;
		};
		
		var getReturnCode = function(oExpr) {
			
			var sStyleKey = getStyleKey(oExpr.key);
			
			var sVar = '_' + (sStyleKey ? '$$' + sStyleKey : oExpr.key);
			var sVal = oExpr.val ? wrapQuot(oExpr.val) : '';
			
			switch (oExpr.op) {
			case '~=':
				return '(' + sVar + ' && (" " + ' + sVar + ' + " ").indexOf(" " + ' + sVal + ' + " ") > -1)';
			case '^=':
				return '(' + sVar + ' && ' + sVar + '.indexOf(' + sVal + ') == 0)';
			case '$=':
				return '(' + sVar + ' && ' + sVar + '.substr(' + sVar + '.length - ' + oExpr.val.length + ') == ' + sVal + ')';
			case '*=':
				return '(' + sVar + ' && ' + sVar + '.indexOf(' + sVal + ') > -1)';
			case '!=':
				return '(' + sVar + ' != ' + sVal + ')';
			case '=':
				return '(' + sVar + ' == ' + sVal + ')';
			}
		
			return '(' + sVar + ')';
			
		};
		
		var getNodeIndex = function(oEl) {
			var nUID = getUID(oEl);
			var nIndex = oNodeIndexes[nUID] || 0;
			
			/*
			 
	노드 인덱스를 구할 수 없으면
	  
			 */
			if (nIndex == 0) {

				for (var oSib = (oEl.parentNode || oEl._IE5_parentNode).firstChild; oSib; oSib = oSib.nextSibling) {
					
					if (oSib.nodeType != 1){ 
						continue;
					}
					nIndex++;

					setNodeIndex(oSib, nIndex);
					
				}
							
				nIndex = oNodeIndexes[nUID];
				
			}
					
			return nIndex;
					
		};
		
		/*
		 
	몇번째 자식인지 설정하는 부분
	  
		 */
		var oNodeIndexes = {};

		var setNodeIndex = function(oEl, nIndex) {
			var nUID = getUID(oEl);
			oNodeIndexes[nUID] = nIndex;
		};
		
		var unsetNodeIndexes = function() {
			setTimeout(function() { oNodeIndexes = {}; }, 0);
		};
		
		/*
		 
	가상 클래스
	  
		 */
		var oPseudoes_dontShrink = {
		
			'contains' : function(oEl, sOption) {
				return (oEl.innerText || oEl.textContent || '').indexOf(sOption) > -1;
			},
			
			'last-child' : function(oEl, sOption) {
				for (oEl = oEl.nextSibling; oEl; oEl = oEl.nextSibling){
					if (oEl.nodeType == 1)
						return false;
				}
					
				
				return true;
			},
			
			'first-child' : function(oEl, sOption) {
				for (oEl = oEl.previousSibling; oEl; oEl = oEl.previousSibling){
					if (oEl.nodeType == 1)
						return false;
				}
					
						
				return true;
			},
			
			'only-child' : function(oEl, sOption) {
				var nChild = 0;
				
				for (var oChild = (oEl.parentNode || oEl._IE5_parentNode).firstChild; oChild; oChild = oChild.nextSibling) {
					if (oChild.nodeType == 1) nChild++;
					if (nChild > 1) return false;
				}
				
				return nChild ? true : false;
			},

			'empty' : function(oEl, _) {
				return oEl.firstChild ? false : true;
			},
			
			'nth-child' : function(oEl, nMul, nAdd) {
				var nIndex = getNodeIndex(oEl);
				return nIndex % nMul == nAdd;
			},
			
			'nth-last-child' : function(oEl, nMul, nAdd) {
				var oLast = (oEl.parentNode || oEl._IE5_parentNode).lastChild;
				for (; oLast; oLast = oLast.previousSibling){
					if (oLast.nodeType == 1) break;
				}
					
					
				var nTotal = getNodeIndex(oLast);
				var nIndex = getNodeIndex(oEl);
				
				var nLastIndex = nTotal - nIndex + 1;
				return nLastIndex % nMul == nAdd;
			},
			'checked' : function(oEl){
				return !!oEl.checked;
			},
			'selected' : function(oEl){
				return !!oEl.selected;
			},
			'enabled' : function(oEl){
				return !oEl.disabled;
			},
			'disabled' : function(oEl){
				return !!oEl.disabled;
			}
		};
		
		/*
		 
	단일 part 의 body 에서 expression 뽑아냄
	  
		 */
		var getExpression = function(sBody) {

			var oRet = { defines : '', returns : 'true' };
			
			var sBody = restoreKeys(sBody, true);
		
			var aExprs = [];
			var aDefineCode = [], aReturnCode = [];
			var sId, sTagName;
			
			/*
			 
	유사클래스 조건 얻어내기
	  
			 */
			var sBody = sBody.replace(/:([\w-]+)(\(([^)]*)\))?/g, function(_1, sType, _2, sOption) {
				
				switch (sType) {
				case 'not':
					/*
					 
	괄호 안에 있는거 재귀파싱하기
	  
					 */
					var oInner = getExpression(sOption);
					
					var sFuncDefines = oInner.defines;
					var sFuncReturns = oInner.returnsID + oInner.returnsTAG + oInner.returns;
					
					aReturnCode.push('!(function() { ' + sFuncDefines + ' return ' + sFuncReturns + ' })()');
					break;
					
				case 'nth-child':
				case 'nth-last-child':
					sOption =  restoreString(sOption);
					
					if (sOption == 'even'){
						sOption = '2n';
					}else if (sOption == 'odd') {
						sOption = '2n+1';
					}

					var nMul, nAdd;
					var matchstr = sOption.match(/([0-9]*)n([+-][0-9]+)*/);
					if (matchstr) {
						nMul = matchstr[1] || 1;
						nAdd = matchstr[2] || 0;
					} else {
						nMul = Infinity;
						nAdd = parseInt(sOption,10);
					}
					aReturnCode.push('oPseudoes_dontShrink[' + wrapQuot(sType) + '](oEl, ' + nMul + ', ' + nAdd + ')');
					break;
					
				case 'first-of-type':
				case 'last-of-type':
					sType = (sType == 'first-of-type' ? 'nth-of-type' : 'nth-last-of-type');
					sOption = 1;
					
				case 'nth-of-type':
				case 'nth-last-of-type':
					sOption =  restoreString(sOption);
					
					if (sOption == 'even') {
						sOption = '2n';
					}else if (sOption == 'odd'){
						sOption = '2n+1';
					}

					var nMul, nAdd;
					
					if (/([0-9]*)n([+-][0-9]+)*/.test(sOption)) {
						nMul = parseInt(RegExp.$1,10) || 1;
						nAdd = parseInt(RegExp.$2,20) || 0;
					} else {
						nMul = Infinity;
						nAdd = parseInt(sOption,10);
					}
					
					oRet.nth = [ nMul, nAdd, sType ];
					break;
					
				default:
					sOption = sOption ? restoreString(sOption) : '';
					aReturnCode.push('oPseudoes_dontShrink[' + wrapQuot(sType) + '](oEl, ' + wrapQuot(sOption) + ')');
					break;
				}
				
				return '';
				
			});
			
			/*
			 
	[key=value] 형태 조건 얻어내기
	  
			 */
			var sBody = sBody.replace(/\[(@?[\w-]+)(([!^~$*]?=)([^\]]*))?\]/g, function(_1, sKey, _2, sOp, sVal) {
				
				sKey = restoreString(sKey);
				sVal = restoreString(sVal);
				
				if (sKey == 'checked' || sKey == 'disabled' || sKey == 'enabled' || sKey == 'readonly' || sKey == 'selected') {
					
					if (!sVal) {
						sOp = '=';
						sVal = 'true';
					}
					
				}
				
				aExprs.push({ key : sKey, op : sOp, val : sVal });
				return '';
		
			});
			
			var sClassName = null;
		
			/*
			 
	클래스 조건 얻어내기
	  
			 */
			var sBody = sBody.replace(/\.([\w-]+)/g, function(_, sClass) { 
				aExprs.push({ key : 'class', op : '~=', val : sClass });
				if (!sClassName) sClassName = sClass;
				return '';
			});
			
			/*
			 
	id 조건 얻어내기
	  
			 */
			var sBody = sBody.replace(/#([\w-]+)/g, function(_, sIdValue) {
				if (bXMLDocument) {
					aExprs.push({ key : 'id', op : '=', val : sIdValue });
				}else{
					sId = sIdValue;
				}
				return '';
			});
			
			sTagName = sBody == '*' ? '' : sBody;
		
			/*
			 
	match 함수 코드 만들어 내기
	  
			 */
			var oVars = {};
			
			for (var i = 0, oExpr; oExpr = aExprs[i]; i++) {
				
				var sKey = oExpr.key;
				
				if (!oVars[sKey]) aDefineCode.push(getDefineCode(sKey));
				/*
				 
	유사클래스 조건 검사가 맨 뒤로 가도록 unshift 사용
	  
				 */
				aReturnCode.unshift(getReturnCode(oExpr));
				oVars[sKey] = true;
				
			}
			
			if (aDefineCode.length) oRet.defines = 'var ' + aDefineCode.join(',') + ';';
			if (aReturnCode.length) oRet.returns = aReturnCode.join('&&');
			
			oRet.quotID = sId ? wrapQuot(sId) : '';
			oRet.quotTAG = sTagName ? wrapQuot(bXMLDocument ? sTagName : sTagName.toUpperCase()) : '';
			
			if (bSupportByClassName) oRet.quotCLASS = sClassName ? wrapQuot(sClassName) : '';
			
			oRet.returnsID = sId ? 'oEl.id == ' + oRet.quotID + ' && ' : '';
			oRet.returnsTAG = sTagName && sTagName != '*' ? 'oEl.tagName == ' + oRet.quotTAG + ' && ' : '';
			
			return oRet;
			
		};
		
		/*
		 
	쿼리를 연산자 기준으로 잘라냄
	  
		 */
		var splitToParts = function(sQuery) {
			
			var aParts = [];
			var sRel = ' ';
			
			var sBody = sQuery.replace(/(.*?)\s*(!?[+>~ ]|!)\s*/g, function(_, sBody, sRelative) {
				
				if (sBody) aParts.push({ rel : sRel, body : sBody });
		
				sRel = sRelative.replace(/\s+$/g, '') || ' ';
				return '';
				
			});
		
			if (sBody) aParts.push({ rel : sRel, body : sBody });
			
			return aParts;
			
		};
		
		var isNth_dontShrink = function(oEl, sTagName, nMul, nAdd, sDirection) {
			
			var nIndex = 0;
			for (var oSib = oEl; oSib; oSib = oSib[sDirection]){
				if (oSib.nodeType == 1 && (!sTagName || sTagName == oSib.tagName))
						nIndex++;
			}
				

			return nIndex % nMul == nAdd;

		};
		
		/*
		 
	잘라낸 part 를 함수로 컴파일 하기
	  
		 */
		var compileParts = function(aParts) {
			
			var aPartExprs = [];
			
			/*
			 
	잘라낸 부분들 조건 만들기
	  
			 */
			for (var i = 0, oPart; oPart = aParts[i]; i++)
				aPartExprs.push(getExpression(oPart.body));
			
			//////////////////// BEGIN
			
			var sFunc = '';
			var sPushCode = 'aRet.push(oEl); if (oOptions.single) { bStop = true; }';

			for (var i = aParts.length - 1, oPart; oPart = aParts[i]; i--) {
				
				var oExpr = aPartExprs[i];
				var sPush = (debugOption.callback ? 'cost++;' : '') + oExpr.defines;
				

				var sReturn = 'if (bStop) {' + (i == 0 ? 'return aRet;' : 'return;') + '}';
				
				if (oExpr.returns == 'true') {
					sPush += (sFunc ? sFunc + '(oEl);' : sPushCode) + sReturn;
				}else{
					sPush += 'if (' + oExpr.returns + ') {' + (sFunc ? sFunc + '(oEl);' : sPushCode ) + sReturn + '}';
				}
				
				var sCheckTag = 'oEl.nodeType != 1';
				if (oExpr.quotTAG) sCheckTag = 'oEl.tagName != ' + oExpr.quotTAG;
				
				var sTmpFunc =
					'(function(oBase' +
						(i == 0 ? ', oOptions) { var bStop = false; var aRet = [];' : ') {');

				if (oExpr.nth) {
					sPush =
						'if (isNth_dontShrink(oEl, ' +
						(oExpr.quotTAG ? oExpr.quotTAG : 'false') + ',' +
						oExpr.nth[0] + ',' +
						oExpr.nth[1] + ',' +
						'"' + (oExpr.nth[2] == 'nth-of-type' ? 'previousSibling' : 'nextSibling') + '")) {' + sPush + '}';
				}
				
				switch (oPart.rel) {
				case ' ':
					if (oExpr.quotID) {
						
						sTmpFunc +=
							'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
							'var oCandi = oEl;' +
							'for (; oCandi; oCandi = (oCandi.parentNode || oCandi._IE5_parentNode)) {' +
								'if (oCandi == oBase) break;' +
							'}' +
							'if (!oCandi || ' + sCheckTag + ') return aRet;' +
							sPush;
						
					} else {
						
						sTmpFunc +=
							'var aCandi = getChilds_dontShrink(oBase, ' + (oExpr.quotTAG || '"*"') + ', ' + (oExpr.quotCLASS || 'null') + ');' +
							'for (var i = 0, oEl; oEl = aCandi[i]; i++) {' +
								(oExpr.quotCLASS ? 'if (' + sCheckTag + ') continue;' : '') +
								sPush +
							'}';
						
					}
				
					break;
					
				case '>':
					if (oExpr.quotID) {
		
						sTmpFunc +=
							'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
							'if ((oEl.parentNode || oEl._IE5_parentNode) != oBase || ' + sCheckTag + ') return aRet;' +
							sPush;
						
					} else {
		
						sTmpFunc +=
							'for (var oEl = oBase.firstChild; oEl; oEl = oEl.nextSibling) {' +
								'if (' + sCheckTag + ') { continue; }' +
								sPush +
							'}';
						
					}
					
					break;
					
				case '+':
					if (oExpr.quotID) {
		
						sTmpFunc +=
							'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
							'var oPrev;' +
							'for (oPrev = oEl.previousSibling; oPrev; oPrev = oPrev.previousSibling) { if (oPrev.nodeType == 1) break; }' +
							'if (!oPrev || oPrev != oBase || ' + sCheckTag + ') return aRet;' +
							sPush;
						
					} else {
		
						sTmpFunc +=
							'for (var oEl = oBase.nextSibling; oEl; oEl = oEl.nextSibling) { if (oEl.nodeType == 1) break; }' +
							'if (!oEl || ' + sCheckTag + ') { return aRet; }' +
							sPush;
						
					}
					
					break;
				
				case '~':
		
					if (oExpr.quotID) {
		
						sTmpFunc +=
							'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
							'var oCandi = oEl;' +
							'for (; oCandi; oCandi = oCandi.previousSibling) { if (oCandi == oBase) break; }' +
							'if (!oCandi || ' + sCheckTag + ') return aRet;' +
							sPush;
						
					} else {
		
						sTmpFunc +=
							'for (var oEl = oBase.nextSibling; oEl; oEl = oEl.nextSibling) {' +
								'if (' + sCheckTag + ') { continue; }' +
								'if (!markElement_dontShrink(oEl, ' + i + ')) { break; }' +
								sPush +
							'}';
		
					}
					
					break;
					
				case '!' :
				
					if (oExpr.quotID) {
						
						sTmpFunc +=
							'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
							'for (; oBase; oBase = (oBase.parentNode || oBase._IE5_parentNode)) { if (oBase == oEl) break; }' +
							'if (!oBase || ' + sCheckTag + ') return aRet;' +
							sPush;
							
					} else {
						
						sTmpFunc +=
							'for (var oEl = (oBase.parentNode || oBase._IE5_parentNode); oEl; oEl = (oEl.parentNode || oEl._IE5_parentNode)) {'+
								'if (' + sCheckTag + ') { continue; }' +
								sPush +
							'}';
						
					}
					
					break;
		
				case '!>' :
				
					if (oExpr.quotID) {
		
						sTmpFunc +=
							'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
							'var oRel = (oBase.parentNode || oBase._IE5_parentNode);' +
							'if (!oRel || oEl != oRel || (' + sCheckTag + ')) return aRet;' +
							sPush;
						
					} else {
		
						sTmpFunc +=
							'var oEl = (oBase.parentNode || oBase._IE5_parentNode);' +
							'if (!oEl || ' + sCheckTag + ') { return aRet; }' +
							sPush;
						
					}
					
					break;
					
				case '!+' :
					
					if (oExpr.quotID) {
		
						sTmpFunc +=
							'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
							'var oRel;' +
							'for (oRel = oBase.previousSibling; oRel; oRel = oRel.previousSibling) { if (oRel.nodeType == 1) break; }' +
							'if (!oRel || oEl != oRel || (' + sCheckTag + ')) return aRet;' +
							sPush;
						
					} else {
		
						sTmpFunc +=
							'for (oEl = oBase.previousSibling; oEl; oEl = oEl.previousSibling) { if (oEl.nodeType == 1) break; }' +
							'if (!oEl || ' + sCheckTag + ') { return aRet; }' +
							sPush;
						
					}
					
					break;
		
				case '!~' :
					
					if (oExpr.quotID) {
						
						sTmpFunc +=
							'var oEl = oDocument_dontShrink.getElementById(' + oExpr.quotID + ');' +
							'var oRel;' +
							'for (oRel = oBase.previousSibling; oRel; oRel = oRel.previousSibling) { ' +
								'if (oRel.nodeType != 1) { continue; }' +
								'if (oRel == oEl) { break; }' +
							'}' +
							'if (!oRel || (' + sCheckTag + ')) return aRet;' +
							sPush;
						
					} else {
		
						sTmpFunc +=
							'for (oEl = oBase.previousSibling; oEl; oEl = oEl.previousSibling) {' +
								'if (' + sCheckTag + ') { continue; }' +
								'if (!markElement_dontShrink(oEl, ' + i + ')) { break; }' +
								sPush +
							'}';
						
					}
					
					break;
				}
		
				sTmpFunc +=
					(i == 0 ? 'return aRet;' : '') +
				'})';
				
				sFunc = sTmpFunc;
				
			}
			
			eval('var fpCompiled = ' + sFunc + ';');
			return fpCompiled;
			
		};
		
		/*
		 
	쿼리를 match 함수로 변환
	  
		 */
		var parseQuery = function(sQuery) {
			
			var sCacheKey = sQuery;
			
			var fpSelf = arguments.callee;
			var fpFunction = fpSelf._cache[sCacheKey];
			
			if (!fpFunction) {
				
				sQuery = backupKeys(sQuery);
				
				var aParts = splitToParts(sQuery);
				
				fpFunction = fpSelf._cache[sCacheKey] = compileParts(aParts);
				fpFunction.depth = aParts.length;
				
			}
			
			return fpFunction;
			
		};
		
		parseQuery._cache = {};
		
		/*
		 
	test 쿼리를 match 함수로 변환
	  
		 */
		var parseTestQuery = function(sQuery) {
			
			var fpSelf = arguments.callee;
			
			var aSplitQuery = backupKeys(sQuery).split(/\s*,\s*/);
			var aResult = [];
			
			var nLen = aSplitQuery.length;
			var aFunc = [];
			
			for (var i = 0; i < nLen; i++) {

				aFunc.push((function(sQuery) {
					
					var sCacheKey = sQuery;
					var fpFunction = fpSelf._cache[sCacheKey];
					
					if (!fpFunction) {
						
						sQuery = backupKeys(sQuery);
						var oExpr = getExpression(sQuery);
						
						eval('fpFunction = function(oEl) { ' + oExpr.defines + 'return (' + oExpr.returnsID + oExpr.returnsTAG + oExpr.returns + '); };');
						
					}
					
					return fpFunction;
					
				})(restoreKeys(aSplitQuery[i])));
				
			}
			return aFunc;
			
		};
		
		parseTestQuery._cache = {};
		
		var distinct = function(aList) {
		
			var aDistinct = [];
			var oDummy = {};
			
			for (var i = 0, oEl; oEl = aList[i]; i++) {
				
				var nUID = getUID(oEl);
				if (oDummy[nUID]) continue;
				
				aDistinct.push(oEl);
				oDummy[nUID] = true;
			}
		
			return aDistinct;
		
		};
		
		var markElement_dontShrink = function(oEl, nDepth) {
			
			var nUID = getUID(oEl);
			if (cssquery._marked[nDepth][nUID]) return false;
			
			cssquery._marked[nDepth][nUID] = true;
			return true;

		};
		
		var oResultCache = null;
		var bUseResultCache = false;
		var bExtremeMode = false;
			
		var old_cssquery = function(sQuery, oParent, oOptions) {
			
			if (typeof sQuery == 'object') {
				
				var oResult = {};
				
				for (var k in sQuery){
					if(sQuery.hasOwnProperty(k))
						oResult[k] = arguments.callee(sQuery[k], oParent, oOptions);
				}
				
				return oResult;
			}
			
			cost = 0;
			
			var executeTime = new Date().getTime();
			var aRet;
			
			for (var r = 0, rp = debugOption.repeat; r < rp; r++) {
				
				aRet = (function(sQuery, oParent, oOptions) {
					
					if(oOptions){
						if(!oOptions.oneTimeOffCache){
							oOptions.oneTimeOffCache = false;
						}
					}else{
						oOptions = {oneTimeOffCache:false};
					}
					cssquery.safeHTML(oOptions.oneTimeOffCache);
					
					if (!oParent) oParent = document;
						
					/*
					 
	ownerDocument 잡아주기
	  
					 */
					oDocument_dontShrink = oParent.ownerDocument || oParent.document || oParent;
					
					/*
					 
	브라우저 버젼이 IE5.5 이하
	  
					 */
					if (/\bMSIE\s([0-9]+(\.[0-9]+)*);/.test(navigator.userAgent) && parseFloat(RegExp.$1) < 6) {
						try { oDocument_dontShrink.location; } catch(e) { oDocument_dontShrink = document; }
						
						oDocument_dontShrink.firstChild = oDocument_dontShrink.getElementsByTagName('html')[0];
						oDocument_dontShrink.firstChild._IE5_parentNode = oDocument_dontShrink;
					}
					
					/*
					 
	XMLDocument 인지 체크
	  
					 */
					bXMLDocument = (typeof XMLDocument != 'undefined') ? (oDocument_dontShrink.constructor === XMLDocument) : (!oDocument_dontShrink.location);
					getUID = bXMLDocument ? getUID4XML : getUID4HTML;
			
					clearKeys();
					
					/*
					 
	쿼리를 쉼표로 나누기
	  
					 */
					var aSplitQuery = backupKeys(sQuery).split(/\s*,\s*/);
					var aResult = [];
					
					var nLen = aSplitQuery.length;
					
					for (var i = 0; i < nLen; i++)
						aSplitQuery[i] = restoreKeys(aSplitQuery[i]);
					
					/*
					 
	쉼표로 나눠진 쿼리 루프
	  
					 */
					for (var i = 0; i < nLen; i++) {
						
						var sSingleQuery = aSplitQuery[i];
						var aSingleQueryResult = null;
						
						var sResultCacheKey = sSingleQuery + (oOptions.single ? '_single' : '');
			
						/*
						 
	결과 캐쉬 뒤짐
	  
						 */
						var aCache = bUseResultCache ? oResultCache[sResultCacheKey] : null;
						if (aCache) {
							
							/*
							 
	캐싱되어 있는게 있으면 parent 가 같은건지 검사한후 aSingleQueryResult 에 대입
	  
							 */
							for (var j = 0, oCache; oCache = aCache[j]; j++) {
								if (oCache.parent == oParent) {
									aSingleQueryResult = oCache.result;
									break;
								}
							}
							
						}
						
						if (!aSingleQueryResult) {
							
							var fpFunction = parseQuery(sSingleQuery);
							// alert(fpFunction);
							
							cssquery._marked = [];
							for (var j = 0, nDepth = fpFunction.depth; j < nDepth; j++)
								cssquery._marked.push({});
							
							// console.log(fpFunction.toSource());
							aSingleQueryResult = distinct(fpFunction(oParent, oOptions));
							
							/*
							 
	결과 캐쉬를 사용중이면 캐쉬에 저장
	  
							 */
							if (bUseResultCache&&!oOptions.oneTimeOffCache) {
								if (!(oResultCache[sResultCacheKey] instanceof Array)) oResultCache[sResultCacheKey] = [];
								oResultCache[sResultCacheKey].push({ parent : oParent, result : aSingleQueryResult });
							}
							
						}
						
						aResult = aResult.concat(aSingleQueryResult);
						
					}
					unsetNodeIndexes();
			
					return aResult;
					
				})(sQuery, oParent, oOptions);
				
			}
			
			executeTime = new Date().getTime() - executeTime;

			if (debugOption.callback) debugOption.callback(sQuery, cost, executeTime);
			
			return aRet;
			
		};
		var cssquery;
		if (document.querySelectorAll) {
			function _isNonStandardQueryButNotException(sQuery){
				return /\[\s*(?:checked|selected|disabled)/.test(sQuery)
			}
			function _commaRevise (sQuery,sChange) {
				return sQuery.replace(/\,/gi,sChange);
			}
			
			var protoSlice = Array.prototype.slice;
			
			var _toArray = function(aArray){
				return protoSlice.apply(aArray);
			}
			
			try{
				protoSlice.apply(document.documentElement.childNodes);
			}catch(e){
				_toArray = function(aArray){
					var returnArray = [];
					var leng = aArray.length;
					for ( var i = 0; i < leng; i++ ) {
						returnArray.push( aArray[i] );
					}
					return returnArray;
				}
			}
			/**
			 
			 */
			cssquery = function(sQuery, oParent, oOptions){
				oParent = oParent || document ;
				try{
					if (_isNonStandardQueryButNotException(sQuery)) {
						throw Error("None Standard Query");
					}else{
						var sReviseQuery = sQuery;
						var oReviseParent = oParent;
						if (oParent.nodeType != 9) {
							if(bExtremeMode){
								if(!oParent.id) oParent.id = "p"+ new Date().getTime() + parseInt(Math.random() * 100000000,10);
							}else{
								throw Error("Parent Element has not ID.or It is not document.or None Extreme Mode.");
							}
							sReviseQuery = _commaRevise("#"+oParent.id+" "+sQuery,", #"+oParent.id);
							oReviseParent = oParent.ownerDocument||oParent.document||document;
						}
						if (oOptions&&oOptions.single) {
							return [oReviseParent.querySelector(sReviseQuery)];
						}else{
							return _toArray(oReviseParent.querySelectorAll(sReviseQuery));
						}
					}
				}catch(e){
					return old_cssquery(sQuery, oParent, oOptions);
				}
			}
		}else{
			cssquery = old_cssquery;
		}
		/*
		 
	 * @function
	 * @name CssQuery.test
	 * @description test() 메서드는 특정 요소가 해당 CSS 선택자(CSS Selector)에 부합하는 요소인지 판단하여 Boolean 형태로 반환한다. CSS 선택자에 연결자는 사용할 수 없음에 유의한다. 선택자의 패턴에 대한 설명은 CssQuery() 함수와 See Also 항목을 참고한다.
	 * @param {Element} element	검사하고자 하는 요소
	 * @param {String} sCSSSelector	CSS 선택자. CSS 선택자로 사용할 수 있는 패턴은 표준 패턴과 비표준 패턴이 있다. 표준 패턴은 CSS Level3 명세서에 있는 패턴을 지원한다.
	 * @return {Boolean} 조건에 부합하면 true, 부합하지 않으면 false를 반환한다.
	 * @see CssQuery
	 * @see <a href="http://www.w3.org/TR/css3-selectors/">CSS Level3 명세서</a> - W3C
	 * @example
		// oEl 이 div 태그 또는 p 태그, 또는 align 속성이 center로 지정된 요소인지 검사한다.
		if (cssquery.test(oEl, 'div, p, [align=center]'))
		alert('해당 조건 만족');
	  
		 */
		cssquery.test = function(oEl, sQuery) {

			clearKeys();
			
			var aFunc = parseTestQuery(sQuery);
			for (var i = 0, nLen = aFunc.length; i < nLen; i++){
				if (aFunc[i](oEl)) return true;
			}
				
				
			return false;
			
		};

		/*
		 
	 * @function
	 * @name CssQuery.useCache
	 * @description useCache() 메서드는 CssQuery() 함수(cssquery)를 사용할 때 캐시를 사용할 것인지 설정한다. 캐시를 사용하면 동일한 선택자로 탐색하는 경우 탐색하지 않고 기존 탐색 결과를 반환한다. 따라서 사용자가 변수 캐시를 신경쓰지 않고 편하고 빠르게 사용할 수 있는 장점이 있지만 신뢰성을 위해 DOM 구조가 동적으로 변하지 않을 때만 사용해야 한다.
	 * @param {Boolean} [bFlag] 캐시 사용 여부를 지정한다. 이 파라미터를 생략하면 캐시 사용 상태만 반환한다.
	 * @return {Boolean} 캐시 사용 상태를 반환한다.
	 * @see <a href="#.$$.clearCache">CssQuery.clearCache</a>
	  
		 */
		cssquery.useCache = function(bFlag) {
		
			if (typeof bFlag != 'undefined') {
				bUseResultCache = bFlag;
				cssquery.clearCache();
			}
			
			return bUseResultCache;
			
		};
		
		/*
		 
	 * @function
	 * @name CssQuery.clearCache
	 * @description clearCache() 메서드는 CssQuery() 함수(cssquery)에서 캐시를 사용할 때 캐시를 비울 때 사용한다. DOM 구조가 동적으로 바껴 기존의 캐시 데이터가 신뢰성이 없을 때 사용한다.
	 * @return {void}
	 * @see <a href="#.CssQuery.useCache">CssQuery.useCache</a>
	  
		 */
		cssquery.clearCache = function() {
			oResultCache = {};
		};
		
		/*
		 
	 * @function
	 * @name CssQuery.getSingle
	 * @description getSingle() 메서드는 CSS 선택자를 사용에서 조건을 만족하는 첫 번째 요소를 가져온다. 반환하는 값은 배열이 아닌 객채 또는 null이다. 조건을 만족하는 요소를 찾으면 바로 탐색 작업을 중단하기 때문에 결과가 하나라는 보장이 있을 때 빠른 속도로 결과를 가져올 수 있다.
	 CssQuery() 함수(cssquery)에서 캐시를 사용할 때 캐시를 비울 때 사용한다. DOM 구조가 동적으로 바껴 기존의 캐시 데이터가 신뢰성이 없을 때 사용한다.
	 * @param {String} sSelector CSS 선택자(CSS Selector). CSS 선택자로 사용할 수 있는 패턴은 표준 패턴과 비표준 패턴이 있다. 표준 패턴은 CSS3 Level3 명세서에 있는 패턴을 지원한다. 선택자의 패턴에 대한 설명은 CssQuery() 함수와 See Also 항목을 참고한다.
	 * @param {Element} [oBaseElement] 탐색 대상이 되는 DOM 요소. 지정한 요소의 하위 노드에서만 객체를 탐색한다. 생략될 경우 문서를 대상으로 찾는다. 
	 * @param {Object} [oOption] 옵션 객체에 onTimeOffCache 속성을 true로 설정하면 탐색할 때 캐시를 사용하지 않는다.
	 * @return {Element} 선택된 요소. 결과가 없으면 null을 반환한다.
	 * @see $Document#query	 
	 * @see <a href="#.CssQuery.useCache">CssQuery.useCache</a>
	 * @see $$
	 * @see <a href="http://www.w3.org/TR/css3-selectors/">CSS Level3 명세서</a> - W3C
	  
		 */
		cssquery.getSingle = function(sQuery, oParent, oOptions) {

			return cssquery(sQuery, oParent, { single : true ,oneTimeOffCache:oOptions?(!!oOptions.oneTimeOffCache):false})[0] || null;
		};
		
		
		/*
		 
	 * @function
	 * @name CssQuery.xpath
	 * @description xpath() 메서드는 XPath 문법을 만족하는 요소를 가져온다. 지원하는 문법이 제한적이므로 특수한 경우에만 사용할 것을 권장한다.
	 * @param {String} sXPath XPath 값.
	 * @param {Element} [elBaseElement] 탐색 대상이 되는 DOM 요소. 지정한 요소의 하위 노드에서만 객체를 탐색한다. 생략될 경우 문서를 대상으로 찾는다. 
	 * @return {Array} XPath 문법을 만족하는 요소를 원소로 하는 배열. 결과가 없으면 null을 반환한다.
	 * @see $Document#xpathAll
	 * @see <a href="http://www.w3.org/standards/techs/xpath#w3c_all">XPath 문서</a> - W3C
	  
		 */
		cssquery.xpath = function(sXPath, oParent) {
			
			var sXPath = sXPath.replace(/\/(\w+)(\[([0-9]+)\])?/g, function(_1, sTag, _2, sTh) {
				sTh = sTh || '1';
				return '>' + sTag + ':nth-of-type(' + sTh + ')';
			});
			
			return old_cssquery(sXPath, oParent);
			
		};
		
		/*
		 
	 * @function
	 * @name CssQuery.debug
	 * @description debug() 메서드는 CssQuery() 함수(cssquery)를 사용할 때 성능을 측정하기 위한 기능을 제공하는 함수이다. 파라미터로 입력한 콜백 함수를 사용하여 성능을 측정한다.
	 * @param {Function} fCallback 선택자 실행에 소요된 비용과 시간을 점검하는 함수. 이 파라미터에 함수 대신 false를 입력하면 성능 측정 모드(debug)를 사용하지 않는다. 이 콜백 함수는 파라미터로 query, cost, executeTime을 갖는다.<br>
	 <ul>
		<li>query는 실행에 사용된 선택자이다.</li>
		<li>index는 탐색에 사용된 비용이다(루프 횟수).</li>
		<li>executeTime 탐색에 소요된 시간이다.</li>
	 * @param {Number} [nRepeat] 하나의 선택자를 반복 수행할 횟수. 인위적으로 실행 속도를 늦추기 위해 사용할 수 있다.
	 * @return {Void}
	 * @example
	cssquery.debug(function(sQuery, nCost, nExecuteTime) {
		if (nCost > 5000)
			console.warn('5000이 넘는 비용이? 확인 -> ' + sQuery + '/' + nCost);
		else if (nExecuteTime > 200)
			console.warn('0.2초가 넘게 실행을? 확인 -> ' + sQuery + '/' + nExecuteTime);
	}, 20);

	....

	cssquery.debug(false);
	  
		 */
		cssquery.debug = function(fpCallback, nRepeat) {
			
			debugOption.callback = fpCallback;
			debugOption.repeat = nRepeat || 1;
			
		};
		
		/*
		 
	 * @function
	 * @name CssQuery.safeHTML
	 * @description safeHTML() 메서드는 인터넷 익스플로러에서 innerHTML 속성을 사용할 때 _cssquery_UID 값이 나오지 않게 하는 함수이다. true로 설정하면 탐색하는 노드의 innerHTML 속성에 _cssquery_UID가 나오지 않게 할 수 있지만 탐색 속도는 느려질 수 있다.
	 * @param {Boolean} bFlag _cssquery_UID의 표시 여부를 지정한다. true로 설정하면 _cssquery_UID가 나오지 않는다.
	 * @return {Boolean} _cssquery_UID 표시 여부 상태를 반환한다. _cssquery_UID를 표시하는 상태이면 true를 반환하고 그렇지 않으면 false를 반환한다.
	  
		 */
		cssquery.safeHTML = function(bFlag) {
			
			var bIE = /MSIE/.test(window.navigator.userAgent);
			
			if (arguments.length > 0)
				safeHTML = bFlag && bIE;
			
			return safeHTML || !bIE;
			
		};
		
		/*
		 
	 * @field
	 * @name CssQuery.version
	 * @description version 속성은 cssquery의 버전 정보를 담고 있는 문자열이다.
	  
		 */
		cssquery.version = sVersion;
		
		/*
		 
		 * IE에서 validUID,cache를 사용했을때 메모리 닉이 발생하여 삭제하는 모듈 추가.
	  
		 */
		cssquery.release = function() {
			if(/MSIE/.test(window.navigator.userAgent)){
				
				delete validUID;
				validUID = {};
				
				if(bUseResultCache){
					cssquery.clearCache();
				}
			}
		};
		/*
		 
		 * cache가 삭제가 되는지 확인하기 위해 필요한 함수
		 * @ignore
	  
		 */
		cssquery._getCacheInfo = function(){
			return {
				uidCache : validUID,
				eleCache : oResultCache 
			}
		}
		/*
		 
		 * 테스트를 위해 필요한 함수
		 * @ignore
	  
		 */
		cssquery._resetUID = function(){
			UID = 0
		}
		/*
		 
		 * querySelector가 있는 브라우져에서 extreme을 실행시키면 querySelector을 사용할수 있는 커버리지가 높아져 전체적으로 속도가 빨리진다.
		 * 하지만 ID가 없는 엘리먼트를 기준 엘리먼트로 넣었을 때 기준 엘리먼트에 임의의 아이디가 들어간다.
		 * @param {Boolean} bExtreme true
	  
		 */
		cssquery.extreme = function(bExtreme){
			if(arguments.length == 0){
				bExtreme = true;
			}
			bExtremeMode = bExtreme;
		}

		return cssquery;
		
	})();
	return CssQuery;
});