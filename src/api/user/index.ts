import request from '@/http'
import type {SysUser, UserListParam} from './UserModel'
//新增
export const addApi=(param:SysUser)=>{
    return request.post("/api/sysUser",param)
}
//列表
export const getListApi=(param:UserListParam)=>{
    return request.get("/api/sysUser/getList",param)
}
//删除
export const deleteApi=(userId:string)=>{
    return request.delete("/api/sysUser"+"/"+userId)
}