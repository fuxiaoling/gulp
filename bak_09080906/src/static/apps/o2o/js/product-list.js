require(['$', 'global', 'msui', 'infiniteScroll'], function($, global, Msui, infiniteScroll) {
    "use strict";
    var loading = false,
	    catId = getQueryString("catId"),
	    firmId = getQueryString("firmId");
    var scroll = new infiniteScroll({
        scrollWarpper:'.product-list-content', // 无限滚动容器
        listWarpper:'.product-list-content .row', //商品list容器
        itemClass:'.product-item', // 商品节点class
        distance:100, // 距离底部的这个数值相应
        animationClass:'.infinite-scroll-preloader', // 滚动动画class
        ajaxUrl:_router.ajaxHeadUrl + '/goods.json?catId='+catId+'&firmId='+firmId, // ajax请求地址
        getItems:30, // 每次ajax获取的条目
        maxItems:60, //当前页累计可加载的条目
        itemsPerLoad:10, //每次提取渲染的条目
        error:'暂时无法获取商品数据,请刷新重试', //无法请求时的用语
        nomore:'无法加载更多商品，请搜索您感兴趣的商品', //超出当前页累计可加载的条目时用语
        callback:function(data,json){
            var html='';
            for (var i = 0, l = data.length; i < l; i++) {
                var item = data[i];
                var stock = item.totalStock === "0" ? "暂无库存" : item.totalStock + "件";
                html += '<div class="col-50 product-item" data-goodsCode="'+item.goodsCode+'">' + 
			                '<div class="skipTarget">'+
	                			'<img src="' + item.goodsImg + '" class="pro-img">' + 
				                '<div class="pro-info">' + 
					                '<span class="pro-name">' + item.goodsName + '</span>' + 
					                '<span class="pro-spec">' + item.packingSpec + '</span>' + 
					                '<span class="pro-price">¥' + item.marketPrice + '</span>' + 
				                '</div>' + 
			                '</div>' + 
			                '<i class="iconfont icon-gouwuche"' +
				                ' data-goodId="' + item.goodsId +
				                '" data-goodCode="' + item.goodsCode + 
				                '" data-goodName="' + item.goodsName + 
				                '" data-goodFirmId="' + firmId + 
				                '" data-goodPackingSpec="' + item.packingSpec + 
				                '" data-goodSellPrice="' + item.sellPrice + 
				                '" data-goodImg="' + item.goodsImg + '">'+
			                '</i>' + 
		                '</div>';
            }
            $('.product-list-content .row').append(html); // 添加新条目,节点为listWarpper
        }
    })

    /* 注册'infinite'事件处理函数 */
    $(document).on('infinite', function() {
        var nomore = $('.no-more').length !== 0;
        if (loading) return false; // 如果正在加载，则退出
        loading = true;
        if(!nomore){
            setTimeout(function() { // 模拟1s的加载过程30
                loading = false;
                scroll.renderItems();
                $.refreshScroller();//容器发生改变,如果是js滚动，需要刷新滚动
            }, 1000);
        }else{
            scroll = null;
            return false;
        }
    });
    $(".skipTarget").live('click',function(){
		var goodsCode = $(this).parent().attr('data-goodsCode');
		console.log(goodsCode);
		adCar.open(goodsCode);
	})
	
	$(".icon-gouwuche").live("click", function(){
		console.log("33");
		var goodId= $(this).attr('data-goodId');
		var goodCode= $(this).attr('data-goodCode');
		var goodName= $(this).attr('data-goodName');
		var goodFirmId= $(this).attr('data-goodFirmId');
		var goodPackingSpec= $(this).attr('data-goodPackingSpec');
		var goodSellPrice= $(this).attr('data-goodSellPrice');
		var goodImg= $(this).attr('data-goodImg');
		adCar.add(goodId, goodCode, goodName, goodFirmId, goodPackingSpec, goodSellPrice, goodImg);
	});
    
    function getQueryString(name) { 
    	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    	var r = window.location.search.substr(1).match(reg); 
    	if (r != null) return unescape(r[2]); return null; 
    }
    $.init();
});
