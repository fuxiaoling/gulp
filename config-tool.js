/**
 * 工具配置
 */
var path = require('path'),
	config = {
		root: 'E:/gitwww/demo/gulp/', //工具所在物理路径
		docsDir: 'docs', // JS自动输出文档后存放的目录，相对根目录
		reloadDelay: 300, //browserSync浏览器自动刷新延时
		buildInfo: "<!-- build time :" + new Date().toLocaleString()+" -->", //构建文件的标识，存放于html文档中

		/*
			静态页面
		*/
		html: '**/*.html', //HTML下html文件路径后部分

		/*
			data-X 图片data属性命名
		*/
		img:[
			'thumb', // 缩略图 data-thumb
			'original', // 懒加载图 data-original
			'pic', 
			'img',
			'images'
		],

		/*
			以style方式写入的背景图片的class名
		*/
		backgroundImg: '.background-images',

		/*
			资源目录设置
		*/
		res:{
			js: 'js/*.{js,coffee,jsx}', //HTML下JS文件夹及文件
			css: 'css/*.{css,less,sass,styl,htc}', //HTML下CSS文件夹及文件
			img: 'img/*.{jpg,jpeg,png,gif,ico}', //HTML下img文件夹及文件
			font: 'font/*.{eot,svg,ttf,woff}' //HTML下font路径及后缀
		},
		/*
			需编译的项
		 */
		compile: {
			coffee: { //与下方path中的文件后缀保持一致，例如这里必须为“*.coffee”
				path: 'coffee/**/*.coffee',//文件路径，文件后缀和上级节点名保持一致
				tool: 'coffee({bare: true})'//所使用编译器的配置，配置后需在gulpfile.js文件中引入该编译器，注意编译器名保持一致
			},
			jsx: { 
				path: 'jsx/**/*.jsx',
				tool: 'babel({presets:["react","es2015","stage-0"]})'
			},
			less: {
				path: 'less/**/*.less',
				tool: 'less()'
			},
			scss: {
				path: 'scss/**/*.scss',
				tool: 'sass().on("error", sass.logError)'
			},
			sass: {
				path: 'sass/**/*.sass',
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
	};
module.exports = config;