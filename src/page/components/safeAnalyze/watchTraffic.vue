<template>
    <div class="analyze-watch" :class="{ active_a: !isActive }">
        <div class="wathc-packup">
            <!-- <img
                class="packup"
                @click="animate"
                v-if="isActive"
                src="~sysStatic/images/control_left@2x.png"
                alt=""
            />
            <img
                class="packup"
                @click="animate"
                v-else
                src="~sysStatic/images/right@2x.png"
                alt=""
            /> -->
            <img
                class="packup"
                @click="animate"
                v-if="isActive"
                src="~sysStatic/images/yi-1.png"
                alt=""
            />
            <img
                class="packup"
                @click="animate"
                v-else
                src="~sysStatic/images/yi-2.png"
                alt=""
            />
        </div>
        <div class="demo-choice-suffix">
            <el-menu
                :default-active="tabIndex"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelect"
                text-color="#7E7E7E"
            >
                <el-menu-item index="1">事故分析 </el-menu-item>
                <el-menu-item index="2">事件点分析 </el-menu-item>
            </el-menu>
        </div>
        <template v-if="tabIndex == 1">
            <div class="region-choice">
                <span class="region">区域</span>
                <span class="detail-region">西青区</span>
            </div>
            <div class="index-sum">区域事故严重指数: {{ totalIndex }}</div>
            <el-table
                class="eventAnalysis"
                ref="safeAnalysis"
                highlight-current-row
                :height="tableHeight1"
                :data="tableData"
                v-loading="loading"
                element-loading-text="加载中"
                element-loading-background="rgba(1, 1, 1,0.2)"
                style="width: 100%"
                higlight-current-row
                @current-change="handleCurrentChange"
                :header-cell-style="{
                    backgroundColor: '#374A63',
                    color: '#ABBED9',
                    borderRadius: '2px',
                    borderBottom: '0',
                }"
            >
                <el-table-column
                    type="index"
                    :index="1"
                    label="排行"
                ></el-table-column>
                <el-table-column
                    prop="seg_name"
                    label="事故常发路段名称"
                    width="180"
                ></el-table-column>
                <el-table-column
                    :prop="propName"
                    label="事故严重指数"
                    :formatter="tableFormatter"
                ></el-table-column>
            </el-table>
        </template>
        <template v-else>
            <template v-if="activePointId">
                <div class="point-analysis" :style="{ height: '80%' }">
                    <div class="part1">
                                    <time-picker class="timePicker"></time-picker>
                        <p class="accident-location">
                            事故发生位置:{{ eventPlace }}
                        </p>
                        <p class="accident-distribution">
                            该路段共有事故数{{ eventSum }}条,其中:
                        </p>
                        <el-table
                            class="eventDistribution"
                            ref="safeAnalysis"
                            :data="eventTableData"
                            v-loading="loading"
                            element-loading-text="加载中"
                            element-loading-background="rgba(1, 1, 1,0.2)"
                            style="width: 90%"
                            :show-header="false"
                        >
                            <el-table-column
                                prop="type"
                                align="center"
                            ></el-table-column>
                            <el-table-column
                                prop="count"
                                align="center"
                            ></el-table-column>
                        </el-table>
                    </div>
                    <div class="part2">
                        <p class="eventInfoTitle">事件信息</p>
                        <p class="searchMore" @click="segEvent">查看更多</p>
                        <el-table
                            class="eventDistribution"
                            ref="safeAnalysis"
                            :data="eventInfoTableData"
                            v-loading="loading"
                            element-loading-text="加载中"
                            element-loading-background="rgba(1, 1, 1,0.2)"
                            style="width: 90%"
                            :show-header="false"
                        >
                            <el-table-column
                                prop="infoName"
                                align="center"
                            ></el-table-column>
                            <el-table-column
                                prop="infoVal"
                                align="center"
                            ></el-table-column>
                        </el-table>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="please-select-point">
                    <time-picker class="timePicker"></time-picker>
                    <div class="select-content">请<span>选择</span>事件点查询事件详情</div>
                    目前只有7月14以后的数据
                    <br>
                    时间选择器初始化默认为当日
                </div>
            </template>
        </template>
    </div>
