<template>
    <div class="trail-container">
        <div id="map2" class="map-container"></div>
        <div class="Map-tools">
            <div
                :class="{
                    tool: true,
                    'tool-traffic': true,
                    'tool-traffic-active': showTraffic,
                }"
                @click="trailSetPath"
            >
                <span class="tool-item icon-ic_traffic"></span>
                路况
            </div>
            <div
                @click="setSatellite"
                :class="{
                    tool: true,
                    'tool-satellite': true,
                    'tool-satellite-active': showSatellite,
                }"
            >
                <span class="tool-item icon-ic_satellite"></span>
                卫星
                <!-- <div v-show="isShow" class="tool-checkbox"><el-checkbox v-model="checked">地名</el-checkbox></div> -->
            </div>
        </div>
    </div>
</template>

<script>
import { GET_STYLE } from "../../../assets/mapStyle/style.js";
import "./map.scss";
export default {
    data() {
        return {
            showSatellite: false,
            showTraffic: false,
            zoom: 13,
            northEastLat: "40.040492",
            northEastLng: "116.457634",
            southWestLat: "40.016334",
            southWestLng: "116.271748",
            bounds: {},
            timer: null,
        };
    },
    methods: {
        // 初始化--创建地图
        async initMap() {
            this.$store.state.safeAnalysis.map = new TMap.Map("map2", {
                center: new TMap.LatLng(38.995328, 117.223064), // 地图的中心地理坐标。
                zoom: 13, //  13,
                viewMode: "2D",
                pitchable: false, // 1.0.12版本gl暂不包含该接口，设置无效, 使用时应在3D模式下
            });
            // 设置控件位置
            const zoomCrl = this.$store.state.safeAnalysis.map.getControl(
                TMap.constants.DEFAULT_CONTROL_ID.ZOOM
            );
            zoomCrl.setPosition(TMap.constants.CONTROL_POSITION.CENTER_RIGHT);
            /*const rotationCrl = this.$store.state.safeAnalysis.map.getControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION);
      rotationCrl.setPosition(TMap.constants.CONTROL_POSITION.CENTER_RIGHT);*/
            this.$store.state.safeAnalysis.map.removeControl(
                TMap.constants.DEFAULT_CONTROL_ID.ROTATION
            );
            // 专网地图 个性化样式
            this.$store.state.safeAnalysis.map.setMapStyleConfig({
                style: GET_STYLE(),
            });

            // 初始化 Line
            this.initLine();
        },
        // 实时路况图层
        trailSetPath() {
            if (this.$mapEnv.type === "pubNet") {
                if (this.showTraffic) {
                    if (this.showSatellite) {
                        this.$store.state.safeAnalysis.map.setBaseMap({
                            type: "satellite",
                        });
                    } else {
                        this.$store.state.safeAnalysis.map.setBaseMap({
                            type: "vector",
                        });
                    }
                    this.showTraffic = false;
                } else {
                    if (this.showSatellite) {
                        this.$store.state.safeAnalysis.map.setBaseMap([
                            { type: "satellite" },
                            { type: "traffic" },
                        ]);
                    } else {
                        this.$store.state.safeAnalysis.map.setBaseMap([
                            { type: "vector" },
                            { type: "traffic" },
                        ]);
                    }
                    this.showTraffic = true;
                }
            } else {
                if (this.showTraffic) {
                    this.$store.state.safeAnalysis.map.setBaseMap({
                        type: "vector",
                    });
                    this.showTraffic = false;
                } else {
                    this.$store.state.safeAnalysis.map.setBaseMap([
                        { type: "vector" },
                        { type: "traffic" },
                    ]);
                    this.showTraffic = true;
                }
            }
        },
        // 设置卫星地图
        setSatellite() {
            if (this.$mapEnv.type === "pubNet") {
                if (this.showSatellite) {
                    if (this.showTraffic) {
                        this.$store.state.safeAnalysis.map.setBaseMap([
                            { type: "vector" },
                            { type: "traffic" },
                        ]);
                    } else {
                        this.$store.state.safeAnalysis.map.setBaseMap([
                            { type: "vector" },
                        ]);
                    }
                    this.showSatellite = false;
                } else {
                    if (this.showTraffic) {
                        this.$store.state.safeAnalysis.map.setBaseMap([
                            { type: "satellite" },
                            { type: "traffic" },
                        ]);
                    } else {
                        this.$store.state.safeAnalysis.map.setBaseMap([
                            { type: "satellite" },
                        ]);
                    }
                    this.showSatellite = true;
                }
            } else {
                // 专网环境下切换卫星图
                this.showSatellite = !this.showSatellite;
                if (!this.satelliteLayer)
                    this.satelliteLayer = new ImageTile(
                        this.$store.state.safeAnalysis.map,
                        this.$mapEnv.privNet.satelliteUrl
                    );
                this.showSatellite
                    ? this.satelliteLayer.show()
                    : this.satelliteLayer.hide();
            }
        },
        // 初始化线
        initLine() {
            //创建 MultiPolyline
            this.$store.state.safeAnalysis.line = new TMap.MultiPolyline({
                id: "polyline-layer", //图层唯一标识
                map: this.$store.state.safeAnalysis.map, //绘制到目标地图
                //折线样式定义
                styles: {
                    default: new TMap.PolylineStyle({
                        color: "#A6E6E6", //线填充色
                        width: 8, //折线宽度
                        borderWidth: 2, //边线宽度
                        lineCap: "round", //线端头方式
                        // showArrow: true,
                        // arrowOptions: { width: 10, height: 20, space: 30 },
                    }),
                    highlight: new TMap.PolylineStyle({
                        color: "#51A7D7", //线填充色
                        width: 8, //折线宽度
                        borderWidth: 2, //边线宽度
                        lineCap: "round", //线端头方式
                        // showArrow: true,
                        // arrowOptions: { width: 10, height: 20, space: 50 },
                    }),
                },
            });
        },
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
        }
        // 销毁线标记
        this.$store.state.safeAnalysis.line &&
            this.$store.state.safeAnalysis.line.destroy();
        // 离开后销毁地图
        this.$store.state.safeAnalysis.map &&
            this.$store.state.safeAnalysis.map.destroy();
    },
    created() {
        this.$store.commit("watch/setIsDetailShow", false); // 面板消失

        Object.assign(this, {
            map: null,
            satelliteLayer: null,
        });
    },
    mounted() {
        this.initMap();
    },
    watch: {},
};
</script>

<style></style>
