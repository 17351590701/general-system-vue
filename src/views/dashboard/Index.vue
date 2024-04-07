<template>
<div>
  首页
  <button @click="getList()">点击</button>
</div>
</template>

<script setup lang="ts">
import request from '@/utils/request'
import {reactive} from "vue";

const tabList = reactive([
  {

  }
])
function getList(){
  request.get('/users').then(res => {
    console.log(res.data)
  })

}
</script>

<style scoped lang="scss">

</style>