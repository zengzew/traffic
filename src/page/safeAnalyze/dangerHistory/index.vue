<template>
  <div>
    <el-page-header @back="goBack" content="交通安全分析/历史统计分析">
    </el-page-header>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="历史情况" name="first"
        ><history-situation></history-situation
      ></el-tab-pane>
      <el-tab-pane label="历史点时间" name="second"
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
</style>