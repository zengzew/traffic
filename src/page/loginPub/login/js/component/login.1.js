import {position} from '../util/position'
import {setCookie, getCookie, deleteCookie} from '../util/cookie'
import '../../css/login.css'
import Vue from 'vue'
import VueRouter from 'vue-router'
document.domain = "qq.com";
import Cookies from 'js-cookie';
/**
 * 配置测试环境和线上环境的初始化参数
 */
Vue.use(VueRouter);
var HOST = 'https://lbsconsole.noscan.sparta.html5.qq.com/'; // 后端域名
var HOSTNAME = 'lbsconsole.noscan.sparta.html5.qq.com';
var TEL_APPID = '2052237686';// 安全验证码id
var WX_APPID = 'wx89da0ac3f253a923';// 微信appid
var WX_RURI = 'https%3A%2F%2Flbs.qq.com%2Flogin%2Fwx.html';// 微信登录回调地址
var CRYPTKEY = '9a&i<L81@-5xHy%4';// 加密秘钥
var redirect_url = '';
var reditect_url_text = '';
var reditect_text = '';
// console.log('process.env.DOCKER_ENV', process.env.DOCKER_ENV);
if (location.port == '8080' || location.host === 'gmap.sparta.html5.qq.com' || location.host === 'lbsdev.sparta.html5.qq.com') {
// if (process.env.DOCKER_ENV == 'test') {
    HOST = 'https://lbsconsole.noscan.sparta.html5.qq.com/';
    HOSTNAME = 'lbsconsole.noscan.sparta.html5.qq.com';
    TEL_APPID = '2055965444'; // 安全验证码id
    WX_APPID = 'wxa2712f1bfdec32e2'; // 微信appid
    WX_RURI = 'https%3A%2F%2Flbs.cs0309.3g.qq.com%2Flogin%2Fwx.html'; // 微信登录回调地址
    CRYPTKEY = '1234567890abcdef' // 加密秘钥
}
/**
 * 创建脚本模块
 */
// 创建微信脚本
var wxDom = document.createElement('script');
wxDom.innerHTML = '!function(a,b,c){function d(a){var c="default";a.self_redirect===!0?c="true":a.self_redirect===!1&&(c="false");var d=b.createElement("iframe"),e="https://open.weixin.qq.com/connect/qrconnect?appid="+a.appid+"&scope="+a.scope+"&redirect_uri="+a.redirect_uri+"&state="+a.state+"&login_type=jssdk&self_redirect="+c;e+=a.style?"&style="+a.style:"",e+=a.href?"&href="+a.href:"",d.src=e,d.frameBorder="0",d.allowTransparency="true",d.scrolling="no",d.width="300px",d.height="400px";var f=b.getElementById(a.id);f.innerHTML="",f.appendChild(d)}a.WxLogin=d}(window,document);';
// document.getElementsByTagName("head")[0].append(wxDom);
document.getElementsByTagName("head")[0].appendChild(wxDom);

// 创建加密脚本
var cryptoDom = document.createElement('script');
cryptoDom.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js';
// document.getElementsByTagName("head")[0].append(cryptoDom);
document.getElementsByTagName("head")[0].appendChild(cryptoDom);


/**
 * 登录框HTML模板
 */
    //手机登录内容
var TPL_TEL = [
        '<div class="lg-tel new-form" style="">',
        '<div class="form-item">',
        '<div class="item-title">欢迎，请登录</div>',
        '</div>',
        '<div class="form-item">',
        '<div class="form-item">',
        // '<div class="item-title">手机号码</div>',
        '<div class="item-input"><input type="text" name="mb" placeholder="请输入手机号码"><span class="tip"></span></div>',
        '</div>',
        '<div class="form-item">',
        // '<div class="item-title">验证码</div>',
        '<div class="item-input">',
        '<input type="text" name="code" style="width:50%;" placeholder="请输入验证码">',
        '<input class="send-mobile actTelCode" type="button" id="TencentCaptcha" data-appid="' + TEL_APPID + '" data-cbfn="sslSendCb" value="获取验证码" disabled/>',
        '<span class="tip"></span>',
        '</div>',
        '</div>',
        '<div class="form-item">',
        '<div class="item-submit">',
        '<button type="submit" class="actSubmit" disabled>登 录</button>',
        '</div>',
        '</div>',
        // '<div><a class="actChangeType change-type">< 切换其他登录方式</a></div>',
        '</div>'
    ];
