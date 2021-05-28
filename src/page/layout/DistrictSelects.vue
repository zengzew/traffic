<template>
  <div class="outerBox">
    <el-select v-model="provinceValue" style="width: 100px" size="medium" @change="handleChange">
      <el-option v-for="item in provinceOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-select v-model="cityValue" style="width: 100px" size="medium" @change="cityHandleChange">
      <el-option v-for="item in cityOptions" :key="item.id" :label="item.label" :value="item.id"></el-option>
    </el-select>
    <el-select
      v-model="countyValue"
      style="width: 100px"
      size="medium"
      :show-all-levels="false"
      @change="countyHandleChange"
    >
      <el-option v-for="item in countyOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'DistrictSelects',
  data() {
    return {
      cityLocation: {},
      location: {},
    };
  },
  computed: {
    ...mapState({
      mapLocation: (state) => state.watch.mapLocation,
      provinceOptions: (state) => state.watch.provinceOptions,
      cityOptions: (state) => state.watch.cityOptions,
      countyOptions: (state) => state.watch.countyOptions,
    }),
    provinceValue: {
      get() {
        return this.$store.state.watch.provinceValue;
      },
      set(val) {
        this.$store.commit('watch/setProvinceValue', val);
      },
    },
    cityValue: {
      get() {
        return this.$store.state.watch.cityValue;
      },
      set(val) {
        this.$store.commit('watch/setCityValue', val);
      },
    },
    countyValue: {
      get() {
        return this.$store.state.watch.countyValue;
      },
      set(val) {
        this.$store.commit('watch/setCountyValue', val);
      },
    },
  },
  methods: {
    // 获取省
    getProvinceList() {
      this.$API.GeoUtil.GetProvinceList_Pub().then((res) => {
        if (res.status === 0) {
          // this.hasGetPro = false;
          const provinceArr = [];
          res.result[0].forEach(async (item) => {
            provinceArr.push({
              ...item,
              value: item.id,
              label: item.fullname || item.name,
            });
          });
          this.$store.commit('watch/setProvinceOptions', provinceArr);
        } else {
          const errorWord = res.message
            ? `连接失败，错误代码为：${res.status}；错误信息为：${res.message}`
            : `出现错误，错误为：${res}`;
          throw new Error(errorWord);
        }
      });
    },
    // 省改变
    handleChange(value) {
      this.$store.state.watch.car = '--';
      this.clickedMarker = '--';
      this.$store.state.watch.showDetail = false;
      if (value) {
        if (value === 110000) {
          this.cityValue = '北京市';
          this.countyValue = '';
          this.getCityList(value, 'shi');
        } else if (value === 120000) {
          this.cityValue = '天津市';
          this.countyValue = '';
          this.getCityList(value, 'shi');
        } else if (value === 310000) {
          this.cityValue = '上海市';
          this.countyValue = '';
          this.getCityList(value, 'shi');
        } else if (value === 500000) {
          this.cityValue = '重庆市';
          this.countyValue = '';
          this.getCityList(value, 'shi');
        } else {
          this.cityValue = '';
          this.countyValue = '';
          this.getCityList(value, 'city');
        }
        this.provinceOptions.map((item) => {
          if (item.id === value) {
            this.value = item.label;
            this.provicLocation = item.location;
            this.provicLocation.value = item.label;
            this.provicLocation.id = item.id;
            this.$store.dispatch('watch/getLocaiton', Object.assign({}, this.provicLocation)); // 发出action 改变地点位置
          }
        });
      }
    },
    // 市改变
    cityHandleChange(value) {
      this.$store.state.watch.car = '--';
      this.clickedMarker = '--';

      if (value) {
        this.cityOptions.map((item) => {
          if (item.id === value) {
            (this.cityValue = item.label),
              (this.cityLocation.lat = item.location.lat),
              (this.cityLocation.lng = item.location.lng),
              (this.cityLocation.cityValue = item.label),
              (this.cityLocation.cityId = item.id),
              this.$store.dispatch('watch/getLocaiton', Object.assign({}, this.provicLocation, this.cityLocation)); // 发出action 改变地点位置
          }
        });
        this.countyValue = '';
        this.getCityList(value, 'county');
      }
    },
    // 县改变
    countyHandleChange(value) {
      this.$store.state.watch.car = '--';
      this.clickedMarker = '--';

      this.countyOptions.forEach((item) => {
        if (item.id === value) {
          (this.countyValue = item.label),
            (this.location.lat = item.location.lat),
            (this.location.lng = item.location.lng),
            (this.location.countyId = item.id),
            (this.location.countyValue = item.label);
        }
      });
      this.$store.dispatch(
        'watch/getLocaiton',
        Object.assign({}, this.provicLocation, this.cityLocation, this.location),
      ); // 发出action 改变地点位置
    },
    async getCityList(id, type) {
      if (type === 'city') {
        this.$API.GeoUtil.GetChildren({ id }).then((res) => {
          if (res.status === 0) {
            const cityArr = [];
            res.result[0].forEach(async (item) => {
              cityArr.push({
                ...item,
                label: item.fullname || item.name,
              });
            });
            this.$store.commit('watch/setCityOptions', cityArr);
            // this.cityOptions = cityArr;
          }
        });
      }
      if (type === 'county') {
        this.$API.GeoUtil.GetChildren({ id }).then((res) => {
          if (res.status === 0) {
            const cityArr = [];
            res.result[0].forEach(async (item) => {
              cityArr.push({
                ...item,
                value: item.id,
                label: item.fullname,
              });
            });
            this.$store.commit('watch/setCountyOptions', cityArr);
            // this.countyOptions = cityArr;
          }
        });
      }
      if (type == 'shi') {
        this.$store.commit('watch/setCityOptions', []);
        this.$API.GeoUtil.GetChildren({ id }).then((res) => {
          if (res.status === 0) {
            const cityArr = [];
            res.result[0].forEach(async (item) => {
              cityArr.push({
                ...item,
                value: item.id,
                label: item.fullname,
              });
            });
            this.$store.commit('watch/setCountyOptions', cityArr);
          }
        });
      }
    },
  },
  mounted() {
    this.getProvinceList();
  },
};
</script>

<style scoped>
.outerBox {
  display: inline-block;
}
</style>
