import request from '@/http'
import { type GoodListParam, type GoodModel } from '@/api/good/GoodModel'
//新增
export const addGoodApi=(param:GoodModel)=>{
    console.log(param);
    return request.post("/api/good",param)
}
//删除
export const deleteGoodApi=(goodId:string)=>{
    return request.delete("/api/good/"+goodId)
}
//修改
export const editGoodApi=(param:GoodModel)=>{
    return request.put("/api/good",param)
}
//查询
export const getListApi=(param:GoodListParam)=>{
    return request.get("/api/good/getList",param)
}
