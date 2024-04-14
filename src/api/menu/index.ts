import request from '@/http'
//获取上级菜单
export const getParentMenuApi = () => {
  return request.get("/api/sysMenu/getParent")
}