/**
 * @Description: axios二次封装，增加结果预处理钩子，可用于互联网登录提前验证
 * @date 2020/10/16
 * @params
 */
const promiseAxios = function (axiosInstance, beforeResolve) {
  return new Promise((resolve, reject) => {
    axiosInstance
      .then((res) => {
        beforeResolve && beforeResolve(res);
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};
export { promiseAxios };
