define("global", ["$"], function($) {
    $.config = {
        autoInit: false, //自动初始化页面
        showPageLoadingIndicator: false, //push.js加载页面的时候显示一个加载提示
        router: false, //默认使用router
        swipePanel: "left", //滑动打开侧栏
        swipePanelOnlyClose: true  //只允许滑动关闭，不允许滑动打开侧栏
    };
});
