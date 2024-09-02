<template>
  <div class="header-container">
    <div class="left">
      <Collapse></Collapse>
      <BreadCrumb></BreadCrumb>
    </div>
    <div class="right">
      <NotifitionBell></NotifitionBell>
      <span style="padding-right: 20px;color: #fff;font-family:楷体,sans-serif;font-size: 20px">{{ welcomeText }}</span>
      <Dropdown></Dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import Collapse from "@/layout/header/Collapse.vue";
import BreadCrumb from "@/layout/header/BreadCrumb.vue";
import Dropdown from "@/layout/header/Dropdown.vue";
import {useUserStore} from '@/stores/user'
import {computed} from 'vue'
import NotifitionBell from "@/components/NotifitionBell.vue";

const userStore = useUserStore()
const nickName = userStore.getNickName
const welcomeText = computed(() => {
  return nickName != '' ? `欢迎你，${nickName}` : '未登录';
})

</script>

<style scoped lang="scss">
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .left {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .right {
    display: flex;
    align-items: center;
  }
}

</style>