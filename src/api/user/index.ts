import request from '@/http'
import type { Login, SysUser, UserListParam ,AssignParam,UpdateParam, shopListModel} from './UserModel'
import {type shopModel } from '../good/GoodModel'
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
//退出登录
export const logoutApi=()=>{
    return request.post("/api/sysUser/logout")
}
//查询菜单树
export const getAssignTreeApi = (param:AssignParam) => {
    return request.get("/api/sysUser/getAssingTree",param)
}
//修改密码
export const updatePasswordApi = (param:UpdateParam) => {
    return request.put("/api/sysUser/updatePassword",param)
}
//获取用户信息
export const getInfoApi = (userId:string) => {
    return request.get("/api/sysUser/getInfo",{userId:userId})
}
//购物车
export const shopCartApi=(param:shopModel)=>{
    return request.post("/api/sysUser/shopCart",param)
}
//查询所有购物车商品信息
export const shopCartListApi=(param:shopListModel)=>{
    return request.get("/api/sysUser/getShopList",param)
}
//退单，根据uesrId和goodId删除
export const cancelApi=(param:shopModel)=>{
    return request.post("/api/sysUser/cancel",param)
}
// 获取验证码
export const getCaptchaImage = ()=>{
    return request.get("/api/sysUser/getImage")
}
// 获取当前用户余额
export const getBalance = ()=>{
    return request.get("/api/sysUser/getBalance")
}