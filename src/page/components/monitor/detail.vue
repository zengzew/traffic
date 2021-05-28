<template>
  <div id="trailDetail" class="trail-detail">
    <div class="detail-title">
      <p class="detail-title-item-one">{{ detailData.type }}</p>
      <div class="detail-title-item-two">{{ detailData.title }}</div>
      <span class="icon-close" @click="doCloseDetail"></span>
    </div>
    <div class="detail-content">
      <div :class="{ bodyer: !item.used, main_title: true }" v-for="(item, index) in detailTabelData" :key="index">
        <div class="title">{{ item.showname }}</div>
        <div class="cont">{{ getShowValue(item.name) || '' }}</div>
      </div>
      <div class="detail-content-item-three">
        <div>
          <strong class="detail-content-title-four">当前位置</strong>
        </div>
        <span class="font_content">{{ detailData.address }}</span>
        <span class="icon-refresh" @click="getMsgById()"></span>
      </div>
      <div class="detail-check">
        <el-button type="primary" @click="checkTrail">查看轨迹</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
// import mapEnv from '../../../config/envConfig';
import DeviceTypeConfig from '../../../config/deviceType';

export default {
  data() {
    return {
      DeviceTypeConfig,
      carType: '',
      carNum: '',
      carState: '',
      detailData: {},
      carId: '',
      detailTabelData: {}, // 详情面板数据
      extField: null,
    };
  },
  computed: {
    ...mapState({
      car: (state) => state.watch.car,
    }),
  },
  watch: {
    car(val) {
      this.carId = val;
      if (val != '--') {
        this.getMsgById(val);
      }
    },
  },
  mounted() {
    this.getTableData();
    this.tableData = this.tableData1;
    if (this.car && this.car != '--') {
      this.getMsgById(this.car);
    }
  },
  methods: {
    async getMsgById(id) {
      // 通过接口调用数据
      try {
        const resLoc = await this.$API.device.deviceDataByOnlineGet({ deviceid: id || this.carId });
        const resDetail = await this.$API.device.deviceSearchGet({ deviceid: id || this.carId });
        if (resLoc.status === 0 && resDetail.status === 0) {
          if (resLoc.result && resDetail.data) {
            this.detailData = resDetail.data[0];
            this.detailData.lat = resLoc.result[0].lat;
            this.detailData.lng = resLoc.result[0].lng;
            this.extField = this.detailData.ext;
            this.detailData.type = DeviceTypeConfig[this.detailData.type] || '未定义';
            this.geocodeByMapType();
          } else {
            this.detailTabelData = {};
            this.$message({
              message: '暂无此设备，请稍后重试',
              type: 'error',
            });
          }
        } else {
          this.detailTabelData = {};
          this.$message({
            message: '设备查询错误，请稍后重试',
            type: 'error',
          });
        }
      } catch (e) {}
    },
    geocodeByMapType() {
      if (this.$mapEnv.type !== 'pubNet') {
        // 如果是专网版本
        // let urlAddress = `/ws/geocoder/v1?location=${JSON.parse(this.detailData['loc'])['lat']}\,${JSON.parse(this.detailData['loc'])['lng']}`
        //this.$API.GeoUtil.GetAddress_Priv({
          this.$API.GeoUtil.GetAddresss_Pub(
          this.detailData['lat'], this.detailData['lng']
        ).then((response) => {
          if (response.status === 0) {
            // TODO: 接口返回有问题，
            this.detailData.address = response.result.address;
            this.$forceUpdate()
          } else {
            this.detailData.address = '';
            this.$message.error(response.result.message);
          }
        });
      } else {
        // 如果是互联网版本
        /* getAddresss(this.detailData['lat'], this.detailData['lng'])
            .then(result => {
              if(result.status === 0){
                this.detailData['address'] = result['result']['address'];
                this.detailData.type=="1"?this.detailData.type="警车":this.detailData.type="铁骑"
              }else {
                this.detailData.address = "";
              }
            })*/
      }
    },
    doCloseDetail() {
      this.$store.commit('watch/setIsDetailShow', false);
    },
    checkTrail() {
      this.$router.push({
        name: 'trailTable',
        params: { id: this.detailData.title, from: 'detail', starttime: 1552665600, endtime: 1584288000 },
      });
    },
    inputChange(value) {
      this.showTab = !value;
    },
    handleSizeChange(size) {
      this.pagesize = size; // 每页下拉显示数据
    },
    // 数组排序
    compare(property) {
      return function (a, b) {
        return a[property] - b[property];
      };
    },
    // 获取详情顺序数据
    getTableData() {
      let newData = [];
      this.$API.device.allDeviceKeyGet().then((res) => {
        res.data.sort(this.compare('order'));
        newData = res.data;
        newData.forEach((item) => {
          if (item.used == 1) {
            return (item.used = true);
          }
          return (item.used = false);
        });
        this.detailTabelData = newData;
      });
    },
    /** *
     * 根据字段名获取值（考虑拓展字段）
     * @param fieldName
     */
    getShowValue(fieldName) {
      if (Object.keys(this.detailData).length < 1) return;
      // eslint-disable-next-line no-prototype-builtins
      if (this.detailData.hasOwnProperty(fieldName)) {
        return this.detailData[fieldName];
      }
      if (fieldName === 'deviceid') {
        return this.car;
      }
      return this.extField[fieldName];
    },
  },
};
</script>

