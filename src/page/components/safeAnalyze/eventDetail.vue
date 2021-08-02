<template>
    <div>
        <h1>交通事故事件详情</h1>
        <div class="close">
            <img
                @click="
                    $store.state.safeAnalysis.ifEventDetail =
                        !$store.state.safeAnalysis.ifEventDetail
                "
                src="~sysStatic/images/btn_close@2x.png"
                alt="关闭"
                title="关闭交通事故事件详情页面"
            />
        </div>

        <p>路段:{{ seg_name }}</p>
        <el-table
            class="eventDistribution"
            ref="safeAnalysis"
            :data="eventTableData"
            style="width: 100%"
            :header-cell-style="{ background: '#374a63' }"
            border
            :max-height="tableHeight"
        >
            <el-table-column
                prop="origin_id"
                label="事件编号"
                align="center"
            ></el-table-column>
            <el-table-column
                prop="title"
                label="事件标题"
                align="center"
            ></el-table-column>
            <el-table-column
                prop="info"
                label="事件内容"
                align="center"
            ></el-table-column>
            <el-table-column
                prop="source"
                label="事件来源"
                align="center"
            ></el-table-column>
            <el-table-column
                prop="type"
                label="事件类型"
                align="center"
                :formatter="markType"
            ></el-table-column>
            <el-table-column
                prop="event_status"
                label="事件状态"
                align="center"
                :formatter="eventStatus"
            ></el-table-column>
            <el-table-column label="查看位置" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" @click="findPosition(scope.row)"
                        >查看位置</el-button
                    >
                </template>
            </el-table-column>
            <el-table-column
                prop="rc"
                label="道路等级"
                align="center"
                :formatter="segRc"
            ></el-table-column>
            <el-table-column
                prop="region"
                label="地理空间所属区域"
                align="center"
                :formatter="regionBelong"
            ></el-table-column>
            <el-table-column
                prop="start_time"
                label="起始时间"
                align="center"
            ></el-table-column>
            <el-table-column
                prop="end_time"
                label="结束时间"
                align="center"
            ></el-table-column>
            <el-table-column
                prop="update_time"
                label="更新时间"
                align="center"
            ></el-table-column>
        </el-table>
        <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="10"
            layout="total, prev, pager, next"
            :total="event_sum"
            background
            class="pagination"
        >
        </el-pagination>
    </div>
</template>

