export type OrderModel = {
    orderId: string,
    userId: string,
    nickName: string,
    goodId: string,
    goodName: string,
    buyNum: number,
    sum: number,
    address: string,
    status: number
}
// 订单查询参数
export type OrderListParam = {
    searchParam: string,
    currentPage: number,
    pageSize: number
    total: number
}
// 请求查询购物车的参数 ShopCartDto
export type ShopCartDto = {
    userId: string,
    currentPage: number,
    pageSize: number
}
//订单购买参数，用户可能修改
export type payParam = {
    buyNum: number;
    address: string;
    orderId: string;
    sum: string;
    goodId: number;
    userId: any;
    status: number
}