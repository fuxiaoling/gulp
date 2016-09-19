define("openApp", ["$"], function($) {
    "use strict";
    //  cn.jld://shared?xxx=xxx&xxx=xxx
    /* openApp模块 config项可在业务脚本页进行ajax获取 */
    var openApp = function(options) { //URL拆分设置，以免后期需要单独进行判断
        var config = {
                //唤醒协议
                scheme: "alipays://",
                //唤醒页面
                relativePath: "platformapi/startapp",
                //intent URL 安卓下chrome使用
                intentUrl:'intent://platformapi/startapp?appId=20000001&_t=1464601210564#Intent;scheme=alipays;package=com.eg.android.AlipayGphone;end',//安卓下chr
                //sppstore URL
                skipApple: "https://itunes.apple.com/us/app/qq-you-xiang/id473225145?mt=8",
                //安卓市场 URL
                skipAndroid: "http://zhushou.360.cn/detail/index/soft_id/83720",
                //微信-微下载 URL
                skipWechat: "http://zhushou.360.cn/soft/parter/goto/s_appchina/", //微下载地址
                //官网下载 URL
                skipWeb: "http://shouji.17u.cn/#page2"
            },
            opts = $.extend({}, config, options);
        this.opts = opts;
        this.open();
    };
    /* 唤醒参数  针对APP页面，手工列出APP页面请求参数 */
    openApp.prototype.getQuery = function() {
        var query = "",
            self = this;
        switch (self.opts.relativePath) {
            //分享页
            case "platformapi/startapp":
                query = "?appId=20000001&_t=1464601210564";
                break;
            //默认页参数为空
            default:
                query = "";
                break;
        }
        return query;
    };
    /* 主要逻辑 */
    openApp.prototype.open = function() {
        var _uaName = this.browserName(), //浏览器标识
            self = this,
            platforms = self.getUa(), //应用版本标识
            downUrl = "", //跳转地址，先判断设备UA
            wakeURL = ""; //唤醒地址，先判断设备UA
        wakeURL = self.opts.scheme + self.opts.relativePath + self.getQuery();//拼接scheme执行地址 安卓和苹果暂时一致
        //如果设备为windows系统
        if (platforms.isWindows) {
            downUrl = self.opts.skipWeb;
            window.location.href = downUrl;
        }
        //如果设备是android系统
        else if (platforms.isAndroid) {
            downUrl = self.opts.skipAndroid;
            if (_uaName == "WeiXin") { //微信屏蔽了所有scheme，只能从白名单跳转
                window.location.href = self.opts.skipWechat;
            }
            else if (_uaName == "Chrome") {
                window.location.href = self.opts.intentUrl; //兼容谷歌浏览器
            } else {
                self.iframeWake(wakeURL);
            }
            //以上为唤醒代码，以下为延迟移除唤醒并跳转到下载页
            setTimeout(function() {
                if (_uaName == "WeiXin") {
                    window.location.href = downUrl;
                } else {
                    self.iframeWake(downUrl);
                }
            }, 1000);
        } 
        //如果设备是ios系统
        else if (platforms.isApple) {
            downUrl = self.opts.skipApple;
            if (_uaName == "Chrome" || _uaName == "Crios") { //Chrome for iOS
                window.location.href = downUrl; //兼容谷歌浏览器
            }
            //如果未安装客户端，ios6版本，Safari浏览解析地址出错
            else if (platforms.ios6 && _uaName == "Safari") {
               
            } else {
                if (_uaName == "WeiXin") {
                    window.location.href = self.opts.skipWechat;
                } else {
                    self.iframeWake(wakeURL);
                }
            }
            setTimeout(function() {
                if (_uaName == "Chrome" || _uaName == "Safari" || _uaName == "Crios") {
                    window.location.href = downUrl;
                } else if (_uaName == "WeiXin") {

                } else {
                    self.iframeWake(downUrl);
                }
            }, 1000);
        }
    };

    /* 使用iframe进行唤醒 */
    openApp.prototype.iframeWake = function(url) {
        var c = document.createElement("div");
        c.style.visibility = "hidden";
        c.innerHTML = '<iframe src="' + url + '" scrolling="no" width="1" height="1"></iframe>';
        document.body.appendChild(c);
    };
    /* 判断设备 */
    openApp.prototype.getUa = function() {
        var ua = window.navigator.userAgent.toLocaleLowerCase(),
            isWindows = !!ua.match(/(windows)/i),
            isApple = !!ua.match(/(ipad|iphone|mac)/i),
            isAndroid = !!ua.match(/android/i),
            isWinPhone = !!ua.match(/MSIE/i),
            ios6 = !!ua.match(/os 6.1/i);
        return { isWindows: isWindows, isApple: isApple, isAndroid: isAndroid, isWinPhone: isWinPhone, ios6: ios6 }
    };
    /* 判断浏览器 */
    openApp.prototype.browserName = function() {
        var ua = window.navigator.userAgent.toLowerCase();
        var browser = "";
        if (window.ActiveXObject) {
            browser = "IE"
        } else {
            if (document.getBoxObjectFor || ua.indexOf("firefox") > -1) {
                browser = "Firefox"
            } else {
                if (ua.indexOf("micromessenger") > -1) {
                    browser = "WeiXin";
                } else {
                    if (ua.indexOf("baidu") != -1) {
                        browser = "baidubrowser";
                    } else {
                        if (ua.indexOf("ucbrowser") != -1) {
                            browser = "ucbrowser";
                        } else {
                            if (ua.indexOf("miuibrowser") > -1) {
                                browser = "miuibrowser";
                            } else {
                                if (ua.indexOf("lbbrowser") > -1) {
                                    browser = "lbbrowser";
                                } else {
                                    if (ua.indexOf("qqbrowser") > -1) {
                                        browser = "qqbrowser";
                                    } else {
                                        if (ua.indexOf("qhbrowser") > -1) {
                                            browser = "qhbrowser";
                                        } else {
                                            if (ua.indexOf("hao123") > -1) {
                                                browser = "hao123";
                                            } else {
                                                if (ua.indexOf("sogoumobilebrowser") > -1) {
                                                    browser = "sogousearch";
                                                } else {
                                                    if (ua.indexOf("crios") > -1) {
                                                        browser = "Crios";
                                                    } else {
                                                        if (ua.indexOf("chrome") > -1) {
                                                            browser = "Chrome";
                                                        } else {
                                                            if (window.opera) {
                                                                browser = "Opera";
                                                            } else {
                                                                if (ua.indexOf("safari") > -1) {
                                                                    browser = "Safari";
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return browser;
    };
    return openApp;
});
