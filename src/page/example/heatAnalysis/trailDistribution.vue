<template>
  <div class="contentBox">
    <div ref="main1" class="chartsBox"></div>
  </div>
</template>

<script>
  import echarts from "echarts"
  import {mapGetters, mapState} from "vuex";
  import API from '@/util/apiV1'
  import moment from 'moment'

  export default {
    name: "trailDistribution",
    data() {
      return {
        moment,
        myChart: {},
        dataArr: [],
        timeObjArr: [],
        isFirstLoad: true,
        option: {
          title: {
            text: '轨迹分布趋势',
            textStyle: {
              color: '#fff',
              fontSize: 16,
              fontWeight: 600
            }
          },
          grid: {
            containLabel: true,
            left: 'left',
            bottom: 10

          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [], // 时间
            axisLabel: {
              color: '#9D9FAD',
              interval: 35,
              rotate: 40,
              fontFamily: 'PingFangSC-Regular',
              fontSize: 12,
              lineHeight: 12,
              formatter: (value, index) => {
                if (index && moment(parseInt(value)).format('HH:mm') === '00:00') {
                  return "24:00"
                } else {
                  return moment(parseInt(value)).format('HH:mm');
                }
              }
            }
          },
          yAxis: {
            type: 'value',
            name: '轨迹点数(个)',
            nameTextStyle: {
              color: '#9D9FAD',
              align: 'left'
            },
            axisLabel: {
              color: '#9D9FAD',
              interval: 3,
              fontFamily: 'PingFangSC-Regular',
              fontSize: 12,
              lineHeight: 12,

            }
          },
          series: [{
            data: [], // 点数
            type: 'line',
            smooth: true,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(71,120,255,1)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(71,120,255,0.1)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
            itemStyle: {
              color: 'rgba(71,120,255,1)'
            },
            symbol: 'none'
          }]
        }
      }
    },
    computed: {
      ...mapState({
        dateVal: state => state.heatAnalysis.dateVal,
      }),
      ...mapGetters({
        requestParamObj: 'heatAnalysis/requestParamObj',
      })
    },
    watch: {
      requestParamObj(newVal){
          this.requestParamCb()
      },
      dataArr() {
        this.initCharts();
      },
    },
    methods: {
      initCharts() {
        this.initTimeObjArr();
        this.isFirstLoad = true;
        if (this.dataArr.length !== 0) {
          // 初始化图表
          this.myChart = echarts.init(this.$refs['main1']);
          for (let i = 0; i < this.dataArr.length; i++) {
            for (let j = 0; j < this.timeObjArr.length; j++) {
              if (this.timeObjArr[j].time === this.dataArr[i].start_time * 1000) {
                this.timeObjArr[j].count = this.dataArr[i].count;
                break;
              }
            }
          }
          this.option.xAxis.data = this.timeObjArr.map(item => item.time);
          this.option.series[0].data = this.timeObjArr.map(item => item.count);
          this.myChart.setOption(this.option)
          window.addEventListener('resize', () => {
            this.myChart.resize()
          })
        } else {
          // 以下是暂无数据显示样式(样式根据本身需求进行调整)
          let html = '<div><sapn style="font-size: 16px;font-weight: 600;">轨迹分布趋势</sapn><div  style="margin-top: 80px;text-align: center;color:#909399; font-size: 14px;">暂无数据</div></div>'
          this.$refs['main1'].innerHTML = html
          this.$refs['main1'].removeAttribute('_echarts_instance_')
        }
      },
      requestParamCb(){
        API.heatAnalysis.pointCountDayGet({
          adcode: this.requestParamObj.cityVal,
          start_time: this.requestParamObj.dateVal / 1000,
          type: this.requestParamObj.deviceType
        }).then(res => {
            if (res.status === 0) {
              this.dataArr = res.datas ? res.datas : [];
            } else {
              this.dataArr = [];
            }
          }
        )
      },
      initTimeObjArr(){
        this.timeObjArr = [];
        for (let i = 0; i <= 12 * 24; i++) {
          this.timeObjArr.push({
            time: this.dateVal + i * 1000 * 60 * 5,
            count: 0
          })
        }},
    },
    mounted() {
      this.initCharts();
      this.requestParamCb();
    },
    created() {
      // 时间序列初始化，5分钟为一个间隔
      this.initTimeObjArr();
    }
  }
</script>

<style scoped lang="scss">
  .chartsBox {
    width: 100%;
    height: 100%;
  }
</style>