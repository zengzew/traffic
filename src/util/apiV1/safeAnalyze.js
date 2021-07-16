/**
 * @Description: 安全分析界面相关接口
 * @date 2021/6/8
 */

import axios from ".././ajax";
import jsonp from "./../jsonp";
import { promiseAxios } from "./apiUtil";

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
};

export default safeAnalyze;
