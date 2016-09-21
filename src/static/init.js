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
	// 页面运行开始时间
	STIME : new Date().getTime(),
	//识别节点
	NODE: document.getElementById("ENTRY"),
	// 是否自动加载JS
	AUTO_LOAD_SCRIPTS:function(){return this.NODE !== null ? true : false ;},
	// 提取架构方式
	TYPE : function(){
		var tp = this.NODE.getAttribute("data-type");
		if(tp === 'cmd' || tp === 'CMD') return 'cmd' ;
		else if(tp === 'amd' || tp === 'AMD') return 'amd' ;
	},
	// 系统模块名格式化
	SYSTEMURL: function(){
		var mod = this.NODE.getAttribute("data-module")
		return mod === '' || mod === null ? '' : '/' + mod;
	},
	// web域，自动获取当前域
	SITE_URL:document.location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + "/" ,
	// static资源域，优先获取页面定义的static_url
	SITE_STATIC_URL:function(){return 'undefined' === typeof static_url || '' === static_url ? this.SITE_URL : static_url + "/";} ,
    // 静态资源目录，当SITE_STATIC_URL为web域时使用
    STATIC_FOLDER: function(){return this.SITE_STATIC_URL() === this.SITE_URL ? this.SITE_STATIC_URL() +'static/' : this.SITE_STATIC_URL();} ,
    // 第三方资源目录-CMD封装
    CMD_LIBS_FOLDER: "libs/cmd",
    // 第三方资源目录-AMD封装
    AMD_LIBS_FOLDER: "libs/amd",
    // 第三方资源目录-常规
    NORM_LIBS_FOLDER: "libs/norm",
	// 第三方资源目录细化路径
	LIBSURL : function(){
		if(this.TYPE() === 'cmd') return this.STATIC_FOLDER() + this.CMD_LIBS_FOLDER+'/';
		else if(this.TYPE() === 'amd') return this.STATIC_FOLDER() + this.AMD_LIBS_FOLDER+'/';
	},
    // 自有资产目录
    ASSETSFOLDER: "assets/js",
	// 自有资产目录细化路径
	ASSETSURL : function(){return this.STATIC_FOLDER() + this.ASSETSFOLDER + '/' + this.TYPE() +'/';},
	// 业务脚本目录
    APPFOLDER: "apps/app3", 
  	// 是否合并资源
	COMBO:false
}
var assetsUrl = ENTRY_CONF.ASSETSURL();
var libsUrl = ENTRY_CONF.LIBSURL();
var systemUrl = ENTRY_CONF.SYSTEMURL();

/**
 * @desc 入口程序
 */

var entry = function() {
    if(!ENTRY_CONF.AUTO_LOAD_SCRIPTS()){ //常规模式跳出
    	return false;
    }
    this.stime = ENTRY_CONF.STIME;
    this.webUrl = ENTRY_CONF.SITE_URL;
    this.staticfolder = ENTRY_CONF.STATIC_FOLDER();
    this.CMDFolder = ENTRY_CONF.CMD_LIBS_FOLDER;
    this.AMDFolder = ENTRY_CONF.AMD_LIBS_FOLDER;
    this.NORMFolder = ENTRY_CONF.NORM_LIBS_FOLDER;
    this.assetsFolder = ENTRY_CONF.ASSETSFOLDER;
    this.appFolder = ENTRY_CONF.APPFOLDER;
    this.combo = ENTRY_CONF.COMBO;
    this.node = document.getElementById("ENTRY");
    this.type = this.node.getAttribute("data-type");
    this.module = this.node.getAttribute("data-module");
    this.page = this.node.getAttribute("data-page");
    this.init();
};
// 入口
entry.prototype.init = function() {
    var self = this;
    var scripts = self.getScripts();
    console.log(scripts);
    self.seriesLoadScripts(scripts, function() {
        return self.callback();
    });
};
//获取需要加载的js
entry.prototype.getScripts = function() {
    var self = this,
        mod,
        URI,
        loaderJs,
        comboJs,
        loaderAliasJs,
        loaderConfigJs,
        pageJs;  
    //模块属性
    mod = self.module === '' || self.module === null ? '' : '/' + self.module;
    //加载器脚本 及 合并辅件
    if(self.combo){
	    if(self.type === 'cmd' || self.type === 'CMD'){
			publicUrl = self.staticfolder+"/??",
		    loaderJs = publicUrl + self.CMDFolder + "/seajs/seajs/2.1.1/sea.js";//加载器脚本
		    comboJs = "," + self.CMDFolder + "/seajs/seajs-combo/1.0.1/seajs-combo.js";//加载器脚本
	    	loaderAliasJs = ",alias.js";//总配置脚本
		    loaderConfigJs = "," + self.appFolder + mod + '/js/config.js';//模块配置脚本
		    pageJs = "," + self.appFolder + mod + '/js/' + self.page + '.js';//业务脚本
		    return [loaderJs + comboJs + loaderAliasJs + loaderConfigJs + pageJs];//返回arr
		    //demo->http://localhost:8861/static//??libs/cmd/seajs/seajs/2.1.1/sea.js,alias.js,apps/app2/js/config.js,apps/app2/js/login.js
	    }else{
	    	console.log("requireJs无法自动合并模块路径，请关闭combo或改用cmd模式")
	    	return false;
	    }
    }else{
	    //uri属性
	    URI = {
	    	static : self.staticfolder,
	    	cmd : self.staticfolder + self.CMDFolder,
	    	amd : self.staticfolder + self.AMDFolder,
	    	app : self.staticfolder + self.appFolder + mod
	    };
    	//加载器脚本
	    if(self.type === 'cmd' || self.type === 'CMD') loaderJs = URI.cmd + "/seajs/seajs/2.1.1/sea.js";
	    else if(self.type === 'amd' || self.type === 'AMD') loaderJs = URI.amd + '/require/2.2.0/require.min.js';
    	loaderAliasJs = URI.static + "alias.js";//总配置脚本
	    loaderConfigJs = URI.app + '/js/config.js';//模块配置脚本
	    pageJs = URI.app + '/js/' + self.page + '.js';//业务脚本
	    return [loaderJs, loaderAliasJs, loaderConfigJs, pageJs];//返回arr
    }
};
//串行顺序加载js
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
entry.prototype.callback = function() {
	var self = this;
	console.log('脚本用时：'+(new Date().getTime()-self.stime)+'ms');
};
new entry();

/**
 * @desc console容错
 */
if (!window.console) {
	var names = "log debug info warn error assert dir dirxml group groupEnd time timeEnd count trace profile profileEnd".split(" ");
	window.console = {};
	for (var i = 0; i < names.length; ++i) window.console[names[i]] = function() {}
}