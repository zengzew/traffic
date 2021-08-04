<template>
  <div class="main">
    <!-- 第一行 -->
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
    <!-- 第二行 -->
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
                  v-if="(brakeover > 0) & (brakeover != Infinity)"
                ></i>
                <i class="el-icon-caret-bottom" v-if="brakeover < 0"></i>
                <i class="el-icon-minus" v-if="brakeover == 0"> </i
                >{{ brakeover | percent }}
              </div>
              <div>
                日环比
                <i
                  class="el-icon-caret-top"
                  v-if="(brakeon > 0) & (brakeon != Infinity)"
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
                  v-if="(turnover > 0) & (turnover != Infinity)"
                ></i>
                <i class="el-icon-caret-bottom" v-if="turnover < 0"></i>
                <i class="el-icon-minus" v-if="turnover == 0"> </i
                >{{ turnover | percent }}
              </div>
              <div>
                日环比
                <i
                  class="el-icon-caret-top"
                  v-if="(turnon > 0) & (turnon != Infinity)"
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
                  v-if="(accelerateover > 0) & (accelerateover != Infinity)"
                ></i>
                <i class="el-icon-caret-bottom" v-if="accelerateover < 0"></i>
                <i class="el-icon-minus" v-if="accelerateover == 0"> </i
                >{{ accelerateover | percent }}
              </div>
              <div>
                日环比
                <i
                  class="el-icon-caret-top"
                  v-if="(accelerateon > 0) & (accelerateon != Infinity)"
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
                  v-if="(overspeedover > 0) & (overspeedover != Infinity)"
                ></i>
                <i class="el-icon-caret-bottom" v-if="overspeedover < 0"></i>
                <i class="el-icon-minus" v-if="overspeedover == 0"> </i
                >{{ overspeedover | percent }}
              </div>
              <div>
                日环比
                <i
                  class="el-icon-caret-top"
                  v-if="(overspeedon > 0) & (overspeedon != Infinity)"
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
    <!-- 第三行 -->
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
    <!-- 第四行 -->
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
                  v-if="(accidentover > 0) & (accidentover != Infinity)"
                ></i>
                <i class="el-icon-caret-bottom" v-if="accidentover < 0"></i>
                <i class="el-icon-minus" v-if="accidentover == 0"> </i
                >{{ accidentover | percent }}
              </div>
              <div>
                日环比
                <i
                  class="el-icon-caret-top"
                  v-if="(accidenton > 0) & (accidenton != Infinity)"
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
                  v-if="(closeover > 0) & (closeover != Infinity)"
                ></i>
                <i class="el-icon-caret-bottom" v-if="closeover < 0"></i>
                <i class="el-icon-minus" v-if="closeover == 0"> </i
                >{{ closeover | percent }}
              </div>
              <div>
                日环比
                <i
                  class="el-icon-caret-top"
                  v-if="(closeon > 0) & (closeon != Infinity)"
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
                  v-if="(jamover > 0) & (jamover != Infinity)"
                ></i>
                <i class="el-icon-caret-bottom" v-if="jamover < 0"></i>
                <i class="el-icon-minus" v-if="jamover == 0"> </i
                >{{ jamover | percent }}
              </div>
              <div>
                日环比
                <i
                  class="el-icon-caret-top"
                  v-if="(jamon > 0) & (jamon != Infinity)"
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
                    v-if="(roadworkover > 0) & (roadworkover != Infinity)"
                  ></i>
                  <i class="el-icon-caret-bottom" v-if="roadworkover < 0"></i>
                  <i class="el-icon-minus" v-if="roadworkover == 0"> </i
                  >{{ roadworkover | percent }}
                </div>
                <div>
                  日环比
                  <i
                    class="el-icon-caret-top"
                    v-if="(roadworkon > 0) & (roadworkon != Infinity)"
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
                  v-if="(cityover > 0) & (cityover != Infinity)"
                ></i>
                <i class="el-icon-caret-bottom" v-if="cityover < 0"></i>
                <i class="el-icon-minus" v-if="cityover == 0"> </i
                >{{ cityover | percent }}
              </div>
              <div>
                日环比
                <i
                  class="el-icon-caret-top"
                  v-if="(cityon > 0) & (cityon != Infinity)"
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
            <div>{{ highwaynum }}</div>
            <div class="datarow">
              <div class="gap">
                日同比
                <i
                  class="el-icon-caret-top"
                  v-if="(highwayover > 0) & (highwayover != Infinity)"
                ></i>
                <i class="el-icon-caret-bottom" v-if="highwayover < 0"></i>
                <i class="el-icon-minus" v-if="highwayover == 0"> </i
                >{{ highwayover | percent }}
              </div>
              <div>
                日环比
                <i
                  class="el-icon-caret-top"
                  v-if="(highwayon > 0) & (highwayon != Infinity)"
                ></i>
                <i class="el-icon-caret-bottom" v-if="highwayon < 0"></i>
                <i class="el-icon-minus" v-if="highwayon == 0"> </i
                >{{ highwayon | percent }}
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
      highwaynum: 0,
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
      accidenton: 0,
      accidentover: 0,
      closeon: 0,
      closeover: 0,
      jamon: 0,
      jamover: 0,
      roadworkon: 0,
      roadworkover: 0,
      cityon: 0,
      cityover: 0,
      highwayon: 0,
      highwayover: 0,
      pickerOptions: {
        // 只能选择之前的日期
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        // 时间选择器快捷
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
      // 默认选择当天日期
      timestamp: new Date(),
      tableHistorySituation: [],
      tableHistoryEvents1: [],
      tableHistoryEvents2: [],
    };
  },
  //默认读取当前数据，并渲染
  created() {
    // 将当前时间戳精确到day
    let initTime = this.timestamp.setHours(0, 0, 0, 0);
    this.updateChart(initTime).then(() => {
      this.calculateData(initTime);
    });
  },
  mounted() {
    //取今天的数据
    this.historySituationGet(this.timestamp);
    this.eventsSituationGet(this.timestamp);
    //刷新表格中历史累计数据
    this.historySumGet().then(() => {
      this.updateDataHistory();
    });
    this.eventsSumGet().then(() => {
      this.updateDataEvents();
    });
  },
  destroyed() {},
  updated() {
    //计算当日所有路段的总数并显示在饼图中
    this.totalnum =
      this.turnnum + this.brakenum + this.acceleratenum + this.overspeednum;
    this.totalnumevents1 =
      this.accidentnum + this.closenum + this.jamnum + this.roadworknum;
    this.totalnumevents2 = this.citynum + this.highwaynum;
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
        return "——";
      } else if (value == Infinity) {
        return "——";
      } else return (value * 100).toFixed(1) + "%";
    },
    //格式化截止日期时间
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
    //绘制事件情况的饼图，自定义饼图格式
    drawChart() {
      var chartDom = document.getElementById("roadChart");
      var myChart = echarts.init(chartDom);
      var option = {
        //饼图底部的总数统计
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
        // 图例的显示样式
        legend: {
          // 竖行
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
              //默认不显示label，鼠标hover才显示
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
    //事件类型数量饼图
    drawChartEvents1() {
      var chartDom1 = document.getElementById("eventsChart1");
      var myChart1 = echarts.init(chartDom1);
      var option = {
        title: {
          zlevel: 0,
          text: ["事件（件): " + this.totalnumevents1],
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
    //私立空间数量饼图
    drawChartEvents2() {
      var chartDom = document.getElementById("eventsChart2");
      var myChart2 = echarts.init(chartDom);
      var option = {
        title: {
          zlevel: 0,
          text: ["事件（件): " + this.totalnumevents2],
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
                value: this.highwaynum,
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
    //事件数量查询
    async eventsSituationGet(timestamp) {
      //从毫秒单位转换为秒单位
      let date = Number(timestamp.toString().slice(0, 10));
      //当前时刻转化为当日零时零分零秒
      let dateStart = date - (date % 86400) + 57600;
      let dateEnd = dateStart + 86400;
      var eventsSituation = new Array();
      //查询刹车路段
      for (let type = 1; type <= 6; type++) {
        await API.safeAnalyze
          .eventsNumGet(dateStart, dateEnd, type)
          .then((res) => {
            if (res.status === 0) {
              switch (type) {
                case 1:
                  eventsSituation[0] = res.event_num; //事故
                  break;
                case 2:
                  eventsSituation[1] = res.event_num; //封路
                  break;
                case 3:
                  eventsSituation[2] = res.event_num; //拥堵
                  break;
                case 4:
                  eventsSituation[3] = res.event_num; //施工
                  break;
                case 5:
                  eventsSituation[4] = res.event_num; //城内
                  break;
                case 6:
                  eventsSituation[5] = res.event_num; //高速
                  break;
                default:
                  console.log("获取事件数据失败");
              }
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
      }
      return eventsSituation;
    },
    //事件累计数量
    eventsSumGet() {
      let promises = [];
      // 循环type请求
      for (let type = 1; type <= 6; type++) {
        promises.push(
          new Promise((resolve, reject) => {
            API.safeAnalyze
              .eventsSumGet(type)
              .then((res) => {
                if (res.status === 0) {
                  this.eventsdeadlinedate = res.update_time;
                  switch (type) {
                    case 1:
                      this.accidentsum = res.event_num;
                      break;
                    case 2:
                      this.closesum = res.event_num;
                      break;
                    case 3:
                      this.jamsum = res.event_num;
                      break;
                    case 4:
                      this.roadworksum = res.event_num;
                      break;
                    case 5:
                      this.citysum = res.event_num;
                      break;
                    case 6:
                      this.highwaysum = res.event_num;
                      break;
                    default:
                      console.log("error");
                  }
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
      }
      return Promise.all(promises);
    },
    updateDataHistory() {
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
    updateDataEvents() {
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
          eventsScope: "高速",
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
        this.brakeon = (
          (this.brakenum - yesterdaybrake) /
          yesterdaybrake
        ).toFixed(3);
        this.turnon = ((this.turnnum - yesterdayturn) / yesterdayturn).toFixed(
          3
        );
        this.accelerateon = (
          (this.acceleratenum - yesterdayaccelerate) /
          yesterdayaccelerate
        ).toFixed(3);
        this.overspeedon = (
          (this.overspeednum - yesterdayoverspeed) /
          yesterdayoverspeed
        ).toFixed(3);
      });
      this.eventsSituationGet(timestamp - 86400000).then((res) => {
        let yesterdayData = res;
        let yesterdayaccident = yesterdayData[0];
        let yesterdayclose = yesterdayData[1];
        let yesterdayjam = yesterdayData[2];
        let yesterdayraodwork = yesterdayData[3];
        let yesterdaycity = yesterdayData[4];
        let yesterdayhighway = yesterdayData[5];
        this.accidenton = (
          (this.accidentnum - yesterdayaccident) /
          yesterdayaccident
        ).toFixed(3);
        this.closeon = (
          (this.closenum - yesterdayclose) /
          yesterdayclose
        ).toFixed(3);
        this.jamon = ((this.jamnum - yesterdayjam) / yesterdayjam).toFixed(3);
        this.roadworkon = (
          (this.roadworknum - yesterdayraodwork) /
          yesterdayraodwork
        ).toFixed(3);
        this.cityon = ((this.citynum - yesterdaycity) / yesterdaycity).toFixed(
          3
        );
        this.highwayon = (
          (this.highwaynum - yesterdayhighway) /
          yesterdayhighway
        ).toFixed(3);
      });

      //同比
      this.historySituationGet(timestamp - 604800000).then((res) => {
        let weekData = res;
        let weekbrake = weekData[0];
        let weekturn = weekData[1];
        let weekaccelerate = weekData[2];
        let weekoverspeed = weekData[3];
        this.brakeover = ((this.brakenum - weekbrake) / weekbrake).toFixed(3);
        this.turnover = ((this.turnnum - weekturn) / weekturn).toFixed(3);
        this.accelerateover = (
          (this.acceleratenum - weekaccelerate) /
          weekaccelerate
        ).toFixed(3);
        this.overspeedover = (
          (this.overspeednum - weekoverspeed) /
          weekoverspeed
        ).toFixed(3);
      });
      //同比
      this.eventsSituationGet(timestamp - 604800000).then((res) => {
        let weekData = res;
        let weekaccident = weekData[0];
        let weekclose = weekData[1];
        let weekjam = weekData[2];
        let weekroadwork = weekData[3];
        let weekcity = weekData[4];
        let weekhighway = weekData[5];
        this.accidentover = (
          (this.accidentnum - weekaccident) /
          weekaccident
        ).toFixed(3);
        this.closeover = ((this.closenum - weekclose) / weekclose).toFixed(3);
        this.jamover = ((this.jamnum - weekjam) / weekjam).toFixed(3);
        this.roadworkover = (
          (this.roadworknum - weekroadwork) /
          weekroadwork
        ).toFixed(3);
        this.cityover = ((this.citynum - weekcity) / weekcity).toFixed(3);
        this.highwayover = (
          (this.highwaynum - weekhighway) /
          weekhighway
        ).toFixed(3);
      });
    },
    // 时间戳转为yyyy-mm-dd的格式
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
    // 更新饼图
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
        this.eventsSituationGet(timestamp).then((res) => {
          let eventsNumber;
          eventsNumber = res;
          this.accidentnum = eventsNumber[0];
          this.closenum = eventsNumber[1];
          this.jamnum = eventsNumber[2];
          this.roadworknum = eventsNumber[3];
          this.citynum = eventsNumber[4];
          this.highwaynum = eventsNumber[5];
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
  // 不显示右侧fake时间选择器
  visibility: hidden;
  padding-top: 3rem;
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
.el-icon-minus {
  color: #00faff;
  padding-right: 5px;
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
