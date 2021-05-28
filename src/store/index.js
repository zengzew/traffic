import Vue from 'vue'
import Vuex from 'vuex'
import vuexModules from './modules'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import createPersistedState from "vuex-persistedstate"; // 持久化存储插件

Vue.use(Vuex)

export default new Vuex.Store({
    state,
    mutations,
    actions,
    modules: vuexModules,
    plugins: [
        createPersistedState({
            key: "traceManage-vuex",
            paths: ['user.name', 'multiOrder', 'auth.allPagePermission','auth.navList','watch.carDetail', 'watch.provinceList', 'watch.fourPosition', 'watch.mapLocation'], // 自定义持久化内容
            storage: window.sessionStorage
        })
    ]
}) 