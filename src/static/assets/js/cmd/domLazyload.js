/**
 * 节点懒加载应用
 */
define(assetsUrl+'m/domLazyload',function(require,exports,module){
	var domLazy = exports;
	var $ = require("$");
	domLazy.Lazy = function(obj,options) {
		var elements=obj?obj:$(".jldLazyLoad");
		$(elements).lazyLoadDiv_cc(options);
	}
	var lazyloadPlugin=function(ele,opt){
		this.elements=ele?ele:$(".jldLazyLoad"),//若没有第一个参数，默认获取class为loading的元素
		this.defaults={
			"beginHeight":400,
			"howToLoad":"fadeIn",
			"loadingBgClass":"jldLazyLoad",//定义未加载前背景图片的类名
			"whenToLoad":"someIn",//默认为div全部在可视窗口内开始加载；其他值：“someIn”
			"callback":""//默认为div全部在可视窗口内开始加载；其他值：“someIn”
		},
		this.options=$.extend({},this.defaults,opt)
	};
	lazyloadPlugin.prototype={
		bindLazy:function(){
			var beginHeight=this.options.beginHeight;
			var elements=this.elements;
			var loadingBgClass=this.options.loadingBgClass;
			var whenToLoad=this.options.whenToLoad;
			var callback=this.options.callback;
			
			/**绑定滚动事件**/	
			$(window).scroll(function(){
				srcTop=$(window).scrollTop();
				if(srcTop>=beginHeight){
					elements.trigger("lazyme",$(window).scrollTop());
				}				
			});
			/**绑定改变浏览器大小事件**/
			$(window).resize(function(){
				srcTop=$(window).scrollTop();
				if(srcTop>=beginHeight){
					elements.trigger("lazyme",$(window).scrollTop());
				}				
			});
			/**绑定页面点击事件**/
			$(window).mouseover(function(){
				srcTop=$(window).scrollTop();
				if(srcTop>=beginHeight){
					elements.trigger("lazyme",$(window).scrollTop());
				}
			});
			elements.bind("lazyme",function(e,scrTop){
				var backfun = $(this).attr("callback");
				var url=$(this).attr("request-url");
				var offset=$(this).offset().top;
				var interval=$(window).height()-$(this).height();//当前页面可视高度-元素高度
				var max=0;
				var min=0;
				if(whenToLoad=="allIn"){
					max=offset;
					min=offset-interval;				
				}else if(whenToLoad=="someIn"){
					max=offset+$(this).height();
					min=offset-$(window).height();
				}
				if(scrTop>=min && scrTop<=max && $(this).hasClass(loadingBgClass)){
					if(url=="dataText"){
						$(this).html($("#"+$(this).attr(url)).val())
						if ($.isFunction(callback)){
							callback($(this));
						}
					}else{
						$(this).load(url,function(responseTxt,statusTxt,xhr){
							if (statusTxt=="success") {
								if ($.isFunction(callback)){
									callback($(this));
								}
							};
						});
					}
					$(this).removeClass(loadingBgClass);
					$(this).attr("style","");
					$(this).attr("request-url","");
					$(this).unbind("lazyme");
				}
			});
			var scrollTop=$(window).scrollTop();
			if(scrollTop>=beginHeight){
				elements.trigger("lazyme",$(window).scrollTop());
			}
		}
	};
	$.fn.lazyLoadDiv_cc=function(options){
		var llp=new lazyloadPlugin(this,options);
		return llp.bindLazy();
	};
});

