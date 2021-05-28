<template>
  <div class="panelStyle" v-show="['origin', 'both', ''].includes(trailType)">
    <div ref="main" class="echartsStyle" @mouseup="touchs" style=""></div>
    <div ref="lineChart" class="echartsStyle1" @mouseup="touchs" @click="chartClick">
      <!-- <LbsTimeline :interval.sync='interval'
                          :itemList=xAxisData
             ></LbsTimeline>-->
    </div>
    <!--<el-slider
            v-model="sliderValue"
            :min="parseInt(startTime)"
            :max="parseInt(endTime)"
            height= "1px"
            class="sliderStyle"
        ></el-slider>-->
    <div ref="divSlider" class="divSliderStyle"></div>
    <el-button type="primary" class="btnStyle" @click="speedChange">{{ state.speedVal + 'x' }}</el-button>
    <span class="dateLabel">{{ xAxisData[currentIndex] | dateFormat1(xAxisData) }}</span>
    <div class="subTextStyle">
      <span class="subTextField"> 当前时间</span>
      <span class="subTextValue"> {{ subtextTime() }}</span>
      &nbsp&nbsp&nbsp&nbsp<span class="subTextField"> 行驶里程 </span>
      <span class="subTextValue"> {{ subTextDis() + 'km' }} </span>
      <span class="subTextField"> &nbsp&nbsp&nbsp&nbsp当前车速</span>
      <span class="subTextValue"> {{ subTextSpeed() + 'km/h' }} </span>
    </div>
    <!--        <span class="subTextStyle"> {{'当前时间 ' + subtextTime()  + '&nbsp&nbsp&nbsp&nbsp行驶里程 ' + subTextDis() + 'km' + '&nbsp&nbsp&nbsp&nbsp当前车速 ' + subTextSpeed() + 'km/h'}}</span>-->
  </div>
</template>

<script>
  import echarts from 'echarts';
  import moment from 'moment';
  import getDistance from '@/util/latlonToDistance';
  import timeControlImg from '@/assets/images/TimeControl@2x.png';
  import {mapState} from 'vuex';

  let charts = null;
