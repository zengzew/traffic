<template>
    <div class="wrapper">
        <template v-if="layout == 'left'">
            <header-bar v-once>
                <p slot="logo">{{ headerName }}</p>
            </header-bar>
            <nav-bar :layout="layout"></nav-bar>
        </template>
        <template v-if="layout == 'top'">
            <header-bar>
                <!-- <p slot="logo" v-if="$route.name=='select'">AI计算平台</p>
        <p slot="logo" v-else-if="$route.name=='safe'">交通安全分析</p>
        <p slot="logo" v-else>车辆轨迹管理</p> -->
                <p slot="logo">{{ headerName }}</p>
                <template slot="topnav">
                    <nav-bar :layout="layout"></nav-bar>
                </template>
            </header-bar>
        </template>
        <div
            class="sys-content"
            :class="layout"
            :style="$route.name == 'dangerHistory' ? { overflowY: 'auto' } : ''"
        >
            <BackNav></BackNav>
            <!-- <keep-alive :include="tagNavList" v-if="isRouterAlive" :max="1"> -->
            <keep-alive include="dangerHistory"  :max="1">
                <!-- <keep-alive include="dangerHistory"> -->
                <router-view v-if="isRouterAlive"></router-view>
            </keep-alive>
        </div>
        <!--<div class="sys-content" :class = "{'backColor':$route.meta.name == '首页'}">
			&lt;!&ndash; <tag-nav></tag-nav> &ndash;&gt;
			<BackNav></BackNav>
			<keep-alive :include="tagNavList">
				<router-view></router-view>
			</keep-alive>
		</div>-->
    </div>
</template>

<script>
import HeaderBar from "./HeaderBar";
import NavBar from "./NavBar";
import TagNav from "./TagNav";
import BackNav from "./BackNav";
import { mapState } from "vuex";
import tmap from "@/util/amap";
import { mapList } from "../../router/whiteList";

export default {
    data() {
        return {
            isRouterAlive: true,
        };
    },
    computed: {
        ...mapState({
            currentOrder: (state) => state.multiOrder.currentOrder,
        }),
        layout() {
            return this.$store.state.navbarPosition;
        },
        tagNavList() {
            return [this.$store.state.tagNav.cachedPageName];
        },
        headerName() {
            if (this.$route.name === "select") {
                return "交通安全分析";
            } else if (
                this.$route.name === "dangerAnalyze" ||
                this.$route.name === "dangerHistory" ||
                this.$route.name === "trafficAnalyze" ||
                this.$route.name === "dangerPotential"
            ) {
                return "交通安全分析";
            } else {
                return "车辆轨迹管理";
            }
        },
    },
    watch: {
        currentOrder: {
            handler() {
                this.refresh();
            },
            deep: true,
            immediate: true,
        },
        $route() {
            this.refresh();
        },
    },
    components: {
        HeaderBar,
        NavBar,
        TagNav,
        BackNav,
    },
    methods: {
        // 刷新组件
        refresh() {
            this.isRouterAlive = false;
            if (mapList.includes(this.$route.name)) {
                tmap.load(this.$mapEnv, () => {
                    this.$nextTick(() => {
                        this.isRouterAlive = true;
                    });
                });
            } else {
                this.$nextTick(() => {
                    this.isRouterAlive = true;
                });
                tmap.load(this.$mapEnv, () => {});
            }
        },
    },
    mounted() {},
};
</script>
<style lang="scss">
.wrapper {
    min-width: 730px;
    .side-nav {
        .el-menu {
            z-index: 0;
        }
    }
    .sys-header {
        overflow: hidden;
    }
}
</style>
