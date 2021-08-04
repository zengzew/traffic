<template>
  <div id="haha">
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
  name: "dangerHistory",
  components: { HistorySituation, HistoryEvents },
  data() {
    return {
      //默认显示的标签页
      activeName: "first",
    };
  },
  methods: {},
};
</script>
<style lang="less" scoped>
.haha {
  width: 100%;
  position: absolute;
}

/deep/ .el-tabs__content {
  margin: -14px;
  height: 100%;
  overflow-y: scroll;
  background-color: rgb(33, 45, 61);
}

/deep/ .el-tab-pane {
  height: 100%;
  background-color: rgb(33, 45, 61);
}

//修改滚动条样式
/deep/ .el-tabs__nav-scroll {
  background-color: rgb(33, 45, 61);
}
</style>
