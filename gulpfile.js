/*!
 * Gulp Tool
 * @author Franks.T.D
 * Released under MIT license
 */
/**
 * 载入gulp插件
 */
var gulp = require('gulp'), //前端自动化构建工具，在国内经常使用的还有webpack和grunt
    argv = require('yargs').argv, //获取命令中的参数，获取参数后可以进行判断进而处理不同的任务
    path = require('path'), //文件路径解析工具
    gulpif = require('gulp-if'), //判断插件,用于pipe导流管中
    clean = require('gulp-clean'), //删除文件或文件夹
    del = require('del'), //删除文件或文件夹
    runSequence = require('run-sequence'), //顺序执行多个自己指定的task任务
    sourcemaps = require('gulp-sourcemaps'), //存储源代码位置信息插件，对应了转换前和转换后的代码位置，一般用于浏览器端调试压缩混淆后的JS代码
    lazypipe = require('lazypipe'), //分离多个pipe导流管道至一个工厂，即把多个stream链进行单独集合
    gutil = require('gulp-util'), //这里只使用其日志打印功能
    notify = require('gulp-notify'), //windows或unix系统使用任务栏通知工具，苹果系统用gulp-notify模块
    sftp = require('gulp-sftp'), //FTP上传插件
    tap = require('gulp-tap'), //进入pipe管道，可针对当前文档进行操作

    /* 监听、浏览器更新 */
    watch = require("gulp-watch"), //可对指定的文件进行监听
    combiner = require('stream-combiner2'), //合并多个stream，然后进行错误监听，可防止错误时导致进程中断
    changed = require('gulp-changed'), //监听并且获取到stream中变更的文件
    browserSync = require('browser-sync'), //监听项目源文件变更，同步刷新浏览器，支持多浏览器或设置终端
    reload = browserSync.reload, //定义重新加载API

    /* 文件处理 */
    vinylPaths = require('vinyl-paths'), //操作pipe中文件的路径
    fs = require('fs'), //文件操作模块，即Node.js中的file system
    glob = require('glob'), //找到与参数相匹配的文件，用于同步搜索文件
    filter = require("gulp-filter"), //筛选符合条件的文件对象并进行排除
    rename = require("gulp-rename"), //重命名文件
    cheerio = require('gulp-cheerio'), //可对HTML和XML文件进行DOM操作，类似jQuery操作
    domSrc = require('gulp-dom-src'), //使HTML文档中所有script/link引用的文件形成一个stream
    md5 = require("gulp-md5-plus"), //使HTML文档中的资源文件改为md5戳命名，同时也修改HTML的资源引用名
    rev = require('gulp-rev'), //版本
    jsdoc = require('gulp-jsdoc3'), //js自动生成文档

    /* 压缩 */
    htmlmin = require("gulp-html-minifier"), //HTML文档压缩
    uglify = require('gulp-uglify'), //JS文档压缩
    minifycss = require('gulp-clean-css'), //CSS文档压缩
    imagemin = require('gulp-imagemin'), //JPEG、PNG、GIF、SVG图片压缩
    spriter = require('gulp-css-spriter'), //对单个CSS文档中使用的所有图片合并成一张图，并且CSS自动以绝对像素重新调用。即雪碧图、精灵图
    base64 = require('gulp-css-base64'), //对CSS文档的图片进行BASE64编码，可减少HTTPS请求，因大图使用后会造成CSS文档过大，所以需要控制适用图片的大小

    /* 合并 */
    useref = require('gulp-useref'), // 合并HTML文档中JS、CSS为单一文件，并且改写资源请求
    concat = require('gulp-concat'), //合并gulp.src()中文件为单一文件
    browserify = require('browserify'), //合并指定入口JS文件内的依赖模块，适用于commonJS规范
    webpack = require('gulp-webpack'), //合并指定入口JS文件内的依赖模块，适用于commonJS、AMD、CMD规范
    seajsCombo = require('gulp-seajs-combo'), //合并指定入口JS文件内的依赖模块，适用于CMD规范，即SeaJs
    amdOptimize = require("amd-optimize"), //合并指定入口JS文件内的依赖模块，适用于AMD规范，即RequireJs

    /* 编译 */
    less = require('gulp-less'), //编译less文件至css文件
    sass = require('gulp-sass'), //编译sass文件至css文件
    stylus = require('gulp-stylus'), //编译stylus文件至css文件
    coffee = require("gulp-coffee"), //编译coffee文件至js文件
    babel = require('gulp-babel'), //可编译ES6至ES5，编译React的JSX变为createElement调用，编译后支持IE8以上普通浏览器
    react = require('gulp-react'), //编译JSX文件至js文件
    jade = require("gulp-jade"), //编译jade模板至html文件

    /* 测试、检测 */
    jshint = require('gulp-jshint'), //对js代码进行风格检测
    stylish = require('jshint-stylish'), //需配合jshint使用，作为报告器使用
    useJshint = lazypipe().pipe(jshint).pipe(jshint.reporter, stylish), //工厂
    mocha = require('gulp-mocha'); // 测试

