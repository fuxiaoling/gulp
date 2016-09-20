/**
 * slide
 */
define('slide',function(require,exports,module){
	var $ = require('jquery');
	var Slide = require('arale/switchable/1.0.2/slide');
	exports.slide = function(dom,hasTr){
		hasTr = hasTr == "true" || hasTr == null ? true : false;
		return new Slide({
			element: dom,
			hasTriggers: hasTr,
			easing: 'easeOutStrong',
			effect: 'scrollx',//fade
			step: 1,
			circular:true,
			autoplay: true
		}).render();
	}
});