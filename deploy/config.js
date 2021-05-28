/**
 * @Description: 部署到cors上配置文件
 * @params
 */
const path = require('path');

// cors连接配置
const CONFIG = {
  cors_config: {
    appid: 76322, // 填入你的appid,
    secret_id: 'QQotEXwTjGM2RZ6GBM8RzJ4H',
    secret_key: 'Hi1vkEixAaGD1gUNQ7+9OB4sD8Nn750On1',
    base_host: 'service.gzc.vod.tencent-cloud.com',
    isTest: false,
    bHostNameOverL5: true, // process.platform != 'linux' ? true : false,
  },
  // 部署地址配置
  file_config: {
    bucketName: 'trackmanage', // 桶名称
    cosPath: 'traceManageTest/', // cors 存储路径
    dist_path: path.join(__dirname, '../dist/'), // 当前项目dist打包文件夹
    Host: 'http://trackmanage.map.qq.com/', // cors桶对应域名
  },
};

module.exports = CONFIG;
