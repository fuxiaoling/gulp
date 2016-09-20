
console.log(assetsUrl);
console.log(libsUrl);
console.log(systemUrl);
var newAlias = {
	mAlias : {	
		"respond": 'gallery/respond/1.4.2/respond',//,用于为 IE6-8 以及其它不支持 CSS3 Media Queries 的浏览器提供媒体查询
		'es5-safe': 'gallery/es5-safe/0.9.2/es5-safe',
		'json': 'gallery/json/1.0.3/json',//别名json2,用于json的序列化和反序列化：JSON.stringify(jsonObj);JSON.parse(jsonString);
		"$": 'jquery/jquery/1.7.2/jquery-CMD',//别名CMD规范的Jquery
		"jquery": 'jquery/jquery/1.7.2/jquery-CMD',//别名CMD规范的Jquery
		"util": assetsUrl +'m/util',
		"Arr": assetsUrl +'m/Arr',//数组工具类
		"Calc": assetsUrl +'m/Calc',//计算工具类
		"date": assetsUrl +'m/date',//日期工具类
		"Ajax": assetsUrl +'m/ajax', 
		"alert": assetsUrl + 'm/alert', 
		"slide": assetsUrl + 'm/slide', 
		"getCookiePro": assetsUrl + 'm/getCookiePro',
		"numberChange": assetsUrl + 'm/numberChange',
		"sidebar": assetsUrl + 'm/sidebar', 
		"lazyload": assetsUrl + 'm/lazyload',   
		"category": assetsUrl + 'm/category',
		"validator": libsUrl + 'arale/validator/0.9.7/validator',
		"dialog":  libsUrl + 'arale/dialog/1.3.0/dialog',
		"confirmBox": libsUrl + 'arale/dialog/1.3.0/confirmbox',
		"area": assetsUrl + 'm/area',
		"cookie": libsUrl + 'arale/cookie/1.0.2/cookie',
		"scrollLoading": assetsUrl + 'm/scrollLoading-min',
		"slides": assetsUrl + 'm/slides',
		"sideBar": assetsUrl + 'm/sidebar',
		"sideBarCss": assetsUrl + 'm/sidebar.css',
		"barConfig": assetsUrl + 'm/bar-config',
		"floatPanel":assetsUrl + 'm/floatPanel',
		"DialogManager":assetsUrl + 'm/uDialog',
		"DC":assetsUrl + 'm/doubleCalender',
		'areaFn':assetsUrl + 'm/areaFn',
		'selectFn':assetsUrl + 'm/selectFn',
		"zoom": assetsUrl + 'm/zoom'
	},
	aliasExtend : function(des, src, override){
	   if(src instanceof Array){
		   for(var i = 0, len = src.length; i < len; i++) this.aliasExtend(des, src[i], override);
	   }
	   for( var i in src){
		   if(override || !(i in des)) des[i] = src[i];
	   } 
	   return des;
	},
	aliasIntegrate : function(sysAlias){
		var result = this.aliasExtend({}, [this.mAlias,sysAlias]);
		delete result[0];
		delete result[1];
		return result;
	}

}