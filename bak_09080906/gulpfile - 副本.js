/* 
 gulp build == gulp.env: { _: [ 'build' ] } 
 gulp build1 build2 == gulp.env: { _: [ 'build1','build2' ] }
*/
var gulp = require('gulp'),
    argv = require('yargs').argv, //参数
    path = require('path'), //路径
    gulpif = require('gulp-if'), //判断
    clean = require('gulp-clean'), //清理
    del = require('del'), //清理
    runSequence = require('run-sequence'), //控制task顺序
    sourcemaps = require('gulp-sourcemaps'), //map
    lazypipe = require('lazypipe'), //工厂
    gutil = require('gulp-util'), //打印
    notify = require('gulp-notify'), //控制台打印

    /* 监听、浏览器更新 */
    watch = require("gulp-watch"), //监控
    combiner = require('stream-combiner2'), //工作流中监听error
    changed = require('gulp-changed'), //监听变更
    browserSync = require('browser-sync'), //浏览器同步测试工具
    reload = browserSync.reload, //定义重新加载API

    /* 文件处理 */
    vinylPaths = require('vinyl-paths'), //获取路径
    fs = require('fs'), //文件操作
    glob = require('glob'), //匹配
    filter = require("gulp-filter"), //排除文件
    rename = require("gulp-rename"), //文件重命名
    cheerio = require('gulp-cheerio'), //类jquery
    domSrc = require('gulp-dom-src'), //获取文件内src
    md5 = require("gulp-md5-plus"), //MD5文件签名
    rev = require('gulp-rev'), //更改版本名

	/* 压缩 */
    htmlmin = require("gulp-html-minifier"), //html压缩
    uglify = require('gulp-uglify'), //js压缩
    minifycss = require('gulp-clean-css'), //CSS压缩
    imagemin = require('gulp-imagemin'), //图片压缩
    spriter = require('gulp-css-spriter'), //图片合并
    base64 = require('gulp-css-base64'), //base64

    /* 多文件、JS模块合并 */
    concat = require('gulp-concat'), //多个文件合并
    browserify = require('browserify'), //管理js依赖，JS模块化
    webpack = require('gulp-webpack'), //管理js依赖，JS模块化
    seajsCombo = require('gulp-seajs-combo'), //管理js依赖，JS模块化

    /* 编译 */
    less = require('gulp-less'), //编译CSS
    sass = require('gulp-sass'), //编译CSS
    stylus = require('gulp-stylus'), //编译CSS
    coffee = require("gulp-coffee"), //编译JS
    babel = require('gulp-babel'), //编译JS,ES6编译成ES5
    react = require('gulp-react'), //编译JS,React转成JavaScript
    jade = require("gulp-jade"), //编译模板

    /* 测试、检测 */
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha'),

    /* require业务脚本 */
    config = require('./config.js'), //自定义配置
    getFile = require('./fileAttr.js'); //根据src获取文件相关属性


var conf = config.conf(),
    src = config.src(),
    srcHtmlPrev = config.srcHtmlPrev(),
    srcCommonPrev = config.srcCommonPrev(),
    dist = config.dist(),
    distHtmlPrev = config.distHtmlPrev(),
    distStaticPrev = config.distStaticPrev();

gulp.task('help', function() {
    console.log('---参考命令 | 开始---------------------------------------------');
    console.log('');
    console.log(' gulp server -p			开启生产server（无参为默认本server）');
    console.log('');
    console.log(' gulp server -d			开启开发server');
    console.log('');
    console.log(' gulp compile			编译所有src.compile中文件至同目录下');
    console.log('');
    console.log(' gulp build			生产-全部模块打包');
    console.log('');
    console.log(' gulp build -m moduleName	生产-部分模块打包（默认全部打包）');
    console.log('');
    console.log(' gulp clean			删除生产文件');
    console.log('');
    console.log('---参考命令 | 结束---------------------------------------------');
});
/* http服务 + 监控编译*/
gulp.task('watch', function() {
    return compile.watch();
})
gulp.task('server', ['watch'], function() {
    var evr = argv.d || !argv.p,
        dir = dist.dir,
        port = dist.port,
        domain = dist.domain;
    if (evr) {
        dir = src.dir,
            port = src.port,
            domain = src.domain;
    }
    browserSync({
        files: dir + "/**",
        notify: false,
        reloadDelay: conf.reloadDelay,
        ui: { //browserSync的设置ui界面
            port: 9999,
            weinre: {
                port: 9999
            }
        },
        proxy: domain, //使用本地代理服务
        port: port
    });
});
/* 设置空白命令和default为server启动命令 */
gulp.task('default', ['server']);

