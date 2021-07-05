import axios from '@/util/ajax';
import API from '../../../util/apiV1';
import { Message } from 'element-ui';
import router from '../../../router';

const defaultNavList = [
  {
    path: '/monitor',
    name: '车辆实时监控',
  },
  {
    path: '/example/table',
    name: '历史轨迹',
  },
  /* {
         path: '/example/heatAnalysis',
         name: '轨迹热力分析',
     }*/
];

const AiCalPlatformNavList = [
  {
    path:'/dangerAnalyze',
    name:'安全隐患分析',
  },
  // {
  //   path:'/trafficAnalyze',
  //   name:"交通事故分析",
  // },
  // {
  //   path:'/dangerPotential',
  //   name:"潜在安全隐患挖掘",
  // },
  {
    path:'/dangerHistory',
    name:"历史统计分析",
  },
]

const state = {
  token: '',
  navList: defaultNavList.slice(),
  defaultNavList,
  AiCalPlatformNavList,
  currentPagePermission: [],
  allPagePermission: [],
};

const mutations = {
  setNavList: (state, data) => {
    state.navList = data;
  },
  setNavItemShow: (state, data) => {
    state.navList[data.index].isShow = data.isShow;
  },
  setCurrentPagePermission: (state, data) => {
    state.currentPagePermission = data;
  },
  setAllPagePermission: (state, data) => {
    state.allPagePermission = [...data];
  },
};
const getters = {
  // 多业务权限，创建编辑删除三种。
  multiOrderPerms: (state) => true,
    // if (envConfig.type === 'privNet') return true // 暂未接入专网权限，默认全部拥有
    //state.allPagePermission.find((item) => item.id === 'business'),
  isMultiOrderAdd: (state) => true,
    // if (envConfig.type === 'privNet') return true // 暂未接入专网权限，默认全部拥有
    //getters.multiOrderPerms(state) && getters.multiOrderPerms(state).actions.find((item) => item.id === 'add'),
  isMultiOrderEdit: (state) => true,
    // if (envConfig.type === 'privNet') return true // 暂未接入专网权限，默认全部拥有
    //getters.multiOrderPerms(state) && getters.multiOrderPerms(state).actions.find((item) => item.id === 'edit'),
  isMultiOrderDelete: (state) => true,
    // if (envConfig.type === 'privNet') return true // 暂未接入专网权限，默认全部拥有
    //getters.multiOrderPerms(state) && getters.multiOrderPerms(state).actions.find((item) => item.id === 'delete'),
  // 数据管理页面权限
  managePerms: (state) => true,
    // if (envConfig.type === 'privNet') return true // 暂未接入专网权限，默认全部拥有
    //state.allPagePermission.find((item) => item.id === 'data') || null,
  isManageEdit: (state) => true,
    // if (envConfig.type === 'privNet') return true // 暂未接入专网权限，默认全部拥有
    //getters.managePerms(state) && getters.managePerms(state).actions.some((item) => item.id === 'edit'),
  isManageDelete: (state) => true,
    // if (envConfig.type === 'privNet') return true // 暂未接入专网权限，默认全部拥有
    //getters.managePerms(state) && getters.managePerms(state).actions.some((item) => item.id === 'delete'),
  configPerms: (state) => true,
    // if (envConfig.type === 'privNet') return true // 暂未接入专网权限，默认全部拥有
    //state.allPagePermission.find((item) => item.name === '业务配置') || null,
  isDeviceConfigView: (state) => true,
    // if (envConfig.type === 'privNet') return true // 暂未接入专网权限，默认全部拥有
    //getters.configPerms(state) && getters.configPerms(state).actions.some((item) => item.id === 'device_view'),
  isDeviceConfigEdit: (state) => true,
    // if (envConfig.type === 'privNet') return true // 暂未接入专网权限，默认全部拥有
    //getters.configPerms(state) && getters.configPerms(state).actions.some((item) => item.id === 'device_edit'),
  isTrackConfigView: (state) => true,
    // if (envConfig.type === 'privNet') return true // 暂未接入专网权限，默认全部拥有
    //getters.configPerms(state) && getters.configPerms(state).actions.some((item) => item.id === 'track_view'),
  isTrackConfigEdit: (state) => true,
    // if (envConfig.type === 'privNet') return true // 暂未接入专网权限，默认全部拥有
    //getters.configPerms(state) && getters.configPerms(state).actions.some((item) => item.id === 'track_edit'),
  isOrderConfigView: (state) => true,
    // if (envConfig.type === 'privNet') return true // 暂未接入专网权限，默认全部拥有
    //getters.configPerms(state) && getters.configPerms(state).actions.some((item) => item.id === 'config_view'),
  isOrderConfigEdit: (state) => true,
    // if (envConfig.type === 'privNet') return true // 暂未接入专网权限，默认全部拥有
    //getters.configPerms(state) && getters.configPerms(state).actions.some((item) => item.id === 'config_edit'),
};
const actions = {
  // 邮箱登录
  loginByEmail({ commit }, userInfo) {
    return new Promise((resolve) => {
      axios({
        headers: {
          'Content-Type': 'application/json',
        },
        url: `${axios.loginUrl}/login`,
        method: 'post',
        data: {
          ...userInfo,
        },
      }).then((res) => {
        res.info.error = 0;
        res.info.msg = "成功";
        res.status = 0;
        res.message = "成功";
        if (res.status === 0) {
          // commit('setToken', res.key);      
          commit('user/setName', res.username, { root: true });
        }
        console.log(res);
        resolve(res);
      });
    });
  },
  // 持久化后初始化时重置navList
  /* resetNavList({commit}){
        commit('setNavList',defaultNavList.slice())
    },*/

  resetAllPagePermission({ commit }) {
    commit('setAllPagePermission', []);
  },
  // 登出
  logout({ commit }) {
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
  getPermissionList_pubNet({ state, commit }) {
    console.log("getPermissionList_pubNet");
    /*
    return new Promise((resolve, reject) => {
      console.log("ccccomccccccccccccccc");
      API.Auth.getPermissionList_pubNet()
        .then((res) => {
          if (res.status === 0) {
            let trackPermission = res.detail.apps.filter((item) => item.id === 'track');
            if (trackPermission.length && trackPermission[0].status === 1) {
              trackPermission = trackPermission[0];
              commit('setAllPagePermission', trackPermission.sub_apps);
              const appNameArr = trackPermission.sub_apps.map((item) => item.name);
              const newNavList = state.defaultNavList.filter((item) => appNameArr.includes(item.name));
              // 必有实时监控
              if (!newNavList.some((item) => item.name === '车辆实时监控'))
                newNavList.unshift({
                  path: '/monitor',
                  name: '车辆实时监控',
                });
              commit('setNavList', newNavList);
              console.log(newNavList);
              console.log(trackPermission.sub_apps);
              resolve(res);
            } else {
              Message.warning({ message: '抱歉，您暂无权限访问该系统，请联系管理员开通权限', duration: 2000 });
              // setTimeout(function(){
              router.push({ name: 'login', params: { hasAuth: true } });
            }
          } else {
            console.log("ccccomccccccccccccccc2");
            reject();
          }
        })
        .catch((err) => {
          console.log(res);
          console.log(err);
          reject(err);
        });
    });  */
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
