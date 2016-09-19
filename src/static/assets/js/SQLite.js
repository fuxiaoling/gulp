"use strict";
/**
 * 
 * O2O本地数据库API
 * 作用
 * ----------------标签----------------
 * openDatabase：这个方法使用现有数据库或创建新数据库创建数据库对象
 * transaction：这个方法允许我们根据情况控制事务提交或回滚
 * executeSql：这个方法用于执行真实的SQL查询
 *
 */
window._sqlite = {
    /* 链接数据库 */
    connDB: function(){
        if (!window.openDatabase) {
            $.alert('您的浏览器不支持web SOL(本地数据库)');
        } else {
            var shortName = 'JLD_O2O_DB'; //数据库名称
            var version = '1.0'; //数据库的版本号
            var displayName = 'O2O db'; //对数据库的描述
            var maxSize = 1024 * 1024; // 设置分配的数据库的大小（单位是kb）
            var db = openDatabase(shortName, version, displayName, maxSize);
            return db;
        }
    },

    /* 创建数据表 参数：表名、字段 */
    createTables: function() {
        var that = this,
            db = that.connDB(),
            table = arguments[0],
            column = arguments[1];
        console.log("---尝试创建表");  
        console.log("表名："+table);  
        console.log("字段："+column.join(","));
        db.transaction(
            function(transaction) {
                transaction.executeSql('CREATE TABLE IF NOT EXISTS ' + table + '(id unique' + that.columnList(column) + ');', [], that.createHandler, that.errorHandler);
            }
        );
        console.log("---尝试创建表 | 结束");  
    },

    /* 增加新字段 */
    addROW:function(){
        var that = this,
            db = that.connDB(),
            table = arguments[0],
            newROW = arguments[1]; 
        db.transaction(
            function(transaction) {
                for(var i=0,l=newROW.length;i<l;i++){
                    transaction.executeSql('ALTER TABLE ' + table + ' ADD '+newROW[i]+' TEXT;', [], function(transaction,rs){
                        console.log(table+"表增加新字段成功！");
                    }, that.errorHandler);
                }
                
            }
        );
    },
    /* 查询表信息*/
    tableInfo:function(){
        var that = this,
            db = that.connDB(),
            table = arguments[0]; 
        db.transaction(
            function(transaction) {
                transaction.executeSql('PRAGMA table_info ('+table+');', [], function(transaction,rs){}, that.errorHandler);
            }
        );
    },
    /* 插入数据 参数：表名、字段、数据；**先尝试创建，再插入数据** */
    insertData: function() {
        var that = this,
            db = that.connDB(),
            table = arguments[0],
            column = arguments[1],
            data = arguments[2];
        that.createTables(table,column);
        console.log(""); 
        console.log("---尝试插入数据"); 
        console.log("字段："+column);
        console.log("数据："+data);
        column = column.join(",");
        db.transaction(
            function(transaction) {
                //transaction.executeSql('INSERT INTO ' + table + '(id' + column.join(",") + ') VALUES (?,?,?)',data,function(){},that.errorHandler);
                //transaction.executeSql("INSERT INTO yarin(id, name, desc) VALUES (?, ?, ?)", [data[0], data[1], data[2]]);  
                transaction.executeSql("INSERT INTO " + table + "(" + column + ") VALUES ("+ that.print(data) +")", data, that.insertHandler, that.errorHandler);
            }
        );
        console.log("---尝试插入数据 | 结束"); 
    },

    /* 插入数据 参数：表名、字段、数据；**先尝试创建，再插入数据** */ 
    selectAll: function() {
        var that = this,
            db = arguments[0],
            table = arguments[1];
        db.transaction(
            function(transaction) {
                transaction.executeSql('SELECT * FROM ' + table + ';', [], function(transaction, rs) {
                    if (rs.rows.length > 0) {
                        for (var i = 0; i < rs.rows.length; i++) {
                            var row = rs.rows.item(i);
                            var time = new Date();
                            time.setTime(row.createtime);
                            var timeStr = time.format("yyyy-MM-dd hh:mm:ss");
                            console.log(row.id);
                            console.log(row);
                        }
                    } else {
                        console.log(table + "表内容为空");
                    }
                }, that.errorHandler);
            }
        );
    },
    updateData: function() {
        db.transaction(
            function(transaction) {
                var data = ['111', '222'];
                transaction.executeSql("UPDATE demo SET name=?, desc=? WHERE id = 2", [data[0], data[1]]);
            }
        );
        selectAll();
    },
    deleteTables: function() {
        var table = arguments[0];
        var shortName = 'JLD_O2O_DB'; //数据库名称
        var version = '1.0'; //数据库的版本号
        var displayName = 'O2O db'; //对数据库的描述
        var maxSize = 1024 * 1024; // 设置分配的数据库的大小（单位是kb）
        var db = openDatabase(shortName, version, displayName, maxSize);
        db.transaction(
            function(transaction) {
                transaction.executeSql("DROP TABLE " + table + ";", [], function(){}, this.errorHandler);
            }
        );
    },
    createHandler:function(transaction, rs){
        console.log("");
        console.log("表创建成功或已存在");
    },
    insertHandler: function(transaction, rs){
        console.log("");
        console.log("当前插入的ID为："+rs.insertId);
    },
    errorHandler: function(transaction, error) {
        if (error.code == 1) {
            console.log('数据库已经存在');
        } else {
            console.log('错误信息：' + error.message + '(错误代码：' + error.code + ')');
        }
        return false;
    },
    columnList: function() {
        var columnArr = arguments[0],
            html = '';
        for (var i = 0, l = columnArr.length; i < l; i++) {
            html += ', ' + columnArr[i] + ' TEXT';
        }
        return html;
    },
    print:function(){
        var data = arguments[0],
            html = '';
        for (var i = 0, l = data.length; i < l; i++) {
            if (i === 0) {
                html += '?';
            } else {
                html += ', ?';
            }
        }
        return html;
    }
};

//_sqlite.deleteTables('red_envelope');

Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month  
        "d+": this.getDate(), //day  
        "h+": this.getHours(), //hour  
        "m+": this.getMinutes(), //minute  
        "s+": this.getSeconds(), //second  
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter  
        "S": this.getMilliseconds() //millisecond  
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}
