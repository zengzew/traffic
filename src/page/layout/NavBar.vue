<template>
  <div class="side-nav" :class="layout">
    <el-menu
      router
      ref="navbar"
      :default-active="defActive"
      :mode="navMode"
      v-if="isAllNavShow()"
      menu-trigger="click"
      @select="selectMenu"
      @open="openMenu"
      @close="closeMenu"
      unique-opened
    >
      <nav-bar-item v-for="(item, n) in navList" :item="item" :navIndex="String(n)" :key="n"></nav-bar-item>
    </el-menu>
    <div v-if="this.navMode === 'horizontal'" v-show="navBgShow" class="full-screen-navBg" @click.self="closeAll"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import NavBarItem from './NavBarItem';

export default {
  data() {
    return {
      navBgShow: false,
    };
  },
  props: ['layout'],
  computed: {
    ...mapState({
      navList: (state) => state.auth.navList,
    }),
    defActive() {
      // 对轨迹实时回放页面做特殊处理，
      const tmpRouter = this.$route.path === '/trail' ? '/example/table' : this.$route.path;
      return tmpRouter;
    },
    navMode() {
      if (this.layout == 'left') {
        return 'vertical';
      }
      if (this.layout == 'top') {
        return 'horizontal';
      }
    },
    isDark() {
      return this.$store.state.theme.indexOf('dark') >= 0 ? 'dark' : 'light';
    },
  },
  watch: {
    // 当通过TagNav来激活页面时也执行一次selectMenu
    $route() {
      // let path = this.$route.path
      // let indexPath = this.$refs.navbar.items[path].indexPath
      // this.selectMenu(path, indexPath)
      //  this.$store.commit("tagNav/navTitle", {
      //     name: this.$route.meta['name'],
      // })
    },
  },
  methods: {
    // eslint-disable-next-line
        selectMenu(index, indexPath){
      /**
       * 在选择父级菜单时自动关闭其下所有子菜单
       * 选择时获取点击菜单的父级index，并计算得到该index在已打开菜单中的索引值，
       * 关闭位于当前打开菜单中该索引值之后的全部菜单
       */
      const { openedMenus } = this.$refs.navbar;
      let openMenuList;
      // 如果点击的是二级菜单，则获取其后已经打开的菜单
      if (indexPath.length > 1) {
        const parentPath = indexPath[indexPath.length - 2];
        openMenuList = openedMenus.slice(openedMenus.indexOf(parentPath) + 1);
      } else {
        openMenuList = openedMenus;
      }

      // 关闭菜单
      openMenuList = openMenuList.reverse();
      openMenuList.forEach((ele) => {
        this.$refs.navbar.closeMenu(ele);
      });
      if (this.navMode == 'horizontal') {
        this.navBgShow = false;
      }
    },
    isAllNavShow() {
      const pathArr = this.navList.map((item) => item.path);
      // 轨迹回访页面属于轨迹查询子页面，特殊处理
      return pathArr.includes(this.$route.path) || this.$route.path === '/trail';
    },
    openMenu() {
      if (this.navMode == 'horizontal') {
        this.navBgShow = true;
      }
    },
    closeMenu() {
      if (this.navMode == 'horizontal') {
        this.navBgShow = false;
      }
    },
    closeAll() {
      let openMenu = this.$refs.navbar.openedMenus.concat([]);
      openMenu = openMenu.reverse();
      openMenu.forEach((ele) => {
        this.$refs.navbar.closeMenu(ele);
      });
      if (this.navMode == 'horizontal') {
        this.navBgShow = false;
      }
    },
  },
  components: { NavBarItem },
};
</script>
