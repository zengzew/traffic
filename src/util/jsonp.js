import originJSONP from 'jsonp';

export function param(data) {
  let url = '';
  for (const k in data) {
    const value = data[k] !== undefined ? data[k] : '';
    url += `&${k}=${encodeURIComponent(value)}`;
  }
  url += `&output=jsonp`;
  // 删除第一个&
  return url ? url.substring(1) : '';
}
export default function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data);
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}
