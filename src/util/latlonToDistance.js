function Rad(d) {
  return (d * Math.PI) / 180.0; // 经纬度转换成三角函数中度分表形式。
}

/**
 *
 * @param lat1 第一点纬度
 * @param lng1  第一点经度
 * @param lat2  第二点纬度
 * @param lng2  第二点经度
 * @returns {number} 距离 单位为公里
 * @constructor
 */
// 计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
function GetDistance(lat1, lng1, lat2, lng2) {
  const radLat1 = Rad(lat1);
  const radLat2 = Rad(lat2);
  const a = radLat1 - radLat2;
  const b = Rad(lng1) - Rad(lng2);
  let s =
    2 *
    Math.asin(
      Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)),
    );
  s = s * 6378.137; // EARTH_RADIUS;
  s = Math.round(s * 100000) / 100000; // 输出为公里
  // s=s.toFixed(4);
  return s;
}
module.exports = GetDistance;
