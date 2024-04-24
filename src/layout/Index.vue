<!--总体布局页面-->
<template>
  <el-container class="layout">
    <!--左侧根据MenuBar自适应做菜单宽度-->
    <el-aside width="auto" class="aside">
      <!--菜单-->
      <MenuBar/>
    </el-aside>
    <!--右侧内容-->
    <el-container>
      <el-header class="header">
        <!--头部-->
        <Header/>
      </el-header>
      <!--主要部分-->
      <el-main class="main">
        <div class="tabs">
          <Tabs class="tabs-content"></Tabs>
          <CloseTabs ></CloseTabs>
        </div>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import Header from "@/layout/header/Header.vue";
import MenuBar from "@/layout/menu/MenuBar.vue";
import Tabs from "@/layout/tabs/Tabs.vue";
import CloseTabs from "@/layout/tabs/CloseTabs.vue";
import ShoppingCart from "@/views/system/User/ShoppingCart.vue";
</script>

<style scoped lang="scss">
.layout {
  height: 100%;

  .aside {
    background-color: #304156;
    box-shadow: rgba(0, 0, 0, 0.24) 2px 3px 5px;
  }

  .main {
    padding: 0;
    margin: 0;

    .tabs {
      display: flex;
      justify-content: space-between;
      flex-grow: 1;
      .el-tabs{
        --el-tabs-header-height: 30px;
      }
    }
  }

  .header {
    background-color: #32a59a;
    display: flex;
    align-items: center;
    box-shadow: rgba(0, 0, 0, 0.24) 0 2px 5px;
    height: 50px;
  }
}

</style>