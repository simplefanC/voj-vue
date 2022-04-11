<template>
  <div>
    <div class="container">
      <el-card body-style="{backgroud-color:gray}" shadow="always">
        <h2 style="text-align: center;">
          {{ $t('m.Set_New_Password') }}
        </h2>
        <el-form
            ref="formResetPassword"
            :model="formResetPassword"
            :rules="rules"
        >
          <el-form-item prop="username">
            <el-input
                v-model="formResetPassword.username"
                :disabled="true"
                prefix-icon="el-icon-user-solid"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
                v-model="formResetPassword.password"
                :placeholder="$t('m.Set_New_Password_Msg')"
                prefix-icon="el-icon-lock"
                type="password"
            ></el-input>
          </el-form-item>
          <el-form-item prop="passwordAgain">
            <el-input
                v-model="formResetPassword.passwordAgain"
                :placeholder="$t('m.Set_New_Password_Again_Msg')"
                prefix-icon="el-icon-lock"
                type="password"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="footer">
          <el-button
              :loading="btnLoading"
              type="primary"
              @click="handleResetPwd"
          >
            {{ $t('m.Set_New_Password') }}
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import api from '@/common/api';
import {mapActions} from 'vuex';
import mMessage from '@/common/message';

export default {
  data() {
    const CheckUsernameNotExist = (rule, value, callback) => {
      api.checkUsernameOrEmail(value, undefined).then(
          (res) => {
            if (res.data.data.username === false) {
              callback(new Error(this.$i18n.t('m.The_username_does_not_exists')));
            } else {
              callback();
            }
          },
          (_) => callback()
      );
    };
    const CheckPassword = (rule, value, callback) => {
      if (this.formResetPassword.password !== '') {
        // 对第二个密码框再次验证
        this.$refs.formResetPassword.validateField('passwordAgain');
      }
      callback();
    };

    const CheckAgainPassword = (rule, value, callback) => {
      if (value !== this.formResetPassword.password) {
        callback(new Error(this.$i18n.t('m.Password_does_not_match')));
      }
      callback();
    };
    return {
      btnLoading: false,
      formResetPassword: {
        username: '',
        password: '',
        passwordAgain: '',
        code: '',
      },
      rules: {
        username: [
          {
            required: true,
            message: this.$i18n.t('m.Username_Check_Required'),
            trigger: 'blur',
          },
          {validator: CheckUsernameNotExist, trigger: 'blur'},
        ],
        password: [
          {
            required: true,
            message: this.$i18n.t('m.Password_Check_Required'),
            trigger: 'blur',
          },
          {
            min: 6,
            max: 20,
            trigger: 'blur',
            message: this.$i18n.t('m.Password_Check_Between'),
          },
          {validator: CheckPassword, trigger: 'blur'},
        ],
        passwordAgain: [
          {
            required: true,
            message: this.$i18n.t('m.Password_Again_Check_Required'),
            trigger: 'blur',
          },
          {validator: CheckAgainPassword, trigger: 'change'},
        ],
      },
    };
  },
  created() {
    let username = this.$route.query.username;
    let code = this.$route.query.code;
    if (username) {
      this.formResetPassword.username = username;
    }
    if (code) {
      this.formResetPassword.code = code;
    }
  },
  methods: {
    ...mapActions(['changeModalStatus']),
    handleResetPwd() {
      this.$refs['formResetPassword'].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          let data = Object.assign({}, this.formResetPassword);
          delete data.passwordAgain;
          api.resetPassword(data).then(
              (res) => {
                this.btnLoading = false;
                mMessage.success(this.$i18n.t('m.Your_password_has_been_reset'));
                this.$router.replace({
                  path: '/',
                });
                this.changeModalStatus({
                  mode: 'Login',
                  visible: true,
                });
              },
              (_) => {
                this.btnLoading = false;
              }
          );
        }
      });
    },
  },
};
</script>
<style scoped>
.container {
  width: 450px;
  margin: 0 auto;
}

/deep/ .el-card {
  border: 1px solid skyblue;
  border-radius: 8px;
}

h2 {
  font-size: 22px;
  font-weight: 600;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1em;
  color: #4e4e4e;
}
</style>
