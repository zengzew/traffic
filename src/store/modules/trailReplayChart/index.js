/**
 * @Description: 轨迹回放和驾驶行为分析的state
 * @date 2020/7/20
 * @params
*/

import axios from '@/util/ajax'
import API from '../../../util/apiV1';

const state = {
    // 横纵坐标轴数据
    xAxisData: [],
    yAxisData: [],
    // 路径数据
    pathPoints: [],

    // 播放组件状态控制
    replayState: {
        isPlaying: false,
        dateIndex: 0,
        speedVal: 1
    },
    trailActions: {}

}

const mutations ={
    setXAxisData: (state , data) => {
        state.xAxisData = data;
    },
    setYAxisData: (state , data) => {
        state.yAxisData = data;
    },
    setPathPoints: (state , data) =>{
        state.pathPoints = data;
    },
    setReplayState: (state , data) => {
        state.replayState = data
    },
    setTrailActions: (state , data) => {
        state.trailActions = {...data}
    }
   /* setIsPlaying: (state , data)=>{
        state.isPlaying = data;
    },
    setDateIndex: (state , data)=>{
        state.dateIndex = data;
    },
    setSpeedVal: (state , data)=>{
        state.speedVal = data;
    },*/

}
const actions = {
    // 根据轨迹数据请求轨迹行为
    updateTrailActions({commit}, data){
        let trailActionsReqData = data.result.track && data.result.track.map(item => {
            return {
                'lat': item.lat,
                'lng':item.lng,
                'speed': item.speed,
                'time': item.loctime * 1000,
                'corner': item.bearing,
            }
        });
        return new Promise(resolve => {
            // 跨域问题未解决，使用模拟数据
           // commit("setTrailActions", {...trailActionsMock.result});

            // TODO: 暂时使用公用axios, 避免url 前缀
           /* axios({
                url: '/ws/trip_trace/v1/analysis/drivingbehavior',
                headers: {'Content-Type': 'text/plain'},
                method: 'post',
                data: {'datas': trailActionsReqData}
            })*/
              API.Trail.drivingBehaviorPost({'datas': trailActionsReqData})
              .then((res) =>{
                commit("setTrailActions", res.result);
                resolve(res)
            })
        })

    },
    // 根据轨迹数据更新表格数据
    updateChartData({commit} , data) {
        let pathPoints =[];
        let speedArr = [];
        let loctimeArr = [];
        // 使用原始轨迹 根据距离 速度，计算时间
        data.result.track.forEach(item => {
            pathPoints.push([item.lat,item.lng]);
            speedArr.push(Math.abs(item.speed)*3.6); // 速度单位从m/s转换为km/h
            // this.loctimeArr.push(moment(item.loctime * 1000).format('mm:ss'));
            loctimeArr.push(item.loctime * 1000)
        });
        commit("setXAxisData",loctimeArr)
        commit("setYAxisData",speedArr)
        commit("setPathPoints",pathPoints)
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}
