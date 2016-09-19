var path = require('path'),
    config = require('./config.js'); //自定义配置
var csrc = config.src(),
    dist = config.dist(),
    fileAttr = function() {};
fileAttr.prototype.get = function() {
    var src = arguments[0],
        arg = arguments[1],
        compile = csrc.compile,
        modDir,
        srcArr,
        allName,
        nameArr,
        fileDir,
        realName;

    /*获取有效src*/
    src = src.replace(/\\/g, "/"); //4行替换不可变、不可合并
    src = fileDir = src.replace(csrc.root, "");
    src = src.replace(csrc.dir + '/', "");
    //src = src.replace(csrc.htmlDir + '/', "");
    //
    srcArr = src.split('/'); //[ 'www', 'tpl', 'demo.jade' ]
    allName = srcArr[srcArr.length - 1].toString(); // demo.jade
    nameArr = allName.split('.'); //切割demo.jade
    realName = allName.replace('.'+nameArr[nameArr.length - 1],''); //demo,不能用nameArr[0]
    /* 获取src中模块结构 */
    for (var key in compile) {
        var cPath = compile[key].path,
            cPathArr = [],
            cdir;
        cPathArr = cPath.split('/');
        cdir = cPathArr[0];
        if (src.indexOf('/'+ cdir +'/') > -1) {
            modDir = src.substring(0, src.indexOf('/'+ cdir +'/'));
        } else {
            modDir = src.replace(allName, '');
        }
    }

    /*根据条件返回结果*/
    if (arg === 'srcArr') return srcArr;
    if (arg === 'name') return realName;
    if (arg === 'suffix') return nameArr[nameArr.length - 1].toString();
    if (arg === 'dir') return fileDir.replace(allName,'');
    if (arg === 'modDir') return modDir;
    if (arg === 'newSrc') return fileDir;
};
fileAttr.prototype.newSrc = function(){
	var src = arguments[0],
		that = this;
	return that.get(src,'newSrc');
};
//获取文件名称
fileAttr.prototype.name = function() {
    var src = arguments[0],
        that = this;
    return that.get(src, 'name');
};
//获取文件格式后缀
fileAttr.prototype.suffix = function() {
    var src = arguments[0],
        that = this;
    return that.get(src, 'suffix');
};
//获取文件所在目录
fileAttr.prototype.dir = function() {
    var src = arguments[0],
        that = this;
    return that.get(src, 'dir');
};
//获取文件所在的模块
fileAttr.prototype.modDir = function() {
    var src = arguments[0],
        that = this;
    return that.get(src, 'modDir');
};
//针对dist版，修改文件引用路径
fileAttr.prototype.changePath = function() {
    var src = arguments[0],
    	pageRoot = arguments[1],
        dsd = dist.staticDomain,
        that = this;
    function hasStaticDomain(){
        if (dsd === '' || dsd === undefined || dsd === null) {
            return false;
        }else{
            return true;
        }
    }

    /**
     * 引用域或cdn的资源
     * 如"http://localhost/jquery/3.0.0/jquery.js" 
     * 如"http://localhost:8080/jquery/3.0.0/jquery.js" 
     * 如"//cdn.bootcss.com/jquery/3.0.0/jquery.js"
     */
    if (src.substring(0, 4) === 'http' || src.substring(0, 2) === '//') {
        if(hasStaticDomain && src.indexOf("localhost") !== -1 && src.indexOf(dsd) === -1){
            //使用了localhost域，但与dist域的端口不一致，有可能是src资源域。
            var port = dsd.substring(dsd.indexOf('t:')+2,dsd.length+1);
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
     * 如"/static/path/to/file/demo.js" 
     * 如"../../../static/path/to/file/demo.js"
     */
    else if (src.indexOf(csrc.staticDir) !== -1) {
        dsd = hasStaticDomain ? dsd : '';
        var sd = csrc.staticDir,
            sdl = sd.length;
        src = src.substring(src.indexOf(csrc.staticDir) + sdl, src.length+1);
        return dsd + src;
    }
    /**
     * 引用的本地位置为模块自身资源目录
     * 如"./js/demo.js"
     * 如"js/demo.js"
     */
    else { 
        dsd = hasStaticDomain ? dsd : '/'+ csrc.staticDir;
        src = src.substring(0,2) === './' ? src.substring(2, src.length + 1) : src ;
        var thisMod = that.modDir(pageRoot);
            thisMod = thisMod.replace(csrc.htmlDir+'/','');
        return dsd + '/apps/' + thisMod + src;
    }
    
}
module.exports = new fileAttr();
