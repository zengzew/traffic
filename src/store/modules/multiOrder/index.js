/**
 * @Description: 多业务相关数据管理
 * @date 2020/10/27
 * @params
 */
import API from '../../../util/apiV1';

const state = {
  currentOrder: {},
  orderList: [],
  serviceid: '',
};

const mutations = {
  setCurrentOrder: (state, data) => {
    state.currentOrder = { ...data };
  },
  setOrderList: (state, data) => {
    state.orderList = data.slice();
  },
};
const actions = {
  resetCurrentOrder({ commit }) {
    commit('setCurrentOrder', {});
    commit('setOrderList', []);
  },
  getOrderList({ commit }, data) {
    return new Promise((resolve, reject) => {
      API.MultiOrder.orderList_Get(data).then((res) => {
        if (res.status === 0) {
          commit('setOrderList', res.data || []);
          resolve(res);
        } else {
          commit('setOrderList', []);
          reject(res);
        }
      });
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
