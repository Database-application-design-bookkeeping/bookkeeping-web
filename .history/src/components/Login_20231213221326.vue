<template>
  <!-- 登录组件 -->
  <div class="login" v-if="isShowLogin">
    <div class="mask">
      <div class="container">
        <div class="close"><el-icon class="close-bold" @click="isShowLogin = false">
            <CloseBold />
          </el-icon></div>
        <div class="login-head">
          布克瓶记账系统
        </div>
        <div class="login-title">{{ loginMsg.title }}</div>
        <el-form ref="ruleFormRef" :model="ruleForm" status-icon class="demo-ruleForm">
          <el-form-item prop="email" v-if="loginMsg.title === '邮箱登录' || loginMsg.title === '注册账号'">
            <el-input class="login-content" v-model="ruleForm.email" autocomplete="off" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item prop="username" v-if="loginMsg.title === '账号登录' || loginMsg.title === '注册账号'">
            <el-input class="login-content" v-model="ruleForm.username" autocomplete="off" placeholder="请输入用户名"
              minlength="6" maxlength="20" />
          </el-form-item>
          <el-form-item prop="password" v-if="loginMsg.title == '账号登录' || loginMsg.type === '注册'">
            <el-input class="login-content" v-model="ruleForm.password" type="password" autocomplete="off"
              placeholder="请输入密码" />
          </el-form-item>
          <el-form-item prop="password" v-if="loginMsg.type === '注册'">
            <el-input class="login-content" v-model="ruleForm.checkPass" type="password" autocomplete="off"
              placeholder="确认密码" />
          </el-form-item>
          <el-form-item prop="verificationCode" v-if="loginMsg.title === '邮箱登录'">
            <el-input class="login-content" v-model="ruleForm.verificationCode" autocomplete="off" placeholder="请输入验证码" />
            <el-button class="ver-btn" @click="sendVerificationCode">发送验证码</el-button>
          </el-form-item>
          <el-form-item>
            <div class="itme-box">
              <div class="login-item" @click="switchLoginMsg('登录', true)">{{ loginMsg.leftItem }}</div>
              <div class="login-item" @click="switchLoginMsg('注册', true)" v-if="loginMsg.type === '登录'">{{
                loginMsg.rightItem
              }}</div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button class="login-content" @click="log" type="primary">{{ loginMsg.type }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Login"
}
</script>
<script setup>
import { inject, reactive, ref } from "vue";
import axios from 'axios';
import store from '@/store';
const reload = inject("reload")
let isShowLogin = ref(true)

let textMsg = {
  login: "登录",
  signup: "注册",
  loginByUsername: "账号登录",
  loginByEmail: "邮箱登录",
  title_signup: "注册账号",
  placeholder_user: "请输入用户名",
  placeholder_email: "请输入邮箱"
}

//界面信息
let loginMsg = reactive({
  title: textMsg.loginByUsername,
  type: textMsg.login,
  leftItem: textMsg.loginByEmail,
  rightItem: textMsg.signup,
  placeholder: textMsg.placeholder_user
});

function setStoreMsg(token, username) {
  localStorage.setItem("token", token);
  localStorage.setItem("username", username);
  store.commit("setToken", { token, username });
}
//清空&初始化表单
function initForm() {
  ruleForm.username = "";
  ruleForm.password = "";
  ruleForm.checkPass = "";
  ruleForm.email = "";
  ruleForm.verificationCode = "";
}

//切换界面信息
function switchLoginMsg(data, isSwitch) {
  isShowLogin.value = true;
  if (data == "登录" || data == "") {
    if (loginMsg.leftItem == "账号登录") {
      loginMsg.title = textMsg.loginByUsername;
      loginMsg.type = textMsg.login;
      loginMsg.leftItem = textMsg.loginByEmail;
      loginMsg.rightItem = textMsg.signup;
      loginMsg.placeholder = textMsg.placeholder_user
    } else if (loginMsg.leftItem == "邮箱登录" && isSwitch) {
      loginMsg.title = textMsg.loginByEmail;
      loginMsg.type = textMsg.login;
      loginMsg.leftItem = textMsg.loginByUsername;
      loginMsg.rightItem = textMsg.signup;
      loginMsg.placeholder = textMsg.placeholder_email
    }
  } else if (data == "注册") {
    loginMsg.title = textMsg.title_signup;
    loginMsg.type = textMsg.signup;
    loginMsg.leftItem = textMsg.loginByUsername;
    loginMsg.rightItem = textMsg.signup;
    loginMsg.placeholder = textMsg.placeholder_user
  }
  initForm()
}

const ruleFormRef = ref();
const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