</template>

<script>
import tmap from "@/util/amap";
import timePicker from "../../components/safeAnalyze/timePicker.vue"
export default {
    components:{timePicker},
    data() {
        return {
            isActive: true,
            tabIndex: "1",
            tableHeight1: "550",
            tableHeight: "",
            loading: false,
            tableData: [], //排行榜 table数据
            eventTableData: [], //事件分布 table数据
            eventInfoTableData: [], //事件信息 table数据
            scrollTop: "",
            rank_num: 30, //请求排行榜前30
            segidToLinkNum: {}, //记录每条路有多少条link的对象
            activePointId: 0, //被选择的事故点的ID，当为0时表示未选择任何事故点
            eventPlace: "", //事故发生地点
            eventSum: "", //事故总数
            totalIndex: "", //事故严重指数总数
            segId: "", //被激活 事件点 所属路段的ID
            time: [], // 请求的时间参数
            start_datetime:"", //历史统计分析跳转过来的开始时间
            end_datetime:"",  //历史统计分析跳转过来的结束时间
        };
    },
    computed: {
        propName: function () {
            switch (this.tabIndex) {
                case "1":
                    return "accident_index";
                case "2":
                    return "turn_index";
            }
        },
    },
    methods: {
        getTime() {
            return Math.round(new Date().getTime() / 1000).toString();
        },
        // 获取当天凌晨00:00:00的时间戳
        getCurrentZeroClockTime(time){
            // return (new Date(Number(time) * 1000 + 28800000 - 86400000).setHours(0,0,0,0) / 1000).toString();
            return (new Date(Number(time) * 1000 + 28800000).setHours(0,0,0,0) / 1000).toString();
        },
        // 获取当天23:59:59 或者说是 第二天凌晨00:00:00的时间戳
        getNextZeroClockTime(time){
            return (new Date(Number(time) * 1000 + 28800000 + 86400000).setHours(0,0,0,0) / 1000).toString();
        },
        animate() {
            this.isActive = !this.isActive;
        },
        handleSelect(key) {
            this.$store.state.safeAnalysis.map.setZoom(12);
            this.tabIndex = key;
            this.questData();
        },
        drawLine(data, type) {
            // 位置接口为 1个请求给出所有位置信息 的代码
            var seg_ids = [];
            data.forEach((ele) => {
                seg_ids.push(ele.seg_id);
            });
            let geometries = [];
            this.$API.safeAnalyze
                .segLocation(seg_ids.join(","), type)
                .then((res) => {
                    res.data.forEach((ele) => {
                        var row = seg_ids.indexOf(ele.segId);
                        var coords = (ele.coords + ";").split(";");
                        coords.pop();
                        coords.forEach((element, index) => {
                            var paths = [];
                            var lntlat = element.split(",");
                            var linkOrder = ele.linkOrders.split(";")[index];
                            for (
                                var count = 0;
                                count < lntlat.length;
                                count = count + 2
                            ) {
                                paths.push(
                                    new TMap.LatLng(
                                        lntlat[count + 1],
                                        lntlat[count]
                                    )
                                );
                            }
                            if (Number(linkOrder)) {
                                paths.reverse();
                            }
                            geometries.push({
                                id: ele.segId + "-" + String(index),
                                row,
                                styleId: "default",
                                paths,
                            });
                        });
                        this.segidToLinkNum[ele.segId] = coords.length;
                    });
                    this.$store.state.safeAnalysis.line.setGeometries(
                        geometries
                    );
                });
        },
        getHeight() {
            this.tableHeight = window.innerHeight - 100;
            this.tableHeight1 = window.innerHeight - 280;
        },
        //事件点的类型判断
        markType(type, chinese = null) {
            switch (type) {
                case "1":
                    return chinese ? "事故" : "accident";
                case "4":
                    return chinese ? "施工" : "construction";
                case "2":
                    return chinese ? "封路" : "close";
                case "3":
                    return chinese ? "拥堵" : "jam";
            }
        },
        questData() {
            this.loading = true;
            switch (this.tabIndex) {
                case "1": {
                    this.$store.state.safeAnalysis.isFromHistory = false;
                    this.$store.state.safeAnalysis.mark.setGeometries([]);
                    this.$store.state.safeAnalysis.activeMark.setGeometries([]);
                    this.$API.safeAnalyze
                        .urgentIndexGet(this.rank_num)
                        .then((res) => {
                            this.totalIndex = res.total_index;
                            this.tableData = res.data;
                            this.loading = false;
                            this.drawLine(res.data, "accident");
                        });
                    break;
                }
                case "2": {
                    this.$store.state.safeAnalysis.line.setGeometries([]);
                    this.time = []
                    // this.$API.safeAnalyze
                    //     .turnDataGet(this.rank_num)
                    //     .then((res) => {
                    //         this.tableData = res.data;
                    //         this.loading = false;
                    //         this.drawLine(res.data, "turn");
                    //     });
                    this.$store.state.safeAnalysis.loading_traffic = true;
                    if (this.$store.state.safeAnalysis.isFromHistory) {
                        var historyTime = this.$store.state.safeAnalysis.timeFromHistory;
                        this.time.push(this.getTime(),this.getCurrentZeroClockTime(historyTime),this.getNextZeroClockTime(historyTime))
                    } 
                    else {
                        this.time.push(this.getTime());
                    }
                    this.$API.safeAnalyze
                        .allEventsPoints(...this.time)
                        .then((res) => {
                            console.log("所有点",res)
                            this.$store.state.safeAnalysis.loading_traffic = false;
                            let geo = [];
                            res.data.forEach((ele) => {
                                geo.push({
                                    id: ele.event_id,
                                    styleId: this.markType(String(ele.type)),
                                    position: new TMap.LatLng(ele.lat, ele.lng),
                                });
                            });
                            this.$store.state.safeAnalysis.mark.setGeometries(
                                geo
                            );
                            // 如果是从历史统计分析页面跳转而来
                            this.HistoryHandle();
                        });
                    break;
                }
            }
        },
        //请求事件详情数据
        questEvent(event_id) {
            this.loading = true;
            this.time = [];
            if (typeof this.$store.state.safeAnalysis.timePicker === "object"){
                // 这里由于设置失误:初始化vuex里的timePicker时候是new Date，但后面修改其值的时候其值类型为Number
                 var timePicker_time = String(this.getCurrentZeroClockTime(this.$store.state.safeAnalysis.timePicker.getTime()/1000 - 86400));
            }else{
                var timePicker_time = this.getCurrentZeroClockTime(this.$store.state.safeAnalysis.timePicker)
            }

            let current_time = this.getCurrentZeroClockTime(new Date().getTime()/1000 - 86400);
            if (this.$store.state.safeAnalysis.isFromHistory) {
                // 如果是从历史统计分析页面跳转而来
                var historyTime = this.$store.state.safeAnalysis.timeFromHistory;
                this.time.push(this.getTime(),this.getCurrentZeroClockTime(historyTime),this.getNextZeroClockTime(historyTime))
            }else if (timePicker_time !== current_time){
                // 如果时间选择器选择的是以往的时间
                this.time.push(this.getTime(),this.getCurrentZeroClockTime(timePicker_time),this.getNextZeroClockTime(timePicker_time))
            } 
            else {
                // 如果时间选择器选择的是当日的时间
                this.time.push(this.getTime());
            }

            this.$API.safeAnalyze.eventDetail(event_id,...this.time).then((res) => {
                console.log("res",res)
                this.loading = false;
                var out_res = res;
                this.eventSum = res.seg_event_count;
                res = res.data[0];
                this.segId = res.seg_id;
                this.eventPlace = res.seg_name;
                this.eventTableData = [
                    { type: "事故", count: out_res.accident_count },
                    { type: "施工", count: out_res.roadworks_count },
                    { type: "封路", count: out_res.close_count },
                    { type: "拥堵", count: out_res.jam_count },
                ];
                this.eventInfoTableData = [
                    // { infoName: "事件编号", infoVal: res.event_id },
                    { infoName: "事件编号", infoVal: res.origin_id },
                    { infoName: "事件标题", infoVal: res.title },
                    { infoName: "事件内容", infoVal: res.info },
                    { infoName: "事件来源", infoVal: res.source },
                    {
                        infoName: "事件类型",
                        infoVal: this.markType(String(res.type), true),
                    },
                    // { infoName: "事件类型", infoVal: res.type },
                    {
                        infoName: "事件状态",
                        infoVal: res.event_status == 0 ? "处理中" : "已完成",
                    },
                    {
                        infoName: "地理空间所属区域",
                        infoVal: res.region == 0 ? "城内" : "高速",
                    },
                    { infoName: "开始时间", infoVal: res.start_time },
                    { infoName: "结束时间", infoVal: res.end_time },
                    { infoName: "更新时间", infoVal: res.update_time },
                ];
            });
        },
        // 表格 高亮行 变化 事件
        handleCurrentChange(data) {
            if (data) {
                var seg_id = data.seg_id;
                var link_num = this.segidToLinkNum[seg_id];

                // var geometries =
                //     this.$store.state.safeAnalysis.line.getGeometries();
                // geometries.forEach((ele) => {
                //     ele.styleId = "default";
                // });
                // this.$store.state.safeAnalysis.line.setGeometries(geometries);

                var geometries = [];
                for (var i = 0; i < link_num; i++) {
                    var geometry =
                        this.$store.state.safeAnalysis.line.getGeometryById(
                            seg_id + "-" + i
                        );
                    if (i == Math.floor((link_num - 1) / 2)) {
                        this.$store.state.safeAnalysis.map.setCenter(
                            geometry.paths[
                                Math.floor(geometry.paths.length / 2)
                            ]
                        );
                        this.$store.state.safeAnalysis.map.setZoom(17);
                    }
                    geometry.styleId = "highlight";
                    // this.$store.state.safeAnalysis.line.updateGeometries(
                    //     geometry
                    // );
                    geometries.push(geometry);
                }
                this.$store.state.safeAnalysis.activeLine.setGeometries(
                    geometries
                );
            }
        },
        //地图上线条的点击事件，由于要等待表格加载完成再设置，故写在这里
        lineClick() {
            this.$store.state.safeAnalysis.line.on("click", (evt) => {
                try {
                    this.$refs.safeAnalysis.setCurrentRow(
                        this.tableData[evt.geometry.row]
                    );
                    // 设置滚动条位置
                    this.$nextTick(() => {
                        setTimeout(() => {
                            var scrollTop = this.$el.querySelector(
                                ".el-table__body-wrapper"
                            );
                            scrollTop.scrollTop =
                                ((scrollTop.scrollHeight -
                                    scrollTop.clientHeight) /
                                    this.rank_num) *
                                evt.geometry.row;
                        }, 13);
                    });
                } catch (e) {
                    return;
                }
            });
        },
        //地图上Mark的点击事件
        markClick() {
            this.$store.state.safeAnalysis.mark.on("click", (evt) => {
                try {
                    this.activePointId = evt.geometry.id;
                    this.$store.state.safeAnalysis.map.setCenter(
                        evt.geometry.position
                    );
                    this.$store.state.safeAnalysis.map.setZoom(14);
                    var geo = evt.geometry;
                    this.$store.state.safeAnalysis.activeMark.setGeometries([
                        geo,
                    ]);
                    //请求事件点详细信息
                    this.questEvent(this.activePointId);
                } catch (e) {
                    return;
                }
            });
        },
        // 格式化表格数据，让其精确到小数点后两位
        tableFormatter(row, col, val, index) {
            if (val) {
                return val.toFixed(2);
            } else {
                return val;
            }
        },
        //路段事件详情 quest
        segEvent() {
            this.$store.state.safeAnalysis.ifEventDetail =
                !this.$store.state.safeAnalysis.ifEventDetail;
            this.$store.state.safeAnalysis.activePointId = this.activePointId;
            this.$store.state.safeAnalysis.activeSegId = this.segId;
        },
        //从历史统计分析页面跳转到本页面的处理函数
        HistoryHandle() {
            if (this.$store.state.safeAnalysis.isFromHistory) {
                this.questEvent(
                    this.$store.state.safeAnalysis.eventIdFromHistory
                );

                this.activePointId =
                    this.$store.state.safeAnalysis.eventIdFromHistory;
                this.$store.state.activePointId =
                    this.$store.state.safeAnalysis.eventIdFromHistory;
                let geo = this.$store.state.safeAnalysis.mark.getGeometryById(
                    this.activePointId
                );
                this.$store.state.safeAnalysis.activeMark.setGeometries([geo]);
                this.$store.state.safeAnalysis.map.setCenter(geo.position);
            }
        },
    },
    created() {
        if (this.$store.state.safeAnalysis.isFromHistory) {
            this.tabIndex = "2";
        }
    },
    mounted() {
        this.questData();
        this.lineClick();
        this.markClick();
        setTimeout(() => {
            this.getHeight();
        }, 300);
        window.addEventListener("resize", this.getHeight);
    },
    destroyed() {
      window.removeEventListener("resize", this.getHeight);
      this.$store.state.safeAnalysis.timePickerStr = 0;
      this.$store.state.safeAnalysis.timePicker = new Date();
    
    },
    watch: {
        //从交通事故事件详情返回地图的情况
        "$store.state.safeAnalysis.ifEventDetail": function (newVal) {
            if (
                newVal == false &&
                this.$store.state.safeAnalysis.activePointId !==
                    this.activePointId
            ) {
                this.questEvent(this.$store.state.safeAnalysis.activePointId);
                this.activePointId =
                    this.$store.state.safeAnalysis.activePointId;
                let geo = this.$store.state.safeAnalysis.mark.getGeometryById(
                    this.$store.state.safeAnalysis.activePointId
                );
                this.$store.state.safeAnalysis.activeMark.setGeometries([geo]);
                this.$store.state.safeAnalysis.map.setCenter(geo.position);
            }
        },
        //监听时间选择器
        "$store.state.safeAnalysis.timePicker":function(newVal){
            this.$store.state.safeAnalysis.line.setGeometries([]);
            this.$store.state.safeAnalysis.activeMark.setGeometries([]);
            this.$store.state.activePointId =  0;
            this.activePointId = 0;
            this.time = [];
            this.$store.state.safeAnalysis.loading_traffic = true;
            this.time.push(this.getTime(),this.getCurrentZeroClockTime(newVal),this.getNextZeroClockTime(newVal));
            this.$API.safeAnalyze
                .allEventsPoints(...this.time)
                .then((res) => {
                    this.$store.state.safeAnalysis.loading_traffic = false;
                    let geo = [];
                    res.data.forEach((ele) => {
                        geo.push({
                            id: ele.event_id,
                            styleId: this.markType(String(ele.type)),
                            position: new TMap.LatLng(ele.lat, ele.lng),
                        });
                    });
                    this.$store.state.safeAnalysis.mark.setGeometries(
                        geo
                    );
                });
        }
    },
};
</script>

