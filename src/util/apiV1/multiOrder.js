/**
 * @Description: 多业务相关接口，包括增删改查等操作
 * @date 2020/11/6
 * @params
 */

import { promiseAxios } from './apiUtil';
import axios from '../ajax';
import de from 'element-ui/src/locale/lang/de';

const multiOrder = {
  orderList_Get(params) {
    return promiseAxios(
      axios({
        url: `//82.156.230.142:10720/track/v1/service/gets`,
        type: 'get',
        withCredentials: false,
        params: {
          // "key": "AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAA",
          key: 'AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAZ',
          reqid: 'test',
          reqtime: 'test',
          ...params,
        },
      }),
    );
  },
  orderAdd_Post(params) {
    return promiseAxios(
      axios({
        url: `//82.156.230.142:10720/track/v1/service/insert`,
        headers: {
          'Content-Type': 'text/plain',
        },
        method: 'post',
        withCredentials: false,
        data: {
          // "key": "AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAA",
          key: 'AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAZ',
          servicetype: 1,
          ...params,
        },
      }),
    );
  },
  orderUpdate_Post(data) {
    return promiseAxios(
      axios({
        url: `//82.156.230.142:10720/track/v1/service/update`,
        method: 'post',
        withCredentials: false,
        headers: {
          'Content-Type': 'text/plain',
        },
        data: {
          // "key": "AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAA",
          key: 'AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAZ',
          ...data,
        },
      }),
    );
  },
  orderDelete_Post(data) {
    return promiseAxios(
      axios({
        url: `//82.156.230.142:10720/track/v1/service/delete`,
        headers: {
          'Content-Type': 'text/plain',
        },
        method: 'post',
        withCredentials: false,
        data: {
          // "key": "AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAA",
          key: 'AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAZ',
          ...data,
        },
      }),
    );
  },
};
export default multiOrder;
