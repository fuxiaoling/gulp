/**
 * 运算工具类
 * Franks.T.D
 */
define('Calc',function(require,exports,module){
	var Calc = exports;
	/**
	 * 精确运算：加
	 */
	Calc.add = function(a, b) {
		var c, d, e;
		try {c = a.toString().split(".")[1].length} catch (f) {c = 0}
		try {d = b.toString().split(".")[1].length;} catch (f) {d = 0}
		return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) + this.mul(b, e)) / e;
	}
	/**
	 * 精确运算：减
	 */
	Calc.sub = function(a, b) {
		var c, d, e;
		try {c = a.toString().split(".")[1].length} catch (f) {c = 0}
		try {d = b.toString().split(".")[1].length} catch (f) {d = 0}
		return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) - this.mul(b, e)) / e;
	}
	/**
	 * 精确运算：乘
	 */
	Calc.mul = function(a, b) {
		var c = 0,d = a.toString(),e = b.toString();
		try {c += d.split(".")[1].length} catch (f) {}
		try {c += e.split(".")[1].length} catch (f) {}
		return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
	}
	/**
	 * 精确运算：除
	 */
	Calc.div = function(a, b) {
		var c, d, e = 0,f = 0;
		try {e = a.toString().split(".")[1].length} catch (g) {}
		try {f = b.toString().split(".")[1].length} catch (g) {}
		return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), this.mul(c / d, Math.pow(10, f - e));
	}
	/**
	 *验证价格：小数点位数以内均有效
	 * @param {int} digits 验证的小数点位数
	 */
	Calc.checkPrice = function(price,digits){
		var rule = eval("/^(0|[1-9][0-9]{0,4})(\\.[0-9]{1,"+digits+"})?$/");
		if(price != "" && rule.test(price.toString())){
			return true
		}else{
			return false
		}
	}
	/**
	 *百分比(保留后2位)
	 *Util.pct(1/4)
	 */
	Calc.pct = function(a) {
		if (0 === a || "0" === a) return "0.00%";
		if (!a || isNaN(a)) return "";
		a = parseFloat(a), a = Math.round(1e4 * a) / 100 + "", a += -1 == a.indexOf(".") ? ".00" : "00";
		var b = a.split("."),
			c = b[1].substring(0, 2);
		return b[0] + "." + c + "%"
	}

	/**
	 *计算平均评分（淘宝商品）
	 */
	Calc.score = function(data){
		var n = 0,j = 0,tArr = [],pctArr = [],sArr=[];
		if(typeof data != "object"){
			var data = [
				{"sn":"5","times":"231"},//sn => 5分 ； times => 打5分的次数
				{"sn":"4","times":"167"},
				{"sn":"3","times":"150"},
				{"sn":"2","times":"84"},
				{"sn":"1","times":"23"},
			];
		}
		for(var i=0,l=data.length; i<l; i++){
			j = this.add(data[i].times,j);
			tArr.push(data[i].times);
		}
		for(var i=0,l=tArr.length; i<l; i++){
			var t = this.pct(data[i].times/j);
				t = t.replace(/%/g,'')/100;
				t = t.toFixed(4);
			pctArr.push(t);
		}
		for(var i=0,l=pctArr.length; i<l; i++){
			var k = this.mul(data[i].sn,pctArr[i]);
			sArr.push(k);
			n = this.add(k,n);
		}
		return n;
	}
	/**
	 *升至一个预期评分还需要某个分多少次评价（淘宝商品）
	 * @param {int} score 现在的分数
	 * @param {int} times 现在评价的人数
	 * @param {int} n 评分的级别
	 * @param {int} es 所希望的分数
	 */
	Calc.sReason = function(score,times,n,es){
		var b1 = n > es;
		var b2 = es > score;
		if(b1 && b2){
			return this.div(this.sub(this.mul(times,es),this.mul(score,times)),this.sub(n,es));
		}else{
			!b1 ? alert("评分级别必须大于所希望的得分（n>es），才有可能实现目标！") : void(0);
			!b2 ? alert("所希望的得分必须大于现在的分数（es>score）！") : void(0);
		}
	}
});