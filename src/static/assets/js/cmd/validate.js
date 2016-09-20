var loading_html = [],confirmBox,dialog,sysSessionFrame,confirmTpl='<button type="button" class="cancel-submit button button-maquamarine">确定</button>';
loading_html.push("<div id='maskOfProgressImage' style='position: fixed;top: 0;right: 0;bottom: 0;left: 0; z-index: 1000; background-color: #2F2F2F;'></div>");
loading_html.push('<div id="progressImgage" style="border: solid 2px #00a297;background: white url('+staticPath+'/assets/img/loading.gif) no-repeat 10px 10px;display: block;width: 148px;height: 28px;position: fixed;padding: 10px 10px 10px 50px;text-align:left;line-height: 27px;font-weight: bold;position: absolute;z-index: 9999;">数据加载中，请稍等......</div> ');
seajs.use(['$', 'arale/dialog/1.3.0/confirmbox','arale/dialog/1.3.0/dialog'], function ($, ConfirmBox,Dialog) {confirmBox = ConfirmBox;dialog = Dialog;});
function loginFrame(){
	window.location.href = window.location.href;
	/*sysSessionFrame = new dialog({
		effect: 'fade',
		align: {
            baseXY: ['50%', '50%'],
            selfXY: ['50%', '50%']
        },
		hasMask: true,
		zIndex:9999,
        width: 360,
        height: 240,
        content:ctx+'/syscheckLogin.shtml'
    }).show().after("hide",function(){this.destroy();});*/
}
function afterCheckSession(){
	//sysSessionFrame.destroy();
	window.location.href = window.location.href;
}

