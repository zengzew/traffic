import axios from '@/util/ajax';
import API from '../../../util/apiV1';

const state = {
  trail: '',
  trailType: '',
  car: '', // 车辆id
  carDetail: '', // 车辆详细资料
  isDetailShow: false, // detail面板是否打开
  provinceList: [],
  mapLocation: {},
  keepAlive: '', // 保存缓存的列表
  fourPosition: {},
  nowCounts: 0,
  trailAction: '',
  deviceList: [],
  showDetail: false,
  isOnline: null, // null 代表展示全部，0不在线，1在线
  provinceValue: '北京市',
  cityValue: '北京市',
  countyValue: '东城区',
  provinceOptions: [],
  cityOptions: [],
  countyOptions: [],
  isCarSet: false, // 监听是否调用car set方法， 回调监听来缩放到对应车辆位置
};

const mutations = {
  setNavList: (state, data) => {
    state.navList = data;
  },
  setCountyValue: (state, data) => {
    state.countyValue = data;
  },
  setCityValue: (state, data) => {
    state.cityValue = data;
  },
  setProvinceValue: (state, data) => {
    state.provinceValue = data;
  },
  setCountyOptions: (state, data) => {
    state.countyOptions = data;
  },
  setCityOptions: (state, data) => {
    state.cityOptions = data;
  },
  setProvinceOptions: (state, data) => {
    state.provinceOptions = data;
  },
  setTrail: (state, data) => {
    state.trail = data;
  },
  setDeviceList: (state, data) => {
    state.deviceList = data;
  },
  // 需要缓存的值
  setKeepAlive(state, data) {
    state.keepAlive = data;
  },
  setLocation: (state, data) => {
    state.mapLocation = data;
  },
  setProvinceList: (state, data) => {
    state.provinceList = data;
  },
  // getFourPosition
  setFourPosition: (state, data) => {
    state.fourPosition = data;
  },
  setTrailType: (state, data) => {
    state.trailType = data;
  },
  setNowCounts: (state, data) => {
    state.nowCounts = data;
  },
  setCar: (state, data) => {
    state.isCarSet = !state.isCarSet;
    state.car = data;
  },
  setCarDetail: (state, data) => {
    state.carDetail = data;
  },
  setIsOnline: (state, data) => {
    state.isOnline = data;
  },
  setIsDetailShow: (state, data) => {
    state.isDetailShow = data;
  },
};

const actions = {
  // 邮箱登录
  loginByEmail({ commit }, userInfo) {
    return new Promise((resolve) => {
      axios({
        url: '/login',
        method: 'post',
        data: {
          ...userInfo,
        },
      }).then((res) => {
        if (res.login) {
          // commit('setToken', res.token);
          commit('user/setName', res.name, { root: true });
        }
        resolve(res);
      });
    });
  },

  // 登出
  logout({ commit }) {
    return new Promise((resolve) => {
      // commit('setToken', '');
      commit('user/setName', '', { root: true });
      commit('tagNav/removeTagNav', '', { root: true });
      resolve();
    });
  },

  // 获取轨迹
  getTrail({ commit }, data) {
    return new Promise((resolve) => {
      API.Trail.trackItemGet({
        trackid: data.trackid,
        deviceid: data.deviceid,
      }).then((res) => {
        commit('setTrail', res);
        resolve(res);
      });
      //
    });
  },
  // keep alive
  getKeepAlive({ commit }, data) {
    return new Promise(() => {
      commit('setKeepAlive', data);
    });
  },
  // 轨迹类型
  getTrailType({ commit }, data) {
    return new Promise(() => {
      commit('setTrailType', data);
    });
  },
  // 地点坐标
  getLocaiton({ commit }, data) {
    return new Promise(() => {
      commit('setLocation', data);
    });
  },
  // 实时数量
  getNowCounts({ commit }, data) {
    return new Promise(() => {
      commit('setNowCounts', data);
    });
  },
  // getProvinceList
  // 省列表
  getProvinceList({ commit }, data) {
    return new Promise(() => {
      commit('setProvinceList', data);
    });
  },
  // 获取矩形两个角的的位置
  getFourPosition({ commit }, data) {
    return new Promise(() => {
      commit('setFourPosition', data);
    });
  },
  // 获取车辆
  getCar({ commit }, data) {
    return new Promise(() => {
      commit('setCar', data);
    });
  },
  getCarDetail({ commit }, data) {
    return new Promise((resolve) => {
      commit('setCarDetail', data);
      resolve();
    });
  },

  // 获取该用户的菜单列表
  getNavList({ commit }) {
    return new Promise((resolve) => {
      axios({
        url: '/user/navlist',
        methods: 'post',
        data: {},
      }).then((res) => {
        commit('setNavList', res);
        resolve(res);
      });
    });
  },

  // 将菜单列表扁平化形成权限列表
  getPermissionList({ state }) {
    return new Promise((resolve) => {
      const permissionList = [];
      // 将菜单数据扁平化为一级
      function flatNavList(arr) {
        for (const v of arr) {
          if (v.child && v.child.length) {
            flatNavList(v.child);
          } else {
            permissionList.push(v);
          }
        }
      }
      flatNavList(state.navList);
      resolve(permissionList);
    });
  },
  // 获取新Token
  getNewToken({ commit, state }) {
    return new Promise((resolve) => {
      axios({
        url: '/api/getToken',
        method: 'get',
        param: {
          token: state.token,
        },
      }).then((res) => {
        // commit('setToken', res.token);
        resolve();
      });
    });
  },
  updateCityList({ state }, centerLocation) {
    API.GeoUtil.GetAddressByMapType(JSON.parse(centerLocation.lat), JSON.parse(centerLocation.lng)).then((response) => {
      if (response.status !== 0) {
        // 未请求到时
        state.provinceValue = '';
        state.cityValue = '';
        state.countyValue = '';
        return;
      }
      const nowPro = response.result.address_component && response.result.address_component.province;
      (state.provinceValue = response.result.address_component && response.result.address_component.province),
        (state.cityValue = response.result.address_component && response.result.address_component.city),
        (state.countyValue = response.result.address_component && response.result.address_component.district);
      nowPro === '北京市' ||
      nowPro === '天津市' ||
      nowPro === '重庆市' ||
      nowPro === '上海市' ||
      nowPro === '香港特别行政区' ||
      nowPro === '澳门特别行政区'
        ? (state.cityOptions = [{ label: nowPro }])
        : API.GeoUtil.GetCityList(
            state,
            response.result.ad_info && `${response.result.ad_info.city_code.slice(3, 5)}0000`,
            'city',
          );
      API.GeoUtil.GetCityList(state, response.result.ad_info && response.result.ad_info.city_code.slice(3), 'county');
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
