import request from '@/http'
import type {SysMenu} from "@/api/menu/MenuModel";
//获取上级菜单
export const getParentMenuApi = () => {
  return request.get("/api/sysMenu/getParent")
}
//新增
export const addMenuApi=(param:SysMenu)=>{
  return request.post("/api/sysMenu",param)
}
//列表
export const getListApi=()=>{
  return request.get("/api/sysMenu/getList")
}
//编辑
export const editApi=(param:SysMenu)=>{
  return request.put("/api/sysMenu",param)
}
//删除
export const deleteApi=(menuId:string)=>{
  return request.delete("/api/sysMenu"+"/"+menuId)
}
//获取动态路由菜单数据
export const getMenuListApi=(userId:string)=>{
  return request.get("/api/sysMenu/getMenuList",{userId:userId})
}