ajaxform= function() {
	return {
		request:function(fomId,callBack,addValide){
			var isSuccess=ajaxform.checkForm(fomId);
			if(isSuccess&&addValide!=null){
				isSuccess=addValide();
			}
			//检查成功
			if(isSuccess){ 
				ajaxform.submitForm(fomId,callBack);
			}
		},
		submitForm:function(formId,callBack){
			ajaxform.ajaxWaiting();
			var $form=$("#"+formId);
			$.post($form.attr("action"), $form.serialize(),function(data){
				$("#progressImgage").remove();
				$("#maskOfProgressImage").remove();
				if(data.userLogin=="false"){
					confirmBox.alert('<span style="color: #f00;font-size: 12px;">'+data.errorMsg+'</span>',function(){
						loginFrame();
					}, {confirmTpl:confirmTpl});
				}else{
					callBack(data);
				}
			}).error(function(XMLHttpRequest, textStatus, errorThrown) {
				var responseText = XMLHttpRequest.responseText;
				$("#progressImgage").remove();
				$("#maskOfProgressImage").remove();
				$(".appendclass").remove();
				if(responseText.indexOf("<div style=\" font-size:28px; overflow:hidden; padding-left:20px;\"><h2>金利达药品交易网</h2></div>")!=-1){
					confirmBox.alert('<span style="color: #f00;font-size: 12px;">请核实您输入的内容是否存在script、sql等内容!</span>',function(){}, {confirmTpl:confirmTpl});
				}else{
					confirmBox.alert('<span style="color: #f00;font-size: 12px;">系统繁忙，请稍后再试</span>',function(){}, {confirmTpl:confirmTpl});
				}
			});
		},
		ajaxWaiting:function(){
			$(document.body).append(loading_html.join(''));
			var img = $("#progressImgage");
			var mask = $("#maskOfProgressImage");
			img.show().css({
				"position": "fixed", 
				"top": "40%", 
				"left": "50%", 
				"margin-top": function () { return -1 * img.height() / 2; }, 
				"margin-left": function () { return -1 * img.width() / 2; } 
				});
			mask.show().css("opacity", "0.2");
		},
		submitData:function(url,data,callBack){
			ajaxform.ajaxWaiting();
			$.post(url, data).success(function(dataResult){
				$("#progressImgage").remove();
				$("#maskOfProgressImage").remove();
				if(dataResult.userLogin=="false"){
					confirmBox.alert('<span style="color: #f00;font-size: 12px;">'+dataResult.errorMsg+'</span>',function(){
						loginFrame();
					}, {confirmTpl:confirmTpl});
				}else{
					callBack(dataResult);
				}
			}).error(function(XMLHttpRequest, textStatus, errorThrown) {
				var responseText = XMLHttpRequest.responseText;
				$("#progressImgage").remove();
				$("#maskOfProgressImage").remove();
				if(responseText.indexOf("<div style=\" font-size:28px; overflow:hidden; padding-left:20px;\"><h2>金利达药品交易网</h2></div>")!=-1){
					confirmBox.alert('<span style="color: #f00;font-size: 12px;">请核实您输入的内容是否存在script、sql等内容!</span>',function(){}, {confirmTpl:confirmTpl});
				}else{
					confirmBox.alert('<span style="color: #f00;font-size: 12px;">系统繁忙，请稍后再试</span>',function(){}, {confirmTpl:confirmTpl});
				}
			});
		},
		floatVerify:function(jdom,maxlength,max,min){
			var val=jdom.val().trim();
			var reg = /^\d+(\.\d+)?$/; 
			if(val.length==0){
				return true;
			}
			 if(!reg.test(val)){
				 ajaxform.showError(jdom,"错误的数字");
				 return false;
			 }
			 if(maxlength!=null){
				 if(val.length>maxlength){
					 ajaxform.showError(jdom,"过长的数字");
					 return false;
				 }
			 }
			 if(max!=null){
				 if(parseFloat(val)>max){
					 ajaxform.showError(jdom,"过大的数字");
					 return false;
				 }
				 
			 }
			 if(min!=null){
				 if(parseFloat(val)<min){
					 ajaxform.showError(jdom,"过小的数字");
					 return false;
				 }
			 }
			 return true;
		},
		length:function(jdom,min,max){
			var val=jdom.val().trim();
			if(min==max&&val.length!=max){
				ajaxform.showError(jdom,"长度必须为"+min);
				return false;
			}
			if(max!=undefined&&val.length>max){
				if(min==0){
					ajaxform.showError(jdom,"长度不能大于"+max+"");
				}else{
					ajaxform.showError(jdom,"长度必须在"+min+"-"+max+"之间");
				}
				return false;
			}
			if(min!=undefined&&val.length<min){
				if(max==0||max==undefined){
					ajaxform.showError(jdom,"长度不能小于"+min+"");
				}else{
					ajaxform.showError(jdom,"长度必须在"+min+"-"+max+"之间");
				}
				return false;
			}
			return true;
		},
		showError:function(jdom,val){
			var html = jdom.prev().html().replace(/[^\u4e00-\u9fa5|,]+/,'').replace(":","").replace("：","");
			confirmBox.alert('<span style="color: #f00;font-size: 12px;">'+html+val+'</span>',function(){}, {confirmTpl:confirmTpl});
		},
		clearTip:function(jdom){
			
		},
		// 邮箱
		isEmail:function(jdom){
			var val=jdom.val().trim();
			 var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/; 
			 if(val.length>0&&!reg.test(val)){
				 ajaxform.showError(jdom,"邮箱格式错误，请重新填写");
				 return false;
			 }
			 return true;
		},
		// 手机号
		isMobilePhone:function(jdom){
			var val=jdom.val().trim();
			var reg = /^0?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
			if(val.length>0&&!reg.test(val)){
				 ajaxform.showError(jdom,"手机号码格式错误，请重新填写");
				 return false;
			 }
			 return true;
		},
		// 电话号码
		isPhone:function(jdom){
			var val=jdom.val().trim();
			var reg = /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/;
			if(val.length>0&&!reg.test(val)){
				 ajaxform.showError(jdom,"电话号码格式错误，请重新填写");
				 return false;
			 }
			 return true;
		},
		// 输入手机或电话
		isPhoneOrCellphone:function(jdom){
			var val=jdom.val().trim();
			var regPhone = /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/;
			var regCellphone = /^0?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
			if(val.length>0 && !regPhone.test(val) && !regCellphone.test(val)){
				 ajaxform.showError(jdom,"格式错误，请重新填写");
				 return false;
			 }
			 return true;
		},
		//qq
		qqCheck:function(jdom){
			var val=jdom.val().trim();
			var reg=/^\d{5,15}$/;
			if(val.length>0&&!reg.test(val)){
				 ajaxform.showError(jdom,"QQ号填写错误，请重新填写");
				 return false;
			 }
			 return true;
		},
		// url
		urlCheck:function(jdom){
			var val=jdom.val().trim();
			var reg = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/;
			if(val.length>0&&!reg.test(val)){
				 ajaxform.showError(jdom,"格式错误，实例：http://www.123ypw.com");
				 return false;
			 }
			 return true;
		},
		// 账号
		accountCheck:function(jdom){
			var val=jdom.val().trim();
			var reg = /^[a-zA-Z]+[a-zA-Z0-9]{5,20}$/;;
			if(val.length>0&&!reg.test(val)){
				 ajaxform.showError(jdom,"账号只能由字母和数字组成,必须以英文字母开头！且长度在6-30之间");
				 return false;
			 }
			 return true;
		},
		// 二级域名
		checkShortNumChar:function(jdom){
			var val=jdom.val().trim();
			var reg =/^[a-z0-9]+$/;
			if(val.length>0&&!reg.test(val)){
				 ajaxform.showError(jdom,"只能输入小写字符或数字，请重新填写");
				 return false;
			}
			return true;
		},
		// 密码
		passWordCheck:function(jdom){
			var val=jdom.val().trim();
			var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{5,30}$/;
			if(val.length>0&&!reg.test(val)){
				 ajaxform.showError(jdom,"密码只能由字母和数字组成！且长度在6-30之间");
				 return false;
			 }
			 return true;
		},
		wechatCheck:function(jdom){
			var val=jdom.val().trim();
			var reg = /^[a-zA-Z][a-zA-Z0-9-_]{5,20}$/;
			if(val.length>0&&!reg.test(val)){
				 ajaxform.showError(jdom,"微信号填写错误，请重新填写");
				 return false;
			 }
			 return true;
		},
		// 密码
		passwordReCheck:function(jdom,reDomId){
			var val=jdom.val().trim();
			var rDom=$("#"+reDomId).val().trim();
			if(val!=rDom){
				 ajaxform.showError(jdom,"二次密码输入不一致");
				 return false;
			}
			 return true;
		},
		isCardNo:function(jdom){
			var card=jdom.val().trim();
			// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
		   var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
		   if(reg.test(card) === false)
		   {
			   ajaxform.showError(jdom,"身份证输入不合法，请重新填写");
		       return  false;
		   }
			 return true;
		},
		// 非特殊字符验证
		notSpeclChar:function(jdom){
			var val=jdom.val().trim();
			var reg = /^[0-9a-zA-z\u4E00-\u9FA5]+$/;
			if(val.length>0&&!reg.test(val)){
				 ajaxform.showError(jdom,"不能含有特殊字符，请重新填写");
				 return false;
			 }
			 return true;
		},
		//只能输入字符或数字
		checkNumChar:function(jdom){
			var val=jdom.val().trim();
			var reg =/^[A-Za-z0-9]+$/;
			if(val.length>0&&!reg.test(val)){
				 ajaxform.showError(jdom,"只能输入字符或数字，请重新填写");
				 return false;
			}
			return true;
		},
		// 可输入括号的非特殊字符验证
		notSpeclCharButBrack:function(jdom){
			var val=jdom.val().trim();
			 var reg = /^[\u4e00-\u9fa5a-z1-9A-Z\()]+$/;
			if(val.length>0&&!reg.test(val)){
				 ajaxform.showError(jdom,"不能含有特殊字符(括号除外)");
				 return false;
			 }
			 return true;
		},
		// 小数点2位
		moneyCheck:function(jdom,maxPreLength,maxAppendLength){

			if(maxPreLength==undefined){
				maxPreLength=8;
			}
			if(maxAppendLength==undefined){
				maxAppendLength=2;
			}
			var maxPreNum = "";
			for (var i=0;i<maxPreLength;i++){
				maxPreNum = maxPreNum+"9";
			}
			var maxAppendNum = "";
			for (var i=0;i<maxAppendLength;i++){
				maxAppendNum = maxAppendNum+"9";
			}
			var val=jdom.val().trim();
			var pattern1 = new RegExp( "^\\d{1,"+maxPreLength+"}(\\.\\d{1,"+maxAppendLength+"})?$"); 
			if(val.length>0&&!pattern1.test(val)){
				 ajaxform.showError(jdom,"您输入的格式不正确，请输入0.01-"+maxPreNum+"."+maxAppendNum+"之间!");
				 return false;
			 }
			 return true;
		
		},
		// 小数点3位
		productMoneyCheck:function(jdom,maxPreLength,maxAppendLength){

			if(maxPreLength==undefined){
				maxPreLength=8;
			}
			if(maxAppendLength==undefined){
				maxAppendLength=3;
			}
			var maxPreNum = "";
			for (var i=0;i<maxPreLength;i++){
				maxPreNum = maxPreNum+"9";
			}
			var maxAppendNum = "";
			for (var i=0;i<maxAppendLength;i++){
				maxAppendNum = maxAppendNum+"9";
			}
			var val=jdom.val().trim();
			var pattern1 = new RegExp( "^\\d{1,"+maxPreLength+"}(\\.\\d{1,"+maxAppendLength+"})?$"); 
			if(val.length>0&&!pattern1.test(val)){
				 ajaxform.showError(jdom,"的格式不正确，请输入0.001-"+maxPreNum+"."+maxAppendNum+"之间的金额!");
				 return false;
			 }
			jdom.val(val);
			 return true;
		
		},	
		// 整数
		integerCheck:function(jdom){
			var val=jdom.val().trim();
			var reg = /^\d+$/;
			if(val.length>0&&!reg.test(val)){
				 ajaxform.showError(jdom,"只可填写整数，请重新填写");
				 return false;
			 }
			 return true;
		},
		// 不可为空
		notEmpty:function(jdom){
			var val=jdom.val().trim();
			if(val.length==0){
				ajaxform.showError(jdom,"不能为空!");
				return false;
			}
			return true
		},
		notZero:function(jdom){
			var val=jdom.val().trim();
			if(val<0){
				ajaxform.showError(jdom,"输入不能小于0!");
				return false;
			}
			return true
		},
		overZero:function(jdom){
			var val=jdom.val().trim();
			if(val<=0){
				ajaxform.showError(jdom,"输入不能小于等于0!");
				return false;
			}
			return true
		},	
		isUrl:function(jdom){
			var val=jdom.val().trim();
			var reg_=/^http:\/\/(?:[\w-\.]{0,255})(?:(?:\/?[^\s]{0,255}){0,255})/;
			if(val.length>0&&!reg_.test(val)){
				 ajaxform.showError(jdom,"格式错误，实例：http://www.123ypw.com");
				 return false;
			 }
			return true
		},
		onlyChinese:function(jdom){
			var val=jdom.val().trim();
			var vart = val.replace(/[^\u4E00-\u9FA5]/g,'');
			if(val.length>0&&vart.length<val.length){
				ajaxform.showError(jdom,"只能输入汉字，请重新填写");
				return false;
			}
			return true;
		},
		checkAcc:function(jdom){
			var val=jdom.val().trim();
			var reg_=/^[\d\s]+$/;
			if(val!=null && val!="" && !reg_.exec(val)){
				ajaxform.showError(jdom,"格式不正确，只允许输入数字,请重新填写!");
				return false;
			 }
			return true
		},
		numCheck:function(jdom){
			var val=jdom.val().trim();
			 var reg = /^([1-9]\d*|0)(\.\d*[1-9])?$/; 
			 if(val.length>0&&!reg.test(val)){
				 ajaxform.showError(jdom,"不能以0开头且为正整数!");
				 return false;
			 }
			 return true;
		},
		checkInput:function(elem){
			var isSuccess=true;
			var controls=elem.attr("control");
			var attrs=controls.split(";");
			// 临时变量，是否继续检查。检查错误后（false）停止检查该元素
			var isContinue=true;
			$(attrs).each(function(_index,_elem){
				if(isContinue&&_elem.length>0){
					if(_elem.indexOf("(")>-1){
						_elem="ajaxform."+_elem.replace("(","(elem,")
					}else{
						_elem="ajaxform."+_elem+"(elem)";
					}
					isContinue=eval(_elem);
				}
				if(!isContinue){
					return false;
				}
			})
			if(!isContinue){
				isSuccess=false;
			}else{
				ajaxform.clearTip(elem);
			}
			return isSuccess;
		},
		checkForm:function(fomId){
			var isSuccess=true;
			$("#"+fomId+" :input[control]").each(function(index,dom){
				var elem=$(dom);
				var sFlag=ajaxform.checkInput(elem);
				if(!sFlag){
					isSuccess=false;
					return false;
				}
			})
			return isSuccess;
		},
		getFunc:function(name){
			for (var i in ajaxform) {
				if (i ==name) {
					return ajaxform[i];
				}
			}
		}
		
	}
}();
String.prototype.trim = function () {
	return this .replace(/^\s\s*/, '' ).replace(/\s\s*$/, '' );
}
function changeGoodClass(obj, index){
	var catName=obj.options[obj.options.selectedIndex].text;
	
	$("#searchCatId").attr("value", obj.value);
	if(catName == '全部') {
		if(index == 1){
			$("#proClass2").html("");
			$("#classDiv2").hide();
			
			$("#classDiv3").hide();
			$("#proClass3").html("");
		}
		if(index == 2){
			$("#classDiv3").hide();
			$("#proClass3").html("");
		}
		return;
	}
	$.ajax({
		url : ctx + "/product/medical/publish.shtml?param=getChlid&pId=" + obj.value,
		success : function(data) {
			if (data.ok) {
				var optHtml = "";
				if(data.obj.length != 0) {
					optHtml = "<option value='"+obj.value+"'>全部</option>";
					for (i = 0; i < data.obj.length; i++) {
						optHtml += "<option value='"+data.obj[i].catId+"'>"+data.obj[i].catName+"</option>";
					}
					if(index == 1){
						$("#proClass2").html(optHtml);
						$("#classDiv2").show();
						
						$("#classDiv3").hide();
						$("#proClass3").html("");
					}
					if(index == 2){
						$("#classDiv3").show();
						$("#proClass3").html(optHtml);
					}
				} else {
					if(index == 1){
						$("#proClass2").html("");
						$("#classDiv2").hide();
						
						$("#classDiv3").hide();
						$("#proClass3").html("");
					}
					if(index == 2){
						$("#classDiv3").hide();
						$("#proClass3").html("");
					}
				}
			}
		}
	});
}