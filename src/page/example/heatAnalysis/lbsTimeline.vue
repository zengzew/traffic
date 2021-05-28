<template>
  <div class="lbsTimelineBox">
    <div ref="controlBtn1" class="controlBtn" @click="playStateChange"></div>
    <div class="lineBox" :style="mainLineStyle">
      <div class="mainLine">
        <div class="itemBox"
             @click="itemClick(item, index)"
             :data-title="labelFormatter(item,index)"
             v-for="(item, index) in itemList">
        </div>
      </div>
      <div class="labelBox">
        <div class="label" v-for="(item, index) in itemList"
             @click="itemClick(item, index)"
            v-show="index ===0 || index=== itemList.length-1">
          {{labelFormatter(item, index)}}
        </div>
      </div>
      <div ref="innerLine" class="innerBox">
        <div class="symbol" @mousemove="">
          <div class="tooltip">
            {{labelFormatter(itemList[currentIndexExtend], currentIndexExtend)}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import playIcon from 'sysStatic/images/heatAnalysis/play@2x.png'
  import pauseIcon from 'sysStatic/images/heatAnalysis/pause@2x.png'

  export default {
    name: "lbsTimeline",
    props: {
      itemList: {
        type: Array,
        default: ()=> {
          return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,]
        }
      },
      currentIndex: {
        type: Number,
        default: 0
      },
      playState: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // controlBtnStyle: 'display: inline-block;' +
        //   'cursor: pointer',
        mainLineStyle: 'flex: 1;' +
          'margin: 0 20px;' +
          'height: 3px; ' +
          'position: relative',
        intervalId: null,
        interval: 1000,
        playStateExtend: false,  // true 代表正在播放，false代表暂停
        currentIndexExtend: 0,
      }
    },
    watch: {
      currentIndex(newVal) {
        this.currentIndexExtend = newVal
        this.$emit('indexChange', newVal)
        this.$refs['innerLine'].style.width = (newVal / (this.itemList.length - 1) * 100).toFixed(2).toString() + '%'
      },
      currentIndexExtend(newVal){
        this.$emit('indexChange', newVal)
        this.$refs['innerLine'].style.width = (newVal / (this.itemList.length - 1) * 100).toFixed(2).toString() + '%'

      },
      playState(newVal) {
        this.playStateExtend = newVal;
      },
      playStateExtend(newVal){
        if (newVal) {
          this.startInterval();
          this.$refs['controlBtn1'].style.backgroundImage = 'url(' + pauseIcon + ')'
        } else {
          clearInterval(this.intervalId);
          this.$refs['controlBtn1'].style.backgroundImage = 'url(' + playIcon + ')'
        }
      },
      itemList(){
        this.setItemWidthByNum();
      },
    },
    methods: {
      itemClick(item, index) {
        this.currentIndexExtend = index;
      },
      playStateChange() {
        this.playStateExtend = !this.playStateExtend;
        this.$emit('playStateChange', this.playStateExtend)
      },
      startInterval() {
        this.intervalId && clearInterval(this.intervalId);
        this.intervalId = setInterval(() => {
          this.currentIndexExtend = (this.currentIndexExtend + 1) % this.itemList.length
        }, this.interval)
      },
      labelFormatter(value, index){
        if(index && value ==='00:00') {
          return "24:00"
        }else {
          return value;
        }
      },
      setItemWidthByNum(){
        let itemBoxs = document.querySelectorAll('.itemBox');
        for(let item of itemBoxs){
          item.style.width = `${(380 / this.itemList.length).toFixed(2)}px` ;
        }
      },
    },
    mounted() {

      // this.startInterval();
    }
  }
</script>

<style scoped lang="scss">
  .lbsTimelineBox {
    width: 100%;
    display: flex;
    align-items: center;
    height: 75px;
  }
 /* .lbsTimelineBox {
    position: absolute;
    top: 0px;
    right: 0px;
    display: flex;
    align-items: center;
    background: #2e3244;
    width: 500px;
    height: 75px;
  }*/
  .innerBox {
    position: absolute;
    height: inherit;
    top: 0;
    /*width: 50%;*/
    background: #4E90FF;
    transition: 0.2s;
    pointer-events: none;
    .symbol {
      float: right;
      width: 10px;
      height: 10px;
      margin-top: -4px;
      margin-right: -5px;
      border-radius: 50%;
      background: #4E90FF;
      transition: 0.2s;
      pointer-events: all;
    }
  }

  .mainLine {
    background-color: #313542;
    height: inherit;
    display: flex;
    justify-content: space-between
  }

  .itemBox {
    display: inline-block;
    min-width: 1px;
    height: 20px;
    margin-top: -10px;
    cursor: pointer;
    &:hover:after{
      content: attr(data-title);
      /*利用attr来读取data-title的值*/
      position: absolute;
      top:-30px;
      background: rgba(0,0,0, 0.4);
      border-radius: 4px;
      padding: 3px 5px;

    }
  }

  .controlBtn {
    display: inline-block;
    width: 16px;
    height: 16px;
    cursor: pointer;
    background-image: url('~sysStatic/images/heatAnalysis/play@2x.png');
    background-size: 100%;
  }

  .label {
    margin-top: 10px;
    cursor: pointer;
  }

  .labelBox {
    width: 102%;
    display: flex;
    justify-content: space-between;
  }
  .tooltip {
    margin-top: -30px;
    width: 40px;
    height: 26px;
    margin-left: -13px;
    text-align: center;
    background: url("~sysStatic/images/heatAnalysis/board@2x.png");
    background-size: 100% 100%;
    color: #000;
  }

</style>