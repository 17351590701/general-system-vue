import { useUserStore } from "@/stores/user";
export default function hasPerm(value:any){
    const userStore = useUserStore();
    //当前用户拥有的权限字符
    const permissions = userStore.getCodeList;
    if(value&&value instanceof Array &&value.length>0){
        //按钮所需权限
        const permissionRoles =value
        //判断是否存在按钮所需权限
        const hasPermission =permissions.some(role=>{
            return permissionRoles.includes(role)
        })
        return hasPermission
    }else{
        throw new Error('v-if="global.$hasPerm("[\'add\',\'edit\']")')
    }

}