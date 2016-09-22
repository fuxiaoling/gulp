define("global", ["jquery"], function($) {
    $('input[name="seller_name"]').val(new Date().getTime());
    console.log("global.js--->我是requrieJs加载的global模块,成功获取到了入口页的标题："+document.title);
});