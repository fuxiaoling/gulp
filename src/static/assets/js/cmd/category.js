/**
 * 分类效果
 */
define('category',function(require,exports,module){
	var $ = require('jquery');
	var Util = require('util');
	var Popup = require('arale/popup/1.1.6/popup');
	var Widget = require('arale/widget/1.1.1/widget');
	var Templatable = require('arale/templatable/0.9.2/templatable');
	var Handlebars = require('gallery/handlebars/1.0.2/handlebars');
	var dom = "#category";
	//全部分类:非首页弹出效果
	if(Util.hasDom(dom)){
		if($(dom).hasClass('hide')){
			var categoryAll =  new Popup({
				trigger: '.all-class',
				element: '#category.hide',
				triggerType: 'hover',//click、focus
				align: {
					baseElement: '.index-class',
					baseXY:[-12,40]
				},
				effect: 'fade',
				delay:50
			});
		}
		//全部分类:子分类弹出界面弹出
		var categoryPopup =  new Popup({
			trigger: '.category-box dd',
			element: '#category-sub',
			triggerType: 'hover',//click、focus
			align: {
					baseElement: '.index-class',
					baseXY:[228,40]
			},
			effect: 'fade',
			delay:50
		});
		//全部分类:界面弹出前请求数据，请求后显示
		var categoryID,categoryName;
		categoryPopup.before('show', function() {
			var that = this.activeTrigger;
			categoryID = that.attr("data-categoryID");
			categoryName = that.find('a.parent').html();
			var hotCategory = that.find(".hot-category");
			var iconfont = that.find("i.iconfont");
			var iconfontCurrent = '<i class="iconfont f12">&#xe61f;</i>';
			var iconfont = "<i class=\"pa iconfont f14\">&#xe61e;</i>";
			//中断弹出层，开始处理UI
			this.element.hide();		
			that.siblings().find("i.iconfont").remove();
			that.siblings().append(iconfont);
			that.find("i.iconfont").remove();
			that.append(iconfontCurrent);
			
			$("#category-sub .remove").remove();
			
			$.ajax({
				type: "get",
				dataType : 'jsonp',  
		        jsonp:"jsoncallback",
				url: categoryUrl,
				jsonpCallback:"callback",
				success: function(data){
					var jsonarr = jQuery.parseJSON(data);
					var categoryRender = new Widget({
						className: 'remove',
						model: jsonarr,
						template: $('#category-sub-template').html(),
						parentNode: '#category-sub'
					}).render();
				}
			});
			//----------------程序员同志：请把上面"$.getJSON(...的注释符去掉，然后注释掉下面的"var categoryRender = ...",另~"category.json"的数据格式请参考下面的~~---------------//
			/*var categoryRender = new Widget({
				className: 'remove',
				model: {
					items: [
					
					
					
						{ "id": "00001", "name":"OTC", "url": "#", "sons": [
							{"id": "100010006", "name": "男科用药", "url": "#", "sons": [
								{"id": "1000100050001", "name": "前列腺用药", "url": "#"},
								{"id": "1000100050002", "name": "阳痿早泄", "url": "#"},
								{"id": "1000100050003", "name": "滑精遗精", "url": "#"},
								{"id": "1000100050003", "name": "少精无精", "url": "#"},
								{"id": "1000100050003", "name": "射精无力", "url": "#"},
								{"id": "1000100050003", "name": "男性不育", "url": "#"},
								{"id": "1000100050003", "name": "肾气虚弱", "url": "#"},
								{"id": "1000100050003", "name": "脱发斑秃", "url": "#"}
							]},
							{"id": "100010007", "name": "妇科用药", "url": "#", "sons": [
								{"id": "1000100050001", "name": "阴道炎", "url": "#"},
								{"id": "1000100050002", "name": "月经不调", "url": "#"},
								{"id": "1000100050003", "name": "痛经", "url": "#"},
								{"id": "1000100050003", "name": "贫血", "url": "#"},
								{"id": "1000100050003", "name": "白带异常", "url": "#"},
								{"id": "1000100050003", "name": "产后疾病", "url": "#"},
								{"id": "1000100050003", "name": "避孕药", "url": "#"},
								{"id": "1000100050003", "name": "女性不孕", "url": "#"},
								{"id": "1000100050003", "name": "内分泌失调", "url": "#"},
								{"id": "1000100050003", "name": "乳腺增生", "url": "#"},
								{"id": "1000100050003", "name": "子宫肌瘤", "url": "#"},
								{"id": "1000100050003", "name": "子宫内膜异位", "url": "#"}
							]},
						]}
						
						
						
						
					]
				},
				template: $('#category-sub-template').html(),
				parentNode: '#category-sub'
			}).render();*/
			this.element.fadeIn();//基础弹出层动作
		});
		//全部分类:离开后效果
		$('.category-box').mouseleave(function(){
			var iconfont = "<i class=\"pa iconfont f14\">&#xe61e;</i>";
			var that = $(this);
			that.find("i.iconfont").remove();
			that.find(".hot-category").after(iconfont);
		});
		//模板渲染
		var Widget = Widget.extend({
			Implements: Templatable,
			templateHelpers: {
				//分类数据模板渲染
				'categoryHtml': function(items) {
					var categoryHtml = '';
//					var searchUrl = 'http://www.123ypw.com/product_list.html?categoryID=';
//					categoryHtml ='<div class=\"noData\">暂无子类...，请点击<a href=\"'+ searchUrl + categoryID +'\" target=\"_blank\">'+ categoryName +'</a>直接搜索相关商品</div>';
					categoryHtml ='<div class=\"noData\">暂无子类</div>';
					$.each(items,function(key,it){
						if(it.id == categoryID&&it.sons.length>0){
							categoryHtml = "";
							for (var i = 0, len = it.sons.length; i < len; i++) {
								var item = it.sons[i];
								var itemHtml = '';
								for (var k = 0, subLen = item.sons.length; k < subLen; k++){
									var subItem = item.sons[k];
									itemHtml += '<dd><a href="'+ subItem.url+'">'+ subItem.name +'</a></dd>';
								}
								categoryHtml +='<div class="item-list"><dl>';
								categoryHtml +='<dt><a href="'+ item.url+'">'+ item.name+'</a></dt>';
								categoryHtml +=itemHtml;
								categoryHtml +='</dl></div>';
							}
							it.sons.length > 7 ? categoryHtml = '<div class="item-box">'+categoryHtml+'</div>' :  categoryHtml = '<div class="item-box line">'+categoryHtml+'</div>';
						}
					});
					//console.log(bigID+';'+categoryID+';'+j);
					return new Handlebars.SafeString(categoryHtml);
				}
			},
			setup: function() {
				this.element.addClass(this.get('className'));
			}
		});
		
	}
});