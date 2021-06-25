<template>
  <div class="main">
    <div class="centerbox" ref="tablecontainer">
      <div class="chartcontainer">
        <div id="charttitle">路段数量对比情况</div>
        <div class="timepicker">
          <span class="demonstration">当前时间范围</span>
          <el-date-picker
            v-model="timestamp"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            value-format="timestamp"
          >
          </el-date-picker>
        </div>
        <div id="chart"></div>
      </div>
      <div class="tablecontainer">
        <div id="tabletitle">历史路段累计数量</div>
        <div class="tableContent">
          <div id="deadline">
            统计时间截止： {{ deadlinedate | dateformat }}
          </div>
          <el-table
            :data="tableHistorySituation"
            style="width: 100%"
            :border="true"
            size="medium"
            :row-style="{ height: '40px' }"
          >
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="type" label="路段类型"> </el-table-column>
            <el-table-column prop="volume" label="积累数量（条）">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="cardContainer">
      <el-row type="flex" justify="space-around">
        <el-col :span="4">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>急刹路段数</span>
              <i style="float: right; padding: 0 3rem" class="el-icon-info"></i>
            </div>
            <div>{{ brakenum }}</div>
            <div>
              日同比
              <i
                class="el-icon-caret-top"
                v-if="(brakeover > 0) & (brakeover !== Infinity)"
              ></i>
              <i class="el-icon-caret-bottom" v-if="brakeover < 0"></i>
              <i class="el-icon-minus" v-if="brakeover == 0"> </i
              >{{ brakeover | percent }}
            </div>
            <div>
              日环比
              <i
                class="el-icon-caret-top"
                v-if="(brakeon > 0) & (brakeon !== Infinity)"
              ></i>
              <i class="el-icon-caret-bottom" v-if="brakeon < 0"></i>
              <i class="el-icon-minus" v-if="brakeon == 0"> </i
              >{{ brakeon | percent }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>急转弯路段数</span>
              <i style="float: right; padding: 0 3rem" class="el-icon-info"></i>
            </div>
            <div>{{ turnnum }}</div>
            <div>
              日同比
              <i
                class="el-icon-caret-top"
                v-if="(turnover > 0) & (turnover !== Infinity)"
              ></i>
              <i class="el-icon-caret-bottom" v-if="turnover < 0"></i>
              <i class="el-icon-minus" v-if="turnover == 0"> </i
              >{{ turnover | percent }}
            </div>
            <div>
              日环比
              <i
                class="el-icon-caret-top"
                v-if="(turnon > 0) & (turnon !== Infinity)"
              ></i>
              <i class="el-icon-caret-bottom" v-if="turnon < 0"></i>
              <i class="el-icon-minus" v-if="turnon == 0"> </i
              >{{ turnon | percent }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>急加速路段数</span>
              <i style="float: right; padding: 0 3rem" class="el-icon-info"></i>
            </div>
            <div>{{ acceleratenum }}</div>
            <div>
              日同比
              <i
                class="el-icon-caret-top"
                v-if="(accelerateover > 0) & (accelerateover !== Infinity)"
              ></i>
              <i class="el-icon-caret-bottom" v-if="accelerateover < 0"></i>
              <i class="el-icon-minus" v-if="accelerateover == 0"> </i
              >{{ accelerateover | percent }}
            </div>
            <div>
              日环比
              <i
                class="el-icon-caret-top"
                v-if="(accelerateon > 0) & (accelerateon !== Infinity)"
              ></i>
              <i class="el-icon-caret-bottom" v-if="accelerateon < 0"></i>
              <i class="el-icon-minus" v-if="accelerateon == 0"> </i
              >{{ accelerateon | percent }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>超速路段数</span>
              <i style="float: right; padding: 0 3rem" class="el-icon-info"></i>
            </div>
            <div>{{ overspeednum }}</div>
            <div>
              <div>
                日同比
                <i
                  class="el-icon-caret-top"
                  v-if="(overspeedover > 0) & (overspeedover !== Infinity)"
                ></i>
                <i class="el-icon-caret-bottom" v-if="overspeedover < 0"></i>
                <i class="el-icon-minus" v-if="overspeedover == 0"> </i
                >{{ overspeedover | percent }}
              </div>
              <div>
                日环比
                <i
                  class="el-icon-caret-top"
                  v-if="(overspeedon > 0) & (overspeedon !== Infinity)"
                ></i>
                <i class="el-icon-caret-bottom" v-if="overspeedon < 0"></i>
                <i class="el-icon-minus" v-if="overspeedon == 0"> </i
                >{{ overspeedon | percent }}
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import API from "../../../util/apiV1";
import echarts from "echarts";
import "@/util/echarts.theme.default";
export default {
  data() {
    return {
      tableHeight: 300,
      rowHeight: "40px",
      resizeFlag: true,
      situationDate: "",
      timestamp: 0,
      turnnum: 0,
      brakenum: 0,
      acceleratenum: 0,
      overspeednum: 0,
      totalnum: 0,
      turnsum: 0,
      brakesum: 0,
      acceleratesum: 0,
      overspeedsum: 0,
      deadlinedate: "2021-00-00",
      //同比：以上周同期数据比较 day-over-day
      //环比：与前一天数据比较 day-on-day
      brakeover: 0,
      brakeon: 0,
      turnover: 0,
      turnon: 0,
      accelerateover: 0,
      accelerateon: 0,
      overspeedover: 0,
      overspeedon: 0,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "前天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 2);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      timestamp: new Date(),
      tableHistorySituation: [],
    };
  },
  mounted() {
    //取今天的数据
    this.historySituationGet(this.timestamp);
    //刷新表格中历史累计数据
    this.historySumGet().then(() => {
      this.updateData();
    });
  },
  destroyed() {},
  updated() {
    //计算当日所有路段的总数并显示在饼图中
    this.totalnum =
      this.turnnum + this.brakenum + this.acceleratenum + this.overspeednum;
    this.drawChart();
  },
  watch: {
    //监听日期选择器的变化
    timestamp: function () {
      this.updateChart(this.timestamp).then(() => {
        this.calculateData(this.timestamp);
      });
    },
  },
  filters: {
    //所有数字后加上百分号
    percent: function (value) {
      if (isNaN(value)) {
        return "暂无数据";
      } else if (value === Infinity) {
        return "暂无数据";
      } else return value.toFixed(2) + "%";
    },
    //格式化日期
    dateformat: function (value) {
      return (
        value.substr(0, 4) +
        "年" +
        value.substr(5, 2) +
        "月" +
        value.substr(8, 2) +
        "日"
      );
    },
  },

  methods: {
    getHeight() {
      if (this.resizeFlag) {
        let tableHeight1 =
          document.querySelector(".tablecontainer").clientHeight;
        this.tableHeight = tableHeight1;
        var rowHeight1 = this.tableHeight / 4;
        this.rowHeight = rowHeight1.toString();
        this.resizeFlag = false;
      }
      setTimeout(() => {
        this.resizeFlag = true;
      }, 300);
    },
    //绘制饼图，自定义饼图格式
    drawChart() {
      var chartDom = document.getElementById("chart");
      var myChart = echarts.init(chartDom);
      var option = {
        title: {
          zlevel: 0,
          text: ["路段数（条): " + this.totalnum],
          x: "center",
          y: "60%",
          textAlign: "left",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          right: 0,
          top: "center",
        },
        series: [
          {
            name: "路段数量对比",
            type: "pie",
            //图的位置
            radius: ["50%", "70%"],
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "25",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: this.turnnum, name: "急转弯路段" },
              { value: this.acceleratenum, name: "急加速路段" },
              { value: this.brakenum, name: "急刹路段" },
              { value: this.acceleratenum, name: "超速路段" },
            ],
          },
        ],
      };
      myChart.setOption(option);
      window.onresize = function () {
        myChart.resize();
      };
    },
    //历史路段数量
    async historySituationGet(timestamp) {
      let date = this.timestampToTime(timestamp);
      var historySituation = new Array();
      //查询刹车路段
      await API.safeAnalyze
        .brakeNumGet(date)
        .then((res) => {
          if (res.status === 0) {
            historySituation[0] = res.brake_num;
          } else {
            this.$message({
              message: "数据更新失败，请稍后重试",
              type: "error",
            });
            date;
          }
        })
        .catch((error) => {
          this.$message({
            message: "数据更新失败，请稍后重试",
            type: error,
          });
        });
      //查询急转弯路段
      await API.safeAnalyze
        .turnNumGet(date)
        .then((res) => {
          if (res.status === 0) {
            historySituation[1] = res.turn_num;
          } else {
            this.$message({
              message: "数据更新失败，请稍后重试",
              type: error,
            });
          }
        })
        .catch((error) => {
          this.$message({
            message: "数据更新失败，请稍后重试",
            type: error,
          });
        });
      // 查询急加速路段
      await API.safeAnalyze
        .accelerateNumGet(date)
        .then((res) => {
          if (res.status === 0) {
            historySituation[2] = res.accelerate_num;
          } else {
            this.$message({
              message: "数据更新失败，请稍后重试",
              type: error,
            });
          }
        })
        .catch((error) => {
          this.$message({
            message: "数据更新失败，请稍后重试",
            type: error,
          });
        });
      // 查询超速路段
      await API.safeAnalyze
        .overspeedNumGet(date)
        .then((res) => {
          if (res.status === 0) {
            historySituation[3] = res.overspeed_num;
          } else {
            this.$message({
              message: "数据更新失败，请稍后重试",
              type: error,
            });
          }
        })
        .catch((error) => {
          this.$message({
            message: "数据更新失败，请稍后重试",
            type: error,
          });
        });
      return historySituation;
    },
    //历史路段累计数量
    historySumGet() {
      let promises = [];
      promises.push(
        new Promise((resolve, reject) => {
          // 查询累计急转弯路段
          API.safeAnalyze
            .turnHistoryGet()
            .then((res) => {
              if (res.status === 0) {
                this.turnsum = res.turn_num;
                // 更新update日期
                this.deadlinedate = res.update_time;
                resolve();
              } else {
                this.$message({
                  message: "数据更新失败，请稍后重试",
                  type: "error",
                });
                resolve();
              }
            })
            .catch((error) => {
              this.$message({
                message: "数据更新失败，请稍后重试",
                type: error,
              });
              reject(error);
            });
        })
      );
      promises.push(
        new Promise((resolve, reject) => {
          // 查询累计急刹车路段
          API.safeAnalyze
            .brakeHistoryGet()
            .then((res) => {
              if (res.status === 0) {
                this.brakesum = res.brake_num;
                resolve();
              } else {
                this.$message({
                  message: "数据更新失败，请稍后重试",
                  type: error,
                });
                resolve();
              }
            })
            .catch((error) => {
              this.$message({
                message: "数据更新失败，请稍后重试",
                type: error,
              });
              reject(error);
            });
        })
      );
      promises.push(
        new Promise((resolve, reject) => {
          // 查询急加速累计路段
          API.safeAnalyze
            .accelerateHistoryGet()
            .then((res) => {
              if (res.status === 0) {
                this.acceleratesum = res.accelerate_num;
                resolve();
              } else {
                this.$message({
                  message: "数据更新失败，请稍后重试",
                  type: error,
                });
                resolve();
              }
            })
            .catch((error) => {
              this.$message({
                message: "数据更新失败，请稍后重试",
                type: error,
              });
              reject(error);
            });
        })
      );
      promises.push(
        new Promise((resolve, reject) => {
          // 查询超速累计路段
          API.safeAnalyze
            .overspeedHistoryGet()
            .then((res) => {
              if (res.status === 0) {
                this.overspeedsum = res.overspeed_num;
                resolve();
              } else {
                this.$message({
                  message: "数据更新失败，请稍后重试",
                  type: error,
                });
                resolve();
              }
            })
            .catch((error) => {
              this.$message({
                message: "数据更新失败，请稍后重试",
                type: error,
              });
              reject(error);
            });
        })
      );
      return Promise.all(promises);
    },
    updateData() {
      this.tableHistorySituation.push(
        {
          type: "急转弯路段",
          volume: this.turnsum,
        },
        {
          type: "急加速路段",
          volume: this.acceleratesum,
        },
        {
          type: "急刹路段",
          volume: this.brakesum,
        },
        {
          type: "超速路段",
          volume: this.overspeedsum,
        }
      );
    },
    calculateData(timestamp) {
      // 计算同比环比
      //前一天的数据，环比
      this.historySituationGet(timestamp - 86400000).then((res) => {
        let yesterdayData = res;
        let yesterdaybrake = yesterdayData[0];
        let yesterdayturn = yesterdayData[1];
        let yesterdayaccelerate = yesterdayData[2];
        let yesterdayoverspeed = yesterdayData[3];
        this.brakeon = (this.brakenum - yesterdaybrake) / yesterdaybrake;
        this.turnon = (this.turnnum - yesterdayturn) / yesterdayturn;
        this.accelerateon =
          (this.acceleratenum - yesterdayaccelerate) / yesterdayaccelerate;
        this.overspeedon =
          (this.overspeednum - yesterdayoverspeed) / yesterdayoverspeed;
      });

      //同比
      this.historySituationGet(timestamp - 604800000).then((res) => {
        let weekData = res;
        let weekbrake = weekData[0];
        let weekturn = weekData[1];
        let weekaccelerate = weekData[2];
        let weekoverspeed = weekData[3];
        this.brakeover = (this.brakenum - weekbrake) / weekbrake;
        this.turnover = (this.turnnum - weekturn) / weekturn;
        this.accelerateover =
          (this.acceleratenum - weekaccelerate) / weekaccelerate;
        this.overspeedover =
          (this.overspeednum - weekoverspeed) / weekoverspeed;
      });
    },
    // 讲时间戳转为yyyy-mm-dd的格式
    timestampToTime(timestamp) {
      {
        var date = new Date(timestamp);
        let Y = date.getFullYear() + "-";
        let M =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-";
        let D =
          (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
        return Y + M + D;
      }
    },
    updateChart(timestamp) {
      return new Promise((resolve, reject) => {
        this.historySituationGet(timestamp).then((res) => {
          let historyNumber;
          historyNumber = res;
          this.brakenum = historyNumber[0];
          this.turnnum = historyNumber[1];
          this.acceleratenum = historyNumber[2];
          this.overspeednum = historyNumber[3];
          resolve();
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
#chart {
  width: 100%;
  height: 100%;
  margin: auto;
}
#tabletitle {
  font-weight: bold;
}
#charttitle {
  font-weight: bold;
}
#deadline {
  padding-left: 100px;
  color: red;
}
.chartcontainer {
  width: 45%;
  height: 90%;
}
.tablecontainer {
  width: 45%;
  height: 90%;
  display: flex;
  flex-direction: column;
}

.tableContent {
  margin-top: 15%;
}

.timepicker {
  // position: absolute;
  left: 25%;
  // transform: translateX(-50%);
}

.main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}
.cardContainer {
  margin-top: 3%;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  flex: 0.3 0.3 30%;
}

.centerbox {
  display: flex;
  justify-content: space-around;
  flex: 0.5 0.1 50%;
}
.el-icon-caret-top {
  color: red;
}
.el-icon-caret-bottom {
  color: green;
}

.el-row {
  width: 100%;
}
</style>
