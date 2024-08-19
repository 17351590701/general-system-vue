import router from "@/router"
import { useUserStore } from "@/stores/user";
import { useMenuStore } from "@/stores/menu";
// 定义不需要验证的路径白名单
const whiteList = ['/register','/login','/404','/files/**']

// 路由全局前置守卫
router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    const menuStore = useMenuStore()

    // 尝试获取用户token
    const token = userStore.getToken
    // 检查token是否存在
    if (token) {
        //
        if (to.path === '/login' || to.path === '/') {
            next({ path: '/' })
        } else {
            // 检查用户权限数据是否已存在
            const hasRoles = userStore.getCodeList.length > 0
            if (hasRoles) {
                // 权限数据存在，直接进入
                next()
            } else {
                try {
                    // 权限数据不存在时，尝试从服务器获取用户信息和菜单数据
                    await userStore.getInfo();
                    await menuStore.getMenuList(router, userStore.getUserId);
                    //等待路由完全加载
                    next({ ...to, replace: true })
                } catch (error) {
                    //清空数据
                    localStorage.clear();
                    // 获取数据失败，跳转至登录页
                    next({path:'/login'})
                }
            }
        }
    } else {
        // 无token时，检查路径是否在白名单内
        if (whiteList.indexOf(to.path)!=-1) {
            // 在白名单内，直接进入
            next();
        } else {
            // 不在白名单内，跳转至登录页
            next({ path: '/login' })
        }
    }
})
