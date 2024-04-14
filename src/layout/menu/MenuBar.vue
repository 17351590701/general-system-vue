<template>
  <!--logo-->
  <MenuLogo/>
  <!--配置router属性，将会以：index中的menu.path进行跳转 -->
  <el-menu
      :default-active="defaultActive"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="#2e4057"
      router
  >
    <MenuItem :menuList="menuList"/>
  </el-menu>
</template>
<script setup lang="ts">
import {computed, reactive} from 'vue'
import MenuItem from "./MenuItem.vue";
import MenuLogo from "./menuLogo.vue";
import {useRoute} from "vue-router";
import {useMenuStore} from "@/stores/menu";

const route = useRoute();
// 当前激活的菜案
const defaultActive = computed(() => {
  // 获取路由中的path属性返回
  const {path} = route
  return path
})

const menuStore = useMenuStore();
const isCollapse = computed(() => {
  return menuStore.getCollapse
})
const menuList = reactive([
  {
    path: '/dashboard',
    name: 'dashboard',
    component: "dashboard/Index",
    meta: {
      title: '首页',
      icon: 'House',
      roles: ['sys:dashboard']
    }
  },
  {
    path: '/system',
    name: 'system',
    component: "Layout",
    meta: {
      title: '系统管理',
      icon: 'Setting',
      roles: ['sys:manage']
    },
    children: [
      {
        path: '/roleList',
        name: 'roleList',
        component: "/system/Role/RoleList",
        meta: {
          title: '角色管理',
          icon: 'User',
          roles: ['sys:role']
        },
      },
      {
        path: '/userList',
        name: 'userList',
        component: "/system/UserList",
        meta: {
          title: '用户管理',
          icon: "UserFilled",
          roles: ["sys:user"]
        },
      },
      {
        path: '/menuList',
        name: 'menuList',
        component: "/system/Menu/MenuList",
        meta: {
          title: '菜单管理',
          icon: 'Menu',
          roles: ['sys:menu']
        },
      },
    ],
  },
  {
    path: '/goodsRoot',
    name: 'goodsRoot',
    component: "Layout",
    meta: {
      title: "商品管理",
      icon: "Shop",
      roles: ['sys:goodsRoot'],
    },
    children: [
      {
        path: '/category',
        name: 'category',
        component: "/goods/Category",
        meta: {
          title: '物资类型',
          icon: "Box",
          roles: ["sys:category"],
        },
      },
      {
        path: '/goodList',
        name: 'goodList',
        component: "/goods/GoodList",
        meta: {
          title: '商品信息',
          icon: "Wallet",
          roles: ["sys:goodsList"],
        }
      }
    ]
  }
])


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