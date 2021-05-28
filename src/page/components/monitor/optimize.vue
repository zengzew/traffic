<template>
  <div id="trailOptimize" class="trail-optimize" :class="{ 'optimize-active': isActive }">
    <div class="trail-packup">
      <img class="packup" @click="animat" v-if="isActive" src="~sysStatic/images/map_packup.png" alt="" />
      <img class="packup" @click="animat" v-else src="~sysStatic/images/map_packdown.png" alt="" />
    </div>
    <div class="trail-title">
      <img class="backIcon" @click="comeBack" src="~sysStatic/images/trailActionsImg/icon_back.png" />
      <p class="watch-title-item-two" @click="comeBack">返回</p>
      <p class="watch-title-item-one">{{ carDetail.type }} {{ carDetail.title }}</p>
    </div>
    <template>
      <el-checkbox-group v-model="checkList" class="optimize-choice" size="medium" text-color="#fff">
        <el-checkbox class="police-car" label="优化轨迹"></el-checkbox>
        <div class="better-color"></div>
        <el-checkbox label="原始轨迹"></el-checkbox>
        <div class="origin-color"></div>
      </el-checkbox-group>
    </template>
    <div class="allStartEndTime">{{ allStartEndTime }}</div>
    <template>
      <el-table
        resizable="false"
        :height="tableHeight1"
        highlight-current-row
        ref="multipleTable"
        class="optimize-table"
        @row-click="handleRowChange"
        :data="tableData"
        v-loading="loading"
        element-loading-text="加载中"
        style="width: 100%"
      >
        <el-table-column prop="starttime" :show-overflow-tooltip="true" label="开始时间" align="left">
          <template slot-scope="scope">
            <p class="yearTime">{{ scope.row.starttime | yearFormat }}</p>
            <p class="hourTime">{{ scope.row.starttime | hourFormat }}</p>
            <!-- <p>{{Moment(scope.row.starttime).format('YY-MM-DD')}}</p>
            <p>{{Moment(scope.row.starttime).format('HH-mm-ss')}}</p>-->
          </template>
        </el-table-column>
        <el-table-column prop="endtime" :show-overflow-tooltip="true" label="结束时间" align="left">
          <template slot-scope="scope">
            <p class="yearTime">{{ scope.row.endtime | yearFormat }}</p>
            <p class="hourTime">{{ scope.row.endtime | hourFormat }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="distance" label="里程(km)" width="80" align="center">
          <template slot-scope="scope">
            <p class="hourTime">{{ scope.row.distance | disFormatter }}</p>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="block-pagination" v-if="this.showTab">
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pagesize"
          :pager-count="5"
          layout="slot, prev, pager, next"
          :total="tableDataCount"
        >
          <span>共{{ tableDataCount | pageCount }}条</span>
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';

import amap from '@/util/amap';
import Moment from 'moment';
import DeviceTypeConfig from '../../../config/deviceType';

export default {
  data() {
    return {
      DeviceTypeConfig,
      Moment,
      active: true,
      isActive: true,
      showTab: true,
      restaurants: [],
      checkList: ['优化轨迹', '原始轨迹'],
      carType: '警车',
      carNum: '京A9276',
      tabIndex: '1',
      search: '',
      tableHeight1: '550',
      currentPage: 1,
      pagesize: 10,
      tableDataCount: 0,
      all: 200,
      activeIndex: '1',
      activeIndex2: '1',
      input2: '',
      tableData: [],
      // tableHeight: window.innerHeight - x,
      tableData1: [],
      tableData2: [],
      tableData3: [],
      loading: true,
      hasCurrentTrailLoaded: false,
      hasMapJsLoaded: false,
    };
  },
  watch: {
    checkList() {
      const better = this.checkList.indexOf('优化轨迹');
      const origin = this.checkList.indexOf('原始轨迹');
      if (better !== -1 && origin !== -1) {
        this.toDispatch('both');
      } else if (better == -1 && origin !== -1) {
        this.toDispatch('origin');
      } else if (better !== -1 && origin == -1) {
        this.toDispatch('better');
      } else {
        this.toDispatch('none');
      }
    },
    hasCurrentTrailLoaded() {
      // 监听loading ，数据加载成功则加载表格
      this.$emit('changeShowState', this.hasCurrentTrailLoaded && this.hasMapJsLoaded);
    },
  },
  computed: {
    ...mapState({
      carDetail: (state) => state.watch.carDetail,
      allStartEndTime: (state) =>
        `${Moment(state.watch.carDetail.allstarttime).format('YYYY-MM-DD')} 至 ${Moment(
          state.watch.carDetail.allendtime,
        ).format('YYYY年MM月DD日')}`,
    }),
    // tableData: function() {
    //   this.tableData = this.tableData.filter(data => !this.search || data.name.toLowerCase().includes(this.search.toLowerCase()))
    // }
  },
  filters: {
    yearFormat(value) {
      return Moment(value * 1000).format('YYYY-MM-DD');
    },
    hourFormat(value) {
      return Moment(value * 1000).format('HH:mm:ss');
    },
    /**
     * @Description: 对距离一列格式化，返回公里数据
     * @params
     */
    disFormatter(value) {
      return (value / 1000).toFixed(1);
    },
    pageCount(value) {
      return value > 10000 ? `${Math.floor(value / 10000)}w` : value;
    },
  },
  mounted() {
    this.tableData = this.tableData1;
    setTimeout(() => {
      this.getHeight();
    }, 200);
    window.addEventListener('resize', this.getHeight);
  },
  methods: {
    toDispatch(a) {
      this.$store.dispatch('watch/getTrailType', a);
    },
    getHeight() {
      this.tableHeight = window.innerHeight - 50;
      this.tableHeight1 = 'calc(100vh - 320px)';
    },
    animat() {
      this.isActive = !this.isActive;
    },
    comeBack() {
      // this.$router.push({name:'trailTable', params:{id: this.carDetail.title, from: 'optimize', starttime: this.carDetail.allstarttime, endtime: this.carDetail.allendtime}});
      this.$router.go(-1);
    },
    handleRowChange(i) {
      // 点击新的时间段 轨迹优化恢复原样
      (this.checkList = ['原始轨迹', '优化轨迹']),
        this.$store.dispatch('watch/getTrail', { trackid: i.trackid, deviceid: i.deviceid }).then(() => {});
    },
    inputChange(value) {
      this.showTab = !value;
    },
    querySearch(queryString, cb) {
      const { restaurants } = this;
      const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;

      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
    },
    handleSizeChange(size) {
      this.pagesize = size;
      this.getReadhbaseHistory(); // 每页下拉显示数据
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getReadhbaseHistory(); // 点击第几页
    },
    handleSelect(key) {
      switch (key) {
        case '1': {
          this.tableData = this.tableData1;
          this.tabIndex = '1';
          break;
        }
        case '2': {
          this.tableData = this.tableData2;
          this.tabIndex = '2';
          break;
        }
        case '3': {
          this.tableData = this.tableData3;
          this.tabIndex = '3';
          break;
        }
      }
    },
    async getReadhbaseHistory() {
      /*  let startTime1 = new Date(new Date().toLocaleDateString()).getTime()/1000; // 当天0点   以秒为单位
        let endTime1 = Math.round((new Date(new Date().toLocaleDateString()).getTime() +24 * 60 * 60 - 1)/1000);// 当天23:59
        let yearstart = 1552665600;
        let yearend = 1584288000;*/
      // let url = `/ws/trip_trace/v1/readhbase/history?deviceid=${this.carDetail.id}&starttime=${this.carDetail.starttime}&endtime=${this.carDetail.endtime}&pageindex=${this.currentPage}&pagesize=${this.pagesize}`;
      // 通过接口调用数据
      await this.$API.Trail.trailByDeviceOrderGet({
        deviceid: this.carDetail.id,
        starttime: this.carDetail.starttime,
        endtime: this.carDetail.endtime,
        pageindex: this.currentPage,
        pagesize: this.pagesize,
      }).then((res) => {
        if (res.status === 0) {
          this.hasCurrentTrailLoaded = false;
          this.loading = false;
          const dataArr = [];
          this.tableDataCount = res.result.count;
          res.result.data &&
            res.result.data.forEach((item) => {
              dataArr.push({
                ...item,
                // starttime: formateDate(item.starttime, "YYYY-M-d hh:mm:ss"),
                // endtime: formateDate(item.endtime, "YYYY-M-d hh:mm:ss"),
              });
            });
          this.tableData = dataArr;
          this.$refs.multipleTable.setCurrentRow(this.tableData[0]);
          this.$store
            .dispatch('watch/getTrail', { trackid: this.tableData[0].trackid, deviceid: this.tableData[0].deviceid })
            .then(() => {
              this.loading = false;
              this.hasCurrentTrailLoaded = true;
            });
        } else {
          this.hasCurrentTrailLoaded = false;
          this.loading = false;
          this.$message({
            message: '无相关历史轨迹',
            type: 'error',
          });
        }
      });
    },
  },
  created() {
    // amap.load(() => {
      this.hasMapJsLoaded = true;
      this.getReadhbaseHistory();

      // this.trailChangeCb();
    // });
  },
};
</script>

<style lang="scss" scope>
.optimize-active {
  transform: translateX(380px);
  // transition: .3s;
}
.trail-optimize {
  left: 50px;
  /* height: 598px; */
  width: 320px;
  background-color: #fff;
  border-radius: 4px;
  padding: 0 16px 20px;
  box-shadow: 0 2px 20px 0 rgba(2, 2, 2, 0.1);
  .optimize-choice {
    height: 50px;
    line-height: 50px;
  }
  .el-checkbox {
    float: left;
    font-size: 12px;
  }
  .trail-packup {
    height: 42px;
    width: 42px;
    position: absolute;
    right: -54px;
    cursor: pointer;
  }
  .packup {
    /*left: 200px;*/
    width: 56px;
    margin-top: -7px;
    margin-left: -5px;
  }
  .el-table th {
    background-color: #fafbfc;
  }
  .el-table__header {
    width: 370px !important;
    display: block !important;
  }
  .el-table__body {
    // width: 0 !important;
    table-layout: auto;
    .cell {
      line-height: 16px;
    }
    tr.current-row > td {
      background: rgba(0, 98, 255, 0.1);
    }
  }
  .el-table th,
  .el-table td {
    padding: 8px 0;
  }
  .el-table__empty-block {
    width: 100% !important;
  }
  .watch-title-item-two {
    display: inline-block;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #0062ff;
    letter-spacing: 0;
    line-height: 19px;
    padding-right: 14px;
    cursor: pointer;
  }
  .watch-title-item-one {
    display: inline-block;
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #020202;
    letter-spacing: 0;
    line-height: 18px;
  }
  .origin-color {
    float: left;
    height: 6px;
    width: 20px;
    background-color: #cecece;
    /* margin-left: 50px; */
    position: relative;
    top: 22px;
    left: 9px;
  }
  .trail-title {
    margin-top: 28px;
    margin-bottom: 18px;
  }
  .better-color {
    float: left;
    height: 6px;
    width: 20px;
    background-color: #4e90ff;
    /* margin-left: 50px; */
    position: relative;
    top: 22px;
    left: -21px;
  }
  .el-table--border td {
    border-right: none !important;
  }
  .el-table--border th {
    border-right: none !important;
  }
  .el-table th > .cell {
    padding-right: 6px;
    font-size: 13px;
    color: #606275;
  }
  .el-table {
    width: 370px !important;
    overflow: hidden !important;
  }
  .block-pagination {
    width: 100%;
    position: absolute;
    bottom: 30px;
    left: 0;
    .el-pager {
      li.active {
        color: #000;
      }
      li {
        color: #909399;
      }
    }
  }
  .el-table__row {
    cursor: pointer;
  }
  .block {
    margin: 0 auto;
    text-align: center;
  }
  /deep/.el-checkbox__label {
    font-size: 13px;
  }
  .allStartEndTime {
    color: #606275;
    float: right;
    font-size: 12px;
    margin: 5px 0px;
  }
  .yearTime {
    font-size: 11px;
    color: #606275;
  }
  .hourTime {
    font-family: PingFangSC-Medium;
    font-size: 13px;
    color: #020202;
  }
  .backIcon {
    width: 20px;
    display: inline-block;
    margin-right: -6px;
  }
}
</style>
