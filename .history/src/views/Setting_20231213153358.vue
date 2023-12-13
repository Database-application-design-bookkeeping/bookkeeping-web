<template>
  <div class="setting">
    <el-form ref="ruleFormRef" :model="userForm" status-icon label-width="80px" label-position="left"
    class="demo-ruleForm">
        <el-form-item prop="email" label="邮箱">
          <el-input class="login-content" v-model="userForm.email" autocomplete="off" placeholder="修改邮箱信息" />
        </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input class="login-content" v-model="userForm.password" autocomplete="off" placeholder="修改密码" />
      </el-form-item>
      <el-form-item>
        <el-button class="login-content" type="primary" @click="saveUserInfo">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import store from "@/store";
import axios from "axios";
import { onMounted, reactive, ref } from "vue";

const centerDialogVisible = ref(false)

let userForm = reactive({
  username: "",
  email: ""
})
function getUserInfo() {
  axios({
    url: "/user/info"
  }).then((res) => {
    if (res.data.msg === "查询成功") {
      let msg = res.data.data;
      userForm.username = msg.username
      userForm.email = msg.email
    }
  })
}
function saveUserInfo() {
  axios({
    method:'post',
    url: "/user/update",
    data: {
      "password": userForm.password,
      "email": userForm.email
    }
  }).then((res) => {
    let msg = res.data.msg
    if (msg === "修改成功") {
      store.commit("sucMessage", msg)
    } else {
      store.commit("warnMessage", msg)
    }
  }).catch((err) => {
    console.log(err);
  })
}
onMounted(() => {
  getUserInfo()
})
</script>

<style lang="scss" scoped>
.btn-space {
  margin-top: 15px;
}
</style>