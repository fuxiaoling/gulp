define('Ajax',function(require, exports, module) {
	exports.syncAjax = function(url, type, data){
		return ajax.sync(url, type, data);
	};
	
	exports.get = function(url, callback, type){
		return ajax.get(url, callback, type);
	};
	
	exports.getScript = function(url, callback){
		return ajax.getScript(url, callback);
	};

	exports.getHTML = function(url, callback){
		return ajax.getHTML(url, callback);
	};
	
	exports.getJSON = function(url, callback){
		return ajax.getJSON(url, callback);
	};

	exports.getJSONP = function(url, callback) {
		return ajax.getJSONP(url, callback);
	};	
	
	exports.getJSONPS = function(url, callback) {
		return ajax.getJSONPS(url, callback);
	};
	
	exports.post = function(url, data, callback, type) {
		return ajax.post(url, data, callback, type);
	};
	var ajax = {
		/**
		 * @name sync
		 * @description 同步AJAX请求
		 * @param {String} url AJAX请求的后台地址
		 * @param {String} type AJAX请求的方式
		 * @param {Object} data AJAX请求的方式
		 * 
		 */
		sync : function(url, type, data){
			type = (type == null) ? 'get' : type;
			data = (data == null) ? null : data;
			var result = {};
			this.init({
				type : type,
				url : url,
				data : data,
				dataType : 'text',
				success : function(data){
					result = data;
				},
				async : false
			});
			return result;
		},

		/**
		 * @name get
		 * @description 通过get的type方式进行ajax的请求
		 * @param {String} url AJAX请求的后台地址
		 * @param {Function} callback AJAX成功后的回调函数
		 * @param {String} type AJAX请求的方式
		 * 
		 */
		get : function(url, callback, type) {
	        type = (type == null) ? 'text' : type;
	        return this.init( {
	            type : "GET",
	            url : url,
	            success : callback,
	            dataType : type
	        });
		},
		
		/**
		 * @name getScript
		 * @description 取得返回的script
		 * @param {String} url AJAX请求的后台地址
		 * @param {Function} callback AJAX成功后的回调函数
		 * 
		 */
		getScript : function(url, callback) {
			return this.get(url, callback, "script");
		},

		/**
		 * @name getHTML
		 * @description 取得返回的HTML
		 * @param {String} url AJAX请求的后台地址
		 * @param {Function} callback AJAX成功后的回调函数
		 * 
		 */
		getHTML : function(url, callback) {
			return this.get(url, callback, "html");
		},
			
		/**
		 * @name getJSON
		 * @description JSON方式AJAX请求
		 * @param {String} url AJAX请求的后台地址
		 * @param {Function} callback AJAX成功后的回调函数
		 * 
		 */
		getJSON : function(url, callback) {
			return this.get(url, callback, "json");
		},
		
		/**
		 * @name getJSONP
		 * @description AJAX跨域
		 * @param {String} url AJAX请求的后台地址
		 * @param {Function} callback AJAX成功后的回调函数
		 * 
		 */
		getJSONP : function(url, callback) {
			return this.get(url, callback, "jsonp");
		},

		getJSONPS : function(url, callback) {
			return this.get(url, callback, "jsonps");
		},
		
		/**
		 * @name post
		 * @description 以post方式进行AJAX请求
		 * @param {String} url AJAX请求的后台地址
		 * @param {String} data AJAX请求的参数
		 * @param {Function} callback AJAX成功后的回调函数
		 * @param {String} type AJAX结果数据返回的类型
		 * 
		 */
		post : function(url, data, callback, type) {
	        return this.init( {
	            type : "POST",
	            url : url,
	            data : data,
	            success : callback,
	            dataType : type
			});
		},
	    
		//默认的ajax的请求参数
		ajaxSettings : {
			url : location.href,//默认是地址栏中url
			global : true,//默认支持全局的ajax事件
			type : "GET",
			timeout : 0,
			contentType : "application/x-www-form-urlencoded",//data的内容的形式
			processData : true,
			async : true,
			data : null,
			username : null,
			password : null,
			accepts : {
				xml : "application/xml, text/xml",
				html : "text/html",
				script : "text/javascript, application/javascript",
				json : "application/json, text/javascript",
				text : "text/plain",
				_default : "*/*"
			}
		},
		
		//为下一次请求缓存Last-Modified header 
		lastModified : {},
		
		//处理默认数组参数
		extend:function(obj,options){
			for(var o in options){
				obj[o] = options[o];
			}
			return obj;
		},

		handleError : function(s, xhr, status, e) {
			// 本地的回调
			if (s.error) s.error(xhr, status, e);
		},
		
		// 激活查询的个数
		active : 0,
		
		// 判断XMLHttpRequest是否成功
		httpSuccess : function(xhr) {
			try {
				return !xhr.status && location.protocol == "file:"
						|| (xhr.status >= 200 && xhr.status < 300)
						|| xhr.status == 304 || xhr.status == 1223
						|| this.browser.safari && xhr.status == undefined;
			} catch (e) {
			}
			return false;
		},
		
		// 判断XMLHttpRequest是否返回没有修改（304）
		httpNotModified : function(xhr, url) {
			try {
				var xhrRes = xhr.getResponseHeader("Last-Modified");

				// Firefox 永远返回 200.检测 Last-Modified 数据
				return xhr.status == 304 || xhrRes == this.lastModified[url]
						|| this.browser.safari && xhr.status == undefined;
			} catch (e) {
			}
			return false;
		},
		
		//处理请求返回的数据
		httpData : function(xhr, type, s) {
			var ct = xhr.getResponseHeader("content-type"), 
			    xml = type == "xml"	|| !type && ct && ct.indexOf("xml") >= 0, 
			    data = xml? xhr.responseXML	: xhr.responseText;

			if (xml && data.documentElement.tagName == "parsererror")
				throw "parsererror";

			//允许一个pre-filtering函数清洁repsonse		
			if (s && s.dataFilter)
				data = s.dataFilter(data, type);

			//json，生成json对象。
			if (type == "json")
				data = eval("(" + data + ")");

			return data;
		},

		// 串行化form子元素组成的数组或对象形式查询字符串
		param : function(a) {
			var s = [];
			function add(key, value) {
				s[s.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
			};

			// 对于数组的参数，每个元素({name:xx,value:yy})都串行化为key/value的字符串。
			if (typeof a == 'object')
			{
				for (key in a){
					add(key, a[key]);
				};
			}
			
			// 返回生成字符串
			return s.join("&").replace(/%20/g, "+");
		},
		
		// 计算出浏览器的相关信息
		browser : {
			version : (navigator.userAgent.toLowerCase().match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, '0'])[1],
			safari : /webkit/.test(navigator.userAgent.toLowerCase()),
			opera : /opera/.test(navigator.userAgent.toLowerCase()),
			msie : /msie/.test(navigator.userAgent.toLowerCase()) && !/opera/.test(navigator.userAgent.toLowerCase()),
			mozilla : /mozilla/.test(navigator.userAgent.toLowerCase())
				&& !/(compatible|webkit)/.test(navigator.userAgent.toLowerCase())
		},
		
		init : function(s) {
			var self = this;
			s = this.extend(this.ajaxSettings, s);

			var jsonp, jsre = /=\?(&|$)/g, status, data, type = s.type.toUpperCase();
			// 如果不是字符集串就转换在查询字符集串
			if (s.data && s.processData && typeof s.data != "string"){
				s.data = this.param(s.data);
			}

			// 构建jsonps请求字符集串。jsonp是跨域请求，要加上callback=callback
			if (s.dataType == "jsonps") {
				if (type == "GET") {//使get的url包含 callback=？后面将会进行加函数名
					if (!s.url.match(jsre))
						s.url += (s.url.match(/\?/) ? "&" : "?")
								+ (s.jsonp || "callback") + "=callback";
				}

				jsonp = "callback";
				s.dataType = "script";

				//window下注册一个jsonp回调函数有，让ajax请求返回的代码调用执行它，
				//在服务器端我们生成的代码 如callbackname(data);形式传入data.
				window[jsonp] = function(tmp) {
					data = tmp;//data是全局变量,window下的
					success();
					complete();
					// 垃圾回收,释放联变量，删除jsonp的对象，除去head中加的script元素
					window[jsonp] = undefined;
					try {
						delete window[jsonp];
					} catch (e) {}
					if (head)
						//head.removeChild(script);解决IE6的bug
						script.parentNode.removeChild(script);
				};
			}	

			// 构建jsonp请求字符集串。jsonp是跨域请求，要加上callback=？后面将会进行加函数名
			if (s.dataType == "jsonp") {
				if (type == "GET") {//使get的url包含 callback=？后面将会进行加函数名
					if (!s.url.match(jsre))
						s.url += (s.url.match(/\?/) ? "&" : "?") + (s.jsonp || "callback") + "=?";
				} // 构建新的s.data，使其包含callback=function name
				else if (!s.data || !s.data.match(jsre))
					s.data = (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?";
							
				s.dataType = "json";
			}
			//判断是否为jsonp,如果是，进行处理。
			if (s.dataType == "json" && (s.data && s.data.match(jsre) || s.url.match(jsre))) {
				jsonp = "jsonp" + new Date().getTime();

				//为请求字符集串的callback=加上生成回调函数名
				if (s.data)
					s.data = (s.data + "").replace(jsre, "=" + jsonp + "$1");
				s.url = s.url.replace(jsre, "=" + jsonp + "$1");

				// 我们需要保证jsonp 类型响应能正确地执行
				//jsonp的类型必须为script。这样才能执行服务器返回的
				//代码。这里就是调用这个回调函数。
				s.dataType = "script";

				//window下注册一个jsonp回调函数有，让ajax请求返回的代码调用执行它，
				//在服务器端我们生成的代码 如callbackname(data);形式传入data.
				window[jsonp] = function(tmp) {
					data = tmp;//data是全局变量,window下的
					success();
					complete();
					// 垃圾回收,释放联变量，删除jsonp的对象，除去head中加的script元素
					window[jsonp] = undefined;
					try {
						delete window[jsonp];
					} catch (e) {
					}
					if (head)
						//head.removeChild(script);解决IE6的bug
						script.parentNode.removeChild(script);
				};
			}

			if (s.dataType == "script" && s.cache == null)
				s.cache = false;

			// 加上时间戳，可见加cache:false就会加上时间戳
			if (s.cache === false && type == "GET") {
				var ts = new Date().getTime();
				var ret = s.url.replace(/(\?|&)_=.*?(&|$)/, "$1_=" + ts + "$2");
				// 没有代替，就追加在url的尾部
				s.url = ret + ((ret == s.url) ? (s.url.match(/\?/) ? "&" : "?") + "_=" + ts : "");
			}

			// data有效，追加到get类型的url上去
			if (s.data && type == "GET") {
				s.url += (s.url.match(/\?/) ? "&" : "?") + s.data;

				// 防止IE会重复发送get和post data
				s.data = null;
			}

			// 监听一个绝对的url,和保存domain
			var parts = /^(\w+:)?\/\/([^\/?#]+)/.exec(s.url);

			// 如果我们正在请求一个远程文档和正在load json或script通过get类型
			//location是window的属性，通过和地址栏中的地址比较判断是不是跨域。
			if (s.dataType == "script"	&& type == "GET" && parts){
					//&& (parts[1] && parts[1] == location.protocol || parts[2] == location.host)) {
				// 在head中加上<script src=""></script>
				var head = document.getElementsByTagName("head")[0];
				var script = document.createElement("script");
				script.src = s.url;
				if (s.scriptCharset)
					script.charset = s.scriptCharset;

				//如果datatype不是jsonp，但是url却是跨域的。采用scriptr的
				//onload或onreadystatechange事件来触发回调函数。
				if (!jsonp) {
					var done = false;

					// 对所有浏览器都加上处理器
					script.onload = script.onreadystatechange = function() {
						if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
							done = true;
							success();
							complete();
							head.removeChild(script);
						}
					};
				}

				head.appendChild(script);

				// 已经使用了script 元素注射来处理所有的事情
				return undefined;
			}

			var requestDone = false;

			// 创建request,IE7不能通过XMLHttpRequest来完成，只能通过ActiveXObject
			var xhr = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();

			// Open the socket
			// Passing null username, generates a login popup on Opera (#2865)
			// 创建一个请求的连接，在opera中如果用户名为null会弹出login窗口中。
			if (s.username)
				xhr.open(type, s.url, s.async, s.username, s.password);
			else
				xhr.open(type, s.url, s.async);

			// try/catch是为防止FF3在跨域请求时报错
			try {
				// 设定Content-Type
				if (s.data)
					xhr.setRequestHeader("Content-Type", s.contentType);

				// 设定If-Modified-Since
				if (s.ifModified)
					xhr.setRequestHeader("If-Modified-Since", this.lastModified[s.url] || "Thu, 01 Jan 1970 00:00:00 GMT");

				// 这里是为了让服务器能判断这个请求是XMLHttpRequest
				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

				// 设定 Accepts header 。指能接收的content-type，在服务器端设定
				xhr.setRequestHeader("Accept", s.dataType && s.accepts[s.dataType] ? s.accepts[s.dataType] + ", */*" : s.accepts._default);
			} catch (e) { }

			//拦截方法，我们可以在send之前进行拦截。返回false就不send
			if (s.beforeSend && s.beforeSend(xhr, s) === false) {
				// 清除active 请求计数
				s.global && this.active--;
				// close
				xhr.abort();
				return false;
			}

			// 等待response返回，主要是为后面setInterval用。
			var onreadystatechange = function(isTimeout) {
				// 接收成功或请求超时
				if (!requestDone && xhr && (xhr.readyState == 4 || isTimeout == "timeout")) {
					requestDone = true;
					
	               //清除定时器
					if (ival) {
						clearInterval(ival);
						ival = null;
					}
					
					// 分析status:tiemout-->error-->notmodified-->success
					status = isTimeout == "timeout" ? "timeout" : (!self.httpSuccess ? "error" : (s.ifModified && self.httpNotModified(xhr, s.url) ? "notmodified" : "success"));
	                 
					//如果success且返回了数据，那么分析这些数据
					if (status == "success") {					
						try {						
							data = self.httpData(xhr, s.dataType, s);
						} catch (e) {
							status = "parsererror";
						}
					}

					// 分析数据成功之后,进行last-modified和success的处理。				
					if (status == "success") {
						// Cache Last-Modified header, if ifModified mode.
						var modRes;
						try {
							modRes = xhr.getResponseHeader("Last-Modified");
						} catch (e) {
							//FF中如果head取不到，会抛出异常
						} 
						//保存last-mordified的标识。
						if (s.ifModified && modRes)
							self.lastModified[s.url] = modRes;

						// JSONP 有自己的callback
						if (!jsonp)
							success();
					} else{
						// 失败时的处理
						self.handleError(s, xhr, status);
					}
					// 无论如何都进行cpmplate.timeout和接收成功
					complete();

					// 防内存泄漏
					if (s.async) xhr = null;
				}
			};

			if (s.async) {
				// 这里是采用poll的方式，不是push的方式
				//这里为什么不采用onreadystatechange？
				var ival = setInterval(onreadystatechange, 13);

				//如果过了timeout还没有请求到，会中断请求的。
				if (s.timeout > 0)
					setTimeout(function() {					
							if (xhr) {							
								xhr.abort();

								if (!requestDone)
									onreadystatechange("timeout");
							}
						}, s.timeout);
			}

			// 发送
			try {
				xhr.send(s.data);
			} catch (e) {
				self.handleError(s, xhr, null, e);
			}

			// firefox 1.5 doesn't fire statechange for sync requests
			if (!s.async)
				onreadystatechange();

			function success() {
				// 调用构建请求对象时指定的success回调。
				if (s.success) s.success(data, status);
			}

			function complete() {
				// 本地的回调
				if (s.complete) s.complete(xhr, status);
			}

			// return XMLHttpRequest便进行about()或其它操作.
			return xhr;
		}
	};
});