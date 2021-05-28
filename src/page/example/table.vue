<template>
  <div class="sys-page">
    <app-title class="screen-title" title="筛选查询"></app-title>
    <!-- 搜索 -->
    <app-search class="screen-search">
      <el-form :inline="true" :model="searchForm" ref="searchForm">
        <el-form-item prop="text">
          <p>车牌号</p>
          <!--          <el-input v-model="searchForm.text" placeholder="请输入车牌号"></el-input>-->
          <el-autocomplete
            v-model="searchForm.text"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入车牌号"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item prop="time">
          <p>时间选择</p>
          <el-date-picker
            v-model="searchForm.time"
            unclearable
            type="daterange"
            range-separator="-"
            start-placeholder="请选择时间"
            end-placeholder=""
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
          <!-- <el-date-picker
           v-model="searchForm.time" 
           type="date" 
           placeholder="请选择时间">
           </el-date-picker> -->
        </el-form-item>
        <el-form-item>
          <el-button class="screen-rest-button" plain @click="restForm('searchForm')" id="rest">重置</el-button>
          <el-button type="primary" class="screen-search-button" @click="search" id="search">查询</el-button>
        </el-form-item>
      </el-form>
    </app-search>
    <!-- 表格体 -->
    <table-mixin class="-----" pagination paginationAlign="center">
      <el-table
        v-loading="tableData.loading"
        :data="tableList"
        class="customTable"
        border
        :default-sort="{ prop: 'date', order: 'descending' }"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column prop="title" label="车牌号" width="160" align="center"></el-table-column>
        <el-table-column
          prop="type"
          label="车辆类别"
          width="120"
          align="center"
          :render-header="(h) => renderTypeHeader(h)"
        ></el-table-column>
        <!-- <el-table-column prop="online" label="车辆状态" width="120" align="center" :render-header="(h) => renderStatusHeader(h)" -->
        <!-- ></el-table-column> -->
        <el-table-column prop="distance" label="轨迹里程" align="center"></el-table-column>
        <el-table-column prop="order_count" label="轨迹条数" align="center"></el-table-column>
        <el-table-column prop="starttime" label="开始时间" align="center"></el-table-column>
        <el-table-column prop="endtime" label="结束时间" align="center"></el-table-column>
        <!-- <el-table-column prop= 'name' type="name" label="aaa" width="124" align="" :render-header="(h) => renderTypeHeader(h)"></el-table-column> -->
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <!-- <el-button class="check-button" v-if="scope.row.operation.indexOf('edit') >= 0" type="text" size="small">查看</el-button> -->
            <el-button
              class="check-button"
              type="text"
              size="middle"
              @click.native.prevent="handleLook(scope.$index, scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </table-mixin>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import { formateDate } from '../../util/method';
import { getTypeOption } from '../../config/deviceType';

