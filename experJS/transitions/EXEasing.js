define(function(require , exports){

	/**
	EXTween 의 easing 과 관련된 함수를 제공합니다.
	@class EXEasing
	@static
	*/
	var EXEasing = {
		def: 'easeOutQuad', 
		/** 
		@method easeInQuad
		@static
		*/
		easeInQuad: function (x, t, b, c, d) { return c*(t/=d)*t + b; },

		/** 
		@method easeOutQuad
		@static
		*/
		easeOutQuad: function (x, t, b, c, d) { return -c *(t/=d)*(t-2) + b; },

		/** 
		@method easeInOutQuad
		@static
		*/
		easeInOutQuad: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t + b;
			return -c/2 * ((--t)*(t-2) - 1) + b;
		},

		/** 
		@method easeInCubic
		@static
		*/
		easeInCubic: function (x, t, b, c, d) { return c*(t/=d)*t*t + b; },

		/** 
		@method easeOutCubic
		@static
		*/
		easeOutCubic: function (x, t, b, c, d) { return c*((t=t/d-1)*t*t + 1) + b; },

		/** 
		@method easeInOutCubic
		@static
		*/
		easeInOutCubic: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t + b;
			return c/2*((t-=2)*t*t + 2) + b;
		},

		/** 
		@method easeInQuart
		@static
		*/
		easeInQuart: function (x, t, b, c, d) { return c*(t/=d)*t*t*t + b; },

		/** 
		@method easeOutQuart
		@static
		*/
		easeOutQuart: function (x, t, b, c, d) { return -c * ((t=t/d-1)*t*t*t - 1) + b; },

		/** 
		@method easeInOutQuart
		@static
		*/
		easeInOutQuart: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
			return -c/2 * ((t-=2)*t*t*t - 2) + b;
		},

		/** 
		@method easeInQuint
		@static
		*/
		easeInQuint: function (x, t, b, c, d) { return c*(t/=d)*t*t*t*t + b; },

		/** 
		@method easeOutQuint
		@static
		*/
		easeOutQuint: function (x, t, b, c, d) { return c*((t=t/d-1)*t*t*t*t + 1) + b; },

		/** 
		@method easeInOutQuint
		@static
		*/
		easeInOutQuint: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
			return c/2*((t-=2)*t*t*t*t + 2) + b;
		},

		/** 
		@method easeInSine
		@static
		*/
		easeInSine: function (x, t, b, c, d) { return -c * Math.cos(t/d * (Math.PI/2)) + c + b; },

		/** 
		@method easeOutSine
		@static
		*/
		easeOutSine: function (x, t, b, c, d) { return c * Math.sin(t/d * (Math.PI/2)) + b; },

		/** 
		@method easeInOutSine
		@static
		*/
		easeInOutSine: function (x, t, b, c, d) { return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b; },

		/** 
		@method easeInExpo
		@static
		*/
		easeInExpo: function (x, t, b, c, d) { return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b; },

		/** 
		@method easeOutExpo
		@static
		*/
		easeOutExpo: function (x, t, b, c, d) { return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b; },

		/** 
		@method easeInOutExpo
		@static
		*/
		easeInOutExpo: function (x, t, b, c, d) {
			if (t==0) return b;
			if (t==d) return b+c;
			if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
			return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
		},

		/** 
		@method easeInCirc
		@static
		*/
		easeInCirc: function (x, t, b, c, d) { return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b; },

		/** 
		@method easeOutCirc
		@static
		*/
		easeOutCirc: function (x, t, b, c, d) { return c * Math.sqrt(1 - (t=t/d-1)*t) + b; },

		/** 
		@method easeInOutCirc
		@static
		*/
		easeInOutCirc: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
			return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
		},

		/** 
		@method easeInElastic
		@static
		*/
		easeInElastic: function (x, t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		},

		/** 
		@method easeOutElastic
		@static
		*/
		easeOutElastic: function (x, t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
		},

		/** 
		@method easeInOutElastic
		@static
		*/
		easeInOutElastic: function (x, t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
			return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
		},

		/** 
		@method easeInBack
		@static
		*/
		easeInBack: function (x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c*(t/=d)*t*((s+1)*t - s) + b;
		},

		/** 
		@method easeOutBack
		@static
		*/
		easeOutBack: function (x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		},

		/** 
		@method easeInOutBack
		@static
		*/
		easeInOutBack: function (x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158; 
			if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
			return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
		},

		/** 
		@method easeInBounce
		@static
		*/
		easeInBounce: function (x, t, b, c, d) {
			return c - EXEasing.easeOutBounce (x, d-t, 0, c, d) + b;
		},

		/** 
		@method easeOutBounce
		@static
		*/
		easeOutBounce: function (x, t, b, c, d) {
			if ((t/=d) < (1/2.75)) {
				return c*(7.5625*t*t) + b;
			} else if (t < (2/2.75)) {
				return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
			} else if (t < (2.5/2.75)) {
				return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
			} else {
				return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
			}
		},

		/** 
		@method easeInOutBounce
		@static
		*/
		easeInOutBounce: function (x, t, b, c, d) {
			if (t < d/2) return EXEasing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
			return EXEasing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
		}
	};
	return EXEasing;
});