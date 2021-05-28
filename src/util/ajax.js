/**
 * axios全局配置
 */
import axios from 'axios';
import router from '../router';
import { Message } from 'element-ui';
import auth from './apiV1/auth';
import Vue from 'vue';
import loadFile from './fileUtil';
import mapEnv from '../../static/envConfig.json';

const { CancelToken } = axios;
const requestList = [];

// 引用静态文件内的url
const env = process.env.NODE_ENV;
if (env === 'production') {
  const result = loadFile(
    './static/envConfig.json'
    // `${window.location.origin + window.location.pathname.replace('index.html', 'serverconfig.json')}`,
  );
  if (result) {
    Vue.prototype.$mapEnv = Object.assign({}, JSON.parse(result));
    console.log('prod', Vue.prototype.$mapEnv);
  } else {
    console.error('配置文件读取错误');
  }
} else {
  Vue.prototype.$mapEnv = mapEnv;
}
/**
 * Token校验
 * @param {function} cancel - 中断函数
 * @param {function} callback -  回调
 * @description 校验Token是否过期，如果Token过期则根据配置采用不同方法获取新Token
 *              自动获取Token：过期时自动调用获取Token接口。注意：当有任一请求在获取Token时，其余请求将顺延，直至新Token获取完毕
 *              跳转授权Token：过期时中断当前所有请求并跳转到对应页面获取Token。注意：跳转页面授权最佳实现应在授权页面点击触发
 */
/* function checkToken(cancel, callback) {
  if (!Auth.hasToken()) {
    // 自动获取Token
    if (Auth.tokenTimeoutMethod == 'getNewToken') {
      // 如果当前有请求正在获取Token
      if (getTokenLock) {
        setTimeout(() => {
          checkToken(cancel, callback);
        }, 500);
      } else {
        getTokenLock = true;
      }
    }
    // 跳转授权Token
    if (Auth.tokenTimeoutMethod == 'jumpAuthPage' && Auth.isLogin()) {
      if (router.currentRoute.path != '/auth') {
        // BUG: 无法保证一定会中断所有请求
        cancel();
        router.push('/auth');
      }
    }
  } else {
    callback();
  }
}*/

/**
 * 阻止短时间内的重复请求
 * @param {string} url - 当前请求地址
 * @param {function} c - 中断请求函数
 * @description 每个请求发起前先判断当前请求是否存在于RequestList中，
 *              如果存在则取消该次请求，如果不存在则加入RequestList中，
 *              当请求完成后500ms时，清除RequestList中对应的该请求。
 */
// function stopRepeatRequest(url, c){
//     for( let i = 0; i < requestList.length; i++){
//         if(requestList[i] == url){
//             c()
//             return
//         }
//     }
//     requestList.push(url)
// }

// 超时设置
const service = axios.create({
  // 请求超时时间
  timeout: 30000,
});
axios.defaults.withCredentials = false;

// baseURL
 //axios.defaults.baseURL = '//apis-priv.sparta.html5.qq.com';   // 轨迹后台
axios.defaults.baseURL = '//49.232.95.234:9999/gov'; // v2测试后台

// service.orderTestUrl = '//49.232.80.54:20720';
// service.orderTestUrl = '//49.232.95.234:9999/gov';

// service.hitoryTraceUrl = '//49.232.80.54:20002'

service.hzTestNoscan = '//lbsconsole.noscan.sparta.html5.qq.com';
service.hzTest = '//lbsconsole.sparta.html5.qq.com';
service.loginUrl = Vue.prototype.$mapEnv.baseURL;
// service.latStyle = 'latlng'  // 投影方式   --------------------默认是莫卡拓投影;  经纬度改为空 'latlng'
// service.config= "//triptrace.noscan.sparta.html5.qq.com";//配置页面
// http request 拦截器
// 每次请求都为http头增加Authorization字段，其内容为token
service.interceptors.request.use(
  (config) => {
    let cancel;
    config.cancelToken = new CancelToken((c) => {
      cancel = c;
    });
    /* checkToken(cancel, () => {
      Auth.setLoginStatus();
      // config.headers.Authorization = `${store.state.user.token}`
    });*/
    // stopRepeatRequest(config.url, cancel)
    return config;
  },
  (err) => Promise.reject(err),
);

// http response 拦截器
// 针对响应代码确认跳转到对应页面
service.interceptors.response.use(
  async (response) => {
    // has_auth 接口不做判断
    console.log(response.request);
    if (!response.request.responseURL.includes('has_auth')) {
      
      if ([60003].includes(response.data.status)) {
        /*
        Message.closeAll();
        Message({
          type: 'info',
          message: `未登录或登录超时，请重新登录123`,
        });
        */
        //await router.push({ name: 'login', params: { hasAuth: true } });
        //return Promise.reject(response.data);
        return Promise.resolve(response.data)
      }
      if ([1131, 1101].includes(response.data.status)) {
        Message.closeAll();
        Message({
          type: 'info',
          message: `${response.data.message}，请重新登录`,
        });
        await auth.logout().then(() => {
          router.push({ name: 'login', params: { hasAuth: true } });
        });
        return Promise.reject(response.data);
      }
      return Promise.resolve(response.data);
    }
    if (response.status !== 200) {
      Message.error(response.data.message);
      return Promise.reject(response.data);
    }
    for (let i = 0; i < requestList.length; i++) {
      if (requestList[i] === response.config.url) {
        // 注意，不能保证500ms必定执行，详情请了解JS的异步机制
        setTimeout(() => {
          requestList.splice(i, 1);
        }, 500);
        break;
      }
    }
    return Promise.resolve(response.data);
  },
  (error) => Promise.reject(error.response.data),
  // if(axios.isCancel(error)){
  //     console.log('响应错误拦截---')
  //     console.log('error=----', error)
  //     return Promise.reject("Ajax Abort: 该请求在axios拦截器中被中断")
  // } else if (error.response) {
  //     switch (error.response.status) {
  //         case 401:
  //             router.push('error/401');
  //         case 403:
  //             router.push('error/403');
  //         default:
  //             Message({
  //                 message: `服务器错误！错误代码：${error.response.status}`,
  //                 type: 'error'
  //             })
  //     }
  //     return Promise.reject(error.response.data)
  // }
);
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url,
      params,
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} data [请求时携带的参数]
 * @param {Object} headers [请求头]
 */
export function post(url, data, headers = { 'Content-Type': 'application/json' }) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url,
      data,
      headers,
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}

export default service;
