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
//菜单树参数
export type AssignParam={
    roleId:string,
    userId:string,
}
//修改密码参数
export type UpdateParam={
    userId:string,
    oldPassword:string,
    newPassword:string
}
//返回所有购物车信息
export type shopListModel={
    userId:string,
    currentPage:number,
    pageSize:number,
    total:number
}