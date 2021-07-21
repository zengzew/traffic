/**
 * @Description: 安全分析界面相关接口
 * @date 2021/6/8
 */

import axios from ".././ajax";
import jsonp from "./../jsonp";
import { promiseAxios } from "./apiUtil";

let getTime = ()=>{
    return Math.round(new Date().getTime()/1000).toString()
}
console.log("time",getTime())

const safeAnalyze = {
    //急刹数据获取
    brakeDataGet: (params) =>
        promiseAxios(
            axios({
                // url: `https://www.fastmock.site/mock/44dd9bf02a176f3ecf27a84f88e28a2b/api/api/brake`,
                url: `http://82.156.230.142:10900/track/v1/brake/gettop?rank_num=${params}`,
                type: "get",
                withCredentials: false,
            })
        ),
    //急转弯数据获取
    turnDataGet: (params) =>
        promiseAxios(
            axios({
                // url: `https://www.fastmock.site/mock/44dd9bf02a176f3ecf27a84f88e28a2b/api/api/turn`,
                url: `http://82.156.230.142:10900/track/v1/turn/gettop?rank_num=${params}`,
                type: "get",
                withCredentials: false,
            })
        ),
    //急加速数据获取
    accelerateDataGet: (params) =>
        promiseAxios(
            axios({
                // url: `https://www.fastmock.site/mock/44dd9bf02a176f3ecf27a84f88e28a2b/api/api/accelerate`,
                url: `http://82.156.230.142:10900/track/v1/accelerate/gettop?rank_num=${params}`,
                type: "get",
                withCredentials: false,
            })
        ),
    //超速数据获取
    overspeedDataGet: (params) =>
        promiseAxios(
            axios({
                url: `http://82.156.230.142:10900/track/v1/overspeed/gettop?rank_num=${params}`,
                type: "get",
                withCredentials: false,
            })
        ),
    //急刹路段数量单日查询
    brakeNumGet: (params) =>
        promiseAxios(
            axios({
                url: `http://82.156.230.142:10900/track/v1/brake/getnum?date=${params}`,
                type: "get",
                withCredentials: false,
            })
        ),
    //急转弯路段数量单日查询
    turnNumGet: (params) =>
        promiseAxios(
            axios({
                url: `http://82.156.230.142:10900/track/v1/turn/getnum?date=${params}`,
                type: "get",
                withCredentials: false,
            })
        ),
    //急加速路段数量单日查询
    accelerateNumGet: (params) =>
        promiseAxios(
            axios({
                url: `http://82.156.230.142:10900/track/v1/accelerate/getnum?date=${params}`,
                type: "get",
                withCredentials: false,
            })
        ),
    //超速路段单日查询
    overspeedNumGet: (params) =>
        promiseAxios(
            axios({
                url: `http://82.156.230.142:10900/track/v1/overspeed/getnum?date=${params}`,
                type: "get",
                withCredentials: false,
            })
        ),
    //事件类型数量查询
    eventsNumGet: (date1, date2, type) =>
        promiseAxios(
            axios({
                url: `http://82.156.230.142:10900/track/v1/event/getnum?start_datetime=${date1}&end_datetime=${date2}&type=${type}`,
                type: "get",
                withCredentials: false,
            })
        ),
    //急刹路段数量历史查询
    brakeHistoryGet: () =>
        promiseAxios(
            axios({
                url: `http://82.156.230.142:10900/track/v1/brake/getsum`,
                type: "get",
                withCredentials: false,
            })
        ),
    //急加速路段数量历史查询
    accelerateHistoryGet: () =>
        promiseAxios(
            axios({
                url: `http://82.156.230.142:10900/track/v1/accelerate/getsum`,
                type: "get",
                withCredentials: false,
            })
        ),
    //急转弯路段数量历史查询
    turnHistoryGet: () =>
        promiseAxios(
            axios({
                url: `http://82.156.230.142:10900/track/v1/turn/getsum`,
                type: "get",
                withCredentials: false,
            })
        ),
    //超速路段数量历史查询
    overspeedHistoryGet: () =>
        promiseAxios(
            axios({
                url: `http://82.156.230.142:10900/track/v1/overspeed/getsum`,
                type: "get",
                withCredentials: false,
            })
        ),
    //历史事件累计数量查询
    eventsSumGet: (type) =>
        promiseAxios(
            axios({
                url: `http://82.156.230.142:10900/track/v1/event/getsum?type=${type} `,
                type: "get",
                withCredentials: false,
            })
        ),
    //历史点事件查询
    eventsGet: (date1, date2, type, pageindex, pagesize) =>
        promiseAxios(
            axios({
                url: `http://82.156.230.142:10900/track/v1/event/gethistory?start_datetime=${date1}&end_datetime=${date2}&type=${type}&pageindex=${pageindex}&pagesize=${pagesize} `,
                type: "get",
                withCredentials: false,
            })
        ),
    //路段坐标查询
    segLocation: (seg_ids, type) =>
        promiseAxios(
            axios({
                // url: `https://www.fastmock.site/mock/44dd9bf02a176f3ecf27a84f88e28a2b/api/location/${seg_id}`,
                url: `http://82.156.230.142:10003/querySegById?segIds=${seg_ids}&topType=${type}`,
                // url:`/location/querySegById?segIds=${seg_ids}`,
                type: "get",
                withCredentials: false,
            })
        ),
    // segLocation: (seg_ids) => {
    //     return jsonp(`http://82.156.230.142:10003/querySegById?`,{param:"segIds",name:seg_ids,output: 'jsonp'})
    // }

    //全城事件点实时查询接口
    allEventsPoints: () =>
    promiseAxios(
        axios({
            // url:`https://www.fastmock.site/mock/44dd9bf02a176f3ecf27a84f88e28a2b/api/allPoint`,
            url:`http://82.156.230.142:10900/track/v1/event/gets?current_time=${getTime()}`,
            type: "get",
            withCredentials: false,
        })
    ),

    //某一事件点详细数据接口
    eventDetail: (event_id) =>
    promiseAxios(
        axios({
            // url:`https://www.fastmock.site/mock/44dd9bf02a176f3ecf27a84f88e28a2b/api/eventDetail/${event_id}`,
            url:`http://82.156.230.142:10900/track/v1/event/get?event_id=${event_id}&current_time=${getTime()}`,
            type: "get",
            withCredentials: false,
        })
    ),

    //路段事件查看详情接口
    segEvent: (seg_id,page_index,page_size) =>
    promiseAxios(
        axios({
            // url:`https://www.fastmock.site/mock/44dd9bf02a176f3ecf27a84f88e28a2b/api/segEvent/${seg_id}`,
            url:`http://82.156.230.142:10900/track/v1/event/getseg?seg_id=${seg_id}&current_time=${getTime()}&pageindex=${page_index}&pagesize=${page_size}`,
            type: "get",
            withCredentials: false,
        })
    ),

    //事故严重指数排名接口
    urgentIndexGet: (rank_num) =>
    promiseAxios(
        axios({
            url:`http://82.156.230.142:10900/track/v1/accident/gettop?rank_num=${rank_num}`,
            type: "get",
            withCredentials: false,
        })
    ),

    //潜在安全隐患路段排行榜接口
    dangerPotentialGet:(rank_num) =>
    promiseAxios(
        axios({
            url:`http://82.156.230.142:10900/track/v1/potential/gettop?rank_num=${rank_num}`,
            type: "get",
            withCredentials: false,
        })
    ),
};

export default safeAnalyze;
