/**
 * @Description:
 * @date 2021/3/11
 * @params
 */

const loadFile = function (name) {
  // name为文件所在位置
  const xhr = new XMLHttpRequest();
  const okStatus = document.location.protocol === 'file:' ? 0 : 200;
  xhr.open('GET', name, false);
  xhr.send(null);
  return xhr.status === okStatus ? xhr.responseText : null;
};
export default loadFile;
