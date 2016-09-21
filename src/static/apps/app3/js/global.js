define('global',function(require,exports,module){
    var $ = require('jquery');
    var Util = require('util');
    var Select = require('arale/select/0.9.9/select');
    var SelectCss = require('alice/select/1.0.2/select.css');

    //关闭广告
    $('.ad-close').live("click",function(){
        $(this).parents('.ad').eq(0).hide();
    });

    //搜索
    if(Util.hasDom(".select-trigger")){
        var searchSelect = new Select({
            trigger: '.select-trigger',
            triggerTpl: '<a href="javascript:void(0);"><span data-role="trigger-content"></span><i class="iconfont icon-sort-down f20"></i></a>',
            width:60
        }).on('change', function(target) {
            var val = target.attr('data-value');
            $("#search_act").val(val);
        });
        searchSelect.render();
    }

    /**
     * 初始化：搜索关键词UI
     * @return {[type]} [description]
     */
    (function searchEvent(){
        var searchForm = $("#search-form");
        var labelDom = $('label.placeholder');
        var keywordsDom = $("input#keyword");
        var cleanDom = $(".clean-keywords");
        if(keywordsDom.val() === ''){labelDom.show();}
        keywordsDom.focus(function(){labelDom.css({'color':'#bfbfbf'});})
        keywordsDom.on('keyup paste',function(){labelDom.hide();cleanDom.show();})
        keywordsDom.blur(function(){checkKeywords('blur');})
        cleanDom.click(function(){labelDom.hide();keywordsDom.focus().val("");})
        function checkKeywords(action){
            var val = keywordsDom.val();
            if(val === null || val === undefined || val === ''){
                if(action === "blur"){
                    labelDom.css({'color':'#999'}).show();
                }else if(action === "click"){
                    val = labelDom.html();
                    keywordsDom.val(val);
                    labelDom.hide();
                }
            }else{
                keywordsDom.val(Util.trim(val));
            }
        }
        function event(){
            var url = searchForm.attr("action");
                url = '/main/'+$("input#search_act").val()+'.php?keyword='+keywordsDom.val();
            window.location.href=url;
            return false;
        }
        searchForm.find('#button').click(function(e){
            event();
        });
        searchForm.keydown(function(e){
            if(e.keyCode==13){
               event();
            }
        });

    }());

    //左上角分类
    (function showCategory(){
        if($(".category-box").is('.index-current') || $('#ENTRY').data('page') === 'index'){ 
            return false;
        }else{
            $(".category-box").hover(function(){
                $(this).addClass('index-current');
            },function(){
                $(this).removeClass('index-current');
            })  
        }
    }());

    $(".category-box .category-list").find("li").each(function(index) {
        $(this).hover(function() {
            var cat_id = $(this).data("id");
            var menu = $(this).find("div[data-id='" + cat_id + "']");
            menu.show();
            $(this).addClass("current");
            var menu_height = menu.height();
            if (menu_height < 60) menu.height(80);
            menu_height = menu.height();
            var li_top = $(this).position().top;
        },function() {
            $(this).removeClass("current");
            var cat_id = $(this).data("id");
            $(this).find("div[data-id='" + cat_id + "']").hide();
        });
    });
    //价格
    (function changePrice (){
        var goodsPrice = $('.goods-price');
        for(var i=0, l= goodsPrice.length; i<l; i++){
            var self = goodsPrice.eq(i),
                sprice = self.attr('data-price'),
                soriginal = self.attr('data-original'),
                node = self.find('em');
            ook = soriginal !== undefined && soriginal !== '' && soriginal !== null;
            pok = sprice !== undefined && sprice !== '' && sprice !== null;
            if(ook){
                node.html(returnFloat(soriginal));
            }
            if(!ook && pok){
                node.html(returnFloat(sprice));
            }
        }
        function returnFloat(int) {
            var value = Math.round(parseFloat(int) * 100) / 100;
            var xsd = value.toString().split(".");
            if (xsd.length == 1) {
                value = value.toString() + ".00";
                return value;
            }
            if (xsd.length > 1) {
                if (xsd[1].length < 2) {
                    value = value.toString() + "0";
                }
                return value;
            }
        }
    })();

    /**
     * 加入购物车
     */
    //mini购物车
    Util.cartInfo();
    $('a.addCart').live('click',function(){
        var gid = $(this).parents('.goods-item').data('gid'),
            qty = 1;
        Util.addcart(gid,qty);
    });
    






});