<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">{{ $t('login.title') }}</h3>    <!-- 系统登录 -->
        <el-tooltip :content="$t('navbar.langSelect')" effect="light" placement="bottom"> <!-- 选择语言 -->
          <lang-select class="set-language" />
        </el-tooltip>
      </div>

      <el-form-item prop="userName">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <!-- 账号 -->
        <el-input
          ref="userName"
          v-model.trim="loginForm.userName"
          :placeholder="$t('login.userName')"
          name="userName"
          type="text"
          tabindex="1"
          @blur="refreshCode"
        />
      </el-form-item>

      <el-form-item prop="pwd">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <!-- 密码 -->
        <el-input
          :key="passwordType"
          ref="password"
          v-model.trim="loginForm.pwd"
          :type="passwordType"
          :placeholder="$t('login.password')"
          name="password"
          tabindex="2"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item prop="validateCode">
        <div class="code-box">
          <span class="svg-container">
            <svg-icon icon-class="iconfuhao" />
          </span>
          <!-- 验证码 -->
          <el-input
            ref="validateCode"
            v-model.trim="loginForm.validateCode"
            tabindex="3"
            :placeholder="$t('login.validateCode')"
            @keyup.enter.native="handleLogin"
          />
          <div class="refresh-code" @click="refreshCode()">
            <el-image
              style="width: 100%; height: 100%"
              :src="codeUrl"
              fit="fit"
            />
          </div>
        </div>
      </el-form-item>

      <!-- 登录 -->
      <el-button :loading="loading" tabindex="4" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">
        {{ $t('login.logIn') }}
      </el-button>
    </el-form>
    <div class="version">{{ 'V' + version }}</div>
  </div>
</template>

<script>
import md5 from 'js-md5'
import LangSelect from '@/components/LangSelect'
import { refreshCode } from '@/api/user'
import { encrypt } from '@/utils/crypto'

export default {
  name: 'Login',
  components: { LangSelect },
  data() {
    return {
      // 版本
      version: '',

      codeUrl: '',
      loginForm: {
        userName: '',
        pwd: '',
        validateCode: ''
      },
      loading: false,
      passwordType: 'password'
    }
  },
  computed: {
    loginRules() {
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error(this.$t('login.pwdNumber'))) /* 密码不能少于6位 */
        } else {
          callback()
        }
      }
      return {
        userName: [{ required: true, message: this.$t('login.iptUserName'), trigger: 'blur' }], /* 请输入用户名 */
        pwd: [{ required: true, trigger: 'blur', validator: validatePassword }],
        validateCode: [{ required: true, message: this.$t('login.iptVaildateCode'), trigger: 'blur' }] /* 请输入验证码 */
      }
    }
  },
  mounted() {
    // const keys = '_aes_secret_key_'
    // const ivStr = '_aes_secret_iv__'
    // const a = encrypt('8a046be8a29b68d310583174184a29c7', keys, ivStr)
    // console.log(a)
    // const b = decrypt('BeyfxMjl9PhyuitQdPNM6fkfUXH+himz9uTnXqkPMis=', keys, ivStr)
    // console.log(b)
    this.version = localStorage.getItem('projectVersion')
    this.refreshCode()
  },
  methods: {
    // 获取验证码
    async refreshCode() {
      const res = await refreshCode({ name: this.loginForm.userName })
      this.codeUrl = window.URL.createObjectURL(res)
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.loginForm.that = this

          this.loginForm.password = encrypt(md5(this.loginForm.pwd), this.keys, this.ivStr)
          // this.loginForm.password = md5(this.loginForm.pwd)

          this.$store.dispatch('user/login', this.loginForm)
            .then((res) => {
              if (res.code !== '0') {
                this.refreshCode()
                this.loading = false
                this.loginForm.validateCode = ''
                return this.$message.error(res.message || 'Error')
              }
              this.sessionData('set', 'login_user', res.data)
              this.$store.dispatch('permission/generateRoutes', res.data.permissions)
              if (res.data.userType === 10) {
                // 获取所有公司名和id
                this.$store.dispatch('options/getCompanyNameOptions')
                // 获取所有市场类型
                this.$store.dispatch('options/getMarketTypeOptions')
                // 获取所有催收等级
                this.$store.dispatch('options/getCollectionLevelOptions')
              }
              // 判断权限
              this.$store.dispatch('permission/getPermission', res.data)
              this.$store.dispatch('app/setLanguage', this.sessionData('get', 'language') || 'zh')
              this.$router.push('/')
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.version {
  position: absolute;
  right: 20px;
  bottom: 10px;
  color: #eee;
}

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;

    .code-box {
      display: flex;
      justify-content: space-between;
      .refresh-code {
        width: 36%;
        height: 50px;
        box-sizing: border-box;
        cursor: pointer;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
