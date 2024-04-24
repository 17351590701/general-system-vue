import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import Layout from "@/layout/Index.vue";

//动态生成路由
export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "/dashboard",
        component: () => import("@/views/Dashboard.vue"),
        name: "dashboard",
        meta: {
          title: "首页",
          icon: "House",
        },
      },
      {
        path: "/shopping",
        component: () => import("@/views/system/User/ShoppingCart.vue"),
        name: "shopping",
        meta: {
          title: "购物车",
          icon: "ShoppingCart",
        },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/404",
    name: "NotPage",
    component: () => import("@/views/404.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
});

export default router;

//静态路由
// const routes: Array<RouteRecordRaw> = [
//     {
//         path: '/login',
//         name: 'login',
//         component: () => import('@/views/login/Login.vue')
//     },
//     {
//         path: '/',
//         component: Layout,
//         redirect: '/dashboard',
//         children: [
//             {
//                 path: '/dashboard',
//                 component: () => import('@/views/dashboard/Index.vue'),
//                 name: 'dashboard',
//                 meta: {
//                     title: '首页',
//                     icon: 'House'
//                 }
//             }
//         ]
//     },
//     {
//         path: '/system',
//         name: 'system',
//         component: Layout,
//         meta: {
//             title: '系统管理',
//             icon: 'Setting',
//             roles: ['sys:manage']
//         },
//         children: [
//             {
//                 path: '/userList',
//                 name: 'userList',
//                 component: () => import('@/views/system/User/UserList.vue'),
//                 meta: {
//                     title: '用户管理',
//                     icon: "UserFilled",
//                     roles: ["sys:user"]
//                 },
//             },
//             {
//                 path: '/roleList',
//                 name: 'roleList',
//                 component: () => import('@/views/system/Role/RoleList.vue'),
//                 meta: {
//                     title: '角色管理',
//                     icon: 'User',
//                     roles: ['sys:role']
//                 },
//             },
//             {
//                 path: '/menuList',
//                 name: 'menuList',
//                 component: () => import('@/views/system/Menu/MenuList.vue'),
//                 meta: {
//                     title: '菜单管理',
//                     icon: 'Menu',
//                     roles: ['sys:menu']
//                 },
//             },
//         ],
//     },
//     {
//         path: '/goodsRoot',
//         name: 'goodsRoot',
//         component: Layout,
//         meta: {
//             title: "商品管理",
//             icon: "Shop",
//             roles: ['sys:goodsRoot'],
//         },
//         children: [
//             {
//                 path: '/category',
//                 name: 'category',
//                 component: () => import('@/views/category/CategoryList.vue'),
//                 meta: {
//                     title: '物资类型',
//                     icon: "Box",
//                     roles: ["sys:category"],
//                 },
//             },
//             {
//                 path: '/goodList',
//                 name: 'goodList',
//                 component: () => import('@/views/goods/GoodsList.vue'),
//                 meta: {
//                     title: '商品信息',
//                     icon: "Wallet",
//                     roles: ["sys:goodsList"],
//                 }
//             }
//         ]
//     }
// ]
