import jsonp from './../jsonp';
import axios from './../ajax';
import { promiseAxios } from './apiUtil';
import mapEnv from '../../config/envConfig';
import Vue from 'vue'
const GeoUtil = {
  // 专网
  GetAddress_Priv(params) {
    return promiseAxios(
      axios({
        url: '/ws/geocoder/v1',
        method: 'get',
        params,
      }),
    );
  },
  // 互联网
  GetAddresss_Pub(lat, lng) {
    //const KEY = 'OKTBZ-LPH3P-2BADC-VYKEW-HA6RO-NXFEB'; // key 秘钥自己申请
    const KEY ='4CZBZ-VIQRW-UNBRF-ORMFH-F35N2-UAFEU';
    const url = 'https://apis.map.qq.com/ws/geocoder/v1';
    const locationdata = `${lat},${lng}`; // 纬度，经度
    const data = {
      key: KEY,
      callbackName: 'QQmap',
      output: 'jsonp',
      location: locationdata,
    };
    return jsonp(url, data);
  },

  //专网
  GetChildren(params) {
    return promiseAxios(
      axios({
        url: '/ws/district/v1/getchildren',
        method: 'get',
        params,
      }),
    );
  },
  //互联网
  GetChildren_Pub(id_data) {
    const KEY = '4CZBZ-VIQRW-UNBRF-ORMFH-F35N2-UAFEU'; // key 秘钥自己申请
    const url = 'https://apis.map.qq.com/ws/district/v1/getchildren';
    const iddata = `${id_data}`;
    const data = {
      key: KEY,
      callbackName: 'QQmap',
      output: 'jsonp',
      id: iddata,
    };
    return jsonp(url, data);
  },

  //专网
  GetProvinceList() {
    return promiseAxios(
      axios({
        url: '/ws/district/v1/list',
        method: 'get',
      }),
    );
  },
  //互联网
  GetProvinceList_Pub() {
    const KEY = '4CZBZ-VIQRW-UNBRF-ORMFH-F35N2-UAFEU'; // key 秘钥自己申请
    const url = 'https://apis.map.qq.com/ws/district/v1/list';
    const data = {
      key: KEY,
      callbackName: 'QQmap',
      output: 'jsonp',
    };
    return jsonp(url, data);
  },
  GetAddressByMapType(lat, lng) {
    /*
    if (mapEnv.type !== 'pubNet') {
      // 专网版
      return this.GetAddress_Priv({
        location: `${lat},${lng}`,
      });
    }
    */
    return this.GetAddresss_Pub(lat, lng);
  },
  async GetCityList(state, id, type) {
    if (type === 'city') {
      this.GetChildren_Pub(id).then((res) => {
        if (res.status === 0) {
          const cityArr = [];
          res.result[0].forEach(async (item, index) => {
            cityArr.push({
              ...item,
              label: item.fullname || item.name,
            });
          });
          state.cityOptions = cityArr;
        }
      });
    }
    if (type === 'county') {
      this.GetChildren_Pub(id).then((res) => {
        if (res.status === 0) {
          const cityArr = [];
          res.result[0].forEach(async (item, index) => {
            cityArr.push({
              ...item,
              value: item.id,
              label: item.fullname,
            });
          });
          state.countyOptions = cityArr;
        }
      });
    }
    if (type == 'shi') {
      state.cityOptions = [];
      this.$API.GeoUtil.GetChildren_Pub( id ).then((res) => {
        if (res.status === 0) {
          const cityArr = [];
          res.result[0].forEach(async (item, index) => {
            cityArr.push({
              ...item,
              value: item.id,
              label: item.fullname,
            });
          });
          state.countyOptions = cityArr;
        }
      });
    }
  },
};

export default GeoUtil;