/* 编译所有src.compile中格式文件 */
gulp.task('compile', function() {
    var mod = argv.m || 'all' || !argv.m;
    return compile.all(mod);
})

/* 清空所有dist文件及目*/
gulp.task('clean', function() {
    return del(['./' + dist.dir]);
});

/* build命令：项目文件构建处理 */
gulp.task('common',function(){
	var _src = src.dir +'/'+ src.commonDir +'/**/*.*',
		_dist = './' + distStaticPrev + '/' + src.commonDir + '/';
    gulp.task('delCommon', function() {
        return gulp.src(_dist).pipe(clean());
    });
    gulp.task('common_res', function() {
        //return build.res();
        gulp.src(_src)
        .pipe(gulp.dest(_dist));
    });
    runSequence(
        'delCommon', 'common_res'
    );
})
var bulidList=[];



var buildFun = function(){
	var mod = options.mod,
		modules = src.modules;
	 if(!modules[mod]) mod = 'all';
}



gulp.task('build',function() {
    var mod = argv.m || 'all' || !argv.m;
    
    buildFun(mod);

    var modx = mod,
        modules = src.modules;
    if (mod.indexOf('/') > -1) {
        var arr = [];
        arr = mod.split('/');
        modx = arr[0];
    }
    if (modules.indexOf(modx) === -1) modx = 'all';
    /* 获取要build的模块,分别对模块进行初始化及建立 */
    var parts = [];
    if (modx === 'all') {
        parts = modules;
    } else {
        parts = [mod];
    }
    for (var key in parts) {
        (function(key) { //闭包传值
            console.log('');
            console.log('┌-------------------构建“' + modx + '/' + parts[key] + '”模块 | 开始------------------------┐');
            console.log('');
            /* 目录初始化 */
            gulp.task('delDir', function() {
                console.log(' 删除 “' + './' + distHtmlPrev + '/' + parts[key], '和 ./' + distStaticPrev + '/' + parts[key] + '” 结束');
                return gulp.src(['./' + distHtmlPrev + '/' + parts[key], './' + distStaticPrev + '/' + parts[key]]).pipe(clean());
            });
/*            gulp.task('delSpriteDir', function() {
                return gulp.src(distStaticPrev + '/sprite_bak/').pipe(clean());
            });*/
            /* 非mini */
            gulp.task(parts[key] + '_html', function() {
                return build.html(parts[key]);
            });
            gulp.task(parts[key] + '_res', function() {
                return build.res(parts[key]);
            });
            /* mini */
            gulp.task(parts[key] + '_mini_html', function() {
                return mini.html(parts[key]);
            });
            gulp.task(parts[key] + '_mini_css', function() {
                return mini.css(parts[key]);
            })
            gulp.task(parts[key] + '_mini_js', function() {
                return mini.js(parts[key]);
            })
            gulp.task(parts[key] + '_module', function(cb){
	            /* 执行顺序 */
	            if (conf.mini) {
	                runSequence(
	                    'delDir', parts[key] + '_mini_html', parts[key] + '_res', parts[key] + '_mini_css', parts[key] + '_mini_js',cb
	                );
	            } else {
	                runSequence(
	                    'delDir', parts[key] + '_html', parts[key] + '_res', 'common',cb
	                );
	            }
            })
            console.log(' 重新构建 “' + parts[key] + '” 结束');
            console.log('');
            console.log('└-------------------------------------------------------------------------┘');
            console.log('');
        })(key);
        bulidList.push(parts[key]);
    }
	console.log('模块为：'+bulidList);
    runSequence(bulidList);
});
//runSequence('clean',list, 'md5',cb);

