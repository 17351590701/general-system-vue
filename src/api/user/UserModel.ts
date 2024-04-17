//定义新增用户数据类型
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
//显示列表查询的参数类型
export type UserListParam={
    phone:string,
    nickName:string,
    currentPage:number,
    pageSize:number,
    total:number
}
//登录
export type Login={
    username:string,
    password:string,
    code:string
}