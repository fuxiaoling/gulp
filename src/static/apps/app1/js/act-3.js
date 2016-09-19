require(['$', 'msui', 'infiniteScroll'], function($, Msui, infiniteScroll) {
    "use strict";
    var loading = false;
    /* 因本页为专题活动，建议一次性请求所有商品，然后累计可加载条目设为所有商品的条目*/
    var scroll = new infiniteScroll({
        scrollWarpper:'.act-list-content', // 无限滚动容器
        listWarpper:'.act-list-content .row', //商品list容器
        itemClass:'.brandAct-item', // 商品节点class
        distance:100, // 距离底部的这个数值相应
        animationClass:'.infinite-scroll-preloader', // 滚动动画class
        ajaxUrl:_CONF.sDomain()+'/apps/v1.0/js/act-3.json', // ajax请求地址
        getItems:12, // 每次ajax获取的条目
        maxItems:12, //当前页累计可加载的条目
        itemsPerLoad:6, //每次提取渲染的条目
        error:'暂时无法获取商品数据,请刷新重试', //无法请求时的用语
        nomore:'本专题商品已全部加载完', //超出当前页累计可加载的条目时用语
        callback:function(data){
            var html='';
            for (var i = 0, l = data.length; i < l; i++) {
                var item = data[i];
                html += '<div class="col-100 brandAct-item"><a href="#"><img src="' + item.brandAct_img + '" class="brandAct-img"><div class="brandAct-info"><span class="brandAct-title">' + item.brandAct_id + item.brandAct_title + '</span><span class="brandAct-brief">' + item.brandAct_brief + '</span><span class="brandAct-time">' + item.brandAct_time + '</span></div></a></div>'
            }
            $('.act-list-content .row').append(html); // 添加新条目,节点为listWarpper
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
    $.init();
});