/**
 * 载入配置文件并缓存
 * 变量采用大写，便于区分
 */
var TOOL_CONF = require('./config-tool.js'), //自定义配置
    APPS_CONFIG = require('./config-apps.js'), //自定义配置
    JSDOC_CONFIG  = require('./jsdoc.json'), //js文档输出配置
    SFTP_CONFIG = require('./sftp.js'), //sftp上传配置
    THIS_PATH = require('./file.js'), //文档对象处理

    /* config-tool.js配置缓存 */
    COMPILE = TOOL_CONF.compile, // 获取所有需编译项
    ROOT = TOOL_CONF.root, // 获取本工具所在物理路径

    /* config-apps.js - src版本属性缓存*/
    APP_CONF = APPS_CONFIG.conf(), //获得config-apps中config属性入口
    SRC_DIR = APP_CONF.srcDir, // 开发目录
    SRC_HTML_DIR = APP_CONF.srcHtmlDir, //SRC_DIR的下级目录，用于存放各个项目html页面，下级为各个项目文件夹（项目名命名），如：“src/html/gulp-compile-demo”,gulp-compile-demo为拟定的项目名，在config.appsItem需要配置
    SRC_STATIC_DIR = APP_CONF.srcStaticDir, // SRC_DIR的下级目录，用于存放资源文件，下级为 各个项目的业务资源目录夹（SRC_STATIC_APPS_DIR）、自有公共资源目录夹（assents）、第三方资源目录夹（libs）
    SRC_STATIC_APPS_DIR = APP_CONF.srcStaticAppsDir, // SRC_STATIC_DIR的下级目录，为各个项目的业务资源目录夹，同级目录夹看上面注释。下级目录为各个项目名文件夹，需和config.appsItem配置一致。如："src/static/apps/gulp-compile-demo"
    SRC_DOMAIN = APP_CONF.srcDomain, // 本地web服务，如nginx、apache、IIS等
    SRC_PORT = APP_CONF.srcPort, // 开发目录的web代理服务，域为“localhost”，端口为本端口。即："http://localhost:8860" => "http://localhost:8861"

    /* config-apps.js - dist版本属性缓存 */
    DIST_DIR = TOOL_CONF.distDir, // 生成版本目录，可理解测试版本、生产版本
    DIST_HTML_DIR = TOOL_CONF.distHtmlDir, //DIST_DIR的下级目录，用于存放各个项目构建的html页面，如：“dist/html/gulp-compile-demo”
    DIST_STATIC_DIR = TOOL_CONF.distStaticDir, // DIST_DIR的下级目录，用于存放构建的资源文件，下级为自动构建的 各个项目的业务资源目录夹（DIST_STATIC_APPS_DIR）、自有公共资源目录夹（assents）、第三方资源目录夹（libs）
    DIST_STATIC_APPS_DIR = TOOL_CONF.distStaticAppsDir, // SRC_STATIC_DIR的下级目录，为业务资源目录夹，同级目录夹看上面注释。下级目录为自动构建的各个项目名文件夹。如："dist/static/apps/gulp-compile-demo"
    DIST_DOMAIN = TOOL_CONF.distDomain, // 本地web服务，如nginx、apache、IIS等
    DIST_STATIC_DOMAIN = TOOL_CONF.distStaticDomain, // 本地web服务，如nginx、apache、IIS等
    DIST_PORT = TOOL_CONF.distPort, // 开发目录的web代理服务，域为“localhost”，端口为本端口。即："http://localhost:8860" => "http://localhost:8861"

    DIST_STATIC_DIR = APP_CONF.distStaticDir, // 获取应用配置中的开发版本static目录名
    DIST_STATIC_DOMAIN = APP_CONF.distStaticDomain, // 获取应用配置中的开发版本static使用域名
    HAS_DIST_STATIC_DOMAIN = APPS_CONFIG.hasDistStaticDomain(); //获取应用配置中生产版本否存在static域名

    src = APPS_CONFIG.srcDir(),
    srcHtmlPrev = APPS_CONFIG.srcHtmlPrev(),
    srcStaticPrev = APPS_CONFIG.srcStaticPrev(),
    srcStaticAppsPrev = APPS_CONFIG.srcStaticAppsPrev(),
    dist = APPS_CONFIG.distDir(),
    distHtmlPrev = APPS_CONFIG.distHtmlPrev(),
    distStaticPrev = APPS_CONFIG.distStaticPrev(),
    distStaticAppsPrev = APPS_CONFIG.distStaticAppsPrev(),

    /*js文档输出配置缓存*/
    docName = JSDOC_CONFIG.templates.systemName, //doc文档标题
    docInclude = JSDOC_CONFIG.source.include, //doc文档需要引入的文件，多文件构成文档
    docExclude = JSDOC_CONFIG.source.exclude, //doc文档需要排除的文件
    docOutDir = JSDOC_CONFIG.opts.destination; //doc文档输出位置

