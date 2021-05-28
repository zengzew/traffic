<template>
  <div class="trail-container">
    <div id="map1" class="map-container"></div>
    <div class="Map-tools">
      <div :class="{ tool: true, 'tool-traffic': true, 'tool-traffic-active': showTraffic }" @click="trailSetPath">
        <span class="tool-item icon-ic_traffic"></span>
        路况
      </div>
      <div
        @click="setSatellite"
        :class="{ tool: true, 'tool-satellite': true, 'tool-satellite-active': showSatellite }"
      >
        <span class="tool-item icon-ic_satellite"></span>
        卫星
        <!-- <div v-show="isShow" class="tool-checkbox"><el-checkbox v-model="checked">地名</el-checkbox></div> -->
      </div>
    </div>
  </div>
</template>

<script>
import tmap from '@/util/amap';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual'
import { mapActions, mapState } from 'vuex';
import { GET_STYLE } from '../../../assets/mapStyle/style.js';
import './map.scss';
import DeviceType from '../../../config/deviceType';
import { initDeviceStyle, getStyleIdByType } from './initDeviceStyle';
import ImageTile from '../../../util/model/imageTile';
// import mapEnv from '../../../config/envConfig';
import getDistance from '../../../util/latlonToDistance';

let CustomOverlay = null;

