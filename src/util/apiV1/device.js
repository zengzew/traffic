/**
 * @Description: 设备管理相关接口
 * @date 2020/9/1
 */

import axios from '.././ajax';
import { promiseAxios } from './apiUtil';
import jsonp from '../jsonp';
import store from '../../store';

const device = {
  // 获取设备详细数据： 多个数据，按设备编辑时间排序
  deviceDataGet: (params) =>
    promiseAxios(
      axios({
        // url: `${axios.trailNoscan}/device/api/v1/gets`, // v1.2版本接口
        url: `//82.156.230.142:10720/track/v1/device/gets`,
        type: 'get',
        withCredentials: false,
        params: {
          reqid: '23ea731e9cdfa190',
          reqtime: '1584966794',
          key: 'AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAZ',
          serviceid: store.state.multiOrder.currentOrder.serviceid,
          dev: 'on',
          pagesize: 9,
          pageindex: 1,
          ...params,
        },
      }),
    ),

  // 获取设备详细数据： 多个数据，按轨迹更新时间排序
  /* deviceDataByOnlineGet: params => {
    return promiseAxios(
      axios({
        url: `/track/v1/device/list`,
        type: "get",
        params: {

          serviceid: '12345678901234567890123456789012',
          devicetypes: '',
          online: '',
          pagesize: 10,
          pageindex: 1
          , ...params
        }
      }))
  },*/
  /* deviceDataByOnlineGet: params => {
    let url = 'http://49.232.80.54:10901/track/v1/device/list';
    let data = {
      serviceid: store.state.multiOrder.currentOrder.serviceid,
      types: '',
      online: '',
      callbackName: 'QQmap',
      pagesize: 10,
      pageindex: 1,
      output: 'jsonp',
      ...params
    }
    return jsonp(url, data)
  },*/
  deviceDataByOnlineGet: (params) =>
    new Promise((resolve, reject) => {
      axios({
        url: `//82.156.230.142:10901/track/v1/device/list`,
        method: 'get',
        withCredentials: false,
        params: {
          key: 'AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAZ',
          serviceid: store.state.multiOrder.currentOrder.serviceid,
          pagesize: 10,
          pageindex: 1,
          ...params,
        },
      })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    }),

  // 设备查询接口  单个数据查询,适用于名称和id唯一字段, 静态数据
  deviceSearchGet: (params) =>
    new Promise((resolve, reject) => {
      axios({
        url: `//82.156.230.142:10720/track/v1/device/get`,
        method: 'get',
        withCredentials: false,
        params: {
          key: 'AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAZ',
          reqid: 1,
          reqtime: 1,
          serviceid: store.state.multiOrder.currentOrder.serviceid,
          ...params,
        },
      })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    }),
  /* nearbyDeviceGet: params => {
    let url = 'http://49.232.80.54:10901/track/v1/device/search/rectangle';
    let data = {

      serviceid: store.state.multiOrder.currentOrder.serviceid,
      count: 200,
      output: 'jsonp',
      ...params
    }
    return jsonp(url, data)
  },*/
  nearbyDeviceGet: (params) =>
    new Promise((resolve, reject) => {
      axios({
        url: `//82.156.230.142:10901/track/v1/device/search/rectangle`,
        method: 'get',
        withCredentials: false,
        params: {
          key: 'AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAZ',
          serviceid: store.state.multiOrder.currentOrder.serviceid,
          count: 200,
          ...params,
        },
      })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    }),
  // 设备模糊查询接口
  fuzzySearchGet: (params) =>
    new Promise((resolve, reject) => {
      axios({
        url: `//82.156.230.142:10720/track/v1/device/getsfuzzy`,
        type: 'get',
        withCredentials: false,
        params: {
          key: 'AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAZ',
          reqid: 1,
          reqtime: 1,
          serviceid: store.state.multiOrder.currentOrder.serviceid,
          pagesize: 9,
          ...params,
        },
      })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    }),

  // 设备信息插入
  deviceInsertPost: (data) =>
    promiseAxios(
      axios({
        url: `//82.156.230.142:10720/track/v1/device/insert`,
        headers: {
          'Content-Type': 'text/plain',
        },
        method: 'post',
        withCredentials: false,
        data: {
          key: 'AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAZ',
          reqtime: 1,
          serviceid: store.state.multiOrder.currentOrder.serviceid,
          deviceid: '',
          reqid: '1',
          department: '',
          type: 1,
          title: '',
          user: 'test',
          tel: '',
          ext: '',
          ...data,
        },
      }),
    ),
  // 设备信息删除
  deviceDeletePost: (data) =>
    promiseAxios(
      axios({
        url: `//82.156.230.142:10720/track/v1/device/delete`,
        headers: {
          'Content-Type': 'text/plain',
        },
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
  // 设备信息更改
  deviceUpdatePost: (data) =>
    promiseAxios(
      axios({
        url: `//82.156.230.142:10720/track/v1/device/update`,
        headers: {
          'Content-Type': 'text/plain',
        },
        method: 'post',
        data: {
          key: 'AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAZ',
          reqtime: 1,
          serviceid: store.state.multiOrder.currentOrder.serviceid,
          reqid: '1',
          ...data,
        },
      }),
    ),
  // 获取设备总数
  deviceCountGet: (params) =>
    promiseAxios(
      axios({
        url: `//82.156.230.142:10720/track/v1/device/getcount`,
        type: 'get',
        withCredentials: false,
        params: {
          key: 'AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAZ',
          reqtime: 1,
          serviceid: store.state.multiOrder.currentOrder.serviceid,
          reqid: '1',
          ...params,
        },
      }),
    ),

  // 获取设备自定义字段
  getCustomizeKey: (params) =>
    new Promise((resolve, reject) => {
      axios({
        url: `//82.156.230.142:10720/track/v1/device-config/get-default`,
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

  // 获取设备所有字段
  allDeviceKeyGet: (params) =>
    promiseAxios(
      axios({
        url: `//82.156.230.142:10720/track/v1/device-config/get-default`,
        params: {
          key: 'AAAAA-AAAAA-AAAAA-AAAAA-AAAAA-AAAAZ',
          serviceid: store.state.multiOrder.currentOrder.serviceid,
          reqid: 1,
          reqtime: 1,
          ...params, // 不传默认获取所有字段
        },
        type: 'get',
        withCredentials: false,
      }),
    ),
  // 设备配置启用接口
  deviceConfigUsedPost: (data) =>
    promiseAxios(
      axios({
        headers: {
          'Content-Type': 'text/plain',
        },
        url: `//82.156.230.142:10720/track/v1/device-config/set-used`,
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
  // 设备配置调整顺序接口
  deviceConfigExchangePost: (data) =>
    promiseAxios(
      axios({
        headers: {
          'Content-Type': 'text/plain',
        },
        url: `//82.156.230.142:10720/track/v1/device-config/exchange`,
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
  // 设备配置插入接口
  deviceConfigInsertPost: (data) =>
    promiseAxios(
      axios({
        headers: {
          'Content-Type': 'text/plain',
        },
        url: `//82.156.230.142:10720/track/v1/device-config/insert`,
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
  // 设备配置删除接口
  deviceConfigDeletePost: (data) =>
    promiseAxios(
      axios({
        headers: {
          'Content-Type': 'text/plain',
        },
        url: `//82.156.230.142:10720/track/v1/device-config/delete`,
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
export default device;
