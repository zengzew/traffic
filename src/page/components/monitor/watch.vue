<template>
    <div id="trailWatch" class="trail-watch" :class="{ active_a: !isActive }">
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
        <div class="watch-title">
            <p class="watch-title-item-one">实时监控</p>
            <p class="watch-title-item-two">
                当前视野内显示设备数量 {{ nowCounts }}
            </p>
        </div>
        <div class="demo-input-suffix">
            <el-input
                clearable
                placeholder="请输入车辆编号"
                :trigger-on-focus="false"
                prefix-icon="el-icon-search"
                v-model="search"
                @keyup.native.enter="inputChange"
            ></el-input>
        </div>
        <div class="demo-choice-suffix" v-if="this.showTab">
            <el-menu
                :default-active="tabIndex"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelect"
            >
                <el-menu-item index="1">全部 {{ totalcount }}</el-menu-item>
                <el-menu-item index="2">在线 {{ oncount }}</el-menu-item>
                <el-menu-item index="3">离线 {{ offcount }}</el-menu-item>
            </el-menu>
        </div>
        <!-- "{ 'afterSearch': this.showTab }" -->
        <template>
            <el-table
                highlight-current-row
                @row-click="handleRowChangeTwo"
                :height="tableHeight1"
                :data="tableData"
                v-loading="loading"
                element-loading-text="加载中"
                element-loading-background="rgba(255, 255, 255,1)"
                style="width: 100%"
            >
                <el-table-column
                    prop="title"
                    :render-header="deviceTypeRenderHeader"
                >
                    <template slot-scope="scope">
                        <div class="watch-table-list">
                            <div v-if="scope.row.online === 1">
                                <span
                                    :style="{
                                        backgroundImage: `url(${require('../../../assets/images/device_v2/deviceIcon_' +
                                            scope.row.type +
                                            '.png')})`,
                                    }"
                                    class="card-icon"
                                ></span>
                                <span
                                    class="table-item-title"
                                    style="marginleft: 50px; color: #020202"
                                    >{{ scope.row.title }}</span
                                >
                            </div>
                            <div v-else>
                                <span
                                    :style="{
                                        backgroundImage: `url(${require('../../../assets/images/device_v2/deviceIcon_' +
                                            scope.row.type +
                                            '.png')})`,
                                        opacity: 0.4,
                                    }"
                                    class="card-icon"
                                ></span>
                                <span
                                    class="table-item-title"
                                    style="marginleft: 50px; color: #606275"
                                    >{{ scope.row.title }}</span
                                >
                            </div>
                            <span
                                v-if="scope.row.online === 1"
                                style="color: #020202"
                                >在线</span
                            >
                            <span v-else style="color: #606275">离线</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <div class="block-pagination">
            <div class="block">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pagesize"
                    layout="prev, pager, next"
                    :total="pageCount"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from "vuex";
import DeviceType, { getTypeNumByName } from "../../../config/deviceType";

