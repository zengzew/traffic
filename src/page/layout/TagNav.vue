<template>
  <div class="tag-nav">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">{{ navTitle }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ navTitle }}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- <scroll-bar ref="scrollBar">
            <router-link ref="tag" class="tag-nav-item" :class="isActive(item) ? 'cur' : ''" v-for="(item, index) in tagNavList" 
            :to="item.path" :key="index">
                {{item.title}}
                <span class='el-icon-close' @click.prevent.stop="closeTheTag(item, index)"></span>
            </router-link>
        </scroll-bar> -->
  </div>
</template>

<script>
import ScrollBar from 'sysComponents/ScrollBar';
// import { mapState } from 'vuex'

export default {
  data() {
    return {
      defaultPage: '/home',
    };
  },
  computed: {
    navTitle() {
      return this.$route.meta.name;
    },
  },
  mounted() {
    // 首次加载时将默认页面加入缓存
    // this.addTagNav()
  },
  watch: {
    // $route(){
    //     this.addTagNav()
    //     this.scrollToCurTag()
    // }
  },
  methods: {
    addTagNav() {
      // 如果需要缓存则必须使用组件自身的name，而不是router的name
      this.$store.commit('tagNav/addTagNav', {
        name: this.$router.getMatchedComponents()[1].name,
        path: this.$route.path,
        title: this.$route.meta.name,
      });
    },
    isActive(item) {
      return item.path === this.$route.path;
    },
    closeTheTag(item, index) {
      // 当关闭当前页面的Tag时，则自动加载前一个Tag所属的页面
      // 如果没有前一个Tag，则加载默认页面
      this.$store.commit('tagNav/removeTagNav', item);
      if (this.$route.path == item.path) {
        if (index) {
          this.$router.push(this.tagNavList[index - 1].path);
        } else {
          this.$router.push(this.defaultPage);
          if (this.$route.path == '/home') {
            this.addTagNav();
          }
        }
      }
    },
    scrollToCurTag() {
      this.$nextTick(() => {
        for (const item of this.$refs.tag) {
          if (item.to === this.$route.path) {
            this.$refs.scrollBar.scrollToCurTag(item.$el);
            break;
          }
        }
      });
    },
  },
  components: { ScrollBar },
};
</script>
<style>
.el-breadcrumb {
  line-height: 35px;
}
</style>
