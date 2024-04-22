import { useUserStore } from "@/stores/user";
import type { Directive } from "vue";

/**
 * 自定义按钮权限指令，用于根据用户权限控制按钮的可见性。
 */
export const permission: Directive = {
    mounted(el, binding) {
        // 获取用户权限信息
        const userStore = useUserStore()
        // 按钮上配置的权限字段
        const { value } = binding
        // 当前用户拥有的所有权限字段
        const permission = userStore.getCodeList
        
        // 检查按钮配置的权限是否在当前用户权限范围内
        if (value && value instanceof Array && value.length > 0) {
            const permissionRoles = value;
            const hasPermission = permission.some((role) => {
                return permissionRoles.includes(role)
            })
            // 如果用户没有对应权限，则隐藏按钮
            if(!hasPermission){
                el.style.display='none'
            }
        } else {
            // 如果未正确配置按钮权限字段，抛出错误
            throw new Error("按钮权限的传递方式v-permission=['sys:role:add']")
        }
    }
}