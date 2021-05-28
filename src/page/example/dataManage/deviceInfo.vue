<template>
  <div>
    <el-table
      class="tableStyle"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      max-height="460"
      v-loading="tableLoading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" fixed="left" show-overflow-tooltip> </el-table-column>
      <el-table-column fixed="left" prop="title" label="设备名称" width="140px" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="type" label="设备类型" width="100px" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ DeviceTypeConfig[scope.row.type] || '未定义' }}
        </template>
      </el-table-column>
      <el-table-column prop="department" label="部门" width="120px" show-overflow-tooltip> </el-table-column>
      <el-table-column show-overflow-tooltip prop="user" label="使用者" width="120px"> </el-table-column>
      <el-table-column
        v-if="extKeys.length > 0"
        :label="item.showName"
        show-overflow-tooltip
        v-for="(item, index) in extKeys"
        :key="index"
      >
        <template slot-scope="scope">
          <span>{{ scope.row[item.name] || '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编辑时间" min-width="200px">
        <template slot-scope="scope">{{ Moment(scope.row.updatetime * 1000).format('YYYY-MM-DD HH:mm:ss') }}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100px" v-if="isManageDelete || isManageEdit">
        <template slot-scope="scope">
          <img
            v-if="isManageEdit"
            src="~sysStatic/images/dataManage/ic_edit.png"
            @click="handleEdit(scope.$index, scope.row)"
          />
          <img
            v-if="isManageDelete"
            src="~sysStatic/images/dataManage/ic_delete.png"
            @click="handleDelete(scope.$index, scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="编辑数据"
      custom-class="dialogBox"
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
    >
      <el-form class="formBox" :model="editForm" ref="deviceInfoForm" size="small">
        <el-form-item
          label="设备名称"
          prop="title"
          :rules="[{ required: true, message: '名称不能为空' }]"
          label-width="100px"
        >
          <el-input v-model="editForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类别" label-width="100px" :rules="[{ required: true, message: '类别不能为空' }]">
          <el-select v-model="editForm.type" placeholder="请选择车辆类别">
            <el-option v-for="item in typeFieldOpt" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" label-width="100px">
          <el-input v-model="editForm.department" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="使用者" label-width="100px">
          <el-input v-model="editForm.user" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="item.showName" v-for="(item, index) in extKeys" :key="index" label-width="100px">
          <el-input v-model="editForm[item.name]" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="editDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from '../../../util/ajax';
import Moment from 'moment';
import deviceUpdateMsg from '../../../config/msgConfig/deviceUpdate';
import { mapGetters } from 'vuex';
import DeviceTypeConfig, { getTypeOption } from '../../../config/deviceType';

export default {
  name: 'deviceInfo',
  props: {
    tableData: {
      type: Array,
      default: [],
    },
    tableLoading: {
      type: Boolean,
      default: false,
    },
    allChoose: {
      type: Boolean,
      default: false,
    },
    extKeys: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      Moment,
      DeviceTypeConfig,
      multipleSelection: [],
      editForm: {
        title: '',
        type: 1,
        department: '',
        user: '',
        tel: '',
        extKeys: {},
      },
      /* options: [{
          value: 1,
          label: '警车'
          }, {
            value: 2 ,
            label: '铁骑'
          }],*/
      typeFieldOpt: getTypeOption(),

      editDialogVisible: false,
      rules: {},
    };
  },
  computed: {
    ...mapGetters({
      isManageEdit: 'auth/isManageEdit',
      isManageDelete: 'auth/isManageDelete',
    }),
  },
  watch: {
    allChoose() {
      this.$nextTick(() => {
        for (let i = 0; i < this.tableData.length; i++) {
          this.$refs.multipleTable.toggleRowSelection(this.tableData[i], this.allChoose);
        }
      });
    },
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit('selectChangeCb', val);
    },
    handleEdit(index, row) {
      console.log(this.tableData[index], this.typeFieldOpt);

      this.editForm = { ...this.tableData[index] };
      this.editDialogVisible = true;
    },
    filterHandler(value, row, column) {
      const { property } = column;
      if (value <= 2) {
        return row[property] === value;
      }
      return row[property] >= value;
    },
    filtersData() {
      return [
        { text: '警车', value: 1 },
        { text: '铁骑', value: 2 },
        { text: '未定义', value: 3 },
      ];
    },
    typeComputed(val) {
      switch (val) {
        case 1:
          return '警车';
        case 2:
          return '铁骑';
        default:
          return '未定义';
      }
    },
    /** *
     * 删除数据项
     * @param idStr id字符串，逗号间隔，最多10个
     */
    deleteItem(idStr) {
      this.$API.device.deviceDeletePost({ deviceids: idStr }).then((result) => {
        if (result.status === 0) {
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
          this.$emit('initCurrentPageTable');
        } else {
          this.$message({
            type: 'warn',
            message: `删除失败，请稍后重试${result.message}`,
          });
        }
      });
      // })
    },
    handleDelete(index, row) {
      this.$confirm(`删除设备"${row.title}"的相关数据？`, '删除数据', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          this.deleteItem(row.id);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    submitForm() {
      this.$refs.deviceInfoForm.validate((valid) => {
        if (valid) {
          const extObj = {};
          this.extKeys.forEach((item) => {
            extObj[item.name] = this.editForm[item.name];
          });
          /* axios({
              url: '/ws/trip_device/v1/update',
              method: 'post',
              headers:{
                  'Content-Type': 'text/plain'
              },
              data: {
                "reqid": "1",
                "reqtime": 1,
                "serviceid": "101",
                "key": "lzh",
                "deviceid": this.editForm.id,
                "title": this.editForm.title,
                "type": this.editForm.type,
                "department": this.editForm.department,
                "user": this.editForm.user,
                "ext": JSON.stringify(extObj),
                "tel": this.editForm.tel,
              }
            })*/
          this.$API.device
            .deviceUpdatePost({
              deviceid: this.editForm.id,
              title: this.editForm.title,
              type: parseInt(this.editForm.type),
              department: this.editForm.department,
              user: this.editForm.user,
              ext: JSON.stringify(extObj),
              tel: this.editForm.tel,
            })
            .then((res) => {
              if (res.status === 0) {
                // 更新数据
                this.$emit('initCurrentPageTable');
                this.editDialogVisible = false;
                this.$message({
                  message: '数据更新成功',
                  type: 'success',
                });
              } else {
                if (deviceUpdateMsg[res.status]) {
                  this.$message({
                    message: deviceUpdateMsg[[res.status]].configMsg,
                    type: 'error',
                  });
                } else {
                  this.$message({
                    message: '数据更新失败，请稍后重试',
                    type: 'error',
                  });
                }
              }
            })
            .catch((error) => {
              this.$message({
                message: '输入内容不合法，请检查后重新输入',
                type: 'error',
              });
            });
        } else {
          this.$message({
            message: '填写参数有误，请重新填写',
            type: 'error',
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  created() {},
};
</script>
<style lang="scss">
.dialogBox {
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  .el-dialog__header {
    border-radius: 4px;
  }
}
</style>
<style scoped lang="scss">
.tableStyle {
  margin: auto;
  /*overflow: hidden;*/
  width: 1320px;
  img {
    width: 16px;
    margin-right: 18px;
    cursor: pointer;
  }
}
.contentBox {
  overflow: hidden;
  width: 1400px;
}
/deep/.dialogBox {
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
/deep/.el-dialog__header {
  background-color: #4e90ff !important;
}
.formBox {
  margin: auto;
  width: 400px;
  .el-select {
    width: 100%;
  }
}
</style>
