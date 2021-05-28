<template>
  <div class="sys-page">
    <div id="container">
      <map1 v-if="isReplayChartShow"></map1>
      <!--            <detail v-on:listenTochildEvent="getMsgFormSon"  v-show = 'msgFormSon == true' id="detail"></detail>-->
      <optimize id="optimize" @changeShowState="changeShowState"></optimize>
      <chartContainer v-if="isReplayChartShow"></chartContainer>
    </div>
  </div>
</template>

<script>
import Map1 from './map';
import Optimize from '../../components/monitor/optimize'; // 轨迹优化面板
import Detail from '../../components/monitor/detail';
import ChartContainer from 'sysPage/components/monitor/chartContainer';
// import ChartContainer1 from 'sysPage/components/monitor/chartContainer1'

export default {
  name: 'mapTrail',
  components: { Map1, Optimize, Detail, ChartContainer },
  data() {
    return {
      msgFormSon: '',
      isReplayChartShow: false,
    };
  },
  methods: {
    /*getMsgFormSon(data) {
      this.msgFormSon = data;
    },*/
    changeShowState(hasTrailLoaded) {
      this.isReplayChartShow = hasTrailLoaded;
    },
  },
};
</script>

<style lang="scss" scoped>
.packup {
}
#container {
  width: 100%;
  height: 100%;
}
#detail {
  transition: 0.3s;
  position: absolute;
  top: 70px;
  // left: -450px;
  right: 20px;
  // overflow: hidden;
}
#optimize {
  transition: 0.3s;
  position: absolute;
  top: 20px;
  left: -360px;
  // height: 755px;
}
.note {
  position: absolute;
  top: 0px;
  left: 0;
  width: 100%;
  z-index: 1000;
}
</style>
