
const state = {
    tableList: [],
    tableCount: 0,
    pagesize: 10,
    pageindex: 1,
}

const mutations = {
    setTableList: (state, data) => {
        state.tableList = data
    },
    setTableCount: (state, data) => {
        state.tableCount =data
    },
    setPagesize: (state, data) => {
        state.pagesize =data
    },
    setPageindex: (state, data) => {
        state.pageindex =data
    },
}
const actions = {
    getTableList({commit}, data) {
        return new Promise(() => {
            commit("setTableList", data);
        })
    },
    getTableCount({commit}, data) {
        return new Promise(() => {
            commit("setTableCount", data);
        })
    },
    getPagesize({commit}, data) {
        return new Promise(() => {
            commit("setPagesize", data);
        })
    },
    getPageindex({commit}, data) {
        return new Promise(() => {
            commit("setPageindex", data);
        })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