export default {
  props: ['carDetailData'],
  data() {
    return {
      showSatellite: false,
      showTraffic: false,
      zoom: 13,
      clickedMarker: '',
      northEastLat: '40.040492',
      northEastLng: '116.457634',
      southWestLat: '40.016334',
      southWestLng: '116.271748',
      bounds: {},
      markersArray: [],
      isActive: false,
      deviceStyleArr: [], // 样式文件数组
      multiMarker: null, // 设备点图层
      markerCluster: null, // 点聚合图层
      clusterBubbleList: [], // 点簇数组
      timer: null,
      mapEvtLoop: [],
    };
  },
  computed: {
    ...mapState({
      car: (state) => state.watch.car,
      trail: (state) => state.watch.trail,
      provinceList: (state) => state.watch.provinceList,
      mapLocation: (state) => state.watch.mapLocation,
      fourPosition: (state) => state.watch.fourPosition,
      deviceList: (state) => state.watch.deviceList,
      isOnline: (state) => state.watch.isOnline,
      isCarSet: (state) => state.watch.isCarSet,
    }),
  },
  watch: {
    carDetailData() {
      this.$store.state.watch.car = '--';
      this.clickedMarker = '--';
    },
    mapLocation() {
      this.map.setCenter(new TMap.LatLng(this.mapLocation.lat, this.mapLocation.lng));
    },
    isCarSet() {
      if (this.map.getZoom() < 14 && String(this.car) !== '--') {
        this.map.setZoom(14);
      }
      String(this.car) !== '--' && this.getCarbyId(this.car);
    },
  },
  mounted() {
    // tmap.load(() => {
      this.deviceStyleArr = initDeviceStyle()();
      CustomOverlay = require('../../../util/CustomOverlay').CustomOverlay;
      this.initMap();
    // });
  },

  methods: {
    ...mapActions({
      carMess: 'auth/loginByEmail',
      loadLang: 'loadLang',
    }),

    // 初始化--创建地图
    async initMap() {
      this.map = new TMap.Map('map1', {
        center: new TMap.LatLng(38.995328,117.223064), // 地图的中心地理坐标。
        zoom: 13, //  13,
        viewMode: '2D',
        pitchable: false, // 1.0.12版本gl暂不包含该接口，设置无效, 使用时应在3D模式下
      });
      // 设置控件位置
      const zoomCrl = this.map.getControl(TMap.constants.DEFAULT_CONTROL_ID.ZOOM);
      zoomCrl.setPosition(TMap.constants.CONTROL_POSITION.CENTER_RIGHT);
      /*const rotationCrl = this.map.getControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION);
      rotationCrl.setPosition(TMap.constants.CONTROL_POSITION.CENTER_RIGHT);*/
      this.map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION);
      // 专网地图 个性化样式
      this.map.setMapStyleConfig({ style: GET_STYLE() });

      // 添加地图监听事件 如果位置改变 则触发函数 resetBounds
      this.bounds = this.map.getBounds();
      // 初始化符号
      this.initMarkers();

      const me = this;
      // 更新地图四至
      this.getMapCornerPoint(this.map.getBounds());
      await this.$store.dispatch('watch/updateCityList', this.map.getCenter());
      // };
      this.map.on(
        'bounds_changed',
        debounce((e) => {
          console.log('bounds_changed');
          // 更新地图四至
          me.getMapCornerPoint(e.bounds);
          me.$store.dispatch('watch/updateCityList', this.map.getCenter());
          this.resetInterval(this);
        }, 500),
      );
      this.resetInterval(this);
    },
    resetInterval(me) {
      if (me.timer) {
        clearInterval(me.timer);
      }
      me.getNearbyData();
      me.timer = setInterval(() => {
        me.getNearbyData();
      }, 2000); // 每隔2秒钟请求一次
    },
    initMarkers() {
      this.multiMarker = new TMap.MultiMarker({
        id: 'initMarkers',
        map: this.map,
        styles: this.deviceStyleArr,
        geometries: [],
      });
    },
    getMapCornerPoint(bounds) {
      this.northEastLat = bounds.getNorthEast().getLat().toFixed(5);
      this.northEastLng = bounds.getNorthEast().getLng().toFixed(5);
      this.southWestLat = bounds.getSouthWest().getLat().toFixed(5);
      this.southWestLng = bounds.getSouthWest().getLng().toFixed(5);
    },
    // 实时路况图层
    trailSetPath() {
      if (this.$mapEnv.type === 'pubNet') {
        if (this.showTraffic) {
          if (this.showSatellite) {
            this.map.setBaseMap({ type: 'satellite' });
          } else {
            this.map.setBaseMap({ type: 'vector' });
          }
          this.showTraffic = false;
        } else {
          if (this.showSatellite) {
            this.map.setBaseMap([{ type: 'satellite' }, { type: 'traffic' }]);
          } else {
            this.map.setBaseMap([{ type: 'vector' }, { type: 'traffic' }]);
          }
          this.showTraffic = true;
        }
      } else {
        if (this.showTraffic) {
          this.map.setBaseMap({ type: 'vector' });
          this.showTraffic = false;
        } else {
          this.map.setBaseMap([{ type: 'vector' }, { type: 'traffic' }]);
          this.showTraffic = true;
        }
      }
    },
    // 设置卫星地图
    setSatellite() {
      if (this.$mapEnv.type === 'pubNet') {
        if (this.showSatellite) {
          if (this.showTraffic) {
            this.map.setBaseMap([{ type: 'vector' }, { type: 'traffic' }]);
          } else {
            this.map.setBaseMap([{ type: 'vector' }]);
          }
          this.showSatellite = false;
        } else {
          if (this.showTraffic) {
            this.map.setBaseMap([{ type: 'satellite' }, { type: 'traffic' }]);
          } else {
            this.map.setBaseMap([{ type: 'satellite' }]);
          }
          this.showSatellite = true;
        }
      } else {
        // 专网环境下切换卫星图
        this.showSatellite = !this.showSatellite;
        if (!this.satelliteLayer) this.satelliteLayer = new ImageTile(this.map, this.$mapEnv.privNet.satelliteUrl);
        this.showSatellite ? this.satelliteLayer.show() : this.satelliteLayer.hide();
      }
    },
    // 根据id获取到某辆车
    getCarbyId(id) {
      this.$API.device
        .deviceDataByOnlineGet({
          deviceid: id,
        })
        .then((res) => {
          if (res.status === 0) {
            this.map.panTo(new TMap.LatLng(res.result[0].lat, res.result[0].lng));
            // this.markersArray.push(marker);
            this.id = id;
            this.map.on('panend', () => {
              this.mapEvtLoop[0] = () => this.updateAfterClick(this.id);
            });
          }
          // }
        });
    },
    updateAfterClick(id) {
      console.log('updateAfterClick', this.multiMarker.getGeometries());
      const clickGeo = this.multiMarker.getGeometryById(id);
      if (clickGeo) {
        // 只有当初次点击或者点击不重复才触发更新
        if (!this.clickMarkerGeo || this.clickMarkerGeo.id !== id) {
          clickGeo.styleId = clickGeo.styleId.indexOf('_click') > 0 ? clickGeo.styleId : `${clickGeo.styleId}_click`;
          this.clickMarkerGeo = clickGeo;
          this.multiMarker.updateGeometries(this.clickMarkerGeo);
        }
        // this.map.panTo(clickGeo.position); // 移动中心坐标
      }
    },
    getTypeNumByName(nameArr) {
      const tmpTypeArr = [];
      nameArr.forEach((item) => {
        const matchType = Object.keys(DeviceType).filter((keyNum) => DeviceType[keyNum] === item)[0];
        tmpTypeArr.push(matchType);
      });
      return tmpTypeArr;
    },
    // 获取矩形 周边车辆
    getNearbyData() {
      if (!this.deviceList.length) this.clearMap();
      this.deviceList.length &&
        this.$API.device
          .nearbyDeviceGet({
            types: this.getTypeNumByName(this.deviceList).join(','),
            online: this.isOnline,
            maxlat: this.northEastLat,
            minlng: this.southWestLng,
            minlat: this.southWestLat,
            maxlng: this.northEastLng,
          })
          .then(async (res) => {
            if (res.status !== 0 || !res.result.length) {
              this.clearMap();
            } else {
              const filterArr = this.filterByIsOnline(res.result);
              // console.log('interval', res, filterArr);
              // let filterArr = res["result"];
              if (filterArr.length) {
                this.drawMap(filterArr);
                this.$store.commit('watch/setNowCounts', res.result.length); // 发出action確認數量
              } else {
                this.clearMap();
              }
            }
          });
    },
    filterByIsOnline(arr) {
      if (this.isOnline === null) {
        return arr;
      }
      return arr.filter((item) => item.online === this.isOnline);
    },
    clearMap() {
      this.$store.commit('watch/setNowCounts', 0); // 发出action確認數量
      if (this.clusterBubbleList.length) {
        this.clusterBubbleList.forEach((item) => {
          item.destroy();
        });
        this.clusterBubbleList = [];
      }
      this.clusterMarker &&
        this.clusterMarker.off('cluster_changed', this.clusterChangedEvt) &&
        this.clusterMarker.setGeometries([]);
      this.multiMarker && this.multiMarker.off('click', this.markerListenEvt) && this.multiMarker.setGeometries([]);
    },
    drawMap(driverArr) {
      console.log('isCli');
      const clusterGeo = driverArr.map((item) => ({
        id: item.deviceid,
        styleId: getStyleIdByType(item.online, item.type),
        position: new TMap.LatLng(Math.floor(item.lat * 1000000) / 1000000, Math.floor(item.lng * 1000000) / 1000000),
        properties: {
          status: item.online,
          type: item.type,
          loctime: item.loctime,
        },
      }));
      // console.log('created',clusterGeo.map(item => [item.position.lat,item.position.lng]))
      // 添加事件监听
      if (this.clusterMarker) {
        this.clusterMarker.setGeometries(clusterGeo);
      } else {
        this.clusterMarker = new TMap.MarkerCluster({
          id: 'cluster',
          map: this.map,
          enableDefaultStyle: false, // 关闭默认样式
          minimumClusterSize: 2,
          geometries: clusterGeo,
          zoomOnClick: true,
          gridSize: 60,
          averageCenter: false,
          maxZoom: 13,
        });
        // console.log('created1',this.clusterMarker.getGeometries().map(item => [item.position.lat,item.position.lng]))
      }
      this.clusterMarker &&
        this.clusterMarker.off('cluster_changed', this.clusterChangedEvt) &&
        this.clusterMarker.on('cluster_changed', this.clusterChangedEvt);
    },
    clusterChangedEvt() {
      // 销毁旧聚合簇生成的覆盖物
      if (this.clusterBubbleList.length) {
        this.clusterBubbleList.forEach((item) => {
          item.destroy();
        });
        this.clusterBubbleList = [];
      }
      const markerGeometries = [];
      this.lastGeoArr = this.multiMarker ? this.multiMarker.getGeometries().slice() : [];
      const moveAlongOptObj = {}; // 平滑移动时
      // console.log(
      //   'created2',
      //   this.lastGeoArr.map((item) => [item.position.lat, item.position.lng]),
      // );

      // 根据新的聚合簇数组生成新的覆盖物和点标记图层
      const clusters = this.clusterMarker.getClusters();
      clusters.forEach((item) => {
        if (item.geometries.length > 1) {
          const clusterBubble = new CustomOverlay({
            map: this.map,
            position: item.center,
            content: item.geometries.length,
            className: 'clusterBubbleStyle',
          });
          clusterBubble.on('click', () => {
            this.map.fitBounds(item.bounds);
          });
          this.clusterBubbleList.push(clusterBubble);
        } else {
          const itemGeo = item.geometries[0]; // 当前几何对象
          // console.log(item.geometries[0].position.lat, item.geometries[0].position.lng);
          // id相同且没有离线
          const matchRes = this.lastGeoArr.filter(
            (lastItem) => lastItem.id === itemGeo.id && itemGeo.properties.status !== 0,
          );
          if (
            matchRes.length &&
            !isEqual(matchRes[0].position, itemGeo.position) &&
            matchRes[0].properties.loctime !== itemGeo.properties.loctime
          ) {
            console.log('speed', this.getSpeed(matchRes[0], itemGeo));
            // 当前已存在且定位事件变化，位置移动的车辆，自动开启平滑移动
            moveAlongOptObj[itemGeo.id] = {
              path: [matchRes[0].position, itemGeo.position],
              // TODO 速度计算得出而不是给定
              speed: Math.ceil(this.getSpeed(matchRes[0], itemGeo)),
            };
          }
          markerGeometries.push(
            this.clickMarkerGeo && itemGeo.id === this.clickMarkerGeo.id
              ? this.clickMarkerGeo
              : {
                  id: itemGeo.id,
                  styleId: getStyleIdByType(itemGeo.properties.status, itemGeo.properties.type),
                  position: itemGeo.position,
                  properties: {
                    ...itemGeo.properties,
                  },
                },
          );
        }
      });
      this.multiMarker.off('click', this.markerListenEvt);
      if (this.multiMarker) {
        // 已创建过点标记图层，直接更新数据
        this.multiMarker.setGeometries(markerGeometries);
        if (Object.keys(moveAlongOptObj).length > 0) {
          Object.keys(moveAlongOptObj).length &&
            this.multiMarker.stopMove() &&
            this.multiMarker.moveAlong(
              {
                ...moveAlongOptObj,
              },
              {
                autoRotation: true, // 车头始终向前（沿路线自动旋转）
              },
            );
        }
      } else {
        // 创建点标记图层
        console.log('创建点图层');
        this.multiMarker = new TMap.MultiMarker({
          map: this.map,
          styles: this.deviceStyleArr,
          geometries: markerGeometries,
        });
      }
      this.mapEvtLoop.forEach((itemFunc) => itemFunc());
      // this.mapEvtLoop = [];
      // 先清除再添加
      this.multiMarker.on('click', this.markerListenEvt);
    },
    markerListenEvt(item) {
      // 明确被点击car的id
      console.log('click', item);
      /*
      this.$store.commit('watch/setCar', item.geometry.id);
      this.$store.commit('watch/setIsDetailShow', true);*/
      // 只有当初次点击或者点击不重复才触发更新

      if (!this.clickMarkerGeo || this.clickMarkerGeo.id !== item.geometry.id) {
        this.$store.commit('watch/setCar', item.geometry.id);
        this.$store.commit('watch/setIsDetailShow', true);
      }
      this.map.panTo(item.latLng); // 移动中心坐标
    },
    getSpeed(startPtGeo, endPtGeo) {
      const interval = endPtGeo.properties.loctime - startPtGeo.properties.loctime;
      !interval &&
        console.log(
          'interval 无效',
          /* endPtGeo.properties.loctime,
          startPtGeo.properties.loctime,
          endPtGeo.position,
          startPtGeo.position,*/
          startPtGeo,
          endPtGeo,
          this.lastGeoArr.map((item) => item.position.lng),
        );
      return interval
        ? (getDistance(
            startPtGeo.position.getLat(),
            startPtGeo.position.getLng(),
            endPtGeo.position.getLat(),
            endPtGeo.position.getLng(),
          ) /
            interval) *
            (1000 * 60 * 60)
        : 1;
    },
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
    // 销毁点标记
    this.multiMarker && this.multiMarker.destroy();
    // 销毁点聚合
    this.clusterMarker && this.clusterMarker.destroy();
    // 离开后销毁地图
    this.map && this.map.destroy();
  },
  created() {
    this.$store.commit('watch/setIsDetailShow', false); // 面板消失

    Object.assign(this, {
      map: null,
      customOverlay: null,
      clickMarkerGeo: null,
      clusterMarker: null, // 点聚合marker
      multiMarker: null, // 设备marker
      satelliteLayer: null,
    });
  },
};
</script>
