window.ENTRY_CONF = window.ENTRY_CONF || {
    // web域，自动获取当前域
    SITE_URL: document.location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + "/",
    // 页面运行开始时间
    STIME: new Date().getTime(),
    //识别节点
    NODE: document.getElementById("ENTRY"),
    // 是否自动加载JS
    AUTO_LOAD_SCRIPTS: function() {
        return this.NODE !== null ? true : false; 
    },
    // 提取架构方式
    TYPE: function() {
        var tp = this.NODE.getAttribute("data-type");
        if (tp === 'cmd' || tp === 'CMD') return 'cmd';
        else if (tp === 'amd' || tp === 'AMD') return 'amd';
    },
    // 当前所属应用标识
    APP: function() {
        var app = this.NODE.getAttribute("data-app")
        return app === '' || app === null ? '' : "apps/" + app + '/';
    },
    // 当前所属应用下的系统模块
    MODULE: function() {
        var mod = this.NODE.getAttribute("data-module")
        return mod === '' || mod === null ? 'js/' : mod + '/js/';
    },
    // 当前所属应用下的系统模块
    PAGE: function() {
        var page = this.NODE.getAttribute("data-page")
        return page === '' || page === null ? '' : '/' + page;
    },
    // static资源域，优先获取页面定义的static_url
    SITE_STATIC_URL: function() {
        return 'undefined' === typeof static_url || '' === static_url ? this.SITE_URL : static_url + "/"; 
    },
    // 静态资源目录，当SITE_STATIC_URL为web域时使用
    STATIC_FOLDER: function() {
        return this.SITE_STATIC_URL() === this.SITE_URL ? this.SITE_STATIC_URL() + 'static/' : this.SITE_STATIC_URL(); 
    },
    // 第三方资源目录细化路径  LIBS_FOLDER
    LIBS_FOLDER: function() {
        if (this.TYPE() === 'cmd') return this.STATIC_FOLDER() + 'libs/';
        else if (this.TYPE() === 'amd') return this.STATIC_FOLDER() + 'libs/';
    },
    // 自有资产目录细化路径
    ASSETS_FOLDER: function() {
        return this.STATIC_FOLDER() + 'assets/js/'; 
    },
    // 是否合并资源
    COMBO: false
};
//资源路径（全局）
var _LIBSURL = ENTRY_CONF.LIBS_FOLDER()+ENTRY_CONF.TYPE()+'/';
var _ASSETSURL = ENTRY_CONF.ASSETS_FOLDER()+ENTRY_CONF.TYPE()+'/';
var _SYSTEMURL = ENTRY_CONF.STATIC_FOLDER() + ENTRY_CONF.APP() + ENTRY_CONF.MODULE();
// 入口
var entry = function() {
    if (!ENTRY_CONF.AUTO_LOAD_SCRIPTS()) { //常规模式跳出
        return false;
    }
    this.stime = ENTRY_CONF.STIME;
    this.staticFolder = ENTRY_CONF.STATIC_FOLDER();
    this.labsFolder = ENTRY_CONF.LIBS_FOLDER();
    this.combo = ENTRY_CONF.COMBO;
    this.type = ENTRY_CONF.TYPE();
    this.app = ENTRY_CONF.APP();
    this.module = ENTRY_CONF.MODULE();
    this.page = ENTRY_CONF.PAGE();
    this.init();
};
entry.prototype.init = function() {
    var self = this;
    var scripts = self.getScripts();
    self.seriesLoadScripts(scripts, function() {
        return self.callback();
    });
};
entry.prototype.getScripts = function() {
    var self = this,
        loaderJs,
        comboJs,
        loaderAliasJs,
        loaderConfigJs,
        pageJs;
    //加载器脚本 及 合并辅件
    if (self.combo) {
        if (self.type === 'cmd' || self.type === 'CMD') {
            publicUrl = self.staticFolder + "/??",
            loaderJs = publicUrl + "libs/cmd/seajs/seajs/2.1.1/sea.js"; //加载器脚本
            comboJs = ",libs/cmd/seajs/seajs-combo/1.0.1/seajs-combo.js"; //加载器脚本
            loaderAliasJs = ",alias.js"; //总配置脚本
            loaderConfigJs = "," + self.app + self.module + 'config.js'; //模块配置脚本
            pageJs = "," + self.app + self.module + self.page + '.js'; //业务脚本
            return [loaderJs + comboJs + loaderAliasJs + loaderConfigJs + pageJs]; //返回arr
            //demo->http://localhost:8861/static//??libs/cmd/seajs/seajs/2.1.1/sea.js,alias.js,apps/app2/js/config.js,apps/app2/js/login.js
        } else {
            console.log("requireJs无法自动合并模块路径，请关闭combo或改用cmd模式")
            return false;
        }
    } else {
        //加载器脚本
        if (self.type === 'cmd' || self.type === 'CMD') loaderJs = self.labsFolder + "cmd/seajs/seajs/2.1.1/sea.js";
        else if (self.type === 'amd' || self.type === 'AMD') loaderJs =  self.labsFolder + "amd/require/2.2.0/require.min.js";
        loaderAliasJs = self.staticFolder + "alias.js"; //总配置脚本
        loaderConfigJs = self.staticFolder + self.app + self.module + 'config.js'; //模块配置脚本
        pageJs = self.staticFolder + self.app + self.module + self.page + '.js'; //业务脚本
        return [loaderJs, loaderAliasJs, loaderConfigJs, pageJs]; //返回arr
    }
};
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
entry.prototype.callback = function() {};
//启用
new entry();
/**
 * @desc console容错
 */
if (!window.console) {
    var names = "log debug info warn error assert dir dirxml group groupEnd time timeEnd count trace profile profileEnd".split(" ");
    window.console = {};
    for (var i = 0; i < names.length; ++i) window.console[names[i]] = function() {}
};
/*
页面页脚写入：<script id="ENTRY" data-type="cmd" data-app="b2bv3.0" data-module="member" data-page="login" src="/static/cmd_init.js"></script>
------------------------------------------------------------------------------------------------------
id：为入口标示，大写不可变
------------------------------------------------------------------------------------------------------
data-type：为框架模式，可选"cmd"或者"amd",不区分大小
------------------------------------------------------------------------------------------------------
data-app：为页面所属系统标识,分别用于"html/b2bv3.0/*.html"下和"static/app-1/*.js"
------------------------------------------------------------------------------------------------------
data-module：为页面所属系统模块路径
------------------------------------------------------------------------------------------------------
data-page：为当前页的业务脚本调用地址，不需加".JS"后缀。
------------------------------------------------------------------------------------------------------
*/
/*
本工具为异步加载所需JS，请使用CSS优化UI，提升页面渲染体验。
 */