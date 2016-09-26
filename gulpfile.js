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
    jsdoc = require('gulp-jsdoc3'), //自动文档

    /* 压缩 */
    htmlmin = require("gulp-html-minifier"), //html压缩
    uglify = require('gulp-uglify'), //js压缩
    minifycss = require('gulp-clean-css'), //CSS压缩
    imagemin = require('gulp-imagemin'), //图片压缩
    spriter = require('gulp-css-spriter'), //图片合并
    base64 = require('gulp-css-base64'), //base64

    /* 合并 */
    useref = require('gulp-useref'), // html内资源合并
    concat = require('gulp-concat'), //多文件合并
    browserify = require('browserify'), //管理js依赖，JS模块化
    webpack = require('gulp-webpack'), //管理js依赖，JS模块化
    seajsCombo = require('gulp-seajs-combo'), //管理js依赖，JS模块化
    amdOptimize = require("amd-optimize"), //管理js依赖，JS模块化

    /* 编译 */
    less = require('gulp-less'), //编译CSS
    sass = require('gulp-sass'), //编译CSS
    stylus = require('gulp-stylus'), //编译CSS
    coffee = require("gulp-coffee"), //编译JS
    babel = require('gulp-babel'), //编译JS,ES6编译成ES5
    react = require('gulp-react'), //编译JS,React转成JavaScript
    jade = require("gulp-jade"), //编译模板

    /* 测试、检测 */
    jshint = require('gulp-jshint'), //JS语法检测
    stylish = require('jshint-stylish'), //工厂
    mocha = require('gulp-mocha'), // 测试

    /* require业务脚本 */
    config = require('./config.js'), //自定义配置
    jsdocConfig = require('./jsdoc.json'), //文件注释JSON文件
    getFile = require('./file.js'); //根据src获取文件相关属性

/*自定义配置API*/
var conf = config.conf(),
    src = config.src(),
    srcHtmlPrev = config.srcHtmlPrev(),
    srcStaticPrev = config.srcStaticPrev(),
    dist = config.dist(),
    distHtmlPrev = config.distHtmlPrev(),
    distStaticPrev = config.distStaticPrev();

/*文档API*/
var docName = jsdocConfig.templates.systemName, //doc文档标题
    docInclude = jsdocConfig.source.include, //doc文档需要引入的文件，多文件构成文档
    docExclude = jsdocConfig.source.exclude; //doc文档需要排除的文件
docOutDir = jsdocConfig.opts.destination; //doc文档输出位置

/*JS检查 工厂*/
var useJshint = lazypipe()
    .pipe(jshint)
    .pipe(jshint.reporter, stylish);

/*help命令*/
gulp.task('help', function() {
    console.log('---参考命令 | 开始---------------------------------------------');
    console.log('');
    console.log(' gulp server -p            开启生产server（无参为默认本server）');
    console.log('');
    console.log(' gulp server -d            开启开发server');
    console.log('');
    console.log(' gulp compile          编译所有src.compile中文件至同目录下');
    console.log('');
    console.log(' gulp build            生产-全部模块打包');
    console.log('');
    console.log(' gulp build -m moduleName  生产-部分模块打包（默认全部打包）');
    console.log('');
    console.log(' gulp clean            删除生产文件');
    console.log('');
    console.log('---参考命令 | 结束---------------------------------------------');
});

/*自动监听检查JS*/
gulp.task('autoJshint', function() {
    return watch.autoJshint();
});

/*自动监听编译模板*/
gulp.task('autoCompile', function() {
    return watch.autoCompile();
});

/* 命令编译模板 */
gulp.task('compile', function() {
    var mod = argv.m || 'all';
    return manual.compile(mod);
});

/* 命令运行测试 */
gulp.task('test', function() {
    var mod = argv.m || 'all';
    return manual.test(mod);
});

