require(['jquery','global'], function ($,gloabl) {
    var val = $('input[name="seller_name"]').val();
    $('input[name="seller_name"]').val(val+'--');
    console.log("login.js--->我是入口脚本,成功获取到了本页的标题："+document.title);
});