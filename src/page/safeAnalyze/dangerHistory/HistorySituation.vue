<template>
  <div class="main">
    <div class="timepicker">
      <span class="demonstration">当前时间范围</span>
      <el-date-picker
        v-model="situationDate"
        type="date"
        placeholder="选择日期"
        :picker-options="pickerOptions"
        value-format="timestamp"
      >
      </el-date-picker>
    </div>
    <div class="chartcontainer">
      <div id="chart"></div>
    </div>
    <div class="tablecontainer">
      <div id="tabletitle">历史路段累计数量</div>
      <div id="deadline">统计时间截止： {{ deadlinedate }}</div>
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
      turnsum: 0,
      brakesum: 0,
      acceleratesum: 0,
      overspeedsum: 0,
      deadlinedate: "2021年6月9日",
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
      //situationDate: new Date(),
      tableHistorySituation: [
        {
          type: "急转弯路段",
          volume: this.turnsum,
        },
        {
          type: "急加速路段",
          volume: "2653",
        },
        {
          type: "急刹路段",
          volume: "1762",
        },
        {
          type: "超速路段",
          volume: "4236",
        },
      ],
    };
  },
  mounted() {
    this.historySituationGet();
    this.historySumGet();
  },
  updated() {
    this.drawChart();
  },
  watch: {
    situationDate: function () {
      //console.log(this.situationDate);
    },
  },
  filters: {
    percent: function (value) {
      return value.toFixed(2) + "%";
    },
  },
  methods: {
    showDate() {
      //console.log(this.situationDate);
    },
    drawChart() {
      var chartDom = document.getElementById("chart");
      var myChart = echarts.init(chartDom);
      var option = {
        title: { text: "路段数量对比情况", left: "center" },
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
            radius: ["40%", "75%"],
            center: ["30%", "60%"],
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
    historySituationGet() {
      API.SafeAnalyze.brakeNumGet()
        .then((res) => {
          if (res.status === 200) {
            this.brakenum = res.data.brake_num;
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
      API.SafeAnalyze.turnNumGet()
        .then((res) => {
          if (res.status === 200) {
            this.turnnum = res.data.turn_num;
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
      API.SafeAnalyze.accelerateNumGet()
        .then((res) => {
          if (res.status === 200) {
            this.acceleratenum = res.data.accelerate_num;
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
      API.SafeAnalyze.overspeedNumGet()
        .then((res) => {
          if (res.status === 200) {
            this.overspeednum = res.data.overspeed_num;
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
    },
    historySumGet() {
      API.SafeAnalyze.turnHistoryGet()
        .then((res) => {
          if (res.status === 200) {
            this.turnsum = res.data.turn_sum;
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
      API.SafeAnalyze.brakeHistoryGet()
        .then((res) => {
          if (res.status === 200) {
            this.brakesum = res.data.brake_sum;
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
      API.SafeAnalyze.accelerateHistoryGet()
        .then((res) => {
          if (res.status === 200) {
            this.acceleratesum = res.data.accelerate_sum;
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
      API.SafeAnalyze.overspeedHistoryGet()
        .then((res) => {
          if (res.status === 200) {
            this.overspeedsum = res.data.overspeed_sum;
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
    },
  },
};
</script>

<style lang="less" scoped>
#chart {
  width: 600px;
  height: 400px;
  margin: 100px 300px;
}
#tabletitle {
  margin-top: 100px;
  font-weight: bold;
  font-size: 20px;
  padding-left: 100px;
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
  margin: 50px 100px;
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
