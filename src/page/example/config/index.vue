<template>
  <!--<Header-bar>
    <p slot="logo">车辆轨迹管理平台</p>
  </Header-bar>-->
  <div class="configbox">
    <div style="background-color: white; margin-bottom: 20px; height: 100%">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="设备数据库配置" name="first" v-if="isDeviceConfigView || isDeviceConfigEdit">
          <div class="one">
            <div class="header">系统默认字段</div>
            <Default />
          </div>
        </el-tab-pane>
        <el-tab-pane label="轨迹数据库配置" name="second" v-if="isTrackConfigEdit || isTrackConfigView">
          <div class="one">
            <div class="header">系统默认字段</div>
            <TrailDatabaseConfig />
          </div>
        </el-tab-pane>
        <el-tab-pane label="业务数据配置" name="third" v-if="isOrderConfigView || isOrderConfigEdit">
          <div class="one">
            <div class="header">
              <span class="math">1</span> <span class="text_he">为设备详情面板配置显示字段</span>
            </div>
            <Table ref="table"></Table>
          </div>
          <div class="two">
            <div class="header">
              <span class="math1 math">2</span><span class="text_he">设备离线时长</span>
              <!-- <el-select v-model="value" :disabled="!isOrderConfigEdit" size="mini" @change="changeValue">
                <el-option v-for="item in options" :key="item" :label="item" :value="item"> </el-option> </el-select
              >-->
              5 分钟
            </div>
            <!--            <div class="text">可设置1到10分钟，且为整数；超过判断时长，则判断设备离线</div>-->
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Table from './Table.vue';
import Default from './Default.vue';
import TrailDatabaseConfig from './trailDbConfig';
import HeaderBar from './../../layout/HeaderBar';
import { mapGetters, mapState } from 'vuex';

import axios from '@/util/ajax';
export default {
  data() {
    return {
      activeName: 'first',
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      value: '10',
    };
  },
  components: {
    Table,
    Default,
    TrailDatabaseConfig,
    HeaderBar,
  },
  computed: {
    ...mapState({
      nowCounts: (state) => state.watch.nowCounts,
      currentOrder: (state) => state.multiOrder.currentOrder,
    }),
    ...mapGetters({
      configPerms: 'auth/configPerms',
      isDeviceConfigView: 'auth/isDeviceConfigView',
      isDeviceConfigEdit: 'auth/isDeviceConfigEdit',
      isTrackConfigView: 'auth/isTrackConfigView',
      isTrackConfigEdit: 'auth/isTrackConfigEdit',
      isOrderConfigView: 'auth/isOrderConfigView',
      isOrderConfigEdit: 'auth/isOrderConfigEdit',
    }),
    isOrderConfig() {
      return this.isOrderConfigView || this.isOrderConfigEdit;
    },
  },
  watch: {
    // 监听当前业务
    currentOrder: {
      handler() {
        // 前端写死，暂时不配置
        /* this.isOrderConfig &&
          this.$API.CommonConfig.configSearchGet().then((res) => {
            this.value = res.data[0].keyvalue;
            if (this.activeName === 'third') {
              this.$refs.table.getTableData();
            }
          });*/
      },
      deep: true,
    },
  },
  methods: {
    handleClick() {
      if (this.activeName == 'third') {
        this.$refs.table.getTableData();
      }
    },
    changeValue(val) {
      this.value = `${val}`;
      const data = { keyvalue: val };
      /* axios({
                headers: {
                    'Content-Type': 'text/plain'
                },
                url: `${axios.config}/config/api/v1/update`,
                method: 'post',
                data:data
            })*/
      this.$API.CommonConfig.configUpdatePost(data).then((res) => {});
    },
  },
  created() {
    // 获取当前设置时间
    /*    axios({
          headers: {
            "Content-Type": "application/json"
          },
          url: `${axios.config}/config/api/v1/get?reqid=1&reqtime=2&key=test&serviceid=test&keyname=onlinetime`,
          type: "get"
          // data:data
        })*/
    /* this.isOrderConfig &&
      this.$API.CommonConfig.configSearchGet().then((res) => {
        this.value = res.data[0].keyvalue;
      });*/
    !this.configPerms && this.$router.push({ name: 'multiOrder' });
    this.activeName =
      this.isDeviceConfigView || this.isDeviceConfigEdit
        ? 'first'
        : this.isTrackConfigEdit || this.isTrackConfigView
        ? 'second'
        : 'third';
  },
};
</script>

<style lang="scss">
.configbox {
  // height:500px;
  padding: 10px 100px;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  min-width: 1340px;
  height: 100%;
  background-color: #f1f3f7;
  color: #020202;
  .el-tabs__content {
    padding-left: 40px;
    padding-right: 40px;
  }
  .el-tabs__nav {
    padding-left: 40px;
    color: #606275;
  }
  .el-tabs__active-bar {
    margin-left: 63px;
    width: 40px !important;
    background: #0062ff;
  }
  .one,
  .two {
    .text_he {
      padding-left: 30px;
    }
    .header {
      font-family: PingFangSC-Medium;
      font-weight: 500;
      font-size: 16px;
      color: #020202;
      letter-spacing: 0;
      line-height: 20px;
      margin-top: 20px;
      margin-bottom: 15px;
      .math {
        display: inline-block;
        background: rgba(0, 98, 255, 0.1);
        border-radius: 11px;
        width: 22px;
        height: 22px;
        color: #0062ff;
        text-align: center;
        position: absolute;
        left: 40px;
        // margin-left:-25px;
      }
      .math1 {
        margin-top: 3px;
      }
    }
    .text {
      font-family: PingFangSC-Regular;
      font-weight: 400;
      font-size: 14px;
      color: #606275;
      padding-left: 30px;
      margin-bottom: 100px;
      // line-height: 24px;
    }
  }
  .el-tabs__nav-wrap {
    height: 60px;
  }
  .header .el-input {
    width: 60px;
    .el-icon-arrow-up::before {
      content: '\E78F' !important;
    }
    .el-input__inner {
      padding-left: 6px;
      background: #f4f6f9;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      font-size: 14px;
      color: #323442;
    }
  }
  .el-tabs__nav-scroll,
  .el-tabs__nav {
    height: 60px;
    line-height: 60px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    font-size: 14px;
    color: #606275;
    letter-spacing: 0;
    .el-tabs__item {
      color: #606275;
    }
    .is-active {
      color: #0062ff;
      font-weight: 600;
    }
  }
}
</style>
