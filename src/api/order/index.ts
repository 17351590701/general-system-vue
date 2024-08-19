import request from "@/http";
import type { OrderModel, OrderListParam } from "./OrderModel";
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
  return request.get("/api/sysOrder/suggest", { inputKey: inputKey });
};
