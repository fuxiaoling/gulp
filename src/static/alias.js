/*
	seaJs、requireJs总配置
 */
var newAlias = {
    //seaJs模块别名配置
    seaJsAlias: {
        "respond": 'gallery/respond/1.4.2/respond', //,用于为 IE6-8 以及其它不支持 CSS3 Media Queries 的浏览器提供媒体查询
        'es5-safe': 'gallery/es5-safe/0.9.2/es5-safe',
        'json': 'gallery/json/1.0.3/json', //别名json2,用于json的序列化和反序列化：JSON.stringify(jsonObj);JSON.parse(jsonString);
        "$": 'jquery/jquery/1.7.2/jquery-CMD', //别名CMD规范的Jquery
        "jquery": 'jquery/jquery/1.7.2/jquery-CMD', //别名CMD规范的Jquery
        "util": assetsUrl + 'm/util',
        "Arr": assetsUrl + 'm/Arr', //数组工具类
        "Calc": assetsUrl + 'm/Calc', //计算工具类
        "date": assetsUrl + 'm/date', //日期工具类
        "Ajax": assetsUrl + 'm/ajax',
        "alert": assetsUrl + 'm/alert',
        "slide": assetsUrl + 'm/slide',
        "getCookiePro": assetsUrl + 'm/getCookiePro',
        "numberChange": assetsUrl + 'm/numberChange',
        "sidebar": assetsUrl + 'm/sidebar',
        "lazyload": assetsUrl + 'm/lazyload',
        "category": assetsUrl + 'm/category',
        "validator": libsUrl + 'arale/validator/0.9.7/validator',
        "dialog": libsUrl + 'arale/dialog/1.3.0/dialog',
        "confirmBox": libsUrl + 'arale/dialog/1.3.0/confirmbox',
        "area": assetsUrl + 'm/area',
        "cookie": libsUrl + 'arale/cookie/1.0.2/cookie',
        "scrollLoading": assetsUrl + 'm/scrollLoading-min',
        "slides": assetsUrl + 'm/slides',
        "sideBar": assetsUrl + 'm/sidebar',
        "sideBarCss": assetsUrl + 'm/sidebar.css',
        "barConfig": assetsUrl + 'm/bar-config',
        "floatPanel": assetsUrl + 'm/floatPanel',
        "DialogManager": assetsUrl + 'm/uDialog',
        "DC": assetsUrl + 'm/doubleCalender',
        'areaFn': assetsUrl + 'm/areaFn',
        'selectFn': assetsUrl + 'm/selectFn',
        "zoom": assetsUrl + 'm/zoom'
    },
    //requireJs模块别名配置
    requireJsPaths: {
        '$': libsUrl + '/jquery/1.7.2/jquery.min',
        'jquery': libsUrl + '/jquery/1.7.2/jquery.min',
        'Jquery': libsUrl + '/jquery/1.7.2/jquery.min',
        'cs': libsUrl + '/require-cs/0.5.0/cs', //https://github.com/requirejs/require-cs
        'text': libsUrl + '/require-text/2.0.15/text', //http://requirejs.org/docs/api.html#text
        'domReady': libsUrl + '/require-domReady/2.0.1/domReady', //http://requirejs.org/docs/api.html#pageload
        'underscore': libsUrl + '/underscore', //http://www.bootcss.com/p/underscore/#values
        'backbone': libsUrl + '/backbone/1.3.3/backbone', //http://www.css88.com/doc/backbone/
        'backboneLocalstorage': libsUrl + '/backbone/1.3.3/backbone-localstorage', //https://github.com/robmoorman/backbone-localstorage
        'localforage': libsUrl + '/localforage/1.4.2/localforage', //https://github.com/mozilla/localForage https://mozilla.github.io/localForage/
        'localforageNopromises': libsUrl + '/localforage/1.4.2/localforage.nopromises', //nopromises
        'infiniteScroll': assetsUrl + '/infinite-scroll',
        'openApp': assetsUrl + '/openApp'
    },
    // requireJs输出常规组件，可以AMD模式调用
    requireJsShim: {
        '$': {
            exports: '$'
        },
        'jquery': {
            exports: 'jquery'
        },
        'Jquery': {
            exports: 'Jquery'
        },
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

}
