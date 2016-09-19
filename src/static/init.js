/**
 * 配置
 */
window.SITE_CONF = window.SITE_CONF || {
	site_cname:'demo',
	site_cname:'项目名',
	site_url:'http://localhost:8088',
	site_static_url:'http://localhost:8099',
	

}
/**
 * _CONF 基本配置
 */
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
/**
 * _URL 路由配置
 */
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







var init = document.getElementById("ENTRY"),
	domain = "undefined" == typeof staticDomain ? document.location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + "/" : staticDomain + "/",
	DE = true,
	combo = false,
	jsMini = "undefined" == typeof jsMini ? !1 : jsMini,
	scriptsArr = [],
	systemFolder = jsMini ? "apps-mini" : "apps",
	system = function(){ 
        var mod = typeof DOMAIN === 'undefined' || DOMAIN === '' ? 'x/main' : DOMAIN;
        var modArr = mod.split('/');
        return modArr[modArr.length-1];
    }
	page = init.getAttribute("data-page"),
	assetsUrl = domain+"assets/js/",
	aliasUrl = domain + "cmd_config.js",
	libsUrl = domain + "libs/cmd/",
	systemUrl = domain + systemFolder + "/" + system() + "/js/";
	publicUrl = "",
	jsHeader = "";
if(DE){
	publicUrl = jsHeader = domain;
}else if(combo){
	if(combo){
		publicUrl = domain+"/??",
		jsHeader = ","
		aliasUrl=",libs/cmd_config.js"
	}else{
		publicUrl = jsHeader = domain;
	}
}
var seaUrl = publicUrl + "libs/cmd/seajs/seajs/2.1.1/sea.js",
	comboUrl = jsHeader + "libs/cmd/seajs/seajs-combo/1.0.1/seajs-combo.js",
	confUrl = jsHeader + systemFolder + "/" + system() + "/js/config.js",
	pageUrl = jsHeader + systemFolder + "/" + system() + "/js/" + page + ".js";
combo ? DE ? scriptsArr = [seaUrl, comboUrl, aliasUrl, confUrl, pageUrl] : scriptsArr = [seaUrl + comboUrl + aliasUrl + confUrl + pageUrl] : scriptsArr = [seaUrl, aliasUrl, confUrl, pageUrl];
function seriesLoadScripts(scripts,seaUrl,callback) {
	if(typeof(scripts) != "object") var scripts = [scripts];
	var s = new Array(), last = scripts.length - 1, recursiveLoad = function(i) {
		s[i] = document.createElement("script");
		scripts[i] == seaUrl ? s[i].setAttribute("id","seajsnode"):"";
		s[i].setAttribute("src",scripts[i]);
		s[i].onload = s[i].onreadystatechange = function() {
			if(!/*@cc_on!@*/0 || this.readyState == "loaded" || this.readyState == "complete") {
				this.onload = this.onreadystatechange = null; 
				if(i != last) recursiveLoad(i + 1); else if(typeof(callback) == "function") callback();
			}
		}
		document.body.appendChild(s[i]);
	};
	recursiveLoad(0);
}
seriesLoadScripts(scriptsArr, seaUrl, function() {});


/**
 * console
 */
if (!window.console) {
	var names = "log debug info warn error assert dir dirxml group groupEnd time timeEnd count trace profile profileEnd".split(" ");
	window.console = {};
	for (var i = 0; i < names.length; ++i) window.console[names[i]] = function() {}
}
var IE = (document.all && window.ActiveXObject && !window.opera) ? true : false;
if(IE) try {document.execCommand("BackgroundImageCache", false, true);} catch(e) {}