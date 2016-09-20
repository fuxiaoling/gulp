/* 全局变量配置 */
window._CONF = {
    appFolder: "apps", // 业务资源文件夹名
    assetsFolder: "assets", // 自有资产文件夹名
    libsFolder: "libs/amd", // 引入第三方资源文件夹名
    modName: function(){ // 模块名
        var mod = typeof DOMAIN === 'undefined' || DOMAIN === '' ? 'x/main' : DOMAIN;
        var modArr = mod.split('/');
        return modArr[modArr.length-1];
    }, 
    sDomain: function() { // 当在html中没有设定资源域，自动改为当前web域
        var domain = typeof staticDomain === 'undefined' || staticDomain === '' ? document.location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + '/static' : staticDomain;
        return domain;
    }
};
window._URL = {
    // 内部依赖
    baseUrl: _CONF.sDomain() + '/' + _CONF.appFolder + '/' + _CONF.modName() + '/js',
    assetsUrl: _CONF.sDomain() + '/' + _CONF.assetsFolder + '/js',
    libsUrl: _CONF.sDomain() + '/' + _CONF.libsFolder,
    // 外部暴露
    requirejsUrl: _CONF.sDomain() + '/' + _CONF.libsFolder + '/require/2.2.0/require.js',
    configUrl: _CONF.sDomain() + '/amd_config.js',
    combo: false
};

/* 加载JS */
var loadJs = function() {
    this.node = document.getElementById("ENTRY");
    this.scriptsArr = [];
    this.init();
};
loadJs.prototype.init = function() {
    var self = this;
    self.getScripts();
    self.seriesLoadScripts(self.scriptsArr, function() {
        return this.callback;
    });
};
loadJs.prototype.getScripts = function() {
    var self = this,
        node = self.node,
        page = node.getAttribute("data-page");
    page = _CONF.sDomain() + '/' + _CONF.appFolder + '/' + _CONF.modName() + '/js' + '/' + page + '.js';
    self.scriptsArr = _CONF.combo ? [_URL.requirejsUrl + ',' + _URL.configUrl + ',' + page] : [_URL.requirejsUrl, _URL.configUrl, page];
};
loadJs.prototype.seriesLoadScripts = function(scripts, callback) {
    if (typeof(scripts) != "object")
        var scripts = [scripts];
    var s = new Array(),
        last = scripts.length - 1,
        recursiveLoad = function(i) {
            s[i] = document.createElement("script");
            s[i].setAttribute("src", scripts[i]);
            s[i].onload = s[i].onreadystatechange = function() {
                if (! /* @cc_on!@ */ 0 || this.readyState == "loaded" || this.readyState == "complete") {
                    this.onload = this.onreadystatechange = null;
                    if (i !== last)
                        recursiveLoad(i + 1);
                    else if (typeof(callback) === "function")
                        callback();
                }
            }
            document.body.appendChild(s[i]);
        };
    recursiveLoad(0);
};
loadJs.prototype.callback = function() {
    // 加载后需要进行操作；
};
new loadJs();

/* console for IE */
if (!window.console) {
    var names = "log debug info warn error assert dir dirxml group groupEnd time timeEnd count trace profile profileEnd"
        .split(" ");
    window.console = {};
    for (var i = 0; i < names.length; ++i)
        window.console[names[i]] = function() {};
};
