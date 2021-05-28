// 生产环境中注释掉以下语句
import 'sysStatic/css/theme-default.scss';
// import '../mock/index.js'

import 'babel-polyfill';
import Vue from 'vue';
import ElementUI, { Message } from 'element-ui';
import router from './router';
import store from './store';
import i18n from './util/i18n';
import App from './index';
import md5 from 'js-md5';
import './components/install';
import './plugins/install';
import API from './util/apiV1';

// 修改message
let messageInstance = null;
const resetMessage = {};

const overrideMessage = (options) => {
  if (messageInstance) {
    messageInstance.close();
  }
  messageInstance = Message(options);
};
['error', 'success', 'info', 'warning'].forEach((type) => {
  resetMessage[type] = (options) => {
    if (typeof options === 'string') {
      options = {
        message: options,
      };
    }
    options.type = type;
    return overrideMessage(options);
  };
});

// 注册组件到Vue
Vue.prototype.$API = API;
Vue.prototype.$md5 = md5;
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value),
});
Vue.prototype.$message = overrideMessage;

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