<style lang="scss" scoped>
.trail-watch {
    /* transform: translateX(500px);
    transition: .3s; */
    left: 10px;
    /* height: 598px; */
    width: 370px;
    padding: 0 20px;
    background-color: #fff;
    border-radius: 4px;
    padding-bottom: 20px;
    border: 1px solid rgba(202, 215, 237, 0.24);
    box-shadow: 0 4px 10px 0 rgba(0, 44, 102, 0.05);
}

.active_a {
    transform: translateX(-380px);
    transition: 0.3s;
}

.wathc-packup {
    height: 42px;
    width: 42px;
    position: absolute;
    right: -63px;
    top: 4px;
    cursor: pointer;
    img {
        border: 1px solid rgba(202, 215, 237, 0.24);
        box-shadow: 0 4px 10px 0 rgba(0, 44, 102, 0.05);
        border-radius: 5px;
    }
}

.packup {
    left: 200px;
    width: 40px;
    margin-left: -10px;
}

.demo-choice-suffix {
    position: relative;
    .deviceTypeSelect {
        position: absolute;
        top: 30px;
        right: 0px;
        width: 130px;
    }
}

.part2 {
    position: relative;
    top: 10%;
}

.region-choice {
    display: flex;
    background-color: #2d3c51;
    color: #e2e8f1;
    padding-bottom: 4%;
    justify-content: flex-start;
    .region {
        flex: 1;
    }
    .detail-region {
        flex: 1;
    }
}

