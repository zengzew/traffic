<template>
  <div class="trail-container">
    <div id="map1" class="map-container"></div>
    <div class="trailActionsContainer" v-if="['origin', 'both', ''].includes(trailType)">
      <div class="cBox">
        <span> 驾驶行为分析</span>
      </div>
      <div class="cBox">
        <el-checkbox v-model="isCornerMarkersShow" :disabled="cornerPoints.length === 0">急转弯 </el-checkbox>
        <span
          class="icon-action"
          :style="{
            'background-image': `url(${require(cornerPoints.length !== 0
              ? '../../../assets/images/trailActionsImg/ic_jizhuanwan@2x.png'
              : '../../../assets/images/trailActionsImg/ic_jizhuanwan_disable@2x.png')})`,
          }"
        ></span>
        {{ cornerPoints.length }}
      </div>
      <div class="cBox">
        <el-checkbox v-model="isBrakeMarkersShow" :disabled="brakePoints.length === 0">急刹车</el-checkbox>
        <span
          class="icon-action"
          :style="{
            'background-image': `url(${require(brakePoints.length !== 0
              ? '../../../assets/images/trailActionsImg/ic_jishache@2x.png'
              : '../../../assets/images/trailActionsImg/ic_jishache_disable@2x.png')})`,
          }"
        ></span>
        {{ brakePoints.length }}
      </div>
      <div class="cBox">
        <el-checkbox v-model="isChangeSpeedMarkersShow" :disabled="changeSpeedPoints.length === 0">急变速</el-checkbox>
        <span
          class="icon-action"
          :style="{
            'background-image': `url(${require(brakePoints.length !== 0
              ? '../../../assets/images/trailActionsImg/ic_jibiansu@2x.png'
              : '../../../assets/images/trailActionsImg/ic_jibiansu_disable@2x.png')})`,
          }"
        ></span>
        {{ changeSpeedPoints.length }}
      </div>
      <div class="cBox">
        <el-checkbox v-model="checked" disabled>超速</el-checkbox>
        <span
          class="icon-action"
          :style="{
            'background-image': `url(${require('../../../assets/images/trailActionsImg/ic_chaosu_disable@2x.png')})`,
          }"
        ></span>
        0
      </div>
      <div class="cBox">
        <el-checkbox v-model="isStopMarkersShow" :disabled="stopPoints.length === 0">停留</el-checkbox>
        <span
          class="icon-action"
          :style="{
            'background-image': `url(${require(stopPoints.length !== 0
              ? '../../../assets/images/trailActionsImg/ic_tingliu@2x.png'
              : '../../../assets/images/trailActionsImg/ic_tingliu_disable@2x.png')})`,
          }"
        ></span>
        {{ stopPoints.length }}
      </div>
    </div>
    <div class="Map-tools1">
      <div :class="{ tool1: true, 'tool-traffic': true, 'tool-traffic-active': showTraffic }" @click="trailSetPath">
        <span class="tool-item icon-ic_traffic"></span>
        路况
      </div>
      <div
        @click="setSatellite"
        :class="{ tool1: true, 'tool-satellite': true, 'tool-satellite-active': showSatellite }"
      >
        <span class="tool-item icon-ic_satellite"></span>
        卫星
      </div>
    </div>
    <div class="mapZoom">
      <span @click="addZoom" class="mapZoom-item icon-zoom_up"></span>
      <span @click="reduceZoom" class="mapZoom-item icon-zoom_down"></span>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  import MarkerEndPic from "./../../../assets/images/MarkerEnd.png";
  import MarkerStartPic from "./../../../assets/images/MarkerStart.png";
  import cornerMakerImg from 'sysStatic/images/trailActionsImg/marker_jizhuanwan@2x.png';
  import brakeMarkerImg from 'sysStatic/images/trailActionsImg/marker_jishache@2x.png';
  import changeSpeedMakerImg from 'sysStatic/images/trailActionsImg/marker_jibiansu@2x.png';
  import carMarkerImg from 'sysStatic/images/trailActionsImg/ic_car1.png'
  import stopMakerImg from 'sysStatic/images/trailActionsImg/marker_tingliu@2x.png'
  import getDistance from '@/util/latlonToDistance'
  import {mapState, mapActions} from "vuex";
  import {GET_STYLE} from "../../../assets/mapStyle/style.js";
  import './trailMap.scss'
