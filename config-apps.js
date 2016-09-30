/**
 * 应用配置
 */
var path = require('path'),
	config = {
		/*
			apps应用名
		 */
		appsItem: [
			'amd-requireJs-demo',
			'cmd-seaJs-demo',
			'gulp-compile-demo',
			'javascript-optimization-tips-demo',
			'react-demo'
		], 
		/*
			开发版本设置
		 */
		srcDir: 'src', // 开发目录
		srcHtmlDir: 'html', // HTML根目录，下级为apps的html目录
		srcStaticDir: 'static', // 资源根目录，下级为apps的资源目录夹、assents资源目录夹、libs资源目录夹
		srcStaticAppsDir: 'apps', // apps的资源目录，下级为具体应用的资源目录。"static/apps/app1..."
		srcDomain: 'http://localhost:8860', // 本地服务，如nginx、apache、iis等
		srcPort: '8861', // 工具代理服务，域为“localhost”，端口为本端口
		/*
			生产版本设置
		 */
		distDir: 'dist', // 生产目录
		distHtmlDir: 'html', // HTML根目录，下级为apps的html目录
		distStaticDir: 'static', // 资源根目录，下级为apps的资源目录夹、assents资源目录夹、libs资源目录夹
		distStaticAppsDir: 'apps', // apps的资源目录，下级为具体应用的资源目录。"static/apps/app1..."
		distDomain: 'http://localhost:8870', // 本地服务，如nginx、apache、iis等
		distStaticDomain: 'http://localhost:8871', // 本地服务，如nginx、apache、iis等
		distPort: '7700', // 工具代理服务，域为“localhost”，端口为本端口
		/*
			开发时是否执行
		 */
		jshint:false, //检查JS
		jsdoc:true, //JS输出文档
	};

var appsConfig = function() {};
appsConfig.prototype.conf = function() {
	return config;
};
appsConfig.prototype.srcDir = function() {
	return config.srcDir;
};
appsConfig.prototype.srcHtmlPrev = function() {
	return config.srcDir + '/' + config.srcHtmlDir;
};
appsConfig.prototype.srcStaticPrev = function() {
	return this.srcHtmlPrev + '/' + config.srcStaticDir;
};
appsConfig.prototype.srcStaticAppsPrev = function() {
	return this.srcStaticPrev + '/' + config.srcStaticAppsDir;
};
appsConfig.prototype.distDir = function() {
	return config.distDir;
};
appsConfig.prototype.distHtmlPrev = function() {
	return config.distDir + '/' + config.distHtmlDir;
};
appsConfig.prototype.distStaticPrev = function() {
	return this.distHtmlPrev + '/' + config.distStaticDir;
};
appsConfig.prototype.distStaticAppsPrev = function() {
	return this.distStaticPrev + '/' + config.distStaticAppsDir;
};
/**
 * 获取应用数组，用于构建的目录对象
 * @param  {String} mod build命令中输入的app名
 * @return {Array}     输出模块中的app名或者所有app
 */
appsConfig.prototype.getApp = function(app){
    var realApp,
        appsItem = config.appsItem; //获取配置的appsItem
    if (app.indexOf('/') !== -1) { //如果命令中输入的app名有下级目录
        var arr = app.split('/'); 
        realApp = arr[0]; //切割获得app应用名
        if (appsItem.indexOf(realApp) === -1) realApp = 'all'; //如果获得的应用名不存在，则返回“all”即所有app应用名
    }
    return realApp === 'all' ? appsItem : [realApp]; //如果为“all”，返回配置的appsItem中所有的app应用名；否则按照具有上下级关系的命令输出；
};
/**
 * 判断生产版本是否已经设置资源域
 * @return {boolean}     输出模块中的app名或者所有app
 */
appsConfig.prototype.hasDistStaticDomain = function(){
    var domain = config.distStaticDomain;
    return domain === '' || domain === undefined || domain === null ? false : true;
},
module.exports = new appsConfig();