// 登陆框内容
var qqOauthUrl = 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101478729&redirect_uri=https%3a%2f%2f' +HOSTNAME+ '%2flogin%2fqq%2faccess%3Fscope=get_user_info';
var wxOauthUrl = HOST + 'login/mp?';
var loginContent = [
    // '<div id="login_div" class="login_container">',

    // // '<i class="lg-close actClose"></i>',
    // // '<h1 class="lg-tab-title">权限管理平台</h1>',
    // '<div class="lg-tab"></div>',
    // '<div class="lg-back-mod lg-back-other" style="display: none;">' +
    // '<p>其他登录方式</p>' +
    // '<a href="' + qqOauthUrl + '" class="lg-type actLgqq" data-type="qq" data-text="QQ登录" target=""><i class="icon-qq"></i>QQ</a>' +
    // '<a href="' + wxOauthUrl + '" class="lg-type actLgwxgz" target=""><i class="icon-mp"></i>微信公众号</a>' +
    // '<a href="javascript:;" class="lg-type actLgtel" target=""><i class="icon-tel"></i>手机</a></div>',
    // '</div>'
].join('');

/**
 * 内部方法
 */
//验证码验证回调
window.sslSendCb = function(res) {
    // res（未通过验证）= {ret: 1, ticket: null}
    // res（验证成功） = {ret: 0, ticket: "String", randstr: "String"}
    if (res.ret === 0) {
        TEL_FN.send('', res.ticket, res.randstr);
        $('input[name="mb"]').attr('disabled', 'disabled'); // 手机输入框锁定
    } else {
    }
};


function encryptAES128ECB(text, key) { // 加密
    if (!!window.CryptoJS) {
        var encText = CryptoJS.enc.Utf8.parse(text);
        var encKey = CryptoJS.enc.Utf8.parse(key);
        var ciper = CryptoJS.AES.encrypt(encText, encKey, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
            iv: ''
        });
        return ciper.ciphertext.toString()
    } else {
        setTimeout(function(){
            encryptAES128ECB(text, key)
        }, 500)
    }
}


