import { defineStore } from 'pinia'
import { getMenuListApi } from '@/api/menu'
import type { RouteRecordRaw } from 'vue-router'
import ShoppingCart from '@/views/system/User/ShoppingCart.vue'
import Layout from '@/layout/Index.vue'

//获取views下的所有vue文件
const modules = import.meta.glob('../../views/**/*.vue')
//定义一个store
export const useMenuStore = defineStore('menuStore', {
    state() {
        return {
            collapse: false,
            //路由菜单数据
            menuList: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: 'Layout',
                    meta: {
                        title: '首页',
                        icon: 'HomeFilled',
                        roles: ['sys:dashboard']
                    }
                }
            ]
        }
    },
    getters: {
        getCollapse(state) {
            return state.collapse;
        },
        getMenu(state){
            return state.menuList;
        }
    },
    actions: {
        setCollapse(collapse: boolean) {
            this.collapse = collapse
        },
        //获取菜单数据
        getMenuList(router: any, userId: string) {
            return new Promise((resolve, reject) => {
                getMenuListApi(userId).then((res: any) => {
                    let accessRouter;
                    if (res && res.code == 200) {
                        //生成路由
                        accessRouter = generateRoute(res.data, router) as any
                        this.menuList = this.menuList.concat(accessRouter)
                    }
                    //成功
                    resolve(this.menuList)
                    //失败
                }).catch(err => {
                    reject(err)
                })
            })
        },
        
        persist: {
            //存储的key
            key: 'menu',
            //存储位置
            storage: localStorage,
            //需要存储的数据
            paths: ['collapse','menuList']
        }
    }
})

/**
 *  //动态生成路由,根据提供的路由记录数组和路由实例，生成并处理路由配置。
 * @param routes 路由记录数组，包含待处理的路由信息。
 * @param router 路由实例，用于添加生成后的路由配置。
 * @returns 返回处理后的路由记录数组。
 */
export function generateRoute(routes: RouteRecordRaw[], router: any) {
    // 初始化处理后的路由数组
    const res: Array<RouteRecordRaw> = [];
    // 遍历每个路由记录
    routes.forEach((route: any) => {
        // 复制当前路由记录，避免直接修改原始数据
        const tmp = { ...route };
        const component = tmp.component;
        // 根据组件名生成实际的路由组件
        if (route.component) {
            if (component == 'Layout') {
                tmp.component = Layout; // 如果组件名为Layout，则替换为定义好的Layout组件
            } else {
                // 通过相对路径动态导入组件
                tmp.component = modules[`../../${component}`]
            }
        }
        // 处理子路由
        if (tmp.children && tmp.children.length > 0) {
            // 如果当前路由不是Layout组件且有子路由，则将子路由统一替换为Center组件
            if (route.component != 'Layout') {
                // tmp.children = Center;
            }
            // 递归处理子路由，生成子路由的组件
            tmp.children = generateRoute(tmp.children, router);
        }
        res.push(tmp);
        // 将当前路由记录添加到路由实例中
        router.addRoute(tmp);
    })
    // 返回处理后的路由记录数组
    return res;
}
