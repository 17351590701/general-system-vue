<template>
  <el-tabs
      v-model="activeTab"
      type="card"
      class="demo-tabs"
      closable
      @tab-remove="removeTab"
      @tab-click="clickBtn"
  >
    <el-tab-pane
        v-for="item in tabsList"
        :key="item.path"
        :label="item.title"
        :name="item.path"
    >
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {type Tab, useTabStore} from '@/stores/tabs'
import {useRoute, useRouter} from "vue-router";
import type {TabsPaneContext} from "element-plus";
//选中的选项卡数据
const activeTab = ref('')
const tabStore = useTabStore()
//选项卡数据
const tabsList = computed(() => {
  return tabStore.getTab
})
const route = useRoute()
const router = useRouter()
//删除tab
const removeTab = (targetName: string) => {
  //Tab类型数组
  const tabs = tabsList.value
  //激活选项卡名
  let activeName = activeTab.value
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
  //重新设置激活的选项卡
  activeTab.value = activeName
  //重新设置选项卡数据
  tabStore.tabList = tabs.filter((tab) => tab.path !== targetName)
  //跳转路由到新激活选项卡
  router.push({path: activeName})
}

//选项卡点击事件
const clickBtn = (pane: TabsPaneContext) => {
  console.log(pane)
  const {props} = pane
  //跳转路由
  router.push({path:props.name as string})
}
//点击左侧菜单时，添加为选项卡
const addTab = () => {
  const {path, meta} = route
  const tab: Tab = {
    path: path,
    title: meta.title as string
  }
  tabStore.addTab(tab)
}

//设置选项卡激活状态
function setActiveTab(){
  activeTab.value=route.path
}
//添加选项卡：监听当前路由变化
watch(
    ()=>route.path,
    () => {
  setActiveTab()
  addTab()
})

//保证页面刷新后保存有选项卡
onMounted(() =>{
  setActiveTab()
  addTab()
})
</script>

<style scoped lang="scss">

</style>