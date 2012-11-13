/*
 RequireJS 2.0.4 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/

/**
javascript module loader
<br/><a href="http://requirejs.org/" target="_blank">http://requirejs.org/</a>
@class requirejs
*/
var requirejs;
/**
javascript module loader
<br/><a href="http://requirejs.org/" target="_blank">http://requirejs.org/</a>
@class require
*/
var require;
/**
javascript module loader
<br/><a href="http://requirejs.org/" target="_blank">http://requirejs.org/</a>
@class define
*/
var define;

(function(Y){function x(b){return J.call(b)==="[object Function]"}function G(b){return J.call(b)==="[object Array]"}function q(b,c){if(b){var e;for(e=0;e<b.length;e+=1)if(b[e]&&c(b[e],e,b))break}}function N(b,c){if(b){var e;for(e=b.length-1;e>-1;e-=1)if(b[e]&&c(b[e],e,b))break}}function y(b,c){for(var e in b)if(b.hasOwnProperty(e)&&c(b[e],e))break}function K(b,c,e,i){c&&y(c,function(c,j){if(e||!b.hasOwnProperty(j))i&&typeof c!=="string"?(b[j]||(b[j]={}),K(b[j],c,e,i)):b[j]=c});return b}function s(b,
c){return function(){return c.apply(b,arguments)}}function Z(b){if(!b)return b;var c=Y;q(b.split("."),function(b){c=c[b]});return c}function $(b,c,e){return function(){var i=fa.call(arguments,0),g;if(e&&x(g=i[i.length-1]))g.__requireJsBuild=!0;i.push(c);return b.apply(null,i)}}function aa(b,c,e){q([["toUrl"],["undef"],["defined","requireDefined"],["specified","requireSpecified"]],function(i){var g=i[1]||i[0];b[i[0]]=c?$(c[g],e):function(){var b=z[O];return b[g].apply(b,arguments)}})}function H(b,
c,e,i){c=Error(c+"\nhttp://requirejs.org/docs/errors.html#"+b);c.requireType=b;c.requireModules=i;if(e)c.originalError=e;return c}function ga(){if(I&&I.readyState==="interactive")return I;N(document.getElementsByTagName("script"),function(b){if(b.readyState==="interactive")return I=b});return I}var ha=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,ia=/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,ba=/\.js$/,ja=/^\.\//,J=Object.prototype.toString,A=Array.prototype,fa=A.slice,ka=A.splice,w=!!(typeof window!==
"undefined"&&navigator&&document),ca=!w&&typeof importScripts!=="undefined",la=w&&navigator.platform==="PLAYSTATION 3"?/^complete$/:/^(complete|loaded)$/,O="_",S=typeof opera!=="undefined"&&opera.toString()==="[object Opera]",z={},p={},P=[],L=!1,j,t,C,u,D,I,E,da,ea;if(typeof define==="undefined"){if(typeof requirejs!=="undefined"){if(x(requirejs))return;p=requirejs;requirejs=void 0}typeof require!=="undefined"&&!x(require)&&(p=require,require=void 0);j=requirejs=function(b,c,e,i){var g=O,r;!G(b)&&
typeof b!=="string"&&(r=b,G(c)?(b=c,c=e,e=i):b=[]);if(r&&r.context)g=r.context;(i=z[g])||(i=z[g]=j.s.newContext(g));r&&i.configure(r);return i.require(b,c,e)};j.config=function(b){return j(b)};require||(require=j);j.version="2.0.4";j.jsExtRegExp=/^\/|:|\?|\.js$/;j.isBrowser=w;A=j.s={contexts:z,newContext:function(b){function c(a,d,o){var l=d&&d.split("/"),f=l,b=k.map,c=b&&b["*"],e,g,h;if(a&&a.charAt(0)===".")if(d){f=k.pkgs[d]?l=[d]:l.slice(0,l.length-1);d=a=f.concat(a.split("/"));for(f=0;d[f];f+=
1)if(e=d[f],e===".")d.splice(f,1),f-=1;else if(e==="..")if(f===1&&(d[2]===".."||d[0]===".."))break;else f>0&&(d.splice(f-1,2),f-=2);f=k.pkgs[d=a[0]];a=a.join("/");f&&a===d+"/"+f.main&&(a=d)}else a.indexOf("./")===0&&(a=a.substring(2));if(o&&(l||c)&&b){d=a.split("/");for(f=d.length;f>0;f-=1){g=d.slice(0,f).join("/");if(l)for(e=l.length;e>0;e-=1)if(o=b[l.slice(0,e).join("/")])if(o=o[g]){h=o;break}!h&&c&&c[g]&&(h=c[g]);if(h){d.splice(0,f,h);a=d.join("/");break}}}return a}function e(a){w&&q(document.getElementsByTagName("script"),
function(d){if(d.getAttribute("data-requiremodule")===a&&d.getAttribute("data-requirecontext")===h.contextName)return d.parentNode.removeChild(d),!0})}function i(a){var d=k.paths[a];if(d&&G(d)&&d.length>1)return e(a),d.shift(),h.undef(a),h.require([a]),!0}function g(a,d,o,b){var f=a?a.indexOf("!"):-1,v=null,e=d?d.name:null,g=a,i=!0,j="",k,m;a||(i=!1,a="_@r"+(N+=1));f!==-1&&(v=a.substring(0,f),a=a.substring(f+1,a.length));v&&(v=c(v,e,b),m=n[v]);a&&(v?j=m&&m.normalize?m.normalize(a,function(a){return c(a,
e,b)}):c(a,e,b):(j=c(a,e,b),k=h.nameToUrl(j)));a=v&&!m&&!o?"_unnormalized"+(O+=1):"";return{prefix:v,name:j,parentMap:d,unnormalized:!!a,url:k,originalName:g,isDefine:i,id:(v?v+"!"+j:j)+a}}function r(a){var d=a.id,o=m[d];o||(o=m[d]=new h.Module(a));return o}function p(a,d,o){var b=a.id,f=m[b];if(n.hasOwnProperty(b)&&(!f||f.defineEmitComplete))d==="defined"&&o(n[b]);else r(a).on(d,o)}function B(a,d){var b=a.requireModules,l=!1;if(d)d(a);else if(q(b,function(d){if(d=m[d])d.error=a,d.events.error&&(l=
!0,d.emit("error",a))}),!l)j.onError(a)}function u(){P.length&&(ka.apply(F,[F.length-1,0].concat(P)),P=[])}function t(a,d,b){a=a&&a.map;d=$(b||h.require,a,d);aa(d,h,a);d.isBrowser=w;return d}function z(a){delete m[a];q(M,function(d,b){if(d.map.id===a)return M.splice(b,1),d.defined||(h.waitCount-=1),!0})}function A(a,d){var b=a.map.id,l=a.depMaps,f;if(a.inited){if(d[b])return a;d[b]=!0;q(l,function(a){if(a=m[a.id])return!a.inited||!a.enabled?(f=null,delete d[b],!0):f=A(a,K({},d))});return f}}function C(a,
d,b){var l=a.map.id,f=a.depMaps;if(a.inited&&a.map.isDefine){if(d[l])return n[l];d[l]=a;q(f,function(f){var f=f.id,c=m[f];!Q[f]&&c&&(!c.inited||!c.enabled?b[l]=!0:(c=C(c,d,b),b[f]||a.defineDepById(f,c)))});a.check(!0);return n[l]}}function D(a){a.check()}function E(){var a=k.waitSeconds*1E3,d=a&&h.startTime+a<(new Date).getTime(),b=[],l=!1,f=!0,c,g,j;if(!T){T=!0;y(m,function(a){c=a.map;g=c.id;if(a.enabled&&!a.error)if(!a.inited&&d)i(g)?l=j=!0:(b.push(g),e(g));else if(!a.inited&&a.fetched&&c.isDefine&&
(l=!0,!c.prefix))return f=!1});if(d&&b.length)return a=H("timeout","Load timeout for modules: "+b,null,b),a.contextName=h.contextName,B(a);f&&(q(M,function(a){if(!a.defined){var a=A(a,{}),d={};a&&(C(a,d,{}),y(d,D))}}),y(m,D));if((!d||j)&&l)if((w||ca)&&!U)U=setTimeout(function(){U=0;E()},50);T=!1}}function V(a){r(g(a[0],null,!0)).init(a[1],a[2])}function J(a){var a=a.currentTarget||a.srcElement,d=h.onScriptLoad;a.detachEvent&&!S?a.detachEvent("onreadystatechange",d):a.removeEventListener("load",d,
!1);d=h.onScriptError;a.detachEvent&&!S||a.removeEventListener("error",d,!1);return{node:a,id:a&&a.getAttribute("data-requiremodule")}}var k={waitSeconds:7,baseUrl:"./",paths:{},pkgs:{},shim:{}},m={},W={},F=[],n={},R={},N=1,O=1,M=[],T,X,h,Q,U;Q={require:function(a){return t(a)},exports:function(a){a.usingExports=!0;if(a.map.isDefine)return a.exports=n[a.map.id]={}},module:function(a){return a.module={id:a.map.id,uri:a.map.url,config:function(){return k.config&&k.config[a.map.id]||{}},exports:n[a.map.id]}}};
X=function(a){this.events=W[a.id]||{};this.map=a;this.shim=k.shim[a.id];this.depExports=[];this.depMaps=[];this.depMatched=[];this.pluginMaps={};this.depCount=0};X.prototype={init:function(a,d,b,l){l=l||{};if(!this.inited){this.factory=d;if(b)this.on("error",b);else this.events.error&&(b=s(this,function(a){this.emit("error",a)}));this.depMaps=a&&a.slice(0);this.depMaps.rjsSkipMap=a.rjsSkipMap;this.errback=b;this.inited=!0;this.ignore=l.ignore;l.enabled||this.enabled?this.enable():this.check()}},defineDepById:function(a,
d){var b;q(this.depMaps,function(d,f){if(d.id===a)return b=f,!0});return this.defineDep(b,d)},defineDep:function(a,d){this.depMatched[a]||(this.depMatched[a]=!0,this.depCount-=1,this.depExports[a]=d)},fetch:function(){if(!this.fetched){this.fetched=!0;h.startTime=(new Date).getTime();var a=this.map;if(this.shim)t(this,!0)(this.shim.deps||[],s(this,function(){return a.prefix?this.callPlugin():this.load()}));else return a.prefix?this.callPlugin():this.load()}},load:function(){var a=this.map.url;R[a]||
(R[a]=!0,h.load(this.map.id,a))},check:function(a){if(this.enabled&&!this.enabling){var d=this.map.id,b=this.depExports,c=this.exports,f=this.factory,e;if(this.inited)if(this.error)this.emit("error",this.error);else{if(!this.defining){this.defining=!0;if(this.depCount<1&&!this.defined){if(x(f)){if(this.events.error)try{c=h.execCb(d,f,b,c)}catch(g){e=g}else c=h.execCb(d,f,b,c);if(this.map.isDefine)if((b=this.module)&&b.exports!==void 0&&b.exports!==this.exports)c=b.exports;else if(c===void 0&&this.usingExports)c=
this.exports;if(e)return e.requireMap=this.map,e.requireModules=[this.map.id],e.requireType="define",B(this.error=e)}else c=f;this.exports=c;if(this.map.isDefine&&!this.ignore&&(n[d]=c,j.onResourceLoad))j.onResourceLoad(h,this.map,this.depMaps);delete m[d];this.defined=!0;h.waitCount-=1;h.waitCount===0&&(M=[])}this.defining=!1;if(!a&&this.defined&&!this.defineEmitted)this.defineEmitted=!0,this.emit("defined",this.exports),this.defineEmitComplete=!0}}else this.fetch()}},callPlugin:function(){var a=
this.map,d=a.id,b=g(a.prefix,null,!1,!0);p(b,"defined",s(this,function(b){var f=this.map.name,e=this.map.parentMap?this.map.parentMap.name:null;if(this.map.unnormalized){if(b.normalize&&(f=b.normalize(f,function(a){return c(a,e,!0)})||""),b=g(a.prefix+"!"+f,this.map.parentMap,!1,!0),p(b,"defined",s(this,function(a){this.init([],function(){return a},null,{enabled:!0,ignore:!0})})),b=m[b.id]){if(this.events.error)b.on("error",s(this,function(a){this.emit("error",a)}));b.enable()}}else f=s(this,function(a){this.init([],
function(){return a},null,{enabled:!0})}),f.error=s(this,function(a){this.inited=!0;this.error=a;a.requireModules=[d];y(m,function(a){a.map.id.indexOf(d+"_unnormalized")===0&&z(a.map.id)});B(a)}),f.fromText=function(a,d){var b=L;b&&(L=!1);r(g(a));j.exec(d);b&&(L=!0);h.completeLoad(a)},b.load(a.name,t(a.parentMap,!0,function(a,d){a.rjsSkipMap=!0;return h.require(a,d)}),f,k)}));h.enable(b,this);this.pluginMaps[b.id]=b},enable:function(){this.enabled=!0;if(!this.waitPushed)M.push(this),h.waitCount+=
1,this.waitPushed=!0;this.enabling=!0;q(this.depMaps,s(this,function(a,d){var b,c;if(typeof a==="string"){a=g(a,this.map.isDefine?this.map:this.map.parentMap,!1,!this.depMaps.rjsSkipMap);this.depMaps[d]=a;if(b=Q[a.id]){this.depExports[d]=b(this);return}this.depCount+=1;p(a,"defined",s(this,function(a){this.defineDep(d,a);this.check()}));this.errback&&p(a,"error",this.errback)}b=a.id;c=m[b];!Q[b]&&c&&!c.enabled&&h.enable(a,this)}));y(this.pluginMaps,s(this,function(a){var b=m[a.id];b&&!b.enabled&&
h.enable(a,this)}));this.enabling=!1;this.check()},on:function(a,b){var c=this.events[a];c||(c=this.events[a]=[]);c.push(b)},emit:function(a,b){q(this.events[a],function(a){a(b)});a==="error"&&delete this.events[a]}};return h={config:k,contextName:b,registry:m,defined:n,urlFetched:R,waitCount:0,defQueue:F,Module:X,makeModuleMap:g,configure:function(a){a.baseUrl&&a.baseUrl.charAt(a.baseUrl.length-1)!=="/"&&(a.baseUrl+="/");var b=k.pkgs,c=k.shim,e=k.paths,f=k.map;K(k,a,!0);k.paths=K(e,a.paths,!0);if(a.map)k.map=
K(f||{},a.map,!0,!0);if(a.shim)y(a.shim,function(a,b){G(a)&&(a={deps:a});if(a.exports&&!a.exports.__buildReady)a.exports=h.makeShimExports(a.exports);c[b]=a}),k.shim=c;if(a.packages)q(a.packages,function(a){a=typeof a==="string"?{name:a}:a;b[a.name]={name:a.name,location:a.location||a.name,main:(a.main||"main").replace(ja,"").replace(ba,"")}}),k.pkgs=b;y(m,function(a,b){a.map=g(b)});if(a.deps||a.callback)h.require(a.deps||[],a.callback)},makeShimExports:function(a){var b;return typeof a==="string"?
(b=function(){return Z(a)},b.exports=a,b):function(){return a.apply(Y,arguments)}},requireDefined:function(a,b){var c=g(a,b,!1,!0).id;return n.hasOwnProperty(c)},requireSpecified:function(a,b){a=g(a,b,!1,!0).id;return n.hasOwnProperty(a)||m.hasOwnProperty(a)},require:function(a,d,c,e){var f;if(typeof a==="string"){if(x(d))return B(H("requireargs","Invalid require call"),c);if(j.get)return j.get(h,a,d);a=g(a,d,!1,!0);a=a.id;return!n.hasOwnProperty(a)?B(H("notloaded",'Module name "'+a+'" has not been loaded yet for context: '+
b)):n[a]}c&&!x(c)&&(e=c,c=void 0);d&&!x(d)&&(e=d,d=void 0);for(u();F.length;)if(f=F.shift(),f[0]===null)return B(H("mismatch","Mismatched anonymous define() module: "+f[f.length-1]));else V(f);r(g(null,e)).init(a,d,c,{enabled:!0});E();return h.require},undef:function(a){var b=g(a,null,!0),c=m[a];delete n[a];delete R[b.url];delete W[a];if(c){if(c.events.defined)W[a]=c.events;z(a)}},enable:function(a){m[a.id]&&r(a).enable()},completeLoad:function(a){var b=k.shim[a]||{},c=b.exports&&b.exports.exports,
e,f;for(u();F.length;){f=F.shift();if(f[0]===null){f[0]=a;if(e)break;e=!0}else f[0]===a&&(e=!0);V(f)}f=m[a];if(!e&&!n[a]&&f&&!f.inited)if(k.enforceDefine&&(!c||!Z(c)))if(i(a))return;else return B(H("nodefine","No define call for "+a,null,[a]));else V([a,b.deps||[],b.exports]);E()},toUrl:function(a,b){var e=a.lastIndexOf("."),g=null;e!==-1&&(g=a.substring(e,a.length),a=a.substring(0,e));return h.nameToUrl(c(a,b&&b.id,!0),g)},nameToUrl:function(a,b){var c,e,f,g,h,i;if(j.jsExtRegExp.test(a))g=a+(b||
"");else{c=k.paths;e=k.pkgs;g=a.split("/");for(h=g.length;h>0;h-=1)if(i=g.slice(0,h).join("/"),f=e[i],i=c[i]){G(i)&&(i=i[0]);g.splice(0,h,i);break}else if(f){c=a===f.name?f.location+"/"+f.main:f.location;g.splice(0,h,c);break}g=g.join("/")+(b||".js");g=(g.charAt(0)==="/"||g.match(/^[\w\+\.\-]+:/)?"":k.baseUrl)+g}return k.urlArgs?g+((g.indexOf("?")===-1?"?":"&")+k.urlArgs):g},load:function(a,b){j.load(h,a,b)},execCb:function(a,b,c,e){return b.apply(e,c)},onScriptLoad:function(a){if(a.type==="load"||
la.test((a.currentTarget||a.srcElement).readyState))I=null,a=J(a),h.completeLoad(a.id)},onScriptError:function(a){var b=J(a);if(!i(b.id))return B(H("scripterror","Script error",a,[b.id]))}}}};j({});aa(j);if(w&&(t=A.head=document.getElementsByTagName("head")[0],C=document.getElementsByTagName("base")[0]))t=A.head=C.parentNode;j.onError=function(b){throw b;};j.load=function(b,c,e){var i=b&&b.config||{},g;if(w)return g=i.xhtml?document.createElementNS("http://www.w3.org/1999/xhtml","html:script"):document.createElement("script"),
g.type=i.scriptType||"text/javascript",g.charset="utf-8",g.async=!0,g.setAttribute("data-requirecontext",b.contextName),g.setAttribute("data-requiremodule",c),g.attachEvent&&!(g.attachEvent.toString&&g.attachEvent.toString().indexOf("[native code")<0)&&!S?(L=!0,g.attachEvent("onreadystatechange",b.onScriptLoad)):(g.addEventListener("load",b.onScriptLoad,!1),g.addEventListener("error",b.onScriptError,!1)),g.src=e,E=g,C?t.insertBefore(g,C):t.appendChild(g),E=null,g;else ca&&(importScripts(e),b.completeLoad(c))};
w&&N(document.getElementsByTagName("script"),function(b){if(!t)t=b.parentNode;if(u=b.getAttribute("data-main")){if(!p.baseUrl)D=u.split("/"),da=D.pop(),ea=D.length?D.join("/")+"/":"./",p.baseUrl=ea,u=da;u=u.replace(ba,"");p.deps=p.deps?p.deps.concat(u):[u];return!0}});define=function(b,c,e){var i,g;typeof b!=="string"&&(e=c,c=b,b=null);G(c)||(e=c,c=[]);!c.length&&x(e)&&e.length&&(e.toString().replace(ha,"").replace(ia,function(b,e){c.push(e)}),c=(e.length===1?["require"]:["require","exports","module"]).concat(c));
if(L&&(i=E||ga()))b||(b=i.getAttribute("data-requiremodule")),g=z[i.getAttribute("data-requirecontext")];(g?g.defQueue:P).push([b,c,e])};define.amd={jQuery:!0};j.exec=function(b){return eval(b)};j(p)}})(this);


