//定义新增商品类型
export type SysCategory={
    categoryId:string,
    categoryName:string,
    remark:string,
}
//列表
export type CategoryListParam={
    categoryName:string,
    remark:string,
    currentPage:number,
    pageSize:number,
    total:number,
    
}