define("infiniteScroll", ["$"], function($) {
    "use strict";
    /**
     * infiniteScroll无限滚动组件-扩展
     * @param  {[type]} options [description]
     * @param  {[type]} options [description]
     * @param  {[type]} options [description]
     * @param  {[type]} options [description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    var infiniteScroll = function(options) {
        var config = {
            scrollWarpper: '.product-list-content', // 无限滚动容器
            listWarpper: '.product-list-content .row', //商品list容器
            itemClass: '.product-item', // 商品节点class
            distance: 100, // 距离底部的这个数值相应
            animationClass: '.infinite-scroll-preloader', // 滚动动画class
            getItems: 30, // 每次ajax获取的条目
            maxItems: 300, //当前页累计可加载的条目
            itemsPerLoad: 10, //每次提取渲染的条目
            error: '暂时无法获取商品数据,请刷新重试', //无法请求时的用语
            nomore: '无法加载更多商品，请搜索您感兴趣的商品', //超出当前页累计可加载的条目时用语
            ajaxUrl: 'static/apps/v1.0/js/goods.json?bust=' +  (new Date()).getTime(), // ajax请求地址
            callback: function() {}
        };
        this.opts = $.extend({}, config, options);
        this.max = this.opts.maxItems * 1 - this.opts.getItems * 1;
        this.dataCache = [];
        this.currentDate = [];
        this.init();
    };
    /* 入口 */
    infiniteScroll.prototype.init = function() {
        var opts = this.opts;
        /*埋点*/
        if (opts.getItems > opts.maxItems) return this.msg();
        $(opts.scrollWarpper).attr('data-distance', opts.distance);
        $(opts.scrollWarpper).addClass('infinite-scroll');
        $(opts.scrollWarpper).append('<div class="infinite-scroll-preloader"><div class="preloader"></div></div>');
        /*页面开启默认添加一次*/
        this.ajaxGetItems();
    };
    /* ajax请求 */
    infiniteScroll.prototype.ajaxGetItems = function() {
        var that = this,
            opts = this.opts,
            lastIndex = $(opts.itemClass).length,
            pageIndex = lastIndex / opts.getItems; //当前商品个数转换成页数
        if (lastIndex >= opts.maxItems) {
            $(opts.animationClass).remove();
            that.msg('nomore');
            return false; //如果现已等于大于当前页累计可加载的条目，则终止本次请求
        } else {
            var getNum = lastIndex > that.max ? opts.maxItems * 1 - lastIndex * 1 : opts.getItems; //计算本次请求可获取条目,进行缓存
            $.getJSON(opts.ajaxUrl, { pageIndex: pageIndex + 1, pageSize: opts.getItems }, function(data) { //携带2个参数，一个是要获取的页数，一个是获取每页个数
                if (data.oK) {
                    that.dataCache = data.data.list;
                    if (opts.maxItems !== data.data.total) opts.maxItems = opts.maxItems > data.data.total ? data.data.total : opts.maxItems;
                    that.renderItems();
                } else {
                    that.msg('error');
                    $(opts.animationClass).remove();
                }
            });
        }
    };

    /* 提取渲染条数 */
    infiniteScroll.prototype.renderItems = function() {
        var that = this,
            opts = this.opts,
            dataLen = that.dataCache.length;
        if (dataLen > 0) { //存在缓存，截取数量
            that.currentDate = that.dataCache.splice(0, opts.itemsPerLoad); //获取要渲染的条目
            that.addItems(that.currentDate);
        } else { //不存在缓存
            that.ajaxGetItems();
        }
    };
    /* 根据提取条数进行渲染 */
    infiniteScroll.prototype.addItems = function() {
        var that = this,
            opts = this.opts,
            data = arguments[0];
        if (typeof opts.callback == "function") {
            opts.callback(data);
        }
        that.currentDate = []; //清空数组
    };
    /*消息UI*/
    infiniteScroll.prototype.msg = function() {
        var info = '',
            attrClass = '',
            that = this,
            opts = this.opts,
            arg = arguments[0];
        switch (arg) {
            case 'error':
                info = opts.error;
                break;
            case 'nomore':
                info = opts.nomore;
                attrClass = 'no-more';
                break;
            default:
                info = '无法响应';
        }
        $(opts.listWarpper).append('<p class="' + attrClass + '" style="padding:.6rem 0; text-align:center;font-size:.6rem;color:#999;">' + info + '</p>');
    };
    return infiniteScroll;
});
