import {defineStore} from 'pinia'
//定义选项卡数据
export type Tab = {
    title:string;
    path:string;
}
//定义state的数据类型
export type TabState={
    tabList:Tab[]
}
//定义store
export const useTabStore = defineStore('tabs', {
    state:():TabState=>{
        return{
            tabList:[]
        }
    },
    getters:{
      getTab(state){
          return state.tabList
      }
    },
    actions:{
        //添加选项卡数据tab
        addTab(tab:Tab){
            //查找数组每一项，判断选项卡是否重复
            if(this.tabList.some(item=>item.path===tab.path)) return;
            if(tab.path==='/dashboard'){
                //如果是首页，添加到第一个
                this.tabList.unshift(tab)
            }else{
            //否则
            this.tabList.push(tab)
            }
        }
    },
    //选项卡持久化，使页面刷新关闭时，tabList的值不会清空
    persist: {
        //存储的key
        key:'tabsList',
        //存储位置
        storage:localStorage,
        //需要存储的数据
        paths:['tabList']
    }


})