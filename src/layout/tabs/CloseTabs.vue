<template>
  <div class="close">
    <el-dropdown>
    <span class="el-dropdown-link">
      <el-icon class="el-icon--right">
    <Close/>
      </el-icon>
      关闭
    </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="closeCurrent()">关闭当前</el-dropdown-item>
          <el-dropdown-item @click="closeLeft()">关闭左侧</el-dropdown-item>
          <el-dropdown-item @click="closeRight()">关闭右侧</el-dropdown-item>
          <el-dropdown-item @click="closeAll()">关闭所有</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import {Close} from "@element-plus/icons-vue";
import type {Tab} from "@/stores/tabs";
import {useRouter, useRoute} from 'vue-router'
import {useTabStore} from "@/stores/tabs"

const tabStore = useTabStore()
const route = useRoute()
const router = useRouter()
//关闭当前
const closeCurrent = () => {
  //首页不能关闭
  if (route.path === '/dashboard') {
    return
  }
  const targetName = route.path
  //Tab类型数组
  const tabs = tabStore.getTab
  //激活选项卡
  let activeName = route.path
  //如果激活的选项卡是待删除的选项卡，则激活前一个选项卡
  if (activeName === targetName) {
    //遍历tabs
    tabs.forEach((tab: Tab, index: number) => {
      //如果tab的path等于待删除的选项卡的path，则激活前一个选项卡
      if (tab.path === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.path
        }
      }
    })
  }
  //重新设置选项卡数据
  tabStore.tabList = tabs.filter((tab) => tab.path !== targetName)
  //跳转路由到新激活选项卡
  router.push({path: activeName})
}
//关闭左侧
const closeLeft = () => {
  const path = route.path
//获取当前选项卡路由的索引
  let index = tabStore.tabList.findIndex(item => item.path === path)
  //从1开始，首页不能删除
  tabStore.tabList.splice(1, index - 1)
}

//关闭右侧
const closeRight = () => {
  const path = route.path
  //获取当前选项卡路由的索引
  let index = tabStore.tabList.findIndex(item => item.path === path)
  tabStore.tabList.splice(index + 1)
}

//关闭所有
const closeAll = () => {
tabStore.tabList.splice(1,tabStore.tabList.length-1)
  //跳转到首页
  router.push({path: '/dashboard'})
}
</script>

<style scoped lang="scss">
.close {
  width: 60px;
  height: 30px;
  position: fixed;
  top: 60px;
  right: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e4e7ed;
  border-right: none;
  border-radius: 2px;
  padding-right: 10px;
  cursor: pointer;
  background-color: #4780b6;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  color: #f3f3f3;
  font-size: 15px;
  outline: none;
}

</style>