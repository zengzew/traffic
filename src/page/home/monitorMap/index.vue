<template>
  <div class="sys-page">
    <div id="container">
      <map1></map1>
      <watch id="watch"></watch>
      <div style="clear: both"></div>
      <detail id="detail" v-if="isDetailShow"></detail>
    </div>
  </div>
</template>

<script>
import Map1 from './map';
import Watch from '../../components/monitor/watch';
import Detail from '../../components/monitor/detail';
import {mapState} from "vuex";

export default {
  name: 'qqMap',
  components: { Map1, Watch, Detail },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      isDetailShow: (state) => state.watch.isDetailShow,
    }),
  },
  methods: {},
  created() {
    // 默认进入时detail不显示
    this.$store.commit('watch/setIsDetailShow', false);
  },
};
</script>

<style lang="scss" scoped>
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
  z-index: 99;
}
#watch {
  // transition: .3s;
  position: absolute;
  top: 10px;
  bottom: 20px;
  transition: 0.3s;
}
#optimize {
  transition: 0.3s;
  position: absolute;
  top: 20px;
  left: -419px;
  bottom: 20px;
}
</style>
