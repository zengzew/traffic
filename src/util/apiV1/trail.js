/**
 * @Description: 轨迹相关接口
 * @date 2020/10/16
 * @params
 */

import axios from '../ajax';
import { promiseAxios } from './apiUtil';
import store from '../../store';

const Trail = {
  trailSearchByIdGet(params) {},
  trailAllIdGet(params) {
    return promiseAxios(
      axios({
        url: `//82.156.230.142:10720/track/v1/device/devicetracegets`,
        method: 'get',
        withCredentials: false,
        params: {
          key: 'AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAZ',
          serviceid: store.state.multiOrder.currentOrder.serviceid,
          reqid: 1,
          reqtime: 1,
          ...params,
        },
      }),
    );
  },
  // 时间段内单设备轨迹列表
  trailByDeviceOrderGet(params) {
    return promiseAxios(
      axios({
        url: `//82.156.230.142:10731/track/v1/history/tracks/gohbase`,
        params: {
          key: 'AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAZ',
          serviceid: store.state.multiOrder.currentOrder.serviceid,
          ...params,
        },
      }),
    );
  },
  // 单个轨迹坐标列表
  trackItemGet: (params) =>
    promiseAxios(
      axios({
        url: `//82.156.230.142:10731/track/v1/history/track/gohbase`,
        params: {
          key: 'AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAZ',
          serviceid: store.state.multiOrder.currentOrder.serviceid,
          ...params,
        },
      }),
    ),
  drivingBehaviorPost(data) {
    return promiseAxios(
      axios({
        url: '/ws/trip_trace/v1/analysis/drivingbehavior',
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
        data,
      }),
    );
  },
  // 获取轨迹自定义字段
  getCustomizeKey: (params) =>
    new Promise((resolve, reject) => {
      axios({
        url: `//82.156.230.142:10720/track/v1/track-config/get-default`,
        params: {
          key: 'AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAZ',
          serviceid: store.state.multiOrder.currentOrder.serviceid,
          reqid: 1,
          reqtime: 1,
          default: false,
          ...params,
        },
        type: 'get',
        withCredentials: false,
      })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    }),

  // 获取轨迹所有字段
  allTrackKeyGet: (params) =>
    new Promise((resolve, reject) => {
      axios({
        url: `//82.156.230.142:10720/track/v1/track-config/get-default`,
        params: {
          key: 'AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAZ',
          serviceid: store.state.multiOrder.currentOrder.serviceid,
          reqid: 1,
          reqtime: 1,
          ...params, // 不传默认获取所有字段
        },
        type: 'get',
        withCredentials: false,
      })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    }),
  // 设备配置插入接口
  trackConfigInsertPost: (data) =>
    promiseAxios(
      axios({
        headers: {
          'Content-Type': 'text/plain',
        },
        url: `//82.156.230.142:10720/track/v1/track-config/insert`,
        method: 'post',
        withCredentials: false,
        data: {
          ...data,
          key: 'AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAZ',
          reqtime: 1,
          serviceid: store.state.multiOrder.currentOrder.serviceid,
          reqid: '1',
        },
      }),
    ),
  // 设备配置删除接口
  trackConfigDeletePost: (data) =>
    promiseAxios(
      axios({
        headers: {
          'Content-Type': 'text/plain',
        },
        url: `//82.156.230.142:10720/track/v1/track-config/delete`,
        method: 'post',
        withCredentials: false,
        data: {
          key: 'AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAZ',
          reqtime: 1,
          serviceid: store.state.multiOrder.currentOrder.serviceid,
          reqid: '1',
          ...data,
        },
      }),
    ),
};

export default Trail;
