const state = {
    map:"",
    line:"",
    brakeGeometry: [],
    turnGeometry: [],
    accelerateGeometry: [],
    overspeedGeometry: [],
    isFromHistory:false, //是否从历史统计分析页面跳转过来
}

const mutations = {
    setBrakeGeometry: (state, data) => {
        state.brakeGeometry = data
    },
    setTurnGeometry: (state, data) => {
        state.turnGeometry =data
    },
    setAccelerateGeometry: (state, data) => {
        state.accelerateGeometry =data
    },
    setOverspeedGeometry: (state, data) => {
        state.overspeedGeometry =data
    },
}
const actions = {
    // getTableList({commit}, data) {
    //     return new Promise(() => {
    //         commit("setTableList", data);
    //     })
    // },
    // getTableCount({commit}, data) {
    //     return new Promise(() => {
    //         commit("setTableCount", data);
    //     })
    // },
    // getPagesize({commit}, data) {
    //     return new Promise(() => {
    //         commit("setPagesize", data);
    //     })
    // },
    // getPageindex({commit}, data) {
    //     return new Promise(() => {
    //         commit("setPageindex", data);
    //     })
    // },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
