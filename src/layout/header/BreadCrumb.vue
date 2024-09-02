<template>
  <el-breadcrumb class="bred" separator="/">
    <el-breadcrumb-item v-for="item in tabs">
      <template #default>
        <span class="bred-item">{{ item.meta.title }}</span>
      </template>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import {type Ref, watch, ref} from 'vue'
import {useRoute, type RouteLocationMatched} from "vue-router";
//定义面包屑导航数据
const tabs: Ref<RouteLocationMatched[]> = ref([])
const route = useRoute();
//获取面包屑函数
const getBreadcrumb = () => {
  let mached = route.matched.filter((item) => item.meta && item.meta.title)
  //获取第一个数据
  const first = mached[0]
  //判断是否是首页，不是，自己构造
  if (first.path !== '/dashboard') {
    mached = [{path: '/dashboard', meta: {title: '首页'}} as any].concat(mached)
  }
  tabs.value = mached;
}
//调用面包屑函数
getBreadcrumb()
//监听当前路由,生产面包屑
watch(
    () => route.path,
    () => getBreadcrumb()
)
</script>

<style scoped lang="scss">
.bred {
  margin-left: 20px;

}

//修改字体颜色
:deep(.el-breadcrumb__inner) {
  color: #fff !important;
}

:deep(.el-breadcrumb__inner a) {
  color: #fff !important;
}

</style>