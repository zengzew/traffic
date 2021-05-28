<template>
  <div class="sys-login">
    <div class="login-area-left">
      <div class="logo">
        <img class="logo-img" src="~sysStatic/images/logo.png" alt />
        <!-- <slot name="logo"></slot> -->
        <h1>车辆轨迹管理平台</h1>
      </div>
      <div class="form-group"></div>
    </div>
    <div class="homepage-hero-module">
<!--      <img src="../../assets/images/BG@2x.png" />-->
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import * as lbs from './login/js/index.js';
import setTheme from '@/util/setTheme';

export default {
  data() {
    return {
      loginForm: {
        name: '',
        password: '',
        captcha: '',
      },
      loginRules: {
        name: [{ required: true, message: '', trigger: 'blur' }],
        password: [{ required: true, message: '', trigger: 'blur' }],
        captcha: [{ required: false, message: '', trigger: 'blur' }],
      },
      captcha: {
        show: false,
        src: '',
      },
      sysMsg: '',
      vedioCanPlay: false,
      fixStyle: '',
    };
  },
  computed: {
    ...mapState({
      lang: (state) => state.lang,
      theme: (state) => state.theme,
      name: (state) => state.name,
    }),
  },
  watch: {
    'captcha.show'(val) {
      this.loginRules.captcha[0].required = val;
    },
  },
  beforeMount() {
    // 初始化错误信息。保证单独点击input时可以弹出正确的错误提示
    this.setErrMsg();
  },
  mounted() {
    console.log('lbs', lbs);

    lbs.component.initComponent(this.initLogin);
  },
  methods: {
    ...mapActions({
      login: 'auth/loginByEmail',
      loadLang: 'loadLang',
    }),
    initLogin() {
      const obj = {
        url: 'https://lbs.qq.com/',
        url_text: '返回首页',
        text: '已注册成功，',
      };
      lbs.component.login.init(obj);
      lbs.component.login.show();
    },
    submitForm() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // console.log(this.$md5(this.loginForm.password),'------')
          const dataTime = parseInt(new Date().getTime() / 1000).toString();
          const passwordMd5 = this.$md5(`${this.$md5(this.loginForm.password)}gmap.qq.com${dataTime}`);
          this.login({
            username: this.loginForm.name,
            password: passwordMd5,
            timeStamp: dataTime, // 当前时间
          }).then((res) => {
            if (res.status === 0) {
              this.$router.push('/home');
            } else {
              this.sysMsg = res.message;
              this.captcha.show = true;
              this.captcha.src = res.key;
            }
          });
        } else {
          return false;
        }
      });
    },
    changeLang(val) {
      if (val == this.lang) return;
      // 切换语言后重新加载语言包，并对重置登陆表单
      this.loadLang(val).then(() => {
        this.setErrMsg();
        this.$refs.loginForm.resetFields();
      });
    },
    changeTheme(val) {
      if (val == this.lang) return;
      setTheme(val);
      this.$store.commit('setThemeColor', val);
    },
    setErrMsg() {
      this.loginRules.name[0].message = this.$t('global.errMsg.inputRequired', {
        cont: this.$t('global.username'),
      });
      this.loginRules.password[0].message = this.$t('global.errMsg.inputRequired', {
        cont: this.$t('global.password'),
      });
      this.loginRules.captcha[0].message = this.$t('global.errMsg.inputRequired', { cont: this.$t('global.captcha') });
    },
    canplay() {
      this.vedioCanPlay = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.login-area-left {
  width: 20%;
  min-width: 280px;
  height: 100%;
  z-index: 1000000;
  position: absolute;
  float: left;
  background: #151e2e;
  box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.5);
  border-radius: 4.5px;
  border-radius: 4.5px;
  .logo {
    color: #ffffff;
    width: 100%;
    height: 100px;
    font-size: 14px;
    letter-spacing: 3px;
    // text-align: center;
    height: 125px;
    position: absolute;
    margin-top: 23px;
    // left: -45px;
    img {
      width: 160px;
    }
    .logo-img {
      width: 23px;
      float: none;
      margin-top: 0px;
      margin-right: 0;
      margin-left: 18px;
    }
  }
  h1 {
    width: 80%;
    display: inline;
    font-family: TTTGBMedium;
    font-size: 16px;
    color: #ffffff;
    font-weight: 600;
    letter-spacing: 0;
    font-style: oblique;
  }
}
.form-group {
  width: 80%;
  display: inline-block;
  position: absolute;
  top: 42%;
  left: 50%;
  transform: translate(-50%, -50%);
  // position: relative;
  padding-bottom: 20px;
  color: #fff;
  overflow: hidden;

  input::-webkit-input-placeholder {
    color: #7e9fb0;
  }

  /*.el-input__inner {
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    background-color: $loginInputBg;
    border: 1px solid $loginInputBorderColor;
    border-radius: 4px;
    color: $loginInputColor;
    font-size: 15px;
    overflow: hidden;

    &:hover{
      border-color: #409eff;
    }
    &:focus{
      border-color: #409eff;
    }
  }
  .el-form-item{
    &.is-error .el-input__inner{
      border-color: $red;
      background-color: $loginInputErrBg;
    }
    &.captcha {
      .el-input{
        width: auto;
      }
      input{
        width: 200px;
      }
      img{
        float: right;
        width: 100px;
        height: 40px;
      }
    }
  }
  .el-form-item__error{
    color: $loginErrTextColor;
  }*/
}

.homepage-hero-module {
  position: relative;
  width: 80%;
  height: 100%;
  float: right;
  background-color: #2e3244;
  img {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
}
</style>
