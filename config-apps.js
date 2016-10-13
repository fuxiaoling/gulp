/**
 * 应用配置
 */
var path = require('path'),
	config = {
		/*
			项目名/apps应用名,在config.srcHtmlDir下应该存在对应的目录，同时，在config.srcStaticAppsDir下也应该存在对应的目录
		 */
		appsItem: [
			'amd-requireJs-demo',
			'cmd-seaJs-demo',
			'gulp-compile-demo',
			'javascript-optimization-tips-demo',
			'react-demo'
		], 
		/*
			开发版本设置 注：手动创建目录后填写下方目录相关配置
		 */
		srcDir: 'src', // 开发目录，
		srcHtmlDir: 'html', // 开发目录下的HTML根目录，下级为各个项目的html目录
		srcStaticDir: 'static', // 开发目录下的资源根目录，下级为各个项目的资源目录夹、assents资源目录夹、libs资源目录夹
		srcStaticAppsDir: 'apps', // apps的资源目录，下级为具体应用的资源目录。如："static/apps/app1..."
		srcDomain: 'http://localhost:8860', // 本地web服务，如nginx、apache、IIS等
		srcPort: '8861', // 开发目录的web代理服务，域为“localhost”，端口为本端口。即："http://localhost:8860" => "http://localhost:8861"
		/*
			生产版本设置 注：填写下方目录相关配置后使用命令自动生成配置的目录
		 */
		distDir: 'dist', // 生产目录
		distHtmlDir: 'html', // 生产目录下的HTML根目录，下级为各个项目的html目录
		distStaticDir: 'static', // 生产目录下的资源根目录，下级为各个项目的资源目录夹、assents资源目录夹、libs资源目录夹
		distStaticAppsDir: 'apps', // apps的资源目录，下级为具体应用的资源目录。如："static/apps/app1..."
		distDomain: 'http://localhost:8870', // 生产目录的本地web服务，如nginx、apache、IIS等
		distStaticDomain: 'http://localhost:8871', // 生产目录的本地资源服务，这里设置是为了构建时将html文档中的资源路径直接替换成资源域服务http://localhost:8871
		distPort: '8872', // 生产目录的web代理服务，域为“localhost”，端口为本端口。即："http://localhost:8870" => "http://localhost:8872"
		/*
			开发时是否执行
		 */
		jshint:false, //检查JS
		jsdoc:true //JS输出文档
	};

var appsConfig = function() {};
appsConfig.prototype.conf = function() {
	return config;
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
 * @return {boolean}     
 */
appsConfig.prototype.hasDistStaticDomain = function(){
    var domain = config.distStaticDomain;
    return domain === '' || domain === undefined || domain === null ? false : true;
},
module.exports = new appsConfig();