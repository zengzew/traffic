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
                // url: `https://www.fastmock.site/mock/44dd9bf02a176f3ecf27a84f88e28a2b/api/api/overspeed`,
                url: `http://82.156.230.142:10900/track/v1/overspeed/gettop?rank_num=${params}`,
                type: "get",
                withCredentials: false,
            })
        ),
    //路段坐标查询
    segLocation: (seg_ids,type) =>
    promiseAxios(
        axios({
            // url: `https://www.fastmock.site/mock/44dd9bf02a176f3ecf27a84f88e28a2b/api/location/${seg_id}`,
            url:`http://82.156.230.142:10003/querySegById?segIds=${seg_ids}&topType=${type}`,
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