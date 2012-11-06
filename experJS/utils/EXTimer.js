define(function(require , exports){

	/**
	setTimeout 을 보다 쉽게 사용하기 위한 객체입니다.
	@class EXTimer
	@constructor
	@param timeoutNum {number} 타이머가 호출되는 시간(1000 = 1초)
	@param cnt {integer} 타이머가 실행될 총 횟수.
	@example
		<!DOCTYPE html>
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title></title>
		<script type="text/javascript" src="../../../experJS/experJS.js"></script>
		<script type="text/javascript">
			EX.includeBegin("../../../experJS");
			EX.include("utils/EXTimer");
			EX.includeEnd();

			EX.ready(function(){
				var timer = new EXTimer(1000 , 3);
				timer.addListener(EXTimer.EVENT_TIMER , timerEventHandler);
				timer.addListener(EXTimer.EVENT_TIMER_COMPLETE , timerEventCompleteHandler);

				function timerEventHandler(){
					EX.debug("timer :" , timer.count());
				}
				function timerEventCompleteHandler(){
					EX.debug("complete :" , timer.countAll());
					toggleTimer();
				}

				var btn = document.getElementById("btn");
				var isStart = false;
				btn.onclick = toggleTimer;
				function toggleTimer(){
					if(isStart == true){
						EX.debug("timer stop");
						timer.stop();
					}else{
						EX.debug("timer start");
						timer.start();
					}
					isStart = !isStart;
				}
			});
		</script>
		</head>
		<body>
		<button id="btn">start&stop toggle</button>
		</body>
		</html>
	 */
	var EXTimer = function(timeoutNum , cnt){
		var _this = this;
		var _totalCount = (cnt != undefined) ? cnt : 0;
		var _currentCount = 0;
		var _allCount = 0;
		var _timeOut = null;
		var eventsTimer = [];
		var eventsTimerComplete = [];
		var flagStop = true;
		
		/**
		타이머를 시작합니다.
		@method start
		@return {void}
		*/
		this.start = function(){
			if(flagStop == false) return;
			flagStop = false;
			_currentCount = 0;
			setTimer(true);
		};

		/**
		타이머를 중지합니다.
		@method stop
		@return {void}
		*/
		this.stop = function(){
			flagStop = true;
			setTimer(false);
		};
		
		/**
		타이머를 중지합니다.
		@method count
		@return {integer}
		*/
		this.count = function(){
			return _currentCount;
		};
		
		/**
		타이머가 생성된 후에 총 실행된 횟수를 반환합니다. start , stop 의 영향을 받지 않습니다.
		@method countAll
		@return {integer}
		*/
		this.countAll = function(){
			return _allCount;
		};

		/**
		타이머가 사용하는 모든 자원을 해제합니다.
		@method destroy
		@return {void}
		*/
		this.destroy = function(){
			setTimer(false);
			eventsTimer = null;
			eventsTimerComplete = null;
		};

		/**
		타이머 이벤트의 콜백 함수를 등록합니다. 타이머가 dispatch 하는 이벤트는 예제와 Timer 의 property 를 참고하십시오.
		@method addListener
		@param type {String} 이벤트 명. 예제와 Timer 의 property 를 참고하십시오.
		@param func {Function} 이벤트 발생시 dispatch 될 콜백 함수.
		@return {void}
		*/
		this.addListener = function(type , func){
			switch(type){
				case EXTimer.EVENT_TIMER:
					eventsTimer.push(func);
					break;
				case EXTimer.EVENT_TIMER_COMPLETE:
					eventsTimerComplete.push(func);
					break;
			}
		};
		
		/**
		타이머 이벤트의 콜백 함수를 제거 합니다.
		@method removeListener
		@param type {String} 이벤트 명.
		@param func {Function} 이벤트 발생시 dispatch 될 콜백 함수.
		@return {void}
		*/
		this.removeListener = function(type , func){
			switch(type){
				case EXTimer.EVENT_TIMER:
					removeEvent(func , eventsTimer );
					break;
				case EXTimer.EVENT_TIMER_COMPLETE:
					removeEvent(func , eventsTimerComplete );
					break;
			}
		};
		
		function setTimer(bool){
			if(bool == true){
				_timeOut = null;
				_timeOut = setTimeout(excuteTimerFunc , timeoutNum);
			}else{
				if(_timeOut != null) clearTimeout(_timeOut);
				_timeOut = null;
			}
		}
		
		function excuteTimerFunc(){
			if(flagStop == true) return;
			_currentCount++;
			_allCount++;
			if(_totalCount != 0){
				if(_currentCount <= _totalCount){
					dispatchEvent(eventsTimer);
					setTimer(true);
				}
				if(_currentCount == _totalCount){
					dispatchEvent(eventsTimerComplete);
					flagStop = true;
				}
			}else{
				dispatchEvent(eventsTimer);
				setTimer(true);
			}
		}
		
		function dispatchEvent(arr){
			var i = 0;
			var length = 0;
			length = arr.length;
			for( i = 0 ; i < length ; i++){
				arr[i]();
			}
		}
		
		function removeEvent(func , arr){
			var i = 0;
			var length = arr.length;
			var callback = null;
			for( i = 0 ; i < length ; i++){
				if(func == arr[i]){
					arr.splice(i,1);
					break;
				}
			}
		}
	};

	/**
	타이머가 실행될 때마다 dispatch 될 이벤트명
	@property {String} EVENT_TIMER
	@static
	@final
	*/
	EXTimer.EVENT_TIMER = "EVENT_TIMER";

	/**
	타이머의 지정된 limit count 에 도달할때 dispatch 될 이벤트명.
	@property {String} EVENT_TIMER_COMPLETE
	@static
	@final
	*/
	EXTimer.EVENT_TIMER_COMPLETE = "EVENT_TIMER_COMPLETE";
	return EXTimer;
});