/* 构建生产版本 */
var build = {
        //构建html
        html: function() {
            var key = arguments[0],
                _dist = distHtmlPrev + '/' + key,
                _src = srcHtmlPrev + '/' + key + '/**/' + src.html;
            var combined = combiner.obj([
                gulp.src(_src),
                cheerio(function($, file) {
                    var pageRoot = file.path;
                    //动作一：改写标题
                    $('title').html(conf.title + $('title').html());
                    //动作二：修改CSS路径
                    $('link').each(function(index, el) {
                        var $el = $(this),
                            href = $el.attr('href'),
                            rel = $el.attr('rel');
                        if (href) {
                            if (/icon/ig.test(rel) || rel === 'stylesheet') {
                                $el.remove();
                                $('head').append('<link rel="stylesheet" href="' + getFile.changePath(href, pageRoot) + '">');
                            }
                        }
                    });
                    //动作三：修改js路径
                    $('script').each(function(index, el) {
                        var $el = $(this),
                            href = $el.attr('src');
                        if (href) {
                            $el.remove();
                            $('body').append('<script src="' + getFile.changePath(href, pageRoot) + '"></script>');
                        }
                    });
                }),
                gulp.dest(_dist)
            ]);
            combined.on('error', console.error.bind(console));
            return combined;
        },
        //构建资源
        res: function() {
            var res = src.res,
                mod = arguments[0],
                s = srcHtmlPrev + '/' + mod;
            for (var key in res) {
                var item = res[key].split('/'),
                    _src = s + '/**/' + item[1],
                    _dist;
                if (mod === undefined) {
                    var mod = src.commonDir,
                        s = srcCommonPrev,
                        _src = s + '/**/' + item[1];
                }
                var checkSuffix = function(){
                	var suffix = arguments[0];
                	if(item[1].indexOf(suffix) > -1){
                		return true;
                	}else{
                		return false;
                	}
                }
                gulp.src(_src)
                .pipe(vinylPaths(function(paths) {
                	_dist = distStaticPrev + '/' + getFile.modDir(paths) + '/';
	                gulp.src(paths)
	                .pipe(gulpif('*.js',jshint()))
	                .pipe(gulpif('*.js',jshint.reporter('default')))
                    .pipe(gulpif('*.{jpg,jpeg,png,gif}', imagemin()))
                    .pipe(gulp.dest(_dist));
	                return Promise.resolve();
	            }))
            }
        },
        //webpack构建JS
        jsWebpck: function() {
            var entries = function(globPath) {
                var files = glob.sync(globPath),
                    entries = {},
                    entry,
                    dirname,
                    basename;
                for (var i = 0; i < files.length; i++) {
                    entry = files[i];
                    dirname = path.dirname(entry);
                    basename = path.basename(entry, '.js');
                    entries[path.join(dirname, basename)] = './' + entry;
                }
                return entries;
            };
            var key = arguments[0],
                s = srcHtmlPrev + '/' + key;
            if (arguments[0] === undefined) {
                var key = src.commonDir,
                    s = srcCommonPrev;
            }
            var _dist = distStaticPrev + '/' + key + '/',
                _src = s + '/**/' + src.js;
            var combined = combiner.obj([
                gulp.src(_src),
                webpack({
                    entry: entries(_src),
                    output: {
                        path: path.join(__dirname, _dist),
                        filename: '[name].js'
                    }
                }, null, function(err, stats) {
                    if (err) throw new gutil.PluginError("webpack", err);
                    console.log("[webpack]", 'webpack is work!');
                }),
                gulp.dest(_dist), //转移至dist目录下保存
                uglify(), //混淆
                gulp.dest(_dist + '/min/') //输出混淆版本保存
            ]);
            combined.on('error', console.error.bind(console));
            return combined;
        }
    }
    /*构建mini版本*/