/* help命令 */
gulp.task('help', function() {
    console.log('---参考命令 | 开始---------------------------------------------');
    console.log('');
    console.log(' gulp 或 gulp server 或 gulp server -d');
    console.log(' ↑ 启动生产版本（src目录）web代理服务，同时开启server服务、自动编译服务、自动JS代码风格检测服务')
    console.log(' ↑ 命令成功执行后会自动启动本地默认浏览器，并且打开web代理服务的默认页');
    console.log('');
    console.log(' gulp server -p');
    console.log(' ↑ 启动生产版本（dist目录）web代理服务，可对打包构建后的版本进行调试 ');
    console.log('');
    console.log(' gulp compile');
    console.log(' ↑ 命令编译所有项目中所有JADE、LESS、SASS、SCSS、STYL、JSX、COFFEE、ES6可编译文件，编译位置在编译文件同目录下');
    console.log('');
    console.log(' gulp compile -app yourAppName');
    console.log(' ↑ 命令编译指定项目名下所有JADE、LESS、SASS、SCSS、STYL、JSX、COFFEE、ES6可编译文件，编译位置在编译文件同目录下');
    console.log(' ↑ 可含上下既关系的书写，则编译指定项目下的某个文件夹。单个文件编译直接启动gulp server -d命令，然后保存文件进行自动编译');
    console.log('');
    console.log(' gulp build');
    console.log(' ↑ 构建所有在config-apps.js中配置的项目（在"src/html/"下需存在同名文件夹，下方build相关命令要求一致）至dist目录中');
    console.log('');
    console.log(' gulp build -app yourAppName');
    console.log(' ↑ 构建指定的项目至dist目录中，“-app”后面空格需紧跟你实际的项目名；可含上下级关系的书写，则为某个项目下的某个模块打包');
    console.log(' ↑ 此命令在"src/html/"下设置同名文件夹时，并且在config-apps.js中config.appsItem进行配置后生效，否则提示"找不到对应项目！"');
    console.log('');
    console.log(' gulp build -mini');
    console.log(' ↑ 在不指定项目名的情况下，以压缩混淆方式构建所有在config-apps.js中配置的项目至dist目录中 ');
    console.log('');
    console.log(' gulp build -amd 或 gulp build -cmd 或 gulp build -webpack');
    console.log(' ↑ 在不指定项目名的情况下，以amd模式或amd模式或webpack打包构建所有项在config-apps.js中配置的项目至dist中');
    console.log('');
    console.log(' gulp build -app yourAppName -mini -amd');
    console.log(' ↑ 以amd模式、生成mini版本的方式打包你指定的项目，除"-app yourAppName"不可拆开写外，参数位置可互换');
    console.log('');
    console.log(' gulp upload yourFolder ');
    console.log(' ↑ 上传指定的文件夹到FTP服务器中，可以存在上下级关系的目录结构。请先配置sftp.js')
    console.log('');
    console.log(' gulp clean ');
    console.log(' ↑ 删除dist目录，如果存在多个独立项目，请慎重使用');
    console.log('');
    console.log(' gulp test yourAppName 或 gulp test yourFireUrl ');
    console.log(' ↑ 测试指定的项目或文件');
    console.log('');
    console.log('---参考命令 | 结束---------------------------------------------');
});

