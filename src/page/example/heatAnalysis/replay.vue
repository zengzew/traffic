<template>
  <div class="replayContentBox">
    <div class="contentBox">
      <span style="font-size: 16px">热力回放</span>
      <span style="font-size: 11px; color:#9D9FAD; "> {{moment(dateVal).format('YYYY-MM-DD')}}</span>
      <span class="intervalBox">时间间隔
        <el-select class="replaySelectBox" width="30px"
                   popper-class="selectPop"
                   size="mini"
                   v-model="interval"
                   filterable placeholder="请选择"
                   @change="intervalChange">
          <el-option
              v-for="item in intervalOpts"
              :key="item.value"
              :label="item.label + '分钟'"
              :value="item.value">
          </el-option>
        </el-select>
      </span>
      <!--      <div ref="timeLineBox" class="timeLineBox">-->

      <!--      </div>-->
      <LbsTimeline :interval.sync='interval'
                   :playState = 'playState'
                   :itemList=getLabelArr()
                   :currentIndex = timeIndex
                   @indexChange="indexChange"
                   @playStateChange="playStateChange"
      ></LbsTimeline>
    </div>

  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapState} from 'vuex'
  import moment from 'moment'
  import LbsTimeline from "./lbsTimeline";


  export default {
    name: "replay",
    components: {
      LbsTimeline
    },
    data() {
      return {
        moment,
        interval: 10,
        intervalOpts: [
          {value: 60,
          label: 60},
          {value: 30,
            label: 30},
          {value: 10,
            label: 10},
          {value: 5,
            label: 5},
        ],
        playState: false
      }
    },
    computed: {
      ...mapState({
        dateVal: state => state.heatAnalysis.dateVal,
        timeIndex: state => state.heatAnalysis.timeIndex
      }),
      ...mapGetters({
        timeArr: 'heatAnalysis/timeArr',
        timeArrByInterval: 'heatAnalysis/timeArrByInterval',
        requestParamObj: 'heatAnalysis/requestParamObj',
      })
    },
    watch: {
      requestParamObj(){
        this.paramReset()
      }
    },
    methods: {
      ...mapMutations({
        setTimeIndex: 'heatAnalysis/setTimeIndex',
        setInterval: 'heatAnalysis/setInterval',
      }),

      intervalChange() {
        this.setInterval(this.interval)
        this.setTimeIndex(0); //复位
      },
      getLabelArr() {
        return this.timeArrByInterval.map(item => moment(item * 1000 ).format('HH:mm'))
      },
      indexChange(currentIndex) {
        this.setTimeIndex(currentIndex)
      },
      playStateChange(val) {
        this.playState = val
      },
      // 更换数据重置进度信息
      paramReset(){
        this.interval = 10;
        this.setTimeIndex(0);
        this.playState = false;

      },
    },
    mounted() {
      this.setInterval(this.interval)

    }
  }
</script>

<style scoped lang="scss">
  .replayContentBox {
    position: absolute;
    bottom: 10px;
    right: 10px;
    height: 120px;
    width: 500px;
    background: #22253A;
  }

  .contentBox {
    margin: 10px;
    height: 100px;

  }

  .intervalBox {
    color: #919191;
    float: right;

    /deep/ .replaySelectBox {
      width: 100px;

      input {
        color: #F0F3F7;
        border: none;
        background-color: #22253A;;
      }
    }
  }

  .timeLineBox {
    width: 100%;
    height: 80px;
  }
</style>
