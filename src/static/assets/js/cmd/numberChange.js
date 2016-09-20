/**
	$('input[name="buyNum"]').numberChange({
		value:0,//默认值：已采购数量
		max:1000000, //最大值：剩余库存
		min:1, //最小值：起购数量
		step:1, //增减数量：B2B使用
		success:function(value){
			*****
		}
	});
**/

define('numberChange',function(require,exports,module){
var $ = require('jquery');
var css = '<style>.numberChange a.less,.numberChange input.value,.numberChange a.plus{float:left;font-size:24px;}.numberChange a.less,.numberChange a.plus{display:block;width:23px;height:23px;line-height:23px;text-align:center;border:1px solid #dedede;background-color:#f5f5f5;cursor:pointer;font-size:20px;}.numberChange a.plus{margin-right:5px}.numberChange a.less:hover,.numberChange a.plus:hover{background-color:#e60000;border:1px solid #e60000;color:#fff;text-decoration:none}.numberChange input.value{width:60px;height:23px; line-height:23px; border-top:1px solid #dedede;border-bottom:1px solid #dedede;font-size:12px;text-align:center}.numberChange a.disabled{ cursor: default;background-color:#fafafa;border:1px solid #dedede;color:#ddd;}.numberChange a.disabled:hover{background-color:#fafafa;border:1px solid #dedede;color:#ddd;}</style>';
$("body").append(css);
(function ($) {
  $.fn.numberChange = function (opts) {
    return this.each(function () {
      var defaults = {value:1, min:1, max:100000, step:2, success:function(){}};
      var options = $.extend(defaults, opts);
      var keyCodes = {up:38, down:40};
      var container = $('<div class="numberChange clearfix"></div>');
	  //赋默认值并且设置上下键事件
      var textField = $(this).addClass('value').removeClass('hide').attr('maxlength', options.max.length).val(options.value).bind('keyup paste change', function (e) {
    	  
    	  var field = $(this);
          if(e.keyCode == keyCodes.up){
			  changeValue(options.step);
		  }else if(e.keyCode == keyCodes.down){
			  changeValue(-options.step);
	      }else if(getValue(field) != container.data('lastValidValue')){
				if(Number(getValue(field)) < options.min){
					field.val(options.min);
					options.success(getValue(field));
					return false;
				}else if( Number(getValue()) > options.max){
					field.val(options.max);
					options.success(getValue(field));
					return false;
				}else{
					validateAndTrigger(field);
					validate(textField,false);
				}
		  }
      });
	  //包裹节点
      textField.wrap(container);
      var increaseButton = $('<a class="plus" href="javascript:void(0);">+</a>').click(function(){
		  changeValue(options.step);
	  });
      var decreaseButton = $('<a class="less" href="javascript:void(0);">-</a>').click(function(){
		  changeValue(-options.step);
	  });
	  validate(textField,true);
	  container.data('lastValidValue', options.value);
	  //节点写入
      textField.before(decreaseButton);
      textField.after(increaseButton);
	  //改变数据
      function changeValue(step) {
		if(Number(getValue()) < options.min || Number(getValue()) > options.max){
			return false;
		}else{
			textField.val(getValue()*1 + step*1);
			validateAndTrigger(textField);
		}
      }
	  //修复数据
      function validateAndTrigger(field) {
        //clearTimeout(container.data('timeout'));
        var value = validate(field,false);
        if (!isInvalid(value)) {
          textField.trigger('update', [field, value]);
        }
      }
	  //数据校验处理
      function validate(field,isLoad) {
        var value = getValue();
		if (value <= options.min){ 
			decreaseButton.addClass('disabled');
		}else{
			decreaseButton.removeClass('disabled');
		}
		if (value >= options.max){
			increaseButton.addClass('disabled')
		}else{
			increaseButton.removeClass('disabled');
		}
		
		if(value%options.step!=0){
			 textField.val(value - value%options.step);
		}
        if (isInvalid(value)) {
          //var timeout = setTimeout(function () {
            textField.val(container.data('lastValidValue'));
			options.success(textField.val());
			return textField.val();
          //}, 500);
          //container.data('timeout', timeout);
        } else {
          container.data('lastValidValue', value);
		  options.success(value,isLoad);
		  return value;
        }
		
      }
	  //最小最大值处理
      function isInvalid(value) { return isNaN(+value) || value < options.min || value > options.max }
      function getValue(field) {
        field = field || textField;
        return parseInt(field.val() || 0, 10);
      }
    })
  }
})(jQuery);});