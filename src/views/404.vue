<template>
<div class="container">
  <div class="p404">
    <h1>404</h1>
    <h2>页面不存在</h2>
    <span>===></span><el-link @click="toDashboard" style="font-size: 20px">前往首页</el-link>
    <span><===</span>
</div>
</div>
</template>
<script setup lang="ts">
import {useUserStore} from "@/stores/user";
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";

const useStore = useUserStore();
const router = useRouter()
function toDashboard() {
  //已登录
  if (useStore.getToken != '') {
    router.push({
      path: '/'
    })
  } else {
    ElMessage.warning('请先登录')
    router.push({
      path: '/'
    })
  }
}
</script>

<style scoped lang="scss">
.container{
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  h1{
    color: red;
    font-size: 80px;
    text-align: center;

  }
  h2{
    margin-left: 13px;
    margin-bottom: 100px;
    text-align: center;
  }
  .p404{
  span{
    font-size: 20px;
  }
  }

}
</style>