const startTime1 = '';
const endTime1 = '';
export default {
  name: 'exampleTable',
  data() {
    return {
      // typeValue：'',
      starttime: new Date(new Date(new Date().toLocaleDateString()).getTime()),
      endtime: new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1),
      totalcount: 0,
      nameA: '车辆类别',
      typeFilter: getTypeOption(), // 设备过滤器
      searchForm: {
        time: [startTime1, endTime1],
        type: '',
        text: '',
      },
      originTableData: [],
      tableData: {
        loading: true,
        body: [],
      },
      chooseHead: {
        receiveType: '',
        procedureStamp: '',
      },
      pageind: 1,
      tableListTyle: '0',
      disabled: false,
    };
  },
  mounted() {
    // this.restForm(this.searchForm) // 重置
    this.searchForm.time = [
      new Date(new Date(new Date().toLocaleDateString()).getTime()),
      new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1),
    ]; // 当天0-24点的时间
    if (this.$route.params.from == 'detail') {
      this.$store.dispatch('tableData/getTableCount', 1);
      // this.searchForm.time = [new Date(new Date(new Date().toLocaleDateString()).getTime()), new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1)]   // 当天0-24点的时间
      this.searchForm.text = this.$route.params.id;
      this.search();
    } else if (this.$route.params.from == 'optimize') {
      this.$store.dispatch('tableData/getTableCount', 1);
      this.searchForm.time = [this.carDetail.allstarttime, this.carDetail.allendtime];
      this.searchForm.text = this.$route.params.id;
      this.search();
    } else {
      this.getTableData(this.pagesize, this.pageind);
    }
  },
  watch: {
    pageindex(val) {
      this.pageind = val;
      this.getTableData(this.pagesize, val);
    },
  },
  computed: {
    ...mapState({
      tableList: (state) => state.tableData.tableList,
      tableCount: (state) => state.tableData.tableCount,
      pagesize: (state) => state.tableData.pagesize,
      pageindex: (state) => state.tableData.pageindex,
      carDetail: (state) => state.watch.carDetail,
    }),
  },
  methods: {
    ...mapActions({
      // historyDataGet: "user/historyDataGet"
    }),
    handleCommand(command) {
      this.$message(`click on item ${command}`);
    },
    renderTypeHeader(h) {
      return h(
        'el-select',
        {
          // el-select实现下拉框
          on: {
            input: (value) => {
              // 随着下拉框的不同，文字框里的内容改变
              this.nameA = value;
              change: this.changeTyle(value); // 文字框里的内容 change事件
            },
          },
          props: {
            value: this.nameA, // 文字框的内容取决于这个value
          },
        },
        [
          // 下拉框里面填充选项，通过map遍历filters，为每一个选项赋值。
          this.typeFilter.map((item) =>
            h('el-option', {
              props: {
                value: item.value,
                label: item.label,
              },
            }),
          ),
        ],
      );
    },
    querySearchAsync(queryString, cb) {
      // TODO: 模糊查询
      queryString &&
        this.$API.device.fuzzySearchGet({ title: queryString }).then((res) => {
          if (res.message === 'success') {
            const showData = res.data.map((val) => ({ value: val.title }));
            cb(showData);
          } else {
            cb([]);
          }
        });
    },
    setTimeShow(data) {
      // let nowTime = data;
      let thisTime = data;
      thisTime = thisTime.replace(/-/g, '/');
      let time = new Date(thisTime);
      time = time.getTime() / 1000;
      return time;
    },
    handleLook(index, row) {
      this.$store.dispatch('watch/getCarDetail', {
        ...row,
        id: row.deviceid,
        allstarttime: this.searchForm.time[0] || '',
        allendtime: this.searchForm.time[1] || '',
        starttime: this.setTimeShow(row.starttime),
        endtime: this.setTimeShow(row.endtime),
      });
      this.$router.push('/trail');
    },
    // 获取table数据
    getTableData(size, index, deviceid, deviceType) {
      console.log(this.searchForm.time);
      this.$API.Trail.trailAllIdGet({
        starttime: this.searchForm.time ? new Date(this.searchForm.time[0]) / 1000 : '',
        endtime: this.searchForm.time ? Math.round(new Date(this.searchForm.time[1]) / 1000) : '',
        pagesize: size,
        pageindex: index,
        deviceid,
        type: deviceType,
      })
        .then((res) => {
          this.tableData.loading = false;
          if (res.status === 0) {
            const newArr = [];
            const counts = res.totalcount ? res.totalcount : 0;
            this.$store.dispatch('tableData/getTableCount', counts);
            res.data &&
              res.data.forEach((item) => {
                newArr.push({
                  ...item,
                  online: item.online === 1 ? '在线' : '离线',
                  type: item.type === 1 ? '警车' : '铁骑', // 需要修改有9种类别
                  starttime: formateDate(item.starttime, 'YYYY-M-d hh:mm:ss'),
                  endtime: formateDate(item.endtime, 'YYYY-M-d hh:mm:ss'),
                });
              });
            this.$store.dispatch('tableData/getTableList', newArr);
          } else {
          }
        })
        .catch((err) => {
          // this.$message.error(`获取数据失败`)
          setTimeout(() => {
            this.tableData.loading = false;
          }, 1000);
        });
    },
    changeTyle(item) {
      this.searchForm.text = ''; // 清空搜索框
      this.getTableData(this.pagesize, 1, null, item);
    },

    restForm(searchForm) {
      this.$nextTick(() => {
        if (this.$refs[searchForm] !== undefined) {
          this.$refs[searchForm].resetFields();
          this.searchForm.time = [
            new Date(new Date(new Date().toLocaleDateString()).getTime()),
            new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1),
          ]; // 当天0-24点的时间
          this.$store.dispatch('tableData/getPageindex', 1);
          this.getTableData();
          window.document.getElementById('rest').blur();
        }
      });
    },
    // DEVICE3255
    async search() {
      this.tableData.loading = true;
      let deviceId = '';
      this.nameA = '车辆类别';
      try {
        if (this.searchForm.text) {
          const res = await this.$API.device.deviceSearchGet({
            title: this.searchForm.text ? this.searchForm.text : '',
          });
          if (res.status === 0 && res.data.length) {
            deviceId = res.data[0].id;
            this.getTableData(10, 1, deviceId);
          } else {
            this.tableData.loading = false;
            // 查询错误或数据为空时清空
            this.$store.commit('tableData/setTableCount', 0);
            this.$store.commit('tableData/setTableList', []);
          }
        } else {
          this.getTableData(10, 1, deviceId);
        }
      } catch (e) {
        // 传输错误时 改变loading状态
        this.tableData.loading = false;
      }

      /* await this.$API.device.deviceSearchGet({
            title: this.searchForm['text'] ? this.searchForm['text'] : ""
          })
          .then(res => {
            if (res.status === 0) {
              if(res['data']){
                   resolve(res['data'][0]['id'])  //状态由等待变为成功，传的参数作为then函数中成功函数的实参
              } else {
                if (this.searchForm['text'] == '') {
                  resolve('')  //状态由等待变为成功，传的参数作为then函数中成功函数的实参
                } else {
                  reject('失败')  //状态由等待变为失败，传的参数作为then函数中失败函数的实参this.showTab = value ? false: true;
                }
              }
            }
          });*/
      /* await this.$API.Trail.trailAllIdGet({
           starttime: this.searchForm["time"]
             ? new Date(this.searchForm.time[0]) / 1000
             : "",
           endtime: this.searchForm["time"]
             ? Math.round(new Date(this.searchForm.time[1]) / 1000) + 86400
             : "",
           deviceid: data ? data : ""
         })
         .then(res => {
          if (res.status === 0 && res.data) {
            let dataArr = [];
            // this.totalcount = res['totalcount'];~
            this.$store.dispatch('tableData/getPageindex', 1);
            this.$store.dispatch('tableData/getTableCount', res['totalcount']);
            this.tableData.loading = false;
            res.data.forEach(item => {
              dataArr.push({
                ...item,
                online: item.online === 1 ? "在线" : "离线",
                type: item.type === 2 ? "铁骑" : "警车", //需要修改有9种类别
                starttime: formateDate(item.starttime, "YYYY-M-d hh:mm:ss"),
                endtime: formateDate(item.endtime, "YYYY-M-d hh:mm:ss")
              });
            });
            this.$store.dispatch('tableData/getTableList', dataArr)
            this.disabled=false;
            window.document.getElementById("search").blur();
            // 请求成功后对所在页面进行缓存
            this.$store.commit("tagNav/addTagNav", {
            name: 'exampleTable',
            })
            // this.$store.dispatch('tableData/getTableCount', res.count)
            // this.tableData.body = dataArr;
					} else if(res.status === 1002){
						this.$message({
								message: '缺少必填参数',
								type: 'warning'
						});
					}
					else {
            this.$store.dispatch('tableData/getTableCount', 1);
						this.$message({
								message: '查询无结果',
								type: 'warning'
						});
            this.tableData.loading = false;

            // this.tableData.body = [];
            this.$store.dispatch('tableData/getTableList', [])
          }
        })
        .catch(err => {
          setTimeout(() => {
            this.tableData.loading = false;
          }, 2000);
          // this.$message.error(`获取数据失败，失败码：${err.response.status}`)
        });*/
      /* }).catch(err => {
          this.$message({
          message: '查询无结果',
          type: 'warning'
          });
          this.tableData.loading = false;
      })*/
    },
  },
  beforeRouteLeave(to, from, next) {
    if (to.path == '/trail') {
      this.$store.commit('tagNav/addTagNav', {
        name: 'exampleTable',
        path: this.$route.path,
        title: this.$route.meta.name,
      });
    } else {
      this.$store.commit('tagNav/addTagNav', {
        name: '',
        path: this.$route.path,
        title: this.$route.meta.name,
      });
    }
    next();
  },
  created() {
    // this.getTableData(this.pagesize, this.pageind);
  },
};
</script>
<style lang="scss">
.sys-page {
  .screen-title {
    strong {
      font-family: PingFangSC-Medium;
      font-size: 20px;
      color: #020202;
      letter-spacing: 0;
      line-height: 20px;
    }
  }
  .screen-search {
    .el-input {
      width: 300px !important;
    }
    p {
      display: inline-block;
      margin-right: 15px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #606275;
      letter-spacing: 0;
      line-height: 14px;
    }
    .el-form-item {
      margin-right: 70px;
      margin: 15px 70px 15px 0;
    }
    .screen-rest-button {
      width: 120px;
      height: 40px;
    }
    .screen-search-button {
      width: 120px;
      height: 40px;
      border-radius: 4px;
      border: none;
    }
  }
  .el-table--border td {
    border-right: none !important;
  }
  .el-table--border th {
    border-right: none !important;
  }
  .check-button {
    color: #3d4dda;
  }
  .textC {
    text-align: right;
  }
  .el-input__inner {
    border: none;
    background-color: #f2f4f7;
    padding-left: 30px;
  }
  .has-gutter .el-input__inner {
    background-color: rgb(238, 241, 246);
    width: 120px;
  }
  .el-form {
    position: relative;
    .el-range-input {
      text-align: center;
      width: 30%;
    }
    .el-icon-date {
      position: absolute;
      right: 10px;
    }
  }
  .customTable {
    /deep/ th,
    td {
      padding: 8px 0;
    }
  }
  table {
    .el-button {
      font-weight: 400;
    }
    .el-icon-arrow-up:before {
      content: '\E78F';
    }
  }
  .sys-table-pagination {
    position: relative;
    .el-pagination {
      color: rgb(196, 191, 191);
      padding-bottom: 10px;
      position: absolute;
      right: 0;
      .el-input__inner {
        padding-left: 0px;
      }
      .el-pager {
        li.active {
          color: #000;
        }
        li {
          color: #909399;
        }
      }
    }
  }
}
</style>
