const state = {
    map:"",
    line:"",
    mark:"",
    activeLine:"",
    activeMark:"",
    brakeGeometry: [],
    turnGeometry: [],
    accelerateGeometry: [],
    overspeedGeometry: [],
    isFromHistory:false, //交通事故分析页面 是否从历史统计分析页面跳转过来
    ifEventDetail:false, //交通事故分析页面 是否打开交通事故事件详情
    activePointId:0,         //交通事故分析页面 被激活点的ID
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
