define('Calc', function(require, exports, module) {
    /**
     * @desc 运算工具类
     * @author Franks.T.D
     * @exports Calc
     */
    var Calc = exports;
    /**
     * 精确运算：加
     * @param {int | float} a 被加的对象
     * @param {int | float} b 被加的数值
     * @returns  {int | float} a和b的相加结果
     * 
     * 		Examples
     * 		Calc.add(1, 1);                  -> '2'
     * 		Calc.add(1, 1.5);       		 -> '2.5'
     * 		Calc.add(1.5, 1.5);              -> '3'
     */
    Calc.add = function(a, b) {
        var c, d, e;
        try { c = a.toString().split(".")[1].length } catch (f) { c = 0 }
        try { d = b.toString().split(".")[1].length; } catch (f) { d = 0 }
        return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) + this.mul(b, e)) / e;
    };
    /**
     * 精确运算：减
     * @param {int | float} a 被减的对象
     * @param {int | float} b 被减的数值
     * @returns {int | float} a-b的结果
     * 
     * 		Examples
     *      Calc.sub(1, 1);                  -> '0'
     *      Calc.sub(2, 1.5);       		 -> '0.5'
     *      Calc.sub(3.5, 0.5);              -> '2'
     */
    Calc.sub = function(a, b) {
        var c, d, e;
        try { c = a.toString().split(".")[1].length } catch (f) { c = 0 }
        try { d = b.toString().split(".")[1].length } catch (f) { d = 0 }
        return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) - this.mul(b, e)) / e;
    };
    /**
     * 精确运算：乘
     * @param {int | float} a 乘的对象
     * @param {int | float} b 被乘的数值
     * @returns {int | float} a*b的结果
     * 
     * 		Examples
     *      Calc.mul(1, 1);                  -> '1'
     *      Calc.mul(2, 1.5);       		 -> '3'
     *      Calc.mul(3.5, 0.5);              -> '1.75'
     */
    Calc.mul = function(a, b) {
        var c = 0,
            d = a.toString(),
            e = b.toString();
        try { c += d.split(".")[1].length } catch (f) {}
        try { c += e.split(".")[1].length } catch (f) {}
        return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
    };
    /**
     * 精确运算：除
     * @param {int | float} a 除的对象
     * @param {int | float} b 被除的数值
     * @returns {int | float} a/b的结果
     * 
     * 		Examples
     *      Calc.div(1, 1);                  -> '1'
     *      Calc.div(2, 1.5);       		 -> '1.333333333333333'
     *      Calc.div(3.5, 0.5);              -> '7'
     */
    Calc.div = function(a, b) {
        var c, d, e = 0,
            f = 0;
        try { e = a.toString().split(".")[1].length } catch (g) {}
        try { f = b.toString().split(".")[1].length } catch (g) {}
        return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), this.mul(c / d, Math.pow(10, f - e));
    };
    /**
     * 验证价格：小数点位数以内均有效
     * @param {int | float} price 验证对象
     * @param {int} digits 验证的小数点位数
     * @returns {bool} true or false
     * 
     * 		Examples
     * 		Calc.checkPrice(3.15, 2);              -> true
     * 		Calc.checkPrice(3.15, 1);       	   -> false
     * 		Calc.checkPrice(3.15, 3);              -> false
     */
    Calc.checkPrice = function(price, digits) {
        var rule = eval("/^(0|[1-9][0-9]{0,4})(\\.[0-9]{1," + digits + "})?$/");
        if (price != "" && rule.test(price.toString())) {
            return true
        } else {
            return false
        }
    };
});
