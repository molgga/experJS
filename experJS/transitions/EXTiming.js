define(function(require , exports){

	/**
	<strong>(beta)</strong> EXTiming 의 transform easing 과 관련된 함수(CSS String)를 제공합니다.
	@class EXTiming
	@static
	*/
	var EXTiming = {
		/** 
		@property ease
		@type {String}
		@static
		@final
		*/
		ease : "ease"
		/** 
		@property linear
		@type {String}
		@static
		@final
		*/
		, linear : "linear"
		/** 
		@property easeIn
		@type {String}
		@static
		@final
		*/
		, easeIn : "ease-in"
		/** 
		@property easeOut
		@type {String}
		@static
		@final
		*/
		, easeOut : "ease-out"
		/** 
		@property easeInOut
		@type {String}
		@static
		@final
		*/
		, easeInOut : "ease-in-out"
		/** 
		@property forkIn
		@type {String}
		@static
		@final
		*/
		, forkIn : "cubic-bezier(0.77 , 0.33 , 0.33 , 1)"
		/** 
		@property forkOut
		@type {String}
		@static
		@final
		*/
		, forkOut : "cubic-bezier(0.12 , 0.6 , 0.23 , 1)"
		/** 
		@property forkInOut
		@type {String}
		@static
		@final
		*/
		, forkInOut : "cubic-bezier(0.76 , 0.08 , 0.23 , 1)"
		/** 
		@property cutterIn
		@type {String}
		@static
		@final
		*/
		, cutterIn : "cubic-bezier(0.55 , 0 , 0.2 , 1)"
		/** 
		@property cutterOut
		@type {String}
		@static
		@final
		*/
		, cutterOut : "cubic-bezier(0 , 0 , 0.12 , 1)"
		/** 
		@property cutterInOut
		@type {String}
		@static
		@final
		*/
		, cutterInOut: "cubic-bezier(0.64 , 0.26 , 0.25 , 1)"

		//EXTiming.test : EXTiming.slideInOut;
		, backOut : "cubic-bezier(0.25 , 0.1 , 0.25 , 1.48)"
		//end EXTiming Transform
	};
	return EXTiming;
});