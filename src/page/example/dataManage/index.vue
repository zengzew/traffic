<template>
  <div class="outerBox">
    <el-tabs class="dataManageBox" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane class="tabBox" style="height: 100%" label="设备管理" name="deviceManage">
        <div style="height: 100%" v-loading="loading">
          <div class="emptyBox" v-if="!initDataCount">
            <img
              :style="{ height: '81px', width: '72px', 'margin-bottom': ' 17.5px' }"
              src="~sysStatic/images/dataManage/img_empty.png"
            />
            <!--          <div :style="{background:url(emptyPng)}"></div>-->
            <div>还没有数据</div>
            <div>
              可进行<span class="btnText" @click="multiImport">批量导入数据</span>，或者直接<span
                class="btnText"
                @click="addDeviceByOne"
                >新增数据</span
              >
            </div>
          </div>
          <div class="tableBox" v-if="initDataCount">
            <div class="searchBox">
              <span> 查询字段</span>
              <el-select class="selectBox" v-model="searchField" size="small" placeholder="请选择">
                <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-autocomplete
                style="display: inline-block; width: 200px"
                v-model="input"
                placeholder="请输入内容"
                size="small"
                v-if="searchField !== 'type'"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false"
              ></el-autocomplete>
              <el-select
                v-if="searchField === 'type'"
                class="selectBox"
                v-model="typeField"
                size="small"
                placeholder="请选择"
              >
                <el-option v-for="item in typeFieldOpt" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-button
                size="small"
                class="searchBtn"
                type="primary"
                :disabled="
                  (this.searchField === 'title' && !this.input) || (this.searchField === 'type' && !this.typeField)
                "
                @click="searchDevice"
                >查询
              </el-button>
              <el-button size="small" @click="reset">重置</el-button>
            </div>
            <div class="addBox" v-if="isManageEdit">
              <div class="addMenu">
                <span @click="addField" v-if="isDeviceConfigEdit">
                  <img src="~sysStatic/images/dataManage/ic_edittext.png" />
                  新增自定义字段
                </span>
                <span @click="multiImport">
                  <img src="~sysStatic/images/dataManage/ic_import.png" />
                  批量导入数据
                </span>
                <span @click="addDeviceByOne">
                  <img src="~sysStatic/images/dataManage/ic_newdata.png" />
                  新增数据
                </span>
              </div>
            </div>
            <!--            <AddBox ref="addBox" class="addBox" @initTableByPageindex='initTableByPageindex'></AddBox>-->
            <DeviceInfo
              ref="deviceInfo"
              :tableData="tableData"
              :table-loading="tableLoading"
              :allChoose="allChoose"
              :extKeys="extKeys"
              @selectChangeCb="selectChangeCb"
              @initCurrentPageTable="initTableByPageindex"
            ></DeviceInfo>
            <div class="bottomBox">
              <div style="display: inline-block; float: left">
                <el-checkbox :indeterminate="isIndeterminate" v-model="allChoose" :disabled="!tableData.length"
                  >全选</el-checkbox
                >
                <el-button
                  class="deleteBtn"
                  @click="deleteAll"
                  plain
                  :disabled="(!isIndeterminate && !allChoose) || !tableData.length"
                  v-if="isManageDelete"
                  >删除
                </el-button>
              </div>
              <el-pagination
                class="pagination"
                :small="true"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="9"
                layout="total, prev, pager, next, jumper"
                :total="dataCount"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="围栏管理" name="fenceMange" v-if="false"> 围栏管理功能暂未开放 </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="新增自定义字段"
      :destroy-on-close="true"
      :visible.sync="dialogTableVisible"
      width="900px"
      :close-on-click-modal="false"
    >
      <AddFieldDialog
        :dialogTableVisible.sync="dialogTableVisible"
        @refreshTable="refreshTable"
        @updateAllKey="getAllKey"
      ></AddFieldDialog>
    </el-dialog>
    <el-dialog
      title="批量导入数据"
      :visible.sync="multiImportVisible"
      :destroy-on-close="true"
      width="650px"
      :before-close="closeTooltipCb"
      :close-on-click-modal="false"
    >
      <MultiImport
        :multiImportVisible.sync="multiImportVisible"
        :isUploading.sync="isUploading"
        :extKeys="extKeys.map((item) => item.name)"
        @initCurrentPageTable="initTableByPageindex"
      ></MultiImport>
    </el-dialog>
    <el-dialog
      title="新增单个数据"
      :visible.sync="addDeviceByOneVisible"
      :destroy-on-close="true"
      width="600px"
      :close-on-click-modal="false"
    >
      <AddDeviceByOne
        :addDeviceByOneVisible.sync="addDeviceByOneVisible"
        :extKeys="extKeys"
        @initCurrentPageTable="initTableByPageindex"
      ></AddDeviceByOne>
    </el-dialog>
  </div>
