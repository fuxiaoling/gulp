require(['$', 'msui', 'openApp'], function($, Msui, openApp) {
    "use strict";
    /* 本页配置*/
    var pageConf = {
        inviteCode:"inviteCode", //设置邀请人标识名
        getInviteCode:function(){ //获取邀请人标识码
            var reg = new RegExp("(^|&)" + this.inviteCode + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)
                return r[2];
            return null;
        },
        ajaxUrl: _router.ajaxHeadUrl+"/red-envelope.json" //验证手机号请求地址
    };
    /* 判断浏览器类型：该页面由浏览器访问，所以同时判断IE */
    var browser = {
        userAgent: navigator.userAgent,
        isIE: function() {
            return this.userAgent.indexOf("compatible") > -1 && this.userAgent.indexOf("MSIE") > -1 && !isOpera;
        },
        isFirefox: function() {
            return this.userAgent.indexOf("Firefox") > -1;
        },
        isSafari: function() {
            return this.userAgent.indexOf("Safari") > -1 && this.userAgent.indexOf("Chrome") < 1;
        },
        isChrome: function() {
            return this.userAgent.indexOf("Chrome") > -1;
        },
        isOpera: function() {
            return this.userAgent.indexOf("Opera") > -1;
        }
    };
    /*根据图片高宽，获取高/宽的百分比*/
    var setHeight = function(sUrl, node, cb) {
        var img = new Image(),
            docWidth = $('.page').width(),
            result = '';
        img.src = sUrl + '?t=' + Math.random();
        if(node !== '.container') docWidth = $(node).width();
        if (browser.isIE()) {
            img.onreadystatechange = function() {
                if (this.readyState == "loaded" || this.readyState == "complete") {
                    var b = parseFloat(img.height) / parseFloat(img.width),
                        h = docWidth * b;
                    $(node).height(h);
                    cb($(node).width(),$(node).height());
                }
            };
        } else if (browser.isFirefox() || browser.isSafari() || browser.isOpera() || browser.isChrome()) {
            img.onload = function() {
                var b = parseFloat(img.height) / parseFloat(img.width),
                    h = docWidth * b;
                $(node).height(h);
                cb($(node).width(),$(node).height());
            }
        } else {
            var b = parseFloat(img.height) / parseFloat(img.width),
                h = docWidth * b;
            $(node).height(h);
            cb($(node).width(),$(node).height());
        }
    };
    /* 显示弹窗 */
    var show = function(){
        var arg = arguments[0];
        $('.'+arg).show();
        setHeight(_CONF.sDomain()+"/apps/v1.0/img/red-envelope-"+arg+".png", '.'+arg+'-box', function(w,h) {
            $('.'+arg+'-box').css({"margin-left":"-"+ w/2 +"px","margin-top":"-"+ w/2 +"px"});
            $('a.wake').css({ "line-height": $('.'+arg+' a.wake').height() + 'px' });
        });
    };
    /* 主界面 */
    setHeight(_CONF.sDomain()+"/apps/v1.0/img/red-envelope-bg.png", '.container', function(h) {
        var placeholder = '.phone-input label.placeholder',
            iconNode = '.phone-input span.icon',
            inputNode = '.phone-input input.input',
            submitNode = 'a.submit-button',
            reg = /^0?1[3|4|5|8][0-9]\d{8}$/;
        $(placeholder).css({ "line-height": $(placeholder).height() + 'px' });
        $(iconNode).css({ "line-height": $(placeholder).height() + 'px' });
        $(submitNode).css({ "line-height": $(placeholder).height() + 'px' });
        $(document).bind('click', placeholder, function() {
            $(this).hide();
            $(inputNode).focus();
        });
        $(inputNode).blur(function() {
            if ($(this).val() === '') {
                $(placeholder).show();
            }
        });
        $(inputNode).focus(function() {
            $(submitNode).removeClass('received').text('立即领取');
        });
        //提交验证手机号、AJAX验证是否能获取红包
        $(document).bind('click', submitNode, function() {
            var that = $(this);
            if($(this).hasClass('received')){
                $(this).text('跳转中...');
                skip();//先尝试打开APP，再尝试下载APP
            }else{
                $(this).text('校验手机号码');
                if (!reg.test($(inputNode).val())) {//判断输入内容
                    $.alert('请输入正确的手机号码。', function() {
                        $(placeholder).hide();
                        $(inputNode).val('').focus();
                        that.text("立即领取");
                    });
                    return false;
                }else{//ajax获取手机号码是否可领取
                    $.getJSON(pageConf.ajaxUrl, {inviteCode: pageConf.getInviteCode(), phone: $(inputNode).val()}, function(data) {
                        $(submitNode).addClass('received').text('您已领取过，立即使用红包！');
                        if (data.success) {
                            show("success"); //弹出下载页面
                            //保存
                        } else {
                            show("invite"); //弹出邀请页面
                        }
                        //
                    });
                }
            }

        });
    });
    /* 关闭弹出窗口 */
    $(document).bind('click','a.box-close', function(){
        $(this).parent().parent().hide();
    })
    /* 触发唤醒APP*/
    $(document).bind('click','.wake', function(){
        skip();//先尝试打开APP，再尝试下载APP
    })
    //skip();
    /* 唤醒操作  先尝试打开APP，再尝试下载APP*/
    function skip(){
        return new openApp({
            "relativePath":'shared' //APP内页面
        });
    }
});
