define('DC',function(require,exports,module){
	var $ = require('jquery');
	var Calender = require("arale/calendar/1.0.0/calendar");
	var css = require("arale/calendar/1.0.0/calendar.css");
	var Util = require("util");
	var gettime = Util.getDay(0);
	exports.dc = function(startTime,endTime,seal){
		var startTime = startTime,endTime = endTime;
		var time = seal || seal=="" ? null : gettime;
		var stime = new Calender({
			trigger: startTime,
			format: 'YYYY-MM-DD',
			range: [null,time]
		});
		var etime = new Calender({
			trigger: endTime,
			format: 'YYYY-MM-DD',
			range: [null,time]
		});
		stime.on('selectDate', function(date) {
			etime.range([date, time]);
			var endTimeVal= $(endTime).val();
			if(endTimeVal === ""){
				etime.show();
			}
		});
		etime.on('selectDate', function(date) {
			stime.range([null,date]);
			var startTimeVal= $(startTime).val();
			if(startTimeVal == ""){
				stime.show();
			}
		});
	}
	exports.dc_s = function(startTime,endTime,range_s,range_e){
		var startTime = startTime,endTime = endTime;
		var time = null;
		if(!range_s){
			range_s = [null,time];
		}if(!range_e){
			range_e = [null,time];
		}
		var stime = new Calender({
			trigger: startTime,
			format: 'YYYY-MM-DD',
			range: range_s
		});
		var etime = new Calender({
			trigger: endTime,
			format: 'YYYY-MM-DD',
			range: range_e
		});
		stime.on('selectDate', function(date) {
			etime.range([date, time]);
			var endTimeVal= $(endTime).val();
			if(endTimeVal === ""){
				etime.show();
			}
		});
		etime.on('selectDate', function(date) {
			stime.range([null,date]);
			var startTimeVal= $(startTime).val();
			if(startTimeVal == ""){
				stime.show();
			}
		});
	}
	exports.date = function(date,seal){
		var date = date;
		var time = seal || seal=="" ? null : gettime;
		var sdate = new Calender({
			trigger: date,
			format: 'YYYY-MM-DD',
			range: [null,time]
		});
	}


});