/* 全局变量配置 */
window._router = {
    staticDomain: "http://192.168.200.36:6600/static",
    ajaxHeadUrl: "http://192.168.200.36:6600/static/apps/v1.0/js"
};
window._CONF = {
    appFolder: "apps", // 业务资源文件夹名
    assetsFolder: "assets", // 自有资产文件夹名
    libsFolder: "libs", // 引入第三方资源文件夹名
    appVer: "v1.0", // app资源文件夹名
    sDomain: function() { // 当在html中没有设定资源域，自动改为当前web域
        var domain = typeof _router.staticDomain === 'undefined' || _router.staticDomain === '' ? document.location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + '/static' : _router.staticDomain;
        return domain;
    }
};
window._URL = {
    // 内部依赖
    baseUrl: _CONF.sDomain() + '/' + _CONF.appFolder + '/' + _CONF.appVer + '/js',
    assetsUrl: _CONF.sDomain() + '/' + _CONF.assetsFolder + '/js',
    libsUrl: _CONF.sDomain() + '/' + _CONF.libsFolder + '/js',
    // 外部暴露
    requirejsUrl: _CONF.sDomain() + '/' + _CONF.libsFolder + '/js/require/2.2.0/require.js',
    configUrl: _CONF.sDomain() + '/config.js',
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
    page = _CONF.sDomain() + '/' + _CONF.appFolder + '/' + _CONF.appVer + '/js' + '/' + page + '.js';
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
