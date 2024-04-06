<template>
  <el-icon @click="menuStore.setCollapse(!menuStore.getCollapse)"
           style="cursor:pointer"
           color="#fff" size="30">
    <!--创建动态组件，切换图标-->
    <component :is="status?Fold:Expand"></component>
  </el-icon>
</template>

<script setup lang="ts">
import {useMenuStore} from '@/stores/menu'
import {computed} from "vue";
import {Fold, Expand} from "@element-plus/icons-vue";
//获取pinia的store
const menuStore = useMenuStore()
//获取状态
const status = computed(() =>{
  return menuStore.getCollapse
})
</script>

<style scoped lang="scss">

</style>