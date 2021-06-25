<template>
    <div class="haha">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick" tab-position="top">
            <el-tab-pane label="历史情况" name="first"
                ><history-situation></history-situation
            ></el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
//import HistoryEvents from "./HistoryEvents.vue";
import HistorySituation from "./HistorySituation.vue";

export default {
    components: { HistorySituation },
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
    height: 100%;
    width: 100%;
    overflow-y: auto;
    position: absolute;
    top: 48px;
    bottom: 0;
}

/deep/ .el-tabs__content {
    height: 100%;
    position: absolute;
}

/deep/ .el-tab-pane{
  height: 100%;
}
</style>
