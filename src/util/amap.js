import axios from './ajax';
// import mapEnv from '../config/envConfig';
const tmap = {
  load(mapEnv, callback) {
    if (window.AMap) {
      callback();
    } else {
      // 载入腾讯地图和UI组件
      callback = callback || function () {};
      // 添加script属性，并添加到head中  ,`${axios.seiyaUrl}/static/vplugin/seiya.js`
      const urls = [
        `${
          mapEnv.type === 'pubNet' ? mapEnv.pubNet.mapUrl : mapEnv.privNet.mapUrl
        }/api/gljs?v=1.exp&libraries=model,visualization&callback=initAmap`,
      ];
      const loader = function (src, handler) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        // 重点！！！！script加载成功
        script.onload = function () {
          script.onload = null;
          script.onerror = null;
          handler();
        };
        script.onerror = function () {
          script.onload = null;
          script.onerror = null;
          callback({
            message: `${src}依赖未加载成功！`,
          });
        };
        const head = document.getElementsByTagName('head')[0];
        (head || document.body).appendChild(script);
      };
      // 自执行函数，用于循环loader
      (function run() {
        if (urls.length > 0) {
          loader(urls.shift(), run);
        } else {
          callback();
        }
      })();
      window.initAmap = () => {
        // callback()
      };
      window.AMap = () => {
        callback();
      };
    }
  },
};
export default tmap;
