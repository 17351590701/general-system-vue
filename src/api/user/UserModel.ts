//定义用户数据类型
export type SysUser={
    userId:string,
    username:string,
    password:string,
    phone:string,
    email:string,
    sex:string,
    nickName:string,
    roleId:string
}
//显示列表的参数类型
export type UserListParam={
    phone:string,
    nickName:string,
    currentPage:number,
    pageSize:number,
    total:number
}