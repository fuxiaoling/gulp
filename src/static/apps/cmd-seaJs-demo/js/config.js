/* 系统模块配置 */
if(document.getElementById("ENTRY") === null){
  var _SYSTEMURL = static_folder + 'apps/cmd-seaJs-demo/js/';
}
seajs.config({
  // 基础路径
  base: _LIBSURL,
  // seaJs模块别名配置
  alias: {
	"global": _SYSTEMURL + 'global'
  },
  // seaJs预加载项
  preload: [
    Function.prototype.bind ? '' : 'es5-safe',
    this.JSON ? '' : 'json'
  ],
  // seaJs映射配置
  map: [
    [".js", ".js?" + new Date().getTime()]//给JS加上时间戳
  ],
  // 调试模式
  debug: false,
  // 文件编码
  charset: 'utf-8',
  //加载器等待脚本加载的最长时间，单位：毫秒
  timeout: 20000
});
/* 完整化alias */
(function(){
  var sysAlias = seajs.config().data.alias;
  seajs.config().data.alias = newAlias.aliasIntegrate(sysAlias,'cmd');
})();