</template>

<script>
import AddBox from './addBox';
import DeviceInfo from './deviceInfo';
import AddFieldDialog from './addFieldDialog';
import MultiImport from './multiImport';
import AddDeviceByOne from './addDeviceByOne';
import { mapGetters, mapState } from 'vuex';
import { getTypeOption } from '../../../config/deviceType';

// import {getTypeNumByName} from '../../../config/deviceType'
export default {
  name: 'dataManage',
  components: {
    DeviceInfo,
    AddBox,
    AddFieldDialog,
    MultiImport,
    AddDeviceByOne,
  },
  data() {
    return {
      activeName: 'deviceManage',
      loading: true,
      tableLoading: false,
      typeField: '', // 设备类型查询默认值
      typeFieldOpt: getTypeOption(),
      tableData: [],
      searchOptions: [
        {
          value: 'title',
          label: '设备名称',
        },
      ],
      searchField: 'title',
      input: '', // 查询框输入
      allChoose: false,
      currentPage: 1,
      dataCount: 0,
      initDataCount: 0,
      isIndeterminate: false,
      extKeys: [], // 请求获取的自定义字段数组
      searchKeys: [], // 可检索字段数组
      multiImportVisible: false,
      dialogTableVisible: false, // 控制自定义字段对话框
      addDeviceByOneVisible: false, // 控制导入单个数据
      isUploading: false,
      selectItems: [],
    };
  },
  computed: {
    ...mapState({
      currentPagePermission: (state) => state.auth.currentPagePermission,
      currentOrder: (state) => state.multiOrder.currentOrder,
    }),
    ...mapGetters({
      isManageEdit: 'auth/isManageEdit',
      isManageDelete: 'auth/isManageDelete',
      isDeviceConfigEdit: 'auth/isDeviceConfigEdit',
    }),
  },
  watch: {
    currentOrder: {
      handler() {
        this.initTableByPageindex();
      },
      deep: true,
    },
  },
  methods: {
    handleClick() {},
    isEdit() {
      return this.currentPagePermission.includes('edit');
    },
    querySearch(queryString, cb) {
      if (this.searchField !== 'title') {
        cb([]);
        return;
      }
      this.$API.device
        .fuzzySearchGet({
          title: queryString,
          pagesize: 100,
        })
        .then((res) => {
          if (res.message === 'success') {
            const showData = res.data.map((val) => ({ value: val.title }));
            cb(showData);
          } else {
            cb([]);
          }
        });
    },
    addDeviceByOne() {
      this.addDeviceByOneVisible = true;
    },
    addField() {
      this.$API.device.allDeviceKeyGet().then((res) => {
        const extObjArr = res.data.filter((item) => !item.default);
        this.extKeys = extObjArr.map((item) => ({ name: item.name, showName: item.showname }));
        if (this.extKeys.length < 5) {
          this.dialogTableVisible = true;
        } else {
          this.$message({
            type: 'error',
            message: '最多同时存在5个自定义字段',
          });
        }
      });
    },
    closeTooltipCb() {
      if (this.isUploading) {
        this.$confirm('数据正在上传，强制关闭上传进度将会终止, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.multiImportVisible = false;
            this.$message({
              type: 'info',
              message: '上传终止!',
            });
          })
          .catch(() => {
            this.multiImportVisible = true;
            this.$message({
              type: 'info',
              message: '已取消关闭操作',
            });
          });
      } else {
        this.multiImportVisible = false;
      }
    },
    multiImport() {
      this.multiImportVisible = true;
    },
    refreshTable() {
      this.initTableByPageindex();
    },
    searchDevice() {
      if ((this.searchField === 'title' && !this.input) || (this.searchField === 'type' && !this.typeField)) return;
      this.tableLoading = true;
      this.searchByField().then(this.searchSuccess).catch(this.searchError);
    },
    searchByField(pageIndex) {
      this.currentPage = pageIndex ? pageIndex : 1;
      if (this.searchField === 'title') {
        return this.$API.device.deviceSearchGet({
          title: this.input,
          pageindex: this.currentPage,
        });
      }
      if (this.searchField === 'deviceid') {
        return this.$API.device.deviceSearchGet({
          deviceid: this.input,
          pageindex: this.currentPage,
        });
      }
      if (this.searchField === 'type') {
        // 批量查询
        return this.$API.device.deviceDataGet({
          type: this.typeField,
          serviceid: this.currentOrder.serviceid,
          pageindex: this.currentPage,
        });
      }
      // 自定义字段
      return this.$API.device.deviceDataGet({
        jsonkey: this.searchField,
        jsonvalue: this.input,
        jsonop: 'like',
        serviceid: this.currentOrder.serviceid,
      });
    },
    searchSuccess(result) {
      this.tableLoading = false;
      if (result.status === 0) {
        this.tableData = [];
        result.data &&
          result.data.forEach((item) => {
            const extObj = item.ext ? JSON.parse(item.ext) : {};
            const extObj2 = {};
            // 根据请求的自定义字段获取匹配的字段值并显示
            Object.keys(extObj) &&
              this.extKeys.forEach((item) => {
                extObj2[item.name] = extObj[item.name];
              });
            this.tableData.push({ ...item, ...extObj2 });
          });
        this.dataCount = result.totalcount;
      } else if (result.status === 1002) {
        this.$message({
          message: '查询输入内容不合法，请检查后重新输入',
          type: 'error',
        });
      } else {
        this.$message({
          message: '查询失败，请稍后重试',
          type: 'error',
        });
      }
    },
    searchError(error) {
      this.tableLoading = false;
      this.$message({
        message: '查询输入内容不合法，请检查后重新输入',
        type: 'error',
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      if ((this.searchField === 'title' && !this.input) || (this.searchField === 'type' && !this.typeField)) {
        this.initTableByPageindex();
      } else {
        this.searchByField(this.currentPage).then(this.searchSuccess).catch(this.searchError);
      }
    },
    selectChangeCb(selectVals) {
      this.selectItems = [...selectVals];
      this.isIndeterminate = false;
      if (selectVals.length === this.tableData.length) {
        this.allChoose = true;
      } else if (selectVals.length === 0) {
        this.allChoose = false;
      } else {
        this.isIndeterminate = true;
      }
    },
    reset() {
      this.input = '';
      this.typeField = '';
      this.currentPage = 1;
      this.initTableByPageindex();
    },
    deleteAll() {
      const idStr = this.selectItems.map((item) => item.id).join(',');
      this.$confirm(`确定删除所选设备的数据？`, '删除数据', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$refs.deviceInfo.deleteItem(idStr);
      });
    },
    // 获取自定义字段值
    async initTableByPageindex() {
      if (this.input) {
        // 查询模式下
        this.searchDevice();
      } else {
        // 正常查询
        this.loading = true;
        await this.$API.device.getCustomizeKey().then((res) => {
          if (res.data)
            this.extKeys = res.data.map((item) => ({
              name: item.name,
              showName: item.showname,
            }));
        });
        this.$API.device
          .deviceDataGet({
            pageindex: this.currentPage,
            serviceid: this.currentOrder.serviceid,
          })
          .then((result) => {
            this.loading = false;
            if (result.message === 'success') {
              this.tableData = [];
              result.data &&
                result.data.forEach((item) => {
                  const extObj = item.ext ? JSON.parse(item.ext) : {};
                  const extObj2 = {};
                  // 根据请求的自定义字段获取匹配的字段值并显示
                  Object.keys(extObj) &&
                    this.extKeys.forEach((item) => {
                      extObj2[item.name] = extObj[item.name];
                    });
                  this.tableData.push({ ...item, ...extObj2 });
                });
              // this.tableData = [...result.data];
              this.initDataCount = this.tableData.length;
              this.dataCount = result.totalcount;
            } else {
              this.$message({
                message: '查询失败，请稍后重试',
                type: 'error',
              });
            }
          })
          .catch((error) => {
            this.loading = false;
            this.$message({
              type: 'error',
              message: `错误   ${JSON.stringify(error)}`,
            });
          });
      }
    },
    getAllKey() {
      this.$API.device.allDeviceKeyGet().then((res) => {
        if (res.data) {
          const extObjArr = res.data.filter((item) => !item.default);
          this.extKeys = extObjArr.map((item) => ({ name: item.name, showName: item.showname }));

          this.searchKeys = res.data.filter((item) => item.search === 'true');
          this.searchOptions = this.searchKeys.map((item) => ({
            value: item.name,
            label: item.showname,
          }));
          this.searchOptions = this.searchOptions.filter((item) => item.value !== 'deviceid');
        }
      });
    },
  },
  created() {
    // 初始化首页
    this.initTableByPageindex();
    this.getAllKey();
  },
  mounted() {},
};
</script>

