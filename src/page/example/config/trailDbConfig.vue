<template>
  <div class="default_table">
    <div class="defaule_one">
      <el-table :data="tableData" style="width: 100%" :header-cell-style="headerStyle" v-loading="loading">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="showname" label="显示名称"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <!--        <el-table-column prop="search" label="可检索" width="200px"></el-table-column>-->
        <el-table-column prop="comment" label="字段说明"></el-table-column>
      </el-table>
    </div>
    <div class="default_two">
      <div class="default_h">
        <div class="font" :style="{ opacity: keyData.length == 0 ? '0' : '1' }">自定义字段</div>
        <div class="default_button" v-if="isTrackConfigEdit">
          <img src="../../../assets/images/dataManage/ic_edittext.png" alt="" />
          <el-button type="text" @click="handleAdd">新增自定义字段</el-button>
        </div>
      </div>
      <el-table :data="keyData" style="width: 100%" :header-cell-style="headerStyle" v-if="keyData.length > 0">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="showname" label="显示名称"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <!--        <el-table-column prop="search" label="可检索"></el-table-column>-->
        <el-table-column prop="comment" label="字段说明"></el-table-column>
        <el-table-column label="操作" v-if="isTrackConfigEdit">
          <template slot-scope="scope">
            <el-button type="text" style="color: #f00" @click="delKey(scope.row.name)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="新增自定义字段"
      :visible.sync="dialogTableVisible"
      @close="handleCancel"
      :close-on-click-modal="false"
    >
      <el-form :rules="rules" :model="form" ref="form">
        <el-table :data="form.gridData" :header-cell-style="headerStyle">
          <el-table-column label="字段名称" width="200px">
            <template slot-scope="scope">
              <el-form-item :prop="'gridData.' + scope.$index + '.name'" :rules="rules.name">
                <el-input size="small" v-model="scope.row.name"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="显示名称" width="160px">
            <template slot-scope="scope">
              <el-form-item :prop="'gridData.' + scope.$index + '.showname'" :rules="rules.showname">
                <el-input size="small" v-model="scope.row.showname"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="类型" width="160px">
            <template slot-scope="scope">
              <el-form-item :prop="'gridData.' + scope.$index + '.type'" :rules="rules.type">
                <el-select v-model="scope.row.type" placeholder="请选择">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="字段说明" width="160px">
            <template slot-scope="scope">
              <el-form-item :prop="'gridData.' + scope.$index + '.comment'" :rules="rules.comment">
                <el-input size="small" v-model="scope.row.comment"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <!--  <el-table-column label="可搜索">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.search" @change="handleChange(scope.row)"></el-checkbox>
              </template>
            </el-table-column>-->
          <el-table-column label="操作">
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
      <span :style="{ display: keyData.length + form.gridData.length == 5 ? 'none' : 'inline' }">
        <img class="continueAddImg" src="../../../assets/images/dataManage/ic_edittext.png" alt="" /><el-button
          type="text"
          @click="handleTable"
          >继续新增字段(剩余{{ 5 - keyData.length - form.gridData.length }}个)</el-button
        >
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureAdd">保存</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  data() {
    const nameValidate = (rule, value, callback) => {
      if (value.replace(/[\u4e00-\u9fa5]/g, 'aa').length >= 20) {
        callback(new Error('长度最多10个汉字'));
      } else {
        callback();
      }
    };
    return {
      tableData: [],
      dialogTableVisible: false,
      form: {
        gridData: [
          {
            name: '',
            showname: '',
            type: 'string',
            comment: '',
            search: false,
            createtime: 1588063380,
            updatetime: 1588063380,
            request: 'false',

            reqtime: 1,
          },
        ],
      },
      keyData: [],
      options: [
        {
          label: 'string',
          value: '1',
        },
        {
          label: 'int',
          value: '2',
        },
        {
          label: 'double',
          value: '3',
        },
      ],
      loading: true,
      rules: {
        name: [
          { required: true, message: '字段名称不得为空', trigger: 'blur' },
          {
            type: 'string',
            pattern: /^[a-zA-Z]*$/,
            message: '必须为英文字母',
            trigger: 'blur',
          },
          { max: 64, message: '字段名称不得超过64个字', trigger: 'blur' },
        ],
        showname: [
          { required: true, message: '显示名称不得为空', trigger: 'blur' },
          // {type: 'string',pattern: /^[a-zA-Z0-9\u4E00-\u9FA5]*$/, message: '必须为汉字、数字或英文', trigger: 'blur'},
          { validator: nameValidate, message: '显示名称不得超过10个字', trigger: 'blur' },
        ],
        comment: [{ max: 100, message: '字段说明不得超过100字', trigger: 'blur' }],
        type: [{ required: true, message: '输入不得为空', trigger: 'blur' }],
      },
    };
  },
  computed: {
    ...mapGetters({
      isTrackConfigView: 'auth/isTrackConfigView',
      isTrackConfigEdit: 'auth/isTrackConfigEdit',
    }),
    ...mapState({
      currentOrder: (state) => state.multiOrder.currentOrder,
    }),
  },
  watch: {
    // 监听当前业务
    currentOrder: {
      handler() {
        this.getKey();
        this.loading = true;
        this.$API.Trail.allTrackKeyGet({ default: true }).then((res) => {
          this.loading = false;
          this.tableData = res.data;
        });
      },
      deep: true,
    },
  },
  methods: {
    headerStyle() {
      return 'background:#F4F6F9;color:#323442;height:40px;';
    },
    handleAdd() {
      if (this.keyData.length < 5) {
        this.dialogTableVisible = true;
      } else {
        this.$alert('最多只能存在五个自定义字段', '提示', {
          confirmButtonText: '确定',
          callback: (action) => {
            /* this.$message({
                 type: 'info',
                 message: `action: ${ action }`
               });*/
          },
        });
      }
    },
    handleChange() {},
    // 删除自定义
    delKey(name) {
      const data = {
        name,
      };
      this.$confirm('自定义字段删除后，关联的数据也将不能正常显示，请谨慎执行删除操作，确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      })
        .then(() => {
          /* axios({
            headers: {
              'Content-Type': 'text/plain'
            },
            url: `${axios.config}/track_config/api/v1/delete`,
            method: 'post',
            data,
          })*/
          this.$API.Trail.trackConfigDeletePost(data).then((res) => {
            this.getKey();
            this.$message({
              message: '删除成功',
              type: 'success',
            });
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    // 新增自定义
    handleTable() {
      const Data = {
        name: '',
        showname: '',
        type: 'string',
        comment: '',
        search: false,
        createtime: 1588063380,
        updatetime: 1588063380,
        request: 'false',
      };
      const newData = this.form.gridData.map((item) => ({ ...item, search: item.search.toString() }));
      /* if (newData[newData.length - 1].name != "" && newData[newData.length - 1].showname != "") {
          this.form.gridData.push(Data)
        } else {
          this.$message({
            message: '请填写必填项',
            type: 'warning'
          });
        }*/
      this.$refs.form.validate((valid, model) => {
        if (valid) {
          this.form.gridData.push(Data);
        } else {
          this.$message({
            message: '表单校验失败，请重新填写',
            type: 'warning',
          });
        }
      });
    },
    deleteItem(index) {
      // 删除自定义
      this.form.gridData.splice(index, 1);
    },
    // 获取自定义数据
    getKey() {
      this.$API.Trail.getCustomizeKey().then((res) => {
        res.data ? (this.keyData = res.data) : (this.keyData = []);
      });
    },
    // 新增自定义数据
    insertKey(data) {
      /* axios({
          headers: {
            'Content-Type': 'text/plain'
          },
          url: `${axios.config}/track_config/api/v1/insert`,
          method: 'post',
          data,
        })*/
      this.$API.Trail.trackConfigInsertPost(data).then((res) => {
        if (res.status === 0) {
          this.$message({
            message: '保存成功',
            type: 'success',
          });
          this.getKey();
        } else {
          this.$message({
            message: '保存失败，请重新尝试',
            type: 'error',
          });
        }
      });
    },
    // 保存新增数据
    sureAdd() {
      const Data = {
        name: '',
        showname: '',
        type: 'string',
        comment: '',
        search: false,
        createtime: 1588063380,
        updatetime: 1588063380,
        request: 'false',
      };

      const newData = this.form.gridData.map((item) => ({ ...item, search: item.search.toString() }));
      this.$refs.form.validate((valid, model) => {
        if (valid) {
          newData.map((item) => {
            this.insertKey(item);
          });
          this.dialogTableVisible = false;
          this.form.gridData = [Data];
        } else {
          this.$message({
            message: '表单校验失败，请重新填写',
            type: 'warning',
          });
        }
      });
      // if (newData[newData.length - 1].name != "" && newData[newData.length - 1].showname != "") {
      //   newData.map(item => {
      //     this.insertKey(item)
      //   })
      //
      //   this.dialogTableVisible = false;
      //   this.form.gridData = [Data]
      // } else {
      //   this.$message({
      //     message: '请填写必填项',
      //     type: 'warning'
      //   });
      // }
    },
    // 取消数据
    handleCancel() {
      const Data = {
        name: '',
        showname: '',
        type: 'string',
        comment: '',
        search: false,
        createtime: 1588063380,
        updatetime: 1588063380,
        request: 'false',
      };
      this.form.gridData = [Data];
      this.dialogTableVisible = false;
    },
  },
  mounted() {},
  created() {
    this.getKey();
    this.loading = true;
    this.$API.Trail.allTrackKeyGet({ default: true }).then((res) => {
      this.loading = false;
      this.tableData = res.data;
    });
  },
};
</script>

<style lang="scss">
.default_table {
  th {
    padding: 0;
    height: 40px;
  }

  .defaule_one {
  }

  .default_two {
    .default_h {
      display: flex;
      justify-content: space-between;
      height: 22px;
      margin: 25px 25px 24px 0px;

      .font {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #020202;
      }

      .el-button--text {
        color: #0062ff;
      }

      .default_button {
        position: relative;
        top: -8px;

        img {
          position: absolute;
          top: 12px;
          left: -18px;
        }
      }
    }
  }

  .el-dialog {
    width: 900px;
    // height:387px;
    .el-input__inner {
      width: 140px;
      height: 34px;
    }

    .el-input__icon {
      line-height: 16px;
    }

    .el-dialog__header {
      background: #f4f6f9;
      box-shadow: 0 1px 0 0 #f0f3f7;
      box-sizing: border-box;
      height: 50px;
      padding: 0;
      padding-left: 40px;
      padding-top: 14px;
    }

    .el-dialog__body {
      padding-top: 20px;
      th:nth-child(1),
      th:nth-child(2),
      th:nth-child(3) {
        .cell::after {
          content: ' *';
          color: #f00;
        }
      }
      .el-button {
        color: #0062ff;
      }
      img {
        padding-top: 11px;
        margin-right: 5px;
      }
    }
  }
  .continueAddImg {
    width: 16px;
  }
  .delBtn {
    color: #f00 !important;
    margin-bottom: 15px;
  }
}
</style>
