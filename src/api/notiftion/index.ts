import request from '@/http'
//获取通知列表
export const getNofititionList = () => {
    return request.get('/api/notifitions');
}
//删除通知
export const deleteNotifitions = (notifitionId: number) => {
    return request.delete('/api/notifitions/'+notifitionId);
}