.index-sum {
    background-color: #2d3c51;
    color: #e2e8f1;
    padding-bottom: 4%;
}

.point-analysis {
    background-color: #2d3c51;
    color: #e2e8f1;
    width: 370px;
    box-sizing: border-box;
    padding-left: 5%;
    overflow: auto;
}

.please-select-point {
    margin-left: 2px;
    background-color: #2d3c51;
    color: #e2e8f1;
    height: 90%;
    width: 370px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding-bottom: 25%;
    font-size: 1rem;
    span {
        color: #00faff;
        padding: 0 2%;
    }
    div{
        flex: 1;
        width: 100%;
        text-align: center;
    }
}

.eventInfoTitle {
    text-align: center;
    font-size: 1.4rem;
    padding-top: 4%;
}

.searchMore {
    text-align: right;
    font-size: 0.6rem;
    padding-right: 10%;
    color: #00faff;
    text-decoration: underline 1px #00faff;
    cursor: pointer;
}

.accident-location {
    font-weight: 400;
    font-size: 1.2rem;
    padding-bottom: 5%;
}

.el-menu-demo {
    // border-bottom: none;
    width: 370px;
    margin: 0 auto;
    padding-bottom: 5%;
    text-align: center;
}

.el-menu-item {
    list-style: none;
    display: inline-block;
    width: 50%;
    // padding: 0 25px;
    color: #e2e8f1 !important;
}

