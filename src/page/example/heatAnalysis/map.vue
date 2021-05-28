<template>
  <div id="map1" class="map-container"></div>
</template>

<script>
/* eslint-disable */
  import amap from '@/util/amap'
  import {mapState, mapActions, mapGetters, mapMutations} from "vuex";
  import { GET_STYLE } from "./style3.js";

  export default {
    data() {
      return {
        map: null,
        heatLayer: null,
        locationArr: []
      }
    },
    computed: {
      ...mapState({
        heatDataObj: state => state.heatAnalysis.heatDataObj, // 请求热力图返回数据
        timeIndex: state => state.heatAnalysis.timeIndex,
        interval: state => state.heatAnalysis.interval,
        dateVal: state => state.heatAnalysis.dateVal
      }),
      ...mapGetters({
        requestParamObj: 'heatAnalysis/requestParamObj',
        timeArr: 'heatAnalysis/timeArr',
        timeArrByInterval: 'heatAnalysis/timeArrByInterval'
      })
    },
    watch: {
      // 监听请求参数变化， 热力图更新
      requestParamObj() {
        // 先请求，再刷新
        this.getPointsDay().then(()=>{
            this.refresh();
            let tmpTime = this.heatDataObj ? Object.keys(this.heatDataObj)[0]: this.dateVal;
            let tmpIndex = this.timeArrByInterval.indexOf(parseInt(tmpTime) )> -1? this.timeArrByInterval.indexOf(parseInt(tmpTime)): 0;
            this.setTimeIndex(tmpIndex);
          }
        )
      },
      timeIndex(){
        this.refresh()
      },
      timeArrByInterval(){
        this.refresh()
      }
    },
    mounted() {
      // amap.load(() => {
        this.init()
      // });
    },
    methods: {
      ...mapActions({
        getPointsDay:  'heatAnalysis/getPointsDay'
      }),
      ...mapMutations({
        setTimeIndex: 'heatAnalysis/setTimeIndex',
      }),
      init() {
         this.map = new TMap.Map("map1", {
          // pitch: 45,
          zoom: 12,
          center: new TMap.LatLng(39.903287, 116.400928),
          // mapStyleId: 'style2',
           showControl: true
        });
        let zoomCrl = this.map.getControl(TMap.constants.DEFAULT_CONTROL_ID.ZOOM);
        zoomCrl.setPosition(TMap.constants.CONTROL_POSITION.CENTER_RIGHT);
        let rotationCrl = this.map.getControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION);
        rotationCrl.setPosition(TMap.constants.CONTROL_POSITION.CENTER_RIGHT);

        // 专网个性化地图
        // // 设置个性化样式
        this.map.setMapStyleConfig({style: GET_STYLE()});
         if(this.locationArr.length){
           let lastLocation = this.locationArr.pop();
           this.map.setCenter(new TMap.LatLng(lastLocation.lat, lastLocation.lng))
           this.locationArr = [];
         }
         // TODO: 控件控制位置
         this.map.removeControl('TMap.DEFAULT_CONTROL_ID.ZOOM');
         // this.map.getControl('DEFAULT_CONTROL_ID.ZOOM').setPosition('CONTROL_POSITION.CENTER_RIGHT');
      },
      cityChangeCb(location){
        if(!this.map){ // 地图尚未加载时，先缓存区域中心地址
          this.locationArr.push(location)
        }else {
          this.map.setCenter(new TMap.LatLng(location.lat, location.lng))
        }
      },
      refresh(){
        this.heatLayer && this.heatLayer.remove();
        // 判断当前时刻是否存在数据
        let currentIndex = Object.keys(this.heatDataObj).indexOf(this.timeArrByInterval[this.timeIndex].toString())
        if(this.timeArrByInterval &&  currentIndex> -1){
          let heatData =this.heatDataObj[this.timeArrByInterval[this.timeIndex]].map(item => {
            let {lat, lng, count} = item;
            return {lat, lng, count}
          });

          //初始化热力图并添加至map图层
          this.heatLayer = new TMap.visualization.Heat({
            max: 50, // 热力最强阈值
            min: 0, // 热力最弱阈值
            height: 100, // 峰值高度
            radius: 50 // 最大辐射半径
          })
            .addTo(this.map)
            .setData(heatData);//设置数据
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .map-container{
    width: 100%;
    height: 100%;
    z-index: 0;
  }
</style>