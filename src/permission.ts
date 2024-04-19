import router from "@/router"
import { useUserStore } from "@/stores/user";
import { useMenuStore } from "@/stores/menu";
//定义白名单：不需要验证
const whiteList = ['/login']
//路由前置守卫
router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    const menuStore = useMenuStore()

    //获取token
    const token = userStore.getToken
    //判断token是否存在
    if (token) {
        //是否从登录或首页来的，是：放行，否：从服务器获取菜单数据
        if (to.path === '/login' || to.path === '/') {
            next({ path: '/' })
        } else {
            //判断权限数据是否存在
            const hasRoles = userStore.getCodeList.length > 0
            if (hasRoles) {
                next()
            } else {  //不存在
                try {
                    //获取用户信息
                    await userStore.getInfo();
                    //获取菜单数据
                    await menuStore.getMenuList(router, userStore.getUserId);
                    //==等待路由完全挂载==
                    next({ ...to, replace: true })
                } catch (error) {
                    //清空数据
                    // localStorage.clear();
                    //跳转登录
                    next({path:'/login'})
                }
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            //在白名单中
            next();
        } else {
            //不在白名单，跳转登录
            next({ path: '/login' })
        }
    }
})