<style lang="scss">
.trail-detail {
  width: 318px;
  background-color: #fff;
  border-radius: 4px;
  padding: 0 20px 30px;
  position: relative;
  .detail-title-item-one {
    display: inline-block;
    font-family: PingFangSC-Medium;
    font-size: 20px;
    color: #020202;
    letter-spacing: 0;
    line-height: 20px;
    margin-right: 10px;
  }
  .detail-title-item-two {
    display: inline-block;
    word-break: break-word;
    font-family: PingFangSC-Medium;
    font-size: 20px;
    color: #020202;
    letter-spacing: 0;
    line-height: 20px;
    margin-right: 10px;
  }
  .detail-title-item-three {
    float: left;
    font-family: NotoSans-Medium;
    font-size: 12px;
    color: #3d4dda;
    letter-spacing: 0;
    line-height: 19px;
    background: rgba(41, 84, 255, 0.1);
    border-radius: 2px;
    border-radius: 2px;
  }
  .detail-title {
    padding-top: 30px;
    padding-bottom: 40px;
    border-bottom: 1px solid #ebeef5 !important;
    p {
      height: 30px;
      line-height: 30px;
    }
    .icon-close {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 22px;
      height: 22px;
      display: inline-block;
      cursor: pointer;
      background: url('../../../assets/images/ic_close@3x.png');
      background-size: 100% 100%;
    }
  }
  .detail-content {
    margin-top: 15px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #020202;
    text-align: left;
    .bodyer {
      display: none !important;
    }
    .title {
      word-break: break-all;
      width: 82px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      // color: #323442;
      line-height: 14px;
      padding: 3px 0;
      // height:35px;
      // position: absolute;
      // top:0;
    }
    .cont {
      color: #323442;
      width: 191px;
      word-wrap: break-word;
      // padding-top:3px;
      // padding-left:88px;
    }
    .main_title {
      position: relative;
      display: flex;
      // height:30px;
      // line-height: 20px;
      // margin-bottom:10px;
      box-sizing: border-box;
      padding: 3px 0;
    }
    p {
      height: 30px;
      line-height: 30px;

      strong {
        margin-right: 10px;
      }
    }
  }
  .detail-content-item-one {
    height: 24px;
    line-height: 24px;
    display: flex;
    align-items: center;
  }
  .detail-content-type {
    background: rgba(61, 77, 218, 0.1);
    border-radius: 2px;
    border-radius: 2px;
    padding: 4px;
    font-family: NotoSans-Medium;
    font-size: 12px;
    color: #3d4dda;
    letter-spacing: 0;
    line-height: 12px;
    margin-left: 5px;
  }
  .detail-content-title-one {
    margin-right: 3px;
  }
  .detail-content-item-two {
    height: 24px;
    line-height: 24px;
  }
  .detail-content-title-two {
    margin-right: 16px;
  }
  .detail-content-item-three {
    line-height: 24px;
    display: flex;
    margin-bottom: 10px;

    .font_content {
      display: block;
      width: 200px;
      margin-left: 23px;
      padding-right: 10px;
    }
  }
  .icon-refresh {
    width: 20px;
    height: 20px;
    display: inline-block;
    background: url('../../../assets/images/ic_refresh@3x.png');
    background-size: 100% 100%;
    /*margin-left: 6px;*/
    cursor: pointer;
  }
  .detail-content-title-three {
    margin-right: 31px;
  }
  .detail-title-item-img {
    cursor: pointer;
    float: right;
    width: 20px;
  }
  .detail-content-item-four {
    height: 24px;
    // vertical-align: top;
    line-height: 24px;
  }
  .detail-content-title-four {
    margin-right: 3px;
    box-sizing: border-box;
    height: 24px;
  }
  .detail-check {
    text-align: center;
  }
}
</style>