<style scoped lang="scss">
.outerBox {
  background-color: #f1f3f7;
  width: 100%;
  height: 100%;
  padding-top: 10px;
}

/deep/.dataManageBox {
  background: #ffffff;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.03);
  border-radius: 4px;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  min-width: 1340px;
  margin: auto;
  width: 1400px;
  height: 100%;

  .el-button--primary {
    background-color: #0062ff;
    border-color: #0062ff;
  }

  .el-tabs__item {
    margin-top: 11px;
    color: #606275;
  }

  .el-tabs__item.is-active {
    color: #0062ff;
  }

  .el-tabs__nav {
    margin-left: 40px;
  }

  .el-tabs__content {
    position: absolute;
    width: 100%;
    top: 80px;
    bottom: 0;
    color: #606275;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .emptyBox {
    text-align: center;
    color: #606275;
    line-height: 24px;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }

  .tableBox {
    /*overflow: hidden;*/
  }

  .searchBox {
    height: 40px;
  }

  .bottomBox {
    height: 124px;
    padding-top: 20px;
    box-sizing: border-box;
  }

  .tabBox {
    height: 100%;
    overflow-y: auto;
  }

  .addBox .addMenu {
    text-align: right;
    margin: 10px 20px 16px 0;

    span {
      cursor: pointer;
      color: #0062ff;
      margin-left: 18px;
    }
    img {
      width: 15px;
      margin-bottom: 3px;
      vertical-align: middle;
    }
  }

  .btnText {
    color: #0062ff;
    cursor: pointer;
  }

  .pagination {
    display: inline-block;
    float: right;
  }

  .deleteBtn {
    display: inline-block;
    border: none;
  }

  .el-table {
    thead {
      color: #323442;
    }

    th {
      padding: 10px 0 10px 0;
      background-color: #f4f6f9;
    }

    td {
      padding: 11px 0 10px 0;
    }
  }

  .selectBox {
    margin: 0 20px 0 10px;
  }

  .searchBtn {
    margin: 0 0 0 60px;
  }
  .el-button--primary.is-disabled {
    background-color: #9ea6ed;
    border-color: #9ea6ed;
  }
}
</style>
