var path = require('path'),
    toolConfig = require('./config-tool.js'), // 工具配置
    appsConfig = require('./config-apps.js'), // 应用配置
    COMPILE = toolConfig.compile, // 获取工具配置的设置的所有需编译项
    ROOT = toolConfig.root, // 获取本工具所在物理路径
    SRCDIR = appsConfig.conf().srcDir, // 获取应用配置中的开发版本目录名
    SRCHTMLDIR = appsConfig.conf().srcHtmlDir, 
    SRC_STATIC_DIR = appsConfig.conf().srcStaticDir, // 获取应用配置中的开发版本static目录名
    DIST_STATIC_DIR = appsConfig.conf().distStaticDir, // 获取应用配置中的开发版本static目录名
    DIST_STATIC_DOMAIN = appsConfig.conf().distStaticDomain, // 获取应用配置中的开发版本static使用域名
    HAS_DIST_STATIC_DOMAIN = appsConfig.hasDistStaticDomain(); //获取应用配置中生产版本否存在static域名

var fileAttr = function(){};
fileAttr.prototype.get = function() {
    var src = arguments[0], // 获取文件完成物理路径
        arg = arguments[1], // 获取文件转换所需类型
        srcArr,
        allName,
        nameArr,
        fileDir;
    src = src.replace(/\\/g, "/"); // 替换目录符"\"成"/" 结果如：E:/gitwww/demo/gulp/src/html/app1/js/jsx/index.jsx
    src = fileDir = src.replace(ROOT, ""); // 先替换物理路径目录 结果如：/src/html/app1/js/jsx/index.jsx
    src = src.replace(SRCDIR + '/', ""); // 替换src目录 结果如：/html/app1/js/jsx/index.jsx
    srcArr = src.split('/'); // 切割成数组 结果如：[ 'html', 'app1', 'js', 'jsx', 'index.jsx' ]
    allName = srcArr[srcArr.length - 1].toString(); // 获取带后缀文件名 结果如：index.jsx
    nameArr = allName.split('.'); //切割index.jsx 结果如：[ 'index', 'jsx' ]
    var result;
    switch(arg){
        case 'fileSrcArr':
            result = srcArr; // 获取文件路径数组 如：[ 'html', 'app1', 'js', 'jsx', 'index.jsx' ]
            break;
        case 'fileName':
            result = allName.replace('.'+nameArr[nameArr.length - 1],''); // 获取文件名 如：index
            break;
        case 'fileSuffix':
            result = nameArr[nameArr.length - 1].toString(); // 获取文件后缀 如：jsx/js/css
            break;
        case 'fileNewSrc':
            result = fileDir; // 获取文件完成路径 如： 如：src/html/app1/js/jsx/index.jsx
            break;
        case 'fileDir':
            result = fileDir.replace(allName,''); // 获取文件所在路径 如：src/html/app1/js/jsx/
            break;
        case 'fileModDir': // 获取文件路径中的项目信息
            var flog = false,
                cdir;
            for (var key in COMPILE) { // 提取编译目录为截取右边界
                var cPath = COMPILE[key].path,
                    cPathArr = cPath.split('/'); // 获取编译目录名
                if (src.indexOf('/'+ cPathArr[0] +'/') !== -1) {
                    cdir = cPathArr[0];
                    flog = true;
                    break;
                }
            }
            result = flog ? src.substring(0, src.indexOf('/'+ cdir +'/')) : src.replace(allName, ''); 
            // ↑ 如果编译名存在，则以编译目录名作为右边界，截取当前文件对象的目录结构作抛出。
            // 如：src为“/html/app1/js/jsx/index.jsx”，遍历到"jsx"的编译目录后，抛出“/html/apps1/js/”
            // 注：左边界没有截取，还是包含“/html/”本处抛出到gulpfile有多种用途
            break;
        default:
            console.log("获取文件属性时发生错误，请检查文件路径是否正确！");
            return false;
    }
    return result;
};
/**
 * 获取文件路径（去除根目录）
 * E:/gitwww/demo/gulp/src/html/app1/js/jsx/index.jsx  ===>  src/html/app1/js/jsx/index.jsx
 * E:/gitwww/demo/gulp/src/html/app1/js/index.js  ===>  src/html/app1/js/index.js
 */
