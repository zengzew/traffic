/**
 * @Description: 安全分析界面相关接口
 * @date 2021/6/8
 */

import axios from ".././ajax";
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
    //急刹路段数量单日查询
    brakeNumGet: () =>
        promiseAxios(
            axios({
                url: `https://www.fastmock.site/mock/44dd9bf02a176f3ecf27a84f88e28a2b/api/brakenum`,
                type: "get",
                withCredentials: false,
                params: {
                    date: "1623168000000",
                },
            })
        ),
    //急转弯路段数量单日查询
    turnNumGet: (params) =>
        promiseAxios(
            axios({
                url: `https://www.fastmock.site/mock/44dd9bf02a176f3ecf27a84f88e28a2b/api/turnnum`,
                type: "get",
                withCredentials: false,
            })
        ),
    //急加速路段数量单日查询
    accelerateNumGet: (params) =>
        promiseAxios(
            axios({
                url: `https://www.fastmock.site/mock/44dd9bf02a176f3ecf27a84f88e28a2b/api/acceleratenum`,
                type: "get",
                withCredentials: false,
            })
        ),
    //超速路段单日查询
    overspeedNumGet: (params) =>
        promiseAxios(
            axios({
                url: `https://www.fastmock.site/mock/44dd9bf02a176f3ecf27a84f88e28a2b/api/overspeednum`,
                type: "get",
                withCredentials: false,
            })
        ),
    //急刹路段数量历史查询
    brakeHistoryGet: (params) =>
        promiseAxios(
            axios({
                url: `https://www.fastmock.site/mock/44dd9bf02a176f3ecf27a84f88e28a2b/api/brakesum`,
                type: "get",
                withCredentials: false,
            })
        ),
    //急加速路段数量历史查询
    accelerateHistoryGet: (params) =>
        promiseAxios(
            axios({
                url: `https://www.fastmock.site/mock/44dd9bf02a176f3ecf27a84f88e28a2b/api/acceleratesum`,
                type: "get",
                withCredentials: false,
            })
        ),
    //急转弯路段数量历史查询
    turnHistoryGet: (params) =>
        promiseAxios(
            axios({
                url: `https://www.fastmock.site/mock/44dd9bf02a176f3ecf27a84f88e28a2b/api/turnsum`,
                type: "get",
                withCredentials: false,
            })
        ),
    //超速路段数量历史查询
    overspeedHistoryGet: (params) =>
        promiseAxios(
            axios({
                url: `https://www.fastmock.site/mock/44dd9bf02a176f3ecf27a84f88e28a2b/api/overspeedsum`,
                type: "get",
                withCredentials: false,
            })
        ),
};

export default safeAnalyze;
