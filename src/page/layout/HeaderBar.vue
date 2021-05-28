<template>
  <div class="sys-header">
    <div class="logo">
      <img class="logo-img" src="~sysStatic/images/logo.png" alt="" />
      <slot name="logo"></slot>
    </div>
    <slot name="topnav"></slot>
    <div class="userInfo">
      <ul>
        <li>
          <el-dropdown @command="userOperation">
            <span class="user">{{ username }}<i class="el-icon-caret-bottom el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item command="editPaw">{{$t('global.editpassword')}}</el-dropdown-item> -->
              <el-dropdown-item command="backToManage">{{ $t('global.businessManage') }}</el-dropdown-item>
              <el-dropdown-item command="logout">{{ $t('global.logout') }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="dialog.editPaw.show"
      :modal-append-to-body="false"
      custom-class="editPawDialog"
    >
      <el-form :model="editPaw" :rules="editPawRules" ref="editPaw" label-width="100px">
        <el-form-item label="旧密码" prop="oldPaw">
          <el-input v-model="editPaw.oldPaw" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPaw">
          <el-input v-model="editPaw.newPaw" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmNewPaw">
          <el-input v-model="editPaw.confirmNewPaw" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="textC">
        <el-button type="primary" @click="editPawSubmit">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import AuthFn from '../../util/auth';

export default {
  data() {
    return {
      dialog: {
        editPaw: {
          show: false,
        },
      },
      hasNameChange: false,
      editPaw: {
        oldPaw: '',
        newPaw: '',
        confirmNewPaw: '',
      },
      editPawRules: {
        oldPaw: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPaw: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' },
          {
            // eslint-disable-next-line
                        validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[a-z0-9]+$/.test(value)) {
                ('不符合输入规则');
                errors.push('请输入字母或特殊字符');
              }
              callback(errors);
            },
          },
        ],
        confirmNewPaw: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' },
          {
            // eslint-disable-next-line
                        validator(rule, value, callback, source, options) {
              const errors = [];
              if (!/^[a-z0-9]+$/.test(value)) {
                errors.push('请输入字母或特殊字符');
              }
              callback(errors);
            },
          },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      username: (state) => state.user.name,
      lang: (state) => state.lang,
    }),
  },
  methods: {
    ...mapActions({
      sysLogout: 'auth/logout',
      loadLang: 'loadLang',
    }),
    changeTheme(data) {
      this.$store.commit('setLayout', data);
    },
    changeLang(val) {
      if (val == this.lang) return;
      // 改变语言后，因为表单校验的错误提示或者后台返回的信息等问题，需要进行页面刷新
      this.loadLang(val).then(() => {
        window.location.reload();
      });
    },
    userOperation(command) {
      switch (command) {
        case 'logout':
          this.logout();
          break;
        case 'backToManage':
          this.backToManage();
          break;
        case 'editPaw':
          this.dialog.editPaw.show = true;
          break;
      }
    },
    logout() {
      this.sysLogout().then(() => {
        this.$router.push('/login');
      });
    },
    backToManage() {
      this.$router.push('/home');
    },
    editPawSubmit() {
      this.$refs.editPaw.validate((valid) => {
        if (valid) {
        } else {
          return false;
        }
      });
    },
  },
  watch: {
    username() {
      this.hasNameChange = true;
    },
  },
  mounted() {
    // 保证刷新页面时
    this.$store.dispatch('user/getUserName');
    this.$store.dispatch('auth/getPermissionList_pubNet');
    AuthFn(this);
  },
};
</script>
<style lang="scss" scoped>
.logo-img {
  width: 30px;
  float: left;
  margin-top: 14px;
  margin-right: 13px;
}
</style>
