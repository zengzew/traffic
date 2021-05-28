<template>
  <div style="height: 100%">
    <Map ref="mapBox"></Map>
    <div class="infoBoard">
      <div class="topHeader">
        <div class="settingProp">
          <span class="labelSpan">省份</span>
          <el-select
            class="selectBox"
            width="70px"
            popper-class="selectPop"
            size="small"
            v-model="proVal"
            filterable
            placeholder="请选择"
            @change="proChange"
          >
            <el-option v-for="item in provinceOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="settingProp">
          <span class="labelSpan">城市</span>
          <el-select
            class="selectBox"
            width="70px"
            popper-class="selectPop"
            size="small"
            v-model="cityVal"
            filterable
            placeholder="请选择"
            @change="cityChange"
          >
            <el-option v-for="item in cityOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="settingProp">
          <span class="labelSpan">选择时间</span>
          <el-date-picker
            class="datePicker"
            popper-class="datePop"
            size="small"
            :clearable="false"
            v-model="dateVal"
            value-format="timestamp"
            type="date"
            :picker-options="pickerOptions"
            :default-value="Date.now()"
            placeholder="选择日期"
            @change="dateChange"
          >
          </el-date-picker>
          <i class="el-icon-arrow-down timeIconDown"></i>
        </div>
        <div class="settingProp">
          <span class="labelSpan">设备类型</span>
          <el-select
            class="selectBox"
            width="40px"
            popper-class="selectPop"
            size="small"
            v-model="deviceType"
            filterable
            placeholder="请选择"
            @change="deviceTypeChange"
          >
            <el-option v-for="item in deviceTypeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="chartsBoard">
      <div class="trailCountBox">
        <span>轨迹点数（个）</span>
        <div>{{ trailCount.toLocaleString() }}</div>
      </div>
      <RankList class="rankListBox" :tableData="trailByAdcode" :allCount="trailCount"></RankList>
      <TrailDistribution class="trailDistribution"></TrailDistribution>
    </div>
    <Replay></Replay>
    <!--    <LbsTimeline></LbsTimeline>-->
  </div>
</template>

<script>
import Map from './map';
import RankList from './rankList';
import TrailDistribution from './trailDistribution';
import API from '@/util/apiV1';
import Replay from './replay';
import { mapState, mapMutations } from 'vuex';
import LbsTimeline from './lbsTimeline';

