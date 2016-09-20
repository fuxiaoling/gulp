define('getCookiePro',function(require,exports,module){
	var $ = require('jquery');
	var Cookie = require('arale/cookie/1.0.2/cookie');
	module.exports = getCookiePro;
	function getCookiePro(options){
		if(!(this instanceof getCookiePro)){
			return new getCookiePro(options);
		}
		var config = {
			el: ".demo",//投放节点
			cookieName: "viewGoodsHistory",//cookie保存商品的name
			proNum: 5,//需要获取的数量
			title: true, //是否开启内容的标题
			axial: 'X' //商品排列轴向:x、X轴，y、Y轴
		},opts = $.extend({}, config, options);
		this.el = opts.el;
		this.obj = $(this.el);
		this.cookieName = opts.cookieName;
		this.proNum = opts.proNum;
		this.title = opts.title;
		this.axial = opts.axial;
		this.init();
	}
	//处理
	getCookiePro.prototype.init = function(){
		var hc=Cookie.get(this.cookieName);
		if(hc!=null&&hc.indexOf("||||||||")==-1){ 
			var jsonHc = $.parseJSON(hc);
			var k = 0;
			var xhtml = new Array();
			this.title ? xhtml.push('<div class="content-header">您的浏览记录</div>') : '' ;
			xhtml.push('<ul class="cookiePro">');
			for(var i in jsonHc){
				var obj = jsonHc[i];
				if(obj.sellPrice == undefined || obj.goodsTitle == undefined) continue;
				k++;
				if(k > this.proNum) break;
				var img = (obj.goodsImg1Middle==null)?domain+"static/b2c/img/default200x200.gif":obj.goodsImg1Middle;
				xhtml.push('<li class="cp-item">');
				xhtml.push('<div class="cp-Box">');
				xhtml.push('<a class="cp-imgBox pr" href="'+obj.location+'" target="_blank">');
				xhtml.push('<img class="cp-img" src="'+img+'" alt="'+obj.goodsTitle+'" />');					
				xhtml.push('<span class="cp-price pa"><i class="rmb">￥</i>'+obj.sellPrice+'</span></a>');
				//if(obj.brandName!=undefined && obj.brandName!=''){
				  // xhtml.push('<a class="cp-name mt10" href="'+mallWebRoot+'/goods/search?brandId='+obj.brandId+'" target="_blank">【'+obj.brandName+'】</a>');
				//}
				xhtml.push('<a class="cp-name mt10" href="'+obj.location+'"  target="_blank">'+obj.goodsTitle.substring(0,12)+'</a>');
				xhtml.push('<a class="cp-company mt5" href="'+mallWebRoot+'/'+obj.sellerFirmId+'/main.shtml" target="_blank"><i class="iconfont f14 pr5">&#xe628</i>'+obj.sellerFirmName+'</a>');
				xhtml.push('</div>');
				xhtml.push('</li>');
			}
			xhtml.push('</ul>');
			var documentWidth = document.compatMode=="CSS1Compat" ? document.documentElement.clientWidth : document.body.clientWidth;
			var percent =  this.axial == 'x' || this.axial == 'X' ? documentWidth < 1025 ? 25 : 20 : 100;
			var size = this.axial == 'x' || this.axial == 'X' ? 200 : 180;
			var itemHeight = size*1+71;
			var style = '<style>'+this.el+' .content-header{ width:100%; height:30px; line-height:30px; font-size:14px; font-weight:700; border-bottom:1px solid #dedede; margin-bottom:30px;}'+this.el+' ul.cookiePro{ width:100%;height:auto;}'+this.el+' ul.cookiePro .pr{ position:relative;}'+this.el+' ul.cookiePro .pa{ position:absolute;}'+this.el+' ul.cookiePro .mt10{ margin-top:10px;}'+this.el+' ul.cookiePro .mt5{ margin-top:5px;}'+this.el+' ul.cookiePro li.cp-item{width:'+percent+'%; height:'+itemHeight+'px; overflow:hidden; float:left;}'+this.el+' ul.cookiePro li.cp-item .cp-Box{ display:block; margin:0 auto;}'+this.el+' ul.cookiePro a{ display:block; margin:0 auto; overflow:hidden;}'+this.el+' ul.cookiePro a:hover{ text-decoration:underline;}'+this.el+' ul.cookiePro li.cp-item a.cp-imgBox{ display:block; width:'+size+'px; height:'+size+'px; border:1px solid #ededed;}'+this.el+' ul.cookiePro li.cp-item a.cp-imgBox img.pc-img{ display:block; width:100%; height:100%; margin:0 auto;}'+this.el+' ul.cookiePro li.cp-item a.cp-imgBox span.cp-price{ display:block; width:100%; height:30px; line-height:30px; bottom:0; left:0; z-index:9; text-align:center; color:#f60; font-size:14px;}'+this.el+' ul.cookiePro li.cp-item a.cp-name{ width:'+size+'px; max-height:36px; line-height:18px;}'+this.el+' ul.cookiePro li.cp-item a.cp-company{ width:'+size+'px; height:20px; line-height:20px; color:#999;}</style>';
			var HTML = xhtml.join("")+style;
		this.obj.append(HTML);
		} else{ 
			this.obj.append('<div style="padding:30px; text-align:center; color:#999;">暂无浏览记录</div>'); 
		}		
	}
});