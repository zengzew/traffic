<template>
    <div style="height:100%">
            <div id="container" v-show="!$store.state.safeAnalysis.ifEventDetail">
        <map2></map2>
        <div class="colorbar"></div>
        <watch id="watch" ></watch>
        <div style="clear: both"></div>
    </div>
    <div id="container" v-show="$store.state.safeAnalysis.ifEventDetail">
        <detail></detail>
    </div>
    </div>
</template>

<script>
import Map2 from "./map";
import Watch from "../../components/safeAnalyze/watchTraffic";
import Detail from "../../components/safeAnalyze/eventDetail.vue"
export default {
    components: { Map2, Watch,Detail },
};
</script>

<style scoped>
#container {
    width: 100%;
    height: 100%;
    background-color: #2D3C51;
    /* overflow-y: auto; */
}

#watch {
    /* transition: .3s; */
    position: absolute;
    top: 48px;
    bottom: 20px;
    transition: 0.3s;
}

.colorbar{
    position: absolute;
    width: 100%;
    height: 3px;
    top: 48px;
    background-color: #1C2430;
    z-index: 10000;
}

</style>