fileAttr.prototype.newSrc = function(){
	var src = arguments[0],
		that = this;
	return that.get(src,'fileNewSrc'); 
};
/**
 * 获取文件名
 * E:/gitwww/demo/gulp/src/html/app1/js/jsx/index.jsx  ===>  index
 * E:/gitwww/demo/gulp/src/html/app1/js/index.min.js  ===>  index.min
 */
fileAttr.prototype.name = function() {
    var src = arguments[0],
        that = this;
    return that.get(src, 'fileName');
};
/**
 * 获取文件格式后缀
 * E:/gitwww/demo/gulp/src/html/app1/js/jsx/index.jsx  ===>  jsx
 * E:/gitwww/demo/gulp/src/html/app1/js/index.js  ===>  js
 */
fileAttr.prototype.suffix = function() {
    var src = arguments[0],
        that = this;
    return that.get(src, 'fileSuffix');
};
/**
 * 获取文件所在目录
 * E:/gitwww/demo/gulp/src/html/app1/js/jsx/index.jsx  ===>  src/html/app1/js/jsx/
 * E:/gitwww/demo/gulp/src/html/app1/js/index.js  ===>  src/html/app1/js/
 */
fileAttr.prototype.dir = function() {
    var src = arguments[0],
        that = this;
    return that.get(src, 'fileDir');
};
/**
 * 获取文件所在的模块
 * E:/gitwww/demo/gulp/src/html/app1/js/jsx/index.jsx  ===>  html/app1/js/
 * E:/gitwww/demo/gulp/src/html/app1/js/index.js  ===>  html/app1/js/
 */
fileAttr.prototype.modDir = function() {
    var src = arguments[0],
        that = this;
    return that.get(src, 'fileModDir');
};

