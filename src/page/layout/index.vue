<template>
  <div class="wrapper">
    <template v-if="layout == 'left'">
      <header-bar v-once>
        <p slot="logo">车辆轨迹管理平台</p>
      </header-bar>
      <nav-bar :layout="layout"></nav-bar>
    </template>
    <template v-if="layout == 'top'">
      <header-bar>
        <p slot="logo">车辆轨迹管理平台</p>
        <template slot="topnav">
          <nav-bar :layout="layout"></nav-bar>
        </template>
      </header-bar>
    </template>
    <div class="sys-content" :class="layout">
      <BackNav></BackNav>
      <keep-alive :include="tagNavList" v-if="isRouterAlive" :max="1">
        <router-view></router-view>
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
import HeaderBar from './HeaderBar';
import NavBar from './NavBar';
import TagNav from './TagNav';
import BackNav from './BackNav';
import { mapState } from 'vuex';
import tmap from '@/util/amap';
import { mapList } from '../../router/whiteList';

export default {
  data() {
    return {
      isRouterAlive: false,
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
