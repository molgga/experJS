define(function(require, exports){
	var EXMath = exports;
	/**
	@class EXMath
	@static
	*/
	/**
	지정된 최소, 최대값 사이의 정수 값을 랜덤으로 반환합니다.
	@method getRandomToInt
	@static
	@param min {number} 얻어 낼 랜덤값의 가장 작은 수.
	@param max {number} 얻어 낼 랜덤값의 가장 큰 수.
	@return {integer}
	*/
	EXMath.getRandomToInt = function(min , max){
		if(min > max) return 0;
		return Math.floor(Math.random()*(max-min) + min);
	};

	/**
	지정된 최소, 최대값 사이의 소수 포함 정수 값을 랜덤으로 반환합니다.
	@method getRandomToNumber
	@static
	@param min {number} 얻어 낼 랜덤값의 가장 작은 수.
	@param max {number} 얻어 낼 랜덤값의 가장 큰 수.
	@return {number}
	*/
	EXMath.getRandomToNumber = function(min , max){
		if(min > max) return 0;
		return (Math.random()*(max-min) + min);
	};

	/**
	지정된 arguments 의 평균 값을 반환합니다.
	@method average
	@static
	@param ... {arguments}
	@return {number}
	*/
	EXMath.average = function(){
		var len = arguments.length;
		var stack = 0;
		var elm =  0;
		for(var i = 0 ; i < len ; i++){
			elm = arguments[i];
			if(isNaN(elm)) return;
			stack += elm;
		}
		return stack/len;
	};

	/**
	밑변의 길이와 밑변의 예각을 이용하여, 직각 삼각형의 높이를 반환합니다.
	@method getHeightFromTriangleBaseLineAngle
	@static
	@param baseLineWidth {number} 직각 삼각형의 밑변의 길이
	@param degreeAngle {number} 직각 삼각형의 밑변의 예각 크기
	@return {number}
	*/
	EXMath.getHeightFromTriangleBaseLineAngle = function(baseLineWidth, degreeAngle) {
		var degreeToRadian = degreeAngle * Math.PI / 180;
		return baseLineWidth * Math.tan(degreeToRadian);
	};

	/**
	linePoint_1 과 linePoint_2를 지나는 직선 상의, somePoint가 직교하는 Point Object를 반환합니다.
	@method getCrossPointBetweenTwoPointsLineAndSomePoint
	@static
	@param somePoint {Object} x, y 변수를 지니는 point object
	@param linePoint_1 {Object} x, y 변수를 지니는 point object
	@param linePoint_2 {Object} x, y 변수를 지니는 point object
	@return {Object} x , y
	*/
	EXMath.getCrossPointBetweenTwoPointsLineAndSomePoint = function(somePoint, linePoint_1, linePoint_2) {
		if(linePoint_1.x == linePoint_2.x && linePoint_1.y == linePoint_2.y) return null; //linePoint_1과 linePoint_2의 위치가 같습니다. null을 반환합니다.
		var denominator = linePoint_2.x - linePoint_1.x;
		var numerator = linePoint_2.y - linePoint_1.y;
		if(denominator == 0) return {x:linePoint_1.x, y:somePoint.y};
		if(numerator == 0) return {x:somePoint.x, y:linePoint_1.y};
		
		var twoPointsLineSlope = numerator / denominator;
		var somePointLineSlope = -1/twoPointsLineSlope;
		var returnPoint = {};
		returnPoint.x = (somePointLineSlope*somePoint.x - twoPointsLineSlope*linePoint_1.x + linePoint_1.y - somePoint.y) / (somePointLineSlope - twoPointsLineSlope);
		returnPoint.y = somePointLineSlope * (returnPoint.x - somePoint.x) + somePoint.y;
		return returnPoint;
	};

	/**
	radian value 를 호도각 value로 변환하여 반환합니다.
	@method radianToDegree
	@static
	@param degree {number} radian number
	@return {number}
	*/
	EXMath.radianToDegree = function(radian) {
		return radian * 180 / Math.PI;
	};

	/**
	호도각 value를 radian value로 변환하여 반환합니다.
	@method degreeToRadian
	@static
	@param degree {number} 호도각 number
	@return {number}
	*/
	EXMath.degreeToRadian = function(degree) {
		return degree * Math.PI / 180;
	};

	/**
	두 point 사이의 거리를 반환합니다.
	@method getDistanceBetweenTwoPoints
	@static
	@param point1_x {Object} x, y 변수를 지니는 point object
	@param point1_y {Object} x, y 변수를 지니는 point object
	@param point2_x {Object} x, y 변수를 지니는 point object
	@param point2_y {Object} x, y 변수를 지니는 point object
	@return {number}
	*/
	EXMath.getDistanceBetweenTwoPoints = function(point1_x, point1_y, point2_x, point2_y) {
		var distance = Math.sqrt( Math.pow( point1_x - point2_x, 2 ) + Math.pow( point1_y - point2_y, 2 ) );
		return distance;
	};

	/**
	두 point 사이의 특정 percent의 Point Object를 반환합니다.
	@method getPercentagePointBetweenTwoPoints
	@static
	@param point1_x {number} 첫번째 point의 x 위치 number
	@param point1_y {number} 첫번째 point의 y 위치 number
	@param point2_x {number} 두번째 point의 x 위치 number
	@param point2_y {number} 두번째 point의 y 위치 number
	@param percentage {number} 0 ~ 1 사이의 float number
	@return {Object} x , y
	*/
	EXMath.getPercentagePointBetweenTwoPoints = function(point1_x, point1_y, point2_x, point2_y, percentage) {
		var diffX = point2_x - point1_x;
		var diffY = point2_y - point1_y;
		return {x:diffX * percentage + point1_x, y:diffY *percentage + point1_y};
	};

	/**
	특정 각도를 기본 각도 단위인 -179 ~ 180 으로 변화하여 반환합니다.
	@method getAngleBasedOnSystem
	@static
	@param degree {number} 호도각 number
	@return {number}
	*/
	EXMath.getAngleBasedOnSystem = function(degree) {
		var _degree = degree % 360; 
		if(180 < _degree) return _degree - 360;
		return _degree;
	};

	/**
	standardPoint를 기준점으로, targetPoint를 degree만큼 회전시켰을 때의 point 위치를 반환합니다.
	@method getRotatedPointAroundStandardPoint
	@static
	@param standardPointX {number} 기준점의 x 위치
	@param standardPointY {number} x, y 변수를 지니는 point object
	@param radius {number} 기준점을 중심으로 지니는 원의 반지름
	@return {Object} x , y
	*/
	EXMath.getRotatedPointAroundStandardPoint = function(standardPoint, targetPoint, degree) {
		var tempPosX = targetPoint.x;
		var _x = standardPoint.x + (targetPoint.x - standardPoint.x) * Math.cos(EXMath.degreeToRadian(degree)) - (targetPoint.y - standardPoint.y) * Math.sin(EXMath.degreeToRadian(degree));
		var _y = standardPoint.y + (tempPosX - standardPoint.x) * Math.sin(EXMath.degreeToRadian(degree)) + (targetPoint.y - standardPoint.y) * Math.cos(EXMath.degreeToRadian(degree));
		return {x:_x, y:_y};
	};

	/**
	특정 x,y 위치를 기준점으로 _radius value를 반지름으로 가지는 원 내부의 random한 Point를 반환합니다.
	@method getRandomSurroundPoint
	@static
	@param standardPointX {number} 기준점의 x 위치
	@param standardPointY {number} x, y 변수를 지니는 point object
	@param radius {number} 기준점을 중심으로 지니는 원의 반지름
	@return {Object} x , y
	*/
	EXMath.getRandomSurroundPoint = function(standardPointX, standardPointY, radius) {
		var radian = Math.random() * Math.PI * 2;
		var distance = Math.random() * radius;
		var _x = standardPointX + distance * Math.cos(radian);
		var _y = standardPointY + distance * Math.sin(radian);
		return {x:_x, y:_y};
	};

	/**
	parameter float value의 양수 판별 여부를 반환합니다. (0은 양수로 간주합니다.)
	@method getFlagPositiveNumber
	@static
	@param valueFloat {number} 검사할 number
	@return {integer}
	*/
	EXMath.getFlagPositiveNumber = function(valueFloat) {
		if(valueFloat >= 0) return true;
		return false;
	};

	/**
	1 또는 -1 int value을 random하게 반환합니다.
	@method getRandomPositiveNegative
	@static
	@return {integer}
	*/
	EXMath.getRandomPositiveNegative = function() {
		var distinguishInt = Math.round(Math.random());
		if(distinguishInt > 0) return 1;
		return -1;
	};

	/**
	parameter로 전달되는 모든 값들의 합을 반환합니다.
	@method sum
	@static
	@param {arguments} 합산에 사용도는 number 나열
	@return {number}
	*/
	EXMath.sum = function(valueFloatArgs) {
		var _sum = 0;
		for( var i=0, max=arguments.length; i<max; i++){
			_sum += arguments[i];
		}
		return _sum;
	};

	/**
	float value를  Ceil 연산을 적용, 특정 10 단위 or 특정 소수점 단위로 변환하여 반환합니다.
	@method ceilUnit
	@static
	@param valueFloat {number} 연산을 적용할 number
	@param uintInTheTens {number} 단위 number
	@return {number}
	*/
	EXMath.ceilUnit = function(valueFloat, unitInTheTens) {
		return Math.ceil(valueFloat / unitInTheTens) * unitInTheTens;
	};

	/**
	number value를  round 연산을 적용, 특정 10 단위 or 특정 소수점 단위로 변환하여 반환합니다.
	@method roundUnit
	@static
	@param valueFloat {number} 연산을 적용할 number
	@param uintInTheTens {number} 단위 number
	@return {number}
	*/
	EXMath.roundUnit = function(valueFloat, unitInTheTens) {
		return Math.round(valueFloat / unitInTheTens) * unitInTheTens;
	};

	/**
	number value를  floor 연산을 적용, 특정 10 단위 or 특정 소수점 단위로 변환하여 반환합니다.
	@method floorUnit
	@static
	@param valueFloat {number} 연산을 적용할 number
	@param uintInTheTens {number} 단위 number
	@return {number}
	*/
	EXMath.floorUnit = function(valueFloat, unitInTheTens) {
		return Math.floor(valueFloat / unitInTheTens) * unitInTheTens;
	};

	/**
	지정된 최소 ~ 최대값 사이의 특정 value를, 다른 최소 ~ 최대값 영역 사이의 value로 치환하여 출력합니다.
	@method getRemapValue
	@static
	@param targetValueFloat 최소, 최대값 사이의 특정 number
	@param minValueFloat 최소 범위값
	@param maxValueFloat 최대 범위값
	@param remapMinValueFloat remap 최소 범위값
	@param remapMaxValueFloat remap 최대 범위값
	@return {number}
	*/
	EXMath.getRemapValue = function(targetValueFloat, minValueFloat, maxValueFloat, remapMinValueFloat, remapMaxValueFloat) {
		return (targetValueFloat - minValueFloat) * (remapMaxValueFloat - remapMinValueFloat) / (maxValueFloat - minValueFloat) + remapMinValueFloat;
	};

	/**
	int value를 나눌 수 있는 100 미만의 최소 소수 반환(100 미만의 소수로 나눌 수 없을 경우, -1 반환) 합니다.
	@method getDivisibleMinPrimeNumberUnderOneHundred
	@static
	@param uintValue 0 이상의 number
	@return {number}
	*/
	EXMath.getDivisibleMinPrimeNumberUnderOneHundred = function(uintValue) {
		if(uintValue < 0) return -1;
		var returnValue = -1;
		for(var i=2; i<100; ++i) {
			if(uintValue % i == 0) {
				returnValue = i;
				break;
			}
		}
		return returnValue;
	};

	/**
	int value의 짝수 여부 반환(0은 짝수로 간주) 합니다.
	@method getDivisibleMinPrimeNumberUnderOneHundred
	@static
	@param intValue {integer} int number
	@return {number}
	*/
	EXMath.getFlagEvenInt = function(intValue) {
		if(intValue%2 == 0) return true;
		return false;
	};
});