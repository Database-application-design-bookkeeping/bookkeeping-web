<template>
  <div class="set-plan">
    <el-form>
      <el-form-item label="设置本月预支出金额">
        <el-input v-model.number="expection"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveExpection">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import store from "@/store";
import axios from "axios";
import { onMounted, ref } from "vue"
let expection = ref(0);
function saveExpection() {
  axios({
    url: `/exception/update?amount=${expection.value}`,
  }).then((res) => {
    if (res.data.msg === "修改成功") {
      store.commit("sucMessage", res.data.msg)
    } else {
      store.commit("warnMessage", res.data.msg)
    }
  })
}

function getExpection() {
  axios({
    url: "/exception"
  }).then((res) => {
    if (res.data.msg === "查询成功") {
      expection.value = res.data.data.amount
    }
  }).catch((err) => {
    console.log(err);
  })
}
onMounted(() => {
  getExpection()
})
</script>

<style lang="scss" scoped></style>