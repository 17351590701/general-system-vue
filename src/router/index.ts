import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/Index.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path:'/',
      component:Layout,
      redirect:'/dashboard',
      children:[
        {
          path:'/dashboard',
          component:()=>import('@/views/dashboard/Index.vue'),
          name:'dashboard',
          meta:{
            title:'首页',
            icon:'#icondashoboard'
          }
        }
      ]
    },
    {
      path: '/system',
      name: 'system',
      component: Layout,
      meta: {
        title: '系统管理',
        icon: 'Setting',
        roles: ['sys:manage']
      },
      children: [
        {
          path: '/userList',
          name: 'userList',
          component:()=>import('@/views/system/User/UserList.vue'),
          meta: {
            title: '用户管理',
            icon: "UserFilled",
            roles: ["sys:user"]
          },
        },
        {
          path: '/roleList',
          name: 'roleList',
          component:()=>import('@/views/system/Role/RoleList.vue'),
          meta: {
            title: '角色管理',
            icon: 'User',
            roles: ['sys:role']
          },
        },
        {
          path: '/menuList',
          name: 'menuList',
          component:()=>import('@/views/system/Menu/MenuList.vue'),
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
      component: Layout,
      meta: {
        title: "商品管理",
        icon: "Shop",
        roles: ['sys:goodsRoot'],
      },
      children: [
        {
          path: '/category',
          name: 'category',
          component:()=>import('@/views/category/CategoryList.vue'),
          meta: {
            title: '物资类型',
            icon: "Box",
            roles: ["sys:category"],
          },
        },
        {
          path: '/goodList',
          name: 'goodList',
          component:()=>import('@/views/goods/GoodsList.vue'),
          meta: {
            title: '商品信息',
            icon: "Wallet",
            roles: ["sys:goodsList"],
          }
        }
      ]
    }
  ]
})

export default router
