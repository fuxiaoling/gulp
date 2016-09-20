/**
 * 数组工具类
 * Franks.T.D
 */
define('Arr',function(require,exports,module){
	var Arr = exports;
	/**
	 * 清空数组
	 */
	Arr.clear = function(arr){
		arr.length = 0;  
	}
	/**
	 * 判断是否为数组
	 */
	Arr.isArray = function(obj){ 
		return Object.prototype.toString.call(obj) === '[object Array]'; 
	}
	/**
	 * 数组去重
	 */
	Arr.distinct = function(arr){
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
	Arr.max = function(arr){
		var result = Math.max.apply(Math,arr);
		if(isNaN(result)){
			alert('警告：使用Arr.max方法时，发现数组中含有非数字');
		}else{
			return result;
		}
	}
	/**
	 * 获取数组中的最小值
	 */
	Arr.min = function(arr){
		var result = Math.min.apply(Math,arr);
		if(isNaN(result)){
			alert('警告：使用Arr.min方法时，发现数组中含有非数字');
		}else{
			return result;
		}
	}
	/**
	 * 获取对象在数组中的位置,return > -1则存在，并且返回值为索引
	 */
	Arr.indexOf = function(arr,obj){
		for(var i = 0, l = arr.length; i < l; i++) {
			if(arr[i] === obj) {
				return i;
			}
		}
		return -1;
	}
	/**
	 * 判断对象在数组中是否存在
	 */
	Arr.contain = function(arr,obj){
		var j = this.indexOf(arr,obj);
		return j !== -1;

	}
	/**
	 * 在数组指定位置插入元素
	 */
	Arr.insertAt = function(arr,index,item){
		arr.splice(index, 0, item);
	}
	/**
	 * 移除(数组指定的索引值的项 or 数值指定的对象）
	 */
	Arr.removeAt = function(arr,index,type){
		if(type === "index"){
			if(index < 0 || index >= arr.length){
				alert('警告：使用Arr.remove => index方法时，在数组中找不到该索引值')
			}else{
				arr.splice(index,1)
				/*for(var i = index, l = arr.length - 1; i < l; i++){         
					arr[i] = arr[i + 1];
				}*/
				
			}
		}else if(type === "obj"){
			var i = this.indexOf(arr,index);//这里index为obj，非索引，获取对象在数组中的位置
			if(i >= 0)
			return this.removeAt(arr,i,"index");
			else
			alert('警告：使用Arr.remove => obj方法时，在数组中找不到该对象');
		}
	}
	/**
	 * 输出数组的最后一位
	 */
	Arr.last = function(arr){
		return arr[arr.length - 1];
	}
	/**
	 * 二维数组排序
	 * @param {Object} arr 数组
	 * @param {String} field 数组字段名
	 * @param {String} order 排序
	 */
	Arr.aSort = function(arr,field,order){
		var refer = [], result=[], order = order=='asc'?'asc':'desc', index;
		for(i=0; i<arr.length; i++){ 
			refer[i] = arr[i][field]+':'+i; 
		} 
		refer.sort(); 
		if(order=='desc') refer.reverse(); 
		for(i=0;i<refer.length;i++){ 
			index = refer[i].split(':')[1]; 
			result[i] = arr[index]; 
		} 
		return result;
	}
	
});