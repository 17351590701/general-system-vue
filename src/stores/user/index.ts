import { defineStore } from 'pinia'
export const useUserStore = defineStore('user', {
    state: () => {
        return {
            userId: '',
            nickName: '',
            token:'',
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
    },
    persist: {
        key: 'user',
        //存储位置
        storage: localStorage,
        //需要存储的数据
        paths: ['userId', 'nickName','token']
    }
})