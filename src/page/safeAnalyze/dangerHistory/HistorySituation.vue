<template>
  <div class="main">
    <div class="centerbox" ref="tablecontainer">
      <div class="chartcontainer">
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
        <div class="charttitle">路段数量对比情况</div>
        <div id="roadChart" class="chart"></div>
      </div>
      <div class="tablecontainer">
        <div class="timepickerFake">
          <span class="demonstration"></span>
          <el-date-picker
            v-model="timestamp"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            value-format="timestamp"
          >
          </el-date-picker>
        </div>
        <div class="tabletitle">历史路段累计数量</div>
        <div class="tableContent">
          <div class="deadline">
            统计时间截止： {{ deadlinedate | dateformat }}
          </div>
          <el-table
            :data="tableHistorySituation"
            style="width: 100%"
            :border="true"
            size="medium"
            :row-style="{ height: '40px' }"
            :header-cell-style="{ background: '#374a63' }"
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
            <div class="datarow">
              <div class="gap">
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
            <div class="datarow">
              <div class="gap">
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
            <div class="datarow">
              <div class="gap">
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
            <div class="datarow">
              <div class="gap">
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
    <div class="bottombox">
      <div class="chartcontainer">
        <div class="charttitle">事件数量对比情况</div>
        <div id="eventsChart1" class="chart"></div>
        <div id="eventsChart2" class="chart"></div>
      </div>
      <div class="tablecontainer">
        <div class="tabletitle">历史事故事件累计数量</div>
        <div class="tablecontent">
          <div class="deadline">
            统计时间截止： {{ eventsdeadlinedate | dateformat }}
          </div>
          <el-table
            class="eventstable1"
            :data="tableHistoryEvents1"
            style="width: 100%"
            :border="true"
            size="medium"
            :row-style="{ height: '40px' }"
            :header-cell-style="{ background: '#374a63' }"
          >
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="eventsType" label="事故事件类型">
            </el-table-column>
            <el-table-column prop="eventsVolume" label="积累数量（件）">
            </el-table-column>
          </el-table>
          <el-table
            class="eventstable2"
            :data="tableHistoryEvents2"
            style="width: 100%"
            :border="true"
            size="medium"
            :row-style="{ height: '40px' }"
            :header-cell-style="{ background: '#374a63' }"
          >
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="eventsScope" label="地理空间所属区域">
            </el-table-column>
            <el-table-column prop="eventsScopeVolume" label="积累数量（件）">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="bottomCardContainer">
      <el-row type="flex" justify="space-around" class="firstrow">
        <el-col :span="4">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>事故事件数</span>
              <i style="float: right; padding: 0 3rem" class="el-icon-info"></i>
            </div>
            <div>{{ accidentnum }}</div>
            <div class="datarow">
              <div class="gap">
                日同比
                <i
                  class="el-icon-caret-top"
                  v-if="(accidentover > 0) & (accidentover !== Infinity)"
                ></i>
                <i class="el-icon-caret-bottom" v-if="accidentover < 0"></i>
                <i class="el-icon-minus" v-if="accidentover == 0"> </i
                >{{ accidentover | percent }}
              </div>
              <div>
                日环比
                <i
                  class="el-icon-caret-top"
                  v-if="(accidenton > 0) & (accidenton !== Infinity)"
                ></i>
                <i class="el-icon-caret-bottom" v-if="accidenton < 0"></i>
                <i class="el-icon-minus" v-if="accidenton == 0"> </i
                >{{ accidenton | percent }}
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>封路事件数</span>
              <i style="float: right; padding: 0 3rem" class="el-icon-info"></i>
            </div>
            <div>{{ closenum }}</div>
            <div class="datarow">
              <div class="gap">
                日同比
                <i
                  class="el-icon-caret-top"
                  v-if="(closeover > 0) & (closeover !== Infinity)"
                ></i>
                <i class="el-icon-caret-bottom" v-if="closeover < 0"></i>
                <i class="el-icon-minus" v-if="closeover == 0"> </i
                >{{ closeover | percent }}
              </div>
              <div>
                日环比
                <i
                  class="el-icon-caret-top"
                  v-if="(closeon > 0) & (closeon !== Infinity)"
                ></i>
                <i class="el-icon-caret-bottom" v-if="closeon < 0"></i>
                <i class="el-icon-minus" v-if="closeon == 0"> </i
                >{{ closeon | percent }}
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>拥堵事件数</span>
              <i style="float: right; padding: 0 3rem" class="el-icon-info"></i>
            </div>
            <div>{{ jamnum }}</div>
            <div class="datarow">
              <div class="gap">
                日同比
                <i
                  class="el-icon-caret-top"
                  v-if="(jamover > 0) & (jamover !== Infinity)"
                ></i>
                <i class="el-icon-caret-bottom" v-if="jamover < 0"></i>
                <i class="el-icon-minus" v-if="jamover == 0"> </i
                >{{ jamover | percent }}
              </div>
              <div>
                日环比
                <i
                  class="el-icon-caret-top"
                  v-if="(jamon > 0) & (jamon !== Infinity)"
                ></i>
                <i class="el-icon-caret-bottom" v-if="jamon < 0"></i>
                <i class="el-icon-minus" v-if="jamon == 0"> </i
                >{{ jamon | percent }}
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>施工事件数</span>
              <i style="float: right; padding: 0 3rem" class="el-icon-info"></i>
            </div>
            <div>{{ roadworknum }}</div>
            <div>
              <div class="datarow">
                <div class="gap">
                  日同比
                  <i
                    class="el-icon-caret-top"
                    v-if="(roadworkover > 0) & (roadworkover !== Infinity)"
                  ></i>
                  <i class="el-icon-caret-bottom" v-if="roadworkover < 0"></i>
                  <i class="el-icon-minus" v-if="roadworkover == 0"> </i
                  >{{ roadworkover | percent }}
                </div>
                <div>
                  日环比
                  <i
                    class="el-icon-caret-top"
                    v-if="(roadworkon > 0) & (roadworkon !== Infinity)"
                  ></i>
                  <i class="el-icon-caret-bottom" v-if="roadworkon < 0"></i>
                  <i class="el-icon-minus" v-if="roadworkon == 0"> </i
                  >{{ roadworkon | percent }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-around" class="secondrow">
        <el-col :span="8">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>城内事件数</span>
              <i style="float: right; padding: 0 3rem" class="el-icon-info"></i>
            </div>
            <div>{{ citynum }}</div>
            <div class="datarow">
              <div class="gap">
                日同比
                <i
                  class="el-icon-caret-top"
                  v-if="(cityover > 0) & (cityover !== Infinity)"
                ></i>
                <i class="el-icon-caret-bottom" v-if="cityover < 0"></i>
                <i class="el-icon-minus" v-if="cityover == 0"> </i
                >{{ cityover | percent }}
              </div>
              <div>
                日环比
                <i
                  class="el-icon-caret-top"
                  v-if="(cityon > 0) & (cityon !== Infinity)"
                ></i>
                <i class="el-icon-caret-bottom" v-if="cityon < 0"></i>
                <i class="el-icon-minus" v-if="cityon == 0"> </i
                >{{ cityon | percent }}
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>高速事件数</span>
              <i style="float: right; padding: 0 3rem" class="el-icon-info"></i>
            </div>
            <div>{{ haighwaynum }}</div>
            <div class="datarow">
              <div class="gap">
                日同比
                <i
                  class="el-icon-caret-top"
                  v-if="(haighwaynumover > 0) & (haighwaynumover !== Infinity)"
                ></i>
                <i class="el-icon-caret-bottom" v-if="haighwaynumover < 0"></i>
                <i class="el-icon-minus" v-if="haighwaynumover == 0"> </i
                >{{ haighwaynumover | percent }}
              </div>
              <div>
                日环比
                <i
                  class="el-icon-caret-top"
                  v-if="(haighwaynumon > 0) & (haighwaynumon !== Infinity)"
                ></i>
                <i class="el-icon-caret-bottom" v-if="haighwaynumon < 0"></i>
                <i class="el-icon-minus" v-if="haighwaynumon == 0"> </i
                >{{ haighwaynumon | percent }}
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
      totalnumevents1: 0,
      accidentnum: 0,
      closenum: 0,
      jamnum: 0,
      roadworknum: 0,
      totalnumevents2: 0,
      citynum: 0,
      haighwaynum: 0,
      accidentsum: 0,
      closesum: 0,
      jamsum: 0,
      roadworksum: 0,
      citysum: 0,
      highwaysum: 0,
      deadlinedate: "2021-00-00",
      eventsdeadlinedate: "2021-00-00",
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
      tableHistoryEvents1: [],
      tableHistoryEvents2: [],
    };
  },
  //默认读取当前数据，并渲染
  created() {
    this.updateChart(this.timestamp).then(() => {
      this.calculateData(this.timestamp);
    });
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
    this.totalnumevents1 =
      this.accidentnum + this.closenum + this.jamnum + this.roadworknum;
    this.totalnumevents2 = this.citynum + this.citysum;
    this.drawChart();
    this.drawChartEvents1();
    this.drawChartEvents2();
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
    //绘制饼图，自定义饼图格式
    drawChart() {
      var chartDom = document.getElementById("roadChart");
      var myChart = echarts.init(chartDom);
      var option = {
        title: {
          zlevel: 0,
          text: ["路段数（条): " + this.totalnum],
          x: "center",
          y: "bottom",
          textAlign: "left",
          textStyle: { fontSize: 15, color: "#fff" },
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          right: 0,
          top: "center",
          textStyle: { color: "#fff" },
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
                fontSize: 20,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              {
                value: this.turnnum,
                name: "急转弯路段",
                itemStyle: { color: "#99ffa2" },
              },
              {
                value: this.acceleratenum,
                name: "急加速路段",
                itemStyle: { color: "#f2f26d" },
              },
              {
                value: this.brakenum,
                name: "急刹路段",
                itemStyle: { color: "#3a9099" },
              },
              {
                value: this.overspeednum,
                name: "超速路段",
                itemStyle: { color: "#e68337" },
              },
            ],
          },
        ],
      };
      myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    drawChartEvents1() {
      var chartDom1 = document.getElementById("eventsChart1");
      var myChart1 = echarts.init(chartDom1);
      var option = {
        title: {
          zlevel: 0,
          text: ["事件（件): " + this.totalnum],
          x: "center",
          y: "bottom",
          textAlign: "left",
          textStyle: { fontSize: 15, color: "#fff" },
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          right: 0,
          top: "center",
          textStyle: { color: "#fff" },
        },
        series: [
          {
            name: "事件数量对比",
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
                fontSize: 20,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              {
                value: this.accidentnum,
                name: "事故",
                itemStyle: { color: "#99ffa2" },
              },
              {
                value: this.closenum,
                name: "封路",
                itemStyle: { color: "#f2f26d" },
              },
              {
                value: this.jamnum,
                name: "拥堵",
                itemStyle: { color: "#3a9099" },
              },
              {
                value: this.roadworknum,
                name: "施工",
                itemStyle: { color: "#e68337" },
              },
            ],
          },
        ],
      };
      myChart1.setOption(option);
      window.addEventListener("resize", function () {
        myChart1.resize();
      });
    },
    drawChartEvents2() {
      var chartDom = document.getElementById("eventsChart2");
      var myChart2 = echarts.init(chartDom);
      var option = {
        title: {
          zlevel: 0,
          text: ["事件（件): " + this.totalnum],
          x: "center",
          y: "bottom",
          textAlign: "left",
          textStyle: { fontSize: 15, color: "#fff" },
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          right: 0,
          top: "center",
          textStyle: { color: "#fff" },
        },
        series: [
          {
            name: "事件数量对比",
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
                fontSize: 20,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              {
                value: this.haighwaynum,
                name: "高速事件",
                itemStyle: { color: "#99ffa2" },
              },
              {
                value: this.citynum,
                name: "城内事件",
                itemStyle: { color: "#3a9099" },
              },
            ],
          },
        ],
      };
      myChart2.setOption(option);
      window.addEventListener("resize", function () {
        myChart2.resize();
      });
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
      this.tableHistoryEvents1.push(
        {
          eventsType: "事故",
          eventsVolume: this.accidentsum,
        },
        {
          eventsType: "封路",
          eventsVolume: this.closesum,
        },
        {
          eventsType: "拥堵",
          eventsVolume: this.jamsum,
        },
        {
          eventsType: "施工",
          eventsVolume: this.roadworksum,
        }
      );
      this.tableHistoryEvents2.push(
        {
          eventsScope: "城内",
          eventsScopeVolume: this.citysum,
        },
        {
          eventsScope: "城外",
          eventsScopeVolume: this.highwaysum,
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
        let yesterdayaccident = yesterdayData[4];
        let yesterdayclose = yesterdayData[5];
        let yesterdayjam = yesterdayData[6];
        let yesterdayraodwork = yesterdayData[7];
        let yesterdaycity = yesterdayData[8];
        let yesterdayhighway = yesterdayData[9];
        this.brakeon = (this.brakenum - yesterdaybrake) / yesterdaybrake;
        this.turnon = (this.turnnum - yesterdayturn) / yesterdayturn;
        this.accelerateon =
          (this.acceleratenum - yesterdayaccelerate) / yesterdayaccelerate;
        this.overspeedon =
          (this.overspeednum - yesterdayoverspeed) / yesterdayoverspeed;
        this.accidenton =
          (this.overspeednum - yesterdayaccident) / yesterdayaccident;
        this.closeon = (this.overspeednum - yesterdayclose) / yesterdayclose;
        this.jamon = (this.overspeednum - yesterdayjam) / yesterdayjam;
        this.roadworkon =
          (this.overspeednum - yesterdayraodwork) / yesterdayraodwork;
        this.cityon = (this.overspeednum - yesterdaycity) / yesterdaycity;
        this.highwayon =
          (this.overspeednum - yesterdayhighway) / yesterdayhighway;
      });

      //同比
      this.historySituationGet(timestamp - 604800000).then((res) => {
        let weekData = res;
        let weekbrake = weekData[0];
        let weekturn = weekData[1];
        let weekaccelerate = weekData[2];
        let weekoverspeed = weekData[3];
        let weekaccident = weekData[4];
        let weekclose = weekData[5];
        let weekjam = weekData[6];
        let weekroadwork = weekData[7];
        let weekcity = weekData[8];
        let weekhighway = weekData[9];
        this.brakeover = (this.brakenum - weekbrake) / weekbrake;
        this.turnover = (this.turnnum - weekturn) / weekturn;
        this.accelerateover =
          (this.acceleratenum - weekaccelerate) / weekaccelerate;
        this.overspeedover =
          (this.overspeednum - weekoverspeed) / weekoverspeed;

        this.accidentover = (this.accidentnum - weekaccident) / weekaccident;
        this.closeover = (this.closenum - weekclose) / weekclose;
        this.jamover = (this.jamnum - weekjam) / weekjam;
        this.roadworkover = (this.roadworknum - weekroadwork) / weekroadwork;
        this.cityover = (this.citynum - weekcity) / weekcity;
        this.highwayover = (this.highwaynum - weekhighway) / weekhighway;
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
    //echart字体大小换算
    fontSize(res) {
      let docEl = document.documentElement,
        clientHeight =
          window.innerHeihgt ||
          document.documentElement.clientHeight ||
          document.body.clientHeight;
      if (!clientHeight) return;
      let fontSize = 100 * (clientHeight / 1080);
      return res * fontSize;
    },
  },
};
</script>

