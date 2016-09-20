define('barConfig',function(require,exports,module){
	var $ = require('jquery');
	var sideBar = require('sideBar');
	//侧边栏
	var bar = new sideBar({
		//是否开启侧边栏
		show:false,
		//iconfont
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
		//广告
		ad:{
			show:barAD.show,
			html:barAD.html
		},
		//楼层
		floor:{
			show:true,
			floorEl:'.floor-title',//楼层节点，保持class
			floorTitEl:'span'//楼层节点名
		},
		//用户
		user:{
			show:true,
			//判断用户是否登录 布尔型
			session:function(){
				var result = false;
				return result;
			},
			//未登录时调用登录页，以IFrame形式调用
			loginUrl:"http://cas.123ypw.com/login?service=http://mall.123ypw.com/cas.action&systemtype=mall",
			//已登录时,传值请参照上方ad:{}
			ok:{
				pic:"http://localhost:8088/system/www/img/topic.jpg",
				name:"fuxiaoling5289",
				company:"江西金利达电子商务有限公司",
				storeUrl:"http://franks.123ypw.com",
				memberUrl:"http://member.123ypw.com",
				level:3,
				auth:false
			}
		},
		//购物车信息
		cart:{
			show:true,
			num:99,
			cartUrl:"http://www.123ypw.com/cart",
			data:function(){
				//已登录获取购物车和cookie记录，未登录直接获取cookie记录
				var dataArr = [
					{
						"pro_id":"10001",
						"pro_img":"http://localhost:8088/system/www/img/demo.gif",
						"pro_name":"麒麟牌 健脾补血颗粒 3g*12袋",
						"pro_price":"35.000",
						"pro_factory":"重庆迪康长江制药有限公司",
						"pro_url":"#"
					},
					{
						"pro_id":"10002",
						"pro_img":"http://localhost:8088/system/www/img/demo.gif",
						"pro_name":"麒麟牌 健脾补血颗粒 3g*12袋",
						"pro_price":"35.000",
						"pro_factory":"重庆迪康长江制药有限公司",
						"pro_url":"#"
					}
				];
				var html = '';
				if(dataArr.length > 0){
					html += '<div class="bar-pro-list">';
					html += '<div class="list-contont">';
					html += '<div class="tit">最近采购商品：</div>';
					for(var i = 0,l = dataArr.length; i < l; i++ ){
						var item = dataArr[i];
						html += '<div class="item">';
						   html += '<a class="pro-img" href="'+item.pro_url+'"><img src="'+item.pro_img+'" width="34" height="34"></a>';
						   html += '<dl>';
								html += '<dd><a class="pro-name" href="'+item.pro_url+'">'+item.pro_name+'</a><em><i class="rmb">¥</i>'+item.pro_price+'</em></dd>';
								html += '<dd class="factory">'+item.pro_factory+'<a class="del" data-id="'+item.pro_id+'" href="javascript:void(0);">删除</a></dd>';
						   html += '</dl>';
						html += '</div>';
					}
					html += '</div>';
					html += '<div class="bottom"><a href="#">查看采购单</a></div>';
					html += '</div>';
					html += '<style>';
					html += '.bar-pro-list{wdith:100%; height:auto;}.bar-pro-list .list-contont{padding:20px;}.bar-pro-list .tit{color:#999;}.bar-pro-list .item{ height:36px; padding:5px 0 5px 0; border-top:1px solid #f0f0f0;}.bar-pro-list .item a.pro-img{ float:left; display:block; margin-right:10px; width:36px; height:36px;}.bar-pro-list .item a.pro-img img{width:34px; height:34px; border:1px solid #e8e8e8;}.bar-pro-list .item dd{ padding-left:10px; height:18px; line-height:18px;}.bar-pro-list .item dd a.pro-name{color:#00a297;}.bar-pro-list .item dd a.pro-name:hover{ text-decoration:underline;}.bar-pro-list .item dd.factory{ color:#999;}.bar-pro-list .item dd em,.bar-pro-list .item dd a.del{ float:right; color:#e60000}.bar-pro-list .item dd.factory a.del{color:#999;}.bar-pro-list .item dd.factory a.del:hover{ color:#e60000;}.bar-pro-list .bottom{ display:block; width:100%; height:40px; line-height:40px; background-color:#f5f5f5;}.bar-pro-list .bottom a{ float:right; margin-right:10px; display:block; width:80px; height:24px; line-height:24px; text-align:center; background-color:#00b7ab; border-radius:3px; color:#fff; margin-top:8px;}.bar-pro-list .bottom a.more{ background-color:transparent; font-family: -webkit-body; color:#666;}';
					html += '</style>';
				}else{

					html = '<div style="text-align:center; padding:20px;color:#999;">暂无采购单记录</div>'
				}
				return html;
			}
		},
		search:{
			show:true
		},
		myPath:{
			show:true,
			data:function(){
				//已登录获取购物车和cookie记录，未登录直接获取cookie记录
				var dataArr = [
					{
						"pro_img":"http://localhost:8088/system/www/img/demo.gif",
						"pro_name":"麒麟牌 健脾补血颗粒 3g*12袋",
						"pro_price":"35.000",
						"pro_url":"#"
					},
					{
						"pro_img":"http://localhost:8088/system/www/img/demo.gif",
						"pro_name":"麒麟牌 健脾补血颗粒 3g*12袋",
						"pro_price":"35.000",
						"pro_url":"#"
					}
				];
				var html = '';
				if(dataArr.length > 0){
					html += '<div class="myPath-pro-list">';
					html += '<div class="tit">最近浏览商品：</div>';
					for(var i = 0,l = dataArr.length; i < l; i++ ){
						var item = dataArr[i];
						html += '<div class="item">';
						   html += '<a class="pro-img" href="'+item.pro_url+'"><img src="'+item.pro_img+'" width="34" height="34"></a>';
						   html += '<dl>';
								html += '<dd><a class="pro-name" href="'+item.pro_url+'">'+item.pro_name+'</a></dd>';
								html += '<dd class="pro-price"><em><i class="rmb">¥</i>'+item.pro_price+'</em>></dd>';
						   html += '</dl>';
						html += '</div>';
					}
					html += '</div>';
					html += '<style>';
					html += '.myPath-pro-list{padding:20px;}.myPath-pro-list .tit{color:#999;}.myPath-pro-list .item{ height:36px; padding:5px 0 5px 0; border-top:1px solid #f0f0f0;}.myPath-pro-list .item a.pro-img{ float:left; display:block; margin-right:10px; width:36px; height:36px;}.myPath-pro-list .item a.pro-img img{width:34px; height:34px; border:1px solid #e8e8e8;}.myPath-pro-list .item dd{ padding-left:10px; height:18px; line-height:18px;}.myPath-pro-list .item dd a.pro-name{color:#00a297;}.myPath-pro-list .item dd a.pro-name:hover{ text-decoration:underline;}.myPath-pro-list .item dd.pro-price{ color:#f00;}';
					html += '</style>';
				}else{
					html = '<div style="text-align:center; padding:20px;color:#999;">暂无浏览记录</div>'
				}
				return html;
			}
		}
	});
	//侧边栏删除采购单中商品
	$('.bar-pro-list a.del').live('click',function(){
		var data = $(this).data();
		//AJAX删除data.id(商品ID)的商品记录
		
		
		
		
		
	})
});