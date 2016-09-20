define(function(require,exports,module){
//引入相关
var Cookie = require('arale/cookie/1.0.2/cookie');
//清除cookie，测试用
//Cookie.remove('welcome');
var id;
var HTML = "",
	width = "",
	height = "",
	img = "",
	href = "",
	tmpDate = new Date(),
	month = tmpDate.getMonth() + 1;
	year = tmpDate.getFullYear();
if(typeof(barAd) != "undefined"){
	width =  barAd.substring(barAd.indexOf('data-width="')+12, barAd.indexOf('" data-height'));
	height = barAd.substring(barAd.indexOf('data-height="')+13, barAd.indexOf('" data-img='));
	img = barAd.substring(barAd.indexOf('data-img="')+10, barAd.indexOf('" title'));
	href = barAd.substring(barAd.indexOf('href="')+6, barAd.indexOf('" data-width='));
}else{
	width = "800";
	height = "350";
	img = mallWebRoot+"/static/b2c/img/module/www/welcome.png";
	href = mallWebRoot+"/register";
}
if(typeof(barAd) != "undefined"){
	if(typeof(barAdId) != "undefined"){
		id = barAdId;//按广告ID变更
	}else{
		id = year.toString()+month.toString();//按年月
	}
	if(barAd != ""){
		//判断cookie
		if( Cookie.get('welcome') != id){
			//不存在即写入cookie
			Cookie.set('welcome', id, {
				expires: 30
			});
			//弹出层、建议加上后台控制是否显示
			var $ = require('jquery');
			var Position = require('arale/position/1.0.1/position');
			var mask = require('arale/overlay/1.1.4/mask');
			var HTML =[];
			HTML.push('<div id="welcome" class="pr" style="position:fixed; z-index:99999">');
			HTML.push('<a style="display:block; width:100%; height:100%" href="'+href+'">&nbsp;</a>');
			HTML.push('<a class="close pa" href="javascript:void(0);"><i class="iconfont f18">&#xe627;</i></a>');
			HTML.push('</div>');
			//CSS
			HTML.push('<style>');
			HTML.push('#welcome { width:'+width+'px; height:'+height+'px; background:url("'+img+'"); }');
			HTML.push('#welcome a.close { display:block; text-align:center; top:10px; right:110px; width:30px; height:30px; line-height:30px; color:#fff;}');
			HTML.push('#welcome a.close:hover { color:#fff;}');
			HTML.push('</style>');
			$("body").append(HTML.join(""));
			//----------右边工具栏----------
			$(function(){
				var dom = $("#welcome");
				//显示工具栏
				mask.set('backgroundColor', '#000000').set('opacity', '0.3').show();
				Position.center('#welcome');
				dom.show();
				//窗口改变大小时定位
				$(window).resize(function(){
					Position.center('#welcome');
				});
				//自定义按钮关闭
				$('#welcome a.close').click(function() {
					mask.hide();
					dom.hide();
				})
				//ESC键关闭
				$(document).keyup(function(e) {
					if (e.keyCode === 27) {
						mask.hide();
						dom.hide();
					}
				})
			});
		}
	}
}



});