/* requireJs总配置 */
require.config({
    //项目地址
    baseUrl: '/' + _CONF.sDomain() + '/',
    //公共模块输出变量名
    paths: {
        '$': _URL.libsUrl + '/jquery/1.7.2/jquery.min',
        'jquery':  _URL.libsUrl + '/jquery/1.7.2/jquery.min',
        'Jquery':  _URL.libsUrl + '/jquery/1.7.2/jquery.min',
        'cs':  _URL.libsUrl + '/require-cs/0.5.0/cs', //https://github.com/requirejs/require-cs
        'text':  _URL.libsUrl + '/require-text/2.0.15/text', //http://requirejs.org/docs/api.html#text
        'domReady':  _URL.libsUrl + '/require-domReady/2.0.1/domReady', //http://requirejs.org/docs/api.html#pageload
        'underscore':  _URL.libsUrl + '/underscore', //http://www.bootcss.com/p/underscore/#values
        'backbone':  _URL.libsUrl + '/backbone/1.3.3/backbone', //http://www.css88.com/doc/backbone/
        'backboneLocalstorage':  _URL.libsUrl + '/backbone/1.3.3/backbone-localstorage', //https://github.com/robmoorman/backbone-localstorage
        'localforage':  _URL.libsUrl + '/localforage/1.4.2/localforage', //https://github.com/mozilla/localForage https://mozilla.github.io/localForage/
        'localforageNopromises':  _URL.libsUrl + '/localforage/1.4.2/localforage.nopromises', //nopromises
    	'global': _URL.baseUrl +'/global',
        'infiniteScroll': _URL.assetsUrl +'/infinite-scroll',
        'openApp': _URL.assetsUrl +'/openApp'
    },
    // 载入不符合AMD封装的模块:deps依赖;exports输出的变量名
    shim: {
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
    map: {
        '*': {
            'foo': 'foo'
        },
        'some/oldmodule': {
            'foo': 'foo1.0'
        }
    },
    urlArgs: "bust=" +  (new Date()).getTime()
});

var newConfig = {
    pathsExtend: function(des, src, override) {
        if (src instanceof Array) {
            for (var i = 0, len = src.length; i < len; i++)
                this.pathsExtend(des, src[i], override);
        }
        for (var i in src) {
            if (override || !(i in des)) {
                des[i] = src[i];
            }
        }
        return des;
    },
    pathsIntegrate: function(sysPaths) {
        var result = this.pathsExtend({}, [this.paths, sysPaths]);
        delete result[0];
        delete result[1];
        return result;
    }

};
