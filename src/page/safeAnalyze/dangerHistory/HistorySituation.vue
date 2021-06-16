<template>
  <div class="main">
    <div class="timepicker">
      <span class="demonstration">当前时间范围</span>
      <el-date-picker
        v-model="situationDate"
        type="date"
        placeholder="选择日期"
        :picker-options="pickerOptions"
        value-format="yyyyMMdd"
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
              日环比 <i class="el-icon-caret-bottom" v-if="brakeon > 0"></i>
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
              日环比 <i class="el-icon-caret-bottom" v-if="turnon > 0"></i>
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
              <i class="el-icon-caret-bottom" v-if="accelerateon > 0"></i>
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
                <i class="el-icon-caret-bottom" v-if="overspeedon > 0"></i>
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
      situationDate: new Date(),
      tableHistorySituation: [],
    };
  },
  mounted() {
    this.showDate();
    this.historySituationGet();
    this.historySumGet().then((res) => {
      console.log(res);
      this.updateData();
    });
    this.calculateData();
  },
  updated() {
    this.totalnum =
      this.turnnum + this.brakenum + this.acceleratenum + this.overspeednum;
    this.drawChart();
  },
  watch: {
    situationDate: function () {
      console.log(this.situationDate);
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
    showDate() {
      console.log(this.situationDate);
    },
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
    historySituationGet(date) {
      var historySituation = new Array(4);
      API.SafeAnalyze.brakeNumGet({ date: date })
        .then((res) => {
          if (res.status === 200) {
            console.log(res);
            this.brakenum = res.data.brake_num;
            return (historySituation[0] = res.data.brake_num);
          } else {
            this.$message({
              message: "数据更新失败，请稍后重试",
              type: "error",
            });
          }
        })
        .catch((error) => {
          this.$message({
            message: "数据更新失败，请稍后重试",
            type: "error",
          });
        });
      API.SafeAnalyze.turnNumGet({ date: date })
        .then((res) => {
          if (res.status === 200) {
            this.turnnum = res.data.turn_num;
            return (historySituation[1] = res.data.turn_num);
          } else {
            this.$message({
              message: "数据更新失败，请稍后重试",
              type: "error",
            });
          }
        })
        .catch((error) => {
          this.$message({
            message: "数据更新失败，请稍后重试",
            type: "error",
          });
        });
      API.SafeAnalyze.accelerateNumGet({ date: date })
        .then((res) => {
          if (res.status === 200) {
            this.acceleratenum = res.data.accelerate_num;
            return (historySituation[2] = res.data.accelerate_num);
          } else {
            this.$message({
              message: "数据更新失败，请稍后重试",
              type: "error",
            });
          }
        })
        .catch((error) => {
          this.$message({
            message: "数据更新失败，请稍后重试",
            type: "error",
          });
        });
      API.SafeAnalyze.overspeedNumGet({ date: date })
        .then((res) => {
          if (res.status === 200) {
            this.overspeednum = res.data.overspeed_num;
            return (historySituation[3] = res.data.overspeed_num);
          } else {
            this.$message({
              message: "数据更新失败，请稍后重试",
              type: "error",
            });
          }
        })
        .catch((error) => {
          this.$message({
            message: "数据更新失败，请稍后重试",
            type: "error",
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
              if (res.status === 200) {
                this.turnsum = res.data.turn_sum;
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
                type: "error",
              });
              reject(error);
            });
        })
      );
      promises.push(
        new Promise((resolve, reject) => {
          API.SafeAnalyze.brakeHistoryGet()
            .then((res) => {
              if (res.status === 200) {
                this.brakesum = res.data.brake_sum;
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
                type: "error",
              });
              reject(error);
            });
        })
      );
      promises.push(
        new Promise((resolve, reject) => {
          API.SafeAnalyze.accelerateHistoryGet()
            .then((res) => {
              if (res.status === 200) {
                this.acceleratesum = res.data.accelerate_sum;
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
                type: "error",
              });
              reject(error);
            });
        })
      );
      promises.push(
        new Promise((resolve, reject) => {
          API.SafeAnalyze.overspeedHistoryGet()
            .then((res) => {
              if (res.status === 200) {
                this.overspeedsum = res.data.overspeed_sum;
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
                type: "error",
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
    calculateData() {
      //前一天的数据
      var yesterdaybrake = this.historySituationGet(this.situationDate - 1)[0];
      var yesterdayturn = this.historySituationGet(this.situationDate - 1)[1];
      var yesterdayaccelerate = this.historySituationGet(
        this.situationDate - 1
      )[2];
      var yesterdayoverspeed = this.historySituationGet(
        this.situationDate - 1
      )[3];
      //前一周的数据
      var weekbrake = this.historySituationGet(this.situationDate - 7)[0];
      var weekturn = this.historySituationGet(this.situationDate - 7)[1];
      var weekaccelerate = this.historySituationGet(this.situationDate - 7)[2];
      var weekoverspeed = this.historySituationGet(this.situationDate - 7)[3];
      //环比
      this.brakeon = (this.brakenum - yesterdaybrake) / this.yesterdaybrake;
      this.turnon = (this.turnnum - yesterdayturn) / this.yesterdayturn;
      this.accelerateon =
        (this.acceleratenum - yesterdayaccelerate) / this.yesterdayaccelerate;
      this.overspeedon =
        (this.overspeednum - yesterdayoverspeed) / this.yesterdayoverspeed;
      //同比
      this.brakeover = (this.brakenum - weekbrake) / this.weekbrake;
      this.turnover = (this.turnnum - weekturn) / this.weekturn;
      this.accelerateover =
        (this.acceleratenum - weekaccelerate) / this.weekaccelerate;
      this.overspeedover =
        (this.overspeednum - weekoverspeed) / this.weekoverspeed;
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
