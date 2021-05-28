/**
 * @Description: 鉴权相关接口
 * @date 2020/10/26
 * @params
 */
import { promiseAxios } from './apiUtil';
import axios from '.././ajax';
import { Message } from 'element-ui';

const auth = {
  getPermissionList_pubNet() {
    return promiseAxios(
      axios({
        url: `/console/app_auth/list`,
        type: 'get',
        withCredentials: false,
        params: {
          output: 'json',
        },
      }),
    );
  },
  getUserName_Pub() {
    return promiseAxios(
      axios({
        url: `/console/user_info/get`,
        type: 'get',
        withCredentials: false,
        params: {
          output: 'json',
        },
      }),
    );
  },
  // 用户初次登录时，业务初始化
  dbInitByUser() {
    return promiseAxios(
      axios({
        url: `//82.156.230.142:10720/track/v1/init/dbinit`,
        type: 'get',
        withCredentials: false,
        params: {
          key: 'AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAZ',
          reqid: 'test',
          reqtime: 'test',
          output: 'json',
        },
      }),
    );
  },
  // 登出
  logout() {
    return new Promise((resolve, reject) => {
      axios({
        url: `${axios.loginUrl}/logout`,
        method: 'get',
      }).then((res) => {
        if (res.status === 0) {
          resolve(res);
        } else {
          Message.error(`退出失败：${res.message}`);
          reject();
        }
      });
    });
  },
};
export default auth;
