export function formateDate(date, fmt) {
  const num = date * 1000;
  const dates = new Date(num);
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, `${dates.getFullYear()}`.substr(4 - RegExp.$1.length));
  }
  const o = {
    'M+': dates.getMonth() + 1,
    'd+': dates.getDate(),
    'h+': dates.getHours(),
    'm+': dates.getMinutes(),
    's+': dates.getSeconds(),
  };
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = `${o[k]}`;
      fmt = fmt.replace(
        RegExp.$1,
        // eslint-disable-next-line no-use-before-define
        RegExp.$1.length === 1 ? str : padLeftZero(str),
      );
    }
  }
  return fmt;
}
// 左边补0函数
function padLeftZero(str) {
  return `00${str}`.substr(str.length);
}
