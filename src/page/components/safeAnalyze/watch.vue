<template>
    <div class="analyze-watch" :class="{ active_a: !isActive }">
        <div class="wathc-packup">
            <img
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
            />
        </div>
        <div class="demo-choice-suffix">
            <el-menu
                :default-active="tabIndex"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelect"
                background-color="#E4E4E4"
                text-color="#7E7E7E"
            >
                <el-menu-item index="1">急刹车 </el-menu-item>
                <el-menu-item index="2">急转弯 </el-menu-item>
                <el-menu-item index="3">急加速 </el-menu-item>
                <el-menu-item index="4">超速 </el-menu-item>
            </el-menu>
        </div>
        <template>
            <el-table
                highlight-current-row
                :height="tableHeight1"
                :data="tableData"
                v-loading="loading"
                element-loading-text="加载中"
                element-loading-background="rgba(255, 255, 255,1)"
                style="width: 100%"
                higlight-current-row
                @current-change="handleCurrentChange"
            >
                <el-table-column
                    type="index"
                    :index="1"
                    label="排行"
                ></el-table-column>
                <el-table-column
                    prop="seg_name"
                    :label="label1"
                    width="180"
                ></el-table-column>
                <el-table-column
                    :prop="propName"
                    :label="label2"
                ></el-table-column>
            </el-table>
        </template>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isActive: true,
            tabIndex: "1",
            tableHeight1: "550",
            tableHeight: "",
            loading: false,
            tableData: [],
        };
    },
    computed: {
        label1: function () {
            switch (this.tabIndex) {
                case "1": {
                    return "急刹路段";
                }
                case "2": {
                    return "急转弯路段";
                }
                case "3": {
                    return "急加速路段";
                }
                case "4": {
                    return "超速路段";
                }
            }
        },
        label2: function () {
            switch (this.tabIndex) {
                case "1": {
                    return "急刹指数";
                }
                case "2": {
                    return "急转弯指数";
                }
                case "3": {
                    return "急加速指数";
                }
                case "4": {
                    return "超速指数";
                }
            }
        },
        propName: function () {
            switch (this.tabIndex) {
                case "1":
                    return "brake_index";
                case "2":
                    return "turn_index";
                case "3":
                    return "accelerate_index";
                case "4":
                    return "overspeed_index";
            }
        },
    },
    methods: {
        animate() {
            this.isActive = !this.isActive;
        },
        handleSelect(key) {
            this.tabIndex = key;
            this.questData();
        },
        drawLine(data) {
            // this.$store.state.safeAnalysis.line.updateGeometries([{}]);
            var geometries = [];
            let promises = [];
            data.forEach((element) => {
                promises.push(
                    new Promise((resolve, reject) => {
                        this.$API.safeAnalyze
                            .segLocation(element.seg_id)
                            .then((res) => {
                                resolve({ ...res, id: element.seg_id });
                            }),
                            (err) => {
                                reject(err);
                            };
                    })
                );
            });
            Promise.all(promises).then((res) => {
                res.forEach((element) => {
                    var paths = [];
                    element.data.coordinates.forEach((ele) => {
                        paths.push(new TMap.LatLng(ele[1], ele[0]));
                    });
                    geometries.push({
                        id: element.id,
                        styleId: "default",
                        paths,
                    });
                });
                this.$store.state.safeAnalysis.line.setGeometries(geometries);
            });
        },
        questData() {
            this.loading = true;
            switch (this.tabIndex) {
                case "1": {
                    this.$API.safeAnalyze.brakeDataGet().then((res) => {
                        this.tableData = res.data;
                        this.loading = false;
                        this.drawLine(res.data.slice(0, 3));
                    });
                    break;
                }
                case "2": {
                    this.$API.safeAnalyze.turnDataGet().then((res) => {
                        this.tableData = res.data;
                        this.loading = false;
                        this.drawLine(res.data.slice(0, 3));
                    });
                    break;
                }
                case "3": {
                    this.$API.safeAnalyze.accelerateDataGet().then((res) => {
                        this.tableData = res.data;
                        this.loading = false;
                        this.drawLine(res.data.slice(0, 3));
                    });
                    break;
                }
                case "4": {
                    this.$API.safeAnalyze.overspeedDataGet().then((res) => {
                        this.tableData = res.data;
                        this.loading = false;
                        this.drawLine(res.data.slice(0, 3));
                    });
                    break;
                }
            }
        },
        handleCurrentChange(data) {
            if (data) {
                var seg_id = data.seg_id;
                var geometries =
                    this.$store.state.safeAnalysis.line.getGeometries();
                geometries.forEach((ele) => {
                    ele.styleId = "default";
                });
                this.$store.state.safeAnalysis.line.setGeometries(geometries);
                var geometry =
                    this.$store.state.safeAnalysis.line.getGeometryById(seg_id);
                this.$store.state.safeAnalysis.map.setCenter(geometry.paths[0]);
                this.$store.state.safeAnalysis.map.setZoom(17);
                geometry.styleId = "highlight";
                this.$store.state.safeAnalysis.line.updateGeometries(geometry);
            }
        },
    },
    mounted() {
        this.questData();
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
    cursor: pointer;
    img {
        border: 1px solid rgba(202, 215, 237, 0.24);
        box-shadow: 0 4px 10px 0 rgba(0, 44, 102, 0.05);
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

.el-menu-demo {
    // border-bottom: none;
    width: 370px;
    margin: 0 auto;
    text-align: center;
}

.el-menu-item {
    list-style: none;
    display: inline-block;
    width: 25%;
    // padding: 0 25px;
}

#watch .el-table {
    width: 370px !important;
    // height: 498px !important;
    position: absolute !important;
    // overflow: scroll !important;
    // border-top: 1px solid #EBEEF5 !important;
}

.el-table__header-wrapper {
    border-top: 1px solid #ebeef5 !important;
}
.el-table::before {
    height: 0;
}

::-webkit-scrollbar {
    width: 13px;
    height: 10px;
    background-color: #fff;
}
</style>