<script>
export default {
    data() {
        return {
            eventTableData: [],
            seg_name: "", //路段名称
            tableHeight: "660", //表格高度
            page_index: "", //表格页数
            page_size: "", //表格每页显示多少条信息
            event_sum: 10, //事故总数
            currentPage:1, //当前页码
            seg_id:"", //当前表格所属路段的ID
            time:[],
        };
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
        questData(seg_id, page_index, page_size) {
            this.time = []
            // let timePicker_time = String(this.$store.state.safeAnalysis.timePicker);
            let current_time = this.getCurrentZeroClockTime(new Date().getTime()/1000);
            if (typeof this.$store.state.safeAnalysis.timePicker === "object"){
                // 这里由于设置失误:初始化vuex里的timePicker时候是new Date，但后面修改其值的时候其值类型为Number
                 var timePicker_time = String(this.getCurrentZeroClockTime(this.$store.state.safeAnalysis.timePicker.getTime()/1000 - 86400));
            }else{
                var timePicker_time = this.getCurrentZeroClockTime(this.$store.state.safeAnalysis.timePicker)
            }

            if (this.$store.state.safeAnalysis.isFromHistory) {
                var historyTime = this.$store.state.safeAnalysis.timeFromHistory;
                this.time.push(this.getTime(),this.getCurrentZeroClockTime(historyTime),this.getNextZeroClockTime(historyTime))
            }else if (timePicker_time !== current_time){
                // 如果时间选择器选择的是以往的时间
                this.time.push(this.getTime(),this.getCurrentZeroClockTime(timePicker_time),this.getNextZeroClockTime(timePicker_time))
            }  
            else {
                this.time.push(this.getTime());
            }
            this.$API.safeAnalyze
                .segEvent(seg_id, page_index, page_size,...this.time)
                .then((res) => {
                    this.event_sum = res.seg_event_count
                    this.seg_name = res.seg_name;
                    this.eventTableData = res.data;
                    // this.eventTableData = this.eventTableData.concat(res.data);
                    // this.eventTableData = this.eventTableData.concat(res.data);
                    // this.eventTableData = this.eventTableData.concat(res.data);
                    // this.eventTableData = this.eventTableData.concat(res.data);
                    // this.eventTableData = this.eventTableData.concat(res.data);
                    // this.eventTableData = this.eventTableData.concat(res.data);
                });
        },
        //事件点的类型判断
        markType(row, col, type, index) {
            switch (type) {
                case 1:
                    return "事故";
                case 2:
                    return "施工";
                case 3:
                    return "封路";
                case 4:
                    return "拥堵";
            }
        },
        //事件状态
        eventStatus(row, col, type, index) {
            switch (type) {
                case 1:
                    return "处理中";
                case 2:
                    return "已完成";
            }
        },
        //事件匹配道路等级
        segRc(row, col, type, index) {
            switch (type) {
                case 0:
                    return "高速路";
                case 1:
                    return "都市高速路";
                case 2:
                    return "国道";
                case 3:
                    return "省道";
                case 4:
                    return "县道";
                case 5:
                    return "暂无定义";
                case 6:
                    return "乡镇村道";
                case 7:
                    return "暂无定义";
                case 8:
                    return "其他道路";
                case 9:
                    return "非引导道路";
                case 10:
                    return "轮渡";
                case 11:
                    return "行人道路";
                case 12:
                    return "人渡";
            }
        },
        //地理空间所属区域
        regionBelong(row, col, type, index) {
            switch (type) {
                case 0:
                    return "城内";
                case 1:
                    return "高速";
            }
        },
        //查询位置
        findPosition(row) {
            let event_id = row.event_id;
            this.$store.state.safeAnalysis.ifEventDetail =
                !this.$store.state.safeAnalysis.ifEventDetail;
            this.$store.state.safeAnalysis.activePointId = event_id;
        },
        //表格高度自适应
        getHeight() {
            this.tableHeight = window.innerHeight - 300;
        },
        //页码变化回调函数
        handleCurrentChange(currentPageIndex){
            this.questData(this.seg_id,currentPageIndex,10);
        }
    },
    watch: {
        //从地图 通过 "查看更多" 进入 交通事故事件详情页面
        "$store.state.safeAnalysis.activeSegId": function (newVal, oldVal) {
            if (this.$store.state.safeAnalysis.ifEventDetail) {
                this.seg_id = newVal;
                this.questData(newVal, 1, 10); //默认显示第一页，10条数据
            }
        },
    },
    mounted() {
        setTimeout(() => {
            this.getHeight();
        }, 300);
        window.addEventListener("resize", this.getHeight);
    },
    destroyed() {
        window.removeEventListener("resize", this.getHeight);
    },
};
</script>

<style lang="scss" scoped>
div {
    /* display: flex;
    flex-direction: column;
    align-items: center; */
    color: #feffff;
}

.close {
    position: absolute;
    width: 40px;
    right: -5px;
    top: 4px;
    cursor: pointer;
}

h1 {
    font-weight: 600;
    font-size: 2rem;
    text-align: center;
}

p {
    display: inline-block;
    font-size: 1rem;
    // border: 1px solid gray;
    // border-radius: 3px;
    padding: 8px 15px;
}

.pagination{
    margin-top: 10px;
    text-align: center; 
}

/*滚动条整体样式*/
/deep/ .el-table__body-wrapper::-webkit-scrollbar {
  width: 8px; /*竖向滚动条的宽度*/
  height: 10px; /*横向滚动条的高度*/
}
/deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
  /*滚动条里面的小方块*/
  background: #9A9DA2;
  border-radius: 4px;
}
/deep/ .el-table__body-wrapper::-webkit-scrollbar-track {
  /*滚动条轨道的样式*/
  background: #727C8A;
}

</style>