/*启动服务 (2016-6-20 9:31测试通过)*/
gulp.task('server', ['autoCompile', 'autoJshint'], function() {
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

/* 清空所有dist目录 */
gulp.task('clean', function() {
    return del(['./' + dist.dir]);
});

/* build命令：项目文件构建处理 */
gulp.task('build', function() {
    var mod = argv.m || 'all',
        parts = [];
    parts = manual.getParts(mod);
    for (var key in parts) { //转为线性执行
        (function(key) {
            console.log('');
            console.log('┌-------------------构建“' + parts[key] + '”模块 | 开始------------------------┐');
            console.log('');
            var modItem = parts[key];
            gulp.task('delDir', function() {
                console.log(' 删除 “' + './' + distHtmlPrev + '/' + modItem, '和 ./' + distStaticPrev + '/' + conf.appDir + '/' + modItem + '” 结束');
                return gulp.src(['./' + distHtmlPrev + '/' + modItem, './' + distStaticPrev + '/' + conf.appDir + '/' + modItem], { read: false }).pipe(clean());
            });
            /* 非mini : 编译 */
            gulp.task(modItem + '_html', function() {
                return build.html(modItem);
            });
            gulp.task(modItem + '_res', function() {
                return build.res(modItem);
            });
            /* mini */
            gulp.task(modItem + '_mini_html', function() {
                return mini.html(modItem);
            });
            gulp.task(modItem + '_mini_css', function() {
                return mini.css(modItem);
            })
            gulp.task(modItem + '_mini_js', function() {
                return mini.js(modItem);
            })
            gulp.task(modItem + '_module', function(cb) {
                if (conf.mini) {
                    runSequence(
                        'delDir', modItem + '_mini_html', modItem + '_res', modItem + '_mini_css', modItem + '_mini_js', cb
                    );
                } else {
                    runSequence(
                        'delDir', modItem + '_html', modItem + '_res', cb
                    );
                }
            })
            gulp.start(modItem + '_module');
            console.log(' 重新构建 “' + parts[key] + '” 结束');
            console.log('');
            console.log('└--------------------------------------------------------------------┘');
            console.log('');
        })(key);
    }
});

/* static命令：构建src/static至dist/static中 (2016-6-23 8:23测试通过)*/
gulp.task('static', function() {
    var _src = srcStaticPrev + '/**/*.*',
        _dist = distStaticPrev + '/';
    gulp.task('delStatic', function() { //先对dist/static清除
        return gulp.src(_dist, { read: false }).pipe(clean());
    });
    gulp.task('static_res', function() { //复制生成，这里会连带生成apps下的业务脚本，但在整体打包时会删除重新生成。
        gulp.src(_src)
            .pipe(gulpif('*.js' && dist.jshint, useJshint())) //根据dist.jshint配置开启关闭JS检查
            .pipe(gulpif('*.{jpg,jpeg,png,gif}', imagemin())) //如果是图片，则进行压缩 
            .pipe(gulp.dest(_dist));
    });
    runSequence( //执行task:static命令下任务
        'delStatic', 'static_res'
    );
});
/* 构建生产版本 */
var build = {
    //构建html(2016-6-22 17:43测试通过,demo页：html/o2o/product-list.html)
    html: function() {
        var key = arguments[0],
            _src = srcHtmlPrev + '/' + key + '/**/' + src.html,
            _dist = distHtmlPrev + '/' + key;
        var combined = combiner.obj([
            gulp.src(_src),
            cheerio(function($, file) { //进入.html文件
                var pageRoot = file.path;
                //改写标题
                $('title').html(conf.title + $('title').html());
                //修改CSS路径 忽略JS代码中引入CSS文件的情况
                $('link').each(function(index, el) {
                    var $el = $(this),
                        href = $el.attr('href'),
                        rel = $el.attr('rel');
                    if (href) {
                        if (/icon/ig.test(rel) || rel === 'stylesheet') {
                            $el.attr('href', getFile.changePath(href, pageRoot));
                        }
                    }
                });
                //修改js路径 忽略JS代码中引入JS文件的情况
                $('script').each(function(index, el) {
                    var $el = $(this),
                        href = $el.attr('src');
                    if (href) {
                        $el.attr('src', getFile.changePath(href, pageRoot));
                    }
                });
                //修改img路径(支持data-original图片懒加载) 忽略JS代码中引入img文件的情况
                $('img').each(function(index, el) {
                    var $el = $(this),
                        href = $el.attr('src');
                    if (href) {
                        $el.attr('src', getFile.changePath(href, pageRoot));
                    }
                    var dataImg = $el.data('original');
                    if (dataImg !== undefined) {
                        $el.attr(conf.lazyload, getFile.changePath(dataImg, pageRoot))
                    }
                });
                //修改在html中以style方式写入的背景图片，节点需要加入“background-image”class名
                $('.background-image').each(function(index, el) {
                    var $el = $(this);
                    var imgHref = $el.css('background-image');
                    imgHref = imgHref.replace("url(", '');
                    imgHref = imgHref.replace(")", '');
                    imgHref = imgHref.replace(/'/g, '');
                    imgHref = getFile.changePath(imgHref, pageRoot);
                    $el.css('background-image', "url(" + imgHref + ")");
                });

            }),
            gulp.dest(_dist)
        ]);
        combined.on('error', console.error.bind(console));
        return combined;
    },
    //构建资源(2016-6-23 9:27测试通过)
    res: function() {
        var res = src.res,
            mod = arguments[0],
            staticR = srcStaticPrev + '/' + conf.appDir + '/' + mod, //static下的资源
            r = srcHtmlPrev + '/' + mod, //业务模块下的资源
            rArr = [staticR, r];
        for (var key in rArr) {
            (function(key) {
                var thisR = rArr[key];
                for (var k in res) {
                    (function(k) {
                        var item = res[k].split('/'),
                            _src = thisR + '/**/' + item[1];
                        if (item[1].indexOf('js') !== -1 || item[1].indexOf('css') !== -1) {
                            _src = thisR + '/**/*.' + item[0];
                        }
                        gulp.src(_src)
                            .pipe(gulpif('*.js' && dist.jshint, useJshint()))
                            .pipe(gulpif('*.{jpg,jpeg,png,gif}', imagemin()))
                            .pipe(gulp.dest(distStaticPrev + '/' + conf.appDir + '/' + mod + '/'));
                    })(k)
                }
            })(key)
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
            var key = src.staticDir,
                s = srcStaticPrev;
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
var combo = {
        amd: function() {

        },
        cmd: function() {

        },
        webpack: function() {

        }
    }
    /*构建mini版本*/
var mini = {
    noDistStaticDomain: function() {
        var dsd = dist.staticDomain;
        return dsd === '' || dsd === undefined || dsd === null ? true : false;
    },
    html: function() {
        var userTime = function() {
            var myDate = new Date(),
                year = myDate.getFullYear(),
                month = myDate.getMonth() + 1,
                day = myDate.getDate(),
                hours = myDate.getHours(),
                minutes = myDate.getMinutes(),
                second = myDate.getSeconds();
            return year + month + day + hours + minutes + second;
        }
        var staticDomain = this.noDistStaticDomain() ? '/' + dist.staticDir : dist.staticDomain;
        var key = arguments[0],
            _dist = distHtmlPrev + '/' + key,
            _src = srcHtmlPrev + '/' + key;
        var combined = combiner.obj([
            gulp.src(_src + '/' + src.html),
            cheerio(function($, file) { //进入html文件
                var pageRoot = file.path, //获取html路径
                    pageName = getFile.name(pageRoot);
                //动作一：改写标题
                $('title').html(conf.title + $('title').html());

                /*动作二：检查资源引入句子*/
                var k = true;

                function eachMsg() { //如果引用的为绝对路径
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
                                var _dist2 = distStaticPrev + '/' + conf.appDir + '/' + path + '/' + cssDir + '/min/';
                                domSrc({ // 本组件会自动忽略以绝对方式引入的资源文件，所以会排除以域方式或cdn方式的或"/"开头或"//"开头
                                        file: pageRoot,
                                        selector: 'link',
                                        attribute: 'href'
                                    })
                                    .pipe(concat(pageName + '.css'))
                                    .pipe(spriter({
                                        spriteSheet: distStaticPrev + '/' + conf.appDir + '/' + path + '/' + imgDir + '/min/sprite_' + userTime() + '.png',
                                        pathToSpriteSheetFromCSS: '../' + imgArr[0] + '/min/sprite_' + userTime() + '.png',
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
                                var _dist2 = distStaticPrev + '/' + conf.appDir + '/' + path + '/' + jsDir + '/min/';
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
                    $('head').append('<link rel="stylesheet" href="' + staticDomain + '/' + conf.appDir + '/' + path + '/' + cssArr[0] + '/min/' + pageName + '.css?v=' + userTime() + '">');
                    $('body').append('<script src="' + staticDomain + '/' + conf.appDir + '/' + path + '/' + jsArr[0] + '/min/' + pageName + +'.js?v=' + userTime() + '"></script>');
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
        var isJs = function() {
            var paths = arguments[0],
                suffix = getFile.suffix(paths);
            if (suffix === 'js') {
                return true;
            } else {
                return false;
            }
        };
        var byAMD = function() {
            var paths = arguments[0];
            var c = function() {
                if (conf.moduleCombo === 'amd') {
                    return true;
                }
            }
            return isJs(paths) && c;
        };
        var byCMD = function() {
            var paths = arguments[0];
            var c = function() {
                if (conf.moduleCombo === 'cmd') {
                    return true;
                }
            }
            return isJs(paths) && c;
        };
        var byWebpack = function() {
            var paths = arguments[0];
            var c = function() {
                if (conf.moduleCombo === 'webpack') {
                    return true;
                }
            }
            return isJs(paths) && c;
        };
        var key = arguments[0],
            _dist = distStaticPrev + '/' + conf.appDir + '/' + key + '/',
            _src = srcHtmlPrev + '/' + key + '/**/*.js';
        var combined = combiner.obj([
            gulp.src(_src),
            gulpif(dist.jshint, useJshint()),
            uglify(),
            //bySeajs
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
            _dist = distStaticPrev + '/' + conf.appDir + '/' + key + '/',
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
                        spriteSheet: distStaticPrev + '/' + conf.appDir + '/' + key + '/' + getFile.modDir(paths) + '/' + imgDir + '/min/sprite_' + timestamp + '.png',
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

/* 监听 */
var watch = {
    //自动监听检测JS代码、文档生成 (2016-9-19 14:40测试通过)
    autoJshint: function() {
        gulp.watch(src.dir + '/**/*.js', function(event) {
            if (event.type === 'changed') {
                var _src = event.path;
                var docsDir = conf.docsDir;
                if (src.jsdoc) {
                    delete[docName, docInclude, docExclude, docOutDir];
                    jsdocConfig.templates.systemName = getFile.newSrc(_src) + "-说明文档";
                    jsdocConfig.opts.destination = "./" + docsDir + "/" + getFile.modDir(_src) + "/" + getFile.name(_src);
                    del(['./' + docsDir + '/' + getFile.modDir(_src) + '/' + getFile.name(_src)]);
                };
                gulp.src(_src)
                    .pipe(gulpif(src.jshint, useJshint()))
                    .pipe(gulpif(src.jsdoc, jsdoc(jsdocConfig)));
            } else {
                return false;
            }

        });
    },
    //自动监听编译模板 (2016-9-9 16:05测试通过)
    autoCompile: function() {
        var x = src.compile;
        for (var k in x) {
            gulp.watch(src.dir + '/**/' + x[k].path, function(event) {
                var _src = event.path,
                    fileMod = getFile.modDir(_src),
                    fileName = getFile.name(_src),
                    suffix = getFile.suffix(_src),
                    tool = eval('src.compile.' + suffix + '.tool'),
                    dest = src.dir + '/' + fileMod;
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
    }
}

/* 部分手动命令 */
var manual = {
    getParts: function() {
        var mod = arguments[0],
            modx = mod,
            modules = src.modules;
        if (mod.indexOf('/') > -1) {
            var arr = mod.split('/');
            modx = arr[0];
            if (modules.indexOf(modx) === -1) modx = 'all';
        }
        return modx === 'all' ? modules : [mod];
    },
    //手动命令编译模板(2016-6-21 11:26测试通过)
    compile: function() {
        var mod = arguments[0],
            x = src.compile,
            parts = [];
        parts = this.getParts(mod);
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
                        gulp.src(srcHtmlPrev + '/' + parts[key] + '/**/*.' + suffix)
                            .pipe(gulpif('*.' + suffix, eval(tool)))
                            .pipe(gulp.dest(srcHtmlPrev + '/' + parts[key] + '/'));
                        gulp.src(srcStaticPrev + '/' + conf.appDir + '/' + parts[key] + '/**/*.' + suffix)
                            .pipe(gulpif('*.' + suffix, eval(tool)))
                            .pipe(gulp.dest(srcStaticPrev + '/' + conf.appDir + '/' + parts[key] + '/'));
                    })(k);
                }
            })(key);
        }
    },

    //模块形式测试
    test: function() {
        var mod = arguments[0],
            x = src.compile,
            parts = [];
        parts = this.getParts(mod);
        for (var key in parts) {
            (function(key) {
                gulp.src('test/' + parts[key] + '/**/*.js', { read: false })
                    .pipe(mocha({ reporter: 'nyan' }))
                    .on('error', gutil.log);
            })(key);
        }
    }
}
