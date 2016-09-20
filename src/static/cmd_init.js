/*

页面页脚写入：<script id="ENTRY" data-type="cmd" data-module="member" data-page="login" src="/static/cmd_init.js"></script>
------------------------------------------------------------------------------------------------------
id：为入口标示，大写不可变
------------------------------------------------------------------------------------------------------
data-type：为框架模式，可选"cmd"或者"amd",不区分大小
------------------------------------------------------------------------------------------------------
data-module：为页面所属模块路径
------------------------------------------------------------------------------------------------------
data-page：为当前页的业务脚本调用地址，不需加".JS"后缀。
------------------------------------------------------------------------------------------------------
*/

/**
 * @desc 站点配置
 */
window.ENTRY_CONF = window.ENTRY_CONF || {
	// 是否自动加载JS
	AUTO_LOAD_SCRIPTS:function(){
		return document.getElementById("ENTRY") !== null ? true : false ;
	},
	// web域，自动获取当前域
	SITE_URL:function(){
		return document.location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + "/" ;
	},
	// static资源域，优先获取页面定义的static_url
	SITE_STATIC_URL:function(){
		return 'undefined' === typeof static_url || '' === static_url ? this.SITE_URL() : static_url + "/" ;
	},
    // 静态资源目录，当SITE_STATIC_URL为web域时使用
    STATIC_FOLDER: "static",
    // 第三方资源目录-CMD封装
    LIBS_FOLDER_CMD: "libs/cmd",
    // 第三方资源目录-AMD封装
    LIBS_FOLDER_AMD: "libs/amd",
    // 第三方资源目录-常规
    LIBS_FOLDER_NORM: "libs/norm",
    // 自有资产目录
    ASSETSFOLDER: "assets/js",
	// 业务脚本目录
    APPFOLDER: "apps/app2", 
	// 是否合并资源
	COMBO:false
}
/**
 * @desc 入口程序
 */
var entry = function() {
    if(!ENTRY_CONF.AUTO_LOAD_SCRIPTS()){ //常规模式跳出
    	return false;
    }
    this.node = document.getElementById("ENTRY");
    this.type = this.node.getAttribute("data-type");
    this.module = this.node.getAttribute("data-module");
    this.page = this.node.getAttribute("data-page");
    this.scriptsArr = [];
    this.init();
};
// 入口
entry.prototype.init = function() {
    var self = this;
    var scripts = self.getScripts();
    console.log(scripts);
    self.seriesLoadScripts(scripts, function() {
        return this.callback;
    });
};
//获取需要加载的js
entry.prototype.getScripts = function() {
    var self = this,
        type = self.type,
        page = self.page,
        combo = self.page,
        siteStaticUrl,
        module,
        URI,
        loaderJs,
        comboJs,
        loaderAliasJs,
        loaderConfigJs,
        pageJs;  
    //获取静态资源头
    siteStaticUrl = ENTRY_CONF.SITE_STATIC_URL() === ENTRY_CONF.SITE_URL() ? ENTRY_CONF.SITE_STATIC_URL() + ENTRY_CONF.STATIC_FOLDER +'/' : ENTRY_CONF.SITE_STATIC_URL() ;
    //模块属性
    module = self.module === '' || self.module === null ? '' : '/' + self.module;
    //uri属性
    URI = {
    	cmd : siteStaticUrl + ENTRY_CONF.LIBS_FOLDER_CMD,
    	amd : siteStaticUrl + ENTRY_CONF.LIBS_FOLDER_AMD,
    	module : siteStaticUrl + ENTRY_CONF.APPFOLDER + module
    };
    //加载器脚本 及 合并辅件
    if(type === 'cmd' || type === 'CMD'){
    	loaderJs = URI.cmd + "/seajs/seajs/2.1.1/sea.js";
    	comboJs = URI.cmd + "/seajs/seajs-combo/1.0.1/seajs-combo.js";
    	loaderAliasJs = siteStaticUrl + "alias.js"
    }else if(type === 'amd' || type === 'AMD'){
    	loaderJs = URI.amd + '/require/2.2.0/require.js';
    	comboJs = '';
    };
    //加载器配置脚本
    loaderConfigJs = URI.module + '/js/config.js';
	//当前页业务脚本
    pageJs = URI.module + '/js/' + page + '.js';

    console.log(page);



    self.scriptsArr = ENTRY_CONF.COMBO ? [loaderJs + ',' + loaderConfigJs + ',' + pageJs] : [loaderJs, loaderConfigJs, pageJs];
    return self.scriptsArr;
};
//串行加载js
entry.prototype.seriesLoadScripts = function(scripts, callback) {
    if (typeof(scripts) != "object") var scripts = [scripts];
    var s = new Array(),
        last = scripts.length - 1,
        recursiveLoad = function(i) {
            s[i] = document.createElement("script");
            s[i].setAttribute("src", scripts[i]);
            s[i].onload = s[i].onreadystatechange = function() {
                if (! /* @cc_on!@ */ 0 || this.readyState == "loaded" || this.readyState == "complete") {
                    this.onload = this.onreadystatechange = null;
                    if (i !== last) recursiveLoad(i + 1);
                    else if (typeof(callback) === "function") callback();
                }
            }
            document.body.appendChild(s[i]);
        };
    recursiveLoad(0);
};
//callbak
entry.prototype.callback = function() {};
//调用
new entry();


/**
 * @desc console容错
 */
if (!window.console) {
	var names = "log debug info warn error assert dir dirxml group groupEnd time timeEnd count trace profile profileEnd".split(" ");
	window.console = {};
	for (var i = 0; i < names.length; ++i) window.console[names[i]] = function() {}
}