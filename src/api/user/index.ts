import request from '@/http'
import type { Login, SysUser, UserListParam ,AssignParam,UpdateParam} from './UserModel'
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
    return request.get("/api/sysUser/getRoleList", { userId: userId })
}
//编辑
export const editApi = (param: SysUser) => {
    return request.put("/api/sysUser", param)
}
//删除
export const deleteApi = (userId: string) => {
    return request.delete("/api/sysUser" + "/" + userId)
}
//重置密码
export const resetPasswordApi = (param: { userId: string }) => {
    return request.post("/api/sysUser/resetPassword", param)
}
//登录
export const loginApi = (param:Login) => {
    return request.post("/api/sysUser/login", param)
}
//查询菜单树
export const getAssignTreeApi = (param:AssignParam) => {
    return request.get("/api/sysUser/getAssingTree",param)
}
//修改密码
export const updatePasswordApi = (param:UpdateParam) => {
    return request.put("/api/sysUser/updatePassword",param)
}