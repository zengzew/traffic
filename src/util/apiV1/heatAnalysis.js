/**
 * @Description: 热力分析相关接口
 * @date 2020/9/1
 */

import axios from '.././ajax';
import { promiseAxios } from './apiUtil';

const heatAnalysis = {
  trailInAdsGet: (params) =>
    promiseAxios(
      axios({
        url: `/ws/trip_heatmap/v1/getpercent`,
        // url: `${axios.testUrl}/heatmap/getpercent`,
        params: {
          deviceid: 1,
          time: 1592985900,
          adcode: '110000',
          ...params,
        },
        type: 'get',
      }),
    ),
  adNameGet: () =>
    axios({
      type: 'get',
      url: '/ws/district/v1/list',
    }),
  // 分时刻分坐标数据
  pointsDayGet: (params) =>
    axios({
      type: 'get',
      url: 'ws/trip_heatmap/v1/getpointsday',
      params: {
        deviceid: 1,
        adcode: 110000,
        startTime: 1598946000,
        type: 0,
        ...params,
      },
    }),
  // 分时刻
  pointCountDayGet: (params) =>
    axios({
      type: 'get',
      url: 'ws/trip_heatmap/v1/getcountday',
      params: {
        deviceid: 1,
        adcode: 110000,
        start_Time: 1598946000,
        ...params,
      },
    }),
};

export default heatAnalysis;
