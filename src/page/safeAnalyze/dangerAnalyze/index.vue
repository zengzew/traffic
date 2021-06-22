<<<<<<< HEAD
<template></template>

<script>
export default {};
</script>
<style>
</style>
=======
<template>
    <div id="container">
        <map2></map2>
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
    top: 10px;
    bottom: 20px;
    transition: 0.3s;
}

</style>
>>>>>>> origin/zihao