export default {
    data() {
        return {
            packupImg: "~sysStatic/images/map_packup.png",
            offcount: 0,
            timeout: "",
            timeoutC: "",
            oncount: 0,
            totalcount: 0,
            inputValue: "",
            isActive: true,
            active: false,
            showTab: true,
            restaurants: [],
            checkList: [],
            tabIndex: "1",
            search: "",
            currentPage: 1,
            all: 200,
            activeIndex: "1",
            activeIndex2: "1",
            input2: "",
            tableData: [],
            // tableData4: [],
            tableHeight1: "550",
            tableHeight: "",

            pagesize: 10,
            pageCount: 0,
            loading: false,
            isOnline: null, //  0：离线  1：在线
            types: [], // 什么车  0：全部  1：警车  2:铁骑  3：刑警
            checkListOpts: [],
        };
    },

    watch: {
        inputValue(val) {
            if (val.length === 0) {
                this.showTab = true;
            }
        },
        checkList: {
            handler(val) {
                console.log("checkListChange", val);
                this.$store.commit("watch/setDeviceList", val); // 更新设备类型数组
                // 处理checkbox逻辑
                this.types = getTypeNumByName(val);
                this.currentPage = 1;
                this.questData();
            },
            // immediate: true,
            deep: true,
        },
        // 监听当前业务
        currentOrder: {
            handler() {
                this.questData();
            },
            deep: true,
        },
        isOnline(val) {
            this.$store.commit("watch/setIsOnline", val); // 更新在线展示类型， 全部、在线、离线
        },
    },
    computed: {
        ...mapState({
            nowCounts: (state) => state.watch.nowCounts,
            currentOrder: (state) => state.multiOrder.currentOrder,
        }),
    },
    created() {
        // 拼接下拉框选项
        Object.keys(DeviceType).forEach((item) => {
            item > 0 &&
                this.checkListOpts.push(DeviceType[item]) &&
                this.checkList.push(DeviceType[item]);
        });
    },
    mounted() {
        // this.isOnline = "";
        // this.types = ''
        this.questData(); // 获取全部数据
        // this.restaurants = this.loadAll();
        setTimeout(() => {
            this.getHeight();
        }, 300);
        window.addEventListener("resize", this.getHeight);
        //  优化处理定时器关闭的方法
        const self = this;
        if (self && !self._isDestroyed) {
            setInterval(() => {
                if (self && !self._isDestroyed) self.questData();
            }, 1000 * 60 * 1); // 每隔1分钟刷新一下
        }
    },
    destroyed() {
        window.removeEventListener("resize", this.getHeight);
    },
    methods: {
        deviceTypeRenderHeader(h) {
            return h("div", { class: "tableHeadDiv" }, [
                h("span", { style: "display: block" }, "车辆类型"),
                h(
                    "el-checkbox-group",
                    {
                        class: "max-choice",
                        props: {
                            value: this.checkList,
                        },
                    },
                    [
                        // 下拉框里面填充选项，通过filters遍历map，为每一个选项赋值。
                        this.checkListOpts.map((item) =>
                            h("el-checkbox", {
                                class: "checkDiv",
                                props: {
                                    value: item,
                                    label: item,
                                },
                                on: {
                                    change: (value) => {
                                        if (value) {
                                            this.checkList.push(item);
                                        } else {
                                            const i = this.checkList.findIndex(
                                                (val) => val === item
                                            );
                                            this.checkList.splice(i, 1);
                                        }
                                    },
                                },
                            })
                        ),
                    ]
                ),
            ]);
        },
        // 请求默认数据
        questData(index) {
            index = index ? index : this.currentPage;
            this.tableData = [];
            if (this.checkList.length === 0) {
                this.pageCount = 0;
                this.totalcount = 0;
                this.oncount = 0;
                this.offcount = 0;
                this.currentPage = 1;
                return false;
            }

            this.loading = true;
            // 通过接口调用数据
            this.$API.device
                .deviceDataByOnlineGet({
                    pagesize: this.pagesize,
                    pageindex: index,
                    online: this.isOnline,
                    title: this.search,
                    types: this.types.join(",") || null,
                })
                .then((res) => {
                    this.loading = false;
                    if (res.status === 0) {
                        this.updatePageCountByType(res.summary);
                        this.tableData = res.result;
                    } else {
                        this.$message({
                            type: "error",
                            message: res.message,
                        });
                        this.pageCount = 0;
                    }
                });
        },
        updatePageCountByType(summary) {
            /* this.pageCount = summary.totalcount;
        this.totalcount = summary.totalcount;
        this.oncount = summary.onlinecount;
        this.offcount = summary.offlinecount*/
            switch (this.isOnline) {
                case null:
                    this.pageCount = summary.totalcount;
                    this.totalcount = summary.totalcount;
                    this.oncount = summary.onlinecount;
                    this.offcount = summary.offlinecount;
                    break;
                case 0:
                    this.pageCount = summary.offlinecount;
                    this.offcount = summary.offlinecount;
                    break;
                case 1:
                    this.pageCount = summary.onlinecount;
                    this.oncount = summary.onlinecount;
            }
        },
        // 处理watch---row的点击
        handleRowChangeTwo(i) {
            // 点击新的时间段 轨迹优化恢复原样
            /* this.$store.state.watch.carDetail = i.deviceid
        this.$store.dispatch("watch/getCar", i['deviceid']).then(() => {
        })*/

            this.$store.commit("watch/setCar", i.deviceid);
            this.$store.commit("watch/setIsDetailShow", true);
        },
        animate() {
            this.isActive = !this.isActive;
        },
        getHeight() {
            this.tableHeight = window.innerHeight - 100;
            this.tableHeight1 = window.innerHeight - 380;
        },
        inputChange() {
            this.currentPage = this.showTab ? null : this.currentPage;
            // 通过接口调用数据
            if (this.search.length > 0) {
                this.$API.device
                    .deviceDataByOnlineGet({
                        title: this.search,
                        pageindex: this.currentPage,
                        types: this.types.join(",") || null,
                    })
                    .then((res) => {
                        if (res.status === 0) {
                            if (res.result) {
                                this.showTab = !this.search.length;
                                console.log("查询结果", res);
                                this.tableData = res.result;
                                this.pageCount = res.summary.totalcount;
                            } else {
                                // this.showTab = value ? false: true;
                                this.$message({
                                    message: "查询无结果",
                                    type: "warning",
                                });
                            }
                        } else {
                            this.$message.error(res.message);
                        }
                    });
            } else {
                this.showTab = true;
                this.questData();
            }
        },
        handleSizeChange(pagesize) {
            this.pagesize = pagesize; // 每页下拉显示数据
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
            if (this.inputValue) {
                // 查询模式下切换页码
                this.inputChange(this.inputValue);
            } else {
                // 非查询模式下切换
                this.questData(currentPage);
            }
        },
        handleSelect(key) {
            this.currentPage = 1;
            switch (key) {
                case "1": {
                    this.isOnline = null;
                    this.questData();
                    break;
                }
                case "2": {
                    this.isOnline = 1;
                    this.questData();
                    break;
                }
                case "3": {
                    this.isOnline = 0;
                    this.questData();
                    break;
                }
            }
        },
    },
};
</script>

