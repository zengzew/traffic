<template>
  <div class="addBoxSpan">
    <span @click="addField">
      <img src="~sysStatic/images/dataManage/ic_edittext.png" />
      新增自定义字段
    </span>
    <span @click="multiImport">
      <img src="~sysStatic/images/dataManage/ic_import.png" />
      批量导入数据
    </span>
    <span>
      <img src="~sysStatic/images/dataManage/ic_newdata.png" />
      新增数据
    </span>
    <el-dialog
      title="新增自定义字段"
      :destroy-on-close="true"
      :visible.sync="dialogTableVisible"
      width="60%"
      :close-on-click-modal="false"
    >
      <AddFieldDialog :dialogTableVisible.sync="dialogTableVisible" @refreshTable="refreshTable"></AddFieldDialog>
    </el-dialog>
    <el-dialog title="批量导入数据" :visible.sync="multiImportVisible" width="60%" :close-on-click-modal="false">
      <MultiImport :multiImportVisible.sync="multiImportVisible"></MultiImport>
    </el-dialog>
  </div>
</template>

<script>
import AddFieldDialog from './addFieldDialog';
import MultiImport from './multiImport';
import axios from '@/util/ajax';

export default {
  name: 'addBox',
  components: {
    AddFieldDialog,
    MultiImport,
  },
  data() {
    return {
      dialogTableVisible: false, // 控制自定义字段对话框
      multiImportVisible: false, // 批量导入对话框
      keyData: [],
    };
  },
  methods: {
    addField() {
      this.getKey();
    },
    multiImport() {
      this.multiImportVisible = true;
    },
    refreshTable() {
      this.$emit('initTableByPageindex');
    },
    // 获取自定义字段值
    getKey() {
      /* axios({
          url: `${axios.config}/device_config/api/v1/get_default`,
          params: {
            key: 1,
            serviceid: 1,
            reqid: 1,
            reqtime: 1,
            default: false
          },
          type: "get"
          // data:data
        })*/
      this.$API.device.getCustomizeKey().then((res) => {
        this.keyData = res.data ? res.data : [];
        if (this.keyData.length < 5) {
          this.dialogTableVisible = true;
        } else {
          this.$message({
            type: 'error',
            message: '最多同时存在5个自定义字段',
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.addBoxSpan {
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
</style>
