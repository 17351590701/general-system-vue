//Notifition基本类型
export interface Notifition {
    notifitionId: number; //通知id
    userId: number; //通知用户id
    notifitionIcon: number; //通知类型
    notifitionTitle: string; //通知标题
    notifitionContent: string; //通知内容
    create_time: string; //通知时间
}