<style lang="less" scoped>
.chart {
  width: 500px;
  height: 300px;
  margin: auto;
}
.tabletitle {
  font-weight: bold;
  font-size: 1.5rem;
  margin-top: 5%;
  color: white;
}
.charttitle {
  font-weight: bold;
  position: relative;
  margin-top: 5%;
  font-size: 1.5rem;
  color: white;
}
.deadline {
  margin-top: 1.5rem;
  color: #00faff;
}
.chartcontainer {
  width: 45%;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tablecontainer {
  width: 45%;
  height: 90%;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}
.timepicker {
  padding-top: 3rem;
  color: #fff;
}
.timepickerFake {
  visibility: hidden;
  padding-top: 2rem;
}

.main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}
.centerbox {
  display: flex;
  justify-content: space-around;
  flex: 0.5 0 30%;
}
.cardContainer {
  padding: 0 3rem;
  margin-top: 3%;
  margin-bottom: 5%;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  flex: 0.2 0.8 10%;
}
.bottombox {
  display: flex;
  justify-content: space-around;
  flex: 0.5 0.8 40%;
}
.bottomCardContainer {
  padding: 1rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex: 0.4 0.8 20%;
  .secondrow {
    width: 50%;
    margin: 2rem 0;
  }
}
.el-icon-caret-top {
  color: #ff4260;
}
.el-icon-caret-bottom {
  color: #25ff25;
}

.el-row {
  width: 100%;
}
.el-table {
  max-width: 70%;
}
.eventstable2 {
  margin: 2rem 0;
}
.datarow {
  display: flex;
  flex-wrap: wrap;
  .gap {
    margin-right: 1rem;
  }
}
</style>