/* 设置空白命令和default为server启动命令 */
gulp.task('default', ['server']);

/* 清空所有dist目录 */
gulp.task('clean', function() {
    return del(['./' + dist.dir]);
});

/*自动监听检查JS*/
gulp.task('autoJshint', function() {
    return watch.autoJshint();
});

/*启动服务 (2016-6-20 9:31测试通过)*/
gulp.task('server', ['autoCompile', 'autoJshint'], function() {
    var evr = argv.d || !argv.p, //开发环境为true，生产环境为false，默认为true
        dir = conf.distDir,
        port = conf.distPort,
        domain = conf.distDomain;
    if (evr) {
        dir = conf.srcDir;
        port = conf.srcPort;
        domain = conf.srcDomain;
    }
    browserSync({
        files: dir + "/**",
        notify: false,
        reloadDelay: TOOL_CONFIG.reloadDelay,
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


/*自动监听编译模板*/
gulp.task('autoCompile', function() {
    return watch.autoCompile();
});

/* 命令编译模板 */
gulp.task('compile', function() {
    var app = argv.m || 'all';
    return manual.compile(app);
});

/* 命令运行测试 */
gulp.task('test', function() {
    var app = argv.m || 'all';
    return manual.test(app);
});



/* 上传至ftp */
gulp.task('upload', function () {
    var dir = argv.dir || 'src',
        _src;
    if(dir === 'src'){
        _src = src+'/';
        remotePath = SFTP_CONFIG.srcRemotePath;
    }else if(dir === 'dist'){
        _src = dist+'/';
        remotePath = SFTP_CONFIG.distRemotePath;
    }
    return gulp.src( _src + '/**' )
        .pipe(sftp({
            host: SFTP_CONFIG.host,
            user: SFTP_CONFIG.user,
            port: SFTP_CONFIG.port,
            pass: SFTP_CONFIG.pass,
            remotePath: remotePath
        }));
});

/* build命令 */
gulp.task('build', function() {
    var app = argv.m || 'all',
        parts = APPS_CONFIG.getApp(app);
    for (var key in parts) { //转为线性执行
        (function(key) {
            console.log('');
            console.log('┌-------------------构建“' + parts[key] + '”模块 | 开始------------------------┐');
            console.log('');
            var appItem = parts[key];
            gulp.task('delDir', function() {
                console.log(' 删除 “' + './' + distHtmlPrev + '/' + appItem, '和 ./' + distStaticAppsPrev + '/' + appItem + '” 结束');
                return gulp.src(['./' + distHtmlPrev + '/' + appItem, './' + distStaticAppsPrev + '/' + appItem]).pipe(clean());
            });
            gulp.task(appItem + '_mini_html', function() {
                return mini.html(appItem);
            });
            gulp.task(appItem + '_mini_css', function() {
                return mini.css(appItem);
            });
            gulp.task(appItem + '_mini_js', function() {
                return mini.js(appItem);
            });
            gulp.task(appItem + '_html', function() {
                return build.html(appItem);
            });
            gulp.task(appItem + '_static', function() {
                return build.static(appItem);
            });
            gulp.task(appItem + '_module', function(cb) {
                if (conf.mini) { //构建生产压缩版本
                    runSequence(
                        'delDir', appItem + '_mini_html', appItem + '_res', appItem + '_mini_css', appItem + '_mini_js', cb
                    );
                } else { //构建生产版本
                    runSequence(
                        'delDir', appItem + '_html', appItem + '_static', cb
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
            .pipe(gulpif('*.js' && conf.jshint, useJshint())) //根据dist.jshint配置开启关闭JS检查
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
        var app = arguments[0],
            _src = srcHtmlPrev + '/' + app + '/**/' + TOOL_CONFIG.html,
            _dist = distHtmlPrev + '/' + app;
        var combined = combiner.obj([
            gulp.src(_src),
            cheerio(function($, file) { //进入.html文件
                var filePath = file.path, //获取的当前文档物理路径
                    linkDom = $('link'),
                    scriptDom = $('script'),
                    imgDom = $('img');
                //插入构建时间
                $('body').eq(0).before(TOOL_CONFIG.buildInfo);
                //修改CSS路径
                $('link').each(function(index, el) {
                    var $el = $(this),
                        href = $el.attr('href'),
                        rel = $el.attr('rel');
                    if (href) {
                        if (/icon/ig.test(rel) || rel === 'stylesheet') {
                            $el.attr('href', THIS_PATH.changePath(href, filePath));
                        }
                    }
                });
                //修改js路径
                $('script').each(function(index, el) {
                    var $el = $(this),
                        href = $el.attr('src');
                    if (href) {
                        $el.attr('src', THIS_PATH.changePath(href, filePath));
                    }
                });
                //修改img路径
                $('img').each(function(index, el) {
                    var $el = $(this),
                        href = $el.attr('src');
                    if (href) {
                        $el.attr('src', THIS_PATH.changePath(href, filePath));
                    }
                    //修改以"data-*"标签的图片
                    for(var key in TOOL_CONFIG.img){
                        (function(key) {
                            var dataImg = $el.data(TOOL_CONFIG.img[key]);
                            if (dataImg !== undefined && dataImg !== '') {
                                $el.attr('data-' + TOOL_CONFIG.img[key], THIS_PATH.changePath(dataImg, filePath))
                            }
                        })(key);
                    }
                });
                //修改在html中以style方式写入的背景图片，节点需要加入“background-image”
                $(TOOL_CONFIG.backgroundImg).each(function(index, el) {
                    var $el = $(this),
                        imgHref = $el.css('background-image'),
                        arr = ["url(",")","/'/g"];
                    for(var j = 0; j < 3; j++){ //格式化
                        imgHref = href.replace(arr[j],'');
                    }
                    $el.css('background-image', "url(" + THIS_PATH.changePath(imgHref, filePath) + ")");
                });

                /*
                //修改CSS路径
                for(var i = 0, l = linkDom.length; i < l; i++){
                    var item = linkDom.eq(i),
                        href = item.attr('href'),
                        rel = item.attr('rel');
                    if (href && (/icon/ig.test(rel) || rel === 'stylesheet')) {
                        item.attr('href', THIS_PATH.changePath(href, filePath));
                    }
                };
                //修改js路径
                for(var i = 0, l = scriptDom.length; i < l; i++){
                    var item = scriptDom.eq(i),
                        href = item.attr('src');
                    if (href) {
                        item.attr('src', THIS_PATH.changePath(href, filePath));
                    }
                };
                //修改img路径
                for(var i = 0, l = imgDom.length; i < l; i++){
                    var item = imgDom.eq(i),
                        href = item.attr('src');
                    if (href) {
                        item.attr('src', THIS_PATH.changePath(href, filePath));
                    }
                    //修改以"data-*"标签的图片
                    for(var key in TOOL_CONFIG.img){
                        (function(key) {
                            var dataImg = $el.data(TOOL_CONFIG.img[key]);
                            if (dataImg !== undefined && dataImg !== '') {
                                $el.attr('data-' + TOOL_CONFIG.img[key], THIS_PATH.changePath(dataImg, filePath))
                            }
                        })(key);
                    }
                };
                //修改在html中以style方式写入的背景图片，节点需要加入“background-image”
                for(var i = 0, l = backgroundImgDom.length; i < l; i++){
                    var item = backgroundImgDom.eq(i),
                        href = item.css('background-image'),
                        arr = ["url(",")","/'/g"];
                    for(var j = 0; j < 3; j++){ //格式化
                        href = href.replace(arr[j],'');
                    }
                    item.css('background-image', "url(" + THIS_PATH.changePath(imgHref, filePath) + ")");
                };*/


            }),
            gulp.dest(_dist)
        ]);
        combined.on('error', console.error.bind(console));
        return combined;
    },
    //构建资源
    static: function() {
        var res = TOOL_CONFIG.res, //config-tool.js配置
            app = arguments[0],
            staticA = srcStaticPrev + '/' + srcStaticAppsPrev + '/' + app, //static下的资源
            staticB = srcHtmlPrev + '/' + app, //业务模块下的资源
            arr = [staticA, staticB];
        for (var key in arr) {
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
                            .pipe(gulp.dest(distStaticPrev + '/' + conf.appDir + '/' + app + '/'));
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
        var staticDomain = APPS_CONFIG.hasDistStaticDomain() ? '/' + conf.distStaticDomain : conf.distStaticDir;
        var key = arguments[0],
            _dist = distHtmlPrev + '/' + key,
            _src = srcHtmlPrev + '/' + key;
        var combined = combiner.obj([
            gulp.src(_src + '/' + TOOL_CONFIG.html),
            cheerio(function($, file) { //进入html文件
                var pageRoot = file.path, //获取html路径
                    pageName = THIS_PATH.name(pageRoot);
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
                        console.log('"' + THIS_PATH.name(pageRoot) + '"中"' + src + '"为绝对路径引用，请改为相对路径！')
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
                        path = THIS_PATH.modDir(pageRoot);
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
                suffix = THIS_PATH.suffix(paths);
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
                        spriteSheet: distStaticPrev + '/' + conf.appDir + '/' + key + '/' + THIS_PATH.modDir(paths) + '/' + imgDir + '/min/sprite_' + timestamp + '.png',
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
                if (src.jsdoc) {
                    delete[docName, docInclude, docExclude, docOutDir];
                    JSDOC_CONFIG.templates.systemName = THIS_PATH.newSrc(_src) + "-说明文档";
                    JSDOC_CONFIG.opts.destination = "./" + TOOL_CONFIG.docsDir + "/" + THIS_PATH.modDir(_src) + "/" + THIS_PATH.name(_src);
                    del(['./' + TOOL_CONFIG.docsDir + '/' + THIS_PATH.modDir(_src) + '/' + THIS_PATH.name(_src)]);
                };
                gulp.src(_src)
                    .pipe(gulpif(src.jshint, useJshint()))
                    .pipe(gulpif(src.jsdoc, jsdoc(JSDOC_CONFIG)));
            } else {
                return false;
            }

        });
    },
    //自动监听编译模板 (2016-9-9 16:05测试通过)
    autoCompile: function() {
        var x = TOOL_CONFIG.compile;
        for (var k in x) {
            gulp.watch(src.dir + '/**/' + x[k].path, function(event) {
                var _src = event.path,
                    fileMod = THIS_PATH.modDir(_src),
                    fileName = THIS_PATH.name(_src),
                    suffix = THIS_PATH.suffix(_src),
                    tool = eval('TOOL_CONFIG.compile.' + suffix + '.tool'),
                    dest = src.dir + '/' + fileMod;
                console.log('');
                console.log('---自动编译 | 开始---------------------------------------------');
                console.log('');
                if (fileName[0] === '_') {
                    _src = THIS_PATH.dir(_src) + '!(_)*.' + suffix;
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
    //手动命令编译模板(2016-6-21 11:26测试通过)
    compile: function() {
        var mod = arguments[0],
            x = TOOL_CONFIG.compile,
            parts = [];
        parts = APPS_CONFIG.getApp(mod);
        for (var key in parts) {
            (function(key) {
                for (var k in x) {
                    (function(k) {
                        var _src = x[k].path,
                            fileName = THIS_PATH.name(_src),
                            suffix = THIS_PATH.suffix(_src),
                            tool = eval('TOOL_CONFIG.compile.' + suffix + '.tool');
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
            x = TOOL_CONFIG.compile,
            parts = [];
        parts = APPS_CONFIG.getApp(mod);
        for (var key in parts) {
            (function(key) {
                gulp.src('test/' + parts[key] + '/**/*.js', { read: false })
                    .pipe(mocha({ reporter: 'nyan' }))
                    .on('error', gutil.log);
            })(key);
        }
    }
}
