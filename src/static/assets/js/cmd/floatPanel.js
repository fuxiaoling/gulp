//侧边栏微信，QQ，回到顶部
if (window.frames.length == parent.frames.length) {//判断当前页面是否在iframe里
define('floatPanel',function(require,exports,module){
	var $ = require('jquery');
	var Popup = require('arale/popup/1.1.6/popup');
	//浮动面板
	$("body").append('<div id="floatPanel"><a class="fp_huanxin text-none" href="javascript:openWin(\'\',\'\');" title="在线聊天">在线聊天</a><a class="fp_online text-none" href="javascript:void(0);" title="在线客服">在线客服</a><a class="fp_QCcode text-none" href="javascript:void(0);" title="关注微信">关注微信</a><a class="fp_goTop text-none" href="javascript:void(0);" title="回到顶部">回到顶部</a></div><style>#floatPanel{width:48px;height:210px;position:fixed;right:5px;bottom:50px;overflow:hidden;z-index:10000; _position:absolute; /* for IE6 */_top:expression(documentElement.scrollTop + 200);}#floatPanel a.fp_huanxin,#floatPanel a.fp_online,#floatPanel a.fp_QCcode,#floatPanel a.fp_goTop{display:block;width:48px;height:48px; background:url('+staticRoot+'/system/www/img/floatPanel.gif) no-repeat;}#floatPanel a.fp_huanxin{background-position:0 0px;} #floatPanel a.fp_huanxin:hover{background-position:-48px 0;} #floatPanel a.fp_online{background-position:0 -53px; margin-top:5px;}#floatPanel a.fp_online:hover{background-position:-48px -53px;}#floatPanel a.fp_QCcode{background-position:0 -106px;margin-top:5px;}#floatPanel a.fp_QCcode:hover{background-position:-48px -106px;}#floatPanel a.fp_goTop{background-position:0 -159px; margin-top:5px;}#floatPanel a.fp_goTop:hover{background-position:-48px -159px;}</style>');
	$("body").append('<div id="popPanel"><img src="'+staticRoot+'/system/www/img/qr.png" width="154" height="154"></div><div id="online_box"><span>尊敬的用户，您好！非常感谢您使用金利达药品交易网，如需帮助请点击在线客服为您解答</span><div class="qq_service"></div></div><style>#popPanel{width:154px; height:154px;position:fixed;right:53px;bottom:50px;z-index:10000;overflow:hidden;display:none;_position:absolute; /* for IE6 */_top:expression(documentElement.scrollTop + 200);border:1px solid #ededed;}#online_box{width:305px; height:114px; padding:20px; display:none;border:1px solid #ededed; background-color:#fff;}#online_box .qq_service{margin-top:15px;}#online_box .qq_service a{ display:block; float:left; width:80px; height:22px; line-height:22px; border:1px solid #ededed; border-radius:2px; text-align:center; margin:5px 9px; color:#00a297;}#online_box .qq_service a:hover{border:1px solid #00a297;}</style>');
	//QQ客服
	var qqItem ={
		"注册咨询":"2194428017",
		"加盟咨询":"13376067",
		"采购咨询":"2519476228",
		"销售咨询":"1405533819",
		"企业认证":"3395045366",
		"投诉维权":"1614408759"
	};
	var qqEl = $('#online_box .qq_service'),qqHtml = [];
	if(typeof(qqItem) == "object"){
		$.each(qqItem,function(key,it){
			qqHtml.push('<a href="http://wpa.qq.com/msgrd?v=3&uin='+it+'&site=qq&menu=yes" title="'+key+'" target=_block>'+key+'</a>');
		});
		qqEl.html(qqHtml.join(""));
	}else{
		qqEl.html("暂无QQ客服");
	}
	var categoryAll =  new Popup({
		trigger: '#floatPanel a.fp_online',
		element: '#online_box',
		triggerType: 'hover',//click、focus
		align: {
			baseElement: '#floatPanel',
			baseXY:[-353,0]
		},
		effect: 'fade',
		delay:50
	});
	
	//二维码
	var panel = $("#popPanel");
	$("#floatPanel a.fp_QCcode").hover(function(){
		panel.css("width","0").show();
		panel.animate({"width" : "154px"},300);
	},function(){
		panel.hide();
	});
	//回到顶部
	var backTop = $("#floatPanel a.fp_goTop");
	backTop.hide();
	scrollShow();
	$(window).scroll(function() {
		scrollShow();
	});
	function scrollShow(){
		var onScroll = $(window).scrollTop();
		onScroll < 500 ? backTop.fadeOut() : backTop.fadeIn().css("display","block");
	}
	backTop.click(function(){
		$("html,body").animate({scrollTop :0}, 300);
		return false;
	});
});
}//if