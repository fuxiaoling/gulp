/**
 * 图片懒加载应用
 */
define('lazyload',function(require,exports,module){
	var Util = require('util');
	var dom = ".img.lazy";
	if(Unit.hasDom(dom)){
		var $ = require('jquery');
		var loadimg = require('jquery/lazyload/jquery.lazyload');
		$(dom).loadimg({
			effect: "fadeIn",
			data_attribute: "src",
			skip_invisible: false,
			threshold : 200
		});
	}
});