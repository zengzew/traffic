<template>
  <div id="map1" class="map-container"></div>
</template>

<script>
/* eslint-disable */
import amap from '@/util/amap'
var map
export default {
    mounted() {
        // amap.load(() => {
            this.init()
        // })
    },
    methods: {
        init() {
            map = new qq.maps.Map('map1', {
                center: new qq.maps.LatLng(38.995328,117.223064),      // 地图的中心地理坐标。
                zoom:8                                                 // 地图的中心地理坐标。
            })
        }
    }
}
</script>

<style scoped>
.map-container{
    width: 100%;
    height: 100%;
}
</style>