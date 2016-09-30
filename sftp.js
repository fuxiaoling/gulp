/**
 * sftp配置
 * @type {Object}
 */
var sftp = {
	host: , 								//服务器host
	port:22, 								//端口号
	user:'ftp_001',							//ftp用户名
	pass:'123456',							//ftp密码
	srcRemotePath:'/development/gulp/src/',		//默认为根目录，远程上传目录，如果不存在，则按这个创建
	distRemotePath:'/development/gulp/dist/',		//默认为根目录，远程上传目录，如果不存在，则按这个创建
	remotePlatform:'windows'				//服务器类型，可选windows或unix
}
var sftpConfig = function() {
	return stfp;
};
module.exports = new sftpConfig();
//参考：https://www.npmjs.com/package/gulp-sftp#optionspassphrase