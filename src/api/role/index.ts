import request from '@/http'
import type { SysRole } from './RoleModel'
//新增角色
export const addApi=(parm:SysRole)=>{
    return request.post("/api/role",parm)
}
