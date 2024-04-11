import request from '@/http'
import type {User} from './UserModel'
//新增
export const addApi=(param:User)=>{
    return request.post("/api/sysUser",param)
}