<template>
    <div id="container">
        <map2></map2>
        <div class="colorbar"></div>
        <watch id="watch" ></watch>
        <div style="clear: both"></div>
    </div>
</template>

<script>
import Map2 from "./map";
import Watch from "../../components/safeAnalyze/watch";
export default {
    components: { Map2, Watch },
};
</script>

<style scoped>
#container {
    width: 100%;
    height: 100%;
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
