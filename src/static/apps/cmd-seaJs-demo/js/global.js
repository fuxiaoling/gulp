define('global',function(require,exports,module){
    var $ = require('jquery');
    $('input[name="seller_name"]').val(new Date().getTime());
    console.log("global.js--->我是seajs加载的global模块,成功获取到了入口页的标题："+document.title);
});