//针对dist版，修改文件引用路径
fileAttr.prototype.changePath = function() {
    var that = this;
        src = arguments[0], // 引用资源的URL
    	pageRoot = arguments[1]; //当前页面的路径
    /**
     * 引用域或cdn的资源
     * 
     * config-apps.js设置distStaticDomain域名为"http://localhost:8871"时，如下：
     * 
     * http://localhost/jquery/3.0.0/jquery.js => http://localhost:8871/jquery/3.0.0/jquery.js
     * http://localhost:8080/jquery/3.0.0/jquery.js => http://localhost:8871/jquery/3.0.0/jquery.js
     * //cdn.bootcss.com/jquery/3.0.0/jquery.js => //cdn.bootcss.com/jquery/3.0.0/jquery.js
     * 
     * 未设置域名时：
     * 
     * http://localhost/jquery/3.0.0/jquery.js => http://localhost/jquery/3.0.0/jquery.js
     * http://localhost:8080/jquery/3.0.0/jquery.js => http://localhost:8080/jquery/3.0.0/jquery.js
     * //cdn.bootcss.com/jquery/3.0.0/jquery.js => //cdn.bootcss.com/jquery/3.0.0/jquery.js
     */
    if (src.substring(0, 4) === 'http' || src.substring(0, 2) === '//') {
        if(HAS_DIST_STATIC_DOMAIN && src.indexOf("localhost") !== -1 && src.indexOf(DIST_STATIC_DOMAIN) === -1){
            //使用了localhost域，但与dist域的端口不一致，有可能是src资源域。
            var port = DIST_STATIC_DOMAIN.substring(DIST_STATIC_DOMAIN.indexOf('t:')+2,DIST_STATIC_DOMAIN.length+1);
            //存在端口号
            if(src.indexOf('t:') !== -1){ 
                var a = src.substring(src.indexOf("//")+2,src.length+1);
                var b = [];
                b = a.split('/');
                b[0] = "localhost:"+port;
                a = b.join('/');
                src = "http://"+a;
            }
            //不存在端口号
            else{
                src = src.replace("localhost","localhost:"+port);
            }
        }
        return src; 
    }
    /**
     * 引用本地的位置为公共资源目录
     * 
     * config-apps.js设置distStaticDomain域名为"http://localhost:8871"时，如下：
     * 
     * /static/path/to/file/demo.js => http://localhost:8871/path/to/file/demo.js
     * ../../../static/path/to/file/demo.js => http://localhost:8871/path/to/file/demo.js
     *
     * 未设置域名时：
     * 
     * /static/path/to/file/demo.js => /static/path/to/file/demo.js
     * ../../../static/path/to/file/demo.js => /static/path/to/file/demo.js
     */
    else if (src.indexOf(SRC_STATIC_DIR) !== -1) {
        DIST_STATIC_DOMAIN = HAS_DIST_STATIC_DOMAIN ? DIST_STATIC_DOMAIN : '/'+ DIST_STATIC_DIR;
        src = src.substring(src.indexOf(SRC_STATIC_DIR) + SRC_STATIC_DIR.length, src.length+1);
        return DIST_STATIC_DOMAIN + src;
    }
    /**
     * 引用的本地位置为模块自身资源目录
     * 
     * config-apps.js设置distStaticDomain域名为"http://localhost:8871"时，如下：
     * 
     * ./js/demo.js => http://localhost:8871/apps/app1/js/demo.js
     * js/demo.js => http://localhost:8871/apps/app1/js/demo.js
     *
     * 未设置域名时：
     * 
     * ./js/demo.js => /static/apps/app1/js/demo.js
     * js/demo.js => /static/apps/app1/js/demo.js
     */
    else { 
        DIST_STATIC_DOMAIN = HAS_DIST_STATIC_DOMAIN ? DIST_STATIC_DOMAIN : '/'+ DIST_STATIC_DIR;
        src = src.substring(0,2) === './' ? src.substring(2, src.length + 1) : src ;
        var thisMod = that.modDir(pageRoot);
            thisMod = thisMod.replace(SRCHTMLDIR+'/','');
        return DIST_STATIC_DOMAIN + '/apps/' + thisMod + src;
    }
    
}
/*console.log(fileAttr.prototype.newSrc('E:/gitwww/demo/gulp/src/html/app1/js/index.min.js'));
console.log('changePath:http://localhost/jquery/3.0.0/jquery.js => '+ fileAttr.prototype.changePath('http://localhost/jquery/3.0.0/jquery.js','E:/gitwww/demo/gulp/src/html/app1/index.html'));
console.log('changePath:http://localhost:8080/jquery/3.0.0/jquery.js => '+ fileAttr.prototype.changePath('http://localhost:8080/jquery/3.0.0/jquery.js','E:/gitwww/demo/gulp/src/html/app1/index.html'));
console.log('changePath://cdn.bootcss.com/jquery/3.0.0/jquery.js => '+ fileAttr.prototype.changePath('//cdn.bootcss.com/jquery/3.0.0/jquery.js','E:/gitwww/demo/gulp/src/html/app1/index.html'));
console.log('changePath:/static/path/to/file/demo.js => '+ fileAttr.prototype.changePath('/static/path/to/file/demo.js','E:/gitwww/demo/gulp/src/html/app1/index.html'));
console.log('changePath:../../../static/path/to/file/demo.js => '+ fileAttr.prototype.changePath('../../../static/path/to/file/demo.js','E:/gitwww/demo/gulp/src/html/app1/index.html'));
console.log('changePath:./js/demo.js => '+ fileAttr.prototype.changePath('./js/demo.js','E:/gitwww/demo/gulp/src/html/app1/index.html'));
console.log('changePath:js/demo.js => '+ fileAttr.prototype.changePath('js/demo.js','E:/gitwww/demo/gulp/src/html/app1/index.html'));*/
module.exports = new fileAttr();
