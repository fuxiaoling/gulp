define('util',function(require,exports,module){
	var Util = exports;
	var $ = require("$");
	/**
	 * 张钰阳
	 */
	Util.hover = function(trigger, sub_node) {		
		$(trigger).hover(function() {
			$(this).find(sub_node).css("display","block");
		}, function () {
			$(this).find(sub_node).css("display","none");
		});
	}		
	/**
	 * 张钰阳
	 */
	Util.search_box_hover = function(trigger, sub_node) {	
		$(trigger).focus(function() {
			$(this).parent().find(sub_node).css("display","none");
		});
		$(trigger).blur(function() {
			if($(trigger).val() == ""){
				$(this).parent().find(sub_node).css("display","block");
			}
		});
	}	
	/**
	 * 张钰阳
	 */
	Util.check = function(trigger, sub_node) {
		$(trigger).click(function() {
			if($(this).attr("check") == "n"){
				$(this).find(sub_node).css("display","block");
				$(this).attr("check","y")
			} else if($(this).attr("check") == "y") {
				$(this).find(sub_node).css("display","none");
				$(this).attr("check","n")
			}
		});
	}
	/*****************傅小凌（QQ：279811056）***************/
	/**
	 * 精确运算：加
	 */
	Util.add = function(a, b) {
		var c, d, e;
		try {c = a.toString().split(".")[1].length} catch (f) {c = 0}
		try {d = b.toString().split(".")[1].length;} catch (f) {d = 0}
		return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) + this.mul(b, e)) / e;
	}
	/**
	 * 精确运算：减
	 */
	Util.sub = function(a, b) {
		var c, d, e;
		try {c = a.toString().split(".")[1].length} catch (f) {c = 0}
		try {d = b.toString().split(".")[1].length} catch (f) {d = 0}
		return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) - this.mul(b, e)) / e;
	}
	/**
	 * 精确运算：乘
	 */
	Util.mul = function(a, b) {
		var c = 0,d = a.toString(),e = b.toString();
		try {c += d.split(".")[1].length} catch (f) {}
		try {c += e.split(".")[1].length} catch (f) {}
		return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
	}
	/**
	 * 精确运算：除
	 */
	Util.div = function(a, b) {
		var c, d, e = 0,f = 0;
		try {e = a.toString().split(".")[1].length} catch (g) {}
		try {f = b.toString().split(".")[1].length} catch (g) {}
		return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), this.mul(c / d, Math.pow(10, f - e));
	}
	
	/**
	 * 获取ACSRF
	 */
	Util.getACSRFToken = function(str) {  
		var hash = 5381;  
		for (var i = 0, len = str.length; i < len; ++i)  
			hash += (hash << 5) + str.charAt(i).charCodeAt();  
		return hash & 2147483647  
	},
	/**
	 * 去除字符串首尾的空白字符
	 */
    Util.trim = function(str) {
        return str.replace(/^\s*(.*?)\s*$/, "$1");
    }
	/**
	 * 获取dom内单选，多选值,返回选中的数组
	 */
	Util.getBoxCheckedValue = function(dom){
		var resultcc = new Array();
    	$('#' + dom + ' input:checked').each(function(i) {
        	resultcc[i] = this.value;
    	})
    	return resultcc
	}
	/**
	 * 获取URL参数
	 */
    Util.getUrlParam = function(paramName) {
        var reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return r[2];
        return null;
    }
	/**
	 * 日期、月份补0
	 */
	Util.doHandleMonth = function(month){  
		var m = month;  
		if(month.toString().length == 1){  
			m = "0" + month;  
		}
		return m;  
	}
	/**
	 * 获取今日日期
	 */
	Util.getDay = function(day){
		var today = new Date();  
		var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;          
		today.setTime(targetday_milliseconds);
		var tYear = today.getFullYear();
		var tMonth = today.getMonth();
		var tDate = today.getDate();
		tMonth = this.doHandleMonth(tMonth + 1);
		tDate = this.doHandleMonth(tDate);
		return tYear+"-"+tMonth+"-"+tDate;
	}
	/**
	 * 转换日期"YYYY-MM-DD"为"MM.DD"
	 */
	Util.mmdd = function(date){
		var strs = new Array(),
			strs = date.split("-"),
			strs2 = new Array(),
			strs2 = date.split(":"),
			sMonth = strs[1],
			sDate = strs[2];
		if(strs2.length > 1){
			return "null";
		}else if(strs.length != 3 || sMonth === undefined && sDate === undefined){//当日期格式不符时
			return date;
		}else{
			return sMonth+"."+sDate;
		}
	}

	/**
	 * 转换相近3天日期为中文
	 */
	Util.dateDiff = function(sDate1){        
	    var aDate,oDate1,oDate2,iDays,sDate2 = Util.getDay(0);     
	    aDate = sDate1.split("-");
	    oDate1 = new Date(aDate[0]+"-"+aDate[1]+"-"+aDate[2]);
	    aDate = sDate2.split("-");
	    oDate2 = new Date(aDate[0]+"-"+aDate[1]+"-"+aDate[2]);  
	    iDays = parseInt((oDate2 - oDate1)/1000/60/60/24);
		if(iDays == 0){
			return "今天";
		}else if(iDays == 1){
			return "昨天";
		}else if(iDays == 2){
			return "前天";
		}
	}
	/**
	 * 字符串标签转义
	 */
	Util.escape = function(str) {
		return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
	}
	/**
	 * 判断节点是否存在
	 */
	Util.hasDom = function(dom) {
		return $(dom).length;
	},
	/**
	 * 获取对象长度
	 */
	Util.objLen = function(obj) {
		var len = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) len++;
		}
		return len;
	}
	/**
	 * 判断对象是否为数组
	 */
	Util.isArray = function(obj) { 
		return Object.prototype.toString.call(obj) === '[object Array]'; 
	}
	/**
	 * 数组去重
	 */
	Util.unique = function(arr) {
		var result = [], hash = {};
		for (var i = 0, elem; (elem = arr[i]) != null; i++) {
			if (!hash[elem]) {
				result.push(elem);
				hash[elem] = true;
			}
		}
		return result;
	}

	/**
	 * 获取数组中的最大值
	 */
	Util.max=function(arr){
		return Math.max.apply(Math,arr);
	}
	/**
	 * 获取数组中的最小值
	 */
	Util.min=function(arr){
		return Math.min.apply(Math,arr);
	}

	/**
	 * 图片等比压缩
	 */
	Util.autoResizeImage = function(maxWidth,maxHeight,objImg){ 
		var img = new Image(); 
		img.src = objImg.src; 
		var hRatio; 
		var wRatio; 
		var Ratio = 1;
		var w = img.width;
		var h = img.height;
		wRatio = maxWidth / w;
		hRatio = maxHeight / h;
		if (maxWidth ==0 && maxHeight==0){
		Ratio = 1; 
		}else if (maxWidth==0){
		if (hRatio<1) Ratio = hRatio; 
		}else if (maxHeight==0){ 
		if (wRatio<1) Ratio = wRatio; 
		}else if (wRatio<1 || hRatio<1){ 
		Ratio = (wRatio<=hRatio?wRatio:hRatio); 
		} 
		if (Ratio<1){ 
		w = w * Ratio; 
		h = h * Ratio; 
		} 
		objImg.height = h; 
		objImg.width = w;
		objImg.style.left = (maxWidth-w)/2+"px";
		objImg.style.top = (maxHeight-h)/2+"px";
	}
	/**
	 *验证价格：小数点前5位后3位
	 */
	 Util.checkPrice = function(price){
		var rule = /^(0|[1-9][0-9]{0,4})(\.[0-9]{1,3})?$/;
		if(price != "" && rule.test(price)){
			return true
		}else{
			return false
		}
			
	 }
	/**
	 *计算百分比
	 *Util.percentageFormat(1/4)
	 */
	Util.percentageFormat = function(a) {
		if (0 === a || "0" === a) return "0.00%";
		if (!a || isNaN(a)) return "";
		a = parseFloat(a), a = Math.round(1e4 * a) / 100 + "", a += -1 == a.indexOf(".") ? ".00" : "00";
		var b = a.split("."),
			c = b[1].substring(0, 2);
		return b[0] + "." + c + "%"
	}
	/**
	 * 添加到收藏夹
	 */
	Util.addFavorite = function(url, title) {  
		try {  
			window.external.addFavorite(url, title);  
		} catch (e) {  
			try {  
				window.sidebar.addPanel(title, url, "");  
			} catch (e) {  
				alert("加入收藏失败，请使用Ctrl+D进行添加");  
			}  
		}  
	}

	/**
	 * tabs切换
	 */
	Util.tabs = function (options) {
		var config = {
			ele:".tabs",
			index: 0,
			current:"current",
			type: "mouseover",
			hdItem: ".tab-hd-item",
			bdItem: ".tab-bd-item",
			success: function(){}
		},
		opts = $.extend({}, config, options),
		obj = opts.ele;
		$(opts.hdItem, obj).bind(opts.type, function(){
			if(opts.index != $(opts.hdItem, obj).index($(this))){
				opts.index = $(opts.hdItem, obj).index($(this));
				setCurrent();
			}
		});
		function setCurrent(){
			$(opts.hdItem, obj).removeClass(opts.current).eq(opts.index).addClass(opts.current);
			$(opts.bdItem, obj).css({"display":"none"}).eq(opts.index).css({"display":"block"});
			if(typeof opts.success == "function"){
				opts.success(opts.index);
			}
		}
		setCurrent();
		return obj;
	};
	
	/**
	 * 单选美化
	 */
	Util.newRadio=function(ele){
		 return $(':radio+label',ele).each(function(){
			 $(this).addClass('radio');
		 }).click(function(event){
			 $(this).siblings().removeClass("radio-checked");
			 $(this).siblings().attr("checked",false);
			 if(!$(this).prev().is(':checked')){
				 $(this).addClass("radio-checked");
				 $(this).prev().attr("checked",true);
			 }
			 event.stopPropagation();
			}
		 ) .prev().hide();
	}
	/**
	 * 单选组
	 */
	Util.newRadioGroup = function(options){
		var config = {
			radio: "dataItem",
			success: function(){}
		},
		opts = $.extend({}, config, options);
		return $(':radio+label',this).each(function(){
			$(this).addClass('radio');
		}).click(function(event){
			$('input[name="'+opts.radio+'"]').next('label.radio').removeClass("radio-checked");
			$('input[name="'+opts.radio+'"]').attr("checked",false);
			if(!$(this).prev().is(':checked')){
			 $(this).addClass("radio-checked");
			 $(this).prev().attr("checked",true);
			}
			var value = $(this).prev().val();
			opts.success(opts.radio,value);
			event.stopPropagation();
		});
	};
	/**
	 * 多选美化
	 */
	Util.newCheckbox=function(ele,callback,callback2){
		$(':checkbox+label',ele).each(function(){
			$(this).addClass('checkbox');
		}).click(function(event){
				if($(this).prev().is(':checked') == false){
					$(this).addClass("checkbox-checked");
					$(this).prev().attr("checked",true);
					if(typeof callback == "function"){
						callback();
					}
				}
				else{
					$(this).removeClass("checkbox-checked");
					$(this).prev().attr("checked",false);
					if(typeof callback2 == "function"){
						callback2();
					}
				}
				event.stopPropagation();

			}
		).prev().hide();
	};
	/**
	 * 全选美化
	 */
	Util.checkAll=function(ele,type,checkboxName,parent,callback){
		if(parent === undefined || parent === null || parent === ''){
			var that = $("input[name='"+checkboxName+"']");
		}else{
			var that = $(parent).find("input[name='"+checkboxName+"']");
		}
		$(ele).next("label").each(function(){
			$(this).addClass('checkbox');
		}).bind(type, function(event){
			if($(this).prev().is(':checked') == false){
				$(this).addClass("checkbox-checked");
				//$(this).html("取消");
				$(this).prev().attr("checked",true);
				that.each(function() {
					$(this).attr("checked",true);
					$(this).next("label").addClass("checkbox-checked");
				});
			}else{
				$(this).removeClass("checkbox-checked");
				//$(this).html("全选");
				$(this).prev().attr("checked",false);
				that.each(function() {
					$(this).attr("checked",false);
					$(this).next("label").removeClass("checkbox-checked");
				});
			}
			event.stopPropagation();
			if(typeof callback == "function"){
				callback();
			}
		}).prev().hide();
	}
	/**
	 * 反选
	 */
	Util.checkTog=function(ele,type,checkboxName){
		$(ele).bind(type, function(event){
			$("input[name='"+checkboxName+"']").each(function() {
				if($(this).is(':checked') == false){
					$(this).attr("checked",true);
					$(this).next("label").addClass("checkbox-checked");
				}else{
					$(this).attr("checked",false);
					$(this).next("label").removeClass("checkbox-checked");
				}
			});
			event.stopPropagation();
		});
	}
	/**
	 * 加盟商--选择传值
	 * 当callback为false时组件处理；为true时返回结果
	 */
	Util.getValue=function(options){
		var config = {
			ele: ".franks a.btn",
			data: 'data-state',
			input: 'demoInput',
			callback: false,
			success: function(){}
		},
		opts = $.extend({}, config, options);
		$(opts.ele).on('click',function(event){
			$(this).siblings('a').removeClass('current');
			$(this).addClass('current');
			if(opts.callback){
				if(typeof opts.success == "function"){
					opts.success($(this).attr(opts.data),$(this).index());
				}
			}else{
				$('input[name="'+opts.input+'"]').val($(this).attr(opts.data));
			}
			event.stopPropagation();
		});
	};

});