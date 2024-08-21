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
    searchParam:String,
    currentPage:number,
    pageSize:number
    total:number
}
// TODO 请求查询购物车的参数 ShopCartDto
export type ShopCartDto = {
    userId:String,
    currentPage:number,
    pageSize:number
}