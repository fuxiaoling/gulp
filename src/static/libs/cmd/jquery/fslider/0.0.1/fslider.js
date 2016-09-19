define("jquery/fslider/0.0.1/fslider", ["$"], function(require,exports, module) {
  var jQuery = require("$"); 
/*!
 * jQuery slider v0.0.1
 */
(function($, f) {
	//  如果没有加载Jquery,跳出运行
	if(!$) return f;
	var Fslider = function() {
		//  建立元素
		this.el = f;
		this.items = f;
		//  尺寸
		this.sizes = [];
		this.max = [0,0];
		//  当前元素
		this.current = 0;
		//  开始/停止计时
		this.interval = f;
		//  预定配置
		this.opts = {
			element: f,
			speed: 500,
			delay: 3000,
			complete: f,
			keys: !f,
			dots: f,
			fluid: f
		};
		var _ = this;
		this.init = function(el, opts) {
			this.el = el;
			this.ul = el.children('ul');
			this.max = [el.outerWidth(), el.outerHeight()];			
			this.items = this.ul.children('li').each(this.calculate);
			//  检测预定配置
			this.opts = $.extend(this.opts, opts);
			this.setup();
			return this;
		};
		
		//  获取元素宽高
		this.calculate = function(index) {
			var me = $(this),
				width = me.outerWidth(), height = me.outerHeight();
			_.sizes[index] = [width, height];
			if(width > _.max[0]) _.max[0] = width;
			if(height > _.max[1]) _.max[1] = height;
		};
		this.setup = function() {
			//  设置主元素
			this.el.css({
				overflow: 'hidden',
				width: _.max[0],
				height: this.items.first().outerHeight()
			});
			//  设置相对宽度
			this.ul.css({width: (this.items.length * 100) + '%', position: 'relative'});
			this.items.css('width', (100 / this.items.length) + '%');
			if(this.opts.delay !== f) {
				this.start();
				this.el.hover(this.stop, this.start);
			}
			//  设置键盘键位
			this.opts.keys && $(document).keydown(this.keys);
			this.opts.dots && this.dots();
			
			if(this.opts.fluid) {
				var resize = function() {
					_.el.css('width', Math.min(Math.round((_.el.outerWidth() / _.el.parent().outerWidth()) * 100), 100) + '%');
				};
				resize();
				$(window).resize(resize);
			}
			// 创建左右方向键
			if(this.opts.arrows) {
				this.el.parent().append('<p class="f_arrows"><span class="prev">←</span><span class="next">→</span></p>')
					.find('.arrows span').click(function() {
						$.isFunction(_[this.className]) && _[this.className]();
					});
			};
			if($.event.swipe) {
				this.el.on('swipeleft', _.prev).on('swiperight', _.next);
			}
		};
		//  幻灯效果开始
		this.move = function(index, cb) {
			if(!this.items.eq(index).length) index = 0;
			if(index < 0) index = (this.items.length - 1);
			var target = this.items.eq(index);
			var obj = {height: target.outerHeight()};
			var speed = cb ? 5 : this.opts.speed;
			if(!this.ul.is(':animated')) {			
				// 去除噪点
				_.el.find('.dot:eq(' + index + ')').addClass('active').siblings().removeClass('active');
				this.el.animate(obj, speed) && this.ul.animate($.extend({left: '-' + index + '00%'}, obj), speed, function(data) {
					_.current = index;
					$.isFunction(_.opts.complete) && !cb && _.opts.complete(_.el);
				});
			}
		};
		//  自动播放
		this.start = function() {
			_.interval = setInterval(function() {
				_.move(_.current + 1);
			}, _.opts.delay);
		};
		//  停止自动播放
		this.stop = function() {
			_.interval = clearInterval(_.interval);
			return _;
		};
		//  按键
		this.keys = function(e) {
			var key = e.which;
			var map = {
				37: _.prev,
				39: _.next,
				27: _.stop
			};
			if($.isFunction(map[key])) {
				map[key]();
			}
		};
		this.next = function() { return _.stop().move(_.current + 1) };
		this.prev = function() { return _.stop().move(_.current - 1) };
		this.dots = function() {
			//  创建控制文本
			var html = '<ol class="dots">';
				$.each(this.items, function(index) {
					html += '<li class="dot' + (index < 1 ? ' active' : '') + '">●</li>'; 
				});
				html += '</ol>';
			this.el.addClass('has-dots').append(html).find('.dot').click(function(){
				_.move($(this).index());
			});
		};
	};
	//  创建Jquery插件
	$.fn.fslider = function(o) {
		var len = this.length;
		return this.each(function(index) {
			var me = $(this);
			var instance = (new Fslider).init(me, o);
			me.data('fslider' + (len > 1 ? '-' + (index + 1) : ''), instance);
		});
	};
})(window.jQuery, false);
});