var mini = {
    noDistStaticDomain: function() {
        var sd = dist.staticDomain;
        if (sd === '' || sd === undefined || sd === null) {
            return true;
        } else {
            return false;
        }
    },
    html: function() {
        if (this.noDistStaticDomain()) {
            staticDomain = '/' + dist.staticDir;
        } else {
            staticDomain = dist.staticDomain;
        }
        var key = arguments[0],
            _dist = distHtmlPrev + '/' + key,
            _src = srcHtmlPrev + '/' + key;
        var combined = combiner.obj([
            gulp.src(_src + '/' + src.html),
            cheerio(function($, file) {
                var pageRoot = file.path,
                    timestamp = +new Date(),
                    pageName = getFile.name(pageRoot) + '_v_' + timestamp;
                //动作一：改写标题
                $('title').html(conf.title + $('title').html());
                /*动作二：检查资源引入句子*/
                var k = true;

                function eachMsg() {
                    var src = arguments[0];
                    if (src[0] === '/' && src[1] != '/') {
                        k = false;
                        console.log('');
                        console.log('┌-------------------错误！！！！！！------------------------┐');
                        console.log('');
                        console.log('"' + getFile.name(pageRoot) + '"中"' + src + '"为绝对路径引用，请改为相对路径！')
                        console.log('');
                        console.log('└-----------------------------------------------------------┘');
                        console.log('');
                    }
                }
                $('link', 'script').each(function(index, el) {
                    var $el = $(this),
                        href = $el.attr('href'),
                        rel = $el.attr('rel'),
                        src = $el.attr('src');
                    if (href) {
                        if (/icon/ig.test(rel) || rel === 'stylesheet') { //排除非CSS引入句子
                            eachMsg(href);
                            return false;
                        }
                    }
                    if (src) {
                        eachMsg(href);
                        return false;
                    }
                });
                /*动作三：合并资源文件*/
                if (k) {
                    var res = src.res,
                        path = getFile.modDir(pageRoot);
                    for (var key in res) {
                        (function(key) {
                            var item = res[key];
                            //css合并、css中图片合并
                            if (item.indexOf('css') > -1) {
                                var imgDir = 'img',
                                    cssArr = item.split('/');
                                var cssDir = cssArr[0];
                                for (var i in res) {
                                    (function(i) {
                                        var that = res[i];
                                        if (that.indexOf('jpg') > -1 || that.indexOf('jpeg') > -1 || that.indexOf('png') > -1 || that.indexOf('gif') > -1) {
                                            var imgArr = that.split('/'),
                                                imgDir = imgArr[0];
                                        }
                                    })
                                }
                                var _dist2 = distStaticPrev + '/' + path + '/' + cssDir + '/min/';
                                domSrc({ // 本组件会自动忽略以绝对方式引入的资源文件，所以会排除以域方式或cdn方式的
                                        file: pageRoot,
                                        selector: 'link',
                                        attribute: 'href'
                                    })
                                    .pipe(concat(pageName + '.css'))
                                    .pipe(spriter({
                                        spriteSheet: distStaticPrev + path + '/' + imgDir + '/min/sprite_' + timestamp + '.png',
                                        pathToSpriteSheetFromCSS: '../' + imgArr[0] + '/min/sprite_' + timestamp + '.png',
                                        spritesmithOptions: {
                                            padding: 5
                                        }
                                    }))
                                    .pipe(minifycss())
                                    .pipe(gulp.dest(_dist2));
                                $('link').each(function(index, el) {
                                    var $el = $(this),
                                        src = $el.attr('href'),
                                        rel = $el.attr('rel');
                                    if (src) {
                                        if (/icon/ig.test(rel) || rel === 'stylesheet') { //排除非CSS引入句子
                                            if (src.substring(0, 4) != 'http' && src.substring(0, 2) != '//') {
                                                $el.remove();
                                            }
                                        }
                                    }
                                });
                            }
                            if (item.indexOf('js') > -1) {
                                var jsArr = item.split('/');
                                var jsDir = jsArr[0];
                                var _dist2 = distStaticPrev + path + '/' + jsDir + '/min/';
                                domSrc({ // 本组件会自动忽略以绝对方式引入的资源文件，所以会排除以域方式或cdn方式的
                                        file: pageRoot,
                                        selector: 'script',
                                        attribute: 'src'
                                    })
                                    .pipe(concat(pageName + '.js'))
                                    .pipe(uglify())
                                    .pipe(gulp.dest(_dist2));
                                $('script').each(function(index, el) {
                                    var $el = $(this),
                                        src = $el.attr('src');
                                    if (src) {
                                        if (src.substring(0, 4) != 'http' && src.substring(0, 2) != '//') {
                                            $el.remove();
                                        }
                                    }
                                });
                            }
                        })(key);
                    }
                    //删除原有资源引入句子
                    $('link', 'script').each(function(index, el) {
                        var $el = $(this),
                            href = $el.attr('href'),
                            rel = $el.attr('rel'),
                            src = $el.attr('src');
                        var cssBoolean = function() {
                            var x = /icon/ig.test(rel) || rel === 'stylesheet';
                            return href && x;
                        }
                        if (src || cssBoolean) {
                            if (src.substring(0, 4) != 'http' && src.substring(0, 2) != '//') {
                                $el.remove();
                            }
                        }
                    });
                    //动作四 加入构建后的CSS和JS引入句子
                    $('head').append('<link rel="stylesheet" href="' + staticDomain + path + '/' + cssArr[0] + '/min/' + pageName + '.css">');
                    $('body').append('<script src="' + staticDomain + path + '/' + jsArr[0] + '/min/' + pageName + +'.js"></script>');
                }
            }),
            htmlmin({
                minifyCSS: true,
                minifyJS: true,
                collapseWhitespace: true,
                removeComments: true //清除注释
            }),
            gulp.dest(_dist)
        ]);
        combined.on('error', console.error.bind(console));
        return combined;
    },
    //构建mini-Js
    js: function() {
        var entries = function(globPath) {
            var files = glob.sync(globPath),
                entries = {},
                entry,
                dirname,
                basename;
            for (var i = 0; i < files.length; i++) {
                entry = files[i];
                dirname = path.dirname(entry);
                basename = path.basename(entry, '.js');
                entries[path.join(dirname, basename)] = './' + entry;
            }
            return entries;
        };
    	var isJs = function(){
    		var paths = arguments[0],
    			suffix = getFile.suffix(paths);
			if(suffix === 'js'){
				return true;
			}else{
				return false;
			}
    	};
    	var bySeajs = function(){
    		var paths = arguments[0];
    		var c = function(){
    			if(conf.moduleCombo === 'seajs'){
    				return true;
    			}
    		}
    		return isJs(paths) && c;
    	};
    	var byWebpack = function(){
    		var paths = arguments[0];
    		var c = function(){
    			if(conf.moduleCombo === 'webpack'){
    				return true;
    			}
    		}
    		return isJs(paths) && c;
    	};
        var key = arguments[0],
            _dist = distStaticPrev + '/' + key + '/',
            _src = srcHtmlPrev + '/' + key + '/**/*.js';
        var combined = combiner.obj([
            gulp.src(_src),
            uglify(),
            rename(function(path) {
                path.dirname += "/min";
            }),
            gulp.dest(_dist)
        ]);
        combined.on('error', console.error.bind(console));
        return combined;
    },
    //构建mini-css
    css: function() {
        var key = arguments[0],
            _dist = distStaticPrev + '/' + key + '/',
            _src = srcHtmlPrev + '/' + key + '/**/*.css';
        var res = src.res,
            imgDir = 'img',
            timestamp = +new Date();
        for (var i in res) {
            (function(i) {
                var that = res[i];
                if (that.indexOf('jpg') > -1 || that.indexOf('jpeg') > -1 || that.indexOf('png') > -1 || that.indexOf('gif') > -1) {
                    var imgArr = that.split('/'),
                        imgDir = imgArr[0];
                }
            })
        }
        var combined = combiner.obj([
            gulp.src(_src),
            vinylPaths(function(paths) {
                gulp.src(paths)
                    .pipe(spriter({
                        spriteSheet: distStaticPrev + '/' + key + '/' + getFile.modDir(paths) + '/' + imgDir + '/min/sprite_' + timestamp + '.png',
                        pathToSpriteSheetFromCSS: '../' + imgDir + '/min/sprite_' + timestamp + '.png',
                        spritesmithOptions: {
                            padding: 5
                        }
                    }))
                return Promise.resolve();
            }),
            minifycss(),
            rename(function(path) {
                path.dirname += "/min";
            }),
            gulp.dest(_dist)
        ]);
        combined.on('error', console.error.bind(console));
        return combined;
    }
}


