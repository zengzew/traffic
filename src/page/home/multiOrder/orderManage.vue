<template>
  <div class="orderContentBox">
    <div class="header">
      <span>我的业务</span>
      <button class="addBtn" v-if="isMultiOrderAdd" @click="addDialogVisible = true">新建</button>
    </div>
    <div class="cards">
      <el-card class="cardItem" :body-style="{ padding: '0px' }" v-for="(item, index) in orderList" :key="index">
        <img :src="bgImg" @click="gotoOrder(item)" />
        <div class="textBox" style="padding: 14px">
          <div class="manageTitle">
            <el-tooltip class="item" effect="light" :content="item.servicename" placement="top">
              <p>{{ getSimName(item.servicename) }}</p>
            </el-tooltip>
            <div class="icon">
              <el-tooltip effect="light" content="业务配置" placement="top">
                <img
                  v-if="!!configPerms"
                  @click="gotoConfig(item)"
                  src="../../../assets/images/orderMange/icon_configuration@3x.png"
                />
              </el-tooltip>
              <el-tooltip effect="light" content="设置" placement="top">
                <el-popover
                  placement="bottom-start"
                  trigger="click"
                  popper-class="cardPopper"
                  @show="currentIndex = index"
                  v-if="isMultiOrderEdit || isMultiOrderDelete"
                >
                  <div class="operatorDiv">
                    <div v-if="isMultiOrderEdit" @click="renameDialogVisible = true">
                      <img src="../../../assets/images/orderMange/icon_edict@3x.png" />
                      重命名
                    </div>
                    <div v-if="isMultiOrderDelete" @click="deleteItem(item.serviceid)">
                      <img src="../../../assets/images/orderMange/icon_delete@3x.png" />
                      删除
                    </div>
                  </div>
                  <img
                    slot="reference"
                    v-if="isMultiOrderEdit || isMultiOrderDelete"
                    src="../../../assets/images/orderMange/icon_set@3x.png"
                  />
                </el-popover>
              </el-tooltip>
            </div>
          </div>
          <div class="timeText">
            最近编辑时间：{{ Moment(item.updatetime * 1000 || new Date()).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
        </div>
      </el-card>
      <el-card class="cardItem temp" v-for="i in 3" :key="i - 5"></el-card>
    </div>
    <el-dialog
      title="重命名业务"
      top="30vh"
      width="480px"
      :close-on-click-modal="false"
      :visible.sync="renameDialogVisible"
      @open="beforeShow"
    >
      <el-form :model="updateForm" ref="updateForm">
        <el-form-item
          prop="servicename"
          :rules="[{ required: true, message: '业务名称不能为空', trigger: 'blur' }, { validator: nameValidate }]"
        >
          <el-input v-model="updateForm.servicename" class="input" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="renameDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateOrder('updateForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新建业务" top="30vh" :close-on-click-modal="false" :visible.sync="addDialogVisible" width="480px">
      <el-form :model="addForm" ref="addForm">
        <el-form-item
          :rules="[{ required: true, message: '业务名称不能为空', trigger: 'blur' }, { validator: nameValidate }]"
          prop="servicename"
        >
          <el-input v-model="addForm.servicename" placeholder="业务名称" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrder('addForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CloneDeep from 'lodash/cloneDeep';
import Moment from 'moment';
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';
import { simplifyStr } from '../../../util/strOperater';

export default {
  name: 'orderManage',
  data() {
    const nameValidate = (rule, value, callback) => {
      if (value.replace(/[\u4e00-\u9fa5]/g, 'aa').length > 60) {
        callback(new Error('长度最多30个汉字或60个英文'));
      } else {
        callback();
      }
    };
    return {
      nameValidate,
      Moment,
      // 头图资源数组
      actions: [], // 当前页权限列表
      renameDialogVisible: false,
      currentIndex: 0,
      addForm: {
        servicename: '用户新建示例',
      },
      updateForm: {
        servicename: '',
        serviceid: '',
      },
      addDialogVisible: false, // 新建对话框控制
    };
  },
  computed: {
    ...mapState({
      orderList: (state) => state.multiOrder.orderList,
      allPagePermission: (state) => state.auth.allPagePermission,
    }),
    bgImg() {
      return this.picArr[Math.floor(Math.random() * 4)];
    },
    ...mapGetters({
      configPerms: 'auth/configPerms',
      isMultiOrderAdd: 'auth/isMultiOrderAdd',
      isMultiOrderEdit: 'auth/isMultiOrderEdit',
      isMultiOrderDelete: 'auth/isMultiOrderDelete',
    }),
  },
  watch: {
    orderList: {
      handler() {
        console.log('orderList');
      },
      deep: true,
    },
    picArr: {
      handler() {
        console.log('picArr');
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations({
      setCurrentOrder: 'multiOrder/setCurrentOrder',
    }),
    ...mapActions({
      getOrderList: 'multiOrder/getOrderList',
    }),
    // 跳转到子业务实时监控
    gotoOrder(currentOrder) {
      this.setCurrentOrder(currentOrder);
      this.$router.push('/monitor');
    },
    gotoConfig(currentOrder) {
      this.setCurrentOrder(currentOrder);
      this.$router.push('/example/config');
    },
    deleteItem(serviceid) {
      this.$confirm('确定删除此业务?\n删除后不可取消，所有业务数据都将删除', '删除业务', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$API.MultiOrder.orderDelete_Post({
            serviceid,
          }).then((res) => {
            if (res.status === 0) {
              this.getOrderList().catch((res) => {
                this.$message({
                  type: 'error',
                  message: res.message,
                });
              });
              this.$message({
                type: 'success',
                message: '删除成功!',
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    // 新建业务
    addOrder(formName) {
      // 校验
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$API.MultiOrder.orderAdd_Post({
            servicename: this.addForm.servicename,
          }).then((res) => {
            if (res.status === 0) {
              this.$message({
                message: '业务新建成功',
                type: 'success',
              });
              this.addDialogVisible = false;
              this.getOrderList().catch((res) => {
                this.$message({
                  type: 'error',
                  message: res.message,
                });
              });
            } else if (res.status === 1004) {
              this.$message({
                message: '业务名称重复，请修改后重试',
                type: 'error',
              });
            } else {
              this.$message({
                message: '数据新建失败，请稍后重试',
                type: 'error',
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    updateOrder(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$API.MultiOrder.orderUpdate_Post({
            servicename: this.updateForm.servicename,
            serviceid: this.updateForm.serviceid,
          }).then((res) => {
            if (res.status === 0) {
              this.$message({
                message: '业务重命名成功',
                type: 'success',
              });
              this.renameDialogVisible = false;
              this.getOrderList().catch((res) => {
                this.$message({
                  type: 'error',
                  message: res.message,
                });
              });
            } else {
              this.$message({
                message: '重命名失败，请检查后重试',
                type: 'error',
              });
            }
          });
        }
      });
    },
    getSimName(name) {
      return simplifyStr(name, { maxLength: 12 });
    },
    beforeShow() {
      this.updateForm = CloneDeep(this.orderList[this.currentIndex]);
    },
  },
  created() {
    this.getOrderList().catch((res) => {
      this.$message({
        type: 'error',
        message: res.message,
      });
    });
    Object.assign(this, {
      picArr: [
        require('../../../assets/images/orderMange/headPic1.png'),
        require('../../../assets/images/orderMange/headPic2.png'),
        require('../../../assets/images/orderMange/headPic3.png'),
        require('../../../assets/images/orderMange/headPic4.png'),
      ],
    });
  },
};
</script>

<style scoped lang="scss">
.orderContentBox {
  margin-right: 230px;
  margin-left: 230px;
  margin-top: 40px;
}
.header {
  width: 100%;
  display: flex;
  margin: 20px 0;
  justify-content: space-between;
  span {
    color: black;
    font-weight: 600;
    font-size: 18px;
    line-height: 36px;
    margin-left: 10px;
  }
  .addBtn {
    background: #0062ff;
    border-radius: 4px;
    margin-right: 10px;
    width: 75px;
    color: white;
    font-size: 13px;
    border: none;
    cursor: pointer;
  }
}
.cards {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .temp {
    width: 300px;
    height: 0;
    margin-bottom: 0;
    border: none;
    padding: 0;
  }
  .cardItem {
    width: 300px;
    display: inline-block;
    margin: 0 10px 30px 10px;
    img {
      cursor: pointer;
      /*width: 300px;*/
    }
    .textBox {
      padding: 20px;
      .manageTitle {
        display: flex;
        justify-content: space-between;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 10px;
        p {
          width: 200px;
        }
        .icon img {
          display: inline-block;
          width: 24px;
          cursor: pointer;
          margin: 0 4px;
        }
      }
      .timeText {
        font-size: 13px;
      }
    }
  }
}
.dialog-footer {
  margin-top: -30px;
  padding-top: 0;
}
</style>
<style lang="scss">
.cardPopper {
  min-width: fit-content;
  .operatorDiv {
    div {
      margin: 10px 4px;
      cursor: pointer;
      img {
        display: inline-block;
        width: 18px;
      }
    }
  }
}
</style>