<style lang="scss" scoped>
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
.demo-choice-suffix {
    position: relative;
    .deviceTypeSelect {
        position: absolute;
        top: 30px;
        right: 0px;
        width: 130px;
    }
}

.packup {
    left: 200px;
    width: 40px;
    margin-left: -10px;
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
.el-pagination {
    white-space: nowrap;
    padding: 2px 5px;
    color: #303133;
    font-weight: bold;
    vertical-align: middle;
    display: inline-block;
    height: 16px;
}

.el-autocomplete {
    width: 100%;
}

.afterSearch {
    height: 94px !important;
}

.police-car {
    margin-right: 13px;
}

.max-choice {
    position: absolute;
    right: 10px;
    /* bottom: 489px; */
    top: 215px;
    left: 100px;
    z-index: 1;
}

.el-table__body tr,
.el-table__body td {
    // padding: 0;
    // height: 40px;
}

.el-checkbox {
    font-weight: 400;
    margin-right: 10px;
}

#watch > .block-pagination {
    width: 100%;
    position: absolute;
    bottom: 30px;
    left: 0;

    .el-pager {
        li.active {
            color: #000;
        }

        li {
            color: #909399;
        }
    }
}

.block {
    width: 100%;
    margin: 0 auto;
    text-align: center;
}

.active_a {
    transform: translateX(-430px);
    transition: 0.3s;
}

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

.el-menu-item {
    list-style: none;
    display: inline-block;
    /* width: 33%; */
}

.demo-input-suffix {
    padding-bottom: 9px;
}

#search-watch {
    width: 300px;
}

.watch-table-list {
    width: 100%;
    height: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 20px;
    cursor: pointer;

    .table-item-title {
        width: 200px;
        height: 32px;
        margin-left: 55px;
        line-height: 34px;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.card-icon {
    width: 30px;
    height: 30px;
    position: absolute;
    left: 20px;
    top: 6px;
    background: transparent no-repeat left top;
    background-size: 100% 100%;
}

.icon-policecar {
    background-image: url("../../../assets/images/device_v2/icon_policecar@2x.png");
}
.icon-moto {
    background-image: url("../../../assets/images/device_v2/deviceIcon_2.png");
}
.icon-policeman {
    background: url("../../../assets/images/device_v2/deviceIcon_3.png");
}
.icon-policeman {
    background: url("../../../assets/images/device_v2/deviceIcon_3.png");
}
// 卡口
.icon-monitor {
    background: url("../../../assets/images/device_v2/icon_monitor_active@2x.png");
}
.icon-taxi {
    background: url("../../../assets/images/device_v2/deviceIcon_5.png");
}
.icon-bus {
    background: url("../../../assets/images/device_v2/deviceIcon_6.png");
}
.icon-car {
    background-image: url("../../../assets/images/device_v2/deviceIcon_7.png");
}
.icon-truck {
    background: url("../../../assets/images/device_v2/deviceIcon_8.png");
}
.icon-moto-offline {
    background-image: url("../../../assets/images/device_v2/deviceIcon_2.png");
    opacity: 40%;
}
.icon-car-offline {
    background-image: url("../../../assets/images/device_v2/deviceIcon_7.png");
    opacity: 40%;
}
.el-table th > .cell {
    padding-right: 6px;
    /* // padding-left: 45px; */
}

.el-menu-item:first-child {
    padding: 0;
    margin: 0 10px;
}

.el-menu-item:nth-child(2) {
    padding: 0;
    margin: 0 10px;
}

.el-menu-item:nth-child(3) {
    padding: 0;
    margin: 0 10px;
}

.el-menu-demo {
    // border-bottom: none;
    width: 370px;
    margin: 0 auto;
    text-align: center;
}

.watch-title-item-one {
    font-family: PingFangSC-Medium;
    font-size: 20px;
    color: #020202;
    letter-spacing: 0;
    line-height: 20px;
}

.watch-title-item-two {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #606275;
    letter-spacing: 0;
    line-height: 14px;
    padding-top: 15px;
    padding-bottom: 21px;
}
.watch-title {
    padding-top: 30px;
}
/deep/ .checkDiv {
    margin-right: 0;
    min-width: 87px;
}
</style>
