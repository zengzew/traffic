<template>
  <div class="main">
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
    <div class="chartcontainer">
      <div id="charttitle">路段数量对比情况</div>
      <div id="chart"></div>
    </div>
    <div class="tablecontainer">
      <div id="tabletitle">历史路段累计数量</div>
      <div id="deadline">统计时间截止： {{ deadlinedate | dateformat }}</div>
      <el-table
        :data="tableHistorySituation"
        style="width: 100%"
        :border="true"
        size="medium"
      >
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="type" label="路段类型"> </el-table-column>
        <el-table-column prop="volume" label="积累数量（条）">
        </el-table-column>
      </el-table>
    </div>
    <div class="cardContainer">
      <el-row type="flex" justify="space-around">
        <el-col :span="5">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>急刹路段数</span>
              <i style="float: right; padding: 0 3rem" class="el-icon-info"></i>
            </div>
            <div>{{ brakenum }}</div>
            <div>
              日同比 <i class="el-icon-caret-top" v-if="brakeover > 0"></i>
              <i class="el-icon-caret-bottom" v-if="brakeover < 0"></i>
              <i class="el-icon-minus" v-if="brakeover == 0"> </i
              >{{ brakeover | percent }}
            </div>
            <div>
              日环比 <i class="el-icon-caret-top" v-if="brakeon > 0"></i>
              <i class="el-icon-caret-bottom" v-if="brakeon < 0"></i>
              <i class="el-icon-minus" v-if="brakeon == 0"> </i
              >{{ brakeon | percent }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>急转弯路段数</span>
              <i style="float: right; padding: 0 3rem" class="el-icon-info"></i>
            </div>
            <div>{{ turnnum }}</div>
            <div>
              日同比
              <i class="el-icon-caret-top" v-if="turnover > 0"></i>
              <i class="el-icon-caret-bottom" v-if="turnover < 0"></i>
              <i class="el-icon-minus" v-if="turnover == 0"> </i
              >{{ turnover | percent }}
            </div>
            <div>
              日环比 <i class="el-icon-caret-top" v-if="turnon > 0"></i>
              <i class="el-icon-caret-bottom" v-if="turnon < 0"></i>
              <i class="el-icon-minus" v-if="turnon == 0"> </i
              >{{ turnon | percent }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>急加速路段数</span>
              <i style="float: right; padding: 0 3rem" class="el-icon-info"></i>
            </div>
            <div>{{ acceleratenum }}</div>
            <div>
              日同比 <i class="el-icon-caret-top" v-if="accelerateover > 0"></i>
              <i class="el-icon-caret-bottom" v-if="accelerateover < 0"></i>
              <i class="el-icon-minus" v-if="accelerateover == 0"> </i
              >{{ accelerateover | percent }}
            </div>
            <div>
              日环比
              <i class="el-icon-caret-top" v-if="accelerateon > 0"></i>
              <i class="el-icon-caret-bottom" v-if="accelerateon < 0"></i>
              <i class="el-icon-minus" v-if="accelerateon == 0"> </i
              >{{ accelerateon | percent }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>超速路段数</span>
              <i style="float: right; padding: 0 3rem" class="el-icon-info"></i>
            </div>
            <div>{{ overspeednum }}</div>
            <div>
              <div>
                日同比
                <i class="el-icon-caret-top" v-if="overspeedover > 0"></i>
                <i class="el-icon-caret-bottom" v-if="overspeedover < 0"></i>
                <i class="el-icon-minus" v-if="overspeedover == 0"> </i
                >{{ overspeedover | percent }}
              </div>
              <div>
                日环比
                <i class="el-icon-caret-top" v-if="overspeedon > 0"></i>
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
      deadlinedate: "20210615",
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
    //this.timestampToTime(this.timestamp);
    //this.historySituationGet(this.situationDate);
    this.historySituationGet(this.timestamp);
    this.historySumGet().then(() => {
      this.updateData();
    });
    //this.calculateData();
  },
  updated() {
    this.totalnum =
      this.turnnum + this.brakenum + this.acceleratenum + this.overspeednum;
    this.drawChart();
  },
  watch: {
    timestamp: function () {
      this.updateChart(this.timestamp);
      this.calculateData(this.timestamp);
    },
  },
  filters: {
    percent: function (value) {
      return value.toFixed(2) + "%";
    },
    dateformat: function (value) {
      return (
        value.substr(0, 4) +
        "年" +
        value.substr(4, 2) +
        "月" +
        value.substr(6, 2) +
        "日"
      );
    },
  },

  methods: {
    drawChart() {
      var chartDom = document.getElementById("chart");
      var myChart = echarts.init(chartDom);
      var option = {
        title: {
          zlevel: 0,
          text: ["路段数（条): " + this.totalnum],
          top: 220,
          left: 100,
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          right: 0,
          top: 160,
        },
        series: [
          {
            name: "路段数量对比",
            type: "pie",
            radius: ["60%", "80%"],
            center: ["30%", "50%"],
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
    },
    //历史路段数量
    async historySituationGet(timestamp) {
      let date = this.timestampToTime(timestamp);
      console.log(date);
      var historySituation = new Array();
      await API.SafeAnalyze.brakeNumGet(date)
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
      await API.SafeAnalyze.turnNumGet(date)
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
      await API.SafeAnalyze.accelerateNumGet(date)
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
      await API.SafeAnalyze.overspeedNumGet(date)
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
          API.SafeAnalyze.turnHistoryGet()
            .then((res) => {
              if (res.status === 0) {
                this.turnsum = res.turn_num;
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
          API.SafeAnalyze.brakeHistoryGet()
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
          API.SafeAnalyze.accelerateHistoryGet()
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
          API.SafeAnalyze.overspeedHistoryGet()
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
      //前一天的数据
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
        //console.log(Y + M + D);
        return Y + M + D;
      }
    },
    updateChart(timestamp) {
      this.historySituationGet(timestamp).then((res) => {
        let historyNumber;
        historyNumber = res;
        this.brakenum = historyNumber[0];
        console.log("第一步", historyNumber);
        this.turnnum = historyNumber[1];
        this.acceleratenum = historyNumber[2];
        this.overspeednum = historyNumber[3];
      });
    },
  },
};
</script>

<style lang="less" scoped>
#chart {
  width: 600px;
  height: 400px;
  margin: 40px 300px;
}
#tabletitle {
  margin-top: 100px;
  font-weight: bold;
  font-size: 20px;
  padding-left: 100px;
}
#charttitle {
  margin-top: 100px;
  font-weight: bold;
  font-size: 20px;
  padding-left: 400px;
}
#deadline {
  padding-left: 100px;
  color: red;
}
.chartcontainer {
  width: 50%;
}
.tablecontainer {
  width: 30%;
}
.timepicker {
  flex-basis: 100%;
  margin-left: 400px;
  margin-top: 100px;
}
.el-table {
  margin: 60px 100px;
}
.main {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
}
.cardContainer {
  width: 100%;
  height: 300px;
  padding: 0 130px;
}
.el-card {
  padding: 20px 20px;
  height: 200px;
}
.el-icon-caret-top {
  color: red;
}
.el-icon-caret-bottom {
  color: green;
}
</style>
