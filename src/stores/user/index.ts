import { defineStore } from 'pinia'
export const useUserStore = defineStore('user', {
    state: () => {
        return {
            userId: '',
            nickName: '',
        }
    },
    getters: {
        getUserId(state) {
            return state.userId
        },
        getNickName(state) {
            return state.nickName
        },
    },
    actions: {
        setUserId(userId: string) {
            this.userId = userId
        },
        setNickName(nickName: string) {
            this.nickName = nickName
        },
    },
    persist: {
        key: 'user',
        //存储位置
        storage: localStorage,
        //需要存储的数据
        paths: ['userId', 'nickName']
    }
})