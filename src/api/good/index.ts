import request from '@/http'
import { type GoodListParam, type GoodModel ,type GoodCondition ,type shopModel} from '@/api/good/GoodModel'
//新增
export const addGoodApi=(param:GoodModel)=>{
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
//根据商品id查询对应商品类型
export const getCategoryListApi=(goodId:string)=>{
    return request.get("/api/good/getCategoryList",{goodId:goodId})
}
//根据条件查询商品
export const getGoodConditionApi=(param:GoodCondition)=>{
    return request.get("/api/good/goodCondition",param)
}
