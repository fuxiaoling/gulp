window._web_public_app = {
    /* 根据ua，判定手机系统*/
    getUa: function() {
        var ua = window.navigator.userAgent.toLocaleLowerCase(),
            isApple = !!ua.match(/(ipad|iphone|mac)/i),
            isAndroid = !!ua.match(/android/i),
            isWinPhone = !!ua.match(/MSIE/i),
            ios6 = !!ua.match(/os 6.1/i);
        return { isApple: isApple, isAndroid: isAndroid, isWinPhone: isWinPhone, ios6: ios6 }
    },
    /* 执行唤起、下载动作 */
    openApp: function(json) {
        var _uaName = this.browserName(),
            self = this,
            platforms = self.getUa(),
            skipUrl = "",
            schemeURL = "",
            tcSchemeURL = "";
        if (json.param.businessParam == undefined) {
            if (json.param.schemeUrl == "h5Site") {
                schemeURL = json.param.refid + "?schemUrl=" + self.getSchemeUrl(json.param);
                tcSchemeURL = "tctravel://" + self.getSchemeUrl(json.param);
            } else {
                schemeURL = json.param.refid + "/" + self.getSchemeUrl(json.param);
                tcSchemeURL = "tctravel://" + self.getSchemeUrl(json.param);
            }

        } else {
            if (json.param.schemeUrl == "h5Site") {
                schemeURL = json.param.refid + "?schemUrl=" + self.getSchemeUrl(json.param) + "|" + self.getbusinessParam(json.param.schemeUrl, json.param.businessParam);
                tcSchemeURL = "tctravel://" + self.getSchemeUrl(json.param) + "|" + self.getbusinessParam(json.param.schemeUrl, json.param.businessParam);
            } else {
                schemeURL = json.param.refid + "/" + self.getSchemeUrl(json.param) + "|" + self.getbusinessParam(json.param.schemeUrl, json.param.businessParam);
                tcSchemeURL = "tctravel://" + self.getSchemeUrl(json.param) + "|" + self.getbusinessParam(json.param.schemeUrl, json.param.businessParam);
            }

        }
        tcSchemeURL = decodeURIComponent(tcSchemeURL).replace(/\|/g, "/");
        if (json.param.actionType == 0 || json.param.actionType == "0") {
            if (platforms.isAndroid) {
                skipUrl = "http://m.17u.cn/client/sj/" + schemeURL;
                if (_uaName == "WeiXin") {
                    window.location.href = "http://m.17u.cn/client/qr/" + schemeURL; //微信对m.17u.cn站点做了白名单
                } else if (_uaName == "sogousearch") {
                    window.location.href = "http://m.17u.cn/client/sj/" + schemeURL; //兼容搜狗浏览器
                }
                //针对uc做特殊处理
                else if (_uaName == "ucbrowser") {
                    window._web_public_app.iframeWake(tcSchemeURL);
                } else if (_uaName == "Chrome") {
                    window.location.href = "http://m.17u.cn/client/sj/" + schemeURL; //兼容谷歌浏览器
                } else {
                    window._web_public_app.iframeWake(skipUrl);
                }
            } else if (platforms.isApple) {
                if (_uaName == "Chrome" || _uaName == "Crios") {
                    window.location.href = tcSchemeURL; //兼容谷歌浏览器
                }
                //如果未安装客户端，ios6版本，Safari浏览解析地址出错
                else if (platforms.ios6 && _uaName == "Safari") {} else {
                    skipUrl = "http://m.17u.cn/client/sj/" + schemeURL;
                    if (_uaName == "WeiXin") {
                        window.location.href = "http://m.17u.cn/client/qr/" + schemeURL; //微信对m.17u.cn站点做了白名单
                    } else {
                        window._web_public_app.iframeWake(skipUrl);
                    }
                }
            }
        } else if (json.param.actionType == 1 || json.param.actionType == "1") {
            skipUrl = "http://m.17u.cn/client/dj/" + json.param.refid;
            if (_uaName == "WeiXin") {
                window.location.href = "http://m.17u.cn/client/qr/" + json.param.refid;
            } else {
                if (platforms.isApple) {
                    if (_uaName == "Chrome" || _uaName == "Safari" || _uaName == "Crios") {
                        window.location.href = "https://itunes.apple.com/cn/app/tong-cheng-lu-you-zhou-mo/id475966832?mt=8";
                    } else {
                        window._web_public_app.iframeWake(skipUrl);
                    }
                } else {
                    if (_uaName == "sogousearch") {
                        window.location.href = skipUrl; //兼容搜狗浏览器
                    } else {
                        window._web_public_app.iframeWake(skipUrl);
                    }
                }
            }
        } else {
            var wakeUrl = "http://m.17u.cn/client/sj/" + schemeURL,
                downUrl = "http://m.17u.cn/client/dj/" + json.param.refid;;
            if (platforms.isAndroid) {
                if (_uaName == "WeiXin") {
                    window.location.href = "http://m.17u.cn/client/qr/" + schemeURL; //微信对m.17u.cn站点做了白名单
                } else if (_uaName == "sogousearch") {
                    window.location.href = "http://m.17u.cn/client/sj/" + schemeURL; //兼容搜狗浏览器
                }
                //针对uc做特殊处理
                else if (_uaName == "ucbrowser") {
                    window._web_public_app.iframeWake(tcSchemeURL);
                } else if (_uaName == "Chrome") {
                    window.location.href = "http://m.17u.cn/client/sj/" + schemeURL; //兼容谷歌浏览器
                } else {
                    window._web_public_app.iframeWake(wakeUrl);
                }
                setTimeout(function() {
                    if (_uaName == "sogousearch") {
                        window.location.href = downUrl; //兼容搜狗浏览器
                    } else if (_uaName == "WeiXin") {} else {
                        window._web_public_app.iframeWake(downUrl);
                    }
                }, 1000);
            } else if (platforms.isApple) {
                if (_uaName == "Chrome" || _uaName == "Crios") {
                    window.location.href = tcSchemeURL; //兼容谷歌浏览器
                }
                //如果未安装客户端，ios6版本，Safari浏览解析地址出错
                else if (platforms.ios6 && _uaName == "Safari") {} else {
                    if (_uaName == "WeiXin") {
                        window.location.href = "http://m.17u.cn/client/qr/" + schemeURL; //微信对m.17u.cn站点做了白名单
                    } else {
                        window._web_public_app.iframeWake(wakeUrl);
                    }
                }
                setTimeout(function() {
                    if (_uaName == "Chrome" || _uaName == "Safari" || _uaName == "Crios") {
                        window.location.href = "https://itunes.apple.com/cn/app/tong-cheng-lu-you-zhou-mo/id475966832?mt=8";
                    } else if (_uaName == "WeiXin") {} else {
                        window._web_public_app.iframeWake(downUrl);
                    }
                }, 1000);
            }
        }
    },
    /*
     * 通过iframe唤起app
     **/
    iframeWake: function(url) {
        var c = document.createElement("div");
        c.style.visibility = "hidden";
        c.innerHTML = '<iframe src="' + url + '" scrolling="no" width="1" height="1"></iframe>';
        document.body.appendChild(c);
    },
    /*
     * 获取浏览器名称
     * */
    browserName: function() {
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
    },
    /**
     *通过传入参数获取schemeUrl
     */
    getSchemeUrl: function(data) {
        var schemeUrl = "";
        switch (data.schemeUrl) {
            //大首页
            case "tcHome":
                schemeUrl = "shouji.17u.cn|internal_v950v" + data.refid + "v|home|home";
                break;
                //酒店首页
            case "hotelHome":
                schemeUrl = "shouji.17u.cn|internal_v9001v" + data.refid + "v|hotel|home";
                break;
                //酒店列表
            case "hotelList":
                schemeUrl = "shouji.17u.cn|internal_v9002v" + data.refid + "v|hotel|list";
                break;
                //酒店详情
            case "hotelDetails":
                schemeUrl = "shouji.17u.cn|internal_v9003v" + data.refid + "v|hotel|details";
                break;
                //景区首页
            case "sceneryHome":
                schemeUrl = "shouji.17u.cn|internal_v9011v" + data.refid + "v|scenery|home";
                break;
                //景区列表
            case "sceneryList":
                schemeUrl = "shouji.17u.cn|internal_v9012v" + data.refid + "v|scenery|list";
                break;
                //景区详情
            case "sceneryDetails":
                schemeUrl = "shouji.17u.cn|internal_v9013v" + data.refid + "v|scenery|details";
                break;
                //景区预订
            case "sceneryBook":
                schemeUrl = "shouji.17u.cn|internal_v9014v" + data.refid + "v|scenery|book";
                break;
                //国内机票首页
            case "flightHome":
                schemeUrl = "shouji.17u.cn|internal_v9021v" + data.refid + "v|flight|home";
                break;
                //国内机票列表
            case "flightList":
                schemeUrl = "shouji.17u.cn|internal_v9022v" + data.refid + "v|flight|list";
                break;
                //国际机票首页
            case "interflightHome":
                schemeUrl = "shouji.17u.cn|internal_v9031v" + data.refid + "v|interflight|home";
                break;
                //国际机票列表
            case "interflightList":
                schemeUrl = "shouji.17u.cn|internal_v9032v" + data.refid + "v|interflight|list";
                break;
                //周边游首页-混合
            case "zhouMoYouHome":
                schemeUrl = "shouji.17u.cn|internal_v9041v" + data.refid + "v|h5|file|8|main.html%3Fwvc1=1%26wvc2=1";
                break;
                //周边游列表
            case "zhouMoYouList":
                schemeUrl = "shouji.17u.cn|internal_v9042v" + data.refid + "v|selftrip|list";
                break;
                //周边游详情
            case "zhouMoYouDetails":
                schemeUrl = "shouji.17u.cn|internal_v9043v" + data.refid + "v|selftrip|details";
                break;
                //出境游首页
            case "holidayHome":
                schemeUrl = "shouji.17u.cn|internal_v9051v" + data.refid + "v|holiday|home";
                break;
                //出境游列表
            case "holidayList":
                schemeUrl = "shouji.17u.cn|internal_v9052v" + data.refid + "v|holiday|list";
                break;
                //出境游详情
            case "holidayDetails":
                schemeUrl = "shouji.17u.cn|internal_v9053v" + data.refid + "v|holiday|details";
                break;
                //邮轮首页
            case "cruiseHome":
                schemeUrl = "shouji.17u.cn|internal_v9061v" + data.refid + "v|h5|file|3|main.html%3Fwvc1=1%26wvc2=1";
                break;
                //邮轮列表
            case "cruiseList":
                schemeUrl = "shouji.17u.cn|internal_v9062v" + data.refid + "v|h5|file|3|main.html%3Fwvc1=1%26wvc2=1%23%7ccalendar";
                break;
                //邮轮详情
            case "cruiseDetails":
                schemeUrl = "shouji.17u.cn|internal_v9063v" + data.refid + "v|h5|file|3|main.html%3Fwvc1=1%26wvc2=1%23%7cdetail";
                break;
                //火车首页
            case "trainHome":
                schemeUrl = "shouji.17u.cn|internal_v9071v" + data.refid + "v|train|home";
                break;
                //火车列表
            case "trainList":
                schemeUrl = "shouji.17u.cn|internal_v9072v" + data.refid + "v|train|list";
                break;
                //攻略首页
            case "guideHome":
                schemeUrl = "shouji.17u.cn|internal_v9081v" + data.refid + "v|guide|home";
                break;
                //用车首页
            case "yongCheHome":
                schemeUrl = "shouji.17u.cn|internal_v9091v" + data.refid + "v|yongche|singlehome";
                break;
                //用车首页
            case "busHome":
                schemeUrl = "shouji.17u.cn|internal_v9101v" + data.refid + "v|bus|home";
                break;
                //电影票首页
            case "movieHome":
                schemeUrl = "shouji.17u.cn|internal_v9111v" + data.refid + "v|movie|home";
                break;
                //电影票详情
            case "movieDetails":
                schemeUrl = "shouji.17u.cn|internal_v9112v" + data.refid + "v|movie|details";
                break;
                //发现首页
            case "discoverHome":
                schemeUrl = "shouji.17u.cn|internal_v9121v" + data.refid + "v|tchome|tchome";
                break;
                //客户端内部跳转h5页面
            case "h5Site":
                var siteUrl;
                if (!!data.siteUrl.match(/(http|http:|:)/i)) {
                    siteUrl = data.siteUrl.replace(/\http\:\/\//g, "");
                } else {
                    siteUrl = data.siteUrl;
                }
                schemeUrl = encodeURIComponent(siteUrl.replace(/\//g, "|"));
                break;
            case "selftripDetails":
                schemeUrl = "shouji.17u.cn|internal_v9131v" + data.refid + "v|selftrip|groupdetails";
                break;
            case "smartNoteHome":
                schemeUrl = "shouji.17u.cn|internal_v9141v" + data.refid + "v|h5|file|22|main.html%3Fwvc1=1%26wvc2=1%26wvc3=1";
                break;
            default:
                schemeUrl = "shouji.17u.cn|internal_v950v" + data.refid + "v|home|home";
                break;

        }
        return schemeUrl;
    },
    /**
     *获取拼接的参数
     */
    getbusinessParam: function(projectType, objParam) {
        var businessParam = "";
        switch (projectType) {
            //酒店列表
            case "hotelList":
                businessParam = encodeURIComponent(objParam.ctype + "_" + objParam.cId + "_" + objParam.smallcid + "_" + objParam.tagtype + "_" + objParam.tagid + "_" + objParam.tagname);
                break;
                //酒店详情
            case "hotelDetails":
                businessParam = encodeURIComponent(objParam.hotelId);
                break;
                //景区列表
            case "sceneryList":
                var cityid = "";
                if (objParam.cityid != "") {
                    cityid = "|" + objParam.cityid;
                }
                businessParam = encodeURIComponent(objParam.keyword + cityid);
                break;
                //景区详情
            case "sceneryDetails":
                businessParam = encodeURIComponent(objParam.sceneryId);
                break;
                //景区预订
            case "sceneryBook":
                businessParam = encodeURIComponent(objParam.sceneryId + "|" + objParam.priceId);
                break;
                //国内机票列表
            case "flightList":
                businessParam = encodeURIComponent(objParam.originAirportCode + "|" + objParam.arriveAirportCode + "|" + objParam.flyOffTime);
                break;
                //国际机票列表
            case "interflightList":
                businessParam = encodeURIComponent(objParam.originAirportCode + "|" + objParam.arriveAirportCode + "|" + objParam.flyOffTime);
                break;
                //周边游列表
            case "zhouMoYouList":
                businessParam = encodeURIComponent(objParam.keyword);
                break;
                //周边游详情
            case "zhouMoYouDetails":
                businessParam = encodeURIComponent(objParam.lineId);
                break;
                //出境游列表
            case "holidayList":
                var activityId = "",
                    timeId = "";
                if (objParam.activityId != "") {
                    activityId = "|" + objParam.activityId;
                }
                if (objParam.timeId != "") {
                    timeId = "|" + objParam.timeId;
                }
                businessParam = encodeURIComponent(objParam.cityName + activityId + timeId);
                break;
                //出境游详情
            case "holidayDetails":
                businessParam = encodeURIComponent(objParam.lineId);
                break;
            case "cruiseList":
                businessParam = encodeURIComponent(objParam.lineId);
                break;
            case "cruiseDetails":
                businessParam = encodeURIComponent(objParam.id + "|" + objParam.dataTime + "|" + objParam.naTag);
                break;
            case "movieDetails":
                businessParam = encodeURIComponent(objParam.movieId);
                break;
            case "discoverHome":
                businessParam = encodeURIComponent("?tab=" + objParam.tab);
                break;
                //火车票列表
            case "trainList":
                businessParam = encodeURIComponent(objParam.startPlace + "|" + objParam.endPlace);
                break;
                //快乐周末详情
            case "selftripDetails":
                businessParam = encodeURIComponent("?srid=" + objParam.lineId);
                break;
            default:
                break;
        }
        return businessParam;
    }
}