//表单信息
const ruleForm = reactive({
  username: "",
  password: "",
  checkPass: "",
  email: "",
  verificationCode: "",
});

//账号密码登录
function usernameLog() {
  axios({
    method: "post",
    url: "/user/login",
    data: {
      "username": ruleForm.username,
      "password": ruleForm.password
    }
  }).then((res) => {
    if (res.data.msg == "登录成功") {
      isShowLogin.value = false;
      let token = res.data.data
      let user = JSON.parse(decodeURIComponent(escape(window.atob(token.split('.')[1])))).username
      console.log(user);
      setStoreMsg(token, user)
      store.commit("sucMessage", res.data.msg)
      reload()
    } else {
      store.commit("warnMessage", res.data.msg)
    }
  }).catch((err) => {
    store.commit("warnMessage", err)
  })
}

//注册
function register() {
  if (ruleForm.password == ruleForm.checkPass) {
    if (regEmail.test(ruleForm.email)) {
      axios({
        method: "post",
        url: "/user/registerre",
        data: {
          "username": ruleForm.username,
          "password": ruleForm.password,
          "email": ruleForm.email
        }
      }).then((res) => {
        let msg = res.data.msg;
        if (msg == "注册成功") {
          store.commit("sucMessage", msg)
          switchLoginMsg("登录", true)
        } else {
          store.commit("warnMessage", msg)
        }
      }).catch((err) => {
        store.commit("warnMessage", err)
      })
    } else {
      store.commit("warnMessage", "请输入正确的邮箱")
    }
  } else {
    store.commit("warnMessage", "两次密码输入结果不同")
  }
}

//登录方式判断
function log() {
  if (loginMsg.type == "登录") {
    if (loginMsg.title == "账号登录") {
      usernameLog();
    } else if (loginMsg.title == "邮箱登录") {
      emailLog();
    }
  } else if (loginMsg.type == "注册") {
    register();
  }
}

//发送邮箱验证码
function sendVerificationCode() {
  axios({
    url: `/user/sendCode?email=${ruleForm.email}`,
  }).then((res) => {
    let msg = res.data.msg
    if (msg == "邮箱验证码发送成功") {
      store.commit("sucMessage", msg)
      /* verBtnMsg.value = "" */
    } else {
      store.commit("warnMessage", msg)
    }
  }).catch((err) => {
    store.commit("warnMessage", err)
  })
}

//邮箱登录
function emailLog() {
  if (regEmail.test(ruleForm.email)) {
    axios({
      method: "post",
      url: "/user/loginByEmail",
      data: {
        "email": ruleForm.email,
        "code": ruleForm.verificationCode
      }
    }).then((res) => {
      let msg = res.data.msg
      if (msg == "登录成功") {
        isShowLogin.value = false;
        setStoreMsg(res.data.data.token, res.data.data.username)
        store.commit("sucMessage", res.data.msg)
        reload()
      } else {
        store.commit("warnMessage", msg)
      }
    }).catch((err) => {
      store.commit("warnMessage", err)
    })
  } else {
    store.commit("warnMessage", "请输入正确的邮箱")
  }
}

//判断是否需要登录
function isLogin() {
  if (store.getters.token || localStorage.getItem("token")) {
    isShowLogin.value = false;
    return true
  } else {
    // 第二个参数为false的作用是让账号登录为默认登录方式
    switchLoginMsg("登录", false)
    return false
  }
}

//暴露切换页面信息的函数
defineExpose({
  switchLoginMsg,
  isLogin
})
</script>

<style lang="scss" scoped>
.login {
  position: fixed;
  box-sizing: border-box;
  inset: 0px;
  width: 100%;
  height: 100%;
  z-index: 99;

  .mask {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    background-size: cover;

    .container {
      width: 320px;
      background-color: rgb(255, 255, 255);
      padding: 32px;
      border-radius: 20px;

      .close {
        display: flex;
        justify-content: right;

        .close-bold {
          cursor: pointer;
        }
      }

      .login-head {
        text-align: center;
        font-size: 24px;
      }

      .login-content {
        width: 100%;
        height: 38px;
        font-size: 14px;
        line-height: 24px;
      }

      .ver-btn {
        position: absolute;
        right: 10px;
        display: inline-block;
        line-height: 30px;
        border: 0;
        padding: 0;

        &:hover {
          background-color: rgb(255, 255, 255);
        }
      }

      .itme-box {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }

      .login-title {
        font-size: 20px;
        line-height: 28px;
        font-weight: 500;
        margin: 32px 0 28px 0;
      }

      .login-item {
        color: rgb(38, 38, 38, 0.75);
        font-size: 14px;
        line-height: 22px;
        cursor: pointer;
      }
    }
  }
}
</style>