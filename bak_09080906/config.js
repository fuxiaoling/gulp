var path = require('path'),
	newDate = new Date(),
	conf = {
		appDir: 'apps', // 业务模块业务脚本存放文件夹。
		mini:true, //构建时是否生成mini
		moduleCombo:'amd', //mini设为true时，配置有效。可选amd/cmd/webpack,小写
		reloadDelay: 300, //browserSync浏览器自动刷新延时
		title: "latest:" + newDate.toLocaleString() + "-", //构建文件的title标示
		lazyload: "data-original" //图片懒加载使用的data属性名
	},
	src = {
		dir: 'src', //开发版本目录
		htmlDir: 'html', //src下HTML文件目录
		staticDir: 'static', //src下公共资源目录
		modules: ['o2o','jsdoc-demo','compile-demo'], //项目模块系统
		root: 'E:/gitwww/demo/cmd/', //本地分支物理路径
		domain: 'http://localhost:8860', //本地server
		port: '8861', //gulp代理server端口
		jshint:false, //监听保存时是否对JS进行检查
		jsdoc:true, //监听保存时是否对JS进行输出文档
		/*静态页面*/
		html: '**/*.html', //HTML下html文件路径后部分，*号为通配

		/*主要资源*/
		res:{
			js: 'js/*.{js,coffee,jsx}', //HTML下JS文件夹及文件
			css: 'css/*.{css,less,sass,styl,htc}', //HTML下CSS文件夹及文件
			img: 'img/*.{jpg,jpeg,png,gif,ico}', //HTML下img文件夹及文件
			font: 'font/*.{eot,svg,ttf,woff}' //HTML下font路径及后缀
		},

		/*需编译的资源*/
		compile: {
			coffee: { //与path文件后缀保持一致，如“*.coffee”
				path: 'coffee/**/*.coffee',//文件路径
				tool: 'coffee({bare: true})'//所需编译器及配置
			},
			jsx: { 
				path: 'jsx/**/*.jsx',
				tool: 'babel({presets:["react","es2015","stage-0"]})'
			},
			less: {
				path: 'less/**/*.less',
				tool: 'less()'
			},
			sass: {
				path: 'sass/**/*.sass',
				tool: 'sass().on("error", sass.logError)'
			},
			scss: {
				path: 'sass/**/*.scss',
				tool: 'sass().on("error", sass.logError)'
			},
			styl: {
				path: 'styl/**/*.styl',
				tool: 'stylus()'
			},
			jade: {
				path: 'tpl/**/*.jade',
				tool: 'jade({pretty: true})'
			}
		}
	},
	dist = {
		dir: 'dist', //生产版本目录
		htmlDir: 'html', //HTML文件路径前部分
		staticDir: 'static', //静态资源文件路径前部分
		domain: 'http://localhost:8870', //生产版本server
		staticDomain: 'http://localhost:8871', //生产版本静态资源server
		port: '7700', //gulp代理server端口
		jshint:false //build时是否对JS进行检查
	}
var config = function() {};

config.prototype.conf = function() {
	return conf;
};
config.prototype.src = function() {
	return src;
};
config.prototype.srcHtmlPrev = function() {
	return src.dir + '/' + src.htmlDir;
};
config.prototype.srcStaticPrev = function() {
	return src.dir + '/' + src.staticDir;
};
config.prototype.dist = function() {
	return dist;
};
config.prototype.distHtmlPrev = function() {
	return dist.dir + '/' + dist.htmlDir;
};
config.prototype.distStaticPrev = function() {
	return dist.dir + '/' + dist.staticDir;
};
module.exports = new config();