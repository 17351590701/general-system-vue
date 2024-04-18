//角色数据类型
export type SysRole={
    roleId:string,
    roleName:string,
    remark:string,
}
//列表查询参数
export type RoleListParam={
    currentPage:number,
    pageSize:number,
    roleName:string,
    total:number
}
//分配菜单数据类型
export type SaveMenuParam={
    roleId:string,
    list:Array<string>
}