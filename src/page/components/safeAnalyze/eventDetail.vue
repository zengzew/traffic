<template>
    <div>
        <h1>交通事故事件详情</h1>
        <div class="close">
            <img
                @click="
                    $store.state.safeAnalysis.ifEventDetail =
                        !$store.state.safeAnalysis.ifEventDetail;
                "
                src="~sysStatic/images/btn_close@2x.png"
                alt="关闭"
            />
        </div>

        <p>路段名称</p>
        <p>{{ seg_name }}</p>
        <el-table
            class="eventDistribution"
            ref="safeAnalysis"
            :data="eventTableData"
            style="width: 100%"
            :header-cell-style="{ background: '#374a63' }"
            border
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
                prop="status"
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
                prop="seg_rc"
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
    </div>
</template>

<script>
export default {
    data() {
        return {
            eventTableData: [],
            seg_name: "", //路段名称
        };
    },
    methods: {
        questData(seg_id) {
            this.$API.safeAnalyze.segEvent(seg_id).then((res) => {
                this.seg_name = res.seg_name;
                this.eventTableData = res.data;
            });
        },
        //事件点的类型判断
        markType(row, col, type, index) {
            switch (type) {
                case "0":
                    return "事故";
                case "1":
                    return "施工";
                case "2":
                    return "封路";
                case "3":
                    return "拥堵";
            }
        },
        //事件状态
        eventStatus(row, col, type, index) {
            switch (type) {
                case "0":
                    return "处理中";
                case "1":
                    return "已完成";
            }
        },
        //事件匹配道路等级
        segRc(row, col, type, index) {
            switch (type) {
                case "0":
                    return "高速路";
                case "1":
                    return "都市高速路";
                case "2":
                    return "国道";
                case "3":
                    return "省道";
                case "4":
                    return "县道";
                case "5":
                    return "暂无定义";
                case "6":
                    return "乡镇村道";
                case "7":
                    return "暂无定义";
                case "8":
                    return "其他道路";
                case "9":
                    return "非引导道路";
                case "10":
                    return "轮渡";
                case "11":
                    return "行人道路";
                case "12":
                    return "人渡";
            }
        },
        //地理空间所属区域
        regionBelong(row, col, type, index) {
            switch (type) {
                case "0":
                    return "城区";
                case "1":
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
    },
    watch: {
        //从地图 通过 "查看更多" 进入 交通事故事件详情页面
        "$store.state.safeAnalysis.activePointId": function (newVal, oldVal) {
            if (this.$store.state.safeAnalysis.ifEventDetail) {
                this.questData(newVal);
            }
        },
    },
};
</script>

<style scoped>
div {
    /* display: flex;
    flex-direction: column;
    align-items: center; */
    color: #feffff;
}

.close {
    position: absolute;
    width: 40px;
    right: 0;
    top: 48px;
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
    border: 1px solid gray;
    border-radius: 3px;
    padding: 8px 15px;
}
</style>
