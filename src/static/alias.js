//在非自动模式下，根据是否成功启动加载器来判断模式
if(document.getElementById("ENTRY") === null){
	var site_url = document.location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + "/";
	var site_static_url = 'undefined' === typeof static_url || '' === static_url ? site_url : static_url + "/";
	var static_folder = site_static_url === site_url ? site_static_url + 'static/' : site_static_url;
	if(window.seajs){
		var _ASSETSURL = static_folder + 'assets/js/cmd/';
		var _LIBSURL = static_folder + 'libs/cmd/';
	}else if(window.requirejs){
		var _ASSETSURL = static_folder + 'assets/js/amd/';
		var _LIBSURL = static_folder + 'libs/amd/';
	}else{
		console.log('没有引入加载器文件，如：seajs、requirejs');
	}
}
//seaJs、requireJs总配置
var newAlias = {
	    //seaJs模块别名配置
	    seaJsAlias: {
	        "respond": 'gallery/respond/1.4.2/respond', //,用于为 IE6-8 以及其它不支持 CSS3 Media Queries 的浏览器提供媒体查询
	        'es5-safe': 'gallery/es5-safe/0.9.2/es5-safe',
	        'json': 'gallery/json/1.0.3/json', //别名json2,用于json的序列化和反序列化：JSON.stringify(jsonObj);JSON.parse(jsonString);
	        "$": 'jquery/jquery/1.7.2/jquery-CMD', //别名CMD规范的Jquery
	        "jquery": 'jquery/jquery/1.7.2/jquery-CMD', //别名CMD规范的Jquery
	        "util": _ASSETSURL + 'util',
	        "Arr": _ASSETSURL + 'Arr', //数组工具类
	        "Calc": _ASSETSURL + 'Calc', //计算工具类
	        "date": _ASSETSURL + 'date', //日期工具类
	        "Ajax": _ASSETSURL + 'ajax',
	        "alert": _ASSETSURL + 'alert',
	        "slide": _ASSETSURL + 'slide',
	        "getCookiePro": _ASSETSURL + 'getCookiePro',
	        "numberChange": _ASSETSURL + 'numberChange',
	        "sidebar": _ASSETSURL + 'sidebar',
	        "lazyload": _ASSETSURL + 'lazyload',
	        "category": _ASSETSURL + 'category',
	        "validator": _LIBSURL + 'arale/validator/0.9.7/validator',
	        "dialog": _LIBSURL + 'arale/dialog/1.3.0/dialog',
	        "confirmBox": _LIBSURL + 'arale/dialog/1.3.0/confirmbox',
	        "area": _ASSETSURL + 'area',
	        "cookie": _LIBSURL + 'arale/cookie/1.0.2/cookie',
	        "scrollLoading": _ASSETSURL + 'scrollLoading-min',
	        "slides": _ASSETSURL + 'slides',
	        "sideBar": _ASSETSURL + 'sidebar',
	        "sideBarCss": _ASSETSURL + 'sidebar.css',
	        "barConfig": _ASSETSURL + 'bar-config',
	        "floatPanel": _ASSETSURL + 'floatPanel',
	        "DialogManager": _ASSETSURL + 'uDialog',
	        "DC": _ASSETSURL + 'doubleCalender',
	        'areaFn': _ASSETSURL + 'areaFn',
	        'selectFn': _ASSETSURL + 'selectFn',
	        "zoom": _ASSETSURL + 'zoom'
	    },
	    //requireJs模块别名配置
	    requireJsPaths: {
	        '$': _LIBSURL + 'jquery/1.7.2/jquery.min',
	        'jquery': _LIBSURL + 'jquery/1.7.2/jquery.min',
	        'Jquery': _LIBSURL + 'jquery/1.7.2/jquery.min',
	        'cs': _LIBSURL + 'require-cs/0.5.0/cs', //https://github.com/requirejs/require-cs
	        'text': _LIBSURL + 'require-text/2.0.15/text', //http://requirejs.org/docs/api.html#text
	        'domReady': _LIBSURL + 'require-domReady/2.0.1/domReady', //http://requirejs.org/docs/api.html#pageload
	        'underscore': _LIBSURL + 'underscore', //http://www.bootcss.com/p/underscore/#values
	        'backbone': _LIBSURL + 'backbone/1.3.3/backbone', //http://www.css88.com/doc/backbone/
	        'backboneLocalstorage': _LIBSURL + 'backbone/1.3.3/backbone-localstorage', //https://github.com/robmoorman/backbone-localstorage
	        'localforage': _LIBSURL + 'localforage/1.4.2/localforage', //https://github.com/mozilla/localForage https://mozilla.github.io/localForage/
	        'localforageNopromises': _LIBSURL + 'localforage/1.4.2/localforage.nopromises' //nopromises
	    },
	    // requireJs输出常规组件，可以AMD模式调用
	    requireJsShim: {
	        'cs': {
	            exports: 'cs'
	        },
	        'domReady': {
	            exports: 'domReady'
	        },
	        'underscore': {
	            exports: '_'
	        },
	        'backbone': {
	            deps: [
	                'underscore',
	                '$'
	            ],
	            exports: 'backbone'
	        },
	        'backboneLocalstorage': {
	            deps: ['backbone'],
	            exports: 'Store'
	        }
	    },
	    extend: function(des, src, override) {
	        if (src instanceof Array) {
	            for (var i = 0, len = src.length; i < len; i++) this.extend(des, src[i], override);
	        }
	        for (var i in src) {
	            if (override || !(i in des)) des[i] = src[i];
	        }
	        delete des[0];
	        delete des[1];
	        return des;
	    },
	    aliasIntegrate: function(sysAlias, type) {
	        if (type === 'cmd') {
	            return this.extend({}, [this.seaJsAlias, sysAlias]);
	        } else if (type === 'amd') {
	            return this.extend({}, [this.requireJsPaths, sysAlias]);
	        } else {
	            return sysAlias;
	        }
	    },
	    shimIntegrate: function(sysShim, type) { //cmd不使用本方法，直接在alias中设置
	        if (type === 'amd') {
	            return this.extend({}, [this.requireJsShim, sysShim]);
	        } else {
	            return sysShim;
	        }
	    }

	};
