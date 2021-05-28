<template>
  <div class="box">
    <el-table :data="tableData" style="width: 320px" :header-cell-style="headerStyle" width="320px">
      <el-table-column align="center" width="50">
        <template slot-scope="scope" v-if="isOrderConfigEdit">
          <el-checkbox
            v-model="scope.row.used"
            @change="handleChange(scope.row)"
            :disabled="scope.row.showname == '当前位置'"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="字段名称" align="left">
        <template slot-scope="scope" class="showname">{{ scope.row.showname }}</template>
      </el-table-column>
      <el-table-column label="调整顺序" v-if="isOrderConfigEdit" width="120" align="center">
        <template slot-scope="scope">
          <span class="updown" v-if="scope.$index < tableData.length - 1">
            <img :src="scope.$index == 0 ? upgray : upblue" @click="handleTop(scope.$index, scope.row)" />
            <img
              :src="scope.$index == tableData.length - 2 ? downgray : downblue"
              @click="handleBottom(scope.$index, scope.row)"
            />
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="card">
      <div class="headers">详情面板预览效果</div>
      <div class="main">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>设备ID</span>
            <el-button
              style="float: right; padding: 15px 0; fontsize: 20px"
              type="text"
              class="el-icon-close"
            ></el-button>
          </div>
          <div
            :class="{ bodyerConfig: !item.used, main_title: true }"
            v-for="(item, index) in tableData"
            :key="index"
            style="textalign: top"
          >
            <span class="title">{{ item.showname }}</span>
            <span class="cont">{{ item.value }}</span>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import upgray from './../../../assets/images/up_gray@2x.png';
import upblue from './../../../assets/images/up_blue@2x.png';
import downgray from './../../../assets/images/down_gray@2x.png';
import downblue from './../../../assets/images/down_blue@2x.png';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      upgray,
      upblue,
      downblue,
      downgray,
      tableData: [],
    };
  },
  computed: {
    ...mapGetters({
      isOrderConfigView: 'auth/isOrderConfigView',
      isOrderConfigEdit: 'auth/isOrderConfigEdit',
    }),
  },
  methods: {
    handleTop(index, row) {
      if (index > 0) {
        const upDate = this.tableData[index - 1];
        this.tableData.splice(index - 1, 1);
        this.tableData.splice(index, 0, upDate);
        this.exChange(index, 'up');
      } else {
        return false;
      }
    },
    handleBottom(index, row) {
      if (index === this.tableData.length - 2) {
        return false;
      }
      const downDate = this.tableData[index + 1];
      this.tableData.splice(index + 1, 1);
      this.tableData.splice(index, 0, downDate);
      this.exChange(index, 'down');
    },
    headerStyle() {
      return 'background:#F4F6F9;color:#323442;height:40px;';
    },
    // 是否选择
    handleChange(val) {
      let isTrue;
      let data;
      val.used == true ? (isTrue = 1) : (isTrue = 0);
      const { name } = val;
      data = {
        name,
        used: isTrue,
      };
      /* axios({
        headers: {
          "Content-Type": "text/plain"
        },
        url: `${axios.config}/track/v1/device-config/set-used`,
        method: "post",
        data
      })*/
      this.$API.device.deviceConfigUsedPost(data).then((res) => {});
    },
    // 换顺序
    exChange(index, val) {
      let data = {};
      if (val == 'up') {
        data = {
          reqtime: 1,
          name1: this.tableData[index].name,
          name2: this.tableData[index - 1].name,
        };
      } else {
        data = {
          reqtime: 2,
          name1: this.tableData[index].name,
          name2: this.tableData[index + 1].name,
        };
      }

      /* axios({
        // headers: {
        //     'Content-Type': 'text/plain; charset=utf-8'
        // },
        headers: {
          "Content-Type": "text/plain"
        },
        url: `${axios.config}/track/v1/device-config/exchange`,
        method: "post",
        data
      })*/
      this.$API.device.deviceConfigExchangePost(data).then((res) => {});
    },
    // 数组排序
    compare(property) {
      return function (a, b) {
        const value1 = a[property];
        const value2 = b[property];
        return value1 - value2;
      };
    },
    // 获取表格数据
    getTableData() {
      let newData = [];
      // 初始表格数据
      /* axios({
        headers: {
          "Content-Type": "application/json"
        },
        url: `${axios.config}/device_config/api/v1/get_default?key=1&serviceid=1&reqid=1&reqtime=1`,
        type: "get"
        // data:data
      })*/
      this.$API.device.allDeviceKeyGet().then((res) => {
        res.data.sort(this.compare('order'));
        const data = {
          showname: '当前位置',
          used: true,
          value: '海淀区昆明湖东路南8号畅春园东',
          name: 'address',
        };
        res.data.push(data);
        newData = res.data;
        newData.forEach((item) => {
          switch (item.name) {
            case 'deviceid':
              item.value = 'ID5684';
              break;
            case 'type':
              item.value = '警车';
              break;
            case 'department':
              item.value = '腾讯';
              break;
            case 'user':
              item.value = '警56854';
              break;
            case 'speed':
              item.value = '35km/h';
              break;
            case 'address':
              item.value = item.value;
              break;
            default:
              item.value = data.comment;
              break;
          }
          if (item.used == 1) {
            return (item.used = true);
          }
          return (item.used = false);
        });
        this.tableData = newData;
      });
    },
  },
  mounted() {
    this.getTableData();
  },
};
</script>
<style lang="scss">
.box {
  display: flex;
  width: 700px;
  .bodyerConfig {
    display: none !important;
  }
  .title {
    display: block;
    width: 82px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #323442;
    line-height: 14px;
    padding: 3px 0;
    word-break: break-word;
  }
  .cont {
    color: #020202;
    display: block;
    width: 191px;
    font-weight: 500;
  }
  .updown {
    color: #0062ff;
    img {
      padding-top: 3px;
      width: 10px;
      height: 17px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }

  .main_title {
    font-weight: 500;
    display: flex;
    padding: 3px 0;
  }
  th {
    height: 40px;

    padding: 0px !important;
  }
  .el-table th > .cell {
    font-weight: 500;
    color: #323442;
  }
  .el-table .cell {
    font-weight: 500;
    color: #020202;
  }
  .bule {
    color: #ccc;
  }
  .card {
    width: 360px;
    // height:328px;
    position: relative;
    // top:-20px;
    background: url('./../../../assets/images/map@2x.png');
  }

  .headers {
    height: 40px;
    font-weight: 500;
    background: #f4f6f9;
    color: #323442;
    line-height: 40px;
    font-size: 14px;
    padding-left: 40px;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background: #0062ff;
    // border-color:#0062ff;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background: #f2f6fc;
  }
  .el-card__header {
    font-weight: 500;
    padding: 5px 20px !important;
    height: 53px;
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #020202;
    line-height: 53px;
  }
  .el-card__body {
    padding: 10px 15px 15px 20px;
  }
  .main {
    font-size: 14px;
    text-align: left;
    width: 320px;
    // height:226px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