//创建手机登录模块
var TEL_FN = {
    init: function() {
        // console.log('初始化登录框');
        var me = this;
        // 引入防水墙，创建安全校验码脚本
        var sslDom = document.createElement('script');
        $(sslDom).attr('class', 'actSslDom');
        sslDom.src = 'https://ssl.captcha.qq.com/TCaptcha.js';
        $('head').append(sslDom);

        $('.actSubmit').bind('click', me.submit); // 登录绑定事件
        $('.actChangeType').bind('click', function() { // 切换登录类型事件
            $('.lg-wx').show();
            $('.lg-tel').hide();
            $('.lg-back-other').show();
            $('.lg-tab-title').html('微信扫码登录')
        })
        $('input[name="mb"]').bind('blur', me.checkmb); // 手机输入框校验
        $('input[name="mb"]').bind('keyup', me.checkmb); // 手机输入框校验
        $('input[name="code"]').bind('blur', me.checkcode); // 验证码输入框校验
        if (me.countdown !== 60) {
            $('input[name="mb"]').attr('disabled', 'disabled'); // 手机输入框锁定
            $('.actSubmit').removeAttr('disabled')

        }
        $('input[name="mb"]').val(me.tel) // 手机输入框赋值
    },
    isdisable: true,
    countdown: 60,
    timer: 0,
    tel: '',
    //手机号输入框校验
    checkmb: function() {
        var _this = $('input[name="mb"]')
        var _parent = _this.parent()
        var _tip = _parent.find('.tip')
        var value = _this.val()
        var _sendBtn = $('.actTelCode')
        if (!value && value !== 0) {
            _parent.addClass('error')
            _tip.html('请输入手机号码')
            _sendBtn.attr("disabled", "disabled");
            return false
        } else if (value && !(/^1\d{10}$/.test(value))) {
            _parent.addClass('error')
            _tip.html('请输入正确的手机号码')
            _sendBtn.attr("disabled", "disabled");
            return false
        } else { // 校验通过
            if (_sendBtn.val().indexOf('获取验证码') !== -1) {
                _sendBtn.removeAttr('disabled')
            }
            _parent.removeClass('error')
            _tip.html('')
        }
        return true
    },
    //验证码输入框校验
    checkcode: function() {
        var _this = $('input[name="code"]')
        var _parent = _this.parent()
        var _tip = _parent.find('.tip')
        var value = _this.val()
        if (!value && value !== 0) {
            _parent.addClass('error')
            _tip.html('请输入验证码')
            return false
        } else if (value && !(/\d{6}$/.test(value))) {
            _parent.addClass('error')
            _tip.html('请输入正确的验证码')
            return false
        } else {
            _parent.removeClass('error')
            _tip.html('')
        }
        return true
    },
    submit: function(e) {
        var me = TEL_FN
        var _target = $('.actSubmit')
        var mobile = $.trim($('input[name="mb"]').val())
        var code = $.trim($('input[name="code"]').val())
        if (!me.checkmb()) {
            return false
        }
        if (!me.checkcode()) {
            return false
        }
        _target.html('登录中...')
        _target.attr("disabled", "disabled");

        $.ajax({
            url: HOST + 'login/mb/access' + '?cb=?',
            type: 'GET',
            dataType: 'json',
            data: {
                mb: mobile,
                code: code
            }
        }).done(function(res) {
					// debugger
					// console.log('ers',res);
            if (res.info && res.info.error === 0) {
                            console.log('ers',res);
							// 政企权限判断  0-无权限，1-有权限且已绑定key，2-有权限但未绑定key
							$.ajax({
								url: `//lbsconsole.noscan.sparta.html5.qq.com/gov/console/has_auth?output=json`,
                                type: 'GET',
                                async:false,
                                dataType: 'json',
                                crossDomain:true,
                                beforeSend: function(xhr) {
                                    xhr.withCredentials = false;
                                }
							}).done(function(res) {
								// console.log('登录鉴权', res);
								if(res.detail.auth == 0) {
									alert('抱歉，您暂无权限访问该系统，请联系管理员开通权限');
									location.reload();
								} else if (res.detail.auth == 1) {
									Cookies.set('haslogin', true, {
										expires: 365
									})
									window.location.hash = "/home" // 直接进入home页
								} else if (res.detail.auth == 2) {
									// 为新用户 创建 key
									$.ajax({
										url: `//lbsconsole.noscan.sparta.html5.qq.com/gov/console/new_key`,
										type: 'POST',
										dataType: 'json',
									}).done(function(res) {
										// console.log('登录鉴权创建key', res);
										Cookies.set('lbs_first','first');
										Cookies.set('haslogin', true, {
											expires: 365
										})
										window.location.hash = "/accountMessage/editAccount" // 进入编辑页面
									})
								}
							}) .fail(function() {
                alert('登录失败，请刷新重试');
                _target.html('登录')
                _target.removeAttr('disabled')
							})
            } else {
                alert(res.info && res.info.msg || '登录失败，请刷新重试');
                _target.html('登录')
                _target.removeAttr('disabled')
            }
        })
            .fail(function() {
                alert('登录失败，请刷新重试');
                _target.html('登录')
                _target.removeAttr('disabled')
            })
    },
    send: function(e, ticket, randstr) {
        var me = TEL_FN
        var target = $('.actTelCode')[0]
        var _tip = $(target.nextElementSibling)
        var mobile = $.trim($('input[name="mb"]').val())
        if (me.isdisable) {
            me.isdisable = false;
            if (!me.checkmb()) {
                me.isdisable = true;
                return false
            }
            $('.actTelCode').val('验证发送中')
            $('.actTelCode').attr('disabled', 'disabled')
            $.ajax({
                url: HOST + 'login/mb/sendcode/' + '?cb=?',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    mb: mobile,
                    captcha_ticket: ticket,
                    captcha_rand_str: randstr
                }
            }).done(function(res) {
                if (res.info && res.info.error === 0) { // 发送成功
                    $('.actSubmit').removeAttr('disabled') // 开放登录
                    me.tel = mobile
                    me.timer = setInterval(function() {
                        me.settime($('.actTelCode'))
                    }, 1000);
                } else {
                    $('.actTelCode').val('获取验证码')
                    $('.actTelCode').removeAttr('disabled')
                    $('input[name="mb"]').removeAttr('disabled') // 手机输入框解锁
                    me.isdisable = true;
                    alert(res.info && res.info.msg || '验证码发送频繁，请稍后重试');
                    return false
                }

            })
                .fail(function() {
                    alert('验证码发送失败，请检查网络设置');
                })
        }
    },
    settime: function(dom) {
        var me = this
        if (me.countdown == 0) {
            dom.removeAttr("disabled");
            dom.val('获取验证码');
            me.countdown = 60;
            clearInterval(me.timer);
            me.isdisable = true;
            $('input[name="mb"]').removeAttr('disabled') // 手机输入框解锁
        } else {
            dom.attr("disabled", "disabled");
            dom.val("重发（" + me.countdown + "）");
            me.countdown--;
        }
    },

}

/**
 * 对外部暴露的方法
 */
export function init(redirectParam) {
    if (redirectParam.url && redirectParam.urlText && redirectParam.text) {
        redirect_url = redirectParam.url;
        reditect_url_text = redirectParam.urlText;
        reditect_text = redirectParam.text;
    }
}

