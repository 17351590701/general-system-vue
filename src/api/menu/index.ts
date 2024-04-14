import request from '@/http'
import type {SysMenu} from "@/api/menu/MenuModel";
//获取上级菜单
export const getParentMenuApi = () => {
  return request.get("/api/sysMenu/getParent")
}
//新增
export const addMenuApi=(param:SysMenu)=>{
  return request.post("api/sysMenu",param)
}
//列表
export const getListApi=()=>{
  return request.get("api/sysMenu/getList")
}