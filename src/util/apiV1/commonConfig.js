/**
 * @Description: 通用配置相关接口
 * @date 2020/10/16
 * @params
 */

import axios from '../ajax';
import { promiseAxios } from './apiUtil';

const CommonConfig = {
  // 通用配置查询
  configSearchGet: (params) =>
    promiseAxios(
      axios({
        url: `//82.156.230.142:10720/track/v1/common-config/get`,
        type: 'get',
        withCredentials: false,
        params: {
          key: 'AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAZ',
          serviceid: 'test',
          reqid: 1,
          reqtime: 2,
          keyname: 'onlinetime',
          ...params,
        },
      }),
    ),
  // 通用配置更新
  configUpdatePost: (data) =>
    promiseAxios(
      axios({
        headers: {
          'Content-Type': 'text/plain',
        },
        url: `//82.156.230.142:10720/track/v1/common-config/update`,
        method: 'post',
        withCredentials: false,
        data: {
          key: 'AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAZ',
          reqid: '1',
          reqtime: 1,
          // "key":"AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAA",
          serviceid: 'test',
          keyname: 'onlinetime',
          keytype: 1,
          showname: 'lizonghui',
          ...data,
        },
      }),
    ),
};

export default CommonConfig;
