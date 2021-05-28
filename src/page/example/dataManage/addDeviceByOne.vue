<template>
  <div>
    <el-form class="formBox" :model="addForm" ref="addDeviceByOne" size="small">
      <el-form-item
        label="设备名称"
        prop="title"
        :rules="[{ required: true, message: '名称不能为空' }]"
        label-width="100px"
      >
        <el-input v-model="addForm.title" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="设备类型" label-width="100px" :rules="[{ required: true, message: '类别不能为空' }]">
        <el-select v-model="addForm.type" placeholder="请选择车辆类别">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备ID" label-width="100px">
        <el-input v-model="addForm.id" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="部门" label-width="100px">
        <el-input v-model="addForm.department" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="使用者" label-width="100px">
        <el-input v-model="addForm.user" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item :label="item.showName" v-for="(item, index) in extKeys" :key="index" label-width="100px">
        <el-input v-model="addForm[item.name]" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">保存</el-button>
      <el-button @click="$emit('update:addDeviceByOneVisible', false)">取消</el-button>
    </div>
  </div>
</template>

<script>
import API from '../../../util/apiV1';
import deviceUpdateMsg from '../../../config/msgConfig/deviceUpdate';
import { getTypeOption } from '../../../config/deviceType';

export default {
  name: 'addDeviceByOne',
  props: {
    extKeys: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      addForm: {
        title: '',
        type: '',
        department: '',
        user: '',
        tel: '',
        id: '',
      },
      options: getTypeOption(),
    };
  },
  methods: {
    submitForm() {
      this.$refs.addDeviceByOne.validate((valid) => {
        if (valid) {
          const extObj = {};
          this.extKeys.forEach((item) => {
            extObj[item.name] = this.addForm[item.name];
          });
          API.device
            .deviceInsertPost({
              title: this.addForm.title,
              type: this.addForm.type,
              deviceid: this.addForm.id,
              department: this.addForm.department,
              user: this.addForm.user,
              ext: JSON.stringify(extObj),
              tel: this.addForm.tel,
            })
            .then((res) => {
              if (res.status === 0) {
                // 更新数据
                this.$emit('update:addDeviceByOneVisible', false);
                this.$emit('initCurrentPageTable');

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
                message: '数据更新失败，请稍后重试',
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
  },
};
</script>

<style scoped lang="scss">
.formBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  .el-form-item {
    width: 70%;
  }
  /deep/ .el-select {
    width: 100%;
  }
}
.dialog-footer {
  text-align: right;
}
</style>
