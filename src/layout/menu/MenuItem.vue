<template>
  <template v-for="menu in menuList" :key="menu.path">
    <!--动态生成菜单-->
    <!--如果菜单有子集，就创建子菜单sub-->
    <el-sub-menu v-if="menu.children&&menu.children.length>0" :index="menu.path">
      <template #title>
        <el-icon>
          <!--动态生成图标，绑定menuBar中的icon-->
          <component :is="menu.meta.icon"></component>
        </el-icon>
        <span>{{ menu.meta.title }}</span>
      </template>
      <!--生成下级，递归调用，自己生成自己-->
      <menu-item :menu-list="menu.children"></menu-item>
    </el-sub-menu>
    <!--否则直接创建menu-item-->
    <el-menu-item v-else :index="menu.path" style="color: #f4f4f5">
      <el-icon>
        <!--动态生成图标，绑定menuBar中的icon-->
        <component :is="menu.meta.icon"></component>
      </el-icon>
      <template #title>
        <span>{{ menu.meta.title }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
//接受父组件传递的参数menuList
defineProps(['menuList'])
</script>

<style scoped lang="scss">
/*激活菜单的文字颜色*/
.el-menu-item.is-active {
  color: #409eff !important;
}

</style>