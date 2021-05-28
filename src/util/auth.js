// import Cookies from 'js-cookie';
/*
const authToken = {
  // 当Token超时后采取何种策略
  // jumpAuthPage  每次请求时判断Token是否超时，若超时则跳转到授权页面
  // getNewToken  每次请求时判断Token是否超时，若超时则获取新Token (推荐)
  tokenTimeoutMethod: 'getNewToken',

  // 在Cookie中记录登录状态的key
  loginKey: 'isLogin',

  // Token是否超时
  hasToken() {
    return Cookies.get('token');
  },

  // 当前是否是登录状态
  isLogin() {
    return Cookies.get(this.loginKey);
  },

  // 设置Token
  setToken(token) {
    // TODO: 设置token，并填写有效期
    const maxAge = new Date(new Date().getTime() + 2 * 60 * 60 * 1000);
    Cookies.set('token', token, {
      expires: maxAge,
    });
  },

  // 设置登录状态
  setLoginStatus() {
    // TODO: 设置超时登录时间，在该时间范围内没有任何请求操作则自动删除
    const maxAge = new Date(new Date().getTime() + 2 * 60 * 60 * 1000);
    Cookies.set(this.loginKey, 'true', {
      expires: maxAge,
    });
  },

  // 移除Token
  removeToken() {
    Cookies.remove('token');
  },

  // 移除登录状态
  removeLoginStatus() {
    Cookies.remove(this.loginKey);
  },
};*/
const authFn = function (_this) {
  let hidden;
  let visibilityChange;
  if (typeof document.hidden !== 'undefined') {
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
  } else if (typeof document.mozHidden !== 'undefined') {
    hidden = 'mozHidden';
    visibilityChange = 'mozvisibilitychange';
  } else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
  } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
  }
  const func = () => {
    !document[hidden] &&
      _this.$route.name !== 'login' &&
      _this.$store.dispatch('auth/getPermissionList_pubNet').then(() => {
        _this.$store.dispatch('user/getUserName').then(() => {
          if (_this.hasNameChange) {
            console.log('用户更新，跳转到首页');
            window.location.reload();
          }
        });
      });

    // console.log(`当前页面是否被隐藏：${this.hasNameChange},${document[hidden]}`);
  };
  document.removeEventListener(visibilityChange, func, false);
  // 添加监听器
  document.addEventListener(visibilityChange, func, false);
};

export default authFn;
