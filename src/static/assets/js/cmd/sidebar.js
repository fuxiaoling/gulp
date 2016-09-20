define('sidebar',function(require,exports,module){
	var $ = require('jquery');
	var Position = require('arale/position/1.0.1/position');
	var sideBarCss = require('sideBarCss');
	module.exports = sideBar;
	function sideBar(options){
		var config = {
			show:false,
			ui:{
				id:1,
				view:1060
			},
			icon:{
				u1:'&#xe61a;',
				u2:'&#xe612;',
				cart:'&#xe61b;',
				v1:'&#xe618;',
				v2:'&#xe619;',
				v3:'&#xe61f;',
				v4:'&#xe620;',
				v5:'&#xe621;',
				v6:'&#xe622;',
				v7:'&#xe625;',
				v8:'&#xe623;',
				v9:'&#xe624;',
				sreach:'&#xe61c;',
				record:'&#xe61d;',
				au1:'&#xe615;',
				au2:'&#xe614;'
			},
			ad:{
				show:false,
				html:'<a href="http://www.123ypw.com/register" style="width:100px;height:300px;" title="演示"><img src="'+staticRoot+'/system/www/img/index-ad.png"></a>'
			},
			floor:{
				show:true,
				floorEl:'.floor-title',//楼层节点
				floorTitEl:'span'
			},
			user:{
				show:true,
				session:function(){return true},
				loginUrl:"http://cas.123ypw.com/login?service=http://mall.123ypw.com/cas.action&systemtype=mall",
				ok:{
					pic:"http://localhost:8088/system/www/img/topic.jpg",
					name:"Franks.T.D",
					company:"江西金利达电子商务有限公司",
					storeUrl:"http://franks.123ypw.com",
					memberUrl:"http://www.baidu.com",
					level:2,
					auth:true,
					authUrl:"http://member.123ypw.com/auth.jsp"
				}
			},
			cart:{
				show:true,
				num:99,
				cartUrl:"http://www.123ypw.com/cart",
				data:function(){}
			},
			search:{
				show:true
			},
			myPath:{
				show:true,
				data:function(){}
			}
		},opts = $.extend(true,{},config,options);
		this.opts = opts;
		this.show = opts.show;
		this.ui = opts.ui;
		this.icon = opts.icon;
		this.ad = opts.ad;
		this.user = opts.user;
		this.cart = opts.cart;
		this.floor = opts.floor;
		this.search = opts.search;
		this.myPath = opts.myPath;
		this.nRealx;
		this.init();
	}
	//入口
	sideBar.prototype.init = function(){
		var that = this;
		if(that.show){
			//渲染模板
			that.tpl();
			//显示侧边栏
			that.range(0);
			//调整侧边栏
			$(window).on('resize',function(){
				that.range(1);
			});
			//显示隐藏回到顶部
			$(window).scroll(function() {
				var backTop = $("#sidebar-"+that.ui.id+" a.backTop");
				var onScroll = $(window).scrollTop();
				onScroll >= 600 ? backTop.show() : backTop.hide();
			});
			//回到顶部
			that.gotoTop();
			//侧边栏开关
			$('a.bar-close','#sidebar-'+that.opts.ui.id).bind('click',function(){
				that._switch();
			});
			//ad
			that.ad.show ? that.getAD() : void(0) ;
			//用户
			that.user.show ? that.getUser() : void(0) ;
			//采购单
			that.cart.show ? that.getCart() : void(0) ;
			//楼层
			that.floor.show ? that.getFloor() : void(0) ;
			//搜索
			that.search.show ? that.getSearch() : void(0) ;
			//浏览足迹
			that.myPath.show ? that.getMyPath() : void(0) ;
			//内容开启隐藏
			that.toolHide();
			//开启tips
			that.tips();
			//内容垂直居中
			that.align();
		}else{
			return false;
		}

	}
	//窗体初始宽度
	sideBar.prototype.winWidth =function(){
		return $(window).width();
	}
	//侧边栏显示
	sideBar.prototype.range = function(n){
		var that = this;
		var el = $('#sidebar-'+that.ui.id);
		that.fXc(n);
		var thisPx = n == 1 ? that.nRealx : that.winWidth();
		parseInt(thisPx) >= that.ui.view ? el.show() : el.hide();
	}
	//侧边栏定位
	sideBar.prototype.fXc = function(n){
		var that = this;
		that.nRealx = that.winWidth() - 35;
		var bBoolean = n;
		var eX = bBoolean == 1 ? '0%+'+that.nRealx : '100%-35px';
		Position.pin('#sidebar-'+that.ui.id, {x:eX, y:'0%' });
	}
	//侧边栏开关
	sideBar.prototype._switch = function(){
		var that = this;
		var el = $('#sidebar-'+that.ui.id);
		var height = el.height();
		if(	height < 100){
			that.fXc(1);
			el.find('.pr:first').removeClass('hide').end().css({'height':'100%'});
			el.find('a.bar-close i.sideBarIcon').html('&#xe603;');
		}else{
			el.find('.pr:first').addClass('hide').end().css({'height':'70px'});
			el.find('a.bar-close i.sideBarIcon').html('&#xe608;');
			Position.pin('#sidebar-'+that.ui.id, {x:'0%+'+that.nRealx, y:'100%-70'});
		}
	}
	//侧边栏内容居中
	sideBar.prototype.align = function(){
		var that = this;
		var barEl = $('#sidebar-'+that.ui.id);
		var el = barEl.find('.middle');
		var h = el.height();
		if(that.ad.show){
			var mtop = 0-h/1.4;
		}else{
			var mtop = 0-h/2;
		}
		el.css({"margin-bottom":mtop+"px"});
	}
	/**侧边栏内容处理**************************************************/
	
	//侧边栏Tips
	sideBar.prototype.tips = function(){
		var hoverTimer, outTimer, outTimer2, _that;
		var that = this;
		var el = $('#sidebar-'+that.ui.id);
		el.find('a.pr').hover(function(){
			_that = $(this);
			var visible = _that.find('em').is(':visible');
			if(visible){
				return false;
			}else{
				clearTimeout(hoverTimer);
				outTimer2 = setTimeout(function(){
					el.find('a em').stop(true).fadeOut(200).animate({left:'-120px',opacity: '0'},50);
				}, 50);
				hoverTimer = setTimeout(function(){
					_that.find("em").stop(true).fadeIn(300).animate({left:'-90px',opacity: '1'},300);
				}, 50);
			}
		},function(){
			clearTimeout(hoverTimer);
			outTimer = setTimeout(function(){
				_that.find("em").stop(true).fadeOut(200).animate({left:'-120px',opacity:'0'},50);
			}, 50);
		});
	}

	//关闭其他弹出框
	sideBar.prototype.closeBox = function(){
		$('.hasBox').each(function(index, element) {
            $(this).find('a.pr,.cart-trigger').removeClass('current');
			$(this).find('.bar-clickBox').hide();
        });
	}
	//自身弹出框
	sideBar.prototype.clicka = function(trigger,warpper){
		var that = this;
		warpper.toggle(0,function(){
			var visible = $(this).is(':visible');
			if(visible){
				that.closeBox();
				trigger.addClass('current');
			}else{
				trigger.removeClass("current")
			}
			trigger.find('em').hide();
		});
	}
	
	//内容开启隐藏
	sideBar.prototype.toolHide = function(){
		var that = this;
		var floorEL = $('#bar-floor');
		var userEl = $('#bar-login');
		var cartEl = $('#bar-cart');
		var searchEl = $('#bar-search');
		var myPathEl = $('#bar-myPath');
		if(that.floor.show === false){
			floorEL.next('.bar-line').remove();
			floorEL.next('.bar-line');
		}
		if(that.user.show === false){
			userEl.next('.bar-line').remove();
			userEl.remove();
		}
		if(that.cart.show === false){
			cartEl.next('.bar-line').remove();
			cartEl.remove();
		}
		if(that.search.show === false){
			searchEl.remove();
		}
		if(that.myPath.show === false){
			myPathEl.remove();
		}
	}
	//广告
	sideBar.prototype.getAD = function(){
		var that = this;
		var html = '<div id="bar-ad">'+that.ad.html+'</div>';
		var middle = $('#sidebar-'+that.ui.id).find('.middle');
		middle.before(html);
		$(window).on('resize',function(){
			var res = $('#sidebar-'+that.ui.id).height() < 688;
			if(res){
				$('#bar-ad').hide();
			}else{
				$('#bar-ad').show();
			}
		});
	}
	//用户信息
	sideBar.prototype.getUser = function(){
		var that = this;
		var trigger = $('#bar-login a.pr');
		if(that.user.session()){
			$('#bar-login').find('a.pr>i').removeClass('hide').end().find('a.pr>i.no').addClass('hide').end().find('em.pa').html('你好,'+that.user.ok.name);
		}else{
			$('#bar-login').addClass('beLogin');
		}
		trigger.live('click',function(){
			var _this = $(this);
			var boxEl = _this.next(".bar-clickBox");
			var loginBox = $('#bar-login .side-login-box');
			if(that.user.session()){
				var vicon = eval('that.icon.v' + that.user.ok.level);
				var html = '<div class="user-box">';
					html += '<div class="userPic"><a href="'+that.user.ok.memberUrl+'" target="_block"><img src="'+that.user.ok.pic+'" alt="'+that.user.ok.name+'"></a></div>';
					html += '<div class="userName"><a href="'+that.user.ok.memberUrl+'" target="_block">'+that.user.ok.name+'</a></div>';
					html += '<div class="userCompany"><a href="'+that.user.ok.storeUrl+'" target="_block">'+that.user.ok.company+'</a></div>';
//					html += '<div class="userIcon"><i class="sideBarIcon color-red">'+ vicon +'</i>';
//					if(that.user.ok.auth){
//						html += '<i class="sideBarIcon userAuth">'+ eval("that.icon.au2") +'</i></div>';
//					}else{
//						html += '<a href="'+that.user.ok.authUrl+'" title="立即认证" target="_block"><i class="sideBarIcon userAuth">'+ eval("that.icon.au1") +'</i></a></div>';
//					}
					html += '</div>';
					loginBox.html(html);
			}else{
					loginBox.addClass('login-iframe');
				//以iframe方式加载登录页面
				loginBox.html('<i class="f14 tc mt40" style="display:block; color:#999;">加载中...</i>');
				var iframe = document.createElement("iframe"); 
				iframe.width =  "300";
				iframe.height = "390";
				iframe.setAttribute("allowtransparency","true");
				iframe.setAttribute('frameborder', '0', 0);
				iframe.setAttribute("scrolling","no");
				iframe.setAttribute("border","0");
				iframe.setAttribute("marginwidth","no");
				iframe.setAttribute("marginheight","0");								
				iframe.src = that.user.loginUrl;
				if (iframe.attachEvent){ 
					iframe.attachEvent("onload", function(){ 
						loginBox.html(); 
					}); 
				} else { 
					iframe.onload = function(){ 
						loginBox.html();  
					}; 
				} 
				loginBox.html(iframe);
			}
			that.clicka(trigger,boxEl);
		});
		$("#bar-login a.clickBox-close").live('click',function(){
			var trigger = $(this).parents('.bar-clickBox:eq(0)').prev('a.pr');
			var boxEl = trigger.next();
			that.clicka(trigger,boxEl);
		})
	}

	//购物车
	sideBar.prototype.getCart = function(){
		var that = this;
		$("#bar-cart .cart-trigger").live('click',function(){
			var boxEl = $(this).next(".bar-clickBox");
			var cartBox = $('#bar-cart .cartPro-list');
			var html = that.cart.data;
			cartBox.html(html);
			that.clicka($(this),boxEl);
		})
		$("#bar-cart a.clickBox-close").live('click',function(){
			var trigger = $(this).parents('.bar-clickBox:eq(0)').prev();
			var boxEl = trigger.next();
			that.clicka(trigger,boxEl);
		})
	}
	
	//楼层导航处理
	sideBar.prototype.getFloor = function(){
		var that = this;
 		var arr = [];
		var wrapperEl = $(that.floor.floorEl);
		var sideBarEL = $('#bar-floor');
		var sidebarHtml = "";
		
		//获取楼层信息
		for(var i = 0,l = wrapperEl.length; i < l; i++){
			var j = i+1;
			sidebarHtml += '<a class="pr" href="javascript:;" data-f="'+j+'F">'+j+'F<em class="floorEle pa ele-'+j+'F">'+wrapperEl.eq(i).find(that.floor.floorTitEl).html()+'</em></a>';
		}
		sideBarEL.html(sidebarHtml);
		var thisFloor = sideBarEL.find('a');
		//楼层导航高亮
		window.onscroll = function(){
			wrapperEl.each(function(index){
				var that = $(this);
				if($(document).scrollTop() + $(window).height()/3 > that.offset().top){
					arr.push(index);
				}
			});
			if(arr.length){
				thisFloor.removeClass('onscroll');
				thisFloor.eq(arr[arr.length-1]).addClass('onscroll');
				arr = [];
			}
		}
		//点击楼层导航
		thisFloor.each(function(index){
			$(this).live('click',function(){
				$('html,body').animate({scrollTop: wrapperEl.eq(index).offset().top + 'px'}, 300);
			})
		});
	}
	//搜索
	sideBar.prototype.getSearch = function(){
		$('#bar-search a.pr').live('click',function(){
			$('html,body').animate({scrollTop:$('#logo-search').offset().top}, 300);
		});
	}
	//浏览足迹
	sideBar.prototype.getMyPath = function(){
		var that = this;
		var trigger = $('#bar-myPath a.pr');
		trigger.live('click',function(){
			var boxEl = $(this).next(".bar-clickBox");
			var dataBox = $('#bar-myPath .pathPro-list');
			var html = that.myPath.data;
			dataBox.html(html);
			that.clicka($(this),boxEl);
		})
		$("#bar-myPath a.clickBox-close").live('click',function(){
			var trigger = $(this).parents('.bar-clickBox:eq(0)').prev('a.pr');
			var boxEl = trigger.next();
			that.clicka(trigger,boxEl);
		})
	}
	//回到顶部
	sideBar.prototype.gotoTop = function(){
		var that = this;
		$('a.backTop').live('click',function(){
			that.closeBox();
			$('html,body').animate({scrollTop: '0px'}, 300);
		});
	}
	//侧边栏模板
	sideBar.prototype.tpl = function(){
		var that = this;
		var barHTML = '';
		switch(that.ui.id){ 
			case 1://模板1
				barHTML = ''+
				'<div id="sidebar-1" class="mall-bar" style="position:fixed;">'+
					'<div class="pr" style="height:100%;">'+
						'<div class="middle">'+
							//登录 | 开始
							'<div id="bar-login" class="pr hasBox">'+
								'<a class="pr" href="javascript:void(0);">'+
									'<i class="sideBarIcon f22 no">'+ eval("that.icon.u1") +'</i>'+
									'<i class="sideBarIcon f22 yes hide">'+ eval("that.icon.u2") +'</i>'+
									'<em class="pa no">点击登录</em>'+
								'</a>'+
								//弹出登录节点 | 开始
								'<div class="pa bar-clickBox hide">'+
									'<div class="pr bar-box-container">'+
										'<div class="bar-box-content">'+
											'<a class="pa clickBox-close" href="javascript:void(0);"><i class="sideBarIcon f14">&#xe603;</i></a>'+
											'<div class="side-login-box clearfix"></div>'+
										'</div>'+
										'<i class="pa sideBarIcon bar-arrow f20">&#xe60d;</i>'+
									'</div>'+
								'</div>'+
								//弹出登录节点 | 结束
							'</div>'+
							//登录 | 开始
							
							//分割线 | 开始
							'<div class="bar-line">&nbsp;</div>'+
							//分割线 | 结束
							
							//购物车 | 开始
							'<div id="bar-cart" class="pr hasBox">'+
								'<div class="cart-trigger">'+
									'<span class="cart-icon"><i class="sideBarIcon f20">'+ eval("that.icon.cart") +'</i></span>'+
									'<span class="cart-name">采<br>购<br>单</span>'+
								'</div>'+
								'<div class="pa bar-clickBox hide">'+
									'<div class="pr bar-box-container">'+
										'<div class="bar-box-content">'+
											'<a class="pa clickBox-close" href="javascript:void(0);"><i class="sideBarIcon f14">&#xe603;</i></a>'+
											'<ul class="cartPro-list clearfix"></ul>'+
										'</div>'+
										'<i class="pa sideBarIcon bar-arrow f20">&#xe60d;</i>'+
									'</div>'+
								'</div>'+
								'<div class="cartPro-num"><i class="sideBarIcon">&#xe60c;</i><a class="num" href="'+that.cart.cartUrl+'" title="进入采购单页面">'+that.cart.num+'</a></div>'+
							'</div>'+
							//购物车 | 结束
							
							//分割线 | 开始
							'<div class="bar-line">&nbsp;</div>'+
							//分割线 | 结束 							

							//搜索 | 开始
							'<div id="bar-search">'+
								'<a class="pr" href="javascript:void(0);"><i class="sideBarIcon f24">&#xe605;</i><em class="pa">立即搜索</em></a>'+
							'</div>'+
							//搜索 | 结束
							
							//浏览记录 | 开始
							'<div id="bar-myPath" class="pr hasBox">'+
								'<a class="pr" href="javascript:void(0);"><i class="sideBarIcon f20">&#xe61d;</i><em class="pa">浏览记录</em></a>'+
								'<div class="pa bar-clickBox hide">'+
									'<div class="pr bar-box-container">'+
										'<div class="bar-box-content">'+
											'<a class="pa clickBox-close" href="javascript:void(0);"><i class="sideBarIcon f14">&#xe603;</i></a>'+
											'<ul class="pathPro-list clearfix"></ul>'+
										'</div>'+
										'<i class="pa sideBarIcon bar-arrow f20">&#xe60d;</i>'+
									'</div>'+
								'</div>'+
							'</div>'+
							//浏览记录 | 结束
							
							//分割线 | 开始
							'<div class="bar-line">&nbsp;</div>'+
							//分割线 | 结束 
							
							//楼层 | 开始
							'<div id="bar-floor"></div>'+
							//楼层 | 结束

							
						'</div>'+
					'</div>'+
					'<a class="pa backTop" href="javascript:void(0);"><i class="sideBarIcon f18">&#xe607;</i>TOP</a>'+
					'<a class="pa bar-close" href="javascript:void(0);"><i class="sideBarIcon f22">&#xe603;</i></a>'+
				'</div>'
				break; 
			case 2: 
				console.log("ID为2的模板未找到！"); 
				break; 
			default: 
				console.log("ID为3的模板未找到！"); 
				break; 
		}
		$("body").append(barHTML);
	}

});