export default {
  name: 'thermalAnalysis',
  components: {
    LbsTimeline,
    Replay,
    Map,
    RankList,
    TrailDistribution,
  },
  data() {
    return {
      // dateVal: 1598946000000,
      provinceOptions: [], // 省级选项
      proVal: '',
      cityOptions: [], // 市级选项
      // cityVal: '',
      cityArr: [],
      countyArr: [],
      // deviceType: 0,
      deviceTypeOptions: [
        {
          value: 0,
          label: '全部',
        },
        {
          value: 1,
          label: '警车',
        },
        {
          value: 2,
          label: '铁骑',
        },
      ],
      trailCount: 0,
      trailByAdcode: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        cellClassName(time) {
          if (time.getTime() > Date.now()) {
            return 'disabledTime';
          }
          return 'selectedTime';
        },
      },
    };
  },
  computed: {
    dateVal: {
      get() {
        return this.$store.state.heatAnalysis.dateVal;
      },
      set(value) {
        this.setDateVal(value);
      },
    },
    cityVal: {
      get() {
        return this.$store.state.heatAnalysis.cityVal;
      },
      set(value) {
        this.setCityVal(value);
      },
    },
    deviceType: {
      get() {
        return this.$store.state.heatAnalysis.deviceType;
      },
      set(value) {
        this.setDeviceType(value);
      },
    },
  },
  async created() {
    await this.getAdList();
    this.getTrailCount();
  },
  watch: {
    proVal(val) {
      this.proChange(val);
    },
    cityVal(val) {
      const tmpCityItem = this.cityOptions.filter((item) => item.value === val)[0];
      tmpCityItem && this.$refs.mapBox.cityChangeCb(tmpCityItem.location);
      this.getTrailCount();
    },
    dateVal() {
      this.getTrailCount();
    },
    deviceType() {
      this.getTrailCount();
    },
  },
  methods: {
    ...mapMutations({
      setCityVal: 'heatAnalysis/setCityVal',
      setDateVal: 'heatAnalysis/setDateVal',
      setDeviceType: 'heatAnalysis/setDeviceType',
    }),
    proChange(val) {
      if (['110000', '120000', '310000', '500000'].indexOf(val) > -1) {
        const tmpCityOptions = this.provinceOptions.filter((item) => item.value === val)[0];
        this.cityOptions = [tmpCityOptions];
        // this.cityVal = tmpCityOptions.value;
        this.setCityVal(tmpCityOptions.value);
      } else {
        const tmpProObj = this.provinceOptions.filter((item) => item.value === val)[0];
        const tmpCities = this.cityArr.slice(tmpProObj.cidx[0], tmpProObj.cidx[1] + 1);

        this.cityOptions = tmpCities.map((item) => ({
          label: item.fullname,
          value: item.id,
          location: item.location,
        }));
        this.setCityVal(tmpCities[0].id);
      }
    },
    cityChange(val) {
      const tmpCityItem = this.cityOptions.filter((item) => item.value === val)[0];
      tmpCityItem && this.$refs.mapBox.cityChangeCb(tmpCityItem.location);
      this.setCityVal(val);
    },
    dateChange(val) {
      this.setDateVal(val);
    },
    deviceTypeChange(val) {
      this.setDeviceType(val);
    },
    // 获取行政数据
    async getAdList() {
      await API.heatAnalysis
        .adNameGet()
        .then((res) => {
          if (res.status === 0) {
            const provinces = res.result[0]; // 省/直辖市数据
            if (provinces) {
              this.provinceOptions = provinces.map((item) => ({
                label: item.fullname,
                value: item.id,
                location: item.location,
                cidx: item.cidx,
              }));
              this.proVal = this.provinceOptions[0].value;
            }
            this.cityArr = res.result[1]; // 市级数据
            this.countyArr = res.result[2]; // 区级数据
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        })
        .catch((error) => {
          // TODO： 错误处理接口如何封装
          this.$message({
            type: 'error',
            message: `行政区划请求错误${error}`,
          });
        });
    },
    // 获取轨迹数量
    getTrailCount() {
      API.heatAnalysis
        .trailInAdsGet({
          adcode: this.cityVal,
          time: this.dateVal / 1000,
          type: this.deviceType,
        })
        .then((res) => {
          if (res.status === 0 && res.datas) {
            this.trailCount = res.count;
            let tmpFilterArr = [];
            if (['110000', '120000', '310000', '500000'].indexOf(this.cityVal) > -1) {
              tmpFilterArr = [...this.cityArr];
            } else {
              tmpFilterArr = [...this.countyArr];
            }

            this.trailByAdcode = res.datas.map((item) => {
              const tmpName = tmpFilterArr.filter((item1) => item1.id === item.adcode)[0];
              return {
                name: tmpName ? tmpName.fullname : '',
                ...item,
              };
            });
          } else {
            this.trailCount = 0;
            this.trailByAdcode = [];
          }
        })
        .catch((err) => {});
    },
  },
};
</script>

<style scoped lang="scss">
.infoBoard {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-width: 1340px;
  .topHeader {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #22253a;

    .settingProp {
      display: inline-block;
      margin: 0 10px 0 30px;
      position: relative;
      /deep/ .selectBox {
        width: 100px;
        input {
          color: #f0f3f7;
          border: none;
          background-color: #22253a;
        }
      }

      /deep/ .datePicker {
        width: 140px;
        cursor: pointer;
        input {
          color: #f0f3f7;
          border: none;
          background-color: #22253a;
        }

        button {
          color: white;
        }
      }
      .timeIconDown {
        position: absolute;
        right: 10px;
        top: 50%;
        color: #909399;
        pointer-events: none;
        transform: translateY(-50%);
        cursor: pointer;
      }
    }
  }
}
.trailCountBox {
  box-sizing: border-box;
  padding: 10px 20px;
  margin-top: 10px;
  width: 340px;
  background-color: #22253a;
  border-radius: 2px;
  span {
    font-size: 16px;
    margin-top: 16px;
    font-weight: 600;
  }
  div {
    font-size: 30px;
    color: #4778ff;
    letter-spacing: 0;
    line-height: 30px;
    font-weight: bold;
    margin-top: 12px;
    width: 340px;
    /*font-family: DINPro-Bold;*/
  }
}
.trailDistribution {
  width: 340px;
  height: 282px;
  margin-top: 10px;
  box-sizing: border-box;
  padding: 16px 0 16px 16px;
  background-color: #22253a;
}
.chartsBoard {
  position: absolute;
  top: 40px;
  left: 10px;
  bottom: 20px;
  display: flex;
  flex-direction: column;
}
.labelSpan {
  color: #9d9fad;
}
</style>
<style lang="scss">
.selectPop {
  border: none;
  background-color: #22253a;
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}

.datePop {
  background-color: #22253a;
  border: none;
  .el-picker-panel__icon-btn {
    color: #fff;
  }
}
.disabledTime {
  div {
    background-color: transparent !important;
    color: #606266 !important;
  }
}
.selectedTime {
  div {
    color: #fff;
  }
}
</style>
