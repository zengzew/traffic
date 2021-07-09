<template>
  <div class="haha">
    <el-tabs
      v-model="activeName"
      type="card"
      @tab-click="handleClick"
      tab-position="top"
    >
      <el-tab-pane label="历史情况" name="first"
        ><history-situation></history-situation
      ></el-tab-pane>
      <el-tab-pane label="历史点事件" name="second"
        ><history-events></history-events
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import HistoryEvents from "./HistoryEvents.vue";
import HistorySituation from "./HistorySituation.vue";

export default {
  components: { HistorySituation, HistoryEvents },
  data() {
    return {
      activeName: "first",
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    goBack() {
      this.$router.push({ name: "select" });
    },
  },
};
</script>
<style lang="less" scoped>
.haha {
  height: 200%;
  width: 100%;
  position: absolute;
  top: 48px;
  bottom: 0;
  min-height: 600px;
}

/deep/ .el-tabs__content {
  height: 100%;
  position: absolute;
  margin: -14px;
}

/deep/ .el-tab-pane {
  height: 100%;
  background-color: rgb(33, 45, 61);
}

/deep/ .el-tabs__nav-scroll {
  background-color: rgb(33, 45, 61);
}
</style>
