/**
 * 管理热力分析模块的数据
 */
import API from '@/util/apiV1';
import moment from "moment";

const state = {
  cityVal: '',
  dateVal: new Date(new Date().toLocaleDateString()).getTime(),
  deviceType: 0,
  heatDataObj: {},
  isPlaying: false,
  timeIndex: 0,
  interval: 60, // 热力回放时间间隔
  // timeArrByInterval: [],
}

const mutations = {
  setCityVal: (state , data) => {
    state.cityVal = data;
  },
  setDateVal: (state , data) => {
    state.dateVal = data;
  },
  setDeviceType: (state , data) => {
    state.deviceType = data;
  },
  setHeatDataObj: (state, data) => {
    state.heatDataObj = {...data};
  },
  setTimeIndex: (state, data) => {
    state.timeIndex = data;
  },
  setInterval: (state, data) => {
    state.interval = data;
},
}
const getters = {
  // 返回监听的请求参数对象，便于统一监听
  requestParamObj(){
    const {cityVal,dateVal,deviceType} = state
    return {cityVal,dateVal,deviceType}
  },
  timeArrByInterval(){
    let tmpArr = [];
    let tmpTime = state.dateVal / 1000;
    let nowTime = Date.now();
    // 判断日期是否是当天
    if(moment(Date.now()).isSame(moment(state.dateVal),'d')){
      while (moment(tmpTime).isBefore(moment(nowTime)/1000)) {
        tmpArr.push(tmpTime)
        tmpTime +=  60 * state.interval;
      }
    }else {
      while (tmpTime <= state.dateVal / 1000 + 60 * 60 * 24) {
        tmpArr.push(tmpTime)
        tmpTime +=  60 * state.interval;
      }
    }
    return tmpArr;
  },
  timeArr(){
    return Object.keys(state.heatDataObj)
  }
}
const actions = {
  // 获取单天分时刻热力数据
  getPointsDay({commit}, data) {
    return new Promise((resolve, reject) => {
      API.heatAnalysis.pointsDayGet({
        adcode: state.cityVal,
        start_time: state.dateVal / 1000, // 转为秒级时间戳
        type: state.deviceType
      }).then((res) =>{
        if(res.status === 0){
          commit("setHeatDataObj", res.datas? res.datas: {});
          resolve()
        }else {
          reject()
        }
      })
      //
    })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}