let lineChart = null;
export default {
  name: 'chartContainer',

  data() {
    return {
      lastVal: '',
      reFlag: '',
      startTime: 0,
      endTime: 0,
      date: 0,
      currentIndex: 0,
      sliderValue: 0,
      options: [],
      speedOptions: [0.5, 1, 2, 3, 10],
      option2: null,
      axisPointer: null,
      lineChartOpt: {
        grid: {
          // show: false,
          containLabel: false,
          bottom: '5px',
          left: '60px',
          right: '18px',
        },
        yAxis: [
          {
            type: 'value',
            name: '车速 （km/h）',
            splitNumber: 4,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                type: 'dotted',
                color: 'rgb(215,215,215)',
              },
            },
            axisLabel: {
              color: 'rgba(128, 128, 128, 0.8)',
              fontSize: '12px',
            },
            nameTextStyle: {
              fontSize: '12px',
            },
          },
        ],
        xAxis: [
          {
            type: 'time',
            boundaryGap: false,
            axisPointer: {
              show: true,
              type: 'line', // 默认为直线，可选为：'line' | 'shadow',
              value: 0,
              snap: true,
              label: {
                show: false,
                formatter: (params) => {
                  this.date = params.value;
                  return moment(params.value - this.startTime).format('mm:ss');
                },
              },
              lineStyle: {
                color: 'rgb(156,194,255)',
                // type: 'dashed',
                width: 1,
              },
              triggerOn: 'none',
              width: 5,
              handle: {
                show: true,
                size: 5,
              },
              Z: 1000,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
          },
        ],
        visualMap: [
          {
            type: 'piecewise',
            show: false,
            dimension: 0,
            pieces: [],
          },
        ],
        tooltip: {
          show: false,
          triggerOn: 'mousemove',
        },
        series: [
          {
            type: 'line',
            showSymbol: false,
            areaStyle: {
              // color: 'rgba(43,45,255,1)'
            },
            lineStyle: {
              color: 'rgba(43,45,163,0)',
            },
            smooth: true,
            smoothMonotone: 'x',
          },
        ],
      },
      initOption: {
        // timeline基本配置都写在baseoption 中
        baseOption: {
          timeline: {
            // loop: false,
            axisType: 'time',
            show: true,
            left: '10px',
            right: '5px',
            symbol: 'none',
            // symbolSize: 'none',
            autoPlay: false,
            label: {
              show: false,
              formatter: (value) => moment(parseInt(value)).format('mm:ss'),
            },
            playInterval: 1000,
            lineStyle: {
              color: 'rgba(220, 220, 220, 0.8)',
            },
            controlStyle: {
              showNextBtn: false,
              showPrevBtn: false,
              showPlayBtn: true,
            },

            checkpointStyle: {
              symbol: `image://${timeControlImg}`,
              symbolSize: 10,
              color: '#4E90FF',
              borderWidth: 0,
              animation: false,
            },
            data: [],
          },
          grid: {
            // show: false,
            containLabel: false,
            top: '90px',
            left: '50px',
            right: '8px',
          },
          yAxis: [
            {
              type: 'value',
              name: '车速 （km/h）',
              splitNumber: 4,
              axisLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                lineStyle: {
                  type: 'dotted',
                  color: 'rgb(215,215,215)',
                },
              },
              axisLabel: {
                color: 'rgba(128, 128, 128, 0.8)',
                fontSize: '12px',
              },
              nameTextStyle: {
                fontSize: '12px',
              },
            },
          ],
          xAxis: [
            {
              type: 'time',
              boundaryGap: false,
              axisLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                show: false,
              },
              axisPointer: {
                show: true,
              },
            },
          ],
          tooltip: {
            // trigger: 'axis',
            //   triggerOn:'click',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              show: true,
              type: 'line', // 默认为直线，可选为：'line' | 'shadow',
              handle: {
                show: true,
              },
              z: 1000,
            },
            showContent: false,
          },

          series: [
            {
              type: 'line',
              areaStyle: {
                color: 'rgba(43,45,255,1)',
              },
              lineStyle: {
                // color: 'rgba(43,45,163,0)'
              },
              smooth: true,
              smoothMonotone: 'x',
            },
          ],
        },
        // 变量则写在options中
        options: this.options,
      },
    };
  },
  computed: {
    ...mapState({
      trailType: (state) => state.watch.trailType,
      xAxisData: (state) => state.trailReplayChart.xAxisData,
      yAxisData: (state) => state.trailReplayChart.yAxisData,
      pathPoints: (state) => state.trailReplayChart.pathPoints,
      state: (state) => state.trailReplayChart.replayState,
    }),
  },
  watch: {
    xAxisData: {
      // 轨迹数据更新后图表重绘
      handler() {
        this.$nextTick(function () {
          this.date = this.xAxisData[0];
          this.chartsDataInit();
          this.concatOption();
          // charts.setOption(this.option2)
          this.drawLineChart('lineChart');
          this.drawChart('main');
        });
      },
      immediate: false,
      deep: true,
    },
    'state.isPlaying': {
      handler(newVal) {
        charts.dispatchAction({
          type: 'timelineplaychanged',
          playState: newVal,
        });
        this.lineChartOpt.tooltip.triggerOn = newVal ? 'none' : 'mousemove';
        lineChart.setOption(this.lineChartOpt);
        this.option2.baseOption.timeline.autoPlay = newVal;
        charts.setOption(this.option2);
      },
      immediate: false,
      deep: true,
    },
  },
  methods: {
    touchs() {
      if (this.reFlag === this.date) {
        return;
      }
      this.reFlag = this.date;
      /* this.xAxisData.forEach((item, index) => {
          if (this.date === item) {
            charts.dispatchAction({
              type: 'timelineChange',
              currentIndex: index,
            });
          }
        })*/
    },
    chartClick() {
      this.xAxisData.forEach((item, index) => {
        if (this.date === item) {
          charts.dispatchAction({
            type: 'timelineChange',
            currentIndex: index,
          });
        }
      });
    },
    drawChart(id) {
      if (charts) {
        charts.dispose();
      }
      charts = echarts.init(this.$refs[id]);
      charts.off('timelineplaychanged');
      charts.off('timelinechanged');
      // 滑块位置更新
      this.$refs.divSlider.style.width = 0;

      this.state.isPlaying && this.$set(this.state, 'isPlaying', false);
      charts.setOption(this.option2);

      // 播放状态改变触发事件
      charts.on('timelineplaychanged', (params) => {
        this.option2.baseOption.timeline.autoPlay = params.playState;
        this.$set(this.state, 'isPlaying', params.playState);
      });

      // 时间轴时间点改变触发事件
      charts.on('timelinechanged', (params) => {
        this.currentIndex = params.currentIndex;
        const timelineDataArr = [...this.option2.baseOption.timeline.data];
        this.lineChartOpt.visualMap[0].pieces = [
          {
            gt: this.xAxisData[0],
            lte: this.xAxisData[this.currentIndex],
            color: '#4E90FF',
            colorAlpha: 1,
          },
          {
            gt: this.xAxisData[this.currentIndex],
            lte: this.xAxisData[this.xAxisData.length - 1],
            color: 'rgb(156,194,255)',
            colorAlpha: 1,
          },
        ];
        //  更改指示器的指示线值
        this.lineChartOpt.xAxis[0].axisPointer.value = timelineDataArr[this.currentIndex];
        lineChart.setOption(this.lineChartOpt);

        // 更改时间轴跳转间隔
        if (this.currentIndex < this.xAxisData.length - 1)
          this.option2.baseOption.timeline.playInterval =
            (this.xAxisData[this.currentIndex + 1] - this.xAxisData[this.currentIndex]) / this.state.speedVal;
        // 更改当前dateIndex 触发 map.vue 中的state watch
        this.$set(this.state, 'dateIndex', params.currentIndex);
        // 改为自动播放
        this.$set(this.state, 'isPlaying', true);

        charts.setOption(this.option2);

        if (this.currentIndex !== this.xAxisData.length - 1) {
          this.$refs.divSlider.style.width = `${
            ((timelineDataArr[this.currentIndex] - this.startTime) / (this.endTime - this.startTime)) * 423 - 2
          }px`;
        } else {
          this.$refs.divSlider.style.width = 0;
        }

        this.$once('hook:beforeDestroy', () => {
          charts.dispose();
        });
      });
    },
    // 拼接option
    concatOption() {
      // 拼接option

      const tmpData = [];
      this.xAxisData.forEach((item, index) => {
        tmpData[index] = [item, this.yAxisData[index]];
      });
      this.lineChartOpt.series[0].data = [...tmpData];
      this.lineChartOpt.visualMap[0].pieces = [
        {
          gt: this.xAxisData[0],
          lte: this.xAxisData[this.xAxisData.length - 1],
          color: 'rgb(156,194,255)',
        },
      ];
      // 生成背景数据
      this.option2.options = [];
      // 拼接 baseOption
      this.option2.baseOption.timeline.playInterval = this.xAxisData[1] - this.xAxisData[0];
      this.option2.baseOption.timeline.data = [...this.xAxisData];
    },
    drawLineChart(id) {
      lineChart = echarts.init(this.$refs[id]);
      lineChart.setOption(this.lineChartOpt);
    },
    speedChange() {
      const speedValIndex = this.speedOptions.findIndex((item) => item === this.state.speedVal);
      this.state.speedVal = this.speedOptions[(speedValIndex + 1) % this.speedOptions.length];
      charts.dispatchAction({
        type: 'timelineChange',
        currentIndex: this.currentIndex,
      });
    },
    calDistanceByIndex(index) {
      const calPoints = this.pathPoints.slice(0, index + 1);
      return calPoints.reduce(
        (total, val, index, arr) =>
          index < arr.length - 1 ? total + getDistance(val[0], val[1], arr[index + 1][0], arr[index + 1][1]) : total,
        0,
      );
    },
    // 部分数据初始化,用于轨迹切换时
    chartsDataInit() {
      this.option2 = this.deepCopy(this.initOption);
      // this.axisPointer = this.deepCopy(this.initAxisPointer);

      this.currentIndex = 0;
      this.startTime = this.xAxisData[0];
      this.endTime = this.xAxisData[this.xAxisData.length - 1];
      // this.axisPointer.value = this.xAxisData[0];
      this.lineChartOpt.xAxis[0].axisPointer.value = this.xAxisData[0];
      this.option2.baseOption.timeline.playInterval = 1000 / this.state.speedVal;
    },
    deepCopy(obj) {
      if (obj == null) {
        return null;
      }
      const result = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object') {
            result[key] = this.deepCopy(obj[key]); // 如果是对象，再次调用该方法自身
          } else {
            result[key] = obj[key];
          }
        }
      }
      return result;
    },
    subtextTime() {
      return moment(this.date).format('HH:mm:ss') || '00:00';
    },
    subTextDis() {
      return this.calDistanceByIndex(this.xAxisData.indexOf(this.date)).toFixed(2);
    },
    subTextSpeed() {
      return parseFloat(this.yAxisData[this.xAxisData.indexOf(this.date)]).toFixed(2);
    },
  },
  filters: {
    dateFormat1(value, xAxisData) {
      const diffAll = moment(xAxisData[xAxisData.length - 1] - xAxisData[0]).format('mm:ss');
      const diffCurrent = moment(value - xAxisData[0]).format('mm:ss');
      return `${diffCurrent}/${diffAll}`;
    },
  },
  mounted() {
    this.chartsDataInit();
    this.concatOption();
    this.drawLineChart('lineChart');
    this.drawChart('main');
  },
  beforeDestroy() {
    if (charts) charts.dispose();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.panelStyle {
  height: 250px;
  width: 500px;
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 2000;
  background: #ffffff;
  box-shadow: 0 2px 10px 0 rgba(2, 2, 2, 0.1);
  border-radius: 4px;
}
.echartsStyle {
  height: 230px;
  margin: 10px;
}
.echartsStyle1 {
  width: 100%;
  height: 150px;
  background-color: #fff;
  margin-top: -210px;
}
.btnStyle {
  position: absolute;
  bottom: 16px;
  right: 18px;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 8px;
  color: rgb(50, 50, 50);
  background-color: #f0f3f7;
  border-color: rgba(1, 1, 1, 0);
  cursor: pointer;
}
.dateLabel {
  position: absolute;
  color: #000;
  bottom: 16px;
  right: 375px;
  font-size: 12px;
}
.divSliderStyle {
  position: absolute;
  width: 0px;
  height: 2px;
  bottom: 43px;
  left: 58px;
  background-color: #4e90ff;
  z-index: 1000;
  pointer-events: none;
}
.subTextStyle {
  position: absolute;
  bottom: 194px;
  color: black;
  left: 15px;
  font-size: 12px;
}
.subTextField {
  color: #606275;
}
.subTextValue {
  font-weight: bold;
}
</style>
