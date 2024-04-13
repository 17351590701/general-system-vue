import request from '@/http'
import type {SysUser, UserListParam} from './UserModel'
//新增
export const addApi = (param: SysUser) => {
    return request.post("/api/sysUser", param)
}
//用户列表
export const getListApi = (param: UserListParam) => {
    return request.get("/api/sysUser/getList", param)
}
//根据用户id查询角色
export const getRoleListApi = (userId: string) => {
    return request.get("/api/sysUser/getRoleList", {userId: userId})
}
//编辑
export const editApi = (param: SysUser) => {
    return request.put("/api/sysUser",param)
}
//删除
export const deleteApi = (userId: string) => {
    return request.delete("/api/sysUser" + "/" + userId)
}