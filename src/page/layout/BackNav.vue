<template>
  <div v-if="!backRouterWhiteList.includes($route.name)" class="back-nav">
    <div class="back-nav-router">
      <span class="back-nav-img icon-back" @click="goRouterBack"></span>
      <span class="backText" @click="goRouterBack">返回</span>
      <!--业务名称组件-->
      <span class="configText" v-if="$route.name === 'configuration'"
        >业务配置 /
      </span>
      <span class="back-nav-title">
        <el-select
          v-model="currentOrder"
          value-key="serviceid"
          class="orderSelect"
          size="medium"
          placeholder="请选择业务"
          v-if="!selectOrderList.includes($route.name)"
        >
          <el-option
            v-for="item in orderList"
            :key="item.serviceid"
            :label="item.servicename"
            :value="item"
          >
          </el-option>
        </el-select>
      </span>
    </div>
    <!--行政区域选择组件-->
    <div class="citySelects">
      <DistrictSelects
        v-if="citySelectList.includes($route.name)"
      ></DistrictSelects>
      <div
        v-if="!!this.managePerms & !selectOrderList.includes($route.name)"
        class="manageText"
        @click="gotoManange"
      >
        <span
          ><img
            src="../../../src/assets/images/icon_datamanagement@2x.png"
          />数据管理</span
        >
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import DistrictSelects from "./DistrictSelects";
import {
  backRouterWhiteList,
  citySelectList,
  orderSelectList,
  selectOrderList,
} from "../../router/whiteList";

export default {
  components: {
    DistrictSelects,
  },
  data() {
    return {
      backRouterWhiteList,
      citySelectList,
      orderSelectList,
      selectOrderList,
      defaultPage: "首页",
      value: "北京市",
      cityValue: "北京市",
      countyValue: "东城区",
      options: [],
      cityOptions: [],
      countyOptions: [],
    };
  },
  computed: {
    ...mapState({
      activePage: (state) => state.tagNav.activePage,
      orderList: (state) => state.multiOrder.orderList,
      allPagePermission: (state) => state.auth.allPagePermission,
    }),
    ...mapGetters({
      managePerms: "auth/managePerms",
    }),
    currentOrder: {
      get() {
        return this.$store.state.multiOrder.currentOrder;
      },
      set(val) {
        console.log("val", val);
        // let tmpOrder = this.orderTestUrl.find(item => item.service)
        this.$store.commit("multiOrder/setCurrentOrder", val);
      },
    },
  },
  mounted() {
    console.log(this.$route, this.$router, backRouterWhiteList);
  },
  watch: {
    $route(to) {
      this.$store.state.tagNav.activePage = to.meta.name;
    },
  },
  methods: {
    gotoManange() {
      this.$router.push("/example/dataManage");
    },
    goRouterBack() {
      // this.$router.push({name: 'multiOrder'});
      this.$router.push({ name: "select" });
      // this.$store.state.tagNav.activePage = '首页';
    },
  },
};
</script>
<style lang="less" scoped>
.icon-back {
  background: url("../../assets/images/ic_back@3x.png");
  background-size: 100% 100%;
}

.back-nav {
  position: relative;
  width: 100%;
  height: 48px;
  z-index: 1000;
  padding: 1px 30px;
  // border-bottom: 1px solid #ddd;
  // box-shadow: 0 4px 10px 0 rgba(0, 44, 102, 0.05);
  box-sizing: border-box;
  background-color: #1c2430;
  color: #acbacd;
  .back-nav-router {
    float: left;
    height: 50px;
    line-height: 50px;
    display: flex;
    align-items: center;
    .back-nav-img {
      width: 14px;
      height: 14px;
      display: inline-block;
      cursor: pointer;
    }

    .back-nav-title {
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #6a6b6d;
    }
    .orderSelect {
      width: 130px;
      /deep/ input {
        border: none;
        text-align: right;
      }
      /deep/ .el-icon-arrow-up:before {
        color: black;
        content: "\E78F";
      }
    }
    .backText {
      margin-left: 5px;
      cursor: pointer;
    }
  }
  .back-nav-router :hover {
    color: #00faff;
  }
}
.configText {
  margin-left: 60px;
}
.citySelects {
  float: right;
  height: 50px;
  line-height: 50px;

  /deep/ input {
    border: none;
  }

  /deep/ .el-icon-arrow-up:before {
    color: black;
    content: "\E78F";
  }
}

.manageText {
  float: right;
  margin-left: 40px;
  cursor: pointer;

  img {
    width: 20px;
    vertical-align: middle;
    margin-right: 4px;
  }
}
</style>