/* 编译各种模板至开发版本中 */
var compile = {
    //自动监听并编译模板
    watch: function() {
        var x = src.compile;
        for (var k in x) {
            gulp.watch(srcHtmlPrev + '/**/' + x[k].path, function(event) {
                var _src = event.path,
                    fileName = getFile.name(_src),
                    fileMod = getFile.modDir(_src),
                    suffix = getFile.suffix(_src),
                    tool = eval('src.compile.' + suffix + '.tool'),
                    dest = src.dir + '/' + src.htmlDir + '/' + fileMod;
                console.log('');
                console.log('---自动编译 | 开始---------------------------------------------');
                console.log('');
                if (fileName[0] === '_') {
                    _src = getFile.dir(_src) + '!(_)*.' + suffix;
                    console.log(' **您修改的文件为公共文件**');
                }
                console.log('使用"' + tool + '"自动编译"' + _src + '"');
                console.log('');
                console.log('编译文件位于："' + dest + '"目录');
                console.log('');
                console.log('---自动编译 | 结束---------------------------------------------');
                console.log('');
                var combined = combiner.obj([
                    gulp.src(_src),
                    gulpif('*.' + suffix, eval(tool)),
                    gulp.dest(dest)
                ]);
                combined.on('error', console.error.bind(console));
                return combined;
            })
        }
    },
    //手动命令编译模板
    all: function() {
        var mod = arguments[0],
            x = src.compile,
            modx = mod,
            modules = src.modules,
            parts = [];;
        if (mod.indexOf('/') > -1) {
            var arr = [];
            arr = mod.split('/');
            modx = arr[0];
        }
        if (modules.indexOf(modx) === -1) modx = 'all';
        if (modx === 'all') {
            parts = modules;
        } else {
            parts = [mod];
        }
        for (var key in parts) {
            (function(key) {
                for (var k in x) {
                    (function(k) {
                        var _src = x[k].path,
                            fileName = getFile.name(_src),
                            suffix = getFile.suffix(_src),
                            tool = eval('src.compile.' + suffix + '.tool');
                        console.log('');
                        console.log('---自动编译 | 开始---------------------------------------------');
                        console.log('');
                        console.log('使用"' + tool + '"自动编译所有"' + srcHtmlPrev + '/' + parts[key] + '/**/*.' + suffix + '"');
                        console.log('');
                        console.log('编译文件位于："' + suffix + '"文件的同目录下');
                        console.log('');
                        console.log('---自动编译 | 结束---------------------------------------------');
                        console.log('');
                        var combined = combiner.obj([
                            gulp.src(srcHtmlPrev + '/' + parts[key] + '/**/*.' + suffix),
                            gulpif('*.' + suffix, eval(tool)),
                            gulp.dest(srcHtmlPrev + '/' + parts[key] + '/')
                        ]);
                        combined.on('error', console.error.bind(console));
                        return combined;
                    })(k);
                }
            })(key);
        }
    }
}
