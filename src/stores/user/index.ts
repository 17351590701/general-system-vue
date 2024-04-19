import { defineStore } from 'pinia'
import { getInfoApi } from '@/api/user'

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            userId: '',
            nickName: '',
            token:'',
            //menu的code，sys::manager
            codeList:[]
        }
    },
    getters: {
        getUserId(state) {
            return state.userId
        },
        getNickName(state) {
            return state.nickName
        },
        getToken(state) {
            return state.token
        },
        getCodeList(state){
            return state.codeList
        }
    },
    actions: {
        setUserId(userId: string) {
            this.userId = userId
        },
        setNickName(nickName: string) {
            this.nickName = nickName
        },
        setToken(token: string) {
            this.token = token
        },
        getInfo(){
            return new Promise((resolve,reject)=>{
                getInfoApi(this.userId).then(res=>{
                    if(res&&res.code==200){
                        this.codeList = res.data.permissons
                    }
                    resolve(this.codeList)
                }).catch(err=>{
                    reject(err)
                })
            })
        }
    },
    persist: {
        key: 'user',
        //存储位置
        storage: localStorage,
        //需要存储的数据
        paths: ['userId', 'nickName','token']
    }
})