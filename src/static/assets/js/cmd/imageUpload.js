define('ImageUpload',function(require,exports,module){
	var $ = require('jquery');
	module.exports = ImageUpload;
	function ImageUpload (options){
		if(!(this instanceof ImageUpload)){
			return new ImageUpload(options);
		}
		var config = {
			fileInput: null,				//html file控件
			dragDrop: null,					//拖拽敏感区域
			upButton: null,					//提交按钮
			url: "",						//ajax地址
			num: 99,						//当前可上传图片的总数量
			oldNum: 99,                     //页面已有默认图片数量
			fileFilter: [],					//过滤后的文件数组
			filter: function(files) {		//选择文件组的过滤方法
				return files;	
			},
			cindex: function() {},			//获取当前触发图片的标示
			resetFile:function() {},        //重设input上传控件值
			onSelect: function() {},		//文件选择后
			onDelete: function() {},		//文件删除后
			onDragOver: function() {},		//文件拖拽到敏感区域时
			onDragLeave: function() {},		//文件离开到敏感区域时
			onProgress: function() {},		//文件上传进度
			onSuccess: function() {},		//文件上传成功时
			onFailure: function() {},		//文件上传失败时
			onComplete: function() {}		//文件全部上传完毕时
		},opts = $.extend({}, config, options);
		this.fileInput = opts.fileInput,
		this.dragDrop = opts.dragDrop,
		this.upButton = opts.upButton,
		this.url = opts.url,
		this.num = opts.num,
		this.oldNum = opts.oldNum,
		this.fileFilter = opts.fileFilter,
		this.filter = opts.filter,
		this.cindex = opts.cindex,
		this.resetFile = opts.resetFile,
		this.onSelect = opts.onSelect,
		this.onDelete = opts.onDelete,
		this.onDragOver = opts.onDragOver,
		this.onDragLeave = opts.onDragLeave,
		this.onProgress = opts.onProgress,
		this.onSuccess = opts.onSuccess,
		this.onFailure = opts.onFailure;
		this.init();
		//删除对应的文件
		this.funDeleteFile = function(files,fileDelete,triggerDom) {
			
			//console.log("删除对应的文件");
			var arrFile = [];
			for (var i = 0, file; file = this.fileFilter[i]; i++) {
				if (file != fileDelete) {
					arrFile.push(file);
				}
			}
			this.fileFilter = arrFile;
			this.funDealFiles();
			if( this.oldNum-1 < this.num){
				triggerDom.show();
			}
			return this;
		}

		
	}
	//入口
	ImageUpload.prototype.init = function(){
		//console.log("开始");
		var self = this;
		//上传区域监听拖放
		if (this.dragDrop) {
			this.dragDrop.addEventListener("dragover", function(e) { self.funDragHover(e); }, false);
			this.dragDrop.addEventListener("dragleave", function(e) { self.funDragHover(e); }, false);
			this.dragDrop.addEventListener("drop", function(e) { self.funGetFiles(e); }, false);
		}
		//文件选择控件选择
		if (this.fileInput) {
			this.fileInput.addEventListener("change", function(e) { self.funGetFiles(e); }, false);	
		}
		//上传按钮提交
		if (this.upButton) {
			this.upButton.addEventListener("click", function(e) { self.funUploadFile(e); }, false);	
		}
	}
	//文件拖放
	ImageUpload.prototype.funDragHover = function(e) {
		//console.log("文件拖放");
		e.stopPropagation();
		e.preventDefault();
		this[e.type === "dragover"? "onDragOver": "onDragLeave"].call(e.target);
		return this;
	}
	//获取选择文件，file控件或拖放
	ImageUpload.prototype.funGetFiles = function(e) {
		//this.funDragHover(e);// 取消鼠标经过样式
		// 获取新选择的附件对象
		var self = this;
		var files = e.target.files || e.dataTransfer.files;
		//修改状态下只获取一个图片
		if(this.cindex() != "add"  && files.length > 1){
			self.resetFile();
			alert("请选择一张图片！");
			return false;
		}else{
			//添加新对象至原来列表中
			this.fileFilter = this.fileFilter.concat(this.filter(files));
			this.funDealFiles();
			return this;
		}
	}
	//选中文件的处理与回调
	ImageUpload.prototype.funDealFiles = function() {
		//console.log("选中文件的处理与回调");
		//删除超出最大数量的图片
		var sfile = this.fileFilter;
		var length = sfile.length;
		var k = this.num - this.oldNum;
		var count = length - k;
		sfile.splice(k,count);
		for (var i = 0, file; file = this.fileFilter[i]; i++) {
			//增加唯一索引值
			file.index = i;
		}
		//执行选择回调
		this.onSelect(this.fileFilter,this.cindex());
		return this;
	}

	//文件上传
	ImageUpload.prototype.funUploadFile = function() {
		//console.log("选中文件的处理与回调");
		//待定
		var self = this;	
		if (location.host.indexOf("sitepointstatic") >= 0) {
			//非站点服务器上运行
			return;	
		}
		for (var i = 0, file; file = this.fileFilter[i]; i++) {
			(function(file) {
				var xhr = new XMLHttpRequest();
				if (xhr.upload) {
					// 上传中
					xhr.upload.addEventListener("progress", function(e) {
						self.onProgress(file, e.loaded, e.total);
					}, false);
		
					// 文件上传成功或是失败
					xhr.onreadystatechange = function(e) {
						if (xhr.readyState == 4) {
							if (xhr.status == 200) {
								self.onSuccess(file, xhr.responseText);
								self.funDeleteFile(file);
								if (!self.fileFilter.length) {
									//全部完毕
									self.onComplete();	
								}
							} else {
								self.onFailure(file, xhr.responseText);		
							}
						}
					};
					// 开始上传
					xhr.open("POST", self.url, true);
					xhr.setRequestHeader("X_FILENAME", file.name);
					xhr.send(file);
				}	
			})(file);	
		}
	}





});