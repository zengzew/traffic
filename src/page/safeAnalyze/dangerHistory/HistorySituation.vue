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
    <div id="chart"></div>
    <el-table
      :data="tableHistorySituation"
      style="width: 100%"
      :border="true"
      size="medium"
      height="13.8rem"
    >
      <el-table-column type="index"> </el-table-column>
      <el-table-column prop="type" label="路段类型"> </el-table-column>
      <el-table-column prop="volume" label="积累数量（条）"> </el-table-column>
    </el-table>
    <div class="cardContainer">
      <el-row type="flex" justify="space-around">
        <el-col :span="5">
          <el-card shadow="hover"> 1 </el-card>
        </el-col>
        <el-col :span="5">
          <el-card shadow="hover"> 2 </el-card>
        </el-col>
        <el-col :span="5">
          <el-card shadow="hover"> 3 </el-card>
        </el-col>
        <el-col :span="5">
          <el-card shadow="hover"> 4 </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import "@/util/echarts.theme.default";
export default {
  data() {
    return {
      situationDate: "",
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
          volume: "1433",
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
    this.drawChart();
  },
  watch: {
    situationDate: function () {
      console.log(this.situationDate);
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
        title: { text: "路段数量对比情况", left: "center" },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          right: 0,
        },
        series: [
          {
            name: "路段数量对比",
            type: "pie",
            radius: ["40%", "70%"],
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
              { value: 1433, name: "急转弯路段" },
              { value: 2653, name: "急加速路段" },
              { value: 1762, name: "急刹路段" },
              { value: 4236, name: "超速路段" },
            ],
          },
        ],
      };
      myChart.setOption(option);
    },
  },
};
</script>

<style scoped>
#chart {
  width: 30rem;
  height: 30rem;
  margin: 5rem 15rem;
}
.timepicker {
  flex-basis: 100%;
  margin-left: 20rem;
  margin-top: 5rem;
}
.el-table {
  margin: 5rem 15rem;
}
.main {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
}
.cardContainer {
  width: 100%;
  background: cadetblue;
}
.el-card {
  padding: 2rem 0;
}
</style>
