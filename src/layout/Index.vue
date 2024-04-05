<!--总体布局页面-->
<template>
  <el-container class="layout">
<!--左侧根据MenuBar自适应做菜单宽度-->
    <el-aside width="auto" class="aside">
      <!--菜单-->
      <MenuBar />
    </el-aside>
    <!--右侧内容-->
    <el-container>
      <el-header class="header">
        <!--头部-->
        <Header/>
      </el-header>
      <!--主要部分-->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import Header from "@/layout/header/Header.vue";
import MenuBar from "@/layout/menu/MenuBar.vue";
import {ref} from "vue";
</script>

<style scoped lang="scss">
.layout{
  height: 100%;
 .aside{
   background-color: #304156;
 }
  .header{
    background-color: #009688;
    display:flex;
    align-items: center;
  }
}

</style>