// import mapEnv from "../../../config/envConfig";
import ImageTile from "../../../util/model/imageTile";

  export default {
    data() {
      return {
        isTMapLoaded: false,
        Trafficlayer: {},
        satelliteLayer: {},
        showSatellite: false,
        showTraffic: false,
        polyline: {},
        polylineTwo: {},
        replayPolyline: null, // 轨迹回放已行走路径
        pathLine: [],
        pathLineTwo: [],
        markerStart: {},
        markerEnd: {},
        markers: {}, // 起始点marker
        showDetail: true,
        carMarker: {}, // 轨迹目标车辆
        checked: true,
        count: 0,
        trailActionsMarker: {},
        changeSpeedPoints: [], // 急变速
        brakePoints: [], // 急刹车
        cornerPoints: [], // 急转弯
        stopPoints: [], // 停留
        changeSpeedMarkers: {}, // 急变速
        brakeMarkers: {}, // 急刹车
        cornerMarkers: {}, // 急转弯
        stopMarkers: {}, // 停留
        allTrailActionMarkers: [],
        isCornerMarkersShow: false,
        isBrakeMarkersShow: false,
        isChangeSpeedMarkersShow: false,
        isStopMarkersShow: false,
        tmpTime: 0, // 每一段路开始时的时间
        lastPoints: null, // 每次moving上一次点坐标,
        isFirstLoad: true,
      };
    },
    computed: {
      ...mapState({
        trail: state => state.watch.trail,
        trailType: state => state.watch.trailType,
        mapLocation: state => state.watch.mapLocation,
        xAxisData: state => state.trailReplayChart.xAxisData,
        yAxisData: state => state.trailReplayChart.yAxisData,
        pathPoints: state => state.trailReplayChart.pathPoints,
        state: state => state.trailReplayChart.replayState,
        trailActionsData: state => state.trailReplayChart.trailActions,
      }),
    },
    watch: {
      mapLocation() {
        this.map.setCenter(
          new TMap.LatLng(this.mapLocation["lat"], this.mapLocation["lng"])
        );
      },

      trail(newVal, oldVal) {
        // 更新到轨迹行为
        this.isFirstLoad = true;
        this.trailChangeCb();
      },
      trailType() {
        // 对轨迹优化的路线进行处理  后续再优化
        // 先删除再重绘，再挑选
        this.polyline.setMap(null);
        this.markers.setMap(null);
        this.$set(this.state, 'isPlaying', false);
        this.drawAllPath();
        if (Object.keys(this.polyline).length && this.trailType === "both") {
          // 绘制两条线
          // 绘制轨迹符号
          this.allTrailActionMarkers.forEach(item => {
            item.isShow() && item.markers.setVisible(true)
          });
          this.carMarker.setVisible(true);
          // this.carMarker.resumeMove();
          this.replayPolyline && this.replayPolyline.setVisible(true)
        } else if (this.trailType === "better") {
          // this.recoverMarker(this.pathLineMarker);
          // 绘制优化线
          this.polyline.remove(['initTrailId']);
          this.allTrailActionMarkers.forEach(item => {
            item.markers.setVisible(false)
          });
          this.carMarker.pauseMove();
          this.carMarker.setVisible(false);
          this.replayPolyline && this.replayPolyline.setVisible(false)

        } else if (this.trailType === "origin") {
          // 绘制原始轨迹
          this.polyline.remove(['optimizeTrailId']);
          this.allTrailActionMarkers.forEach(item => {
            item.isShow() && item.markers.setVisible(true)
          })
          this.carMarker.setVisible(true);
          this.$set(this.state, 'isPlaying', false);

          // this.carMarker.resumeMove();
          this.replayPolyline && this.replayPolyline.setVisible(true)

        } else {
          // 都不绘制
          this.polyline.setMap(null);
          this.markers.setMap(null);
          this.allTrailActionMarkers.forEach(item => {
            item.markers.setVisible(false)
          });
          this.carMarker.pauseMove();
          this.carMarker.setVisible(false);
          this.replayPolyline && this.replayPolyline.setVisible(false)
        }
      },
      state: {
        handler: function (newVal, oldVal) {
          // TODO: 初次加载 新旧值相同仍然触发，原因未知
          // if(JSON.stringify(newVal) === JSON.stringify(oldVal)) return;
          // 原始轨迹计算
          let tmpSpeed = newVal.dateIndex === this.xAxisData.length - 1 ? 0 : this.getSpeedByDateIndex(newVal.dateIndex);
          //let tmpSpeed = this.yAxisData[newVal.dateIndex] * this.state.speedVal;
          if (newVal.isPlaying && tmpSpeed) {
            // 初始化轨迹回放 已行走路径
            this.tmpTime = (new Date()).getTime();
            this.markerMoveByPath(
              this.carMarker,
              this.pathPoints.slice(newVal.dateIndex),
              tmpSpeed
            );
            this.lastPoints = new TMap.LatLng(
              this.pathPoints[newVal.dateIndex][0],
              this.pathPoints[newVal.dateIndex][1]
            );
            this.carMarker.off("moving", this.movingEvent)
            this.carMarker.on("moving", this.movingEvent)
          } else {
            this.carMarker.off("moving", this.movingEvent)
            this.carMarker.stopMove()
          }
        },
        deep: true
      },
      trailActionsData: {
        handler: function (newVal) {
          // 轨迹更新后 对应的驾驶行为点更新，触发绘制操作
          this.resetTrailPoints(); // 重置数据和符号
          this.cornerPoints = newVal.corner_points.map((item, index) => {
            return {
              id: 'cornerPoints' + index,
              styleId: 'cornerPointsStyle',
              position: new TMap.LatLng(item.begin_point.lat, item.begin_point.lng)
            }
          });
          this.brakePoints = newVal.sub_points.map((item, index) => {
            return {
              id: 'brakePoints' + index,
              styleId: 'brakePointsStyle',
              position: new TMap.LatLng(item.begin_point.lat, item.begin_point.lng)
            }
          });
          this.changeSpeedPoints = newVal.add_points.map((item, index) => {
            return {
              id: 'changeSpeedPoint' + index,
              styleId: 'changeSpeedPointsStyle',
              position: new TMap.LatLng(item.begin_point.lat, item.begin_point.lng)
            }
          });
          this.stopPoints = newVal.stop_points.map((item, index) => {
            return {
              id: 'stopPoints' + index,
              styleId: 'stopPointsStyle',
              position: new TMap.LatLng(item.begin_point.lat, item.begin_point.lng)
            }
          });
          this.cornerMarkers = new TMap.MultiMarker({
            map: this.map,
            styles: {
              'cornerPointsStyle': new TMap.MarkerStyle({
                'width': 28,
                'height': 32,
                'src': cornerMakerImg,
              }),
            },
            geometries: this.cornerPoints
          });
          this.cornerMarkers.setVisible(this.isCornerMarkersShow);

          this.brakeMarkers = new TMap.MultiMarker({
            map: this.map,
            styles: {
              'brakePointsStyle': new TMap.MarkerStyle({
                'width': 26,
                'height': 32,
                'src': brakeMarkerImg,
              }),
            },
            geometries: this.brakePoints
          });
          this.brakeMarkers.setVisible(this.isBrakeMarkersShow);
          this.changeSpeedMarkers = new TMap.MultiMarker({
            map: this.map,
            styles: {
              'changeSpeedPointsStyle': new TMap.MarkerStyle({
                'width': 28,
                'height': 32,
                'src': changeSpeedMakerImg,
              }),
            },
            geometries: this.changeSpeedPoints
          });
          this.changeSpeedMarkers.setVisible(this.isChangeSpeedMarkersShow);

          this.stopMarkers = new TMap.MultiMarker({
            map: this.map,
            styles: {
              'stopPointsStyle': new TMap.MarkerStyle({
                'width': 28,
                'height': 32,
                'src': stopMakerImg,
              }),
            },
            geometries: this.stopPoints
          });
          this.stopMarkers.setVisible(this.isStopMarkersShow);

          this.allTrailActionMarkers = [
            {
              markers: this.cornerMarkers,
              isShow: () => this.isCornerMarkersShow
            },
            {
              markers: this.brakeMarkers,
              isShow: () => this.isBrakeMarkersShow
            },
            {
              markers: this.changeSpeedMarkers,
              isShow: () => this.isChangeSpeedMarkersShow
            },
            {
              markers: this.stopMarkers,
              isShow: () => this.isStopMarkersShow
            },
          ];
        },
        deep: true
      },
      isCornerMarkersShow(newVal) {
        this.cornerMarkers.setVisible(newVal);
      },
      isBrakeMarkersShow(newVal) {
        this.brakeMarkers.setVisible(newVal);
      },
      isChangeSpeedMarkersShow(newVal) {
        this.changeSpeedMarkers.setVisible(newVal);
      },
      isStopMarkersShow(newVal) {
        this.stopMarkers.setVisible(newVal)
      },
    },
    mounted() {
      this.init();
      this.trailChangeCb();
    },
    created() {

      Object.assign(this, {
        map: null,
        satelliteLayer: null,
      });
    },
    methods: {
      ...mapActions({
        updateChartData: 'trailReplayChart/updateChartData',
        updateTrailActions: 'trailReplayChart/updateTrailActions'
      }),
      getHeight() {
        this.tableHeight = window.innerHeight - 100;
        this.tableHeight1 = window.innerHeight - 380;
      },
      // 初始化--创建地图
      init() {
        this.map = new TMap.Map("map1", {
          center: new TMap.LatLng(38.995328,117.223064), // 地图的中心地理坐标。
          zoom: 10,
          viewMode: '2D',
          pitchable: false,
          baseMap: [
            {type: 'vector'},
          ],
          showControl: false,
        });
        // 专网个性化地图
        // // 设置个性化样式
        this.map.setMapStyleConfig({style: GET_STYLE()});
        // 初始化地圖中心位置
        this.mapLocation["lat"] &&
        this.map.setCenter(
          new TMap.LatLng(this.mapLocation["lat"], this.mapLocation["lng"])
        );
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
      // 设置卫星地图，专网版
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
      createdData(a, d) {
        // a 第一条原始轨迹，d第二条
        let wayOne = [];
        let wayTwo = [];
        let aLen = a.length - 1;
        let dLen = d.length - 1;
        let wayTwoMiddleStart = new TMap.LatLng(
          d[0]["lat"],
          d[0]["lng"]
        );
        let wayTwoMiddleEnd = new TMap.LatLng(
          d[dLen]["lat"],
          d[dLen]["lng"]
        );
        Array.prototype.slice.call(a).map((value, index) => {
          wayOne.push(new TMap.LatLng(value["lat"], value["lng"]));
        });
        Array.prototype.slice.call(d).map((value, index) => {
          wayTwo.push(new TMap.LatLng(value["lat"], value["lng"]));
        });
        this.pathLine = wayOne;
        this.pathLineTwo = wayTwo;
        this.drawPath(
          wayOne,
          wayTwo,
          wayTwoMiddleStart,
          wayTwoMiddleEnd
        );
        this.drawMarker(wayTwoMiddleStart, wayTwoMiddleEnd);
      },
      drawMarker(startPos, endPos) {
        this.markers = new TMap.MultiMarker({
          map: this.map,
          styles: {
            "markerEnd": new TMap.MarkerStyle({
              "width": 44,
              "height": 75,
              "anchor": {x: 18, y: 60},
              'src': MarkerStartPic,
            }),
            "markerStart": new TMap.MarkerStyle({
              "width": 44,
              "height": 75,
              "anchor": {x: 18, y: 60},
              'src': MarkerEndPic
            }),
          },
          geometries: [
            { //点标注数据数组
              "id": "markerEndId",
              "styleId": "markerEnd",
              "position": endPos,
            },
            {
              "id": "markerStartId",
              "styleId": "markerStart",
              "position": startPos,
            }
          ]
        });
      },
      addZoom() {
        this.zoom = this.map.getZoom() + 1;
        this.map.setZoom(this.zoom);
      },
      reduceZoom() {
        this.zoom = this.map.getZoom() - 1;
        this.map.setZoom(this.zoom);
      },
      drawAllPath() {
        let e = this.trail["result"]["track"]
          ? this.trail["result"]["track"]
          : [];
        let f = this.trail["result"]["trackopt"]
          ? this.trail["result"]["trackopt"]
          : [];
        e.length > 0 && this.createdData(e, f);
      },
      // 绘制地图点
      drawPath(a, b, startPoint, endPoint) {
        // 画线---111
        this.polyline = new TMap.MultiPolyline({
          // id: 'initTrail',
          map: this.map,
          styles:
            {
              "initTrailStyle":
                new TMap.PolylineStyle({
                  color: "rgba(151,150,150,0.4)",
                  width: 8,
                  borderWidth: 1,
                  borderColor: "#969696",
                  zIndex: 2
                }),
              'optimizeTrailStyle':
                new TMap.PolylineStyle({
                  color: "rgba(78,144,255,0.8)",
                  width: 8,
                  borderWidth: 2,
                  borderColor: "#4E90FF",
                  zIndex: 5
                }),
            },
          geometries: [
            {
              id: 'initTrailId',
              styleId: "initTrailStyle",
              paths: a,
            },
            {
              id: 'optimizeTrailId',
              styleId: "optimizeTrailStyle",
              paths: b
            }
          ]
        });
        if(this.isFirstLoad){
          let swLat = a[0]["lat"] < a[a.length - 1]["lat"] ? a[0]["lat"] : a[a.length - 1]["lat"];
          let swLng = a[0]["lng"] < a[a.length - 1]["lng"] ? a[0]["lng"] : a[a.length - 1]["lng"];
          let neLat = a[0]["lat"] > a[a.length - 1]["lat"] ? a[0]["lat"] : a[a.length - 1]["lat"];
          let neLng = a[0]["lng"] > a[a.length - 1]["lng"] ? a[0]["lng"] : a[a.length - 1]["lng"];
          this.map.fitBounds(new TMap.LatLngBounds(
            new TMap.LatLng(swLat , swLng  ),
            new TMap.LatLng(neLat , neLng )
          ));
          // this.map.setScale(this.map.getScale() - 1 );
          // this.reduceZoom()
          setTimeout(()=>{
            this.map.zoomTo(this.map.getZoom() - 1)
            setTimeout(()=>{
              this.map.panTo(new TMap.LatLng((swLat + neLat)/ 2, (swLng + neLng) / 2),)
            },500)
          }, 1000)
          this.isFirstLoad = false
        }

      },
      // 根据坐标数组绘制线
      markerMoveByPath(marker, pathArr, speed) {
        let pathObjArr = this.pointArrToPathObjArr(pathArr);
        marker.moveAlong({
          'car': {
            path: pathObjArr,
            speed: speed
          }
        }, {
          autoRotation: true
        })
      },
      // 坐标数组转换为坐标对象latlng数组，以便被api识别
      pointArrToPathObjArr(pointsArr) {
        return pointsArr.map(item => new TMap.LatLng(item[0], item[1]))
      },
      // 根据时间索引计算速度
      getSpeedByDateIndex(dateIndex) {
        let tmpDis = getDistance(
          this.pathPoints[dateIndex][0],
          this.pathPoints[dateIndex][1],
          this.pathPoints[dateIndex + 1][0],
          this.pathPoints[dateIndex + 1][1],
        );
        // 单位h
        let tmpInterval = (this.xAxisData[dateIndex + 1] - this.xAxisData[dateIndex]) / 1000 / 3600;
        return tmpDis / tmpInterval * this.state.speedVal
      },
      // 重置驾驶行为 数据 和 清除图上驾驶行为符号
      resetTrailPoints() {
        this.changeSpeedPoints = [];
        this.brakePoints = [];
        this.cornerPoints = [];
        this.stopPoints = [];
        Object.keys(this.changeSpeedMarkers).length && this.changeSpeedMarkers.setMap(null);
        Object.keys(this.brakeMarkers).length && this.brakeMarkers.setMap(null);
        Object.keys(this.cornerMarkers).length && this.cornerMarkers.setMap(null);
        Object.keys(this.stopMarkers).length && this.stopMarkers.setMap(null);
      },
      movingEvent() {
        // 不是最后一个点
        if (this.state.dateIndex < this.xAxisData.length - 1) {
          let currentTime = (new Date()).getTime();
          let timeDiff = currentTime - this.tmpTime;
          let timeAll = (this.xAxisData[this.state.dateIndex + 1] - this.xAxisData[this.state.dateIndex]) / this.state.speedVal;
          let currentLat = this.pathPoints[this.state.dateIndex][0] + timeDiff / timeAll * (this.pathPoints[this.state.dateIndex + 1][0] - this.pathPoints[this.state.dateIndex][0]);
          let currentLng = this.pathPoints[this.state.dateIndex][1] + timeDiff / timeAll * (this.pathPoints[this.state.dateIndex + 1][1] - this.pathPoints[this.state.dateIndex][1]);
          let currentPoints = [...this.pointArrToPathObjArr(this.pathPoints.slice(0, this.state.dateIndex + 1)), new TMap.LatLng(
            currentLat,
            currentLng)
          ];
          if (!this.replayPolyline) {
            this.replayPolyline = new TMap.MultiPolyline({
              // id: 'initTrail',
              map: this.map,
              styles:
                {
                  "replayTrailStyle":
                    new TMap.PolylineStyle({
                      color: "rgba(73,73,73,0.8)",
                      width: 8,
                      zIndex: 21,
                      borderWidth: 2,
                      borderColor: 'rgb(73,73,73)'
                      // editable: false,
                    }),
                },
              geometries: [
                {
                  id: 'replayTrailId',
                  styleId: "replayTrailStyle",
                  paths: [this.lastPoints, new TMap.LatLng(currentLat, currentLng)],
                },
              ]
            });
          } else if (currentPoints.length > 1) {
            this.replayPolyline.setZIndex(20);
            this.replayPolyline.setGeometries([
              {
                id: 'replayTrailId',
                styleId: "replayTrailStyle",
                paths: currentPoints,
              },
            ])
          } else { // 重头开始时清空曲线
            this.replayPolyline.setMap(null)
            this.replayPolyline = new TMap.MultiPolyline({
              // id: 'initTrail',
              map: this.map,
              styles:
                {
                  "replayTrailStyle":
                    new TMap.PolylineStyle({
                      color: "rgba(73,73,73,0.8)",
                      width: 8,
                      zIndex: 20,
                      borderWidth: 2,
                      borderColor: 'rgb(73,73,73)'
                    }),
                },
              geometries: [
                {
                  id: 'replayTrailId',
                  styleId: "replayTrailStyle",
                  paths: [this.lastPoints, new TMap.LatLng(currentLat, currentLng)],
                },
              ]
            });
          }
        }
      },
      trailChangeCb() {
        // if (!this.isTMapLoaded || !this.trail) return
        this.isTMapLoaded = true;
        this.updateTrailActions(this.trail)
        // 更新数据到表格
        this.updateChartData(this.trail);
        // 清空路线、标记点、动态回放标记
        Object.keys(this.polyline).length &&
        this.polyline.setMap(null) &&
        this.markers.setMap(null) &&
        this.carMarker.stopMove() &&
        this.carMarker.setMap(null) &&
        this.carMarker.off("moving", this.movingEvent);
        this.$set(this.state, 'isPlaying', false);
        this.replayPolyline && this.replayPolyline.setMap(null)
        this.replayPolyline = null;

        this.drawAllPath();
        // 动态回放符号初始化
        this.carMarker = new TMap.MultiMarker({
          map: this.map,
          styles: {
            'car-down': new TMap.MarkerStyle({
              'width': 40,
              'height': 40,
              'anchor': {
                x: 20,
                y: 20,
              },
              'faceTo': 'map',
              'rotate': 180,
              'src': carMarkerImg,
            }),
          },
          geometries: [{
            id: 'car',
            styleId: 'car-down',
            position: new TMap.LatLng(this.pathPoints[0][0], this.pathPoints[0][1]),
          },
          ]
        });
      },
    },
    beforeDestroy() {
      // 清除定时器
      Object.keys(this.carMarker).length && this.carMarker.off("moving", this.movingEvent);
      this.map.destroy()
    }
  };
</script>

