/**
 * @Description: 安全分析界面相关接口
 * @date 2021/6/8
 */

import axios from ".././ajax";
import { param } from "../jsonp";
import { promiseAxios } from "./apiUtil";

const safeAnalyze = {
    //急刹数据获取
    brakeDataGet: (params) =>
        promiseAxios(
            axios({
                url: `https://www.fastmock.site/mock/44dd9bf02a176f3ecf27a84f88e28a2b/api/api/brake`,
                type: "get",
                withCredentials: false,
            })
        ),
    //急转弯数据获取
    turnDataGet: (params) =>
        promiseAxios(
            axios({
                url: `https://www.fastmock.site/mock/44dd9bf02a176f3ecf27a84f88e28a2b/api/api/turn`,
                type: "get",
                withCredentials: false,
            })
        ),
    //急加速数据获取
    accelerateDataGet: (params) =>
        promiseAxios(
            axios({
                url: `https://www.fastmock.site/mock/44dd9bf02a176f3ecf27a84f88e28a2b/api/api/accelerate`,
                type: "get",
                withCredentials: false,
            })
        ),
    //超速数据获取
    overspeedDataGet: (params) =>
        promiseAxios(
            axios({
                url: `https://www.fastmock.site/mock/44dd9bf02a176f3ecf27a84f88e28a2b/api/api/overspeed`,
                type: "get",
                withCredentials: false,
            })
        ),
    //路段坐标查询
    segLocation: (seg_id) =>
    promiseAxios(
        axios({
            url: `https://www.fastmock.site/mock/44dd9bf02a176f3ecf27a84f88e28a2b/api/location/${seg_id}`,
            type: "get",
            withCredentials: false,
        })
    ),
};

export default safeAnalyze;