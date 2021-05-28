/**
 * @Description: 专网和互联网环境切换，根据type类型判断
 * @date 2020/10/9
 * @params
 */

const env = {
  type: 'privNet', // 分为privNet 和 pubNet 两种，privNet代表专网，pubNet代表互联网，默认非pubNet为专网
  privNet: {
    mapUrl: '//gl-priv.sparta.html5.qq.com',
    // mapUrl: '//map.qq.com', // 专网地图测试，暂用公网底图
    // mapV2Url: '//jsapi-priv.noscan.sparta.html5.qq.com',
    satelliteUrl: 'http://9.22.15.25/sateTiles', // 卫星图地址
  },
  pubNet: {
    mapUrl: '//map.qq.com',
  },
  baseURL: '//49.232.95.234:9999',
};
module.exports = env;
