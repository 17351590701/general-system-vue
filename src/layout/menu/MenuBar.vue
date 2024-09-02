<template>
  <!--logo-->
  <MenuLogo />
  <!--配置router属性，将会以：index中的menu.path进行跳转 #2e4057 -->
  <el-menu :default-active="defaultActive" class="el-menu-vertical-demo" :collapse="isCollapse"
    background-color="#2e4057" router>
    <MenuItem :menuList="menuList" />
  </el-menu>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import MenuItem from "./MenuItem.vue";
import MenuLogo from "./menuLogo.vue";
import { useRoute } from "vue-router";
import { useMenuStore } from "@/stores/menu";

const route = useRoute();
// 当前激活的菜案
const defaultActive = computed(() => {
  // 获取路由中的path属性返回
  const { path } = route
  return path
})

const menuStore = useMenuStore();
const isCollapse = computed(() => {
  return menuStore.getCollapse
})

//动态菜单
const menuList = computed(() => {
  return menuStore.getMenu
})


</script>

<style scoped lang="scss">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 230px;
  min-height: 400px;
}

.el-menu {
  border-right: none;
}

:deep(.el-sub-menu .el-sub-menu__title) {
  color: #f4f4f5 !important;
}

:deep(.el-menu .el-menu-item) {
  color: #bfcbd9;
}

/*当前打开菜单的所有子菜单背景颜色*/
:deep(.is-opened .el-menu-item) {
  background-color: #1f2d3d !important;
}

/*鼠标悬浮菜单的颜色*/
:deep(.el-menu-item:hover) {
  background-color: #001528 !important;
}
</style>