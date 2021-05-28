<template>
  <div class="bodyBox">
    <el-form :rules="rules" :model="form" ref="formRef">
      <el-table :data="form.gridData" :header-cell-style="headerStyle">
        <el-table-column label="字段名称" min-width="200px">
          <template slot-scope="scope">
            <el-form-item inline-message="true" :prop="'gridData.' + scope.$index + '.name'" :rules="rules.name">
              <el-input size="small" v-model="scope.row.name"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="显示名称" min-width="160px">
          <template slot-scope="scope">
            <el-form-item
              inline-message="true"
              :prop="'gridData.' + scope.$index + '.showname'"
              :rules="rules.showname"
            >
              <el-input size="small" v-model="scope.row.showname"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="120px">
          <template slot-scope="scope">
            <el-form-item inline-message="true" :prop="'gridData.' + scope.$index + '.type'" :rules="rules.type">
              <el-select v-model="scope.row.type" size="small" placeholder="请选择" disabled>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="字段说明" min-width="160px">
          <template slot-scope="scope">
            <el-form-item :prop="'gridData.' + scope.$index + '.comment'" :rules="rules.comment">
              <el-input size="small" v-model="scope.row.comment"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="可搜索" min-width="70px">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.search" class="isSearch"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="80px">
          <template slot-scope="scope">
            <el-button
              type="text"
              class="delBtn"
              @click="deleteItem(scope.$index)"
              :disabled="form.gridData.length === 1"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <span :style="{ display: fieldCount >= 5 ? 'none' : 'inline' }">
      <img class="addFieldImg" src="../../../assets/images/dataManage/ic_edittext.png" alt="" /><el-button
        type="text"
        @click="handleTable"
        >继续新增字段(剩余{{ fieldCount < 5 ? 5 - fieldCount : 0 }}个)</el-button
      >
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button class="dialogBtn" type="primary" size="small" @click="sureAdd">保存</el-button>
      <el-button class="dialogBtn" size="small" @click="handleCancel">取 消</el-button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'addFieldDialog',
  props: {
    dialogTableVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const commentValidate = (rule, value, callback) => {
      if (value.replace(/[\u4e00-\u9fa5]/g, 'aa').length > 200) {
        callback(new Error('长度最多100个汉字'));
      } else {
        callback();
      }
    };
    const nameValidate = (rule, value, callback) => {
      if (value.replace(/[\u4e00-\u9fa5]/g, 'aa').length > 64) {
        callback(new Error('长度最多64个字符'));
      } else {
        callback();
      }
    };
    const shownameValidate = (rule, value, callback) => {
      if (value.replace(/[\u4e00-\u9fa5]/g, 'aa').length > 20) {
        callback(new Error('长度最多10个汉字'));
      } else {
        callback();
      }
    };
    return {
      form: {
        gridData: [
          {
            name: '',
            showname: '',
            type: 'string',
            comment: '',
            search: '',
            createtime: 1588063380,
            updatetime: 1588063380,
            request: 'false',
          },
        ],
      },
      options: [
        {
          label: 'string',
          value: '1',
        },
      ],
      keyData: [], // 自定义字段名称
      rules: {
        name: [
          { required: true, message: '字段名称不得为空', trigger: 'blur' },
          {
            type: 'string',
            pattern: /^[a-zA-Z]+[0-9]*$/,
            message: '必须为英文或者英文开头＋数字组合',
            trigger: 'blur',
          },
          { validator: nameValidate, trigger: 'blur' },
        ],
        showname: [
          { required: true, message: '显示名称不得为空', trigger: 'blur' },
          { validator: shownameValidate, trigger: 'blur' },
        ],
        comment: [{ validator: commentValidate, trigger: 'blur' }],
        type: [{ required: true, message: '输入不得为空', trigger: 'blur' }],
      },
    };
  },
  computed: {
    fieldCount() {
      // 已添加自定义字段数量
      return this.keyData.length + this.form.gridData.length;
    },
  },
  methods: {
    handleCancel() {
      this.$refs.formRef.resetFields();
      this.$emit('update:dialogTableVisible', false);
    },
    deleteItem(index) {
      // 删除自定义
      this.form.gridData.splice(index, 1);
    },
    // 新增自定义
    handleTable() {
      const Data = {
        name: '',
        showname: '',
        type: 'string',
        comment: '',
        search: '否',
        createtime: 1588063380,
        updatetime: 1588063380,
        request: 'false',
      };
      const newData = this.form.gridData.map((item) => ({ ...item, search: item.search.toString() }));
      if (newData[newData.length - 1].name != '' && newData[newData.length - 1].showname != '') {
        this.form.gridData.push(Data);
      } else {
        this.$message({
          message: '请填写必填项',
          type: 'warning',
        });
      }
    },
    // 新增自定义字段
    insertKey(data) {
      this.$API.device.deviceConfigInsertPost(data).then((res) => {
        if (res.status === 0) {
          this.$message({
            message: '保存成功',
            type: 'success',
          });
          this.getKey();
          this.$emit('refreshTable');
          this.$emit('updateAllKey');
          this.$emit('update:dialogTableVisible', false);
        } else {
          const message =
            res.message === 'db insert is error' ? '字段名称已存在，请重新输入' : '输入内容包含特殊字符，请重新输入';
          this.$message({
            message,
            type: 'error',
          });
        }
      });
    },
    // 获取自定义字段值
    getKey() {
      this.$API.device.getCustomizeKey().then((res) => {
        this.keyData = res.data ? res.data : [];
      });
    },
    // 保存新增数据
    sureAdd() {
      const newData = this.form.gridData.map((item) => ({ ...item, search: item.search.toString() }));
      this.$refs.formRef.validate((valid, model) => {
        if (valid) {
          newData.map((item) => {
            this.insertKey(item);
          });
          // this.dialogTableVisible = false;
          // this.form.gridData = [Data]
        } else {
          this.$message({
            message: '表单校验失败，请重新填写',
            type: 'warning',
          });
        }
      });
    },
    headerStyle() {
      return 'background:#F4F6F9;color:#323442;height:40px;';
    },
  },
  created() {
    // this.$refs['formRef'].resetFields();
    // 获取初始自定义字段
    this.getKey();
  },
};
</script>

<style scoped lang="scss">
.addFieldImg {
  width: 16px;
  vertical-align: middle;
  transform: translate(0, -3px);
}

.dialogBtn {
  font-size: 14px;
}

.bodyBox {
  overflow: auto;
  /*display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .dialog-footer {
      margin-top: 10px;
    }*/
  .dialog-footer {
    float: right;
    margin-top: 10px;
  }
}
</style>
