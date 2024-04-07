<template>
  <!--点击此div也会触发收缩菜单操作-->
  <div class="logo" @click="menuStore.setCollapse(!menuStore.getCollapse)">
    <img :src="logo" alt="logo图片"/>
    <!--因为文字快速显现的速度比菜单扩展快，会强行撑开，所以需要对文字进行处理-->
    <span v-if="show" class="logo-title">{{ title }}</span>
  </div>
</template>
<script setup lang="ts">
import logo from '@/assets/logo.svg';
import { ref, watchEffect} from "vue";
import {useMenuStore} from "@/stores/menu";

const menuStore = useMenuStore();

const show = ref(true)
watchEffect(()=>{
// 如果menuStore.getCollapse的值为false,即卷帘展开
  if(!menuStore.getCollapse){
    // 延时250毫秒后，将show的值设置为true，显示文字
    setTimeout(()=>{
      show.value = true
    },250)
  }else{
    show.value=false
  }
})
// 定义一个响应式变量title，初始值为"通用权限系统"
const title = ref("通用系统脚手架")
</script>


<style scoped lang="scss">
.logo {
  display: flex;
  width: 100%;
  height: 60px;
  background-color: #2e4057;
  text-align: center;
  cursor: pointer;
  align-items: center;

  img {
    width: 30px;
    height: 30px;
    margin-right: 12px;
    margin-left: 20px;
  }

  .logo-title {
    color: #fff;
    font-weight: 800;
    line-height: 60px;
    font-size: 22px;
    font-family: "HarmonyOS Sans SC Medium", sans-serif;
  }
}
</style>