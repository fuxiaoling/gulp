seajs.config({
  // 基础路径
  base: libsUrl,
  // 别名配置
  alias: {
	"global": systemUrl + 'global'
  },
  // 预加载项
  preload: [
    Function.prototype.bind ? '' : 'es5-safe',
    this.JSON ? '' : 'json'
  ],
  // 映射配置
  map: [
    [".js", ".js?" + new Date().getTime()]//给JS加上时间戳
  ],
  // 调试模式,true或2
  debug: false,
  // 文件编码
  charset: 'utf-8',
  //加载器等待脚本加载的最长时间，单位：毫秒
  timeout: 20000
});
var sysAlias = seajs.config().data.alias;
seajs.config().data.alias = newAlias.aliasIntegrate(sysAlias);
