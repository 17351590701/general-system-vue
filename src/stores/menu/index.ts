import {defineStore} from 'pinia'
//定义一个store
export const useMenuStore = defineStore('menuStore', {
    state (){
        return {
            collapse: false
        }
    },
    getters: {
        getCollapse(state) {
            return state.collapse
        }
    },
    actions: {
        setCollapse(collapse: boolean) {
            this.collapse = collapse
        }
    },
    persist: {
        //存储的key
        key:'menu-collapse',
        //存储位置
        storage:localStorage,
        //需要存储的数据
        paths:['collapse']
    }
})