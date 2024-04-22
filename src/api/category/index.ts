import request from '@/http'
import type{CategoryListParam,SysCategory} from './CategoryModel'
//查询列表
export const getListApi=(param:CategoryListParam)=>{
    return request.get("/api/category/getList",param)
}
//新增
export const addApi=(param:SysCategory)=>{
    return request.post("/api/category",param)
}
//修改
export const editApi=(param:SysCategory)=>{
    return request.put("/api/category",param)
}
//删除
export const deleteApi=(categoryId:string)=>{
    return request.delete("/api/category/"+categoryId)
}