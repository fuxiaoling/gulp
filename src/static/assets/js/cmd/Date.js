/**
 * 时间工具类
 * Franks.T.D(整理收集)
 */
define('date',function(require,exports,module){
	var date = exports;
	/**
	 * 获取日期
	 */
	date.getDay = function(day){
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
	date.mmdd = function(date){
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
	 * 转换今日前的日期为中文
	 */
	date.dateDiff = function(sDate1){        
	    var aDate,oDate1,oDate2,iDays,sDate2 = this.getDay(0);     
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
		}else if(iDays >= 3){
			return "早前";
		}
	}
	/**
	 * 日期、月份补0
	 */
	date.doHandleMonth = function(month){  
		var m = month;  
		if(month.toString().length == 1){  
			m = "0" + month;  
		}
		return m;  
	}
	/**
	 * 判断是否是闰年,返回true或者false
	 */
	date.isLeapYear = function(){
		var today = new Date();  
		var year = today.getFullYear();
		return (0==year%4&&((year%100!=0)||(year%400==0)));
	}
	/**
	 * 返回本月的天数
	 */
	date.getDaysOfMonth = function(){
		var today = new Date(); 
		return(new Date(today.getFullYear(),today.getMonth()+1,0)).getDate();
	}
	
	//---------------------------------------------------  
	// 日期格式化  
	// 格式 YYYY/yyyy/YY/yy 表示年份  
	// MM/M 月份  
	// W/w 星期  
	// dd/DD/d/D 日期  
	// hh/HH/h/H 时间  
	// mm/m 分钟  
	// ss/SS/s/S 秒  
	//---------------------------------------------------  
	date.Format = function(formatStr)   
	{   var today = new Date();
		var str = formatStr;   
		var Week = ['日','一','二','三','四','五','六'];  
	  
		str=str.replace(/yyyy|YYYY/,today.getFullYear());   
		str=str.replace(/yy|YY/,(today.getYear() % 100)>9?(today.getYear() % 100).toString():'0' + (today.getYear() % 100));   
	  
		str=str.replace(/MM/,today.getMonth()>9?today.getMonth().toString():'0' + today.getMonth());   
		str=str.replace(/M/g,today.getMonth());   
	  
		str=str.replace(/w|W/g,Week[this.getDay()]);   
	  
		str=str.replace(/dd|DD/,today.getDate()>9?today.getDate().toString():'0' + today.getDate());   
		str=str.replace(/d|D/g,today.getDate());   
	  
		str=str.replace(/hh|HH/,today.getHours()>9?today.getHours().toString():'0' + today.getHours());   
		str=str.replace(/h|H/g,today.getHours());   
		str=str.replace(/mm/,today.getMinutes()>9?today.getMinutes().toString():'0' + today.getMinutes());   
		str=str.replace(/m/g,today.getMinutes());   
	  
		str=str.replace(/ss|SS/,today.getSeconds()>9?today.getSeconds().toString():'0' + today.getSeconds());   
		str=str.replace(/s|S/g,today.getSeconds());   
	  
		return str;   
	}   
	  
	//+---------------------------------------------------  
	//| 求两个时间的天数差 日期格式为 YYYY-MM-dd   
	//+---------------------------------------------------  
	date.daysBetween = function(DateOne,DateTwo)  
	{   
		var OneMonth = DateOne.substring(5,DateOne.lastIndexOf ('-'));  
		var OneDay = DateOne.substring(DateOne.length,DateOne.lastIndexOf ('-')+1);  
		var OneYear = DateOne.substring(0,DateOne.indexOf ('-'));  
	  
		var TwoMonth = DateTwo.substring(5,DateTwo.lastIndexOf ('-'));  
		var TwoDay = DateTwo.substring(DateTwo.length,DateTwo.lastIndexOf ('-')+1);  
		var TwoYear = DateTwo.substring(0,DateTwo.indexOf ('-'));  
	  
		var cha=((Date.parse(OneMonth+'/'+OneDay+'/'+OneYear)- Date.parse(TwoMonth+'/'+TwoDay+'/'+TwoYear))/86400000);   
		return Math.abs(cha);  
	}  
	  
	  
	//+---------------------------------------------------  
	//| 日期计算  
	//+---------------------------------------------------  
	date.DateAdd = function(strInterval, Number) {
		var today = new Date();
		var dtTmp = today;  
		switch (strInterval) {   
			case 's' :return new Date(Date.parse(dtTmp) + (1000 * Number));  
			case 'n' :return new Date(Date.parse(dtTmp) + (60000 * Number));  
			case 'h' :return new Date(Date.parse(dtTmp) + (3600000 * Number));  
			case 'd' :return new Date(Date.parse(dtTmp) + (86400000 * Number));  
			case 'w' :return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));  
			case 'q' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number*3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
			case 'm' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
			case 'y' :return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
		}  
	}  
	  
	//+---------------------------------------------------  
	//| 比较日期差 dtEnd 格式为日期型或者 有效日期格式字符串  
	//+---------------------------------------------------  
	date.DateDiff = function(strInterval, dtEnd) {
		var today = new Date();   
		var dtStart = today;  
		if (typeof dtEnd == 'string' )//如果是字符串转换为日期型  
		{   
			dtEnd = this.StringToDate(dtEnd);  
		}  
		switch (strInterval) {   
			case 's' :return parseInt((dtEnd - dtStart) / 1000);  
			case 'n' :return parseInt((dtEnd - dtStart) / 60000);  
			case 'h' :return parseInt((dtEnd - dtStart) / 3600000);  
			case 'd' :return parseInt((dtEnd - dtStart) / 86400000);  
			case 'w' :return parseInt((dtEnd - dtStart) / (86400000 * 7));  
			case 'm' :return (dtEnd.getMonth()+1)+((dtEnd.getFullYear()-dtStart.getFullYear())*12) - (dtStart.getMonth()+1);  
			case 'y' :return dtEnd.getFullYear() - dtStart.getFullYear();  
		}  
	}  
	  
	//+---------------------------------------------------  
	//| 日期输出字符串，重载了系统的toString方法  
	//+---------------------------------------------------  
	date.toString = function(showWeek){   
		var today = new Date();   
		var myDate= today;  
		var str = myDate.toLocaleDateString();  
		if (showWeek)  
		{   
			var Week = ['日','一','二','三','四','五','六'];  
			str += ' 星期' + Week[myDate.getDay()];  
		}  
		return str;  
	}  
	  
	//+---------------------------------------------------  
	//| 日期合法性验证  
	//| 格式为：YYYY-MM-DD或YYYY/MM/DD  
	//+---------------------------------------------------  
	date.isValidDate = function(DateStr){   
		var sDate=DateStr.replace(/(^\s+|\s+$)/g,''); //去两边空格;   
		if(sDate=='') return true;   
		//如果格式满足YYYY-(/)MM-(/)DD或YYYY-(/)M-(/)DD或YYYY-(/)M-(/)D或YYYY-(/)MM-(/)D就替换为''   
		//数据库中，合法日期可以是:YYYY-MM/DD(2003-3/21),数据库会自动转换为YYYY-MM-DD格式   
		var s = sDate.replace(/[\d]{ 4,4 }[\-/]{ 1 }[\d]{ 1,2 }[\-/]{ 1 }[\d]{ 1,2 }/g,'');   
		if (s=='') //说明格式满足YYYY-MM-DD或YYYY-M-DD或YYYY-M-D或YYYY-MM-D   
		{   
			var t=new Date(sDate.replace(/\-/g,'/'));   
			var ar = sDate.split(/[-/:]/);   
			if(ar[0] != t.getYear() || ar[1] != t.getMonth()+1 || ar[2] != t.getDate())   
			{   
				//alert('错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD。注意闰年。');   
				return false;   
			}   
		}   
		else   
		{   
			//alert('错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD。注意闰年。');   
			return false;   
		}   
		return true;   
	}   
	  
	//+---------------------------------------------------  
	//| 日期时间检查  
	//| 格式为：YYYY-MM-DD HH:MM:SS  
	//+---------------------------------------------------  
	date.checkDateTime = function(str){   
		var reg = /^(\d+)-(\d{ 1,2 })-(\d{ 1,2 }) (\d{ 1,2 }):(\d{ 1,2 }):(\d{ 1,2 })$/;   
		var r = str.match(reg);   
		if(r==null)return false;   
		r[2]=r[2]-1;   
		var d= new Date(r[1],r[2],r[3],r[4],r[5],r[6]);   
		if(d.getFullYear()!=r[1])return false;   
		if(d.getMonth()!=r[2])return false;   
		if(d.getDate()!=r[3])return false;   
		if(d.getHours()!=r[4])return false;   
		if(d.getMinutes()!=r[5])return false;   
		if(d.getSeconds()!=r[6])return false;   
		return true;   
	}   
	  
	//+---------------------------------------------------  
	//| 把日期分割成数组  
	//+---------------------------------------------------  
	date.toArray = function(){   
		var today = new Date();  
		var myDate = today;  
		var myArray = Array();  
		myArray[0] = myDate.getFullYear();  
		myArray[1] = myDate.getMonth();  
		myArray[2] = myDate.getDate();  
		myArray[3] = myDate.getHours();  
		myArray[4] = myDate.getMinutes();  
		myArray[5] = myDate.getSeconds();  
		return myArray;  
	}  
	  
	//+---------------------------------------------------  
	//| 取得日期数据信息  
	//| 参数 interval 表示数据类型  
	//| y 年 m月 d日 w星期 ww周 h时 n分 s秒  
	//+---------------------------------------------------  
	date.DatePart = function(interval){   
		var today = new Date();  
		var myDate = today;  
		var partStr='';  
		var Week = ['日','一','二','三','四','五','六'];  
		switch (interval)  
		{   
			case 'y' :partStr = myDate.getFullYear();break;  
			case 'm' :partStr = myDate.getMonth()+1;break;  
			case 'd' :partStr = myDate.getDate();break;  
			case 'w' :partStr = Week[myDate.getDay()];break;  
			case 'ww' :partStr = myDate.WeekNumOfYear();break;  
			case 'h' :partStr = myDate.getHours();break;  
			case 'n' :partStr = myDate.getMinutes();break;  
			case 's' :partStr = myDate.getSeconds();break;  
		}  
		return partStr;  
	}  
	  
	//+---------------------------------------------------  
	//| 取得当前日期所在月的最大天数  
	//+---------------------------------------------------  
	date.MaxDayOfDate = function(){  
		var today = new Date();  
		var myDate = today;  
		var ary = myDate.toArray();  
		var date1 = (new Date(ary[0],ary[1]+1,1));  
		var date2 = date1.dateAdd(1,'m',1);  
		var result = dateDiff(date1.Format('yyyy-MM-dd'),date2.Format('yyyy-MM-dd'));  
		return result;  
	}  
	  
	//+---------------------------------------------------  
	//| 取得当前日期所在周是一年中的第几周  
	//+---------------------------------------------------  
	date.WeekNumOfYear = function(){   
		var today = new Date();  
		var myDate = today;  
		var ary = myDate.toArray();  
		var year = ary[0];  
		var month = ary[1]+1;  
		var day = ary[2];  
		document.write('< script language=VBScript\> \n');  
		document.write('myDate = DateValue('+month+'-'+day+'-'+year+') \n');  
		document.write('result = DatePart("ww", myDate) \n');  
		document.write(' \n');  
		return result;  
	}  
	  
	//+---------------------------------------------------  
	//| 字符串转成日期类型   
	//| 格式 MM/dd/YYYY MM-dd-YYYY YYYY/MM/dd YYYY-MM-dd  
	//+---------------------------------------------------  
	date.StringToDate = function(DateStr){   
		var converted = Date.parse(DateStr);  
		var myDate = new Date(converted);  
		if (isNaN(myDate))  
		{   
			//var delimCahar = DateStr.indexOf('/')!=-1?'/':'-';  
			var arys= DateStr.split('-');  
			myDate = new Date(arys[0],--arys[1],arys[2]);  
		}  
		return myDate;  
	}
	
});