/**
@class EX
@static
*/
var EX = {};

(function(){
	var readyCallBacks = [];
	var isConsole = (typeof(console) == "undefined") ? false : true;
	var isIncluded = false;
	var includeBasePath = "";
	var includePackage = [];
	var includeClass = [];
	
	/**
	EX 관련 라이브러리의 include 를 시작합니다.
	@method includeBegin
	@static
	@param [basePath=""] {String} include 의 기본 경로를 지정합니다.
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<title></title>
		<script type="text/javascript" src="../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.includeBegin("../../experJS"); // basePath
			EX.include("events/EXEventListener"); // class name EXEventListener
			EX.includeBegin("../../"); // basePath
			EX.include("experJS/transitions/EXTween"); // class name EXTween
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX.ready" , "callback" , EXEventListener);
				EX.debug("EX.ready" , "callback" , EXTween);
			});
		})();
		</script>
		</head>
		<body>
		</body>
		</html>
	*/
	EX.includeBegin = function(basePath){
		isIncluded = true;
		if(basePath != undefined){
			includeBasePath = basePath;
		}
	};

	/**
	EX 관련 라이브러리를 include 합니다.
	<br/>include 호출 전 includeBegin 메소드 호출과 호출 후 includeEnd 메소드 호출이 이루어져야 합니다.
	@method include
	@static
	@param packageClass {String} include 할 class 의 경로 및 class name
	@param compulsionName {String} 강제로 class 명을 변경 합니다.
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<title></title>
		<script type="text/javascript" src="../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.includeBegin("../../experJS");
			EX.include("events/EXEventListener"); // class name EXEventListener
			EX.include("transitions/EXTween"); // class name EXTween
			EX.include("transitions/EXEasing" , "Easing"); // compulsion class name Easing
			EX.includeEnd();
			EX.ready(function(){
				EX.debug("EX" , "ready");
				EX.debug(EXEventListener);
				EX.debug(EXTween);
				EX.debug(Easing);
			});
		})();
		</script>
		</head>
		<body>
		</body>
		</html>
	*/
	EX.include = function(packageClass, compulsionName){
		includePackage.push(includeBasePath +"/"+ packageClass+".js");
		
		var classReg = /\//g;
		var classSearchIndex = 0
		var loopCount = 0;
		classReg.lastIndex;
		while(classSearch = classReg.exec(packageClass)){
			classSearchIndex = classSearch.index+1;
			if(loopCount > 10) break;
		}
		var packName = packageClass.substring(classSearchIndex , packageClass.length);
		if(compulsionName != undefined && typeof(compulsionName) == "string"){
			packName = compulsionName;
		}
		includeClass.push(packName);
	};

	/**
	include 지정을 확정하고 include 하는 파일(들)의 로드를 시작합니다.
	@method includeEnd
	@static
	@param scope {Object} EX 에 의해 로드되는 클래스(들)을 바인딩 할 오브젝트.(기본 window)
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<title></title>
		<script type="text/javascript" src="../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			var foo = {};
			EX.includeBegin("../../experJS");
			EX.include("transitions/EXTween");
			EX.includeEnd(foo); // name
			EX.ready(function(){
				EX.debug("EX" , "ready");
				EX.debug(foo.EXTween);
			});
		})();
		</script>
		</head>
		<body>
		</body>
		</html>
	*/
	EX.includeEnd = function(scope){
		if(scope == undefined) scope = window;
		try{
			var len = includePackage.length;
			require( includePackage , function(){
				var len = arguments.length;
				for(var i = 0 ; i < len ; i++){
					scope[includeClass[i]] = arguments[i];
				}
				requireComplete();
			});
		}catch(e){
			EX.debug("EX.includeEnd : " + e);
		}
	}

	/**
	@method requireComplete
	@private
	*/
	function requireComplete(){
		// initialize
		if(document.readyState == "complete" || document.readyState == "loaded"){
			initReady();
		}else{
			if(window.addEventListener){
				window.addEventListener("load" , initReady);
			}else if(typeof(document.onreadystatechange) != undefined){
				document.onreadystatechange = function(){
					switch(document.readyState){
						case "complete" : case "ready" :
							document.onreadystatechange = null;
							initReady();
							break;
					}
				}
			}
		}
	}
	

	/**
	console 속성을 사용할 수 있는 환경일 경우 console 창으로 내용을 출력합니다.
	<br/>파라미터의 갯수는 상관없고, 파라미터의 갯수가 한 개일 경우 console.log 를 통한 출력과 동일한 결과를 얻을 수 있습니다.
	@method debug
	@static
	@param ... {arguments} 출력할 파라미터(들)
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<title></title>
		<script type="text/javascript" src="../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.ready(function(){
				EX.debug("EX.ready" , "callback1");
			});
			EX.ready(function(){
				EX.debug("EX.ready" , "callback2");
			});
			EX.ready(function(){
				EX.debug("EX.ready" , "callback3");
			});
		})();
		</script>
		</head>
		<body>
		</body>
		</html>
	*/
	EX.debug = function(){
		var msgs = arguments;
		var len = msgs.length;
		var concat = "";
		var msg = null;
		if(len <= 1){
			concat = msgs[0];
		}else{
			for(var i = 0 ; i < len ; i++){
				msg = msgs[i];
				if(msg != undefined){
					concat = concat + msg.toString() +" ";
				}else{
					concat = concat + "undefined ";
				}
				/*
				if(msg){
					concat = concat + msg.toString() +" ";
				}else{
					concat = concat + typeof(msg) +" ";
				}
				*/
			}
		}
		if(isConsole == true){
			if(EX.debugAlert == true){
				alert(concat);
			}else{
				console.log(concat);
			}
		}else{
			if(EX.debugAlert == true){
				alert(concat);
			}
		}
	};

	/**
	console 창이 아닌 alert 창으로 디버깅 출력을 합니다.
	@property debugAlert
	@type {boolean}
	@default false
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<title></title>
		<script type="text/javascript" src="../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.ready(function(){
				EX.debug("EX.ready" , "callback");
				EX.debugAlert = true;
				EX.debug("EX.ready" , "debugAlert=" , EX.debugAlert);
				EX.debugAlert = false;
				EX.debug("EX.ready" , "debugAlert=" , EX.debugAlert);
			});
		})();
		</script>
		</head>
		<body>
		</body>
		</html>
	*/
	EX.debugAlert = false;

	/**
	문서(html)가 로드가 완료되었고 준비가 된 상태일 때 지정된 callback 메소드를 실행 시킵니다.
	<br/>문서가 준비된 상태가 아니라면 대기큐(queue)에 callback 메소드를 쌓아 놓고 문서가 준비 상태가 될때 실행 시킵니다.
	<br/>문서가 이미 준비된 상태에서 해당 메소드를 호출하면 callback 메소를 대기큐에 쌓지 않고 바로 실행 시킵니다.
	@method ready
	@static
	@param callback {Function}
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<title></title>
		<script type="text/javascript" src="../../experJS/experJS.js"></script>
		<script type="text/javascript">
		(function(){
			EX.ready(function(){
				EX.debug("EX.ready" , "callback1");
			});
			EX.ready(function(){
				EX.debug("EX.ready" , "callback2");
			});
			EX.ready(function(){
				EX.debug("EX.ready" , "callback3");
			});
		})();
		</script>
		</head>
		<body>
		</body>
		</html>
	*/
	EX.ready = function(callback){
		if(isIncluded == false){
			if(window.addEventListener){
				window.addEventListener("load" , initReady);
			}else if(window.attachEvent){
				window.attachEvent("load" , initReady);
			}
		}
		if(callback != undefined && typeof(callback) == "function"){
			readyCallBacks.push({callback: callback , isCalled: false});
		}
	};
	
	/**
	@method initialize
	@private
	*/
	function initReady(){
		if(window.removeEventListener){
			window.removeEventListener("load" , initReady);
		}
		var readyLength = readyCallBacks.length;
		var readyCallBack = null;
		for(var i = 0 ; i < readyLength ; i++){
			readyCallBack = readyCallBacks.shift();
			if(readyCallBack.isCalled == false){
				readyCallBack.callback();
				readyCallBack.isCalled = true;
			}
		}
	};

})();