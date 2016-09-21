/* 系统模块配置 */
require.config({
    // 基础路径
    baseUrl: libsUrl,
    //requireJs模块别名配置
    paths: {
        'global': systemUrl +'global'
    },
    // requireJs输出常规组件，可以AMD模式调用
    shim: {
    },
    // requeirJs映射配置
    map: {
    },
    urlArgs: "bust=" +  (new Date()).getTime()
});
/* 完整化paths与shim */
(function(){
    var sysAlias = requirejs.s.contexts._.config.paths;
    var sysShim = requirejs.s.contexts._.config.shim;
    requirejs.s.contexts._.config.paths = newAlias.aliasIntegrate(sysAlias,'amd');
    requirejs.s.contexts._.config.shim = newAlias.shimIntegrate(sysShim,'amd');
    console.log(requirejs.s.contexts._.config.paths);
    console.log(requirejs.s.contexts._.config.shim);
})();