.el-menu--horizontal > .el-menu-item {
    border-bottom: none !important;
}
.el-menu--horizontal > .el-menu-item.is-active {
    border-bottom: 2px solid #09d5de !important;
    padding-bottom: 1px !important;
}

.el-menu-item.is-active {
    background-color: transparent !important;
    color: #09d5de !important;
    border-bottom: 2px #09d5de !important;
    span {
        color: #09d5de !important;
    }
}

.el-menu-item:hover {
    color: #09d5de !important;
    background-color: transparent !important;
}

#watch .eventAnalysis {
    width: 370px !important;
    // height: 498px !important;
    position: absolute !important;
    // overflow: scroll !important;
    // border-top: 1px solid #EBEEF5 !important;
}

.el-table::before {
    height: 0 !important;
}

.el-table__header-wrapper {
    border-bottom: 0px !important;
}

.el-menu.el-menu--horizontal {
    border-bottom: 0px !important;
}

/deep/.el-table td {
    border-bottom: 0px !important;
}

/deep/.eventDistribution td {
    border-bottom: solid 1px !important;
}

/*滚动条整体样式*/
/deep/ .el-table__body-wrapper::-webkit-scrollbar {
    width: 8px; /*竖向滚动条的宽度*/
    height: 10px; /*横向滚动条的高度*/
}
/deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
    /*滚动条里面的小方块*/
    background: #9a9da2;
    border-radius: 4px;
}
/deep/ .el-table__body-wrapper::-webkit-scrollbar-track {
    /*滚动条轨道的样式*/
    background: #727c8a;
}

/*滚动条整体样式*/
::-webkit-scrollbar {
    width: 8px; /*竖向滚动条的宽度*/
    height: 10px; /*横向滚动条的高度*/
}
::-webkit-scrollbar-thumb {
    /*滚动条里面的小方块*/
    background: #9a9da2;
    border-radius: 4px;
}
::-webkit-scrollbar-track {
    /*滚动条轨道的样式*/
    background: #727c8a;
}

.timePicker{
    margin-bottom: 10px;
}

/deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
}

</style>
