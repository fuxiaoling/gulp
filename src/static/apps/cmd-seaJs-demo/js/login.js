seajs.use(['$','global','Calc'],function($,global,Calc){
    var val = $('input[name="seller_name"]').val();
    $('input[name="seller_name"]').val(val+'--');
    console.log("login.js--->我是入口脚本,成功获取到了本页的标题："+document.title);
    console.log("login.js--->我调用了Calc模块的加方法，2+3="+Calc.add(2,3));
});
