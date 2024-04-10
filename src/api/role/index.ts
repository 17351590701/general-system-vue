import request from '@/http'
import type {RoleListParam, SysRole} from './RoleModel'
//新增角色
export const addApi=(param:SysRole)=>{
    return request.post("/api/role",param)
}
//获取角色列表
export const getListApi=(param:RoleListParam)=>{
return request.get("/api/role/getList",param)
}
//编辑
export const editApi=(param:SysRole)=>{
    return request.put("/api/role",param)
}
//删除
export const deleteApi=(roleId:string)=>{
    return request.delete("/api/role"+"/"+roleId)
}
// export const deleteApi=(roleId:string)=>{
//     return request.delete(`api/role/${roleId}`)
// }