export function loginModalShow(cb) {
    var lbs_refer = location.href;
    setCookie('lbs_refer', encryptAES128ECB(lbs_refer, CRYPTKEY), {
        domain: '.qq.com',
        path: '/'
    });
    if(getCookie('lbs_redirect')){
        deleteCookie('lbs_redirect', {
            domain: '.qq.com',
            path: '/'
        })
    }
    if(redirect_url&&reditect_url_text&&reditect_text){
        var lbs_redirect = 'redirect_url=' + redirect_url + '&reditect_url_text=' + reditect_url_text + '&reditect_text=' + reditect_text
        setCookie('lbs_redirect', lbs_redirect, {
            domain: '.qq.com',
            path: '/'
        })
    }

    if (!document.getElementById("login_div")) {
        $("body").append(loginContent);
        setTimeout(function() {
            TEL_FN.init();
        }, 800)
    }
    // lg-tab的内容，包含微信二维码和手机登录框，动态创建
    var tpl = {
        wx: '',
        // wx: '<div class="lg-wx" style="display:none"><div class="lg-qr-txt"></div><div class="lg-qr-box" id="lg-qr-box"></div></div>',
        tel: TPL_TEL.join('')
    };
    $('.form-group').html(tpl.wx + tpl.tel) // 登录内容创建
    var uriHost = 'https://lbs.qq.com';
    // 微信个人登陆内容创建
    // new WxLogin({
    //     self_redirect: false,
    //     id: "lg-qr-box",
    //     appid: WX_APPID,
    //     scope: "snsapi_login,wechat_redirect",
    //     redirect_uri: WX_RURI,
    //     response_type: 'code',
    //     href: uriHost + "/web/style/link-wx-login.css"
    // });

    $('.actClose').bind('click', function() { // 登陆框关闭
        loginModalHide();
    })

    $('.actLgtel').bind('click', function() { // 手机号登陆
        $('.lg-wx').hide();
        $('.lg-tel').show();
        $('.lg-back-other').hide();
        $('.lg-tab-title').html('手机登录');
        TEL_FN.init()
    })
    //显示登录框
    var p = position.centerPosition($("#login_div"));
    $("#login_div").show().css({
        left: p.x,
        top: '50px'
    });
    //显示遮盖层
    var p = position.getBg();
    $("#J_showDeck").remove();
    // $("body").append('<div class="showDeck" id="J_showDeck"></div>');
    // $("#J_showDeck").show().css({width : p.width, height : p.height, position: 'absolute', top: 0, 'z-index': 100000});
    cb&&cb();
}

export function loginModalHide(cb) {
    //弹出Iframe方式的范例
    var login_wnd = document.getElementById("login_div");
    login_wnd.style.display = "none"
    $("#login_div").hide();
    $("#login_mengban").hide();
    $("#J_showDeck").hide();
    //用户打开登录弹窗未登录时清除室内专属cookies,注册成功重定向cookie
    if(getCookie('lbs_redirect')){
        deleteCookie('lbs_redirect', {
            domain: '.qq.com',
            path: '/'
        })
    }
    deleteCookie('login_pf', {
        domain: '.qq.com',
        path: '/'
    });
    // var jqDom = document.getElementById("lbs_jq");
    // document.getElementsByTagName("head")[0].removeChild(jqDom);
    /* fix IE7,8提示关闭网页BUG */
    setTimeout(function() {
        $("#login_div").remove();
    }, 20)
    cb&&cb();
}

export function logout(cb) {
    var s = document.createElement("script");
    s.src = HOST + 'logout?output=jsonp&cb=chk';
    s.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(s);
    /* IE JS加载判断 */
    if (s.readyState) {
        s.onreadystatechange = function() {
            if (s.readyState == 'loaded') {
                deleteCookie('login_type', {
                    domain: '.qq.com',
                    path: '/'
								});
								deleteCookie('lbs_refer', {
									domain: '.qq.com',
									path: '/'
							});
                deleteCookie('head_img', {
                    domain: '.qq.com',
                    path: '/'
                });
                deleteCookie('nick_name', {
                    domain: '.qq.com',
                    path: '/'
                });
                window.location.reload();
                setTimeout(function() {
                    document.getElementsByTagName("head")[0].removeChild(s);
                }, 100);
                cb&&cb();
            }
        }
    } else {
        /* 标准浏览器JS加载判断 */
        s.onload = function() {
            deleteCookie('login_type', {
                domain: '.qq.com',
                path: '/'
            });
            deleteCookie('head_img', {
                domain: '.qq.com',
                path: '/'
            });
            deleteCookie('nick_name', {
                domain: '.qq.com',
                path: '/'
            });
            window.location.reload()
            setTimeout(function() {
                document.getElementsByTagName("head")[0].removeChild(s);
            }, 100);
            cb&&cb();
        }
    }
}
