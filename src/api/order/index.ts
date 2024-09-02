import request from "@/http";
import type {OrderModel, OrderListParam, ShopCartDto, payParam, commentParam} from "./OrderModel";
import type {UnwrapRef} from "vue";
// 新增订单：在商品页面，购买商品，生成订单
export const addOrderApi = (param: OrderModel) => {
    return request.post("/api/sysOrder/addOrder", param);
};
// 删除订单
export const deleteOrderApi = (orderId: String) => {
    return request.delete("/api/sysOrder/deleteOrder/" + orderId);
};
// 修改订单
export const updateOrderApi = (param: OrderModel) => {
    return request.put("/api/sysOrder/updateOrder", param);
};

// 获取订单列表
export const getOrderListApi = (param: OrderListParam) => {
    return request.get("/api/sysOrder/orderList", param);
};

// 获取自动补全字段
export const getOrderSuggestion = (inputKey: String) => {
    return request.get("/api/sysOrder/suggest", {inputKey: inputKey});
};

// 显示购物车：查询订单联合商品表，商品图片，显示订单状态
export const getShopCartListAPi = (shopCartDto: ShopCartDto) => {
    return request.get("/api/sysOrder/shopCartList", shopCartDto);
};
//购物车订单支付
export const shopCartPayApi = (payParam: payParam) => {
    return request.post("/api/sysOrder/shopCartPay?orderId", payParam);
};
//用户提价商品评价
export const addCommentApi = (commentParam: commentParam) => {
    return request.put("/api/sysOrder/comment", commentParam)
}
//退货退款
export const shopCartReturnApi = (orderId: string) => {
    return request.put("/api/sysOrder/return?orderId=" + orderId)
}
//批购物车量删除订单
export const deleteBatchShopCart = (orderIds: string) => {
    return request.delete("/api/sysOrder/delBatchShopCart/"+orderIds)
}