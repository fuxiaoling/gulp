/**
 * dialog倒计时 time=0不做自动关闭 time >= 1自动倒计时关闭
 */
define('alert',function(require,exports,module){
	var $ = require('jquery');
	var Confirmbox = require('arale/dialog/1.3.0/confirmbox');
	var css=[];//样式重写
		css.push('<style>');
		css.push('a.dialog-button-orange{border: 1px solid #b21018;background-color: #c41921;color:#fff;}');
		css.push('a.dialog-button-orange:hover{border: 1px solid #c41921;background-color: #b21018;}');
		css.push('.dialog-operation .dialog-confirm i.second{ display:inline-block; *display:block; *zoom:1; padding-left:5px; color:#999}');
		css.push('.dialog-operation .dialog-confirm i.second em{ color:#c41921; margin-right:3px;}');
		css.push('</style>');
		$("body").append(css.join(""));
	exports.alert = function(msg,time){
		Confirmbox.alert(msg);	
		if(time >= 1){
			var confirmEl = $('.dialog [data-role="confirm"]');
			var second
			setTimeout(function(){
				 confirmEl.trigger('click');
			}, time*1000);
			var interval =  window.setInterval(Countdown, 1000);
			function Countdown(){
				var nowTime = confirmEl.find('em').html();
				second = nowTime == null ? time : second;
				if (second > 0) {
					second = second - 1;
					confirmEl.find('i.second').remove();
					confirmEl.find('a').after('<i class="second"><em>'+second+'</em>秒后自动关闭...</i>');
				}else{
					window.clearInterval(interval);
				}
			}
		}
	}
});