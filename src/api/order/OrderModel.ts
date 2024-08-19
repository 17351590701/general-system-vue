export type OrderModel={
    orderId:String,
    userId:String,
    nickName:String,
    goodId:String,
    goodName:String,
    buyNum:number,
    sum:number,
    address:String,
    status:number
}
// 订单查询参数
export type OrderListParam = {
    searchParam:string,
    currentPage:number,
    pageSize:number
    total:number
}