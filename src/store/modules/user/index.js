import Cookies from 'js-cookie'
import API from "../../../util/apiV1";

const state = {
    // 用户名
    name: '未登录',
    defaultName: '未登录'
}

const mutations = {
    setName: (state, data) => {
        if(data){
            Cookies.set('userName', encodeURIComponent(data), {
                expires: 365
            })
        } else {
            Cookies.remove('userName')
        }
        state.name = data
    },
    setName_Pub: (state, data) =>{
        state.name = data
    },

};
const actions = {
    // 互联网版本
    getUserName({commit}){
        //lbsconsole.sparta.html5.qq.com/gov/console/user_info/get?output=json
        /*
        return new Promise( (resolve, reject) => {
            API.Auth.getUserName_Pub()
              .then(res => {
                  if (res.status === 0) {
                      commit('user/setName_Pub', res.detail.user_name,{ root: true }) ;
                      resolve(res)
                  }
              })
              .catch( err => {
                  reject(err)
              })
        })
        */
        commit('user/setName_Pub', "jeraltzhong",{ root: true }) ;
    },
    resetName({state, commit}){
        commit('setName_Pub', state.defaultName)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}