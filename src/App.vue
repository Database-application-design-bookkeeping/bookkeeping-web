<template>
  <router-view v-if="isRouterAlive"></router-view>
</template>

<script>
import Home from './views/Home.vue';
export default {
  name: "App",
  components: {
    Home,
  },
};
</script>
<script setup>
import { ref, nextTick, provide } from "vue"
const isRouterAlive = ref(true)
const reload = () => {
  isRouterAlive.value = false
  nextTick(() => {
    isRouterAlive.value = true
  })
}
provide("reload", reload)
</script>
<style lang="scss" scoped></style>
